const BACKEND    = "https://web-production-189e9.up.railway.app";
const CLOUD_NAME = "de5jdqth5";
const PRESET     = "clipgen_unsigned";
const VIZARD_QUERY = "https://elb.vizard.ai/gwapi/v1/video/queryProjectVideo";
const VIZARD_KEY   = "76f3b8d194804562a7fb22584dbd2361";

export async function uploadAndProcess(file, onProgress) {
  const jobId = crypto.randomUUID();

  // STEP 1: Upload directly from browser to Cloudinary (unsigned)
  onProgress({ stage: "uploading", percent: 15, message: "Uploading video..." });

  const form = new FormData();
  form.append("file", file);
  form.append("upload_preset", PRESET);
  form.append("public_id", `clipgen_${jobId}`);
  form.append("resource_type", "video");

  let cloudinaryUrl;
  try {
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/video/upload`,
      { method: "POST", body: form }
    );
    const data = await res.json();
    console.log("Cloudinary:", data);
    if (!data.secure_url) throw new Error(data.error?.message || "Upload failed");
    cloudinaryUrl = data.secure_url;
    console.log("Cloudinary URL:", cloudinaryUrl);
  } catch (e) {
    throw new Error("Video upload failed: " + e.message);
  }

  onProgress({ stage: "processing", percent: 35, message: "Sending to AI engine..." });

  // STEP 2: Send Cloudinary URL to Railway → Railway calls Vizard
  let projectId;
  try {
    const res = await fetch(`${BACKEND}/start`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: cloudinaryUrl, job_id: jobId }),
    });
    const data = await res.json();
    console.log("Railway /start:", data);
    if (data.error) throw new Error(data.error);
    projectId = data.project_id;
  } catch (e) {
    throw new Error("AI start failed: " + e.message);
  }

  onProgress({ stage: "processing", percent: 45, message: "AI is analysing your video..." });

  // STEP 3: Poll Railway /status until clips are ready
  for (let i = 0; i < 60; i++) {
    await new Promise(r => setTimeout(r, 8000));
    const pct = Math.min(45 + i * 1.5, 92);
    onProgress({ stage: "processing", percent: pct, message: `Generating clips... (${Math.round(pct)}%)` });

    try {
      const res = await fetch(`${BACKEND}/status/${jobId}`);
      const data = await res.json();
      console.log(`Poll ${i}: status=${data.status}, clips=${data.clips?.length}`);

      if (data.status === "done" && data.clips?.length > 0) {
        onProgress({ stage: "done", percent: 100, message: "Clips ready!" });
        return data.clips;
      }
      if (data.status === "failed") {
        throw new Error(data.error || "Processing failed");
      }
    } catch (e) {
      if (e.message.includes("failed")) throw e;
      console.warn("Poll error:", e);
    }
  }

  throw new Error("Processing timed out. Please try a shorter video.");
}

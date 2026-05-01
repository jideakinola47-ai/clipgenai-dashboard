// Direct browser → Cloudinary → Vizard (no Railway needed)
const CLOUD_NAME   = "de5jdqth5";
const PRESET       = "clipgen_unsigned";
const VIZARD_KEY   = "76f3b8d194804562a7fb22584dbd2361";
const VIZARD_CREATE = "https://elb.vizard.ai/gwapi/v1/video/createProject";
const VIZARD_QUERY  = "https://elb.vizard.ai/gwapi/v1/video/queryProjectVideo";

export async function uploadAndProcess(file, onProgress) {
  // STEP 1: Upload directly from browser to Cloudinary
  onProgress({ stage: "uploading", percent: 15, message: "Uploading video..." });

  const jobId = Math.random().toString(36).slice(2);
  const form  = new FormData();
  form.append("file", file);
  form.append("upload_preset", PRESET);
  form.append("public_id", `clipgen_${jobId}`);
  form.append("resource_type", "video");

  let videoUrl;
  try {
    const res  = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/video/upload`, {
      method: "POST", body: form
    });
    const data = await res.json();
    console.log("Cloudinary response:", data);
    if (!data.secure_url) throw new Error(data.error?.message || "Cloudinary upload failed");
    videoUrl = data.secure_url;
    console.log("Video URL:", videoUrl);
  } catch (e) {
    throw new Error("Upload failed: " + e.message);
  }

  onProgress({ stage: "processing", percent: 35, message: "Sending to Vizard AI..." });

  // STEP 2: Call Vizard directly from browser
  let projectId;
  try {
    const res = await fetch(VIZARD_CREATE, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${VIZARD_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        videoUrl,
        preferLength: "[30,60]",
        lang: "en",
        videoType: 1
      })
    });
    const data = await res.json();
    console.log("Vizard create:", data);

    if (data.code === 2000 && data.projectId) {
      projectId = data.projectId;
    } else {
      throw new Error(`Vizard error code ${data.code}: ${JSON.stringify(data)}`);
    }
  } catch (e) {
    throw new Error("AI failed: " + e.message);
  }

  onProgress({ stage: "processing", percent: 45, message: "AI is clipping your video..." });

  // STEP 3: Poll Vizard directly from browser (no Railway)
  for (let i = 0; i < 60; i++) {
    await new Promise(r => setTimeout(r, 8000));
    const pct = Math.min(45 + i * 1.5, 92);
    onProgress({ stage: "processing", percent: pct, message: `Generating clips... ${Math.round(pct)}%` });

    try {
      const res = await fetch(VIZARD_QUERY, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${VIZARD_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ projectId })
      });
      const data = await res.json();
      console.log(`Poll ${i}: code=${data.code}, videos=${data.videos?.length}`);

      if (data.code === 2000 && data.videos?.length > 0) {
        onProgress({ stage: "done", percent: 100, message: "Clips ready!" });
        return data.videos.map((v, i) => ({
          id: i + 1,
          title: v.title || v.videoTitle || `Clip ${i + 1}`,
          score: Math.round(parseFloat(v.viralScore || 7) * 10),
          duration: Math.round((v.videoMsDuration || 30000) / 1000),
          url: v.videoUrl || v.url || "",
          thumbnail: v.coverUrl || v.thumbnail || "",
          reason: v.viralReason || "High viral potential"
        }));
      }
      // code 1000 = still processing, keep waiting
    } catch (e) {
      console.warn("Poll error:", e);
    }
  }

  throw new Error("Processing timed out. Please try a shorter video.");
}

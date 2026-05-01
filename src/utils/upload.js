const BACKEND = "https://web-production-189e9.up.railway.app";

export async function uploadAndProcess(file, onProgress) {
  onProgress({ stage: "uploading", percent: 10, message: "Uploading video..." });

  const form = new FormData();
  form.append("file", file);

  let jobId;
  try {
    const res  = await fetch(`${BACKEND}/upload`, { method: "POST", body: form });
    const data = await res.json();
    if (data.error) throw new Error(data.error);
    jobId = data.job_id;
    console.log("Job started:", jobId);
  } catch (e) {
    throw new Error("Upload failed: " + e.message);
  }

  onProgress({ stage: "processing", percent: 35, message: "AI is analysing your video..." });

  for (let i = 0; i < 60; i++) {
    await new Promise(r => setTimeout(r, 8000));
    const pct = Math.min(35 + i * 1.5, 92);
    onProgress({ stage: "processing", percent: pct, message: `Generating clips... ${Math.round(pct)}%` });

    try {
      const res  = await fetch(`${BACKEND}/status/${jobId}`);
      const data = await res.json();
      console.log(`Poll ${i}:`, data.status, data.clips?.length);
      if (data.status === "done" && data.clips?.length > 0) {
        onProgress({ stage: "done", percent: 100, message: "Clips ready!" });
        return data.clips;
      }
      if (data.status === "failed") throw new Error(data.error || "Processing failed");
    } catch (e) {
      if (e.message.includes("failed")) throw e;
    }
  }
  throw new Error("Timed out. Please try a shorter video.");
}

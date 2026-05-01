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

  onProgress({ stage: "processing", percent: 30, message: "AI is analysing your video..." });

  // Poll for up to 25 minutes (180 polls × 8 seconds)
  for (let i = 0; i < 180; i++) {
    await new Promise(r => setTimeout(r, 8000));

    // Keep percent between 30-95, never show 100 until actually done
    const pct = Math.min(30 + i * 0.36, 95);
    onProgress({ 
      stage: "processing", 
      percent: pct, 
      message: `Generating clips... ${Math.round(pct)}%` 
    });

    try {
      const res  = await fetch(`${BACKEND}/status/${jobId}`);
      const data = await res.json();
      console.log(`Poll ${i}: status=${data.status}, clips=${data.clips?.length}`);

      if (data.status === "done" && data.clips?.length > 0) {
        onProgress({ stage: "done", percent: 100, message: "Clips ready!" });
        return data.clips;
      }
      if (data.status === "failed") {
        throw new Error(data.error || "Processing failed");
      }
      // status === "processing" → keep waiting
    } catch (e) {
      if (e.message.includes("failed") || e.message.includes("Processing")) throw e;
      console.warn("Poll error (will retry):", e);
    }
  }

  throw new Error("Processing timed out after 25 minutes. Please try again.");
}

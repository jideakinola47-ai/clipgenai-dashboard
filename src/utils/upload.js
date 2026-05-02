const CLOUDINARY_CLOUD_NAME =
  import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "de5jdqth5";

const CLOUDINARY_UPLOAD_PRESET =
  import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "";

const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

const BACKEND_PROCESS_ENDPOINT = `${BACKEND_URL}/process-video`;

// ----------------------------
// Upload to Cloudinary
// ----------------------------
async function uploadVideoToCloudinary(file, onProgress) {
  if (!CLOUDINARY_UPLOAD_PRESET) {
    throw new Error("Missing unsigned upload preset.");
  }

  onProgress({
    stage: "uploading",
    percent: 15,
    message: "Uploading video...",
  });

  const form = new FormData();
  form.append("file", file);
  form.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/video/upload`,
    {
      method: "POST",
      body: form,
    }
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error?.message || "Cloudinary upload failed");
  }

  if (!data.secure_url) {
    throw new Error("No secure_url returned");
  }

  onProgress({
    stage: "uploading",
    percent: 35,
    message: "Upload complete",
  });

  return data.secure_url;
}

// ----------------------------
// Poll Vizard status
// ----------------------------
async function pollProjectStatus(projectId, onProgress) {
  while (true) {
    const res = await fetch(`${BACKEND_URL}/project-status/${projectId}`);
    const data = await res.json();

    console.log("Polling response:", JSON.stringify(data, null, 2));

    // Still processing
    if (data?.code === 1000) {
      onProgress({ stage: "processing", percent: 70, message: "Processing video..." });
      await new Promise((r) => setTimeout(r, 5000));
      continue;
    }

    // Done! ✅ Vizard returns "videos" array
    if (data?.code === 2000) {
      const clips = data?.videos;
      if (clips && clips.length > 0) {
        return clips;
      }
      onProgress({ stage: "processing", percent: 85, message: "Almost done..." });
      await new Promise((r) => setTimeout(r, 5000));
      continue;
    }

    // Error
    throw new Error(`Vizard error code: ${data?.code} - ${data?.errMsg || "Unknown error"}`);
  }
}

// ----------------------------
// Main flow
// ----------------------------
export async function uploadAndProcess(file, onProgress) {
  // 1. Upload to Cloudinary
  const secureUrl = await uploadVideoToCloudinary(file, onProgress);

  onProgress({
    stage: "processing",
    percent: 45,
    message: "Sending video to backend...",
  });

  // 2. Send to backend
  console.log("Calling backend at:", BACKEND_PROCESS_ENDPOINT);
  console.log("With URL:", secureUrl);

  const res = await fetch(BACKEND_PROCESS_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ secure_url: secureUrl }),
  });

  const text = await res.text();

  if (!res.ok) {
    throw new Error(`Backend error ${res.status}: ${text}`);
  }

  let data;
  try {
    data = JSON.parse(text);
  } catch (e) {
    throw new Error(`Backend returned invalid JSON:\n${text}`);
  }

  if (!data.projectId) {
    throw new Error(`No projectId returned. Got: ${JSON.stringify(data)}`);
  }

  // 3. Poll until clips are ready
  const clips = await pollProjectStatus(data.projectId, onProgress);

  onProgress({
    stage: "done",
    percent: 100,
    message: "Clips ready!",
  });

  return clips;
}
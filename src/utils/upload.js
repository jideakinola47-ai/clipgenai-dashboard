// utils/upload.js
const API_BASE_URL = 'https://obscure-space-pancake-x59gxvw69545c6qr5-8000.app.github.dev';

export async function uploadAndProcess(videoUrl, videoType = 2, subtitleLang = 'auto',onProgress) {
  try {
    console.log('Processing video URL:', videoUrl);
    console.log('Video type:', videoType);
    
    onProgress({ stage: "auth", percent: 10, message: "Authenticating..." });
    
    const token = localStorage.getItem('access_token');
    if (!token) {
      throw new Error('No authentication token found. Please login again.');
    }
    
    // Send directly to your backend (which will use Vizard)
    onProgress({ stage: "processing", percent: 30, message: "Sending to Clip Gen AI..." });
    
    const requestBody = {
      video_url: videoUrl,
      video_type: videoType,
      lang: subtitleLang,
      subtitle_switch: 1,
    };
    
    // Add ext only for direct URLs (videoType = 1)
    if (videoType === 1) {
      requestBody.ext = "mp4";
    }
    
    console.log('Request body:', requestBody);
    
    const processResponse = await fetch(`${API_BASE_URL}/process-video`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(requestBody),
    });
    
    if (!processResponse.ok) {
      const errorData = await processResponse.json();
      console.error('Processing error:', errorData);
      throw new Error(errorData.detail || 'Processing failed');
    }
    
    const processData = await processResponse.json();
    console.log('Processing started:', processData);
    
    if (processData.is_duplicate) {
      onProgress({ stage: "complete", percent: 100, message: "Video already processed!" });
      
      // Get existing clips
      const clipsResponse = await fetch(`${API_BASE_URL}/video-clips/${processData.video_id}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      
      if (!clipsResponse.ok) {
        throw new Error('Failed to fetch existing clips');
      }
      
      const clipsData = await clipsResponse.json();
      console.log('Existing clips:', clipsData);
      
      return clipsData.clips.map((clip, index) => ({
        videoUrl: clip.clip_url,
        videoId: clip.id,
        duration: clip.clip_duration,
        transcript: clip.transcript,
        viralScore: clip.viral_score ? parseFloat(clip.viral_score) * 10 : Math.floor(Math.random() * 30 + 70),
        title: clip.title || `Clip ${index + 1}`,
        clipEditorUrl: clip.clip_editor_url,
      }));
    }
    
    // Poll for status
    onProgress({ stage: "polling", percent: 60, message: "Clip Gen AI is generating clips..." });
    
    let attempts = 0;
    const maxAttempts = 50; // Increased for longer videos
    let completed = false;
    let clipsData = null;
    
    while (attempts < maxAttempts && !completed) {
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      try {
        const statusResponse = await fetch(`${API_BASE_URL}/project-status/${processData.project_id}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        
        if (statusResponse.ok) {
          const status = await statusResponse.json();
          console.log(`Status (${attempts + 1}):`, status.code);
          
          if (status.code === 2000 && status.videos && status.videos.length > 0) {
            completed = true;
            clipsData = status;
            break;
          } else if (status.code === 2000) {
            console.log('Project complete but no videos yet, still processing...');
          }
        }
      } catch (err) {
        console.warn('Status check failed:', err);
      }
      
      attempts++;
      onProgress({ 
        stage: "polling", 
        percent: 60 + (attempts / maxAttempts) * 35, 
        message: `Generating clips... (${attempts}/${maxAttempts})` 
      });
    }
    
    onProgress({ stage: "complete", percent: 100, message: "Complete!" });
    
    if (!clipsData || !clipsData.videos || clipsData.videos.length === 0) {
      throw new Error('No clips were generated. The video might be too short or unsupported.');
    }
    
    console.log('Clips generated:', clipsData.videos.length);
    
    // Transform clips for frontend
    return clipsData.videos.map((clip, index) => ({
      videoUrl: clip.videoUrl,
      videoId: clip.videoId,
      duration: clip.videoMsDuration,
      transcript: clip.transcript,
      viralScore: clip.viralScore ? parseFloat(clip.viralScore) * 10 : Math.floor(Math.random() * 30 + 70),
      title: clip.title || `Clip ${index + 1}`,
      clipEditorUrl: clip.clipEditorUrl,
      viralReason: clip.viralReason,
    }));
    
  } catch (error) {
    console.error('Processing error:', error);
    throw new Error(error.message || 'Processing failed. Please try again.');
  }
}
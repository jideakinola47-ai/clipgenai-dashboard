// utils/upload.js  — ClipGen.AI v2 (OpenAI + FFmpeg backend)
const API = 'https://web-production-189e9.up.railway.app'

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function getToken() {
  const t = localStorage.getItem('access_token')
  if (!t) throw new Error('Not authenticated. Please log in.')
  return t
}

function authHeader() {
  return { Authorization: `Bearer ${getToken()}` }
}

async function pollStatus(videoId, onProgress, maxWait = 600_000) {
  const start   = Date.now()
  const INTERVAL = 4000
  const STATUS_MSG = {
    queued:           'Queued — waiting for worker...',
    extracting_audio: 'Extracting audio track...',
    transcribing:     'Transcribing speech with Whisper AI...',
    analyzing:        'GPT-4o finding viral moments...',
    cutting_clips:    'FFmpeg cutting & formatting clips...',
    completed:        'Done! Loading your clips...',
    failed:           'Processing failed',
  }

  while (Date.now() - start < maxWait) {
    await new Promise(r => setTimeout(r, INTERVAL))

    const res = await fetch(`${API}/video-status/${videoId}`, { headers: authHeader() })
    if (!res.ok) throw new Error('Status check failed')
    const data = await res.json()

    onProgress({
      stage:   data.status,
      percent: data.progress || 0,
      message: STATUS_MSG[data.status] || data.status,
    })

    if (data.status === 'completed') {
      return data.clips || []
    }
    if (data.status === 'failed') {
      throw new Error(data.error || 'Processing failed. Try a different video.')
    }
  }
  throw new Error('Processing timed out. Please try again.')
}

function normalizeClips(clips) {
  return clips.map((c, i) => ({
    videoUrl:      c.clip_url,
    videoId:       c.id,
    duration:      c.clip_duration,
    transcript:    c.transcript || '',
    viralScore:    c.viral_score ? parseFloat(c.viral_score) * 10 : 75,
    title:         c.title || `Clip ${i + 1}`,
    viralReason:   c.viral_reason || '',
    startTime:     c.start_time,
    endTime:       c.end_time,
  }))
}

// ─── UPLOAD FILE ─────────────────────────────────────────────────────────────
export async function uploadVideoFile(file, lang = 'auto', onProgress) {
  onProgress({ stage: 'uploading', percent: 5, message: 'Uploading video...' })

  const form = new FormData()
  form.append('file', file)
  form.append('lang', lang)

  const res = await fetch(`${API}/upload-video`, {
    method:  'POST',
    headers: authHeader(),
    body:    form,
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Upload failed' }))
    throw new Error(err.detail || 'Upload failed')
  }

  const { video_id } = await res.json()
  onProgress({ stage: 'queued', percent: 10, message: 'Upload complete. Processing started...' })

  const rawClips = await pollStatus(video_id, onProgress)
  onProgress({ stage: 'completed', percent: 100, message: 'Clips ready!' })
  return normalizeClips(rawClips)
}

// ─── PROCESS URL ─────────────────────────────────────────────────────────────
export async function uploadAndProcess(videoUrl, _videoType = 2, lang = 'auto', onProgress) {
  onProgress({ stage: 'submitting', percent: 5, message: 'Submitting video URL...' })

  const res = await fetch(`${API}/process-url`, {
    method:  'POST',
    headers: { ...authHeader(), 'Content-Type': 'application/json' },
    body:    JSON.stringify({ video_url: videoUrl, lang }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Submission failed' }))
    throw new Error(err.detail || 'Submission failed')
  }

  const { video_id } = await res.json()
  onProgress({ stage: 'queued', percent: 10, message: 'Submitted. Processing started...' })

  const rawClips = await pollStatus(video_id, onProgress)
  onProgress({ stage: 'completed', percent: 100, message: 'Clips ready!' })
  return normalizeClips(rawClips)
}

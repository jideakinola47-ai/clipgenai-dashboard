import { useState, useRef } from 'react'

const BACKEND = 'https://web-production-189e9.up.railway.app'

const STYLES = ['Motivational','Educational','Funny & Entertainment','Business & Sales','Interview & Podcast','News & Commentary','Storytelling']
const LANGS = ['English','Lithuanian','German','French','Spanish','Polish','Russian','Italian','Portuguese','Dutch','Swedish','Norwegian','Danish','Finnish','Japanese','Chinese','Korean','Arabic','Turkish','Hindi']
const PLATFORMS = ['TikTok','Instagram Reels','YouTube Shorts']

const STEPS = ['Uploading','Transcribing','Analyzing','Cutting clips','Done']

function ScoreBadge({ score }) {
  const color = score >= 85 ? '#16a34a' : score >= 70 ? '#ca8a04' : '#dc2626'
  return (
    <span style={{
      fontSize: 11, fontWeight: 600, color,
      background: color + '15', borderRadius: 4,
      padding: '2px 6px', letterSpacing: '0.3px'
    }}>{score}</span>
  )
}

export default function Dashboard({ setClips, setPage }) {
  const [file, setFile] = useState(null)
  const [drag, setDrag] = useState(false)
  const [style, setStyle] = useState('Motivational')
  const [lang, setLang] = useState('English')
  const [platforms, setPlatforms] = useState(['TikTok'])
  const [step, setStep] = useState(-1)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)
  const inputRef = useRef()

  const togglePlatform = p => setPlatforms(prev =>
    prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]
  )

  const handleFile = f => {
    if (!f) return
    if (f.size > 500 * 1024 * 1024) { setError('File must be under 500MB'); return }
    setFile(f); setError(''); setStep(-1); setDone(false)
  }

  const handleDrop = e => {
    e.preventDefault(); setDrag(false)
    handleFile(e.dataTransfer.files[0])
  }

  const pollStatus = async (jobId) => {
    const stepMap = { uploading:0, transcribing:1, scoring:2, cutting:3, done:4, failed:-1 }
    let attempts = 0
    while (attempts < 200) {
      await new Promise(r => setTimeout(r, 3000))
      attempts++
      try {
        const res = await fetch(`${BACKEND}/status/${jobId}`)
        if (!res.ok) continue
        const data = await res.json()
        const s = stepMap[data.status] ?? 0
        setStep(s)
        setProgress(data.progress || 0)
        if (data.status === 'done') return data
        if (data.status === 'failed') throw new Error(data.error || 'Processing failed')
      } catch(e) {
        if (e.message?.includes('failed') || e.message?.includes('Processing')) throw e
      }
    }
    throw new Error('Timed out. Try a shorter video.')
  }

  const generate = async () => {
    if (!file) { setError('Please select a video file first'); return }
    setError(''); setStep(0); setProgress(5); setDone(false)
    try {
      const form = new FormData()
      form.append('file', file)
      form.append('style', style)
      form.append('subtitle_language', lang)
      const res = await fetch(`${BACKEND}/upload`, { method: 'POST', body: form })
      if (!res.ok) throw new Error('Upload failed. Please try again.')
      const { job_id } = await res.json()
      setStep(1)
      const data = await pollStatus(job_id)
      setClips(data.clips || [])
      setStep(4); setDone(true)
      setTimeout(() => setPage('clips'), 1200)
    } catch(e) {
      setError(e.message || 'Something went wrong. Please try again.')
      setStep(-1)
    }
  }

  const processing = step >= 0 && step < 4

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '36px 24px' }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.5px', marginBottom: 4 }}>
          New project
        </h1>
        <p style={{ color: '#888', fontSize: 13.5 }}>
          Upload a video and AI will find the best viral moments automatically.
        </p>
      </div>

      {/* Upload zone */}
      <div
        onClick={() => !processing && inputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDrag(true) }}
        onDragLeave={() => setDrag(false)}
        onDrop={handleDrop}
        style={{
          border: `2px dashed ${drag ? '#5b4cf5' : file ? '#16a34a' : '#d4d0c8'}`,
          borderRadius: 12,
          padding: '32px 24px',
          textAlign: 'center',
          background: drag ? '#f0eeff' : file ? '#f0fdf4' : '#fafaf8',
          cursor: processing ? 'default' : 'pointer',
          transition: 'all 0.2s',
          marginBottom: 20,
        }}
      >
        <input ref={inputRef} type="file" accept="video/*" style={{ display: 'none' }}
          onChange={e => handleFile(e.target.files[0])} />
        {file ? (
          <div>
            <div style={{ fontSize: 28, marginBottom: 8 }}>✓</div>
            <div style={{ fontWeight: 500, fontSize: 14 }}>{file.name}</div>
            <div style={{ color: '#888', fontSize: 12.5, marginTop: 4 }}>
              {(file.size / 1024 / 1024).toFixed(1)} MB — Ready to process
            </div>
            {!processing && (
              <button onClick={e => { e.stopPropagation(); setFile(null) }} style={{
                marginTop: 10, fontSize: 12, color: '#888', background: 'none',
                border: '1px solid #ddd', borderRadius: 6, padding: '4px 12px'
              }}>Remove</button>
            )}
          </div>
        ) : (
          <div>
            <div style={{ fontSize: 32, marginBottom: 10, color: '#bbb' }}>↑</div>
            <div style={{ fontWeight: 500, fontSize: 14, marginBottom: 4 }}>
              Drop your video here or <span style={{ color: '#5b4cf5' }}>browse</span>
            </div>
            <div style={{ color: '#aaa', fontSize: 12 }}>MP4, MOV, AVI · Max 500MB · Max 60 min</div>
          </div>
        )}
      </div>

      {/* Settings row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 20 }}>
        <div>
          <label style={{ fontSize: 12, fontWeight: 500, color: '#555', display: 'block', marginBottom: 6 }}>
            CONTENT STYLE
          </label>
          <select value={style} onChange={e => setStyle(e.target.value)} style={{
            width: '100%', padding: '9px 12px', borderRadius: 8,
            border: '1px solid #e0ddd6', background: '#fff',
            fontSize: 13.5, color: '#1a1a1a', outline: 'none',
          }}>
            {STYLES.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label style={{ fontSize: 12, fontWeight: 500, color: '#555', display: 'block', marginBottom: 6 }}>
            SUBTITLE LANGUAGE
          </label>
          <select value={lang} onChange={e => setLang(e.target.value)} style={{
            width: '100%', padding: '9px 12px', borderRadius: 8,
            border: '1px solid #e0ddd6', background: '#fff',
            fontSize: 13.5, color: '#1a1a1a', outline: 'none',
          }}>
            {LANGS.map(l => <option key={l}>{l}</option>)}
          </select>
        </div>
      </div>

      {/* Platforms */}
      <div style={{ marginBottom: 24 }}>
        <label style={{ fontSize: 12, fontWeight: 500, color: '#555', display: 'block', marginBottom: 8 }}>
          TARGET PLATFORMS
        </label>
        <div style={{ display: 'flex', gap: 8 }}>
          {PLATFORMS.map(p => (
            <button key={p} onClick={() => togglePlatform(p)} style={{
              padding: '7px 16px', borderRadius: 20,
              border: `1px solid ${platforms.includes(p) ? '#5b4cf5' : '#ddd'}`,
              background: platforms.includes(p) ? '#f0eeff' : '#fff',
              color: platforms.includes(p) ? '#5b4cf5' : '#666',
              fontSize: 13, fontWeight: platforms.includes(p) ? 500 : 400,
              transition: 'all 0.15s',
            }}>{p}</button>
          ))}
        </div>
      </div>

      {/* Progress */}
      {processing && (
        <div style={{
          background: '#fff', border: '1px solid #e8e5e0',
          borderRadius: 12, padding: '20px 24px', marginBottom: 20,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontSize: 13.5, fontWeight: 500 }}>
              {STEPS[step] || 'Processing'}...
            </span>
            <span style={{ fontSize: 13, color: '#888' }}>{progress}%</span>
          </div>
          <div style={{ height: 4, background: '#f0ede8', borderRadius: 2 }}>
            <div style={{
              height: '100%', borderRadius: 2, background: '#5b4cf5',
              width: `${progress}%`, transition: 'width 0.5s ease',
            }} />
          </div>
          <div style={{ display: 'flex', gap: 6, marginTop: 14 }}>
            {STEPS.slice(0,-1).map((s, i) => (
              <div key={s} style={{
                flex: 1, height: 3, borderRadius: 2,
                background: i <= step ? '#5b4cf5' : '#e8e5e0',
                transition: 'background 0.3s',
              }} />
            ))}
          </div>
        </div>
      )}

      {/* Done */}
      {done && (
        <div style={{
          background: '#f0fdf4', border: '1px solid #bbf7d0',
          borderRadius: 10, padding: '14px 18px', marginBottom: 20,
          color: '#16a34a', fontSize: 13.5, fontWeight: 500,
        }}>
          ✓ Clips generated successfully! Redirecting...
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{
          background: '#fef2f2', border: '1px solid #fecaca',
          borderRadius: 10, padding: '12px 16px', marginBottom: 20,
          color: '#dc2626', fontSize: 13.5,
        }}>
          {error}
        </div>
      )}

      {/* Generate button */}
      <button onClick={generate} disabled={processing || !file} style={{
        width: '100%', padding: '13px', borderRadius: 10,
        background: processing || !file ? '#d4d0c8' : '#5b4cf5',
        color: '#fff', fontWeight: 600, fontSize: 15,
        border: 'none', transition: 'all 0.2s',
        cursor: processing || !file ? 'not-allowed' : 'pointer',
        letterSpacing: '-0.2px',
      }}>
        {processing ? `${STEPS[step] || 'Processing'}...` : 'Generate clips'}
      </button>
    </div>
  )
}

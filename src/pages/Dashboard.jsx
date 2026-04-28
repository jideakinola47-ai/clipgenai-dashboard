import { useState, useRef } from 'react'

const BACKEND = 'https://web-production-189e9.up.railway.app'

const STYLES = ['Motivational & Inspirational','Educational','Funny & Entertainment','Business & Sales','Interview & Podcast','News & Commentary','Storytelling','Tutorial & How-to','Sports & Fitness','Gaming','Fashion & Lifestyle','Travel & Adventure']

const LANGS = ['English','Lithuanian (Lietuvių)','German (Deutsch)','French (Français)','Spanish (Español)','Polish (Polski)','Russian (Русский)','Italian (Italiano)','Portuguese (Português)','Dutch (Nederlands)','Swedish (Svenska)','Norwegian (Norsk)','Danish (Dansk)','Finnish (Suomi)','Japanese (日本語)','Chinese Simplified (简体中文)','Chinese Traditional (繁體中文)','Korean (한국어)','Arabic (العربية)','Turkish (Türkçe)','Hindi (हिन्दी)','Bengali (বাংলা)','Vietnamese (Tiếng Việt)','Thai (ภาษาไทย)','Indonesian (Bahasa Indonesia)','Malay (Bahasa Melayu)','Romanian (Română)','Hungarian (Magyar)','Czech (Čeština)','Slovak (Slovenčina)','Bulgarian (Български)','Croatian (Hrvatski)','Serbian (Srpski)','Ukrainian (Українська)','Greek (Ελληνικά)','Hebrew (עברית)','Catalan (Català)','Estonian (Eesti)','Latvian (Latviešu)','Slovenian (Slovenščina)','Albanian (Shqip)','Macedonian (Македонски)','Icelandic (Íslenska)','Swahili (Kiswahili)','Afrikaans','Persian (فارسی)','Urdu (اردو)','Tamil (தமிழ்)','Telugu (తెలుగు)','Kannada (ಕನ್ನಡ)']

const PLATFORMS = ['TikTok','Instagram Reels','YouTube Shorts']
const STEPS = ['Uploading','Transcribing audio','Analyzing content','Cutting clips','Done']

export default function Dashboard({ setClips, setPage, dark }) {
  const [file, setFile] = useState(null)
  const [drag, setDrag] = useState(false)
  const [style, setStyle] = useState(STYLES[0])
  const [lang, setLang] = useState('English')
  const [platforms, setPlatforms] = useState(['TikTok'])
  const [step, setStep] = useState(-1)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)
  const inputRef = useRef()

  const bg = dark ? '#0f0f0f' : '#f8f7f5'
  const text = dark ? '#e8e8e8' : '#1a1a1a'
  const sub = dark ? '#888' : '#666'
  const card = dark ? '#1a1a1a' : '#fff'
  const border = dark ? '#2a2a2a' : '#e0ddd6'
  const inputBg = dark ? '#111' : '#fff'

  const togglePlatform = p => setPlatforms(prev =>
    prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]
  )

  const handleFile = f => {
    if (!f) return
    if (f.size > 500 * 1024 * 1024) { setError('File must be under 500MB'); return }
    setFile(f); setError(''); setStep(-1); setDone(false)
  }

  const handleDrop = e => { e.preventDefault(); setDrag(false); handleFile(e.dataTransfer.files[0]) }

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
        setStep(stepMap[data.status] ?? 0)
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
      setTimeout(() => setPage('clips'), 1500)
    } catch(e) {
      setError(e.message || 'Something went wrong. Please try again.')
      setStep(-1)
    }
  }

  const processing = step >= 0 && step < 4

  return (
    <div style={{ maxWidth: 740, margin: '0 auto', padding: '36px 24px', background: bg, minHeight: '100vh' }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.5px', marginBottom: 4, color: text }}>New project</h1>
        <p style={{ color: sub, fontSize: 13.5 }}>Upload a video and AI will find the best viral moments automatically.</p>
      </div>

      {/* Upload */}
      <div onClick={() => !processing && inputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDrag(true) }}
        onDragLeave={() => setDrag(false)}
        onDrop={handleDrop}
        style={{
          border: `2px dashed ${drag ? '#5b4cf5' : file ? '#16a34a' : border}`,
          borderRadius: 14, padding: '36px 24px', textAlign: 'center',
          background: drag ? '#f0eeff' : file ? (dark ? '#0f1f12' : '#f0fdf4') : (dark ? '#111' : '#fafaf8'),
          cursor: processing ? 'default' : 'pointer',
          transition: 'all 0.2s', marginBottom: 20,
        }}>
        <input ref={inputRef} type="file" accept="video/*" style={{ display: 'none' }}
          onChange={e => handleFile(e.target.files[0])} />
        {file ? (
          <div>
            <div style={{ fontSize: 30, marginBottom: 8, color: '#16a34a' }}>✓</div>
            <div style={{ fontWeight: 600, fontSize: 14, color: text }}>{file.name}</div>
            <div style={{ color: sub, fontSize: 12.5, marginTop: 4 }}>{(file.size/1024/1024).toFixed(1)} MB — Ready to process</div>
            {!processing && (
              <button onClick={e => { e.stopPropagation(); setFile(null) }} style={{
                marginTop: 10, fontSize: 12, color: sub, background: 'none',
                border: `1px solid ${border}`, borderRadius: 6, padding: '4px 12px', cursor: 'pointer',
              }}>Remove</button>
            )}
          </div>
        ) : (
          <div>
            <div style={{ fontSize: 36, marginBottom: 10, color: '#bbb' }}>↑</div>
            <div style={{ fontWeight: 500, fontSize: 14, marginBottom: 4, color: text }}>
              Drop your video here or <span style={{ color: '#5b4cf5' }}>browse</span>
            </div>
            <div style={{ color: sub, fontSize: 12 }}>MP4, MOV, AVI, MKV · Max 500MB · Max 60 min</div>
          </div>
        )}
      </div>

      {/* Settings */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 20 }}>
        {[['CONTENT STYLE', style, setStyle, STYLES], ['SUBTITLE LANGUAGE', lang, setLang, LANGS]].map(([label, val, setter, opts]) => (
          <div key={label}>
            <label style={{ fontSize: 11.5, fontWeight: 600, color: sub, display: 'block', marginBottom: 6, letterSpacing: '0.5px' }}>{label}</label>
            <select value={val} onChange={e => setter(e.target.value)} style={{
              width: '100%', padding: '9px 12px', borderRadius: 8,
              border: `1px solid ${border}`, background: inputBg,
              fontSize: 13.5, color: text, outline: 'none',
            }}>
              {opts.map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
        ))}
      </div>

      {/* Platforms */}
      <div style={{ marginBottom: 28 }}>
        <label style={{ fontSize: 11.5, fontWeight: 600, color: sub, display: 'block', marginBottom: 8, letterSpacing: '0.5px' }}>TARGET PLATFORMS</label>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {PLATFORMS.map(p => (
            <button key={p} onClick={() => togglePlatform(p)} style={{
              padding: '7px 18px', borderRadius: 20,
              border: `1px solid ${platforms.includes(p) ? '#5b4cf5' : border}`,
              background: platforms.includes(p) ? '#f0eeff' : (dark ? '#111' : '#fff'),
              color: platforms.includes(p) ? '#5b4cf5' : sub,
              fontSize: 13, fontWeight: platforms.includes(p) ? 600 : 400,
              cursor: 'pointer', transition: 'all 0.15s',
            }}>{p}</button>
          ))}
        </div>
      </div>

      {/* Progress */}
      {processing && (
        <div style={{
          background: card, border: `1px solid ${border}`,
          borderRadius: 12, padding: '20px 24px', marginBottom: 20,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ fontSize: 13.5, fontWeight: 500, color: text }}>{STEPS[step] || 'Processing'}...</span>
            <span style={{ fontSize: 13, color: sub }}>{Math.max(0, progress)}%</span>
          </div>
          <div style={{ height: 5, background: dark ? '#2a2a2a' : '#f0ede8', borderRadius: 3 }}>
            <div style={{
              height: '100%', borderRadius: 3, background: '#5b4cf5',
              width: `${Math.max(0, progress)}%`, transition: 'width 0.5s ease',
            }} />
          </div>
          <div style={{ display: 'flex', gap: 6, marginTop: 14 }}>
            {STEPS.slice(0,-1).map((s, i) => (
              <div key={s} style={{
                flex: 1, height: 3, borderRadius: 2,
                background: i <= step ? '#5b4cf5' : (dark ? '#2a2a2a' : '#e8e5e0'),
                transition: 'background 0.3s',
              }} />
            ))}
          </div>
        </div>
      )}

      {done && (
        <div style={{
          background: dark ? '#0f1f12' : '#f0fdf4', border: '1px solid #bbf7d0',
          borderRadius: 10, padding: '14px 18px', marginBottom: 20,
          color: '#16a34a', fontSize: 13.5, fontWeight: 500,
        }}>✓ Clips generated! Redirecting to your clips...</div>
      )}

      {error && (
        <div style={{
          background: dark ? '#1f0f0f' : '#fef2f2', border: '1px solid #fecaca',
          borderRadius: 10, padding: '12px 16px', marginBottom: 20,
          color: '#dc2626', fontSize: 13.5,
        }}>{error}</div>
      )}

      <button onClick={generate} disabled={processing || !file} style={{
        width: '100%', padding: '14px', borderRadius: 10,
        background: processing || !file ? (dark ? '#2a2a2a' : '#d4d0c8') : '#5b4cf5',
        color: processing || !file ? sub : '#fff',
        fontWeight: 700, fontSize: 15, border: 'none',
        cursor: processing || !file ? 'not-allowed' : 'pointer',
        letterSpacing: '-0.2px', transition: 'all 0.2s',
      }}>
        {processing ? `${STEPS[step] || 'Processing'}...` : '✦ Generate clips'}
      </button>
    </div>
  )
}

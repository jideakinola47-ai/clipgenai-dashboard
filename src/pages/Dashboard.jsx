import { useState, useRef } from 'react'

const BACKEND = 'https://web-production-189e9.up.railway.app'
const STYLES = ['Educational / Tutorial','Motivational & Inspirational','Funny & Entertainment','Business & Sales','Interview & Podcast','News & Commentary','Storytelling','Sports & Fitness','Gaming','Fashion & Lifestyle']
const LANGS = ['English','Lithuanian (Lietuvių)','German (Deutsch)','French (Français)','Spanish (Español)','Polish (Polski)','Russian (Русский)','Italian (Italiano)','Portuguese (Português)','Dutch (Nederlands)','Swedish (Svenska)','Norwegian (Norsk)','Danish (Dansk)','Finnish (Suomi)','Japanese (日本語)','Chinese (简体中文)','Korean (한국어)','Arabic (العربية)','Turkish (Türkçe)','Hindi (हिन्दी)','Vietnamese (Tiếng Việt)','Thai (ภาษาไทย)','Indonesian (Bahasa Indonesia)','Romanian (Română)','Hungarian (Magyar)','Czech (Čeština)','Bulgarian (Български)','Greek (Ελληνικά)','Hebrew (עברית)','Ukrainian (Українська)','Persian (فارسی)','Swahili (Kiswahili)','Afrikaans','Catalan (Català)','Estonian (Eesti)','Latvian (Latviešu)','Serbian (Srpski)','Croatian (Hrvatski)','Slovak (Slovenčina)','Slovenian (Slovenščina)','Albanian (Shqip)','Icelandic (Íslenska)','Malay (Bahasa Melayu)','Tamil (தமிழ்)','Telugu (తెలుగు)','Bengali (বাংলা)','Urdu (اردو)','Kannada (ಕನ್ನಡ)','Macedonian','Azerbaijani']
const PLATFORMS = [{ id: 'tiktok', label: 'TikTok', color: '#010101' }, { id: 'reels', label: 'Instagram Reels', color: '#e1306c' }, { id: 'shorts', label: 'YouTube Shorts', color: '#ff0000' }]
const STEPS = ['Uploading','Transcribing audio','Analyzing content','Cutting clips','Done']

const Input = ({ children, style }) => (
  <div style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 10, padding: '14px 18px', ...style }}>
    {children}
  </div>
)

export default function Dashboard({ setClips, setPage }) {
  const [file, setFile] = useState(null)
  const [drag, setDrag] = useState(false)
  const [style, setStyle] = useState(STYLES[0])
  const [lang, setLang] = useState('English')
  const [platforms, setPlatforms] = useState(['tiktok', 'reels', 'shorts'])
  const [autoCaptions, setAutoCaptions] = useState(true)
  const [viralOpt, setViralOpt] = useState(true)
  const [step, setStep] = useState(-1)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)
  const [activeTab, setActiveTab] = useState('upload')
  const inputRef = useRef()

  const togglePlatform = p => setPlatforms(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p])

  const handleFile = f => {
    if (!f) return
    if (f.size > 500 * 1024 * 1024) { setError('File must be under 500MB'); return }
    setFile(f); setError(''); setStep(-1); setDone(false)
  }

  const pollStatus = async (jobId) => {
    const stepMap = { uploading: 0, transcribing: 1, scoring: 2, cutting: 3, done: 4, failed: -1 }
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
      } catch (e) {
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
    } catch (e) {
      setError(e.message || 'Something went wrong.')
      setStep(-1)
    }
  }

  const processing = step >= 0 && step < 4

  const Toggle = ({ on, setOn }) => (
    <div onClick={() => setOn(!on)} style={{
      width: 44, height: 24, borderRadius: 12, cursor: 'pointer',
      background: on ? '#5b4cf5' : '#333', position: 'relative', transition: 'background 0.2s', flexShrink: 0,
    }}>
      <div style={{
        position: 'absolute', top: 2, left: on ? 22 : 2, width: 20, height: 20,
        borderRadius: '50%', background: '#fff', transition: 'left 0.2s',
      }} />
    </div>
  )

  const selectStyle = {
    width: '100%', padding: '10px 12px', borderRadius: 8,
    border: '1px solid #2a2a2a', background: '#222', color: '#e8e8e8',
    fontSize: 13.5, outline: 'none', cursor: 'pointer',
  }

  return (
    <div style={{ padding: '24px', background: '#0d0d0d', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#fff', letterSpacing: '-0.5px', marginBottom: 4 }}>
          Create New Clip
        </h1>
        <p style={{ color: '#666', fontSize: 13.5 }}>Welcome back, Kajus 👋</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 24, background: '#1a1a1a', borderRadius: 10, padding: 4, width: 'fit-content' }}>
        {[['upload', '⬆ Upload & Generate'], ['clips', '✂ Generated Clips'], ['analytics', '↗ Analytics']].map(([id, label]) => (
          <button key={id} onClick={() => id === 'clips' ? setPage('clips') : id === 'analytics' ? setPage('analytics') : setActiveTab(id)} style={{
            padding: '8px 18px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13,
            background: activeTab === id ? '#5b4cf5' : 'transparent',
            color: activeTab === id ? '#fff' : '#888', fontWeight: activeTab === id ? 600 : 400,
          }}>{label}</button>
        ))}
      </div>

      {/* Main content — 3 columns like Readdy */}
      <div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 20 }}>

        {/* Upload zone */}
        <div
          className="upload-zone" style={{ gridColumn: '1 / -1' }}
          onClick={() => !processing && inputRef.current?.click()}
          onDragOver={e => { e.preventDefault(); setDrag(true) }}
          onDragLeave={() => setDrag(false)}
          onDrop={e => { e.preventDefault(); setDrag(false); handleFile(e.dataTransfer.files[0]) }}>
          <input ref={inputRef} type="file" accept="video/*" style={{ display: 'none' }} onChange={e => handleFile(e.target.files[0])} />
          <div style={{
            border: `2px dashed ${drag ? '#5b4cf5' : file ? '#22c55e' : '#2a2a2a'}`,
            borderRadius: 14, padding: '48px 24px', textAlign: 'center',
            background: drag ? '#5b4cf510' : file ? '#22c55e08' : '#111',
            cursor: processing ? 'default' : 'pointer', transition: 'all 0.2s',
          }}>
            {file ? (
              <div>
                <div style={{ width: 56, height: 56, borderRadius: 14, background: '#22c55e20', margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>✓</div>
                <div style={{ fontWeight: 600, fontSize: 15, color: '#fff', marginBottom: 4 }}>{file.name}</div>
                <div style={{ color: '#666', fontSize: 13 }}>{(file.size / 1024 / 1024).toFixed(1)} MB — Ready to process</div>
                {!processing && <button onClick={e => { e.stopPropagation(); setFile(null) }} style={{ marginTop: 10, fontSize: 12, color: '#666', background: 'none', border: '1px solid #333', borderRadius: 6, padding: '4px 12px' }}>Remove</button>}
              </div>
            ) : (
              <div>
                <div style={{ width: 56, height: 56, borderRadius: 14, background: '#5b4cf520', margin: '0 auto 14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>⬆</div>
                <div style={{ fontWeight: 600, fontSize: 16, color: '#fff', marginBottom: 6 }}>Drag & drop your video here</div>
                <div style={{ color: '#666', fontSize: 13, marginBottom: 4 }}>or click to browse files</div>
                <div style={{ color: '#444', fontSize: 12 }}>MP4, MOV, AVI, MKV • Up to 500MB • Max 60 minutes</div>
              </div>
            )}
          </div>
        </div>

        {/* Content Style */}
        <Input>
          <div style={{ fontSize: 11, fontWeight: 600, color: '#666', letterSpacing: '1px', marginBottom: 10 }}>CONTENT STYLE</div>
          <select value={style} onChange={e => setStyle(e.target.value)} style={selectStyle}>
            {STYLES.map(s => <option key={s}>{s}</option>)}
          </select>
        </Input>

        {/* Target Platform */}
        <Input>
          <div style={{ fontSize: 11, fontWeight: 600, color: '#666', letterSpacing: '1px', marginBottom: 10 }}>TARGET PLATFORM</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {PLATFORMS.map(p => (
              <div key={p.id} onClick={() => togglePlatform(p.id)} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '10px 14px', borderRadius: 8, cursor: 'pointer',
                background: platforms.includes(p.id) ? '#5b4cf518' : '#222',
                border: `1px solid ${platforms.includes(p.id) ? '#5b4cf5' : '#333'}`,
              }}>
                <span style={{ fontSize: 13.5, color: platforms.includes(p.id) ? '#a89cf7' : '#888' }}>{p.label}</span>
                {platforms.includes(p.id) && <span style={{ color: '#5b4cf5', fontSize: 16 }}>✓</span>}
              </div>
            ))}
          </div>
        </Input>

        {/* Advanced Options */}
        <Input>
          <div style={{ fontSize: 11, fontWeight: 600, color: '#666', letterSpacing: '1px', marginBottom: 14 }}>ADVANCED OPTIONS</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[['Auto-captions', autoCaptions, setAutoCaptions], ['Viral optimization', viralOpt, setViralOpt]].map(([label, on, setOn]) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13.5, color: '#ccc' }}>{label}</span>
                <div onClick={() => setOn(!on)} style={{
                  width: 44, height: 24, borderRadius: 12, cursor: 'pointer',
                  background: on ? '#5b4cf5' : '#333', position: 'relative', transition: 'background 0.2s',
                }}>
                  <div style={{ position: 'absolute', top: 2, left: on ? 22 : 2, width: 20, height: 20, borderRadius: '50%', background: '#fff', transition: 'left 0.2s' }} />
                </div>
              </div>
            ))}
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#555', letterSpacing: '0.5px', marginBottom: 6 }}>SUBTITLE LANGUAGE</div>
              <select value={lang} onChange={e => setLang(e.target.value)} style={{ ...selectStyle, fontSize: 12.5 }}>
                {LANGS.map(l => <option key={l}>{l}</option>)}
              </select>
            </div>
          </div>
        </Input>
      </div>

      {/* Progress */}
      {processing && (
        <div style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 12, padding: '20px 24px', marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ fontSize: 13.5, fontWeight: 500, color: '#fff' }}>{STEPS[step] || 'Processing'}...</span>
            <span style={{ fontSize: 13, color: '#888' }}>{Math.max(0, progress)}%</span>
          </div>
          <div style={{ height: 6, background: '#333', borderRadius: 3 }}>
            <div style={{ height: '100%', borderRadius: 3, background: 'linear-gradient(90deg, #5b4cf5, #8b5cf6)', width: `${Math.max(0, progress)}%`, transition: 'width 0.5s ease' }} />
          </div>
          <div style={{ display: 'flex', gap: 6, marginTop: 12 }}>
            {STEPS.slice(0, -1).map((s, i) => (
              <div key={s} style={{ flex: 1, height: 3, borderRadius: 2, background: i <= step ? '#5b4cf5' : '#2a2a2a', transition: 'background 0.3s' }} />
            ))}
          </div>
        </div>
      )}

      {done && <div style={{ background: '#0d1f12', border: '1px solid #166534', borderRadius: 10, padding: '12px 18px', marginBottom: 16, color: '#22c55e', fontSize: 13.5 }}>✓ Clips generated! Redirecting...</div>}
      {error && <div style={{ background: '#1f0d0d', border: '1px solid #991b1b', borderRadius: 10, padding: '12px 18px', marginBottom: 16, color: '#f87171', fontSize: 13.5 }}>{error}</div>}

      {/* Generate button */}
      <button onClick={generate} disabled={processing || !file} style={{
        width: '100%', padding: '16px', borderRadius: 12,
        background: processing || !file ? '#1a1a1a' : 'linear-gradient(135deg, #5b4cf5, #8b5cf6)',
        color: processing || !file ? '#444' : '#fff',
        fontWeight: 700, fontSize: 16, border: 'none',
        cursor: processing || !file ? 'not-allowed' : 'pointer',
        boxShadow: !processing && file ? '0 4px 20px rgba(91,76,245,0.4)' : 'none',
        transition: 'all 0.2s',
      }}>
        {processing ? `${STEPS[step] || 'Processing'}...` : '⚡ Generate Viral Clips ✦'}
      </button>
    </div>
  )
}

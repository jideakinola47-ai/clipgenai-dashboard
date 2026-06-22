// src/pages/Dashboard.jsx — redesigned to match the ClipGen landing page.
// Functional logic (upload, URL processing, polling, language) is UNCHANGED.
// Only the visual layer is rebuilt on the shared landing design tokens.
import { useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { uploadAndProcess, uploadVideoFile } from "../utils/upload"
import { useTheme } from '../contexts/ThemeContext'
import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/LanguageContext'
import { makePalette, FONT_DISPLAY, FONT_BODY, FONT_MONO } from '../theme/landingTheme'
import { Icon, Btn, Card, Eyebrow } from '../theme/ui'

// Transcription languages supported by the OpenAI Whisper backend
const SUB_LANGUAGES = [
  { code: 'auto', name: 'Auto Detect', flag: '🌐' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺' },
]

export default function Dashboard() {
  const navigate = useNavigate()
  const { isDark } = useTheme()
  const { user } = useAuth()
  const { language, setLanguage, LANGS, t } = useLanguage()

  const [videoUrl, setVideoUrl] = useState('')
  const [videoType, setVideoType] = useState(2)
  const [progress, setProgress] = useState(null)
  const [error, setError] = useState("")
  // store a STABLE style key, not a translated label, so it survives language switches
  const [styleKey, setStyleKey] = useState('educational')
  const [platforms, setPlatforms] = useState(["Instagram Reels", "YouTube Shorts"])
  const [subtitleLang, setSubtitleLang] = useState('auto')
  const [autoCap, setAutoCap] = useState(true)
  const [viral, setViral] = useState(true)
  const [showLanguageMenu, setShowLanguageMenu] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const fileInputRef = useRef(null)

  // Landing palette + display font = exact visual match
  const P = { ...makePalette(isDark), fontD: FONT_DISPLAY }

  // Content-style options keyed by stable id (label comes from t())
  const STYLE_OPTIONS = [
    { key: 'educational',     label: t('educational') },
    { key: 'entertainment',   label: t('entertainment') },
    { key: 'news',            label: t('news') },
    { key: 'productReview',   label: t('productReview') },
    { key: 'vlog',            label: t('vlog') },
    { key: 'motivational',    label: t('motivational') },
    { key: 'comedy',          label: t('comedy') },
    { key: 'interview',       label: 'Interview' },
    { key: 'podcastHighlight',label: 'Podcast Highlight' },
    { key: 'sportsHighlight', label: 'Sports Highlight' },
  ]

  const PLATFORMS = ["TikTok", "Instagram Reels", "YouTube Shorts", "LinkedIn", "Twitter/X"]

  const VIDEO_TYPES = [
    { value: 2, label: t('youtube') },
    { value: 1, label: t('directUrl') },
    { value: 3, label: t('googleDrive') },
    { value: 4, label: t('vimeo') },
    { value: 5, label: "StreamYard" },
    { value: 6, label: "TikTok" },
    { value: 7, label: "Twitter" },
    { value: 9, label: "Twitch" },
    { value: 10, label: "Loom" },
    { value: 11, label: "Facebook" },
    { value: 12, label: "LinkedIn" },
  ]

  function togglePlatform(p) {
    setPlatforms(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p])
  }

  async function handleGenerate() {
    if (!videoUrl) { setError(t('urlRequired')); return }
    setError("")
    setProgress({ stage: "starting", percent: 0, message: "Starting..." })
    try {
      const clips = await uploadAndProcess(videoUrl, videoType, subtitleLang, (p) => setProgress(p))
      if (clips && clips.length > 0) {
        sessionStorage.setItem('generatedClips', JSON.stringify(clips))
        navigate('/clips')
      } else { setError(t('noClipsError')); setProgress(null) }
    } catch (e) { setError(e.message || t('generalError')); setProgress(null) }
  }

  async function handleFileUpload() {
    if (!selectedFile || progress) return
    setError("")
    setProgress({ stage: "uploading", percent: 0, message: t('startingUpload') || "Starting upload..." })
    try {
      const clips = await uploadVideoFile(selectedFile, subtitleLang, (p) => setProgress(p))
      if (clips && clips.length > 0) {
        sessionStorage.setItem('generatedClips', JSON.stringify(clips))
        navigate('/clips')
      } else { setError(t('noClipsError')); setProgress(null) }
    } catch (e) { setError(e.message || t('generalError')); setProgress(null) }
  }

  const currentLanguage = LANGS.find(l => l.code === language) || LANGS[0]
  const busy = !!progress

  const inputStyle = {
    width: '100%', padding: '12px 16px', borderRadius: 10,
    border: `1px solid ${P.line}`, background: P.bgAlt, color: P.text,
    fontSize: 14, outline: 'none', fontFamily: FONT_BODY, transition: 'border-color .2s',
  }
  const labelStyle = {
    fontFamily: FONT_MONO, fontSize: 11, color: P.muted,
    letterSpacing: 1.5, display: 'block', marginBottom: 10,
  }

  return (
    <div style={{ position: 'relative', background: P.bg, minHeight: '100vh', color: P.text, fontFamily: FONT_BODY }}>
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
        background: `radial-gradient(800px 400px at 80% -10%, ${P.purple}14, transparent 60%), radial-gradient(600px 400px at -5% 5%, ${P.cyan}10, transparent 55%)` }} />

      <div style={{ position: 'relative', zIndex: 1, padding: 'clamp(16px, 4vw, 32px)', maxWidth: 1200, margin: '0 auto' }}>
        {/* HEADER */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 28 }}>
          <div>
            <Eyebrow P={P} color={P.cyan} style={{ marginBottom: 8 }}>VIRAL CONTENT INTELLIGENCE</Eyebrow>
            <h1 style={{ fontFamily: P.fontD, fontWeight: 900, fontSize: 'clamp(24px, 5vw, 34px)', letterSpacing: '-1px', color: P.text, margin: 0 }}>
              {t('title')}
            </h1>
            <p style={{ color: P.muted, fontSize: 'clamp(13px, 4vw, 15px)', marginTop: 8 }}>
              {t('welcome', { name: user?.full_name || '' })}
            </p>
          </div>

          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowLanguageMenu(!showLanguageMenu)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8, padding: '9px 16px', borderRadius: 10,
                background: P.surface, border: `1px solid ${P.line}`, color: P.text,
                fontSize: 13, fontFamily: FONT_BODY, cursor: 'pointer',
              }}
            >
              <span style={{ fontSize: 16 }}>{currentLanguage.flag}</span>
              <span>{currentLanguage.label}</span>
              <span style={{ fontSize: 10, color: P.muted }}>▼</span>
            </button>
            {showLanguageMenu && (
              <>
                <div onClick={() => setShowLanguageMenu(false)} style={{ position: 'fixed', inset: 0, zIndex: 998 }} />
                <div style={{
                  position: 'absolute', top: '100%', right: 0, marginTop: 8, background: P.surface,
                  border: `1px solid ${P.line}`, borderRadius: 12, padding: 8, minWidth: 190,
                  maxHeight: 360, overflowY: 'auto', zIndex: 999,
                  boxShadow: P.dark ? '0 16px 40px rgba(0,0,0,0.5)' : '0 16px 40px rgba(15,30,55,0.15)',
                }}>
                  {LANGS.map(lang => (
                    <button
                      key={lang.code}
                      onClick={() => { setLanguage(lang.code); setShowLanguageMenu(false) }}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '9px 12px',
                        borderRadius: 8, background: language === lang.code ? P.cyan + '18' : 'transparent',
                        border: 'none', color: P.text, fontSize: 13, fontFamily: FONT_BODY, cursor: 'pointer', textAlign: 'left',
                      }}
                    >
                      <span style={{ fontSize: 18 }}>{lang.flag}</span>
                      <span>{lang.label}</span>
                      {language === lang.code && <span style={{ marginLeft: 'auto', color: P.cyan }}>✓</span>}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* UPLOAD CARD */}
        <Card P={P} hover={false} style={{ padding: 'clamp(20px, 4vw, 28px)', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
            <div style={{ width: 42, height: 42, borderRadius: 11, background: `${P.purple}1a`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="upload" size={20} color={P.purple} stroke={2} />
            </div>
            <div>
              <div style={{ fontFamily: P.fontD, fontWeight: 700, fontSize: 16, color: P.text }}>
                {t('uploadFileLabel') || 'Upload video file'}
              </div>
              <div style={{ fontFamily: FONT_MONO, fontSize: 10.5, color: P.muted, letterSpacing: 0.5, marginTop: 2 }}>
                INPUT // RAW FOOTAGE
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
            <Btn P={P} ghost onClick={() => fileInputRef.current?.click()} disabled={busy}>
              <Icon name="film" size={14} color={P.text} stroke={2} /> {t('chooseFile') || 'Choose file'}
            </Btn>
            <span style={{ fontSize: 13, color: P.muted, fontFamily: FONT_BODY }}>
              {selectedFile ? selectedFile.name : t('noFileChosen') || 'No file chosen'}
            </span>
            {selectedFile && (
              <Btn P={P} accent={P.purple} onClick={handleFileUpload} disabled={busy}>
                <Icon name="zap" size={14} color="#fff" stroke={2.2} /> {t('uploadGenerate') || 'Upload & generate'}
              </Btn>
            )}
          </div>

          <input
            type="file" accept="video/*" ref={fileInputRef}
            onChange={(e) => setSelectedFile(e.target.files[0])}
            disabled={busy} style={{ display: 'none' }}
          />

          <p style={{ fontSize: 12, color: P.muted, marginTop: 12, fontFamily: FONT_BODY }}>
            {t('supportedFormats') || 'Supports MP4, MOV, AVI, MKV — up to 30 min per video'}
          </p>

          {progress && (progress.stage === 'uploading' || progress.stage === 'polling') && (
            <ProgressBar P={P} progress={progress} />
          )}
        </Card>

        {/* URL CARD */}
        <Card P={P} hover={false} style={{ padding: 'clamp(20px, 4vw, 28px)', marginBottom: 20 }}>
          <label style={labelStyle}>{t('videoUrl')}</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <input
              type="text" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)}
              placeholder={t('videoUrlPlaceholder')} style={inputStyle}
              onFocus={(e) => e.target.style.borderColor = P.cyan + '88'}
              onBlur={(e) => e.target.style.borderColor = P.line}
            />
            <select
              value={videoType} onChange={(e) => setVideoType(parseInt(e.target.value))}
              style={{ ...inputStyle, cursor: 'pointer' }}
            >
              {VIDEO_TYPES.map(type => <option key={type.value} value={type.value}>{type.label}</option>)}
            </select>
          </div>
          <p style={{ fontSize: 12, color: P.muted, marginTop: 10, fontFamily: FONT_BODY }}>{t('tip')}</p>
        </Card>

        {/* OPTIONS GRID */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16, marginBottom: 20 }}>
          <Card P={P} hover={false} style={{ padding: 22 }}>
            <Eyebrow P={P} color={P.cyan} style={{ marginBottom: 14 }}>CONTENT STYLE</Eyebrow>
            <select
              value={styleKey} onChange={e => setStyleKey(e.target.value)}
              style={{ ...inputStyle, cursor: 'pointer' }}
            >
              {STYLE_OPTIONS.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
            </select>
          </Card>

          <Card P={P} hover={false} style={{ padding: 22 }}>
            <Eyebrow P={P} color={P.blue} style={{ marginBottom: 14 }}>TARGET PLATFORM</Eyebrow>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {PLATFORMS.map(p => {
                const on = platforms.includes(p)
                return (
                  <div key={p} onClick={() => togglePlatform(p)}
                    style={{
                      padding: '9px 12px', borderRadius: 8, cursor: 'pointer', fontSize: 13.5, fontFamily: FONT_BODY,
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      background: on ? P.purple + '1f' : 'transparent',
                      border: `1px solid ${on ? P.purple + '88' : P.line}`,
                      color: on ? P.text : P.muted, transition: 'all .2s',
                    }}>
                    {p}
                    {on && <Icon name="check" size={14} color={P.purple} stroke={2.5} />}
                  </div>
                )
              })}
            </div>
          </Card>

          <Card P={P} hover={false} style={{ padding: 22 }}>
            <Eyebrow P={P} color={P.pink} style={{ marginBottom: 14 }}>ADVANCED OPTIONS</Eyebrow>
            <Toggle P={P} label={t('autoCaptions')} on={autoCap} onClick={() => setAutoCap(!autoCap)} />
            <Toggle P={P} label={t('viralOptimization')} on={viral} onClick={() => setViral(!viral)} />
            <div style={{ ...labelStyle, marginTop: 16, marginBottom: 8 }}>{t('subtitleLanguage')}</div>
            <select
              value={subtitleLang} onChange={e => setSubtitleLang(e.target.value)}
              style={{ ...inputStyle, padding: '10px 12px', fontSize: 13, cursor: 'pointer' }}
            >
              {SUB_LANGUAGES.map(lang => (
                <option key={lang.code} value={lang.code}>{lang.flag} {lang.name}</option>
              ))}
            </select>
            <p style={{ fontSize: 10.5, color: P.muted, marginTop: 8, fontFamily: FONT_MONO, letterSpacing: 0.3 }}>
              {subtitleLang === 'auto'
                ? 'AI will auto-detect the language'
                : `Subtitles in ${SUB_LANGUAGES.find(l => l.code === subtitleLang)?.name}`}
            </p>
          </Card>
        </div>

        {progress && progress.stage !== 'uploading' && progress.stage !== 'polling' && (
          <Card P={P} hover={false} style={{ padding: 22, marginBottom: 16, border: `1px solid ${P.cyan}44` }}>
            <ProgressBar P={P} progress={progress} />
          </Card>
        )}

        {error && (
          <Card P={P} hover={false} style={{ padding: 16, marginBottom: 16, border: `1px solid ${P.pink}55`, background: P.pink + '12' }}>
            <div style={{ color: P.pink, fontSize: 14, fontFamily: FONT_BODY }}>{error}</div>
          </Card>
        )}

        <Btn P={P} accent={P.purple} big full onClick={handleGenerate} disabled={!videoUrl || busy}>
          {busy
            ? <>{progress.message}</>
            : <><Icon name="zap" size={16} color="#fff" stroke={2.2} /> {t('generateButton')}</>}
        </Btn>
      </div>
    </div>
  )
}

function Toggle({ P, label, on, onClick }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
      <span style={{ color: P.text, fontSize: 14, fontFamily: FONT_BODY }}>{label}</span>
      <div onClick={onClick} style={{
        width: 44, height: 24, borderRadius: 12, cursor: 'pointer',
        background: on ? P.purple : P.line, position: 'relative', transition: 'background .2s',
      }}>
        <div style={{
          position: 'absolute', top: 2, left: on ? 22 : 2, width: 20, height: 20,
          borderRadius: '50%', background: '#fff', transition: 'left .2s',
        }} />
      </div>
    </div>
  )
}

function ProgressBar({ P, progress }) {
  return (
    <div style={{ marginTop: 4 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <span style={{ fontSize: 13, color: P.muted, fontFamily: FONT_BODY }}>{progress.message}</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: P.cyan, fontFamily: FONT_MONO }}>{Math.round(progress.percent)}%</span>
      </div>
      <div style={{ background: P.bgAlt, borderRadius: 4, height: 6, overflow: 'hidden' }}>
        <div style={{
          width: `${progress.percent}%`, height: '100%',
          background: `linear-gradient(90deg, ${P.purple}, ${P.cyan})`,
          borderRadius: 4, transition: 'width .4s',
        }} />
      </div>
    </div>
  )
}

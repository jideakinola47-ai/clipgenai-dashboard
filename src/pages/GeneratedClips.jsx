import { useState } from 'react'
import { useTheme } from '../contexts/ThemeContext'

function Score({ score }) {
  const { isDark } = useTheme()
  const s = parseFloat(score) * 10 || 0
  const color = s >= 85 ? '#22c55e' : s >= 70 ? '#f59e0b' : '#f87171'
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <div style={{ flex: 1, height: 4, background: isDark ? '#333' : '#e8e5e0', borderRadius: 2 }}>
        <div style={{ width: `${s}%`, height: '100%', background: color, borderRadius: 2 }} />
      </div>
      <span style={{ fontSize: 12, fontWeight: 700, color, minWidth: 28 }}>{score}</span>
    </div>
  )
}

export default function GeneratedClips({ clips }) {
  const { isDark } = useTheme()
  const [playing, setPlaying] = useState(null)
  
  const theme = {
    bg: isDark ? '#0d0d0d' : '#f8f7f5',
    cardBg: isDark ? '#111' : '#ffffff',
    border: isDark ? '#1f1f1f' : '#e8e5e0',
    text: isDark ? '#fff' : '#0a0a0a',
    textMuted: isDark ? '#666' : '#888',
  }
  
  // Get clips from sessionStorage if not passed as prop
  const storedClips = clips || (typeof window !== 'undefined' ? JSON.parse(sessionStorage.getItem('generatedClips') || '[]') : [])
  
  if (!storedClips || storedClips.length === 0) return (
    <div style={{ padding: '40px 24px', background: theme.bg, minHeight: '100vh' }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: theme.text, marginBottom: 8 }}>My Clips</h1>
      <p style={{ color: theme.textMuted, fontSize: 13.5, marginBottom: 40 }}>Your AI-generated clips will appear here.</p>
      <div style={{ border: `2px dashed ${theme.border}`, borderRadius: 14, padding: '60px 24px', textAlign: 'center', color: theme.textMuted }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>✂</div>
        <div style={{ fontSize: 15, fontWeight: 500, color: theme.textMuted }}>No clips yet</div>
        <div style={{ fontSize: 13, marginTop: 6 }}>Upload a video from the Dashboard to generate clips</div>
      </div>
    </div>
  )

  return (
    <div style={{ padding: '24px', background: theme.bg, minHeight: '100vh' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: theme.text, marginBottom: 4 }}>My Clips</h1>
        <p style={{ color: theme.textMuted, fontSize: 13.5 }}>{storedClips.length} clips generated — ready to download or publish</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
        {storedClips.map((clip, i) => (
          <div key={clip.videoId || i} style={{ background: theme.cardBg, borderRadius: 14, border: `1px solid ${theme.border}`, overflow: 'hidden' }}>
            <div style={{
              background: isDark ? '#0a0a0a' : '#f0f0f0',
              aspectRatio: '9/16',
              maxHeight: 200,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              cursor: 'pointer',
            }} onClick={() => setPlaying(playing === i ? null : i)}>
              {playing === i ? (
                <video
                  src={clip.videoUrl}
                  controls
                  autoPlay
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onEnded={() => setPlaying(null)}
                />
              ) : (
                <>
                  <div style={{
                    width: 48, height: 48, borderRadius: '50%',
                    background: 'rgba(91,76,245,0.3)', border: '2px solid rgba(91,76,245,0.6)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 18,
                  }}>▶</div>
                  {clip.videoMsDuration && (
                    <div style={{ position: 'absolute', bottom: 8, right: 8, background: 'rgba(0,0,0,0.7)', color: '#fff', fontSize: 11, padding: '2px 6px', borderRadius: 4 }}>
                      {Math.round(clip.videoMsDuration / 1000)}s
                    </div>
                  )}
                </>
              )}
            </div>
            <div style={{ padding: '14px' }}>
              <div style={{ fontWeight: 600, fontSize: 13, color: theme.text, marginBottom: 8, lineHeight: 1.3 }}>
                {clip.title || `Clip ${i + 1}`}
              </div>
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 10.5, color: theme.textMuted, marginBottom: 4, letterSpacing: '0.5px' }}>VIRAL SCORE</div>
                <Score score={clip.viralScore} />
              </div>
              {clip.transcript && (
                <div style={{ fontSize: 11.5, color: theme.textMuted, marginBottom: 12, fontStyle: 'italic' }}>
                  "{clip.transcript}"
                </div>
              )}
              <div style={{ display: 'flex', gap: 8 }}>
                <a
                  href={clip.videoUrl}
                  download
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    flex: 1, padding: '8px', borderRadius: 8,
                    background: 'linear-gradient(135deg, #5b4cf5, #8b5cf6)', color: '#fff',
                    fontSize: 12.5, fontWeight: 600, textAlign: 'center', display: 'block', textDecoration: 'none',
                  }}>Download</a>
                <a
                  href={clip.clipEditorUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    flex: 1, padding: '8px', borderRadius: 8,
                    background: isDark ? '#1a1a1a' : '#f0f0f0',
                    color: theme.textMuted, fontSize: 12.5,
                    border: `1px solid ${theme.border}`, textAlign: 'center', display: 'block', textDecoration: 'none',
                  }}>Edit</a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
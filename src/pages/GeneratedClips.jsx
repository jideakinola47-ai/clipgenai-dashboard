import { useState } from 'react'

const BACKEND = 'https://web-production-189e9.up.railway.app'

function ScoreBadge({ score }) {
  const s = parseInt(score) || 0
  const color = s >= 85 ? '#16a34a' : s >= 70 ? '#ca8a04' : '#dc2626'
  return (
    <span style={{
      fontSize: 11, fontWeight: 600, color,
      background: color + '18', borderRadius: 4,
      padding: '2px 7px', whiteSpace: 'nowrap'
    }}>{s > 0 ? `${s}/100` : '—'}</span>
  )
}

export default function GeneratedClips({ clips }) {
  const [playing, setPlaying] = useState(null)

  if (!clips || clips.length === 0) return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '36px 24px' }}>
      <h1 style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.5px', marginBottom: 4 }}>Generated clips</h1>
      <p style={{ color: '#888', fontSize: 13.5, marginBottom: 40 }}>Your AI-generated clips will appear here.</p>
      <div style={{
        border: '2px dashed #e0ddd6', borderRadius: 12,
        padding: '48px 24px', textAlign: 'center', color: '#aaa',
      }}>
        <div style={{ fontSize: 32, marginBottom: 12 }}>✂</div>
        <div style={{ fontSize: 14, fontWeight: 500 }}>No clips yet</div>
        <div style={{ fontSize: 13, marginTop: 6 }}>Upload a video from the Dashboard to generate clips</div>
      </div>
    </div>
  )

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '36px 24px' }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.5px', marginBottom: 4 }}>
          Generated clips
        </h1>
        <p style={{ color: '#888', fontSize: 13.5 }}>{clips.length} clips ready — download or publish directly</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 18 }}>
        {clips.map((clip, i) => (
          <div key={clip.id || i} style={{
            background: '#fff', borderRadius: 14,
            border: '1px solid #e8e5e0', overflow: 'hidden',
            boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
          }}>
            {/* Video */}
            <div style={{
              background: '#111', aspectRatio: '9/16',
              maxHeight: 220, display: 'flex', alignItems: 'center',
              justifyContent: 'center', position: 'relative', overflow: 'hidden',
              cursor: 'pointer',
            }} onClick={() => setPlaying(playing === (clip.id || i) ? null : (clip.id || i))}>
              {playing === (clip.id || i) ? (
                <video
                  src={`${BACKEND}${clip.stream_url}`}
                  controls autoPlay
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onEnded={() => setPlaying(null)}
                />
              ) : (
                <>
                  <div style={{
                    width: 44, height: 44, borderRadius: '50%',
                    background: 'rgba(255,255,255,0.15)',
                    border: '2px solid rgba(255,255,255,0.35)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', fontSize: 18,
                  }}>▶</div>
                  {clip.duration && (
                    <div style={{
                      position: 'absolute', bottom: 8, right: 8,
                      background: 'rgba(0,0,0,0.6)', color: '#fff',
                      fontSize: 11, padding: '2px 6px', borderRadius: 4,
                    }}>{Math.round(clip.duration)}s</div>
                  )}
                </>
              )}
            </div>

            {/* Info */}
            <div style={{ padding: '14px 16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                <div style={{
                  fontSize: 13, fontWeight: 600, lineHeight: 1.3,
                  flex: 1, marginRight: 8, color: '#1a1a1a',
                  minHeight: 18,
                }}>
                  {clip.title || `Clip ${i + 1}`}
                </div>
                <ScoreBadge score={clip.score} />
              </div>
              <div style={{ fontSize: 12, color: '#aaa', marginBottom: 14 }}>
                {clip.duration ? `${Math.round(clip.duration)}s` : '—'} · Viral clip
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <a
                  href={`${BACKEND}${clip.download_url}`}
                  download
                  style={{
                    flex: 1, padding: '9px', borderRadius: 8,
                    background: '#5b4cf5', color: '#fff',
                    fontSize: 13, fontWeight: 500, textAlign: 'center',
                    display: 'block', border: 'none',
                  }}
                >Download</a>
                <button style={{
                  flex: 1, padding: '9px', borderRadius: 8,
                  background: '#f5f4f1', color: '#444',
                  fontSize: 13, fontWeight: 500, border: 'none',
                }}>Publish</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

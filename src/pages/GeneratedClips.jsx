import { useState } from 'react'
const BACKEND = 'https://web-production-189e9.up.railway.app'

function Score({ score }) {
  const s = parseInt(score) || 0
  const color = s >= 85 ? '#22c55e' : s >= 70 ? '#f59e0b' : '#f87171'
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <div style={{ flex: 1, height: 4, background: '#333', borderRadius: 2 }}>
        <div style={{ width: `${s}%`, height: '100%', background: color, borderRadius: 2 }} />
      </div>
      <span style={{ fontSize: 12, fontWeight: 700, color, minWidth: 28 }}>{s}</span>
    </div>
  )
}

export default function GeneratedClips({ clips }) {
  const [playing, setPlaying] = useState(null)

  if (!clips || clips.length === 0) return (
    <div style={{ padding: '40px 24px', background: '#0d0d0d', minHeight: '100vh' }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: '#fff', marginBottom: 8 }}>My Clips</h1>
      <p style={{ color: '#666', fontSize: 13.5, marginBottom: 40 }}>Your AI-generated clips will appear here.</p>
      <div style={{ border: '2px dashed #2a2a2a', borderRadius: 14, padding: '60px 24px', textAlign: 'center', color: '#444' }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>✂</div>
        <div style={{ fontSize: 15, fontWeight: 500, color: '#666' }}>No clips yet</div>
        <div style={{ fontSize: 13, marginTop: 6 }}>Upload a video from the Dashboard to generate clips</div>
      </div>
    </div>
  )

  return (
    <div style={{ padding: '24px', background: '#0d0d0d', minHeight: '100vh' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#fff', marginBottom: 4 }}>My Clips</h1>
        <p style={{ color: '#666', fontSize: 13.5 }}>{clips.length} clips generated — ready to download or publish</p>
      </div>
      <div className="clips-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
        {clips.map((clip, i) => (
          <div key={clip.id || i} style={{ background: '#111', borderRadius: 14, border: '1px solid #1f1f1f', overflow: 'hidden' }}>
            <div style={{
              background: '#0a0a0a', aspectRatio: '9/16', maxHeight: 200,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              position: 'relative', cursor: 'pointer',
            }} onClick={() => setPlaying(playing === i ? null : i)}>
              {playing === i ? (
                <video src={`${BACKEND}${clip.stream_url}`} controls autoPlay
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onEnded={() => setPlaying(null)} />
              ) : (
                <>
                  <div style={{
                    width: 48, height: 48, borderRadius: '50%',
                    background: 'rgba(91,76,245,0.3)', border: '2px solid rgba(91,76,245,0.6)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 18,
                  }}>▶</div>
                  {clip.duration && (
                    <div style={{ position: 'absolute', bottom: 8, right: 8, background: 'rgba(0,0,0,0.7)', color: '#fff', fontSize: 11, padding: '2px 6px', borderRadius: 4 }}>
                      {Math.round(clip.duration)}s
                    </div>
                  )}
                </>
              )}
            </div>
            <div style={{ padding: '14px' }}>
              <div style={{ fontWeight: 600, fontSize: 13, color: '#fff', marginBottom: 8, lineHeight: 1.3 }}>
                {clip.title || `Clip ${i + 1}`}
              </div>
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 10.5, color: '#555', marginBottom: 4, letterSpacing: '0.5px' }}>VIRAL SCORE</div>
                <Score score={clip.score} />
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <a href={`${BACKEND}${clip.download_url}`} download style={{
                  flex: 1, padding: '8px', borderRadius: 8,
                  background: 'linear-gradient(135deg, #5b4cf5, #8b5cf6)', color: '#fff',
                  fontSize: 12.5, fontWeight: 600, textAlign: 'center', display: 'block', border: 'none',
                }}>Download</a>
                <button style={{
                  flex: 1, padding: '8px', borderRadius: 8,
                  background: '#1a1a1a', color: '#aaa', fontSize: 12.5, border: '1px solid #2a2a2a',
                }}>Publish</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

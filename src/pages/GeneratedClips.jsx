import { useState } from 'react'

const BACKEND = 'https://web-production-189e9.up.railway.app'

function ScoreBadge({ score }) {
  const color = score >= 85 ? '#16a34a' : score >= 70 ? '#ca8a04' : '#dc2626'
  return (
    <span style={{
      fontSize: 11, fontWeight: 600, color,
      background: color + '15', borderRadius: 4,
      padding: '2px 7px',
    }}>{score}/100</span>
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
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '36px 24px' }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.5px', marginBottom: 4 }}>
          Generated clips
        </h1>
        <p style={{ color: '#888', fontSize: 13.5 }}>{clips.length} clips ready to download</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
        {clips.map((clip, i) => (
          <div key={clip.id || i} style={{
            background: '#fff', borderRadius: 12,
            border: '1px solid #e8e5e0', overflow: 'hidden',
          }}>
            {/* Video preview */}
            <div style={{
              background: '#1a1a1a', aspectRatio: '9/16',
              maxHeight: 200, display: 'flex', alignItems: 'center',
              justifyContent: 'center', position: 'relative', overflow: 'hidden',
            }}>
              {playing === clip.id ? (
                <video
                  src={`${BACKEND}${clip.stream_url}`}
                  controls autoPlay
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onEnded={() => setPlaying(null)}
                />
              ) : (
                <button onClick={() => setPlaying(clip.id)} style={{
                  background: 'rgba(255,255,255,0.15)', border: '2px solid rgba(255,255,255,0.4)',
                  borderRadius: '50%', width: 44, height: 44,
                  color: '#fff', fontSize: 18, display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                }}>▶</button>
              )}
            </div>
            {/* Info */}
            <div style={{ padding: '14px 16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <div style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.3, flex: 1, marginRight: 8 }}>
                  {clip.title}
                </div>
                <ScoreBadge score={clip.score} />
              </div>
              <div style={{ fontSize: 12, color: '#999', marginBottom: 14 }}>
                {clip.duration}s · Viral score
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <a
                  href={`${BACKEND}${clip.download_url}`}
                  download
                  style={{
                    flex: 1, padding: '8px', borderRadius: 8,
                    background: '#5b4cf5', color: '#fff',
                    fontSize: 12.5, fontWeight: 500, textAlign: 'center',
                    border: 'none', display: 'block',
                  }}
                >
                  Download
                </a>
                <button style={{
                  flex: 1, padding: '8px', borderRadius: 8,
                  background: '#f5f4f1', color: '#444',
                  fontSize: 12.5, fontWeight: 500, border: 'none',
                }}>Publish</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Landing({ setPage, dark }) {
  const bg = dark ? '#0f0f0f' : '#fff'
  const text = dark ? '#e8e8e8' : '#1a1a1a'
  const sub = dark ? '#888' : '#666'
  const card = dark ? '#1a1a1a' : '#f8f7f5'
  const border = dark ? '#2a2a2a' : '#e8e5e0'

  const features = [
    { icon: '⚡', title: 'AI Clip Detection', desc: 'Automatically finds the most viral moments in any video' },
    { icon: '📝', title: 'Auto Subtitles', desc: 'Burns in accurate subtitles in 50+ languages instantly' },
    { icon: '📱', title: '9:16 Formatting', desc: 'Perfectly reformats clips for TikTok, Reels and Shorts' },
    { icon: '🚀', title: 'Direct Publishing', desc: 'Publish directly to all social platforms in one click' },
    { icon: '🎯', title: 'Viral Scoring', desc: 'Each clip gets a viral score so you know what will perform' },
    { icon: '🌍', title: '50+ Languages', desc: 'Full subtitle support for Lithuanian, German, French and more' },
  ]

  return (
    <div style={{ background: bg, color: text, minHeight: '100vh', fontFamily: 'DM Sans, sans-serif' }}>
      {/* Nav */}
      <nav style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '16px 48px', borderBottom: `1px solid ${border}`,
        position: 'sticky', top: 0, background: bg, zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <img src="/logo.png" alt="ClipGen.AI" style={{ width: 36, height: 36, borderRadius: '50%' }} />
          <span style={{ fontWeight: 700, fontSize: 16, letterSpacing: '-0.4px' }}>ClipGen.AI</span>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <button onClick={() => setPage('pricing')} style={{
            background: 'none', border: 'none', color: sub, fontSize: 14, cursor: 'pointer', padding: '8px 12px',
          }}>Pricing</button>
          <button onClick={() => setPage('dashboard')} style={{
            background: '#5b4cf5', color: '#fff', border: 'none',
            borderRadius: 8, padding: '9px 20px', fontSize: 14, fontWeight: 500, cursor: 'pointer',
          }}>Get started</button>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ textAlign: 'center', padding: '80px 24px 64px', maxWidth: 700, margin: '0 auto' }}>
        <div style={{
          display: 'inline-block', background: '#f0eeff', color: '#5b4cf5',
          borderRadius: 20, padding: '5px 14px', fontSize: 12.5,
          fontWeight: 500, marginBottom: 24,
        }}>AI-powered video clipping</div>
        <h1 style={{
          fontSize: 52, fontWeight: 700, letterSpacing: '-2px',
          lineHeight: 1.1, marginBottom: 20, color: text,
        }}>
          Turn long videos into<br />
          <span style={{ color: '#5b4cf5' }}>viral clips</span> automatically
        </h1>
        <p style={{ fontSize: 17, color: sub, lineHeight: 1.6, marginBottom: 36, maxWidth: 520, margin: '0 auto 36px' }}>
          Upload any video. AI finds the best moments, adds subtitles, formats for TikTok, Reels and Shorts — in minutes.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => setPage('dashboard')} style={{
            background: '#5b4cf5', color: '#fff', border: 'none',
            borderRadius: 10, padding: '14px 32px', fontSize: 15,
            fontWeight: 600, cursor: 'pointer',
          }}>Start for free →</button>
          <button onClick={() => setPage('pricing')} style={{
            background: card, color: text, border: `1px solid ${border}`,
            borderRadius: 10, padding: '14px 32px', fontSize: 15,
            fontWeight: 500, cursor: 'pointer',
          }}>View pricing</button>
        </div>
      </div>

      {/* Features */}
      <div style={{ maxWidth: 900, margin: '0 auto 80px', padding: '0 24px' }}>
        <h2 style={{ textAlign: 'center', fontSize: 32, fontWeight: 700, letterSpacing: '-1px', marginBottom: 48, color: text }}>
          Everything you need
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
          {features.map(f => (
            <div key={f.title} style={{
              background: card, border: `1px solid ${border}`, borderRadius: 14, padding: '24px',
            }}>
              <div style={{ fontSize: 28, marginBottom: 12 }}>{f.icon}</div>
              <div style={{ fontWeight: 600, fontSize: 14.5, marginBottom: 6, color: text }}>{f.title}</div>
              <div style={{ fontSize: 13.5, color: sub, lineHeight: 1.5 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ background: '#5b4cf5', padding: '64px 24px', textAlign: 'center', color: '#fff' }}>
        <h2 style={{ fontSize: 36, fontWeight: 700, letterSpacing: '-1px', marginBottom: 16 }}>Ready to go viral?</h2>
        <p style={{ fontSize: 16, opacity: 0.8, marginBottom: 32 }}>Join creators using ClipGen.AI to grow their audience</p>
        <button onClick={() => setPage('dashboard')} style={{
          background: '#fff', color: '#5b4cf5', border: 'none',
          borderRadius: 10, padding: '14px 36px', fontSize: 15, fontWeight: 700, cursor: 'pointer',
        }}>Get started free →</button>
      </div>

      {/* Footer */}
      <div style={{ padding: '24px 48px', borderTop: `1px solid ${border}`, display: 'flex', justifyContent: 'space-between', color: sub, fontSize: 13 }}>
        <span>© 2026 ClipGen.AI</span>
        <span>Built for creators worldwide</span>
      </div>
    </div>
  )
}

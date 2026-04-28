export default function Projects({ dark }) {
  const bg = dark ? '#0f0f0f' : '#f8f7f5'
  const text = dark ? '#e8e8e8' : '#1a1a1a'
  const sub = dark ? '#888' : '#666'
  const border = dark ? '#2a2a2a' : '#e0ddd6'
  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '36px 24px', background: bg, minHeight: '100vh' }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.5px', marginBottom: 4, color: text }}>Projects</h1>
        <p style={{ color: sub, fontSize: 13.5 }}>All your video projects in one place.</p>
      </div>
      <div style={{ border: `2px dashed ${border}`, borderRadius: 12, padding: '48px 24px', textAlign: 'center', color: sub }}>
        <div style={{ fontSize: 32, marginBottom: 12 }}>◫</div>
        <div style={{ fontSize: 14, fontWeight: 500, color: text, marginBottom: 6 }}>No projects yet</div>
        <div style={{ fontSize: 13 }}>Projects will appear here after you generate clips</div>
      </div>
    </div>
  )
}

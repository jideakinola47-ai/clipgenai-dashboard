export default function Projects() {
  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '36px 24px' }}>
      <h1 style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.5px', marginBottom: 4 }}>Projects</h1>
      <p style={{ color: '#888', fontSize: 13.5, marginBottom: 32 }}>All your video projects in one place.</p>
      <div style={{
        border: '2px dashed #e0ddd6', borderRadius: 12,
        padding: '48px 24px', textAlign: 'center', color: '#aaa',
      }}>
        <div style={{ fontSize: 14, fontWeight: 500 }}>No projects yet</div>
        <div style={{ fontSize: 13, marginTop: 6 }}>Projects will appear here after you generate clips</div>
      </div>
    </div>
  )
}

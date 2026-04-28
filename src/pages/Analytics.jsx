export default function Analytics({ dark }) {
  const bg = dark ? '#0f0f0f' : '#f8f7f5'
  const text = dark ? '#e8e8e8' : '#1a1a1a'
  const sub = dark ? '#888' : '#666'
  const card = dark ? '#1a1a1a' : '#fff'
  const border = dark ? '#2a2a2a' : '#e8e5e0'
  const stats = [
    { label: 'Videos processed', value: '0', change: '' },
    { label: 'Clips generated', value: '0', change: '' },
    { label: 'Total downloads', value: '0', change: '' },
    { label: 'Avg viral score', value: '—', change: '' },
  ]
  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '36px 24px', background: bg, minHeight: '100vh' }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.5px', marginBottom: 4, color: text }}>Analytics</h1>
        <p style={{ color: sub, fontSize: 13.5 }}>Track your clip performance over time.</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14, marginBottom: 28 }}>
        {stats.map(s => (
          <div key={s.label} style={{ background: card, border: `1px solid ${border}`, borderRadius: 12, padding: '22px' }}>
            <div style={{ fontSize: 32, fontWeight: 700, letterSpacing: '-1px', marginBottom: 4, color: text }}>{s.value}</div>
            <div style={{ fontSize: 12.5, color: sub }}>{s.label}</div>
          </div>
        ))}
      </div>
      <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 12, padding: '32px', textAlign: 'center', color: sub }}>
        <div style={{ fontSize: 13.5 }}>Analytics data will appear after your first video is processed</div>
      </div>
    </div>
  )
}

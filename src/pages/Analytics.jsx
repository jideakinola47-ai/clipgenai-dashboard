export default function Analytics() {
  const stats = [
    { label: 'Videos processed', value: '0' },
    { label: 'Clips generated', value: '0' },
    { label: 'Total views', value: '0' },
    { label: 'Avg viral score', value: '—' },
  ]
  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '36px 24px' }}>
      <h1 style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.5px', marginBottom: 4 }}>Analytics</h1>
      <p style={{ color: '#888', fontSize: 13.5, marginBottom: 32 }}>Track your clip performance over time.</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14, marginBottom: 32 }}>
        {stats.map(s => (
          <div key={s.label} style={{
            background: '#fff', border: '1px solid #e8e5e0',
            borderRadius: 12, padding: '20px 22px',
          }}>
            <div style={{ fontSize: 28, fontWeight: 600, letterSpacing: '-1px', marginBottom: 4 }}>{s.value}</div>
            <div style={{ fontSize: 12.5, color: '#888' }}>{s.label}</div>
          </div>
        ))}
      </div>
      <div style={{
        background: '#fff', border: '1px solid #e8e5e0',
        borderRadius: 12, padding: '24px', textAlign: 'center', color: '#ccc',
      }}>
        <div style={{ fontSize: 13 }}>Analytics data will appear after your first video is processed</div>
      </div>
    </div>
  )
}

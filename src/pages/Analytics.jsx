export default function Analytics() {
  const bars = [40, 65, 45, 80, 95, 72]
  const months = ['Nov','Dec','Jan','Feb','Mar','Apr']
  const stats = [
    { label: 'Clips Generated', value: '0', sub: 'This month', color: '#5b4cf5' },
    { label: 'Total Views', value: '0', sub: 'Across all platforms', color: '#22c55e' },
    { label: 'Avg Viral Score', value: '—', sub: 'Per clip', color: '#f59e0b' },
    { label: 'Total Downloads', value: '0', sub: 'All time', color: '#ec4899' },
  ]
  return (
    <div style={{ padding: '24px', background: '#0d0d0d', minHeight: '100vh' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#fff', marginBottom: 4 }}>Analytics</h1>
        <p style={{ color: '#666', fontSize: 13.5 }}>Track your content performance over time.</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14, marginBottom: 24 }}>
        {stats.map(s => (
          <div key={s.label} style={{ background: '#111', border: '1px solid #1f1f1f', borderRadius: 12, padding: '20px', borderTop: `2px solid ${s.color}` }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: '#fff', letterSpacing: '-1px', marginBottom: 4 }}>{s.value}</div>
            <div style={{ fontSize: 13, fontWeight: 500, color: '#ccc', marginBottom: 2 }}>{s.label}</div>
            <div style={{ fontSize: 11.5, color: '#555' }}>{s.sub}</div>
          </div>
        ))}
      </div>
      <div style={{ background: '#111', border: '1px solid #1f1f1f', borderRadius: 14, padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
          <div style={{ fontWeight: 600, color: '#fff', fontSize: 15 }}>Monthly Performance</div>
          <div style={{ fontSize: 12, color: '#555' }}>Last 6 months</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, height: 140 }}>
          {bars.map((h, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <div style={{ width: '100%', height: `${h}%`, borderRadius: 6, background: i === 4 ? 'linear-gradient(180deg, #8b5cf6, #5b4cf5)' : '#1f1f1f', transition: 'all 0.3s' }} />
              <div style={{ fontSize: 11, color: '#555' }}>{months[i]}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 20, padding: '16px', background: '#0d0d0d', borderRadius: 10, textAlign: 'center', color: '#444', fontSize: 13 }}>
          Process videos to see real analytics data here
        </div>
      </div>
    </div>
  )
}

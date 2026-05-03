import { useTheme } from '../contexts/ThemeContext'

export default function Analytics() {
  const { isDark } = useTheme()
  
  const theme = {
    bg: isDark ? '#0d0d0d' : '#f8f7f5',
    cardBg: isDark ? '#111' : '#ffffff',
    border: isDark ? '#1f1f1f' : '#e8e5e0',
    text: isDark ? '#fff' : '#0a0a0a',
    textMuted: isDark ? '#888' : '#666',
  }

  const bars = [40, 65, 45, 80, 95, 72]
  const months = ['Nov','Dec','Jan','Feb','Mar','Apr']
  const stats = [
    { label: 'Clips Generated', value: '0', sub: 'This month', color: '#5b4cf5' },
    { label: 'Total Views', value: '0', sub: 'Across all platforms', color: '#22c55e' },
    { label: 'Avg Viral Score', value: '—', sub: 'Per clip', color: '#f59e0b' },
    { label: 'Total Downloads', value: '0', sub: 'All time', color: '#ec4899' },
  ]
  
  return (
    <div style={{ padding: '24px', background: theme.bg, minHeight: '100vh' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: theme.text, marginBottom: 4 }}>Analytics</h1>
        <p style={{ color: theme.textMuted, fontSize: 13.5 }}>Track your content performance over time.</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14, marginBottom: 24 }}>
        {stats.map(s => (
          <div key={s.label} style={{ background: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: 12, padding: '20px', borderTop: `2px solid ${s.color}` }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: theme.text, letterSpacing: '-1px', marginBottom: 4 }}>{s.value}</div>
            <div style={{ fontSize: 13, fontWeight: 500, color: theme.textMuted, marginBottom: 2 }}>{s.label}</div>
            <div style={{ fontSize: 11.5, color: theme.textMuted }}>{s.sub}</div>
          </div>
        ))}
      </div>
      <div style={{ background: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: 14, padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
          <div style={{ fontWeight: 600, color: theme.text, fontSize: 15 }}>Monthly Performance</div>
          <div style={{ fontSize: 12, color: theme.textMuted }}>Last 6 months</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, height: 140 }}>
          {bars.map((h, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <div style={{ width: '100%', height: `${h}%`, borderRadius: 6, background: i === 4 ? 'linear-gradient(180deg, #8b5cf6, #5b4cf5)' : theme.border, transition: 'all 0.3s' }} />
              <div style={{ fontSize: 11, color: theme.textMuted }}>{months[i]}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 20, padding: '16px', background: theme.bg, borderRadius: 10, textAlign: 'center', color: theme.textMuted, fontSize: 13 }}>
          Process videos to see real analytics data here
        </div>
      </div>
    </div>
  )
}
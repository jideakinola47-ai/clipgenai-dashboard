const NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: '⊞' },
  { id: 'clips', label: 'My Clips', icon: '✂' },
  { id: 'analytics', label: 'Analytics', icon: '↗' },
  { id: 'pricing', label: 'Upgrade Plan', icon: '◈' },
  { id: 'settings', label: 'Settings', icon: '⊙' },
]

export default function Sidebar({ page, setPage }) {
  return (
    <aside className="sidebar" style={{
      width: 240, background: '#111', borderRight: '1px solid #1f1f1f',
      display: 'flex', flexDirection: 'column', flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid #1f1f1f' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <img src="/logo.png" style={{ width: 34, height: 34, borderRadius: '50%' }} />
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, color: '#fff', letterSpacing: '-0.3px' }}>ClipGen.AI</div>
            <div style={{ fontSize: 10.5, color: '#5b4cf5', fontWeight: 500 }}>Pro Plan</div>
          </div>
        </div>
      </div>

      {/* Social badges */}
      <div style={{ padding: '12px 16px', borderBottom: '1px solid #1f1f1f', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {[['TikTok','#010101'],['Instagram','#e1306c'],['YouTube','#ff0000']].map(([name, color]) => (
          <div key={name} style={{
            background: color + '22', border: `1px solid ${color}44`,
            borderRadius: 6, padding: '3px 8px', fontSize: 10.5,
            color: '#ccc', display: 'flex', alignItems: 'center', gap: 4,
          }}>
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#22c55e' }} />
            {name}
          </div>
        ))}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 10px' }}>
        {NAV.map(item => (
          <button key={item.id} onClick={() => setPage(item.id)} style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 12px', borderRadius: 8, border: 'none',
            background: page === item.id ? '#5b4cf520' : 'transparent',
            color: page === item.id ? '#7c6af7' : '#888',
            fontWeight: page === item.id ? 600 : 400,
            fontSize: 13.5, marginBottom: 2, cursor: 'pointer', textAlign: 'left',
            borderLeft: page === item.id ? '2px solid #5b4cf5' : '2px solid transparent',
          }}>
            <span style={{ fontSize: 16 }}>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Usage meter */}
      <div style={{ padding: '16px', borderTop: '1px solid #1f1f1f' }}>
        <div style={{ background: '#1a1a1a', borderRadius: 10, padding: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 11.5, color: '#888' }}>Videos This Month</span>
            <span style={{ fontSize: 11.5, color: '#5b4cf5', fontWeight: 600 }}>46%</span>
          </div>
          <div style={{ height: 4, background: '#333', borderRadius: 2, marginBottom: 6 }}>
            <div style={{ width: '46%', height: '100%', background: 'linear-gradient(90deg, #5b4cf5, #8b5cf6)', borderRadius: 2 }} />
          </div>
          <div style={{ fontSize: 10.5, color: '#666' }}>23 / 50 videos used</div>
        </div>
        <button onClick={() => setPage('pricing')} style={{
          width: '100%', marginTop: 10, padding: '9px', borderRadius: 8,
          background: 'linear-gradient(135deg, #5b4cf5, #8b5cf6)',
          color: '#fff', fontWeight: 600, fontSize: 13, border: 'none',
        }}>⚡ Upgrade Plan</button>
        {/* User */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12 }}>
          <div style={{
            width: 30, height: 30, borderRadius: '50%', background: '#5b4cf5',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontSize: 12, fontWeight: 700,
          }}>K</div>
          <div>
            <div style={{ fontSize: 12.5, color: '#ddd', fontWeight: 500 }}>Kajus T.</div>
            <div style={{ fontSize: 10.5, color: '#666' }}>Pro Plan</div>
          </div>
        </div>
      </div>
    </aside>
  )
}

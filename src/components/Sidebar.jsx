const NAV = [
  { id: 'dashboard', icon: '⊞', label: 'Dashboard' },
  { id: 'clips', icon: '✂', label: 'Generated Clips' },
  { id: 'projects', icon: '◫', label: 'Projects' },
  { id: 'analytics', icon: '↗', label: 'Analytics' },
  { id: 'pricing', icon: '◈', label: 'Pricing' },
  { id: 'settings', icon: '⊙', label: 'Settings' },
]

export default function Sidebar({ page, setPage, dark, setDark, sidebarBg, border }) {
  const text = dark ? '#e8e8e8' : '#1a1a1a'
  const sub = dark ? '#666' : '#999'
  const active = dark ? '#2a2561' : '#f0eeff'
  const activeText = '#5b4cf5'

  return (
    <aside style={{
      width: 220, background: sidebarBg,
      borderRight: `1px solid ${border}`,
      display: 'flex', flexDirection: 'column',
      flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{
        padding: '18px 20px',
        borderBottom: `1px solid ${border}`,
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <img src="/logo.png" alt="ClipGen.AI"
            style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }} />
          <span style={{ fontWeight: 700, fontSize: 14, letterSpacing: '-0.3px', color: text }}>
            ClipGen.AI
          </span>
        </div>
        {/* Dark mode toggle */}
        <button onClick={() => setDark(!dark)} title="Toggle theme" style={{
          background: 'none', border: 'none', cursor: 'pointer',
          fontSize: 16, color: sub, padding: 2,
        }}>{dark ? '☀' : '☾'}</button>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 10px' }}>
        {NAV.map(item => (
          <button key={item.id} onClick={() => setPage(item.id)} style={{
            width: '100%',
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '9px 10px',
            borderRadius: 8, border: 'none',
            background: page === item.id ? active : 'transparent',
            color: page === item.id ? activeText : sub,
            fontWeight: page === item.id ? 600 : 400,
            fontSize: 13.5, marginBottom: 2,
            transition: 'all 0.15s', cursor: 'pointer',
            textAlign: 'left',
          }}>
            <span style={{ fontSize: 15, minWidth: 18 }}>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Bottom — go to landing */}
      <div style={{ padding: '12px 10px', borderTop: `1px solid ${border}` }}>
        <button onClick={() => setPage('landing')} style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: 10,
          padding: '9px 10px', borderRadius: 8, border: 'none',
          background: 'transparent', color: sub,
          fontSize: 13.5, cursor: 'pointer', marginBottom: 10,
        }}>
          <span style={{ fontSize: 15 }}>←</span>
          <span>Home page</span>
        </button>

        {/* User */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '10px 10px',
          borderRadius: 8,
          background: dark ? '#1f1f1f' : '#f5f4f1',
        }}>
          <div style={{
            width: 30, height: 30, borderRadius: '50%',
            background: '#5b4cf5',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 12, fontWeight: 700, color: '#fff', flexShrink: 0,
          }}>K</div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontSize: 12.5, fontWeight: 600, color: text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              Kajus T.
            </div>
            <div style={{ fontSize: 11, color: sub }}>Business Plan</div>
          </div>
        </div>
      </div>
    </aside>
  )
}

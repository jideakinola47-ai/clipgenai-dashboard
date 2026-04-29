const NAV = [
  { id: 'dashboard', icon: '⊞', label: 'Dashboard' },
  { id: 'clips', icon: '✂', label: 'Clips' },
  { id: 'projects', icon: '◫', label: 'Projects' },
  { id: 'analytics', icon: '↗', label: 'Analytics' },
  { id: 'pricing', icon: '◈', label: 'Pricing' },
  { id: 'settings', icon: '⊙', label: 'Settings' },
]

export default function MobileNav({ page, setPage, dark, setDark, border, bg, mobileMenuOpen, setMobileMenuOpen }) {
  const text = dark ? '#e8e8e8' : '#1a1a1a'
  const sub = dark ? '#666' : '#999'
  const active = '#5b4cf5'

  return (
    <>
      {/* Mobile top bar */}
      <div style={{
        display: 'none',
        padding: '12px 16px',
        borderBottom: `1px solid ${border}`,
        background: bg,
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 50,
      }} id="mobile-topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <img src="/logo.png" alt="ClipGen.AI" style={{ width: 30, height: 30, borderRadius: '50%' }} />
          <span style={{ fontWeight: 700, fontSize: 15, color: text }}>ClipGen.AI</span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => setDark(!dark)} style={{
            background: 'none', border: 'none', color: sub, fontSize: 18, cursor: 'pointer', padding: 4,
          }}>{dark ? '☀' : '☾'}</button>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} style={{
            background: 'none', border: `1px solid ${border}`, color: text,
            borderRadius: 8, padding: '6px 10px', fontSize: 16, cursor: 'pointer',
          }}>☰</button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div style={{
          display: 'none',
          position: 'fixed', top: 57, left: 0, right: 0,
          background: bg, borderBottom: `1px solid ${border}`,
          zIndex: 200, padding: '8px 12px',
        }} id="mobile-menu">
          {NAV.map(item => (
            <button key={item.id} onClick={() => { setPage(item.id); setMobileMenuOpen(false) }} style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 12,
              padding: '12px 12px', borderRadius: 8, border: 'none',
              background: page === item.id ? '#f0eeff' : 'transparent',
              color: page === item.id ? active : text,
              fontWeight: page === item.id ? 600 : 400,
              fontSize: 14, marginBottom: 2, cursor: 'pointer', textAlign: 'left',
            }}>
              <span style={{ fontSize: 16 }}>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
          <button onClick={() => { setPage('landing'); setMobileMenuOpen(false) }} style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 12,
            padding: '12px 12px', borderRadius: 8, border: 'none',
            background: 'transparent', color: sub,
            fontSize: 14, cursor: 'pointer', textAlign: 'left', marginTop: 4,
            borderTop: `1px solid ${border}`,
          }}>
            <span>←</span><span>Home page</span>
          </button>
        </div>
      )}

      {/* Bottom mobile nav bar */}
      <div style={{
        display: 'none',
        position: 'fixed', bottom: 0, left: 0, right: 0,
        background: bg, borderTop: `1px solid ${border}`,
        padding: '8px 4px', zIndex: 100,
        justifyContent: 'space-around',
      }} id="mobile-bottom-nav">
        {NAV.slice(0, 5).map(item => (
          <button key={item.id} onClick={() => setPage(item.id)} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
            background: 'none', border: 'none', cursor: 'pointer',
            color: page === item.id ? active : sub,
            fontSize: 10, fontWeight: page === item.id ? 600 : 400,
            padding: '4px 8px', borderRadius: 8,
            minWidth: 52,
          }}>
            <span style={{ fontSize: 20 }}>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      <style>{`
        @media (max-width: 768px) {
          #mobile-topbar { display: flex !important; }
          #mobile-bottom-nav { display: flex !important; }
          #mobile-menu { display: block !important; }
          aside { display: none !important; }
          main { padding-bottom: 70px !important; }
        }
      `}</style>
    </>
  )
}

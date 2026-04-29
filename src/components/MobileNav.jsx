import { useState } from 'react'
const NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: '⊞' },
  { id: 'clips', label: 'Clips', icon: '✂' },
  { id: 'analytics', label: 'Analytics', icon: '↗' },
  { id: 'pricing', label: 'Upgrade', icon: '◈' },
  { id: 'settings', label: 'Settings', icon: '⊙' },
]
export default function MobileNav({ page, setPage }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <div className="mobile-topbar" style={{
        display: 'none', padding: '12px 16px', background: '#111',
        borderBottom: '1px solid #1f1f1f', alignItems: 'center',
        justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <img src="/logo.png" style={{ width: 28, height: 28, borderRadius: '50%' }} />
          <span style={{ fontWeight: 700, fontSize: 15, color: '#fff' }}>ClipGen.AI</span>
        </div>
        <button onClick={() => setOpen(!open)} style={{
          background: '#1a1a1a', border: '1px solid #333', color: '#fff',
          borderRadius: 8, padding: '6px 10px', fontSize: 16,
        }}>☰</button>
      </div>
      {open && (
        <div style={{
          position: 'fixed', top: 57, left: 0, right: 0, background: '#111',
          borderBottom: '1px solid #1f1f1f', zIndex: 200, padding: '8px 12px',
        }}>
          {NAV.map(item => (
            <button key={item.id} onClick={() => { setPage(item.id); setOpen(false) }} style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 10,
              padding: '12px', borderRadius: 8, border: 'none',
              background: page === item.id ? '#5b4cf520' : 'transparent',
              color: page === item.id ? '#7c6af7' : '#aaa',
              fontSize: 14, marginBottom: 2, cursor: 'pointer', textAlign: 'left',
            }}>
              <span>{item.icon}</span><span>{item.label}</span>
            </button>
          ))}
        </div>
      )}
      <nav className="mobile-nav" style={{
        display: 'none', position: 'fixed', bottom: 0, left: 0, right: 0,
        background: '#111', borderTop: '1px solid #1f1f1f',
        padding: '8px 4px', zIndex: 100, justifyContent: 'space-around',
      }}>
        {NAV.map(item => (
          <button key={item.id} onClick={() => setPage(item.id)} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
            background: 'none', border: 'none', cursor: 'pointer',
            color: page === item.id ? '#7c6af7' : '#666',
            fontSize: 10, fontWeight: page === item.id ? 600 : 400,
            padding: '4px 8px', minWidth: 52,
          }}>
            <span style={{ fontSize: 20 }}>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </>
  )
}

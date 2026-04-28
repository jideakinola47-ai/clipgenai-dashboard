import { useState } from 'react'

const NAV = [
  { id: 'dashboard', icon: '⊞', label: 'Dashboard' },
  { id: 'clips', icon: '✂', label: 'Generated Clips' },
  { id: 'projects', icon: '◫', label: 'Projects' },
  { id: 'analytics', icon: '╱╲', label: 'Analytics' },
  { id: 'settings', icon: '⊙', label: 'Settings' },
]

export default function Sidebar({ page, setPage }) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside style={{
      width: collapsed ? 64 : 220,
      background: '#fff',
      borderRight: '1px solid #e8e5e0',
      display: 'flex',
      flexDirection: 'column',
      transition: 'width 0.2s ease',
      flexShrink: 0,
      overflow: 'hidden',
    }}>
      {/* Logo */}
      <div style={{
        padding: collapsed ? '20px 16px' : '20px 20px',
        borderBottom: '1px solid #e8e5e0',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        justifyContent: collapsed ? 'center' : 'space-between',
      }}>
        {!collapsed && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 28, height: 28, borderRadius: 8,
              background: '#5b4cf5',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontSize: 13, fontWeight: 600,
            }}>C</div>
            <span style={{ fontWeight: 600, fontSize: 14, letterSpacing: '-0.3px' }}>ClipGen.AI</span>
          </div>
        )}
        {collapsed && (
          <div style={{
            width: 28, height: 28, borderRadius: 8,
            background: '#5b4cf5',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontSize: 13, fontWeight: 600,
          }}>C</div>
        )}
        <button onClick={() => setCollapsed(!collapsed)} style={{
          background: 'none', border: 'none', color: '#999',
          fontSize: 16, padding: 2, display: 'flex',
        }}>{collapsed ? '→' : '←'}</button>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 10px' }}>
        {NAV.map(item => (
          <button key={item.id} onClick={() => setPage(item.id)} style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: collapsed ? '9px 0' : '9px 10px',
            justifyContent: collapsed ? 'center' : 'flex-start',
            borderRadius: 8,
            border: 'none',
            background: page === item.id ? '#f0eeff' : 'transparent',
            color: page === item.id ? '#5b4cf5' : '#666',
            fontWeight: page === item.id ? 500 : 400,
            fontSize: 13.5,
            marginBottom: 2,
            transition: 'all 0.15s',
          }}>
            <span style={{ fontSize: 15, minWidth: 16, textAlign: 'center' }}>{item.icon}</span>
            {!collapsed && <span>{item.label}</span>}
          </button>
        ))}
      </nav>

      {/* User */}
      {!collapsed && (
        <div style={{
          padding: '14px 16px',
          borderTop: '1px solid #e8e5e0',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}>
          <div style={{
            width: 30, height: 30, borderRadius: '50%',
            background: '#e8e5e0',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 12, fontWeight: 600, color: '#666',
          }}>K</div>
          <div>
            <div style={{ fontSize: 12.5, fontWeight: 500 }}>Kajus T.</div>
            <div style={{ fontSize: 11, color: '#999' }}>Business Plan</div>
          </div>
        </div>
      )}
    </aside>
  )
}

import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useTheme } from '../contexts/ThemeContext'
import ThemeToggle from './ThemeToggle'

const NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: '⊞', path: '/dashboard' },
  { id: 'clips', label: 'Clips', icon: '✂', path: '/clips' },
  { id: 'analytics', label: 'Analytics', icon: '↗', path: '/analytics' },
  { id: 'pricing', label: 'Upgrade', icon: '◈', path: '/pricing' },
  { id: 'settings', label: 'Settings', icon: '⊙', path: '/settings' },
]

export default function MobileNav() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { isDark } = useTheme()
  const currentPath = location.pathname

  const theme = {
    bg: isDark ? '#0d0d0d' : '#ffffff',
    bgHover: isDark ? '#1a1a1a' : '#f8f7f5',
    border: isDark ? '#1f1f1f' : '#e8e5e0',
    text: isDark ? '#ffffff' : '#0a0a0a',
    textMuted: isDark ? '#888888' : '#666666',
    accent: '#5b4cf5'
  }

  const handleNavigation = (path) => {
    navigate(path)
    setOpen(false)
  }

  return (
    <>
      {/* Top Bar */}
      <div className="mobile-topbar" style={{
        display: 'none', 
        padding: '12px 16px', 
        background: theme.bg,
        borderBottom: `1px solid ${theme.border}`, 
        alignItems: 'center',
        justifyContent: 'space-between', 
        position: 'sticky', 
        top: 0, 
        zIndex: 50,
      }}>
        <div 
          onClick={() => handleNavigation('/dashboard')}
          style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}
        >
          <img src="/logo.png" style={{ width: 28, height: 28, borderRadius: '50%' }} alt="Logo" />
          <span style={{ fontWeight: 700, fontSize: 15, color: theme.text }}>ClipGen.AI</span>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <ThemeToggle />
          <button onClick={() => setOpen(!open)} style={{
            background: theme.bgHover,
            border: `1px solid ${theme.border}`,
            color: theme.text,
            borderRadius: 8,
            padding: '6px 10px',
            fontSize: 16,
            cursor: 'pointer',
          }}>☰</button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {open && (
        <div style={{
          position: 'fixed',
          top: 57,
          left: 0,
          right: 0,
          background: theme.bg,
          borderBottom: `1px solid ${theme.border}`,
          zIndex: 200,
          padding: '8px 12px',
        }}>
          {NAV.map(item => (
            <button 
              key={item.id} 
              onClick={() => handleNavigation(item.path)} 
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '12px',
                borderRadius: 8,
                border: 'none',
                background: currentPath === item.path ? `${theme.accent}20` : 'transparent',
                color: currentPath === item.path ? theme.accent : theme.textMuted,
                fontSize: 14,
                marginBottom: 2,
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Bottom Navigation Bar */}
      <nav className="mobile-nav" style={{
        display: 'none',
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: theme.bg,
        borderTop: `1px solid ${theme.border}`,
        padding: '8px 4px',
        zIndex: 100,
        justifyContent: 'space-around',
      }}>
        {NAV.map(item => (
          <button 
            key={item.id} 
            onClick={() => handleNavigation(item.path)} 
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 3,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: currentPath === item.path ? theme.accent : theme.textMuted,
              fontSize: 10,
              fontWeight: currentPath === item.path ? 600 : 400,
              padding: '4px 8px',
              minWidth: 52,
            }}
          >
            <span style={{ fontSize: 20 }}>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Add CSS for responsive display */}
      <style>{`
        @media (max-width: 768px) {
          .mobile-topbar, .mobile-nav {
            display: flex !important;
          }
        }
      `}</style>
    </>
  )
}
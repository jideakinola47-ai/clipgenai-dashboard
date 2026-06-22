// src/components/MobileNav.jsx — redesigned to match the ClipGen landing page.
// Logic (navigation, menu open/close) is UNCHANGED.
import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useTheme } from '../contexts/ThemeContext'
import { makePalette, FONT_DISPLAY, FONT_BODY } from '../theme/landingTheme'
import { Icon } from '../theme/ui'

const NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: 'gauge',    path: '/dashboard' },
  { id: 'clips',     label: 'Clips',     icon: 'scissors', path: '/clips' },
  { id: 'analytics', label: 'Analytics', icon: 'chart',    path: '/analytics' },
  { id: 'pricing',   label: 'Upgrade',   icon: 'zap',      path: '/pricing' },
  { id: 'settings',  label: 'Settings',  icon: 'settings', path: '/settings' },
]

export default function MobileNav() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { isDark, toggleTheme } = useTheme()
  const currentPath = location.pathname

  const P = { ...makePalette(isDark), fontD: FONT_DISPLAY }

  const go = (path) => { navigate(path); setOpen(false) }

  return (
    <>
      {/* Top bar */}
      <div className="mobile-topbar" style={{
        display: 'none', padding: '12px 16px', background: P.bg,
        borderBottom: `1px solid ${P.line}`, alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 50, fontFamily: FONT_BODY,
      }}>
        <div onClick={() => go('/dashboard')} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
          <img src="/logo.png" style={{ width: 28, height: 28, borderRadius: 8 }} alt="Logo" />
          <span style={{ fontFamily: P.fontD, fontWeight: 900, fontSize: 15, color: P.text }}>
            ClipGen<span style={{ color: P.purple }}>.AI</span>
          </span>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button onClick={toggleTheme} style={{
            width: 34, height: 34, borderRadius: 8, border: `1px solid ${P.line}`,
            background: P.surface, color: P.text, cursor: 'pointer', fontSize: 14,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>{isDark ? '☀' : '☾'}</button>
          <button onClick={() => setOpen(!open)} style={{
            width: 34, height: 34, borderRadius: 8, border: `1px solid ${P.line}`,
            background: P.surface, color: P.text, fontSize: 16, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>{open ? '✕' : '☰'}</button>
        </div>
      </div>

      {/* Dropdown menu */}
      {open && (
        <div style={{
          position: 'fixed', top: 57, left: 0, right: 0, background: P.bg,
          borderBottom: `1px solid ${P.line}`, zIndex: 200, padding: '8px 12px',
        }}>
          {NAV.map(item => {
            const active = currentPath === item.path
            return (
              <button key={item.id} onClick={() => go(item.path)} style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 11, padding: 12,
                borderRadius: 10, border: 'none',
                background: active ? P.purple + '1a' : 'transparent',
                color: active ? P.text : P.muted, fontSize: 14, fontFamily: FONT_BODY,
                marginBottom: 2, cursor: 'pointer', textAlign: 'left',
              }}>
                <Icon name={item.icon} size={17} color={active ? P.purple : P.muted} stroke={2} />
                <span>{item.label}</span>
              </button>
            )
          })}
        </div>
      )}

      {/* Bottom nav */}
      <nav className="mobile-nav" style={{
        display: 'none', position: 'fixed', bottom: 0, left: 0, right: 0,
        background: P.bg, borderTop: `1px solid ${P.line}`, padding: '8px 4px',
        zIndex: 100, justifyContent: 'space-around', fontFamily: FONT_BODY,
      }}>
        {NAV.map(item => {
          const active = currentPath === item.path
          return (
            <button key={item.id} onClick={() => go(item.path)} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
              background: 'none', border: 'none', cursor: 'pointer',
              color: active ? P.purple : P.muted, fontSize: 10,
              fontWeight: active ? 600 : 400, padding: '4px 8px', minWidth: 52,
            }}>
              <Icon name={item.icon} size={20} color={active ? P.purple : P.muted} stroke={2} />
              <span>{item.label}</span>
            </button>
          )
        })}
      </nav>

      <style>{`
        @media (max-width: 768px) {
          .mobile-topbar, .mobile-nav { display: flex !important; }
        }
      `}</style>
    </>
  )
}

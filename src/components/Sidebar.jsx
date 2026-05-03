import { useNavigate, useLocation } from 'react-router-dom'
import { useTheme } from '../contexts/ThemeContext'
import ThemeToggle from './ThemeToggle'
// Add this import at the top
import { useAuth } from '../contexts/AuthContext'

const NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: '⊞', path: '/dashboard' },
  { id: 'clips', label: 'My Clips', icon: '✂', path: '/clips' },
  { id: 'analytics', label: 'Analytics', icon: '↗', path: '/analytics' },
  { id: 'pricing', label: 'Upgrade Plan', icon: '◈', path: '/pricing' },
  { id: 'settings', label: 'Settings', icon: '⊙', path: '/settings' },
]

export default function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { isDark } = useTheme()
  const { user, signout } = useAuth()
  const currentPath = location.pathname

  const theme = {
    bg: isDark ? '#0d0d0d' : '#ffffff',
    border: isDark ? '#1f1f1f' : '#e8e5e0',
    text: isDark ? '#ffffff' : '#0a0a0a',
    textMuted: isDark ? '#888888' : '#666666',
    hoverBg: isDark ? '#5b4cf520' : '#f0f0f0',
    cardBg: isDark ? '#141414' : '#fafaf8',
    accent: '#5b4cf5'
  }

  return (
    <aside style={{
      width: 240,
      background: theme.bg,
      borderRight: `1px solid ${theme.border}`,
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
    }}>
      <div onClick={() => navigate('/dashboard')} style={{
        padding: '20px 20px 16px',
        borderBottom: `1px solid ${theme.border}`,
        cursor: 'pointer'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <img src="/logo.png" style={{ width: 34, height: 34, borderRadius: '50%' }} alt="Logo" />
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, color: theme.text, letterSpacing: '-0.3px' }}>ClipGen.AI</div>
            <div style={{ fontSize: 10.5, color: theme.accent, fontWeight: 500 }}>Pro Plan</div>
          </div>
        </div>
      </div>

      <div style={{
        padding: '12px 16px',
        borderBottom: `1px solid ${theme.border}`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {[['TikTok', '#010101'], ['Instagram', '#e1306c'], ['YouTube', '#ff0000']].map(([name, color]) => (
            <div key={name} style={{
              background: color + '22',
              border: `1px solid ${color}44`,
              borderRadius: 6,
              padding: '3px 8px',
              fontSize: 10.5,
              color: theme.textMuted,
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}>
              <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#22c55e' }} />
              {name}
            </div>
          ))}
        </div>
        <ThemeToggle />
      </div>

      <nav style={{ flex: 1, padding: '12px 10px' }}>
        {NAV.map(item => (
          <button
            key={item.id}
            onClick={() => navigate(item.path)}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '10px 12px',
              borderRadius: 8,
              border: 'none',
              background: currentPath === item.path ? theme.hoverBg : 'transparent',
              color: currentPath === item.path ? theme.accent : theme.textMuted,
              fontWeight: currentPath === item.path ? 600 : 400,
              fontSize: 13.5,
              marginBottom: 2,
              cursor: 'pointer',
              textAlign: 'left',
              borderLeft: currentPath === item.path ? `2px solid ${theme.accent}` : '2px solid transparent',
            }}
          >
            <span style={{ fontSize: 16 }}>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div style={{ padding: '16px', borderTop: `1px solid ${theme.border}` }}>
        <div style={{ background: theme.cardBg, borderRadius: 10, padding: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 11.5, color: theme.textMuted }}>Videos This Month</span>
            <span style={{ fontSize: 11.5, color: theme.accent, fontWeight: 600 }}>46%</span>
          </div>
          <div style={{ height: 4, background: isDark ? '#333' : '#e8e5e0', borderRadius: 2, marginBottom: 6 }}>
            <div style={{ width: '46%', height: '100%', background: `linear-gradient(90deg, ${theme.accent}, #8b5cf6)`, borderRadius: 2 }} />
          </div>
          <div style={{ fontSize: 10.5, color: theme.textMuted }}>23 / 50 videos used</div>
        </div>
        <button
          onClick={() => navigate('/pricing')}
          style={{
            width: '100%',
            marginTop: 10,
            padding: '9px',
            borderRadius: 8,
            background: `linear-gradient(135deg, ${theme.accent}, #8b5cf6)`,
            color: '#fff',
            fontWeight: 600,
            fontSize: 13,
            border: 'none',
            cursor: 'pointer',
          }}
        >
          ⚡ Upgrade Plan
        </button>
        <button
  onClick={signout}
  style={{
    width: '100%',
    marginTop: 10,
    padding: '9px',
    borderRadius: 8,
    background: 'transparent',
    border: `1px solid ${theme.border}`,
    color: theme.textMuted,
    fontWeight: 500,
    fontSize: 12,
    cursor: 'pointer',
    transition: 'all 0.2s',
  }}
  onMouseEnter={(e) => {
    e.target.style.background = '#f87171'
    e.target.style.color = '#fff'
    e.target.style.borderColor = '#f87171'
  }}
  onMouseLeave={(e) => {
    e.target.style.background = 'transparent'
    e.target.style.color = theme.textMuted
    e.target.style.borderColor = theme.border
  }}
>
  🚪 Sign Out
</button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12 }}>
          <div style={{
            width: 30,
            height: 30,
            borderRadius: '50%',
            background: theme.accent,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: 12,
            fontWeight: 700,
          }}>K</div>
          <div>
            <div style={{ fontSize: 12.5, color: theme.text, fontWeight: 500 }}>Kajus T.</div>
            <div style={{ fontSize: 10.5, color: theme.textMuted }}>Pro Plan</div>
          </div>
        </div>
      </div>
    </aside>
  )
}
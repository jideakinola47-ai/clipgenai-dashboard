// src/components/Sidebar.jsx — redesigned to match the ClipGen landing page.
// All logic (stats fetch, navigation, sign-out, usage bar) is UNCHANGED.
import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useTheme } from '../contexts/ThemeContext'
import { useAuth } from '../contexts/AuthContext'
import { makePalette, FONT_DISPLAY, FONT_BODY, FONT_MONO } from '../theme/landingTheme'
import { Icon, Btn } from '../theme/ui'

const API_BASE_URL = 'https://web-production-189e9.up.railway.app'

const NAV = [
  { id: 'dashboard', label: 'Dashboard',    icon: 'gauge',    path: '/dashboard' },
  { id: 'clips',     label: 'My Clips',      icon: 'scissors', path: '/clips' },
  { id: 'analytics', label: 'Analytics',     icon: 'chart',    path: '/analytics' },
  { id: 'pricing',   label: 'Upgrade Plan',  icon: 'zap',      path: '/pricing' },
  { id: 'settings',  label: 'Settings',      icon: 'settings', path: '/settings' },
]

export default function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { isDark, toggleTheme } = useTheme()
  const { user, signout, getAuthHeader } = useAuth()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const currentPath = location.pathname

  const P = { ...makePalette(isDark), fontD: FONT_DISPLAY }

  useEffect(() => { fetchUserStats() }, [])

  const fetchUserStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/stats`, { headers: getAuthHeader() })
      if (response.ok) { setStats(await response.json()) }
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally { setLoading(false) }
  }

  const usagePercentage = stats?.usage?.monthly_limit > 0
    ? (stats.usage.videos_this_month / stats.usage.monthly_limit) * 100 : 0

  const getUserInitials = () => {
    const n = stats?.user?.full_name || user?.full_name
    return n ? n.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) : 'U'
  }
  const getUserName = () => stats?.user?.full_name || user?.full_name || 'User'

  const getPlanDisplay = () => {
    const plan = stats?.user?.plan_type || user?.plan_type || 'basic'
    return plan === 'premium' ? 'Pro Plan' : plan === 'enterprise' ? 'Enterprise' : 'Basic Plan'
  }
  const getPlanColor = () => {
    const plan = stats?.user?.plan_type || user?.plan_type || 'basic'
    return plan === 'premium' ? P.gold : plan === 'enterprise' ? P.pink : P.purple
  }

  const PLATFORMS = [['TikTok', P.cyan], ['Instagram', P.pink], ['YouTube', P.blue]]

  return (
    <aside style={{
      width: 260, background: P.bg, borderRight: `1px solid ${P.line}`,
      display: 'flex', flexDirection: 'column', flexShrink: 0,
      height: '100vh', position: 'sticky', top: 0, color: P.text, fontFamily: FONT_BODY,
    }}>
      {/* Logo */}
      <div onClick={() => navigate('/dashboard')} style={{
        padding: '20px 20px 16px', borderBottom: `1px solid ${P.line}`, cursor: 'pointer',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <img src="/logo.png" style={{ width: 34, height: 34, borderRadius: 9, objectFit: 'contain' }} alt="ClipGen.AI" />
          <div>
            <div style={{ fontFamily: P.fontD, fontWeight: 900, fontSize: 15, letterSpacing: '-0.3px', color: P.text }}>
              ClipGen<span style={{ color: P.purple }}>.AI</span>
            </div>
            <div style={{ fontFamily: FONT_MONO, fontSize: 9.5, color: getPlanColor(), letterSpacing: 0.5 }}>
              {getPlanDisplay()}
            </div>
          </div>
        </div>
      </div>

      {/* Platforms + theme toggle */}
      <div style={{
        padding: '12px 16px', borderBottom: `1px solid ${P.line}`,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8,
      }}>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {PLATFORMS.map(([name, color]) => (
            <div key={name} style={{
              background: color + '1a', border: `1px solid ${color}44`, borderRadius: 6,
              padding: '3px 8px', fontSize: 10, color: P.muted, fontFamily: FONT_MONO,
              display: 'flex', alignItems: 'center', gap: 4,
            }}>
              <div style={{ width: 5, height: 5, borderRadius: '50%', background: color }} />
              {name}
            </div>
          ))}
        </div>
        <button onClick={toggleTheme} title="Theme" style={{
          width: 30, height: 30, borderRadius: 8, border: `1px solid ${P.line}`,
          background: P.surface, color: P.text, cursor: 'pointer', fontSize: 13,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>{isDark ? '☀' : '☾'}</button>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 10px', overflowY: 'auto' }}>
        {NAV.map(item => {
          const active = currentPath === item.path
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 11,
                padding: '10px 12px', borderRadius: 10, border: 'none',
                background: active ? P.purple + '1a' : 'transparent',
                color: active ? P.text : P.muted,
                fontWeight: active ? 600 : 400, fontSize: 13.5, fontFamily: FONT_BODY,
                marginBottom: 2, cursor: 'pointer', textAlign: 'left', transition: 'all .2s',
              }}
              onMouseEnter={e => { if (!active) e.currentTarget.style.background = P.bgAlt }}
              onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent' }}
            >
              <Icon name={item.icon} size={17} color={active ? P.purple : P.muted} stroke={2} />
              <span>{item.label}</span>
              {item.id === 'clips' && stats?.usage?.total_clips_generated > 0 && (
                <span style={{
                  marginLeft: 'auto', background: P.purple + '22', color: P.purple,
                  fontSize: 10, padding: '2px 7px', borderRadius: 10, fontFamily: FONT_MONO,
                }}>
                  {stats.usage.total_clips_generated}
                </span>
              )}
            </button>
          )
        })}
      </nav>

      {/* Bottom: stats + actions */}
      <div style={{ padding: 16, borderTop: `1px solid ${P.line}` }}>
        {!loading && stats && (
          <div style={{ background: P.surface, border: `1px solid ${P.line}`, borderRadius: 12, padding: 14, marginBottom: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 11, color: P.muted, fontFamily: FONT_MONO, letterSpacing: 0.5 }}>VIDEOS THIS MONTH</span>
              <span style={{ fontSize: 11.5, color: P.cyan, fontWeight: 700, fontFamily: FONT_MONO }}>
                {Math.round(usagePercentage)}%
              </span>
            </div>
            <div style={{ height: 4, background: P.bgAlt, borderRadius: 2, marginBottom: 6, overflow: 'hidden' }}>
              <div style={{
                width: `${Math.min(usagePercentage, 100)}%`, height: '100%',
                background: `linear-gradient(90deg, ${P.purple}, ${P.cyan})`, borderRadius: 2,
              }} />
            </div>
            <div style={{ fontSize: 10.5, color: P.muted }}>
              {stats.usage.videos_this_month} / {stats.usage.monthly_limit} videos used
            </div>
            {stats.usage.total_clips_generated > 0 && (
              <div style={{
                marginTop: 8, paddingTop: 8, borderTop: `1px solid ${P.line}`,
                fontSize: 10.5, color: P.muted, display: 'flex', justifyContent: 'space-between',
              }}>
                <span>Total clips</span>
                <span style={{ color: P.cyan, fontWeight: 600, fontFamily: FONT_MONO }}>{stats.usage.total_clips_generated}</span>
              </div>
            )}
          </div>
        )}

        {stats?.user?.plan_type !== 'enterprise' && (
          <div style={{ marginBottom: 10 }}>
            <Btn P={P} accent={P.purple} full onClick={() => navigate('/pricing')}>
              <Icon name="zap" size={14} color="#fff" stroke={2.2} /> Upgrade Plan
            </Btn>
          </div>
        )}

        <button
          onClick={signout}
          style={{
            width: '100%', marginBottom: 12, padding: '9px', borderRadius: 10,
            background: 'transparent', border: `1px solid ${P.line}`, color: P.muted,
            fontWeight: 500, fontSize: 12, fontFamily: FONT_BODY, cursor: 'pointer',
            transition: 'all .2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}
          onMouseEnter={e => { e.currentTarget.style.background = P.pink; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = P.pink }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = P.muted; e.currentTarget.style.borderColor = P.line }}
        >
          <Icon name="logout" size={14} color="currentColor" stroke={2} /> Sign Out
        </button>

        {/* User profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 32, height: 32, borderRadius: '50%',
            background: `linear-gradient(135deg, ${P.purple}, ${P.cyan})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontSize: 12, fontWeight: 700, fontFamily: P.fontD, flexShrink: 0,
          }}>
            {getUserInitials()}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12.5, color: P.text, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {getUserName()}
            </div>
            <div style={{ fontSize: 10.5, color: P.muted, display: 'flex', alignItems: 'center', gap: 4 }}>
              {getPlanDisplay()}
              {stats?.usage && stats.usage.remaining_quota > 0 && (
                <span style={{ background: P.cyan + '22', color: P.cyan, padding: '1px 5px', borderRadius: 4, fontSize: 9, fontFamily: FONT_MONO }}>
                  {stats.usage.remaining_quota} left
                </span>
              )}
            </div>
          </div>
          <button
            onClick={fetchUserStats}
            title="Refresh stats"
            style={{ background: 'transparent', border: 'none', color: P.muted, cursor: 'pointer', padding: 4, borderRadius: 6, display: 'flex' }}
            onMouseEnter={e => e.currentTarget.style.background = P.bgAlt}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <Icon name="refresh" size={14} color="currentColor" stroke={2} />
          </button>
        </div>
      </div>
    </aside>
  )
}

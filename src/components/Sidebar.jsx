// components/Sidebar.jsx
import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useTheme } from '../contexts/ThemeContext'
import ThemeToggle from './ThemeToggle'
import { useAuth } from '../contexts/AuthContext'

const API_BASE_URL = 'https://web-production-189e9.up.railway.app';

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
  const { user, signout, getAuthHeader } = useAuth()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
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

  useEffect(() => {
    fetchUserStats()
  }, [])

  const fetchUserStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/stats`, {
        headers: getAuthHeader(),
      })
      
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  // Calculate usage percentage
  const usagePercentage = stats?.usage?.monthly_limit > 0 
    ? (stats.usage.videos_this_month / stats.usage.monthly_limit) * 100 
    : 0

  // Get user initials for avatar
  const getUserInitials = () => {
    if (stats?.user?.full_name) {
      return stats.user.full_name.split(' ').map(n => n[0]).join('').toUpperCase()
    }
    if (user?.full_name) {
      return user.full_name.split(' ').map(n => n[0]).join('').toUpperCase()
    }
    return 'U'
  }

  // Get user name
  const getUserName = () => {
    if (stats?.user?.full_name) return stats.user.full_name
    if (user?.full_name) return user.full_name
    return 'User'
  }

  // Get plan display name
  const getPlanDisplay = () => {
    const plan = stats?.user?.plan_type || user?.plan_type || 'basic'
    switch(plan) {
      case 'premium': return 'Pro Plan'
      case 'enterprise': return 'Enterprise'
      default: return 'Basic Plan'
    }
  }

  // Get plan color
  const getPlanColor = () => {
    const plan = stats?.user?.plan_type || user?.plan_type || 'basic'
    switch(plan) {
      case 'premium': return '#f59e0b'
      case 'enterprise': return '#ec4899'
      default: return '#5b4cf5'
    }
  }

  return (
    <aside style={{
      width: 260,
      background: theme.bg,
      borderRight: `1px solid ${theme.border}`,
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
      height: '100vh',
      position: 'sticky',
      top: 0,
    }}>
      {/* Logo Section */}
      <div onClick={() => navigate('/dashboard')} style={{
        padding: '20px 20px 16px',
        borderBottom: `1px solid ${theme.border}`,
        cursor: 'pointer'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <img src="https://iili.io/BQ9axkJ.md.jpg" style={{ width: 34, height: 34, borderRadius: '50%' }} alt="Logo" />
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, color: theme.text, letterSpacing: '-0.3px' }}>ClipGen.AI</div>
            <div style={{ 
              fontSize: 10.5, 
              color: getPlanColor(), 
              fontWeight: 500 
            }}>
              {getPlanDisplay()}
            </div>
          </div>
        </div>
      </div>

      {/* Connected Platforms & Theme Toggle */}
      <div style={{
        padding: '12px 16px',
        borderBottom: `1px solid ${theme.border}`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 8,
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

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '12px 10px', overflowY: 'auto' }}>
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
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              if (currentPath !== item.path) {
                e.currentTarget.style.background = theme.hoverBg
              }
            }}
            onMouseLeave={(e) => {
              if (currentPath !== item.path) {
                e.currentTarget.style.background = 'transparent'
              }
            }}
          >
            <span style={{ fontSize: 16 }}>{item.icon}</span>
            <span>{item.label}</span>
            {item.id === 'clips' && stats?.usage?.total_clips_generated > 0 && (
              <span style={{
                marginLeft: 'auto',
                background: theme.accent + '20',
                color: theme.accent,
                fontSize: 10,
                padding: '2px 6px',
                borderRadius: 10,
              }}>
                {stats.usage.total_clips_generated}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* Bottom Section - User Stats & Actions */}
      <div style={{ padding: '16px', borderTop: `1px solid ${theme.border}` }}>
        {/* Usage Stats */}
        {!loading && stats && (
          <div style={{ background: theme.cardBg, borderRadius: 10, padding: '14px', marginBottom: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 11.5, color: theme.textMuted }}>Videos This Month</span>
              <span style={{ fontSize: 11.5, color: theme.accent, fontWeight: 600 }}>
                {Math.round(usagePercentage)}%
              </span>
            </div>
            <div style={{ height: 4, background: isDark ? '#333' : '#e8e5e0', borderRadius: 2, marginBottom: 6 }}>
              <div style={{ 
                width: `${Math.min(usagePercentage, 100)}%`, 
                height: '100%', 
                background: `linear-gradient(90deg, ${theme.accent}, #8b5cf6)`, 
                borderRadius: 2 
              }} />
            </div>
            <div style={{ fontSize: 10.5, color: theme.textMuted }}>
              {stats.usage.videos_this_month} / {stats.usage.monthly_limit} videos used
            </div>
            {stats.usage.total_clips_generated > 0 && (
              <div style={{ 
                marginTop: 8, 
                paddingTop: 8, 
                borderTop: `1px solid ${theme.border}`,
                fontSize: 10.5,
                color: theme.textMuted,
                display: 'flex',
                justifyContent: 'space-between'
              }}>
                <span>Total clips</span>
                <span style={{ color: theme.accent, fontWeight: 600 }}>{stats.usage.total_clips_generated}</span>
              </div>
            )}
          </div>
        )}

        {/* Upgrade Button */}
        {stats?.user?.plan_type !== 'enterprise' && (
          <button
            onClick={() => navigate('/pricing')}
            style={{
              width: '100%',
              marginBottom: 10,
              padding: '9px',
              borderRadius: 8,
              background: `linear-gradient(135deg, ${theme.accent}, #8b5cf6)`,
              color: '#fff',
              fontWeight: 600,
              fontSize: 12,
              border: 'none',
              cursor: 'pointer',
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
          >
            ⚡ Upgrade Plan
          </button>
        )}

        {/* Sign Out Button */}
        <button
          onClick={signout}
          style={{
            width: '100%',
            marginBottom: 12,
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
            e.currentTarget.style.background = '#f87171'
            e.currentTarget.style.color = '#fff'
            e.currentTarget.style.borderColor = '#f87171'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.color = theme.textMuted
            e.currentTarget.style.borderColor = theme.border
          }}
        >
          🚪 Sign Out
        </button>

        {/* User Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${theme.accent}, #8b5cf6)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: 12,
            fontWeight: 700,
          }}>
            {getUserInitials()}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12.5, color: theme.text, fontWeight: 500 }}>
              {getUserName()}
            </div>
            <div style={{ fontSize: 10.5, color: theme.textMuted, display: 'flex', alignItems: 'center', gap: 4 }}>
              {getPlanDisplay()}
              {stats?.usage && stats.usage.remaining_quota > 0 && (
                <span style={{ 
                  background: '#22c55e20', 
                  color: '#22c55e', 
                  padding: '1px 4px', 
                  borderRadius: 4, 
                  fontSize: 9,
                  marginLeft: 4,
                }}>
                  {stats.usage.remaining_quota} left
                </span>
              )}
            </div>
          </div>
          {/* Refresh stats button */}
          <button
            onClick={fetchUserStats}
            style={{
              background: 'transparent',
              border: 'none',
              color: theme.textMuted,
              cursor: 'pointer',
              fontSize: 14,
              padding: 4,
              borderRadius: 4,
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = theme.hoverBg}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            title="Refresh stats"
          >
            ↻
          </button>
        </div>
      </div>
    </aside>
  )
}
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../contexts/ThemeContext'

export default function Settings() {
  const navigate = useNavigate()
  const { isDark } = useTheme()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [saved, setSaved] = useState(false)
  
  const theme = {
    bg: isDark ? '#0d0d0d' : '#f8f7f5',
    cardBg: isDark ? '#111' : '#ffffff',
    border: isDark ? '#1f1f1f' : '#e8e5e0',
    text: isDark ? '#fff' : '#0a0a0a',
    textMuted: isDark ? '#888' : '#666',
    inputBg: isDark ? '#1a1a1a' : '#fafaf8',
    accent: '#5b4cf5',
  }
  
  const inputStyle = { 
    width: '100%', 
    padding: '10px 14px', 
    borderRadius: 8, 
    border: `1px solid ${theme.border}`, 
    background: theme.inputBg, 
    color: theme.text, 
    fontSize: 13.5, 
    outline: 'none',
    transition: 'all 0.2s',
  }
  
  return (
    <div style={{ 
      padding: '32px', 
      background: theme.bg, 
      minHeight: '100vh',
      width: '100%',
    }}>
      <div style={{ maxWidth: 560, margin: '0 auto' }}>
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: theme.text, marginBottom: 4 }}>Settings</h1>
          <p style={{ color: theme.textMuted, fontSize: 13.5 }}>Manage your account preferences.</p>
        </div>
        
        <div style={{ 
          background: theme.cardBg, 
          border: `1px solid ${theme.border}`, 
          borderRadius: 14, 
          padding: '24px', 
          marginBottom: 16 
        }}>
          <h2 style={{ fontSize: 14, fontWeight: 600, color: theme.text, marginBottom: 18 }}>Account</h2>
          
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 11, fontWeight: 600, color: theme.textMuted, display: 'block', marginBottom: 6, letterSpacing: '0.8px' }}>NAME</label>
            <input 
              value={name} 
              onChange={e => setName(e.target.value)} 
              placeholder="Your full name" 
              style={inputStyle} 
            />
          </div>
          
          <div style={{ marginBottom: 24 }}>
            <label style={{ fontSize: 11, fontWeight: 600, color: theme.textMuted, display: 'block', marginBottom: 6, letterSpacing: '0.8px' }}>EMAIL</label>
            <input 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              placeholder="your@email.com" 
              style={inputStyle} 
            />
          </div>
          
          <button 
            onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000) }} 
            style={{ 
              padding: '9px 20px', 
              borderRadius: 8, 
              background: `linear-gradient(135deg, ${theme.accent}, #8b5cf6)`, 
              color: '#fff', 
              fontWeight: 600, 
              fontSize: 13.5, 
              border: 'none', 
              cursor: 'pointer',
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={(e) => e.target.style.opacity = '0.9'}
            onMouseLeave={(e) => e.target.style.opacity = '1'}
          >
            {saved ? '✓ Saved' : 'Save changes'}
          </button>
        </div>
        
        <div style={{ 
          background: theme.cardBg, 
          border: `1px solid ${theme.border}`, 
          borderRadius: 14, 
          padding: '24px' 
        }}>
          <h2 style={{ fontSize: 14, fontWeight: 600, color: theme.text, marginBottom: 6 }}>Subscription</h2>
          <p style={{ fontSize: 13, color: theme.textMuted, marginBottom: 16 }}>Manage your ClipGen.AI plan.</p>
          
          <div style={{ 
            background: theme.bg, 
            borderRadius: 8, 
            padding: '14px', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 12,
          }}>
            <span style={{ fontSize: 13, color: theme.textMuted }}>Current plan: <strong style={{ color: theme.accent }}>Pro Plan</strong></span>
            <button 
              onClick={() => navigate('/pricing')}
              style={{ 
                background: `linear-gradient(135deg, ${theme.accent}, #8b5cf6)`, 
                color: '#fff', 
                border: 'none', 
                borderRadius: 6, 
                padding: '7px 16px', 
                fontSize: 12.5, 
                fontWeight: 500, 
                cursor: 'pointer',
                transition: 'opacity 0.2s',
              }}
              onMouseEnter={(e) => e.target.style.opacity = '0.9'}
              onMouseLeave={(e) => e.target.style.opacity = '1'}
            >
              Upgrade Plan
            </button>
          </div>
          
          <div style={{ 
            marginTop: 16, 
            paddingTop: 16, 
            borderTop: `1px solid ${theme.border}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 12,
          }}>
            <span style={{ fontSize: 12, color: theme.textMuted }}>Next billing date: <strong>May 15, 2026</strong></span>
            <button 
              style={{ 
                background: 'transparent', 
                color: '#f87171', 
                border: `1px solid #f87171`, 
                borderRadius: 6, 
                padding: '6px 14px', 
                fontSize: 12, 
                fontWeight: 500, 
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#f87171'
                e.target.style.color = '#fff'
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'transparent'
                e.target.style.color = '#f87171'
              }}
            >
              Cancel Subscription
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
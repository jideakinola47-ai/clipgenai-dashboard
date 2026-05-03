import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'

export default function Signup() {
  const navigate = useNavigate()
  const { signup } = useAuth()
  const { isDark } = useTheme()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const theme = {
    bg: isDark ? '#0d0d0d' : '#f8f7f5',
    cardBg: isDark ? '#111' : '#ffffff',
    border: isDark ? '#1f1f1f' : '#e8e5e0',
    text: isDark ? '#fff' : '#0a0a0a',
    textMuted: isDark ? '#888' : '#666',
    inputBg: isDark ? '#1a1a1a' : '#fafaf8',
    accent: '#5b4cf5',
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)

    try {
      await signup(email, password, name)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    width: '100%',
    padding: '12px 14px',
    borderRadius: 8,
    border: `1px solid ${theme.border}`,
    background: theme.inputBg,
    color: theme.text,
    fontSize: 14,
    outline: 'none',
    transition: 'all 0.2s',
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: theme.bg,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
    }}>
      <div style={{
        maxWidth: 440,
        width: '100%',
        background: theme.cardBg,
        border: `1px solid ${theme.border}`,
        borderRadius: 20,
        padding: '40px 32px',
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <img src="/logo.png" style={{ width: 48, height: 48, borderRadius: '50%', marginBottom: 16 }} alt="Logo" />
          <h1 style={{ fontSize: 28, fontWeight: 700, color: theme.text, marginBottom: 8 }}>Create Account</h1>
          <p style={{ color: theme.textMuted, fontSize: 14 }}>Start creating viral clips today</p>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background: 'rgba(239,68,68,0.1)',
            border: '1px solid rgba(239,68,68,0.3)',
            borderRadius: 10,
            padding: '12px',
            marginBottom: 20,
            color: '#f87171',
            fontSize: 13,
            textAlign: 'center',
          }}>
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 20 }}>
            <label style={{
              fontSize: 12,
              fontWeight: 600,
              color: theme.textMuted,
              display: 'block',
              marginBottom: 8,
              letterSpacing: '0.5px',
            }}>
              FULL NAME
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              style={inputStyle}
              required
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{
              fontSize: 12,
              fontWeight: 600,
              color: theme.textMuted,
              display: 'block',
              marginBottom: 8,
              letterSpacing: '0.5px',
            }}>
              EMAIL ADDRESS
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="hello@example.com"
              style={inputStyle}
              required
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{
              fontSize: 12,
              fontWeight: 600,
              color: theme.textMuted,
              display: 'block',
              marginBottom: 8,
              letterSpacing: '0.5px',
            }}>
              PASSWORD
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••"
              style={inputStyle}
              required
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{
              fontSize: 12,
              fontWeight: 600,
              color: theme.textMuted,
              display: 'block',
              marginBottom: 8,
              letterSpacing: '0.5px',
            }}>
              CONFIRM PASSWORD
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••"
              style={inputStyle}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: 10,
              background: `linear-gradient(135deg, ${theme.accent}, #8b5cf6)`,
              color: '#fff',
              fontWeight: 700,
              fontSize: 15,
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              transition: 'opacity 0.2s',
            }}
          >
            {loading ? 'Creating account...' : 'Create Account →'}
          </button>
        </form>

        {/* Divider */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          margin: '24px 0',
        }}>
          <div style={{ flex: 1, height: 1, background: theme.border }} />
          <span style={{ color: theme.textMuted, fontSize: 12 }}>OR</span>
          <div style={{ flex: 1, height: 1, background: theme.border }} />
        </div>

        {/* Sign In Link */}
        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <span style={{ color: theme.textMuted, fontSize: 13 }}>
            Already have an account?{' '}
            <Link to="/signin" style={{ color: theme.accent, textDecoration: 'none', fontWeight: 600 }}>
              Sign in →
            </Link>
          </span>
        </div>
      </div>
    </div>
  )
}
import { useTheme } from '../contexts/ThemeContext'

export default function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      style={{
        background: isDark ? '#2a2a2a' : '#f0f0f0',
        border: `1px solid ${isDark ? '#444' : '#ddd'}`,
        borderRadius: '20px',
        padding: '6px 12px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        transition: 'all 0.2s'
      }}
    >
      <span style={{ fontSize: '14px' }}>{isDark ? '☀️' : '🌙'}</span>
      <span style={{ fontSize: '12px', color: isDark ? '#fff' : '#333' }}>
        {isDark ? 'Light' : 'Dark'}
      </span>
    </button>
  )
}
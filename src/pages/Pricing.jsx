import { useNavigate } from 'react-router-dom'
import { useTheme } from '../contexts/ThemeContext'

export default function Pricing() {
  const navigate = useNavigate()
  const { isDark } = useTheme()
  
  const theme = {
    bg: isDark ? '#0d0d0d' : '#f8f7f5',
    cardBg: isDark ? '#111' : '#ffffff',
    border: isDark ? '#1f1f1f' : '#e8e5e0',
    text: isDark ? '#fff' : '#0a0a0a',
    textMuted: isDark ? '#666' : '#888',
    textMutedLight: isDark ? '#888' : '#aaa',
    accent: '#5b4cf5',
    accentLight: '#a5b4fc',
  }
  
  const plans = [
    { 
      name: 'Starter', 
      price: '€29', 
      period: '/month', 
      desc: 'For individual creators', 
      highlight: false, 
      features: [
        '10 videos/month',
        'Up to 30 min per video',
        '5 clips per video',
        'Auto subtitles',
        '9:16 formatting',
        'Email support'
      ] 
    },
    { 
      name: 'Pro', 
      price: '€59', 
      period: '/month', 
      desc: 'For serious creators', 
      highlight: true, 
      features: [
        '50 videos/month',
        'Up to 2 hours per video',
        '10 clips per video',
        '50+ languages',
        'Direct social publishing',
        'Priority support',
        'Custom branding'
      ] 
    },
    { 
      name: 'Agency', 
      price: '€99', 
      period: '/month', 
      desc: 'For teams & agencies', 
      highlight: false, 
      features: [
        'Unlimited videos',
        'Unlimited duration',
        'Unlimited clips',
        'All 50+ languages',
        'Direct publishing',
        'Dedicated support',
        'Team workspace',
        'API access'
      ] 
    },
  ]

  const handleGetStarted = () => {
    navigate('/dashboard')
  }

  return (
    <div style={{ padding: '24px', background: theme.bg, minHeight: '100vh' }}>
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <h1 style={{ fontSize: 32, fontWeight: 700, color: theme.text, letterSpacing: '-1px', marginBottom: 8 }}>
          Simple pricing
        </h1>
        <p style={{ color: theme.textMuted, fontSize: 15 }}>
          Start free, upgrade when you need more
        </p>
      </div>
      
      <div className="pricing-grid" style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(3, 1fr)', 
        gap: 16, 
        maxWidth: 900, 
        margin: '0 auto' 
      }}>
        {plans.map(plan => (
          <div 
            key={plan.name} 
            style={{
              background: plan.highlight 
                ? (isDark ? 'linear-gradient(135deg, #1a1a2e, #2d2a5e)' : 'linear-gradient(135deg, #5b4cf5, #8b5cf6)')
                : theme.cardBg,
              border: `1px solid ${plan.highlight ? theme.accent : theme.border}`,
              borderRadius: 16, 
              padding: '28px 24px', 
              position: 'relative',
              boxShadow: plan.highlight && !isDark ? '0 8px 32px rgba(91,76,245,0.2)' : 'none',
            }}
          >
            {plan.highlight && (
              <div style={{ 
                position: 'absolute', 
                top: -12, 
                left: '50%', 
                transform: 'translateX(-50%)', 
                background: '#f59e0b', 
                color: '#000', 
                borderRadius: 20, 
                padding: '3px 14px', 
                fontSize: 11, 
                fontWeight: 700,
                whiteSpace: 'nowrap'
              }}>
                MOST POPULAR
              </div>
            )}
            
            <div style={{ marginBottom: 20 }}>
              <div style={{ 
                fontSize: 12, 
                fontWeight: 600, 
                color: plan.highlight ? theme.accentLight : theme.textMuted, 
                marginBottom: 6, 
                letterSpacing: '0.5px' 
              }}>
                {plan.name.toUpperCase()}
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                <span style={{ fontSize: 40, fontWeight: 800, color: theme.text, letterSpacing: '-2px' }}>
                  {plan.price}
                </span>
                <span style={{ fontSize: 14, color: plan.highlight ? theme.accentLight : theme.textMuted }}>
                  {plan.period}
                </span>
              </div>
              <div style={{ fontSize: 13, color: plan.highlight ? theme.accentLight : theme.textMuted, marginTop: 4 }}>
                {plan.desc}
              </div>
            </div>
            
            <button 
              onClick={handleGetStarted} 
              style={{
                width: '100%', 
                padding: '11px', 
                borderRadius: 8,
                background: plan.highlight 
                  ? (isDark ? theme.accent : '#fff')
                  : `linear-gradient(135deg, ${theme.accent}, #8b5cf6)`,
                color: plan.highlight 
                  ? (isDark ? '#fff' : theme.accent)
                  : '#fff',
                fontWeight: 700, 
                fontSize: 14, 
                border: 'none', 
                cursor: 'pointer', 
                marginBottom: 22,
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                if (!plan.highlight) {
                  e.target.style.opacity = '0.9'
                }
              }}
              onMouseLeave={(e) => {
                if (!plan.highlight) {
                  e.target.style.opacity = '1'
                }
              }}
            >
              Get started
            </button>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {plan.features.map(f => (
                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                  <span style={{ 
                    color: plan.highlight ? (isDark ? '#a5f3c0' : '#059669') : theme.accent, 
                    fontWeight: 700 
                  }}>
                    ✓
                  </span>
                  <span style={{ color: plan.highlight ? (isDark ? '#e0e7ff' : '#374151') : theme.textMutedLight }}>
                    {f}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      {/* Add responsive styles */}
      <style>{`
        @media (max-width: 768px) {
          .pricing-grid {
            grid-template-columns: 1fr !important;
            max-width: 400px !important;
          }
        }
      `}</style>
    </div>
  )
}
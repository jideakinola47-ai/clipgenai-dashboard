export default function Pricing({ setPage }) {
  const plans = [
    { name: 'Starter', price: '€29', period: '/month', desc: 'For individual creators', highlight: false, features: ['10 videos/month','Up to 30 min per video','5 clips per video','Auto subtitles','9:16 formatting','Email support'] },
    { name: 'Pro', price: '€59', period: '/month', desc: 'For serious creators', highlight: true, features: ['50 videos/month','Up to 2 hours per video','10 clips per video','50+ languages','Direct social publishing','Priority support','Custom branding'] },
    { name: 'Agency', price: '€99', period: '/month', desc: 'For teams & agencies', highlight: false, features: ['Unlimited videos','Unlimited duration','Unlimited clips','All 50+ languages','Direct publishing','Dedicated support','Team workspace','API access'] },
  ]
  return (
    <div style={{ padding: '24px', background: '#0d0d0d', minHeight: '100vh' }}>
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <h1 style={{ fontSize: 32, fontWeight: 700, color: '#fff', letterSpacing: '-1px', marginBottom: 8 }}>Simple pricing</h1>
        <p style={{ color: '#666', fontSize: 15 }}>Start free, upgrade when you need more</p>
      </div>
      <div className="pricing-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, maxWidth: 900, margin: '0 auto' }}>
        {plans.map(plan => (
          <div key={plan.name} style={{
            background: plan.highlight ? 'linear-gradient(135deg, #3730a3, #5b4cf5)' : '#111',
            border: `1px solid ${plan.highlight ? '#5b4cf5' : '#1f1f1f'}`,
            borderRadius: 16, padding: '28px 24px', position: 'relative',
          }}>
            {plan.highlight && <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: '#f59e0b', color: '#000', borderRadius: 20, padding: '3px 14px', fontSize: 11, fontWeight: 700 }}>MOST POPULAR</div>}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: plan.highlight ? '#a5b4fc' : '#666', marginBottom: 6, letterSpacing: '0.5px' }}>{plan.name.toUpperCase()}</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                <span style={{ fontSize: 40, fontWeight: 800, color: '#fff', letterSpacing: '-2px' }}>{plan.price}</span>
                <span style={{ fontSize: 14, color: plan.highlight ? '#a5b4fc' : '#666' }}>{plan.period}</span>
              </div>
              <div style={{ fontSize: 13, color: plan.highlight ? '#a5b4fc' : '#666', marginTop: 4 }}>{plan.desc}</div>
            </div>
            <button onClick={() => setPage('dashboard')} style={{
              width: '100%', padding: '11px', borderRadius: 8,
              background: plan.highlight ? '#fff' : 'linear-gradient(135deg, #5b4cf5, #8b5cf6)',
              color: plan.highlight ? '#5b4cf5' : '#fff',
              fontWeight: 700, fontSize: 14, border: 'none', cursor: 'pointer', marginBottom: 22,
            }}>Get started</button>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {plan.features.map(f => (
                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                  <span style={{ color: plan.highlight ? '#a5f3c0' : '#5b4cf5', fontWeight: 700 }}>✓</span>
                  <span style={{ color: plan.highlight ? '#e0e7ff' : '#aaa' }}>{f}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

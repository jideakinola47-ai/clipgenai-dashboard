export default function Pricing({ dark, setPage }) {
  const bg = dark ? '#0f0f0f' : '#f8f7f5'
  const text = dark ? '#e8e8e8' : '#1a1a1a'
  const sub = dark ? '#888' : '#666'
  const card = dark ? '#1a1a1a' : '#fff'
  const border = dark ? '#2a2a2a' : '#e8e5e0'

  const plans = [
    {
      name: 'Starter', price: '€29', period: '/month',
      desc: 'Perfect for individual creators',
      features: ['10 videos per month','Up to 30 min per video','5 clips per video','Auto subtitles','9:16 formatting','Email support'],
      cta: 'Get started', highlight: false,
    },
    {
      name: 'Pro', price: '€59', period: '/month',
      desc: 'For serious content creators',
      features: ['50 videos per month','Up to 2 hours per video','10 clips per video','Auto subtitles in 50+ languages','Direct social publishing','Priority support','Custom branding'],
      cta: 'Get started', highlight: true,
    },
    {
      name: 'Agency', price: '€99', period: '/month',
      desc: 'For teams and agencies',
      features: ['Unlimited videos','Unlimited duration','Unlimited clips per video','All 50+ languages','Direct social publishing','Dedicated support','Custom branding','Team workspace','API access'],
      cta: 'Contact us', highlight: false,
    },
  ]

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '48px 24px', background: bg, minHeight: '100vh' }}>
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <h1 style={{ fontSize: 36, fontWeight: 700, letterSpacing: '-1px', color: text, marginBottom: 12 }}>
          Simple, transparent pricing
        </h1>
        <p style={{ color: sub, fontSize: 15 }}>Start free, upgrade when you need more</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
        {plans.map(plan => (
          <div key={plan.name} style={{
            background: plan.highlight ? '#5b4cf5' : card,
            border: `1px solid ${plan.highlight ? '#5b4cf5' : border}`,
            borderRadius: 16, padding: '28px 24px',
            color: plan.highlight ? '#fff' : text,
            position: 'relative',
          }}>
            {plan.highlight && (
              <div style={{
                position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)',
                background: '#f59e0b', color: '#fff', borderRadius: 20,
                padding: '3px 14px', fontSize: 11.5, fontWeight: 600,
              }}>MOST POPULAR</div>
            )}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 500, opacity: 0.7, marginBottom: 6 }}>{plan.name}</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                <span style={{ fontSize: 40, fontWeight: 700, letterSpacing: '-1.5px' }}>{plan.price}</span>
                <span style={{ fontSize: 14, opacity: 0.7 }}>{plan.period}</span>
              </div>
              <div style={{ fontSize: 13, opacity: 0.7, marginTop: 6 }}>{plan.desc}</div>
            </div>

            <button onClick={() => setPage('dashboard')} style={{
              width: '100%', padding: '11px', borderRadius: 8,
              background: plan.highlight ? '#fff' : '#5b4cf5',
              color: plan.highlight ? '#5b4cf5' : '#fff',
              fontWeight: 600, fontSize: 14, border: 'none', cursor: 'pointer',
              marginBottom: 24,
            }}>{plan.cta}</button>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {plan.features.map(f => (
                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13.5 }}>
                  <span style={{ color: plan.highlight ? '#a5f3c0' : '#16a34a', fontWeight: 600 }}>✓</span>
                  <span style={{ opacity: 0.85 }}>{f}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* FAQ */}
      <div style={{ marginTop: 64, textAlign: 'center' }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.5px', color: text, marginBottom: 32 }}>
          Common questions
        </h2>
        {[
          ['Can I cancel anytime?', 'Yes, cancel anytime with no fees or commitments.'],
          ['What video formats are supported?', 'MP4, MOV, AVI, MKV — up to 500MB per video.'],
          ['How many clips does AI generate?', 'Between 3-10 clips per video depending on your plan.'],
          ['Is Lithuanian language supported?', 'Yes — Lithuanian is fully supported for subtitles and interface.'],
        ].map(([q, a]) => (
          <div key={q} style={{
            background: card, border: `1px solid ${border}`,
            borderRadius: 12, padding: '20px 24px', marginBottom: 12,
            textAlign: 'left',
          }}>
            <div style={{ fontWeight: 600, fontSize: 14, color: text, marginBottom: 6 }}>{q}</div>
            <div style={{ fontSize: 13.5, color: sub }}>{a}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

import { useState } from 'react'
export default function Settings({ dark }) {
  const bg = dark ? '#0f0f0f' : '#f8f7f5'
  const text = dark ? '#e8e8e8' : '#1a1a1a'
  const sub = dark ? '#888' : '#666'
  const card = dark ? '#1a1a1a' : '#fff'
  const border = dark ? '#2a2a2a' : '#e8e5e0'
  const inputBg = dark ? '#111' : '#fafaf8'
  const [name, setName] = useState('Kajus Tamavičius')
  const [email, setEmail] = useState('clipgenai@gmail.com')
  const [saved, setSaved] = useState(false)
  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2000) }
  return (
    <div style={{ maxWidth: 560, margin: '0 auto', padding: '36px 24px', background: bg, minHeight: '100vh' }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.5px', marginBottom: 4, color: text }}>Settings</h1>
        <p style={{ color: sub, fontSize: 13.5 }}>Manage your account and preferences.</p>
      </div>
      <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 12, padding: '24px', marginBottom: 16 }}>
        <h2 style={{ fontSize: 14, fontWeight: 700, marginBottom: 18, color: text }}>Account</h2>
        {[['NAME', name, setName], ['EMAIL', email, setEmail]].map(([label, val, setter]) => (
          <div key={label} style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 11.5, fontWeight: 600, color: sub, display: 'block', marginBottom: 6, letterSpacing: '0.5px' }}>{label}</label>
            <input value={val} onChange={e => setter(e.target.value)} style={{
              width: '100%', padding: '9px 12px', borderRadius: 8,
              border: `1px solid ${border}`, fontSize: 13.5, outline: 'none',
              background: inputBg, color: text,
            }} />
          </div>
        ))}
        <button onClick={save} style={{
          padding: '9px 20px', borderRadius: 8, background: '#5b4cf5',
          color: '#fff', fontWeight: 600, fontSize: 13.5, border: 'none', cursor: 'pointer',
        }}>{saved ? '✓ Saved' : 'Save changes'}</button>
      </div>
      <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 12, padding: '24px' }}>
        <h2 style={{ fontSize: 14, fontWeight: 700, marginBottom: 6, color: text }}>Current Plan</h2>
        <p style={{ fontSize: 13, color: sub, marginBottom: 16 }}>Business Plan · $30/month</p>
        <div style={{ background: dark ? '#111' : '#f8f7f5', borderRadius: 8, padding: '12px 16px', fontSize: 13, color: sub }}>
          ✓ Unlimited uploads · ✓ API access · ✓ Team workspace · ✓ Priority support · ✓ 50+ languages
        </div>
      </div>
    </div>
  )
}

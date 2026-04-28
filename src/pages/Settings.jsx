import { useState } from 'react'
export default function Settings() {
  const [name, setName] = useState('Kajus Tamavičius')
  const [email, setEmail] = useState('clipgenai@gmail.com')
  const [saved, setSaved] = useState(false)
  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2000) }
  return (
    <div style={{ maxWidth: 560, margin: '0 auto', padding: '36px 24px' }}>
      <h1 style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.5px', marginBottom: 4 }}>Settings</h1>
      <p style={{ color: '#888', fontSize: 13.5, marginBottom: 32 }}>Manage your account and preferences.</p>

      <div style={{ background: '#fff', border: '1px solid #e8e5e0', borderRadius: 12, padding: '24px', marginBottom: 16 }}>
        <h2 style={{ fontSize: 14, fontWeight: 600, marginBottom: 18 }}>Account</h2>
        {[['Name', name, setName], ['Email', email, setEmail]].map(([label, val, setter]) => (
          <div key={label} style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, fontWeight: 500, color: '#555', display: 'block', marginBottom: 6 }}>{label.toUpperCase()}</label>
            <input value={val} onChange={e => setter(e.target.value)} style={{
              width: '100%', padding: '9px 12px', borderRadius: 8,
              border: '1px solid #e0ddd6', fontSize: 13.5, outline: 'none', background: '#fafaf8',
            }} />
          </div>
        ))}
        <button onClick={save} style={{
          padding: '9px 20px', borderRadius: 8, background: '#5b4cf5',
          color: '#fff', fontWeight: 500, fontSize: 13.5, border: 'none',
        }}>{saved ? '✓ Saved' : 'Save changes'}</button>
      </div>

      <div style={{ background: '#fff', border: '1px solid #e8e5e0', borderRadius: 12, padding: '24px' }}>
        <h2 style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>Plan</h2>
        <p style={{ fontSize: 13, color: '#888', marginBottom: 16 }}>Business Plan · $30/month</p>
        <div style={{
          background: '#f8f7f5', borderRadius: 8, padding: '12px 16px', fontSize: 13, color: '#555',
        }}>
          ✓ Unlimited uploads · ✓ API access · ✓ Team workspace · ✓ Priority support
        </div>
      </div>
    </div>
  )
}

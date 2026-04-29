import { useState } from 'react'
export default function Settings() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [saved, setSaved] = useState(false)
  const inputStyle = { width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #2a2a2a', background: '#1a1a1a', color: '#e8e8e8', fontSize: 13.5, outline: 'none' }
  return (
    <div style={{ padding: '24px', background: '#0d0d0d', minHeight: '100vh', maxWidth: 560 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#fff', marginBottom: 4 }}>Settings</h1>
        <p style={{ color: '#666', fontSize: 13.5 }}>Manage your account preferences.</p>
      </div>
      <div style={{ background: '#111', border: '1px solid #1f1f1f', borderRadius: 14, padding: '24px', marginBottom: 16 }}>
        <h2 style={{ fontSize: 14, fontWeight: 600, color: '#fff', marginBottom: 18 }}>Account</h2>
        {[['NAME', name, setName, 'Your full name'], ['EMAIL', email, setEmail, 'your@email.com']].map(([label, val, setter, ph]) => (
          <div key={label} style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 11, fontWeight: 600, color: '#555', display: 'block', marginBottom: 6, letterSpacing: '0.8px' }}>{label}</label>
            <input value={val} onChange={e => setter(e.target.value)} placeholder={ph} style={inputStyle} />
          </div>
        ))}
        <button onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000) }} style={{ padding: '9px 20px', borderRadius: 8, background: 'linear-gradient(135deg, #5b4cf5, #8b5cf6)', color: '#fff', fontWeight: 600, fontSize: 13.5, border: 'none', cursor: 'pointer' }}>
          {saved ? '✓ Saved' : 'Save changes'}
        </button>
      </div>
      <div style={{ background: '#111', border: '1px solid #1f1f1f', borderRadius: 14, padding: '24px' }}>
        <h2 style={{ fontSize: 14, fontWeight: 600, color: '#fff', marginBottom: 6 }}>Subscription</h2>
        <p style={{ fontSize: 13, color: '#666', marginBottom: 16 }}>Manage your ClipGen.AI plan.</p>
        <div style={{ background: '#1a1a1a', borderRadius: 8, padding: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 13, color: '#888' }}>View and manage your plan</span>
          <button style={{ background: 'linear-gradient(135deg, #5b4cf5, #8b5cf6)', color: '#fff', border: 'none', borderRadius: 6, padding: '7px 16px', fontSize: 12.5, fontWeight: 500, cursor: 'pointer' }}>Upgrade</button>
        </div>
      </div>
    </div>
  )
}

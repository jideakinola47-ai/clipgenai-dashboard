// Settings.jsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../contexts/ThemeContext'
import { useAuth } from '../contexts/AuthContext'

const API_BASE_URL = 'https://obscure-space-pancake-x59gxvw69545c6qr5-8000.app.github.dev';

export default function Settings() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const { user, token, getAuthHeader } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [plan, setPlan] = useState('');
  const [stats, setStats] = useState(null);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Load user data from API
    const loadUserData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/user-details`, {
          headers: getAuthHeader(),
        });
        
        if (!response.ok) {
          throw new Error('Failed to load user data');
        }
        
        const data = await response.json();
        setName(data.full_name);
        setEmail(data.email);
        setPlan(data.plan_type);
        setStats(data.usage);
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      loadUserData();
    }
  }, [user]);
  
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
  
  const handleSave = async () => {
    // Note: You'll need to add an update endpoint to your backend
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };
  
  if (loading) {
    return (
      <div style={{ padding: '32px', background: theme.bg, minHeight: '100vh' }}>
        <div style={{ textAlign: 'center', color: theme.text }}>Loading...</div>
      </div>
    );
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
              disabled
            />
          </div>
          
          <button 
            onClick={handleSave} 
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
          padding: '24px',
          marginBottom: 16
        }}>
          <h2 style={{ fontSize: 14, fontWeight: 600, color: theme.text, marginBottom: 6 }}>Usage Statistics</h2>
          <p style={{ fontSize: 13, color: theme.textMuted, marginBottom: 16 }}>Your current usage this month.</p>
          
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 16,
            marginBottom: 16,
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: theme.accent }}>
                {stats?.total_videos_processed || 0}
              </div>
              <div style={{ fontSize: 12, color: theme.textMuted }}>Videos Processed</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: theme.accent }}>
                {stats?.total_clips_generated || 0}
              </div>
              <div style={{ fontSize: 12, color: theme.textMuted }}>Clips Generated</div>
            </div>
          </div>
          
          <div style={{
            background: theme.bg,
            borderRadius: 8,
            padding: '12px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 12, color: theme.textMuted }}>Monthly Quota Usage</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: theme.text }}>
                {stats?.videos_used_this_month || 0} / {stats?.monthly_limit || 10}
              </span>
            </div>
            <div style={{ background: theme.border, borderRadius: 4, height: 6, overflow: 'hidden' }}>
              <div style={{
                width: `${stats?.usage_percentage || 0}%`,
                height: '100%',
                background: `linear-gradient(90deg, ${theme.accent}, #8b5cf6)`,
                borderRadius: 4,
              }} />
            </div>
          </div>
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
            <span style={{ fontSize: 13, color: theme.textMuted }}>
              Current plan: <strong style={{ color: theme.accent }}>
                {plan === 'pro' ? 'Pro Plan' : plan === 'agency' ? 'Enterprise Plan' : 'Starter Plan'}
              </strong>
            </span>
            {plan !== 'pro' && (
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
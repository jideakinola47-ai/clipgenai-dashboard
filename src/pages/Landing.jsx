import { useState } from 'react'

const FAQS = [
  { q: 'How does ClipGen.AI work?', a: 'You upload a long video, our AI automatically transcribes it, finds the most viral moments, cuts the clips, adds subtitles and reformats everything to 9:16 vertical — ready for TikTok, Reels and Shorts in minutes.' },
  { q: 'What video formats are supported?', a: 'MP4, MOV, AVI and MKV files up to 500MB and 60 minutes long.' },
  { q: 'How many clips does AI generate per video?', a: 'Between 3 and 10 clips per video depending on your plan, each scored for viral potential.' },
  { q: 'Is Lithuanian language supported?', a: 'Yes — Lithuanian is fully supported for subtitles and the platform interface.' },
  { q: 'Can I publish directly to social media?', a: 'Yes — connect your TikTok, Instagram and YouTube accounts and publish clips with one click.' },
  { q: 'What is a viral score?', a: 'Each clip receives a score from 0 to 100 based on how likely it is to perform well on social media — based on hooks, pacing, emotional impact and content quality.' },
  { q: 'Can I cancel my subscription anytime?', a: 'Yes — cancel anytime with no fees or commitments. Your clips remain available until the end of your billing period.' },
  { q: 'How is ClipGen.AI different from Opus Clip?', a: 'ClipGen.AI is built for the European market with full Lithuanian language support, Euro pricing, GDPR compliance, and features designed specifically for European creators and businesses.' },
]

const FEATURES = [
  { icon: '⚡', title: 'AI Clip Detection', desc: 'Automatically finds the most viral moments in any video using advanced AI analysis.' },
  { icon: '📝', title: 'Auto Subtitles', desc: 'Burns in accurate subtitles in 50+ languages including Lithuanian instantly.' },
  { icon: '📱', title: '9:16 Formatting', desc: 'Perfectly reformats every clip for TikTok, Instagram Reels and YouTube Shorts.' },
  { icon: '🚀', title: 'Direct Publishing', desc: 'Publish directly to all social platforms in one click from the dashboard.' },
  { icon: '🎯', title: 'Viral Scoring', desc: 'Every clip gets a 0-100 viral score so you know exactly what will perform.' },
  { icon: '🌍', title: '50+ Languages', desc: 'Full support for Lithuanian, German, French, Spanish, Polish, Russian and more.' },
]

const LANGS = ['🇱🇹 Lithuanian','🇬🇧 English','🇩🇪 German','🇫🇷 French','🇪🇸 Spanish','🇵🇱 Polish','🇷🇺 Russian','🇮🇹 Italian','🇵🇹 Portuguese','🇯🇵 Japanese']

export default function Landing({ setPage, dark }) {
  const [openFaq, setOpenFaq] = useState(null)
  const [lang, setLang] = useState('🇱🇹 Lithuanian')
  const [contactName, setContactName] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [contactMsg, setContactMsg] = useState('')
  const [sent, setSent] = useState(false)

  const bg = '#ffffff'
  const text = '#1a1a1a'
  const sub = '#666666'
  const card = '#f8f7f5'
  const border = '#e8e5e0'
  const purple = '#5b4cf5'

  return (
    <div style={{ background: bg, color: text, minHeight: '100vh', fontFamily: 'DM Sans, -apple-system, sans-serif' }}>

      {/* NAV */}
      <nav style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '16px 48px', borderBottom: `1px solid ${border}`,
        position: 'sticky', top: 0, background: bg, zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <img src="/logo.png" alt="ClipGen.AI" style={{ width: 36, height: 36, borderRadius: '50%' }} />
          <span style={{ fontWeight: 700, fontSize: 16, letterSpacing: '-0.4px' }}>ClipGen.AI</span>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {/* Language selector */}
          <select value={lang} onChange={e => setLang(e.target.value)} style={{
            padding: '7px 12px', borderRadius: 8, border: `1px solid ${border}`,
            background: card, fontSize: 13, color: text, outline: 'none', cursor: 'pointer',
          }}>
            {LANGS.map(l => <option key={l}>{l}</option>)}
          </select>
          <button onClick={() => setPage('pricing')} style={{
            background: 'none', border: 'none', color: sub, fontSize: 14, cursor: 'pointer', padding: '8px 12px',
          }}>Pricing</button>
          <button onClick={() => {
            const el = document.getElementById('faq')
            el && el.scrollIntoView({ behavior: 'smooth' })
          }} style={{
            background: 'none', border: 'none', color: sub, fontSize: 14, cursor: 'pointer', padding: '8px 12px',
          }}>FAQ</button>
          <button onClick={() => setPage('dashboard')} style={{
            background: purple, color: '#fff', border: 'none',
            borderRadius: 8, padding: '9px 20px', fontSize: 14, fontWeight: 500, cursor: 'pointer',
          }}>Get started</button>
        </div>
      </nav>

      {/* HERO */}
      <div style={{ textAlign: 'center', padding: '72px 24px 56px', maxWidth: 720, margin: '0 auto' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: '#fff5f0', color: '#e85d04', border: '1px solid #ffd7b5',
          borderRadius: 20, padding: '5px 14px', fontSize: 12.5,
          fontWeight: 600, marginBottom: 24, letterSpacing: '0.2px',
        }}>✦ AI-powered video clipping</div>
        <h1 style={{
          fontSize: 56, fontWeight: 800, letterSpacing: '-2.5px',
          lineHeight: 1.05, marginBottom: 20, color: text,
        }}>
          Turn long videos into<br />
          <span style={{ color: purple }}>viral clips</span> automatically
        </h1>
        <p style={{ fontSize: 17, color: sub, lineHeight: 1.65, marginBottom: 36, maxWidth: 540, margin: '0 auto 36px' }}>
          Upload any video. AI finds the best moments, adds subtitles, formats for TikTok, Reels and Shorts — in minutes.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => setPage('dashboard')} style={{
            background: purple, color: '#fff', border: 'none',
            borderRadius: 10, padding: '15px 36px', fontSize: 15,
            fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 14px rgba(91,76,245,0.35)',
          }}>Start for free →</button>
          <button onClick={() => setPage('pricing')} style={{
            background: '#fff', color: text, border: `1px solid ${border}`,
            borderRadius: 10, padding: '15px 32px', fontSize: 15,
            fontWeight: 500, cursor: 'pointer',
          }}>View pricing</button>
        </div>
        {/* Trust line */}
        <p style={{ fontSize: 12.5, color: '#aaa', marginTop: 20 }}>
          No credit card required · Cancel anytime · Lithuanian language supported
        </p>
      </div>

      {/* DEMO SECTION */}
      <div style={{ maxWidth: 900, margin: '0 auto 80px', padding: '0 24px' }} id="demo">
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <h2 style={{ fontSize: 32, fontWeight: 700, letterSpacing: '-1px', marginBottom: 8 }}>See it in action</h2>
          <p style={{ color: sub, fontSize: 15 }}>Upload a video and watch AI generate viral clips live</p>
        </div>
        <div style={{
          background: 'linear-gradient(135deg, #5b4cf5 0%, #8b5cf6 100%)',
          borderRadius: 20, padding: '48px 32px', textAlign: 'center', color: '#fff',
          boxShadow: '0 20px 60px rgba(91,76,245,0.25)',
        }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>✂</div>
          <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 8 }}>Live AI Demo</div>
          <div style={{ opacity: 0.85, fontSize: 14, marginBottom: 24, lineHeight: 1.6 }}>
            Upload any MP4 video and ClipGen.AI will automatically<br />
            find the best moments and generate ready-to-post clips
          </div>
          <button onClick={() => setPage('dashboard')} style={{
            background: '#fff', color: purple, border: 'none',
            borderRadius: 10, padding: '13px 32px', fontSize: 15, fontWeight: 700, cursor: 'pointer',
          }}>Try it now — it's free</button>
        </div>
      </div>

      {/* ANALYTICS PREVIEW */}
      <div style={{ background: '#fafaf8', padding: '64px 24px 80px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <h2 style={{ fontSize: 32, fontWeight: 700, letterSpacing: '-1px', marginBottom: 8 }}>Track your growth</h2>
            <p style={{ color: sub, fontSize: 15 }}>Monitor views, shares, comments and viral scores over time</p>
          </div>
          {/* Fake analytics chart */}
          <div style={{ background: '#fff', borderRadius: 16, border: `1px solid ${border}`, padding: '28px', marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <div style={{ fontWeight: 600, fontSize: 15 }}>Monthly Performance</div>
              <div style={{ fontSize: 12.5, color: sub }}>Last 6 months</div>
            </div>
            {/* Chart bars */}
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, height: 120 }}>
              {[40, 65, 45, 80, 95, 72].map((h, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                  <div style={{
                    width: '100%', height: `${h}%`, borderRadius: 6,
                    background: i === 4 ? purple : `rgba(91,76,245,${0.2 + i*0.08})`,
                    transition: 'all 0.3s',
                  }} />
                  <div style={{ fontSize: 11, color: sub }}>
                    {['Nov','Dec','Jan','Feb','Mar','Apr'][i]}
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Stats row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
            {[
              { label: 'Total Views', value: '2.4M', change: '+18%' },
              { label: 'Comments', value: '14.2K', change: '+32%' },
              { label: 'Shares', value: '8.7K', change: '+24%' },
              { label: 'Avg Viral Score', value: '84/100', change: '+12%' },
            ].map(s => (
              <div key={s.label} style={{
                background: '#fff', border: `1px solid ${border}`,
                borderRadius: 12, padding: '18px',
              }}>
                <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.8px', color: text }}>{s.value}</div>
                <div style={{ fontSize: 12, color: sub, marginTop: 2 }}>{s.label}</div>
                <div style={{ fontSize: 11.5, color: '#16a34a', fontWeight: 600, marginTop: 4 }}>{s.change}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FEATURES */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '80px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 style={{ fontSize: 32, fontWeight: 700, letterSpacing: '-1px', marginBottom: 8 }}>Everything you need</h2>
          <p style={{ color: sub, fontSize: 15 }}>One platform to create, optimize and publish viral short-form content</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
          {FEATURES.map(f => (
            <div key={f.title} style={{
              background: '#fff', border: `1px solid ${border}`,
              borderRadius: 14, padding: '24px',
              transition: 'box-shadow 0.2s',
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: '#f0eeff', display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: 22, marginBottom: 14,
              }}>{f.icon}</div>
              <div style={{ fontWeight: 600, fontSize: 14.5, marginBottom: 6 }}>{f.title}</div>
              <div style={{ fontSize: 13.5, color: sub, lineHeight: 1.55 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div style={{ background: '#fafaf8', padding: '80px 24px' }} id="faq">
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 32, fontWeight: 700, letterSpacing: '-1px', marginBottom: 8 }}>Frequently asked questions</h2>
            <p style={{ color: sub, fontSize: 15 }}>Everything you need to know about ClipGen.AI</p>
          </div>
          {FAQS.map((faq, i) => (
            <div key={i} style={{
              background: '#fff', border: `1px solid ${border}`,
              borderRadius: 12, marginBottom: 10, overflow: 'hidden',
            }}>
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{
                width: '100%', padding: '18px 20px',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
              }}>
                <span style={{ fontWeight: 600, fontSize: 14, color: text }}>{faq.q}</span>
                <span style={{ color: purple, fontSize: 18, fontWeight: 300, marginLeft: 12 }}>
                  {openFaq === i ? '−' : '+'}
                </span>
              </button>
              {openFaq === i && (
                <div style={{ padding: '0 20px 18px', fontSize: 13.5, color: sub, lineHeight: 1.6 }}>
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* CONTACT */}
      <div style={{ maxWidth: 600, margin: '0 auto', padding: '80px 24px' }} id="contact">
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h2 style={{ fontSize: 32, fontWeight: 700, letterSpacing: '-1px', marginBottom: 8 }}>Contact us</h2>
          <p style={{ color: sub, fontSize: 15 }}>Have a question? We'll get back to you as soon as possible.</p>
        </div>
        <div style={{ background: '#fff', border: `1px solid ${border}`, borderRadius: 16, padding: '32px' }}>
          {[['Your name', contactName, setContactName, 'text'],
            ['Email address', contactEmail, setContactEmail, 'email']].map(([ph, val, setter, type]) => (
            <div key={ph} style={{ marginBottom: 16 }}>
              <input
                type={type} value={val} onChange={e => setter(e.target.value)}
                placeholder={ph}
                style={{
                  width: '100%', padding: '11px 14px', borderRadius: 8,
                  border: `1px solid ${border}`, fontSize: 14, outline: 'none',
                  background: '#fafaf8', color: text,
                }} />
            </div>
          ))}
          <textarea
            value={contactMsg} onChange={e => setContactMsg(e.target.value)}
            placeholder="Your message"
            rows={4}
            style={{
              width: '100%', padding: '11px 14px', borderRadius: 8,
              border: `1px solid ${border}`, fontSize: 14, outline: 'none',
              background: '#fafaf8', color: text, resize: 'vertical',
              marginBottom: 16, fontFamily: 'inherit',
            }} />
          <button
            onClick={() => {
              if (contactName && contactEmail && contactMsg) {
                window.open(`mailto:clipgenai@gmail.com?subject=Contact from ${contactName}&body=${contactMsg}%0A%0AFrom: ${contactName}%0AEmail: ${contactEmail}`)
                setSent(true)
              }
            }}
            style={{
              width: '100%', padding: '12px', borderRadius: 8,
              background: purple, color: '#fff', fontWeight: 600,
              fontSize: 14, border: 'none', cursor: 'pointer',
            }}>
            {sent ? '✓ Message sent!' : 'Send message via Gmail'}
          </button>
          <p style={{ textAlign: 'center', fontSize: 12.5, color: '#aaa', marginTop: 12 }}>
            Or email us directly: clipgenai@gmail.com
          </p>
        </div>
      </div>

      {/* CTA */}
      <div style={{
        background: 'linear-gradient(135deg, #5b4cf5 0%, #8b5cf6 100%)',
        padding: '64px 24px', textAlign: 'center', color: '#fff',
      }}>
        <h2 style={{ fontSize: 36, fontWeight: 700, letterSpacing: '-1px', marginBottom: 16 }}>Ready to go viral?</h2>
        <p style={{ fontSize: 16, opacity: 0.85, marginBottom: 32 }}>
          Join creators using ClipGen.AI to grow their audience faster
        </p>
        <button onClick={() => setPage('dashboard')} style={{
          background: '#fff', color: purple, border: 'none',
          borderRadius: 10, padding: '15px 40px', fontSize: 15, fontWeight: 700, cursor: 'pointer',
        }}>Get started free →</button>
      </div>

      {/* FOOTER */}
      <div style={{
        padding: '24px 48px', borderTop: `1px solid ${border}`,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        color: sub, fontSize: 13, flexWrap: 'wrap', gap: 12,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <img src="/logo.png" style={{ width: 24, height: 24, borderRadius: '50%' }} />
          <span>© 2026 ClipGen.AI</span>
        </div>
        <div style={{ display: 'flex', gap: 20 }}>
          <button onClick={() => setPage('pricing')} style={{ background: 'none', border: 'none', color: sub, cursor: 'pointer', fontSize: 13 }}>Pricing</button>
          <button onClick={() => document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' })} style={{ background: 'none', border: 'none', color: sub, cursor: 'pointer', fontSize: 13 }}>FAQ</button>
          <button onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })} style={{ background: 'none', border: 'none', color: sub, cursor: 'pointer', fontSize: 13 }}>Contact</button>
        </div>
        <span>Built for European creators</span>
      </div>
    </div>
  )
}

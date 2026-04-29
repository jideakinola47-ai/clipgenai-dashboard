import { useState } from 'react'

const FAQS = [
  { q: 'How does ClipGen.AI work?', a: 'Upload a long video — our AI transcribes it, finds the most viral moments, cuts clips, adds subtitles and reformats to 9:16 vertical for TikTok, Reels and Shorts in minutes.' },
  { q: 'What video formats are supported?', a: 'MP4, MOV, AVI and MKV files up to 500MB and 60 minutes long.' },
  { q: 'How many clips does the AI generate?', a: 'Between 3 and 10 clips per video depending on your plan, each scored for viral potential from 0-100.' },
  { q: 'Is Lithuanian language supported?', a: 'Yes — Lithuanian is fully supported for subtitles and the platform interface. We support 50+ languages total.' },
  { q: 'Can I publish directly to social media?', a: 'Yes — connect TikTok, Instagram and YouTube and publish clips with one click directly from the dashboard.' },
  { q: 'How is ClipGen.AI different from Opus Clip?', a: 'ClipGen.AI is built for the European market with full Lithuanian support, Euro pricing, GDPR compliance and features designed for European creators and businesses.' },
  { q: 'Can I cancel my subscription anytime?', a: 'Yes — cancel anytime with no fees or long-term commitments.' },
  { q: 'What is a viral score?', a: 'Each clip receives a score from 0 to 100 based on hooks, pacing, emotional impact and content quality — so you know which clips to post first.' },
]

const STEPS = [
  { num: '01', title: 'Upload Your Video', desc: 'Drag and drop any MP4, MOV or AVI. Podcasts, interviews, lectures — up to 500MB, 60 minutes.' },
  { num: '02', title: 'AI Analyses Content', desc: 'Our AI transcribes the audio, detects emotional peaks, strong hooks and viral potential segments.' },
  { num: '03', title: 'Clips Are Generated', desc: 'AI cuts the best moments, reformats to 9:16 vertical and burns in accurate subtitles automatically.' },
  { num: '04', title: 'Publish Everywhere', desc: 'Download your clips or publish directly to TikTok, Instagram Reels and YouTube Shorts instantly.' },
]

const FEATURES = [
  { icon: '🎯', title: 'Viral Score Badges', desc: 'Every clip gets a score from 0-100 based on hook strength, emotion peaks and shareability metrics.' },
  { icon: '📝', title: 'Auto Captions', desc: 'AI-generated subtitles in 50+ languages with animated styles that increase watch time by 40%.' },
  { icon: '🚀', title: 'Direct Publishing', desc: 'Publish directly to TikTok, Instagram Reels and YouTube Shorts simultaneously from one dashboard.' },
  { icon: '⚡', title: 'Smart Clip Detection', desc: 'AI identifies the most engaging 30-90 second segments from hours of content automatically.' },
  { icon: '✍', title: 'Hook Title Generator', desc: 'AI writes scroll-stopping hook titles and captions optimised for each platform\'s algorithm.' },
  { icon: '👥', title: 'Team & Agency Mode', desc: 'Manage multiple clients, white-label the platform, and collaborate with your team members.' },
]

const COMP = [
  { feature: 'Lithuanian language', us: true, opus: false, klap: false },
  { feature: 'European market focus', us: true, opus: false, klap: false },
  { feature: 'Euro pricing', us: true, opus: false, klap: false },
  { feature: 'Unlimited plan available', us: true, opus: false, klap: false },
  { feature: 'Agency white-label', us: true, opus: 'Paid', klap: false },
  { feature: 'API access', us: true, opus: 'Enterprise', klap: false },
  { feature: 'Team collaboration', us: true, opus: true, klap: false },
  { feature: 'Direct social publishing', us: true, opus: true, klap: 'Limited' },
]

const LANGS = [
  {code:'lt', flag:'🇱🇹', label:'Lietuvių'},
  {code:'en', flag:'🇬🇧', label:'English'},
  {code:'de', flag:'🇩🇪', label:'Deutsch'},
  {code:'fr', flag:'🇫🇷', label:'Français'},
  {code:'es', flag:'🇪🇸', label:'Español'},
  {code:'pl', flag:'🇵🇱', label:'Polski'},
  {code:'ru', flag:'🇷🇺', label:'Русский'},
  {code:'it', flag:'🇮🇹', label:'Italiano'},
  {code:'pt', flag:'🇵🇹', label:'Português'},
  {code:'nl', flag:'🇳🇱', label:'Nederlands'},
  {code:'sv', flag:'🇸🇪', label:'Svenska'},
  {code:'no', flag:'🇳🇴', label:'Norsk'},
  {code:'da', flag:'🇩🇰', label:'Dansk'},
  {code:'fi', flag:'🇫🇮', label:'Suomi'},
  {code:'ja', flag:'🇯🇵', label:'日本語'},
  {code:'zh', flag:'🇨🇳', label:'中文'},
  {code:'ko', flag:'🇰🇷', label:'한국어'},
  {code:'ar', flag:'🇸🇦', label:'العربية'},
  {code:'tr', flag:'🇹🇷', label:'Türkçe'},
  {code:'hi', flag:'🇮🇳', label:'हिन्दी'},
]


const T = {
  lt: {
    badge: '✦ Dirbtinio intelekto vaizdo įrašų karpymo platforma',
    hero1: 'Paversk ilgus vaizdo įrašus į',
    hero2: 'Viralinius klipus',
    hero3: 'Automatiškai',
    sub: 'Įkelk bet kurį vaizdo įrašą. Dirbtinis intelektas suranda geriausias akimirkas, sukarpо klipus, prideda subtitrus ir formatuoja TikTok, Reels ir Shorts.',
    cta1: 'Pradėti nemokamai →',
    cta2: '▶ Žiūrėti demonstraciją',
    trust: 'Nereikia kredito kortelės · 3 dienos nemokamai · Atšaukti galima bet kada',
    howTitle: 'Nuo įkėlimo iki viralinio per',
    how4: '4 žingsnius',
    howSub: 'Nereikia redagavimo įgūdžių. Mūsų DI viską atlieka automatiškai.',
    featTitle: 'Viskas ko reikia',
    featSub: 'Galingi DI įrankiai sukurti kūrėjams, kurie nori rezultatų.',
    faqTitle: 'Dažniausiai užduodami klausimai',
    faqSub: 'Viskas ką reikia žinoti apie ClipGen.AI',
    contactTitle: 'Susisiekite su mumis',
    contactSub: 'Turite klausimą? Parašykite mums.',
    ctaFinal: 'Pasiruošę tapti viraliais?',
    ctaFinalSub: 'Prisijunkite prie kūrėjų naudojančių ClipGen.AI.',
    startBtn: '⚡ Pradėti kurti klipus',
  },
  en: {
    badge: '✦ AI-powered video clipping platform',
    hero1: 'Turn Long Videos Into',
    hero2: 'Viral Short Clips',
    hero3: 'Automatically',
    sub: 'Upload any long video. AI detects the best moments, cuts clips, adds hook titles — and publishes directly to TikTok, Reels & Shorts.',
    cta1: 'Start Free Trial →',
    cta2: '▶ Watch Demo',
    trust: 'No credit card required · 3 days free · Cancel anytime',
    howTitle: 'From Upload to Viral in',
    how4: '4 Steps',
    howSub: 'No editing skills needed. Our AI handles everything from analysis to publishing.',
    featTitle: 'Everything you need to go viral',
    featSub: 'Powerful AI tools built specifically for content creators who want results.',
    faqTitle: 'Frequently asked questions',
    faqSub: 'Everything you need to know about ClipGen.AI',
    contactTitle: 'Stay in the loop',
    contactSub: 'Have a question? Get in touch and we\'ll respond quickly.',
    ctaFinal: 'Ready to go viral?',
    ctaFinalSub: 'Join thousands of creators turning long videos into viral clips automatically.',
    startBtn: '⚡ Start Creating Free Clips',
  },
  de: {
    badge: '✦ KI-gestützte Video-Clipping-Plattform',
    hero1: 'Verwandle lange Videos in',
    hero2: 'Virale Kurzclips',
    hero3: 'Automatisch',
    sub: 'Lade ein beliebiges Video hoch. Die KI erkennt die besten Momente, schneidet Clips, fügt Untertitel hinzu und veröffentlicht direkt auf TikTok, Reels & Shorts.',
    cta1: 'Kostenlos starten →',
    cta2: '▶ Demo ansehen',
    trust: 'Keine Kreditkarte erforderlich · 3 Tage kostenlos · Jederzeit kündbar',
    howTitle: 'Vom Upload bis viral in',
    how4: '4 Schritten',
    howSub: 'Keine Bearbeitungskenntnisse erforderlich. Unsere KI übernimmt alles automatisch.',
    featTitle: 'Alles was du brauchst',
    featSub: 'Leistungsstarke KI-Tools speziell für Content-Creator.',
    faqTitle: 'Häufig gestellte Fragen',
    faqSub: 'Alles was Sie über ClipGen.AI wissen müssen.',
    contactTitle: 'Kontakt',
    contactSub: 'Haben Sie eine Frage? Wir antworten schnell.',
    ctaFinal: 'Bereit viral zu gehen?',
    ctaFinalSub: 'Schließen Sie sich Tausenden von Creatorn an.',
    startBtn: '⚡ Clips erstellen',
  },
  fr: {
    badge: '✦ Plateforme de découpe vidéo par IA',
    hero1: 'Transformez vos longues vidéos en',
    hero2: 'Clips Viraux',
    hero3: 'Automatiquement',
    sub: 'Téléchargez n\'importe quelle vidéo. L\'IA détecte les meilleurs moments, coupe les clips, ajoute des sous-titres et publie directement sur TikTok, Reels & Shorts.',
    cta1: 'Commencer gratuitement →',
    cta2: '▶ Voir la démo',
    trust: 'Aucune carte de crédit requise · 3 jours gratuits · Annulez à tout moment',
    howTitle: 'Du téléchargement au viral en',
    how4: '4 étapes',
    howSub: 'Aucune compétence en montage requise. Notre IA gère tout automatiquement.',
    featTitle: 'Tout ce dont vous avez besoin',
    featSub: 'Des outils IA puissants pour les créateurs de contenu.',
    faqTitle: 'Questions fréquentes',
    faqSub: 'Tout ce que vous devez savoir sur ClipGen.AI',
    contactTitle: 'Contactez-nous',
    contactSub: 'Vous avez une question? Nous répondons rapidement.',
    ctaFinal: 'Prêt à devenir viral?',
    ctaFinalSub: 'Rejoignez des milliers de créateurs utilisant ClipGen.AI.',
    startBtn: '⚡ Créer des clips gratuits',
  },
}
// Fallback to English for unsupported languages
const getText = (lang) => T[lang] || T['en']

export default function Landing({ setPage }) {
  const [openFaq, setOpenFaq] = useState(null)
  const [lang, setLang] = useState('lt')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [msg, setMsg] = useState('')
  const [sent, setSent] = useState(false)
  const [billing, setBilling] = useState('monthly')

  const P = '#5b4cf5'
  const t = getText(lang)

  return (
    <div style={{ fontFamily: 'Inter, -apple-system, sans-serif', color: '#1a1a1a', background: '#fff' }}>

      {/* NAV */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 48px', borderBottom: '1px solid #e8e5e0', position: 'sticky', top: 0, background: '#fff', zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <img src="/logo.png" style={{ width: 34, height: 34, borderRadius: '50%' }} />
          <span style={{ fontWeight: 800, fontSize: 16, letterSpacing: '-0.5px' }}>ClipGen.AI</span>
        </div>
        <div className="nav-links" style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          {[['Features', '#features'], ['How It Works', '#how'], ['Pricing', '#pricing'], ['FAQ', '#faq']].map(([label, href]) => (
            <a key={label} href={href} style={{ padding: '7px 12px', color: '#666', fontSize: 13.5, borderRadius: 6 }}>{label}</a>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <select value={lang} onChange={e => setLang(e.target.value)} style={{ padding: '7px 10px', borderRadius: 8, border: '1px solid #e8e5e0', background: '#f8f7f5', fontSize: 12.5, outline: 'none', cursor: 'pointer' }}>
            {LANGS.map(l => <option key={l.code} value={l.code}>{l.flag} {l.label}</option>)}
          </select>
          <button onClick={() => setPage('dashboard')} style={{ background: P, color: '#fff', border: 'none', borderRadius: 8, padding: '9px 20px', fontSize: 13.5, fontWeight: 600, cursor: 'pointer', boxShadow: '0 2px 8px rgba(91,76,245,0.3)' }}>
            Start Free Trial →
          </button>
        </div>
      </nav>

      {/* HERO */}
      <div style={{ textAlign: 'center', padding: '80px 24px 60px', maxWidth: 800, margin: '0 auto' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#fff5f0', color: '#e85d04', border: '1px solid #ffd7b5', borderRadius: 20, padding: '5px 14px', fontSize: 12, fontWeight: 600, marginBottom: 24, letterSpacing: '0.3px' }}>
          {t.badge}
        </div>
        <h1 className="hero-title" style={{ fontSize: 60, fontWeight: 800, letterSpacing: '-3px', lineHeight: 1.0, marginBottom: 20, color: '#0a0a0a' }}>
          {t.hero1}<br />
          <span style={{ color: P }}>{t.hero2}</span><br />
          {t.hero3}
        </h1>
        <p style={{ fontSize: 18, color: '#666', lineHeight: 1.65, marginBottom: 36, maxWidth: 560, margin: '0 auto 36px' }}>
          {t.sub}
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 28 }}>
          <button onClick={() => setPage('dashboard')} style={{ background: P, color: '#fff', border: 'none', borderRadius: 10, padding: '15px 36px', fontSize: 15, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 16px rgba(91,76,245,0.35)' }}>
            {t.cta1}
          </button>
          <button onClick={() => document.getElementById('how')?.scrollIntoView({ behavior: 'smooth' })} style={{ background: '#fff', color: '#1a1a1a', border: '1px solid #e8e5e0', borderRadius: 10, padding: '15px 32px', fontSize: 15, fontWeight: 500, cursor: 'pointer' }}>
            {t.cta2}
          </button>
        </div>
        <p style={{ fontSize: 12.5, color: '#bbb' }}>{t.trust}</p>
      </div>

      {/* STATS */}
      <div style={{ background: '#f8f7f5', padding: '40px 24px' }}>
        <div className="hero-stats" style={{ maxWidth: 800, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20, textAlign: 'center' }}>
          {[['2.4M+','Clips Generated'],['152K','Clips Created'],['96','Avg Viral Share'],['10x','Faster Than Manual']].map(([val, label]) => (
            <div key={label}>
              <div style={{ fontSize: 32, fontWeight: 800, color: '#0a0a0a', letterSpacing: '-1px' }}>{val}</div>
              <div style={{ fontSize: 13, color: '#888', marginTop: 4 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div id="how" style={{ padding: '80px 24px', maxWidth: 900, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: P, letterSpacing: '2px', marginBottom: 12 }}>HOW IT WORKS</div>
          <h2 style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-1.5px', marginBottom: 8 }}>
            From Upload to Viral in <span style={{ color: P }}>4 Steps</span>
          </h2>
          <p style={{ color: '#888', fontSize: 15 }}>No editing skills needed. Our AI handles everything from analysis to publishing.</p>
        </div>
        <div className="steps-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginTop: 48 }}>
          {STEPS.map((s, i) => (
            <div key={s.num} style={{ position: 'relative' }}>
              {i < 3 && <div style={{ position: 'absolute', top: 20, left: '60%', width: '80%', height: 1, background: '#e8e5e0', zIndex: 0 }} />}
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: P + '15', border: `1px solid ${P}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: P, marginBottom: 14 }}>{s.num}</div>
                <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 8 }}>{s.title}</div>
                <div style={{ fontSize: 12.5, color: '#888', lineHeight: 1.55 }}>{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FEATURES */}
      <div id="features" style={{ background: '#f8f7f5', padding: '80px 24px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: P, letterSpacing: '2px', marginBottom: 12 }}>FEATURES</div>
            <h2 style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-1.5px', marginBottom: 8 }}>
              Everything you need to <span style={{ color: P }}>go viral</span>
            </h2>
            <p style={{ color: '#888', fontSize: 15 }}>Powerful AI tools built specifically for content creators who want results.</p>
          </div>
          <div className="features-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {FEATURES.map(f => (
              <div key={f.title} style={{ background: '#fff', borderRadius: 14, padding: '24px', border: '1px solid #e8e5e0' }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: P + '12', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, marginBottom: 14 }}>{f.icon}</div>
                <div style={{ fontWeight: 700, fontSize: 14.5, marginBottom: 8 }}>{f.title}</div>
                <div style={{ fontSize: 13, color: '#888', lineHeight: 1.6 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PRICING */}
      <div id="pricing" style={{ background: '#f8f7f5', padding: '80px 24px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: P, letterSpacing: '2px', marginBottom: 12 }}>PRICING</div>
            <h2 style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-1.5px', marginBottom: 8 }}>Start free. Scale as you grow.</h2>
            <p style={{ color: '#888', fontSize: 15, marginBottom: 20 }}>Cancel anytime.</p>
            <div style={{ display: 'inline-flex', background: '#e8e5e0', borderRadius: 10, padding: 4 }}>
              {['monthly', 'yearly'].map(b => (
                <button key={b} onClick={() => setBilling(b)} style={{ padding: '7px 20px', borderRadius: 8, border: 'none', background: billing === b ? '#fff' : 'transparent', color: billing === b ? '#1a1a1a' : '#888', fontWeight: billing === b ? 600 : 400, fontSize: 13, cursor: 'pointer' }}>
                  {b === 'monthly' ? 'Monthly' : 'Yearly'}{b === 'yearly' ? ' · Save 5 months' : ''}
                </button>
              ))}
            </div>
          </div>
          <div className="pricing-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {[
              { name: 'Starter', price: billing === 'yearly' ? '€19' : '€29', desc: 'For individual creators getting started', features: ['10 videos/month','Auto subtitles','9:16 format','3 social accounts','Email support'], highlight: false, cta: 'Get Started Free' },
              { name: 'Pro', price: billing === 'yearly' ? '€39' : '€59', desc: 'For serious content creators who want to go viral', features: ['Everything in Starter','50 videos/month','Transparent scoring','Unlimited social accounts','Priority processing','50+ languages','Priority support'], highlight: true, cta: 'Start Free Trial' },
              { name: 'Agency', price: billing === 'yearly' ? '€69' : '€99', desc: 'For managing multiple clients at scale', features: ['Everything in Pro','Unlimited videos','White-label branding','Client management','Team members','Custom integrations','SLA guarantee'], highlight: false, cta: 'Contact Sales' },
            ].map(plan => (
              <div key={plan.name} style={{
                background: plan.highlight ? '#fff' : '#fff',
                border: `2px solid ${plan.highlight ? P : '#e8e5e0'}`,
                borderRadius: 16, padding: '28px 24px', position: 'relative',
                boxShadow: plan.highlight ? '0 8px 32px rgba(91,76,245,0.15)' : 'none',
              }}>
                {plan.highlight && <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: P, color: '#fff', borderRadius: 20, padding: '3px 14px', fontSize: 11, fontWeight: 700 }}>BEST VALUE</div>}
                <div style={{ fontSize: 12, fontWeight: 700, color: '#aaa', letterSpacing: '0.5px', marginBottom: 6 }}>{plan.name.toUpperCase()}</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 6 }}>
                  <span style={{ fontSize: 44, fontWeight: 800, letterSpacing: '-2px', color: '#0a0a0a' }}>{plan.price}</span>
                  <span style={{ fontSize: 14, color: '#aaa' }}>/month</span>
                </div>
                <div style={{ fontSize: 13, color: '#888', marginBottom: 20, lineHeight: 1.4 }}>{plan.desc}</div>
                <button onClick={() => setPage('dashboard')} style={{
                  width: '100%', padding: '11px', borderRadius: 8,
                  background: plan.highlight ? P : '#fff',
                  color: plan.highlight ? '#fff' : P,
                  border: `2px solid ${P}`,
                  fontWeight: 700, fontSize: 14, cursor: 'pointer', marginBottom: 22,
                }}>{plan.cta}</button>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {plan.features.map(f => (
                    <div key={f} style={{ display: 'flex', gap: 8, fontSize: 13 }}>
                      <span style={{ color: P, fontWeight: 700, flexShrink: 0 }}>✓</span>
                      <span style={{ color: '#555' }}>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div id="faq" style={{ padding: '80px 24px', maxWidth: 680, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-1.5px', marginBottom: 8 }}>Frequently asked questions</h2>
          <p style={{ color: '#888', fontSize: 15 }}>Everything you need to know about ClipGen.AI</p>
        </div>
        {FAQS.map((faq, i) => (
          <div key={i} style={{ borderBottom: '1px solid #e8e5e0', overflow: 'hidden' }}>
            <button onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{
              width: '100%', padding: '18px 0', display: 'flex', justifyContent: 'space-between',
              alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
            }}>
              <span style={{ fontWeight: 600, fontSize: 14.5, color: '#1a1a1a' }}>{faq.q}</span>
              <span style={{ color: P, fontSize: 20, fontWeight: 300, marginLeft: 16, flexShrink: 0 }}>{openFaq === i ? '−' : '+'}</span>
            </button>
            {openFaq === i && <div style={{ paddingBottom: 18, fontSize: 14, color: '#666', lineHeight: 1.65 }}>{faq.a}</div>}
          </div>
        ))}
      </div>

      {/* CONTACT */}
      <div id="contact" style={{ background: '#f8f7f5', padding: '80px 24px' }}>
        <div style={{ maxWidth: 560, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <h2 style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-1.5px', marginBottom: 8 }}>Stay in the loop</h2>
            <p style={{ color: '#888', fontSize: 15 }}>Have a question? Get in touch and we'll respond quickly.</p>
          </div>
          <div style={{ background: '#fff', borderRadius: 16, padding: '32px', border: '1px solid #e8e5e0' }}>
            <div className="contact-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
              {[['Your name', name, setName, 'text'], ['Email address', email, setEmail, 'email']].map(([ph, val, setter, type]) => (
                <input key={ph} type={type} value={val} onChange={e => setter(e.target.value)} placeholder={ph} style={{ padding: '11px 14px', borderRadius: 8, border: '1px solid #e8e5e0', fontSize: 13.5, outline: 'none', background: '#fafaf8', color: '#1a1a1a' }} />
              ))}
            </div>
            <textarea value={msg} onChange={e => setMsg(e.target.value)} placeholder="Your message..." rows={4} style={{ width: '100%', padding: '11px 14px', borderRadius: 8, border: '1px solid #e8e5e0', fontSize: 13.5, outline: 'none', background: '#fafaf8', color: '#1a1a1a', resize: 'vertical', marginBottom: 12, fontFamily: 'inherit' }} />
            <button onClick={() => { if (name && email && msg) { window.open(`mailto:clipgenai@gmail.com?subject=Message from ${name}&body=${msg}`); setSent(true) } }} style={{ width: '100%', padding: '12px', borderRadius: 8, background: P, color: '#fff', fontWeight: 700, fontSize: 14, border: 'none', cursor: 'pointer' }}>
              {sent ? '✓ Message sent!' : 'Subscribe →'}
            </button>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ background: '#0a0a0a', padding: '80px 24px', textAlign: 'center', color: '#fff' }}>
        <h2 style={{ fontSize: 40, fontWeight: 800, letterSpacing: '-2px', marginBottom: 16 }}>Ready to go viral?</h2>
        <p style={{ fontSize: 16, color: '#888', marginBottom: 32 }}>Join thousands of creators turning long videos into viral clips automatically.</p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 20 }}>
          <button onClick={() => setPage('dashboard')} style={{ background: P, color: '#fff', border: 'none', borderRadius: 10, padding: '15px 36px', fontSize: 15, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 20px rgba(91,76,245,0.4)' }}>⚡ Start Creating Free Clips</button>
          <button onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })} style={{ background: 'transparent', color: '#888', border: '1px solid #333', borderRadius: 10, padding: '15px 32px', fontSize: 15, cursor: 'pointer' }}>View Pricing</button>
        </div>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
          {['No credit card required','3 days free','Cancel anytime'].map(t => (
            <span key={t} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#555' }}>
              <span style={{ color: '#22c55e' }}>✓</span>{t}
            </span>
          ))}
        </div>
      </div>

      {/* FOOTER */}
      <div style={{ background: '#0a0a0a', padding: '32px 48px', borderTop: '1px solid #1a1a1a' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <img src="/logo.png" style={{ width: 26, height: 26, borderRadius: '50%' }} />
            <span style={{ fontWeight: 700, fontSize: 14, color: '#fff' }}>ClipGen.AI</span>
          </div>
          <div style={{ display: 'flex', gap: 20 }}>
            {[['Product','#features'],['How it Works','#how'],['Pricing','#pricing'],['FAQ','#faq'],['Contact','#contact']].map(([label, href]) => (
              <a key={label} href={href} style={{ color: '#555', fontSize: 13 }}>{label}</a>
            ))}
          </div>
          <span style={{ color: '#444', fontSize: 12 }}>© 2026 ClipGen.AI — Built for European creators</span>
        </div>
      </div>
    </div>
  )
}

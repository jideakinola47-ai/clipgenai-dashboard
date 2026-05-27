import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../contexts/ThemeContext'
import ThemeToggle from '../components/ThemeToggle'

/* ─── TRANSLATIONS (kept identical to original) ─── */
const LANGS = [
  {code:'lt',flag:'🇱🇹',label:'Lietuvių'},
  {code:'en',flag:'🇬🇧',label:'English'},
  {code:'de',flag:'🇩🇪',label:'Deutsch'},
  {code:'fr',flag:'🇫🇷',label:'Français'},
  {code:'es',flag:'🇪🇸',label:'Español'},
  {code:'pl',flag:'🇵🇱',label:'Polski'},
  {code:'ru',flag:'🇷🇺',label:'Русский'},
  {code:'it',flag:'🇮🇹',label:'Italiano'},
  {code:'pt',flag:'🇵🇹',label:'Português'},
  {code:'nl',flag:'🇳🇱',label:'Nederlands'},
  {code:'ja',flag:'🇯🇵',label:'日本語'},
  {code:'zh',flag:'🇨🇳',label:'中文'},
  {code:'ko',flag:'🇰🇷',label:'한국어'},
  {code:'ar',flag:'🇸🇦',label:'العربية'},
  {code:'tr',flag:'🇹🇷',label:'Türkçe'},
  {code:'hi',flag:'🇮🇳',label:'हिन्दी'},
]

const T = {
  en: {
    nav: ['Features','How It Works','Pricing','FAQ'],
    start: 'Start Free →',
    badge: 'AI-Powered Video Intelligence',
    h1a: 'Long Videos.',
    h1b: 'Viral Clips.',
    h1c: 'Zero Effort.',
    sub: 'Upload any video. Our AI finds the best moments, cuts clips, adds subtitles — ready for TikTok, Reels & Shorts in minutes.',
    cta1: 'Start Free Trial →',
    cta2: 'Watch Demo ▶',
    trust: 'No card required · 3 days free · Cancel anytime',
    statsV: ['2.4M+','96/100','10×','152K'],
    statsL: ['Clips Generated','Avg Viral Score','Faster Than Manual','Creators'],
    howBadge: 'HOW IT WORKS',
    howH: 'Upload to Viral in 4 Steps',
    howS: 'No editing skills. No timeline. No nonsense.',
    steps: [
      {n:'01',t:'Upload',d:'Drop any MP4, MOV or AVI — podcasts, interviews, lectures up to 500MB.'},
      {n:'02',t:'AI Analyses',d:'Transcription, emotion peaks, viral hooks — detected automatically.'},
      {n:'03',t:'Clips Cut',d:'Best moments trimmed, reformatted 9:16, subtitles burned in.'},
      {n:'04',t:'Publish',d:'Download or push directly to TikTok, Reels and Shorts.'},
    ],
    featBadge: 'FEATURES',
    featH: 'Built to Go Viral',
    feats: [
      {i:'🎯',t:'Viral Scoring',d:'Every clip scored 0–100 on hook strength, emotion and shareability.'},
      {i:'📝',t:'Auto Captions',d:'AI subtitles in 50+ languages boost watch-time by 40%.'},
      {i:'🚀',t:'One-Click Publish',d:'TikTok, Instagram Reels, YouTube Shorts — all at once.'},
      {i:'⚡',t:'Smart Detection',d:'Best 30–90 second segments found from hours of content.'},
      {i:'✍️',t:'Hook Titles',d:'Scroll-stopping titles generated for every platform.'},
      {i:'👥',t:'Agency Mode',d:'Multi-client dashboard, white-label, team collaboration.'},
    ],
    priceBadge: 'PRICING',
    priceH: 'Start Free. Scale When Ready.',
    monthly:'Monthly', yearly:'Yearly · Save 5 months',
    plans:[
      {n:'Starter',p:'€29',d:'For individual creators',f:['10 videos/month','Auto subtitles','9:16 format','3 social accounts','Email support'],hot:false},
      {n:'Pro',p:'€59',d:'For serious creators',f:['50 videos/month','50+ languages','Direct publishing','Priority processing','Priority support'],hot:true},
      {n:'Agency',p:'€99',d:'For teams & agencies',f:['Unlimited videos','White-label','Team workspace','API access','SLA guarantee'],hot:false},
    ],
    faqBadge:'FAQ',
    faqH:'Common Questions',
    faqs:[
      {q:'How does it work?',a:'Upload a long video — AI transcribes, finds viral moments, cuts clips, adds subtitles and reformats to 9:16 in minutes.'},
      {q:'What formats are supported?',a:'MP4, MOV, AVI and MKV files up to 500MB and 60 minutes long.'},
      {q:'How many clips per video?',a:'3 to 10 clips per video depending on your plan, each scored 0–100.'},
      {q:'Is Lithuanian supported?',a:'Yes — Lithuanian is fully supported for subtitles and the platform interface.'},
      {q:'Can I publish directly?',a:'Yes — connect TikTok, Instagram and YouTube and publish with one click.'},
      {q:'Can I cancel anytime?',a:'Yes — no fees, no long-term commitments.'},
    ],
    ctaH:'Ready to Go Viral?',
    ctaS:'Join thousands of creators turning long videos into viral clips automatically.',
    ctaBtn:'⚡ Start Creating Free Clips',
    footer:'Built for European Creators',
  },
  lt: {
    nav:['Funkcijos','Kaip veikia','Kainos','DUK'],
    start:'Pradėti →',
    badge:'Dirbtinio intelekto vaizdo platforma',
    h1a:'Ilgi vaizdo įrašai.',h1b:'Virusiniai klipai.',h1c:'Be pastangų.',
    sub:'Įkelkite bet kurį vaizdo įrašą. Mūsų DI suranda geriausias akimirkas, sukarpо klipus, prideda subtitrus.',
    cta1:'Pradėti nemokamai →',cta2:'Žiūrėti demo ▶',
    trust:'Nereikia kortelės · 3 dienos nemokamai · Atšaukti galima bet kada',
    statsV:['2.4M+','96/100','10×','152K'],statsL:['Sukurti klipai','Vidurkis','Greičiau','Kūrėjų'],
    howBadge:'KAIP TAI VEIKIA',howH:'Nuo įkėlimo iki viralinio per 4 žingsnius',howS:'Nereikia redagavimo įgūdžių.',
    steps:[{n:'01',t:'Įkelti',d:'MP4, MOV ar AVI failai iki 500MB.'},{n:'02',t:'DI analizuoja',d:'Transkribavimas ir viralinio potencialo aptikimas.'},{n:'03',t:'Klipai sukurti',d:'Geriausi momentai, 9:16 formatas, subtitrai.'},{n:'04',t:'Publikuoti',d:'Atsisiųsti arba skelbti TikTok, Reels, Shorts.'}],
    featBadge:'FUNKCIJOS',featH:'Sukurta Virusiniams Klipams',
    feats:[{i:'🎯',t:'Viralinis balas',d:'Kiekvienas klipas įvertintas 0–100.'},{i:'📝',t:'Automatiniai subtitrai',d:'50+ kalbų, žiūrėjimo laikas +40%.'},{i:'🚀',t:'Publikavimas',d:'TikTok, Reels, Shorts vienu spustelėjimu.'},{i:'⚡',t:'Išmanusis aptikimas',d:'Geriausi segmentai iš valandų turinio.'},{i:'✍️',t:'Kabliukų pavadinimai',d:'Stabdantys slinkimą pavadinimai.'},{i:'👥',t:'Agentūros režimas',d:'Kelių klientų valdymas.'}],
    priceBadge:'KAINOS',priceH:'Pradėk Nemokamai.',monthly:'Mėnesinis',yearly:'Metinis · Sutaupyk 5 mėnesius',
    plans:[{n:'Pradedantysis',p:'€29',d:'Individualiems kūrėjams',f:['10 vaizdo įrašų/mėn','Automatiniai subtitrai','9:16 formatas','3 socialinės paskyros','El. pašto palaikymas'],hot:false},{n:'Pro',p:'€59',d:'Rimtiems kūrėjams',f:['50 vaizdo įrašų/mėn','50+ kalbų','Tiesioginis publikavimas','Prioritetinis apdorojimas','Prioritetinė pagalba'],hot:true},{n:'Agentūra',p:'€99',d:'Komandoms',f:['Neriboti vaizdo įrašai','Baltos etiketės','Komandos erdvė','API prieiga','SLA garantija'],hot:false}],
    faqBadge:'DUK',faqH:'Dažni Klausimai',
    faqs:[{q:'Kaip tai veikia?',a:'Įkelkite vaizdo įrašą — DI transkribuoja, suranda viraliausias akimirkas, iškerpa klipus.'},{q:'Kokie formatai palaikomi?',a:'MP4, MOV, AVI ir MKV iki 500MB ir 60 minučių.'},{q:'Kiek klipų generuojama?',a:'Nuo 3 iki 10 klipų vienam vaizdo įrašui.'},{q:'Ar palaikoma lietuvių kalba?',a:'Taip — pilnai palaikoma.'},{q:'Ar galiu publikuoti tiesiogiai?',a:'Taip — TikTok, Instagram ir YouTube.'},{q:'Ar galiu atšaukti bet kada?',a:'Taip — be jokių mokesčių.'}],
    ctaH:'Pasiruošę Tapti Viraliais?',ctaS:'Prisijunkite prie tūkstančių kūrėjų.',ctaBtn:'⚡ Pradėti Kurti Klipus',footer:'Sukurta Europos kūrėjams',
  },
}
// simple fallback for other langs
const tFor = code => T[code] || { ...T.en, ...({ de:{h1a:'Lange Videos.',h1b:'Virale Clips.',h1c:'Null Aufwand.'}, fr:{h1a:'Longues Vidéos.',h1b:'Clips Viraux.',h1c:'Zéro Effort.'}, es:{h1a:'Videos Largos.',h1b:'Clips Virales.',h1c:'Sin Esfuerzo.'} }[code] || {}) }

export default function Landing() {
  const navigate = useNavigate()
  const { isDark } = useTheme()
  const [lang, setLang] = useState('en')
  const [billing, setBilling] = useState('monthly')
  const [openFaq, setOpenFaq] = useState(null)
  const [isMobile, setIsMobile] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const canvasRef = useRef(null)
  const t = tFor(lang)

  useEffect(() => {
    const r = () => { setIsMobile(window.innerWidth < 768); setScrollY(window.scrollY) }
    window.addEventListener('resize', r)
    window.addEventListener('scroll', () => setScrollY(window.scrollY))
    r()
    return () => { window.removeEventListener('resize', r); window.removeEventListener('scroll', () => {}) }
  }, [])

  // Animated particle canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight
    const particles = Array.from({length: 60}, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 1.5 + 0.5,
      o: Math.random() * 0.5 + 0.1,
    }))
    let frame
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy
        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = isDark ? `rgba(139,92,246,${p.o})` : `rgba(91,76,245,${p.o * 0.6})`
        ctx.fill()
      })
      // draw connecting lines
      particles.forEach((a, i) => {
        particles.slice(i + 1).forEach(b => {
          const dist = Math.hypot(a.x - b.x, a.y - b.y)
          if (dist < 100) {
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.strokeStyle = isDark
              ? `rgba(139,92,246,${0.15 * (1 - dist/100)})`
              : `rgba(91,76,245,${0.08 * (1 - dist/100)})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        })
      })
      frame = requestAnimationFrame(draw)
    }
    draw()
    return () => cancelAnimationFrame(frame)
  }, [isDark])

  const go = () => navigate('/signup')
  const scroll = id => { document.getElementById(id)?.scrollIntoView({behavior:'smooth'}); setMenuOpen(false) }

  const prices = { monthly: ['€29','€59','€99'], yearly: ['€19','€39','€69'] }

  // ── THEME TOKENS ──
  const bg     = isDark ? '#080810' : '#fafaf8'
  const surf   = isDark ? '#0f0f1a' : '#ffffff'
  const surf2  = isDark ? '#13131f' : '#f4f3f0'
  const border = isDark ? 'rgba(139,92,246,0.15)' : 'rgba(91,76,245,0.12)'
  const text   = isDark ? '#f0eeff' : '#0a0a14'
  const muted  = isDark ? '#6b6b8a' : '#6b6b7a'
  const acc    = '#7c5af6'
  const acc2   = '#c084fc'
  const glow   = isDark ? '0 0 60px rgba(124,90,246,0.25)' : '0 0 40px rgba(91,76,245,0.12)'

  const navH = 64

  return (
    <div style={{fontFamily:"'Syne', 'Space Grotesk', system-ui, sans-serif", background:bg, color:text, overflowX:'hidden', minHeight:'100vh'}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Space+Grotesk:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::selection { background: rgba(124,90,246,0.35); }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${acc}66; border-radius: 2px; }

        @keyframes fadeUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulse { 0%,100% { opacity:0.6; transform:scale(1); } 50% { opacity:1; transform:scale(1.05); } }
        @keyframes spin { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        @keyframes float { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-8px); } }

        .fade-up { animation: fadeUp 0.7s ease both; }
        .fade-up-1 { animation-delay: 0.1s; }
        .fade-up-2 { animation-delay: 0.2s; }
        .fade-up-3 { animation-delay: 0.3s; }
        .fade-up-4 { animation-delay: 0.4s; }

        .glow-btn {
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
        }
        .glow-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 60%);
          opacity: 0;
          transition: opacity 0.3s;
        }
        .glow-btn:hover::before { opacity: 1; }
        .glow-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(124,90,246,0.4) !important; }
        .glow-btn:active { transform: translateY(0); }

        .card-hover {
          transition: all 0.3s ease;
        }
        .card-hover:hover {
          transform: translateY(-4px);
          border-color: ${acc}55 !important;
          box-shadow: 0 12px 40px rgba(124,90,246,0.15);
        }

        .nav-link {
          position: relative;
          transition: color 0.2s;
          cursor: pointer;
          font-weight: 500;
          font-size: 14px;
          letter-spacing: 0.01em;
          background: none;
          border: none;
          padding: 4px 0;
        }
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -2px; left: 0; right: 100%;
          height: 1px;
          background: ${acc};
          transition: right 0.3s ease;
        }
        .nav-link:hover { color: ${acc} !important; }
        .nav-link:hover::after { right: 0; }

        .feat-card {
          transition: all 0.3s ease;
          cursor: default;
        }
        .feat-card:hover {
          transform: translateY(-6px) scale(1.01);
          border-color: ${acc}44 !important;
          box-shadow: 0 20px 60px rgba(124,90,246,0.18);
        }
        .feat-card:hover .feat-icon {
          transform: scale(1.15) rotate(5deg);
        }
        .feat-icon { transition: transform 0.3s ease; }

        .shimmer-text {
          background: linear-gradient(90deg, ${acc} 0%, ${acc2} 50%, ${acc} 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 3s linear infinite;
        }

        .step-line::after {
          content: '';
          position: absolute;
          top: 20px; left: calc(100% + 16px);
          width: calc(100% - 32px);
          height: 1px;
          background: linear-gradient(90deg, ${acc}44, transparent);
        }

        @media (max-width: 767px) {
          .step-line::after { display: none; }
          .hide-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
        @media (min-width: 768px) {
          .show-mobile { display: none !important; }
        }
      `}</style>

      {/* ── CANVAS BG ── */}
      <canvas ref={canvasRef} style={{
        position:'fixed', top:0, left:0, width:'100%', height:'100%',
        pointerEvents:'none', zIndex:0, opacity:0.6,
      }} />

      {/* ── RADIAL GLOW ── */}
      <div style={{
        position:'fixed', top:'-20%', left:'50%', transform:'translateX(-50%)',
        width:'80vw', height:'60vh',
        background:`radial-gradient(ellipse, ${isDark?'rgba(124,90,246,0.12)':'rgba(91,76,245,0.06)'} 0%, transparent 70%)`,
        pointerEvents:'none', zIndex:0,
      }}/>

      {/* ── NAV ── */}
      <nav style={{
        position:'fixed', top:0, left:0, right:0, zIndex:100,
        height:navH,
        display:'flex', alignItems:'center', justifyContent:'space-between',
        padding: isMobile ? '0 20px' : '0 48px',
        background: scrollY > 20
          ? isDark ? 'rgba(8,8,16,0.9)' : 'rgba(250,250,248,0.9)'
          : 'transparent',
        backdropFilter: scrollY > 20 ? 'blur(20px)' : 'none',
        borderBottom: scrollY > 20 ? `1px solid ${border}` : '1px solid transparent',
        transition: 'all 0.3s ease',
      }}>
        {/* Logo */}
        <div onClick={() => window.scrollTo({top:0,behavior:'smooth'})}
          style={{display:'flex',alignItems:'center',gap:10,cursor:'pointer',zIndex:1}}>
          <div style={{
            width:36, height:36, borderRadius:10,
            background:`linear-gradient(135deg, ${acc}, ${acc2})`,
            display:'flex', alignItems:'center', justifyContent:'center',
            fontSize:18, fontWeight:800, color:'#fff',
            boxShadow:`0 4px 16px ${acc}55`,
          }}>C</div>
          <span style={{fontFamily:'Syne',fontWeight:800,fontSize:17,letterSpacing:'-0.5px',color:text}}>
            ClipGen<span style={{color:acc}}>.AI</span>
          </span>
        </div>

        {/* Desktop links */}
        <div className="hide-mobile" style={{display:'flex',gap:32,alignItems:'center'}}>
          {t.nav.map((lbl,i)=>(
            <button key={i} className="nav-link" style={{color:muted}}
              onClick={()=>scroll(['features','how','pricing','faq'][i])}>
              {lbl}
            </button>
          ))}
        </div>

        <div style={{display:'flex',gap:10,alignItems:'center',zIndex:1}}>
          <select value={lang} onChange={e=>setLang(e.target.value)} style={{
            padding:'6px 10px', borderRadius:8,
            border:`1px solid ${border}`,
            background:isDark?'rgba(15,15,26,0.8)':'rgba(255,255,255,0.8)',
            color:text, fontSize:12, cursor:'pointer', outline:'none',
            backdropFilter:'blur(10px)',
            maxWidth: isMobile ? 60 : 'auto',
          }}>
            {LANGS.slice(0, isMobile?5:16).map(l=><option key={l.code} value={l.code}>{l.flag} {isMobile?'':l.label}</option>)}
          </select>
          <ThemeToggle />
          <button className="hide-mobile glow-btn" onClick={go} style={{
            background:`linear-gradient(135deg, ${acc}, ${acc2})`,
            color:'#fff', border:'none', borderRadius:10,
            padding:'9px 22px', fontSize:13.5, fontWeight:700,
            cursor:'pointer', letterSpacing:'0.01em',
            boxShadow:`0 4px 20px ${acc}44`,
          }}>{t.start}</button>
          <button className="show-mobile" onClick={()=>setMenuOpen(!menuOpen)} style={{
            background:'none',border:'none',color:text,fontSize:22,cursor:'pointer',padding:'4px',
          }}>{menuOpen?'✕':'☰'}</button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          position:'fixed', top:navH, left:0, right:0, zIndex:99,
          background:isDark?'rgba(8,8,16,0.97)':'rgba(250,250,248,0.97)',
          backdropFilter:'blur(20px)',
          borderBottom:`1px solid ${border}`,
          padding:'20px 24px 24px',
          display:'flex', flexDirection:'column', gap:16,
        }}>
          {t.nav.map((lbl,i)=>(
            <button key={i} onClick={()=>scroll(['features','how','pricing','faq'][i])} style={{
              background:'none',border:'none',color:text,fontSize:16,fontWeight:600,
              textAlign:'left',cursor:'pointer',padding:'8px 0',
            }}>{lbl}</button>
          ))}
          <button onClick={go} className="glow-btn" style={{
            background:`linear-gradient(135deg,${acc},${acc2})`,
            color:'#fff',border:'none',borderRadius:12,
            padding:'14px',fontSize:15,fontWeight:700,cursor:'pointer',marginTop:8,
          }}>{t.start}</button>
        </div>
      )}

      <div style={{position:'relative', zIndex:1}}>

        {/* ══ HERO ══ */}
        <section style={{
          minHeight:'100vh', display:'flex', flexDirection:'column',
          alignItems:'center', justifyContent:'center', textAlign:'center',
          padding: isMobile ? `${navH+40}px 24px 80px` : `${navH+60}px 24px 80px`,
        }}>
          {/* Badge */}
          <div className="fade-up" style={{
            display:'inline-flex', alignItems:'center', gap:8,
            background:`linear-gradient(135deg, ${acc}18, ${acc2}10)`,
            border:`1px solid ${acc}35`,
            borderRadius:100, padding:'6px 18px', marginBottom:32,
          }}>
            <span style={{
              width:6,height:6,borderRadius:'50%',
              background:acc, animation:'pulse 2s infinite',
              display:'inline-block',
            }}/>
            <span style={{fontSize:12,fontWeight:600,color:acc,letterSpacing:'0.08em'}}>
              {t.badge}
            </span>
          </div>

          {/* Headline */}
          <h1 className="fade-up fade-up-1" style={{
            fontFamily:'Syne', fontWeight:800,
            fontSize: isMobile ? 'clamp(36px,10vw,52px)' : 'clamp(52px,6vw,88px)',
            lineHeight:1.05, letterSpacing:'-0.03em',
            maxWidth:900, marginBottom:24,
          }}>
            <span style={{color:text}}>{t.h1a}</span>{' '}
            <span className="shimmer-text">{t.h1b}</span>{' '}
            <span style={{color:text}}>{t.h1c}</span>
          </h1>

          {/* Sub */}
          <p className="fade-up fade-up-2" style={{
            fontSize: isMobile ? 16 : 19,
            color:muted, lineHeight:1.7, maxWidth:580, marginBottom:40,
            fontFamily:'Space Grotesk', fontWeight:400,
          }}>{t.sub}</p>

          {/* CTAs */}
          <div className="fade-up fade-up-3" style={{
            display:'flex', gap:14, flexWrap:'wrap', justifyContent:'center', marginBottom:20,
          }}>
            <button onClick={go} className="glow-btn" style={{
              background:`linear-gradient(135deg, ${acc}, ${acc2})`,
              color:'#fff', border:'none', borderRadius:14,
              padding: isMobile ? '14px 28px' : '16px 40px',
              fontSize: isMobile ? 15 : 16, fontWeight:700, cursor:'pointer',
              letterSpacing:'0.01em',
              boxShadow:`0 8px 32px ${acc}50`,
            }}>{t.cta1}</button>
            <button onClick={()=>scroll('how')} style={{
              background:'transparent',
              color:text, border:`1px solid ${border}`,
              borderRadius:14,
              padding: isMobile ? '14px 28px' : '16px 36px',
              fontSize: isMobile ? 15 : 16, fontWeight:500, cursor:'pointer',
              transition:'all 0.2s',
              backdropFilter:'blur(8px)',
            }}
            onMouseEnter={e=>{e.currentTarget.style.borderColor=`${acc}55`; e.currentTarget.style.background=`${acc}10`}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor=border; e.currentTarget.style.background='transparent'}}
            >{t.cta2}</button>
          </div>

          <p className="fade-up fade-up-4" style={{fontSize:12.5,color:muted,fontFamily:'Space Grotesk'}}>{t.trust}</p>

          {/* Stats bar */}
          <div className="fade-up fade-up-4" style={{
            display:'grid',
            gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(4,1fr)',
            gap: isMobile ? 16 : 32,
            marginTop:64,
            padding: isMobile ? '24px 20px' : '32px 48px',
            background: isDark ? 'rgba(15,15,26,0.7)' : 'rgba(255,255,255,0.7)',
            border:`1px solid ${border}`,
            borderRadius:20,
            backdropFilter:'blur(20px)',
            maxWidth:800, width:'100%',
            boxShadow: glow,
          }}>
            {t.statsV.map((v,i)=>(
              <div key={i} style={{textAlign:'center'}}>
                <div style={{
                  fontFamily:'Syne',fontSize: isMobile?28:36,fontWeight:800,
                  color:acc, letterSpacing:'-1px', lineHeight:1,
                }}>{v}</div>
                <div style={{fontSize:12,color:muted,marginTop:6,fontFamily:'Space Grotesk'}}>{t.statsL[i]}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ══ HOW IT WORKS ══ */}
        <section id="how" style={{padding: isMobile?'64px 24px':'96px 24px'}}>
          <div style={{maxWidth:960,margin:'0 auto'}}>
            <div style={{textAlign:'center',marginBottom:56}}>
              <div style={{fontSize:11,fontWeight:700,color:acc,letterSpacing:'0.15em',marginBottom:12}}>{t.howBadge}</div>
              <h2 style={{fontFamily:'Syne',fontSize: isMobile?28:42,fontWeight:800,letterSpacing:'-0.03em',color:text,marginBottom:12}}>{t.howH}</h2>
              <p style={{color:muted,fontSize:15,fontFamily:'Space Grotesk'}}>{t.howS}</p>
            </div>

            <div style={{
              display:'grid',
              gridTemplateColumns: isMobile?'1fr':'repeat(4,1fr)',
              gap: isMobile?24:0,
              position:'relative',
            }}>
              {t.steps.map((s,i)=>(
                <div key={i} className={`card-hover ${i<3&&!isMobile?'step-line':''}`}
                  style={{
                    padding:'28px 24px 24px',
                    background: isDark?'rgba(15,15,26,0.6)':'rgba(255,255,255,0.7)',
                    border:`1px solid ${border}`,
                    borderRadius:16,
                    backdropFilter:'blur(16px)',
                    margin: isMobile?0:'0 8px',
                    position:'relative',
                  }}>
                  <div style={{
                    display:'inline-flex', alignItems:'center', justifyContent:'center',
                    width:44,height:44, borderRadius:12,
                    background:`linear-gradient(135deg,${acc}20,${acc2}10)`,
                    border:`1px solid ${acc}35`,
                    fontFamily:'Syne', fontSize:13, fontWeight:800, color:acc,
                    marginBottom:16,
                  }}>{s.n}</div>
                  <div style={{fontFamily:'Syne',fontSize:16,fontWeight:700,color:text,marginBottom:8}}>{s.t}</div>
                  <div style={{fontSize:13,color:muted,lineHeight:1.6,fontFamily:'Space Grotesk'}}>{s.d}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ FEATURES ══ */}
        <section id="features" style={{
          padding: isMobile?'64px 24px':'96px 24px',
          background: isDark?'rgba(15,15,26,0.4)':'rgba(248,247,245,0.8)',
        }}>
          <div style={{maxWidth:960,margin:'0 auto'}}>
            <div style={{textAlign:'center',marginBottom:56}}>
              <div style={{fontSize:11,fontWeight:700,color:acc,letterSpacing:'0.15em',marginBottom:12}}>{t.featBadge}</div>
              <h2 style={{fontFamily:'Syne',fontSize: isMobile?28:42,fontWeight:800,letterSpacing:'-0.03em',color:text}}>{t.featH}</h2>
            </div>
            <div style={{
              display:'grid',
              gridTemplateColumns: isMobile?'1fr':'repeat(3,1fr)',
              gap:16,
            }}>
              {t.feats.map((f,i)=>(
                <div key={i} className="feat-card" style={{
                  padding:'28px',
                  background: isDark?'rgba(15,15,26,0.7)':'rgba(255,255,255,0.85)',
                  border:`1px solid ${border}`,
                  borderRadius:18,
                  backdropFilter:'blur(16px)',
                }}>
                  <div className="feat-icon" style={{
                    fontSize:30, marginBottom:18,
                    width:56,height:56, display:'flex',alignItems:'center',justifyContent:'center',
                    background:`linear-gradient(135deg,${acc}15,${acc2}10)`,
                    borderRadius:14, border:`1px solid ${acc}25`,
                  }}>{f.i}</div>
                  <div style={{fontFamily:'Syne',fontSize:16,fontWeight:700,color:text,marginBottom:8}}>{f.t}</div>
                  <div style={{fontSize:13.5,color:muted,lineHeight:1.65,fontFamily:'Space Grotesk'}}>{f.d}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ PRICING ══ */}
        <section id="pricing" style={{padding: isMobile?'64px 24px':'96px 24px'}}>
          <div style={{maxWidth:960,margin:'0 auto'}}>
            <div style={{textAlign:'center',marginBottom:48}}>
              <div style={{fontSize:11,fontWeight:700,color:acc,letterSpacing:'0.15em',marginBottom:12}}>{t.priceBadge}</div>
              <h2 style={{fontFamily:'Syne',fontSize: isMobile?28:42,fontWeight:800,letterSpacing:'-0.03em',color:text,marginBottom:24}}>{t.priceH}</h2>
              {/* Toggle */}
              <div style={{display:'inline-flex',background: isDark?'rgba(15,15,26,0.8)':'rgba(240,239,237,0.8)',borderRadius:12,padding:4,border:`1px solid ${border}`}}>
                {['monthly','yearly'].map(b=>(
                  <button key={b} onClick={()=>setBilling(b)} style={{
                    padding:'8px 20px', borderRadius:9,
                    background: billing===b ? `linear-gradient(135deg,${acc},${acc2})` : 'transparent',
                    color: billing===b ? '#fff' : muted,
                    fontWeight: billing===b ? 700 : 400,
                    fontSize:13, border:'none', cursor:'pointer',
                    transition:'all 0.2s',
                    boxShadow: billing===b ? `0 4px 16px ${acc}44` : 'none',
                  }}>{b==='monthly'?t.monthly:t.yearly}</button>
                ))}
              </div>
            </div>

            <div style={{
              display:'grid',
              gridTemplateColumns: isMobile?'1fr':'repeat(3,1fr)',
              gap:20,
            }}>
              {t.plans.map((p,i)=>(
                <div key={i} className="card-hover" style={{
                  padding:'32px 28px',
                  background: p.hot
                    ? isDark ? `linear-gradient(135deg, rgba(124,90,246,0.2), rgba(192,132,252,0.1))` : `linear-gradient(135deg, rgba(124,90,246,0.08), rgba(192,132,252,0.05))`
                    : isDark ? 'rgba(15,15,26,0.7)' : 'rgba(255,255,255,0.85)',
                  border: `2px solid ${p.hot ? acc : border}`,
                  borderRadius:20,
                  position:'relative',
                  backdropFilter:'blur(16px)',
                  boxShadow: p.hot ? `0 8px 40px ${acc}25` : 'none',
                }}>
                  {p.hot && (
                    <div style={{
                      position:'absolute', top:-14, left:'50%', transform:'translateX(-50%)',
                      background:`linear-gradient(135deg,${acc},${acc2})`,
                      color:'#fff', borderRadius:100, padding:'4px 16px',
                      fontSize:11, fontWeight:800, whiteSpace:'nowrap',
                      letterSpacing:'0.05em', boxShadow:`0 4px 16px ${acc}55`,
                    }}>BEST VALUE</div>
                  )}
                  <div style={{fontSize:11,fontWeight:700,color:acc,letterSpacing:'0.1em',marginBottom:8}}>{p.n.toUpperCase()}</div>
                  <div style={{display:'flex',alignItems:'baseline',gap:4,marginBottom:6}}>
                    <span style={{fontFamily:'Syne',fontSize:44,fontWeight:800,color:text,letterSpacing:'-2px'}}>{prices[billing][i]}</span>
                    <span style={{fontSize:14,color:muted,fontFamily:'Space Grotesk'}}>/mo</span>
                  </div>
                  <div style={{fontSize:13,color:muted,marginBottom:24,fontFamily:'Space Grotesk'}}>{p.d}</div>
                  <button onClick={go} className="glow-btn" style={{
                    width:'100%', padding:'12px', borderRadius:12,
                    background: p.hot ? `linear-gradient(135deg,${acc},${acc2})` : 'transparent',
                    color: p.hot ? '#fff' : acc,
                    border: `2px solid ${p.hot ? 'transparent' : acc}`,
                    fontWeight:700, fontSize:14, cursor:'pointer', marginBottom:24,
                    boxShadow: p.hot ? `0 4px 20px ${acc}44` : 'none',
                  }}>Get Started</button>
                  <div style={{display:'flex',flexDirection:'column',gap:10}}>
                    {p.f.map((f,j)=>(
                      <div key={j} style={{display:'flex',alignItems:'center',gap:10,fontSize:13}}>
                        <span style={{color:acc,fontWeight:700,fontSize:15}}>✓</span>
                        <span style={{color:muted,fontFamily:'Space Grotesk'}}>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ FAQ ══ */}
        <section id="faq" style={{
          padding: isMobile?'64px 24px':'96px 24px',
          background: isDark?'rgba(15,15,26,0.4)':'rgba(248,247,245,0.8)',
        }}>
          <div style={{maxWidth:680,margin:'0 auto'}}>
            <div style={{textAlign:'center',marginBottom:48}}>
              <div style={{fontSize:11,fontWeight:700,color:acc,letterSpacing:'0.15em',marginBottom:12}}>{t.faqBadge}</div>
              <h2 style={{fontFamily:'Syne',fontSize: isMobile?28:38,fontWeight:800,letterSpacing:'-0.03em',color:text}}>{t.faqH}</h2>
            </div>
            {t.faqs.map((f,i)=>(
              <div key={i} style={{
                marginBottom:12,
                background: isDark?'rgba(15,15,26,0.6)':'rgba(255,255,255,0.7)',
                border:`1px solid ${openFaq===i?acc+'55':border}`,
                borderRadius:14, overflow:'hidden',
                backdropFilter:'blur(12px)',
                transition:'border-color 0.2s',
              }}>
                <button onClick={()=>setOpenFaq(openFaq===i?null:i)} style={{
                  width:'100%', padding:'18px 24px',
                  display:'flex', justifyContent:'space-between', alignItems:'center',
                  background:'none', border:'none', cursor:'pointer', textAlign:'left',
                }}>
                  <span style={{fontFamily:'Syne',fontWeight:600,fontSize: isMobile?14:15,color:text}}>{f.q}</span>
                  <span style={{
                    color:acc, fontSize:20, fontWeight:300, marginLeft:16, flexShrink:0,
                    transform: openFaq===i?'rotate(45deg)':'rotate(0)',
                    transition:'transform 0.2s',
                    display:'inline-block',
                  }}>+</span>
                </button>
                {openFaq===i && (
                  <div style={{
                    padding:'0 24px 20px',
                    fontSize:14, color:muted, lineHeight:1.7,
                    fontFamily:'Space Grotesk',
                    animation:'fadeUp 0.2s ease',
                  }}>{f.a}</div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ══ FINAL CTA ══ */}
        <section style={{
          padding: isMobile?'80px 24px':'120px 24px',
          textAlign:'center', position:'relative', overflow:'hidden',
        }}>
          <div style={{
            position:'absolute', inset:0,
            background:`radial-gradient(ellipse at center, ${acc}18 0%, transparent 70%)`,
            pointerEvents:'none',
          }}/>
          <div style={{position:'relative',maxWidth:640,margin:'0 auto'}}>
            <h2 style={{
              fontFamily:'Syne', fontWeight:800,
              fontSize: isMobile?32:52, letterSpacing:'-0.03em',
              color:text, marginBottom:16, lineHeight:1.1,
            }}>{t.ctaH}</h2>
            <p style={{color:muted,fontSize: isMobile?15:17,marginBottom:40,fontFamily:'Space Grotesk',lineHeight:1.65}}>{t.ctaS}</p>
            <button onClick={go} className="glow-btn" style={{
              background:`linear-gradient(135deg,${acc},${acc2})`,
              color:'#fff', border:'none', borderRadius:16,
              padding: isMobile?'15px 32px':'18px 48px',
              fontSize: isMobile?15:17, fontWeight:700, cursor:'pointer',
              boxShadow:`0 12px 48px ${acc}55`,
              letterSpacing:'0.01em',
            }}>{t.ctaBtn}</button>
          </div>
        </section>

        {/* ══ FOOTER ══ */}
        <footer style={{
          padding: isMobile?'24px 20px':'28px 48px',
          borderTop:`1px solid ${border}`,
          display:'flex', flexDirection: isMobile?'column':'row',
          justifyContent:'space-between', alignItems:'center',
          gap:16, textAlign: isMobile?'center':'left',
          background: isDark?'rgba(8,8,16,0.8)':'rgba(250,250,248,0.8)',
          backdropFilter:'blur(20px)',
        }}>
          <div style={{display:'flex',alignItems:'center',gap:10}}>
            <div style={{
              width:28,height:28,borderRadius:8,
              background:`linear-gradient(135deg,${acc},${acc2})`,
              display:'flex',alignItems:'center',justifyContent:'center',
              fontSize:14,fontWeight:800,color:'#fff',
            }}>C</div>
            <span style={{fontFamily:'Syne',fontWeight:700,fontSize:14,color:text}}>ClipGen<span style={{color:acc}}>.AI</span></span>
          </div>
          <div style={{display:'flex',gap:20,flexWrap:'wrap',justifyContent:'center'}}>
            {t.nav.map((lbl,i)=>(
              <button key={i} onClick={()=>scroll(['features','how','pricing','faq'][i])} style={{
                color:muted,fontSize:13,background:'none',border:'none',cursor:'pointer',
                fontFamily:'Space Grotesk',
                transition:'color 0.2s',
              }}
              onMouseEnter={e=>e.currentTarget.style.color=acc}
              onMouseLeave={e=>e.currentTarget.style.color=muted}
              >{lbl}</button>
            ))}
          </div>
          <span style={{color:muted,fontSize:12,fontFamily:'Space Grotesk'}}>© 2026 ClipGen.AI · {t.footer}</span>
        </footer>

      </div>
    </div>
  )
}

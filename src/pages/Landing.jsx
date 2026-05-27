import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../contexts/ThemeContext'
import ThemeToggle from '../components/ThemeToggle'

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
]

const T = {
  en: {
    nav:['Features','How It Works','Pricing','FAQ'], start:'Get Started →',
    badge:'Next-Gen AI Video Intelligence',
    h1:['Turn Any Video Into','Viral Clips','Automatically'],
    sub:'Upload a long video. Our AI finds the best moments, cuts clips, burns subtitles — TikTok, Reels & Shorts ready in minutes.',
    cta1:'Start Free Trial →', cta2:'See How It Works',
    trust:'No card required · 3 days free · Cancel anytime',
    stats:[{v:'2.4M+',l:'Clips Generated'},{v:'96',l:'Avg Viral Score'},{v:'10×',l:'Faster'},{v:'152K',l:'Creators'}],
    steps:[
      {n:'01',t:'Upload',d:'Drop any MP4, MOV or AVI up to 500MB.'},
      {n:'02',t:'AI Analyses',d:'Transcription, emotion peaks, viral hooks detected.'},
      {n:'03',t:'Clips Cut',d:'Best moments trimmed, 9:16 formatted, subtitles burned.'},
      {n:'04',t:'Publish',d:'Download or push to TikTok, Reels & Shorts instantly.'},
    ],
    feats:[
      {i:'🎯',t:'Viral Scoring',d:'Every clip scored 0–100 on hook strength and shareability.'},
      {i:'📝',t:'Auto Captions',d:'AI subtitles in 50+ languages boost watch-time 40%.'},
      {i:'🚀',t:'1-Click Publish',d:'TikTok, Instagram Reels, YouTube Shorts simultaneously.'},
      {i:'⚡',t:'Smart Detection',d:'Best 30–90s segments found from hours of content.'},
      {i:'✍️',t:'Hook Titles',d:'Scroll-stopping titles generated for every platform.'},
      {i:'👥',t:'Agency Mode',d:'Multi-client dashboard with white-label support.'},
    ],
    plans:[
      {n:'Starter',p:'€29',d:'Individual creators',f:['10 videos/month','Auto subtitles','9:16 format','3 social accounts'],hot:false},
      {n:'Pro',p:'€59',d:'Serious creators',f:['50 videos/month','50+ languages','Direct publishing','Priority processing'],hot:true},
      {n:'Agency',p:'€99',d:'Teams & agencies',f:['Unlimited videos','White-label','Team workspace','API access'],hot:false},
    ],
    faqs:[
      {q:'How does ClipGen.AI work?',a:'Upload a long video — AI transcribes it, finds the most viral moments, cuts clips, adds subtitles and reformats to 9:16 in minutes.'},
      {q:'What formats are supported?',a:'MP4, MOV, AVI and MKV files up to 500MB and 60 minutes.'},
      {q:'How many clips per video?',a:'3 to 10 clips per video depending on your plan, each scored 0–100.'},
      {q:'Is Lithuanian supported?',a:'Yes — Lithuanian is fully supported for subtitles and the platform interface.'},
      {q:'Can I cancel anytime?',a:'Yes — no fees or long-term commitments.'},
    ],
    ctaH:'Ready to Go Viral?',
    ctaS:'Join thousands of creators turning long videos into viral clips automatically.',
    ctaBtn:'⚡ Start Creating Free',
  },
  lt: {
    nav:['Funkcijos','Kaip veikia','Kainos','DUK'], start:'Pradėti →',
    badge:'Naujos kartos DI vaizdo platforma',
    h1:['Paversk bet kurį vaizdo įrašą','Virusiniais klipais','Automatiškai'],
    sub:'Įkelkite vaizdo įrašą. Mūsų DI suranda geriausias akimirkas, sukarpо klipus, prideda subtitrus.',
    cta1:'Pradėti nemokamai →', cta2:'Kaip tai veikia',
    trust:'Nereikia kortelės · 3 dienos nemokamai',
    stats:[{v:'2.4M+',l:'Sukurti klipai'},{v:'96',l:'Vidurkis'},{v:'10×',l:'Greičiau'},{v:'152K',l:'Kūrėjų'}],
    steps:[{n:'01',t:'Įkelti',d:'MP4, MOV ar AVI iki 500MB.'},{n:'02',t:'DI analizuoja',d:'Transkribavimas ir viralinio potencialo aptikimas.'},{n:'03',t:'Klipai sukurti',d:'Geriausi momentai, 9:16 formatas.'},{n:'04',t:'Publikuoti',d:'TikTok, Reels, Shorts akimirksniu.'}],
    feats:[{i:'🎯',t:'Viralinis balas',d:'0–100 balas kiekvienam klipui.'},{i:'📝',t:'Automatiniai subtitrai',d:'50+ kalbų.'},{i:'🚀',t:'Publikavimas',d:'Vienu paspaudimu.'},{i:'⚡',t:'Aptikimas',d:'Geriausi segmentai.'},{i:'✍️',t:'Pavadinimai',d:'Virusiniai pavadinimai.'},{i:'👥',t:'Agentūra',d:'Kelių klientų valdymas.'}],
    plans:[
      {n:'Pradedantysis',p:'€29',d:'Individualiems kūrėjams',f:['10 vaizdo įrašų/mėn','Automatiniai subtitrai','9:16 formatas','3 paskyros'],hot:false},
      {n:'Pro',p:'€59',d:'Rimtiems kūrėjams',f:['50 vaizdo įrašų/mėn','50+ kalbų','Tiesioginis publikavimas','Prioritetinis apdorojimas'],hot:true},
      {n:'Agentūra',p:'€99',d:'Komandoms',f:['Neriboti vaizdo įrašai','Baltos etiketės','Komandos erdvė','API prieiga'],hot:false},
    ],
    faqs:[{q:'Kaip veikia ClipGen.AI?',a:'Įkelkite vaizdo įrašą — DI transkribuoja, suranda viraliausias akimirkas, iškerpa klipus per kelias minutes.'},{q:'Kokie formatai palaikomi?',a:'MP4, MOV, AVI ir MKV iki 500MB ir 60 minučių.'},{q:'Kiek klipų generuojama?',a:'Nuo 3 iki 10 klipų.'},{q:'Ar palaikoma lietuvių kalba?',a:'Taip — pilnai palaikoma.'},{q:'Ar galiu atšaukti bet kada?',a:'Taip — be jokių mokesčių.'}],
    ctaH:'Pasiruošę Tapti Viraliais?',
    ctaS:'Prisijunkite prie tūkstančių kūrėjų naudojančių ClipGen.AI.',
    ctaBtn:'⚡ Pradėti Kurti Klipus',
  },
}
const tFor = c => T[c] || T.en

export default function Landing() {
  const navigate = useNavigate()
  const { isDark } = useTheme()
  const [lang, setLang] = useState('en')
  const [billing, setBilling] = useState('monthly')
  const [openFaq, setOpenFaq] = useState(null)
  const [isMobile, setIsMobile] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const [mousePos, setMousePos] = useState({x:0,y:0})
  const [cursorPos, setCursorPos] = useState({x:0,y:0})
  const [visibleSections, setVisibleSections] = useState(new Set())
  const canvasRef = useRef(null)
  const heroRef = useRef(null)
  const animRef = useRef(null)
  const t = tFor(lang)

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768)
    const onScroll = () => setScrollY(window.scrollY)
    const onMouse = e => setMousePos({x: e.clientX, y: e.clientY})
    window.addEventListener('resize', onResize)
    window.addEventListener('scroll', onScroll)
    window.addEventListener('mousemove', onMouse)
    onResize()
    return () => {
      window.removeEventListener('resize', onResize)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('mousemove', onMouse)
    }
  }, [])

  // Smooth cursor follow
  useEffect(() => {
    let frame
    const follow = () => {
      setCursorPos(prev => ({
        x: prev.x + (mousePos.x - prev.x) * 0.12,
        y: prev.y + (mousePos.y - prev.y) * 0.12,
      }))
      frame = requestAnimationFrame(follow)
    }
    frame = requestAnimationFrame(follow)
    return () => cancelAnimationFrame(frame)
  }, [mousePos])

  // Intersection observer for scroll reveals
  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) setVisibleSections(prev => new Set([...prev, e.target.dataset.reveal]))
      })
    }, { threshold: 0.1 })
    document.querySelectorAll('[data-reveal]').forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  // Particle canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    resize()
    window.addEventListener('resize', resize)

    const COUNT = isMobile ? 40 : 80
    const particles = Array.from({length: COUNT}, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      r: Math.random() * 2 + 0.5,
      o: Math.random() * 0.6 + 0.1,
      pulse: Math.random() * Math.PI * 2,
    }))

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.pulse += 0.02
        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0
        const alpha = p.o * (0.7 + 0.3 * Math.sin(p.pulse))
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = isDark ? `rgba(139,92,246,${alpha})` : `rgba(91,76,245,${alpha * 0.5})`
        ctx.fill()
      })
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const d = Math.hypot(particles[i].x - particles[j].x, particles[i].y - particles[j].y)
          if (d < 120) {
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            const a = 0.15 * (1 - d / 120)
            ctx.strokeStyle = isDark ? `rgba(139,92,246,${a})` : `rgba(91,76,245,${a * 0.5})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }
      animRef.current = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(animRef.current); window.removeEventListener('resize', resize) }
  }, [isDark, isMobile])

  const go = () => navigate('/signup')
  const scroll = id => { document.getElementById(id)?.scrollIntoView({behavior:'smooth'}); setMenuOpen(false) }
  const prices = { monthly: ['€29','€59','€99'], yearly: ['€19','€39','€69'] }
  const isVis = id => visibleSections.has(id)

  const acc = '#7c5af6'
  const acc2 = '#c084fc'
  const bg = isDark ? '#06060f' : '#fafaf8'
  const surf = isDark ? '#0d0d1a' : '#ffffff'
  const surf2 = isDark ? '#111122' : '#f4f3f1'
  const border = isDark ? 'rgba(124,90,246,0.18)' : 'rgba(91,76,245,0.1)'
  const text = isDark ? '#ede9ff' : '#0a0a14'
  const muted = isDark ? '#6b6b8a' : '#6b6b80'

  const revealStyle = id => ({
    opacity: isVis(id) ? 1 : 0,
    transform: isVis(id) ? 'translateY(0)' : 'translateY(32px)',
    transition: 'opacity 0.8s ease, transform 0.8s ease',
  })

  return (
    <div style={{fontFamily:"'Plus Jakarta Sans','Space Grotesk',system-ui,sans-serif", background:bg, color:text, overflowX:'hidden', minHeight:'100vh', cursor:'none'}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Space+Grotesk:wght@300;400;500;600;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        ::selection{background:rgba(124,90,246,0.3);}
        ::-webkit-scrollbar{width:3px;}
        ::-webkit-scrollbar-thumb{background:${acc}55;border-radius:2px;}

        @keyframes float{0%,100%{transform:translateY(0) rotate(0deg);}33%{transform:translateY(-12px) rotate(1deg);}66%{transform:translateY(-6px) rotate(-1deg);}}
        @keyframes pulse{0%,100%{opacity:0.5;transform:scale(1);}50%{opacity:1;transform:scale(1.2);}}
        @keyframes rotate{from{transform:rotate(0deg);}to{transform:rotate(360deg);}}
        @keyframes shimmer{0%{background-position:-200% 0;}100%{background-position:200% 0;}}
        @keyframes glow{0%,100%{box-shadow:0 0 20px ${acc}33;}50%{box-shadow:0 0 60px ${acc}66,0 0 100px ${acc}22;}}
        @keyframes typewriter{from{width:0;}to{width:100%;}}
        @keyframes blink{50%{opacity:0;}}
        @keyframes countUp{from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:translateY(0);}}
        @keyframes scanline{0%{transform:translateY(-100%);}100%{transform:translateY(100vh);}}
        @keyframes particleFloat{0%,100%{transform:translateY(0) scale(1);opacity:0.6;}50%{transform:translateY(-20px) scale(1.1);opacity:1;}}

        .btn-primary{
          background:linear-gradient(135deg,${acc},${acc2});
          color:#fff;border:none;border-radius:14px;
          padding:14px 32px;font-size:15px;font-weight:700;
          cursor:pointer;letter-spacing:0.01em;
          position:relative;overflow:hidden;
          transition:all 0.3s ease;
          box-shadow:0 8px 32px ${acc}44;
        }
        .btn-primary::before{
          content:'';position:absolute;inset:0;
          background:linear-gradient(135deg,rgba(255,255,255,0.2),transparent);
          opacity:0;transition:opacity 0.3s;
        }
        .btn-primary:hover{transform:translateY(-3px) scale(1.02);box-shadow:0 16px 48px ${acc}66;}
        .btn-primary:hover::before{opacity:1;}
        .btn-primary:active{transform:translateY(-1px) scale(0.99);}

        .btn-outline{
          background:transparent;
          color:${text};border:1px solid ${border};
          border-radius:14px;padding:14px 32px;
          font-size:15px;font-weight:500;cursor:pointer;
          transition:all 0.3s ease;backdrop-filter:blur(12px);
        }
        .btn-outline:hover{border-color:${acc}55;background:${acc}10;transform:translateY(-2px);}

        .card-3d{
          transition:all 0.4s cubic-bezier(0.175,0.885,0.32,1.275);
          transform-style:preserve-3d;
        }
        .card-3d:hover{
          transform:translateY(-8px) rotateX(2deg) rotateY(-2deg);
          box-shadow:0 24px 64px rgba(124,90,246,0.2),0 0 0 1px ${acc}33 !important;
        }

        .feat-icon-wrap{
          transition:all 0.4s cubic-bezier(0.175,0.885,0.32,1.275);
        }
        .card-3d:hover .feat-icon-wrap{
          transform:scale(1.15) rotate(8deg);
        }

        .step-card{
          transition:all 0.3s ease;
          position:relative;
        }
        .step-card::after{
          content:'';
          position:absolute;inset:0;border-radius:18px;
          background:linear-gradient(135deg,${acc}08,${acc2}05);
          opacity:0;transition:opacity 0.3s;
          pointer-events:none;
        }
        .step-card:hover{transform:translateY(-6px);}
        .step-card:hover::after{opacity:1;}

        .price-card{
          transition:all 0.4s cubic-bezier(0.175,0.885,0.32,1.275);
        }
        .price-card:hover{transform:translateY(-10px) scale(1.01);}

        .glow-ring{
          animation:glow 3s ease-in-out infinite;
        }

        .shimmer-text{
          background:linear-gradient(90deg,${acc} 0%,${acc2} 25%,#fff 50%,${acc2} 75%,${acc} 100%);
          background-size:200% auto;
          -webkit-background-clip:text;-webkit-text-fill-color:transparent;
          background-clip:text;
          animation:shimmer 4s linear infinite;
        }

        .grid-bg{
          background-image:linear-gradient(${border} 1px,transparent 1px),linear-gradient(90deg,${border} 1px,transparent 1px);
          background-size:60px 60px;
        }

        .nav-link{
          position:relative;background:none;border:none;cursor:pointer;
          font-size:14px;font-weight:500;letter-spacing:0.01em;
          color:${muted};transition:color 0.2s;padding:6px 0;
        }
        .nav-link::after{
          content:'';position:absolute;bottom:-2px;left:0;right:100%;
          height:1px;background:${acc};transition:right 0.3s ease;
        }
        .nav-link:hover{color:${acc};}
        .nav-link:hover::after{right:0;}

        .faq-item{transition:all 0.2s ease;}
        .faq-item:hover{border-color:${acc}44 !important;}

        @media (max-width:767px){
          .hide-mobile{display:none !important;}
          .show-mobile{display:flex !important;}
          .grid-3{grid-template-columns:1fr !important;}
          .grid-4{grid-template-columns:repeat(2,1fr) !important;}
          .hero-btns{flex-direction:column !important;align-items:stretch !important;}
          .hero-btns button,.hero-btns a{width:100%;text-align:center;}
        }
        @media(min-width:768px){.show-mobile{display:none !important;}}
      `}</style>

      {/* Custom cursor */}
      {!isMobile && <>
        <div style={{
          position:'fixed', zIndex:9999, pointerEvents:'none',
          width:12, height:12, borderRadius:'50%',
          background:acc,
          left:cursorPos.x - 6, top:cursorPos.y - 6,
          transition:'transform 0.1s',
          mixBlendMode:'screen',
        }}/>
        <div style={{
          position:'fixed', zIndex:9998, pointerEvents:'none',
          width:40, height:40, borderRadius:'50%',
          border:`1px solid ${acc}66`,
          left:cursorPos.x - 20, top:cursorPos.y - 20,
          transition:'left 0.08s, top 0.08s',
        }}/>
      </>}

      {/* Particle canvas */}
      <canvas ref={canvasRef} style={{
        position:'fixed',top:0,left:0,width:'100%',height:'100%',
        pointerEvents:'none',zIndex:0,opacity:0.7,
      }}/>

      {/* Scanline effect */}
      <div style={{
        position:'fixed',top:0,left:0,right:0,
        height:'2px',
        background:`linear-gradient(90deg, transparent, ${acc}44, transparent)`,
        animation:'scanline 8s linear infinite',
        pointerEvents:'none', zIndex:1,
        opacity:0.3,
      }}/>

      {/* Top radial glow */}
      <div style={{
        position:'fixed',top:'-30%',left:'50%',transform:'translateX(-50%)',
        width:'100vw',height:'80vh',
        background:`radial-gradient(ellipse, ${isDark?'rgba(124,90,246,0.15)':'rgba(91,76,245,0.07)'} 0%, transparent 65%)`,
        pointerEvents:'none',zIndex:0,
      }}/>

      {/* ── NAV ── */}
      <nav style={{
        position:'fixed',top:0,left:0,right:0,zIndex:100,height:64,
        display:'flex',alignItems:'center',justifyContent:'space-between',
        padding: isMobile?'0 20px':'0 48px',
        background: scrollY>30
          ? isDark?'rgba(6,6,15,0.92)':'rgba(250,250,248,0.92)'
          : 'transparent',
        backdropFilter: scrollY>30?'blur(24px)':'none',
        borderBottom: `1px solid ${scrollY>30?border:'transparent'}`,
        transition:'all 0.4s ease',
      }}>
        <div onClick={()=>window.scrollTo({top:0,behavior:'smooth'})}
          style={{display:'flex',alignItems:'center',gap:10,cursor:'none',zIndex:1}}>
          <div style={{
            width:38,height:38,borderRadius:12,
            background:`linear-gradient(135deg,${acc},${acc2})`,
            display:'flex',alignItems:'center',justifyContent:'center',
            fontFamily:'Plus Jakarta Sans',fontSize:18,fontWeight:800,color:'#fff',
            boxShadow:`0 4px 20px ${acc}55`,
            animation:'glow 3s ease-in-out infinite',
          }}>C</div>
          <div>
            <span style={{fontFamily:'Plus Jakarta Sans',fontWeight:800,fontSize:17,letterSpacing:'-0.5px',color:text}}>
              ClipGen<span style={{color:acc}}>.AI</span>
            </span>
          </div>
        </div>

        <div className="hide-mobile" style={{display:'flex',gap:32,alignItems:'center'}}>
          {t.nav.map((l,i)=>(
            <button key={i} className="nav-link" onClick={()=>scroll(['features','how','pricing','faq'][i])}>{l}</button>
          ))}
        </div>

        <div style={{display:'flex',gap:10,alignItems:'center',zIndex:1}}>
          <select value={lang} onChange={e=>setLang(e.target.value)} style={{
            padding:'6px 10px',borderRadius:8,
            border:`1px solid ${border}`,
            background:isDark?'rgba(13,13,26,0.8)':'rgba(255,255,255,0.8)',
            color:text,fontSize:12,cursor:'none',outline:'none',
            backdropFilter:'blur(12px)',
            maxWidth: isMobile?62:'auto',
          }}>
            {LANGS.slice(0,isMobile?4:10).map(l=><option key={l.code} value={l.code}>{l.flag} {isMobile?'':l.label}</option>)}
          </select>
          <ThemeToggle/>
          <button className="hide-mobile btn-primary" onClick={go} style={{padding:'9px 22px',fontSize:13.5}}>
            {t.start}
          </button>
          <button className="show-mobile" onClick={()=>setMenuOpen(!menuOpen)} style={{
            background:'none',border:'none',color:text,fontSize:24,cursor:'none',
          }}>{menuOpen?'✕':'☰'}</button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          position:'fixed',top:64,left:0,right:0,zIndex:99,
          background:isDark?'rgba(6,6,15,0.97)':'rgba(250,250,248,0.97)',
          backdropFilter:'blur(24px)',
          borderBottom:`1px solid ${border}`,
          padding:'24px',
          display:'flex',flexDirection:'column',gap:16,
        }}>
          {t.nav.map((l,i)=>(
            <button key={i} onClick={()=>scroll(['features','how','pricing','faq'][i])} style={{
              background:'none',border:'none',color:text,
              fontSize:18,fontWeight:600,textAlign:'left',cursor:'none',padding:'8px 0',
            }}>{l}</button>
          ))}
          <button onClick={go} className="btn-primary" style={{marginTop:8}}>
            {t.start}
          </button>
        </div>
      )}

      <div style={{position:'relative',zIndex:1}}>

        {/* ══ HERO ══ */}
        <section ref={heroRef} className="grid-bg" style={{
          minHeight:'100vh',display:'flex',flexDirection:'column',
          alignItems:'center',justifyContent:'center',textAlign:'center',
          padding: isMobile?'100px 24px 80px':'100px 24px 80px',
          position:'relative',overflow:'hidden',
        }}>
          {/* Floating orbs */}
          {!isMobile && <>
            <div style={{position:'absolute',top:'15%',left:'8%',width:180,height:180,borderRadius:'50%',background:`radial-gradient(circle, ${acc}22, transparent 70%)`,animation:'float 7s ease-in-out infinite',pointerEvents:'none'}}/>
            <div style={{position:'absolute',top:'30%',right:'6%',width:120,height:120,borderRadius:'50%',background:`radial-gradient(circle, ${acc2}22, transparent 70%)`,animation:'float 5s ease-in-out infinite 1s',pointerEvents:'none'}}/>
            <div style={{position:'absolute',bottom:'20%',left:'12%',width:80,height:80,borderRadius:'50%',background:`radial-gradient(circle, ${acc}33, transparent 70%)`,animation:'float 6s ease-in-out infinite 2s',pointerEvents:'none'}}/>
            <div style={{position:'absolute',bottom:'30%',right:'10%',width:140,height:140,borderRadius:'50%',background:`radial-gradient(circle, ${acc2}18, transparent 70%)`,animation:'float 8s ease-in-out infinite 0.5s',pointerEvents:'none'}}/>
            {/* Rotating ring */}
            <div style={{
              position:'absolute',top:'50%',left:'50%',
              transform:'translate(-50%,-50%)',
              width:600,height:600,borderRadius:'50%',
              border:`1px solid ${acc}15`,
              animation:'rotate 20s linear infinite',
              pointerEvents:'none',
            }}>
              <div style={{
                position:'absolute',top:-4,left:'50%',transform:'translateX(-50%)',
                width:8,height:8,borderRadius:'50%',background:acc,
                boxShadow:`0 0 12px ${acc}`,
              }}/>
            </div>
            <div style={{
              position:'absolute',top:'50%',left:'50%',
              transform:'translate(-50%,-50%)',
              width:400,height:400,borderRadius:'50%',
              border:`1px solid ${acc}10`,
              animation:'rotate 15s linear infinite reverse',
              pointerEvents:'none',
            }}>
              <div style={{
                position:'absolute',bottom:-4,left:'50%',transform:'translateX(-50%)',
                width:6,height:6,borderRadius:'50%',background:acc2,
                boxShadow:`0 0 10px ${acc2}`,
              }}/>
            </div>
          </>}

          {/* Badge */}
          <div data-reveal="badge" style={{...revealStyle('badge'),marginBottom:28}}>
            <div style={{
              display:'inline-flex',alignItems:'center',gap:8,
              background:`linear-gradient(135deg,${acc}20,${acc2}12)`,
              border:`1px solid ${acc}40`,
              borderRadius:100,padding:'7px 20px',
            }}>
              <span style={{width:7,height:7,borderRadius:'50%',background:acc,animation:'pulse 2s infinite',display:'inline-block'}}/>
              <span style={{fontSize:12.5,fontWeight:600,color:acc,letterSpacing:'0.08em'}}>{t.badge}</span>
            </div>
          </div>

          {/* H1 */}
          <div data-reveal="h1" style={{...revealStyle('h1'),marginBottom:24,maxWidth:900}}>
            <h1 style={{
              fontFamily:'Plus Jakarta Sans',fontWeight:800,
              fontSize: isMobile?'clamp(36px,10vw,52px)':'clamp(56px,6.5vw,96px)',
              lineHeight:1.04,letterSpacing:'-0.04em',
            }}>
              <span style={{color:text,display:'block'}}>{t.h1[0]}</span>
              <span className="shimmer-text" style={{display:'block'}}>{t.h1[1]}</span>
              <span style={{color:text,display:'block'}}>{t.h1[2]}</span>
            </h1>
          </div>

          {/* Sub */}
          <div data-reveal="sub" style={{...revealStyle('sub'),marginBottom:40}}>
            <p style={{
              fontSize: isMobile?16:18.5,color:muted,
              lineHeight:1.7,maxWidth:600,
              fontFamily:'Space Grotesk',fontWeight:400,
            }}>{t.sub}</p>
          </div>

          {/* CTAs */}
          <div data-reveal="cta" style={{...revealStyle('cta'),marginBottom:20}}>
            <div className="hero-btns" style={{display:'flex',gap:14,flexWrap:'wrap',justifyContent:'center'}}>
              <button onClick={go} className="btn-primary" style={{fontSize: isMobile?15:16,padding: isMobile?'14px 28px':'16px 40px'}}>
                {t.cta1}
              </button>
              <button onClick={()=>scroll('how')} className="btn-outline" style={{fontSize: isMobile?15:16,padding: isMobile?'14px 28px':'16px 36px'}}>
                {t.cta2}
              </button>
            </div>
          </div>

          <div data-reveal="trust" style={{...revealStyle('trust'),marginBottom:72}}>
            <p style={{fontSize:13,color:muted,fontFamily:'Space Grotesk'}}>{t.trust}</p>
          </div>

          {/* Stats */}
          <div data-reveal="stats" style={{...revealStyle('stats'),width:'100%',maxWidth:820}}>
            <div style={{
              display:'grid',
              gridTemplateColumns: isMobile?'repeat(2,1fr)':'repeat(4,1fr)',
              gap: isMobile?12:0,
              background:isDark?'rgba(13,13,26,0.8)':'rgba(255,255,255,0.85)',
              border:`1px solid ${border}`,
              borderRadius:20,
              backdropFilter:'blur(24px)',
              overflow:'hidden',
              boxShadow:`0 24px 80px rgba(124,90,246,0.15), inset 0 1px 0 rgba(255,255,255,0.05)`,
            }}>
              {t.stats.map((s,i)=>(
                <div key={i} style={{
                  padding: isMobile?'20px 16px':'28px 24px',
                  textAlign:'center',
                  borderRight: i<3&&!isMobile?`1px solid ${border}`:'none',
                  borderBottom: isMobile&&i<2?`1px solid ${border}`:'none',
                }}>
                  <div style={{
                    fontFamily:'Plus Jakarta Sans',
                    fontSize: isMobile?30:40,fontWeight:800,
                    color:acc,letterSpacing:'-1.5px',lineHeight:1,
                    textShadow:`0 0 30px ${acc}55`,
                  }}>{s.v}</div>
                  <div style={{fontSize:12.5,color:muted,marginTop:6,fontFamily:'Space Grotesk'}}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ HOW IT WORKS ══ */}
        <section id="how" style={{padding: isMobile?'80px 24px':'120px 24px'}}>
          <div style={{maxWidth:1000,margin:'0 auto'}}>
            <div data-reveal="how-head" style={{...revealStyle('how-head'),textAlign:'center',marginBottom:64}}>
              <div style={{fontSize:11,fontWeight:700,color:acc,letterSpacing:'0.2em',marginBottom:14,fontFamily:'Space Grotesk'}}>HOW IT WORKS</div>
              <h2 style={{fontFamily:'Plus Jakarta Sans',fontSize: isMobile?28:48,fontWeight:800,letterSpacing:'-0.03em',color:text,marginBottom:14}}>
                Upload to Viral in <span style={{color:acc}}>4 Steps</span>
              </h2>
              <p style={{color:muted,fontSize:16,fontFamily:'Space Grotesk'}}>No editing skills. No timeline. No nonsense.</p>
            </div>

            <div className="grid-4" style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:16}}>
              {t.steps.map((s,i)=>(
                <div key={i} data-reveal={`step-${i}`} style={revealStyle(`step-${i}`)}>
                  <div className="step-card" style={{
                    padding:'28px 22px',
                    background:isDark?'rgba(13,13,26,0.7)':'rgba(255,255,255,0.85)',
                    border:`1px solid ${border}`,
                    borderRadius:18,backdropFilter:'blur(16px)',
                  }}>
                    <div style={{
                      display:'inline-flex',alignItems:'center',justifyContent:'center',
                      width:48,height:48,borderRadius:14,
                      background:`linear-gradient(135deg,${acc}25,${acc2}15)`,
                      border:`1px solid ${acc}40`,
                      fontFamily:'Plus Jakarta Sans',fontSize:13,fontWeight:800,color:acc,
                      marginBottom:18,
                      boxShadow:`0 4px 16px ${acc}20`,
                    }}>{s.n}</div>
                    <div style={{fontFamily:'Plus Jakarta Sans',fontSize:16,fontWeight:700,color:text,marginBottom:8}}>{s.t}</div>
                    <div style={{fontSize:13.5,color:muted,lineHeight:1.65,fontFamily:'Space Grotesk'}}>{s.d}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ FEATURES ══ */}
        <section id="features" style={{
          padding: isMobile?'80px 24px':'120px 24px',
          background:isDark?'rgba(13,13,26,0.5)':'rgba(248,247,245,0.8)',
          position:'relative',overflow:'hidden',
        }}>
          <div style={{
            position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',
            width:'60vw',height:'60vw',borderRadius:'50%',
            background:`radial-gradient(circle, ${acc}08, transparent 60%)`,
            pointerEvents:'none',
          }}/>
          <div style={{maxWidth:1000,margin:'0 auto',position:'relative'}}>
            <div data-reveal="feat-head" style={{...revealStyle('feat-head'),textAlign:'center',marginBottom:64}}>
              <div style={{fontSize:11,fontWeight:700,color:acc,letterSpacing:'0.2em',marginBottom:14,fontFamily:'Space Grotesk'}}>FEATURES</div>
              <h2 style={{fontFamily:'Plus Jakarta Sans',fontSize: isMobile?28:48,fontWeight:800,letterSpacing:'-0.03em',color:text}}>
                Built to <span style={{color:acc}}>Go Viral</span>
              </h2>
            </div>
            <div className="grid-3" style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:18}}>
              {t.feats.map((f,i)=>(
                <div key={i} data-reveal={`feat-${i}`}
                  style={{...revealStyle(`feat-${i}`),transitionDelay:`${i*0.1}s`}}>
                  <div className="card-3d" style={{
                    padding:'30px',
                    background:isDark?'rgba(13,13,26,0.75)':'rgba(255,255,255,0.9)',
                    border:`1px solid ${border}`,borderRadius:20,
                    backdropFilter:'blur(20px)',
                    height:'100%',
                  }}>
                    <div className="feat-icon-wrap" style={{
                      fontSize:28,marginBottom:20,
                      width:60,height:60,display:'flex',alignItems:'center',justifyContent:'center',
                      background:`linear-gradient(135deg,${acc}18,${acc2}10)`,
                      borderRadius:16,border:`1px solid ${acc}30`,
                      boxShadow:`0 4px 20px ${acc}15`,
                    }}>{f.i}</div>
                    <div style={{fontFamily:'Plus Jakarta Sans',fontSize:16,fontWeight:700,color:text,marginBottom:10}}>{f.t}</div>
                    <div style={{fontSize:14,color:muted,lineHeight:1.65,fontFamily:'Space Grotesk'}}>{f.d}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ PRICING ══ */}
        <section id="pricing" style={{padding: isMobile?'80px 24px':'120px 24px'}}>
          <div style={{maxWidth:1000,margin:'0 auto'}}>
            <div data-reveal="price-head" style={{...revealStyle('price-head'),textAlign:'center',marginBottom:48}}>
              <div style={{fontSize:11,fontWeight:700,color:acc,letterSpacing:'0.2em',marginBottom:14,fontFamily:'Space Grotesk'}}>PRICING</div>
              <h2 style={{fontFamily:'Plus Jakarta Sans',fontSize: isMobile?28:48,fontWeight:800,letterSpacing:'-0.03em',color:text,marginBottom:28}}>
                Start Free. <span style={{color:acc}}>Scale When Ready.</span>
              </h2>
              <div style={{display:'inline-flex',background:isDark?'rgba(13,13,26,0.8)':'rgba(240,239,237,0.9)',borderRadius:14,padding:4,border:`1px solid ${border}`}}>
                {['monthly','yearly'].map(b=>(
                  <button key={b} onClick={()=>setBilling(b)} style={{
                    padding:'9px 22px',borderRadius:11,
                    background: billing===b?`linear-gradient(135deg,${acc},${acc2})`:'transparent',
                    color: billing===b?'#fff':muted,
                    fontWeight: billing===b?700:400,
                    fontSize:13.5,border:'none',cursor:'none',
                    transition:'all 0.25s ease',
                    boxShadow: billing===b?`0 4px 20px ${acc}44`:'none',
                  }}>{b==='monthly'?'Monthly':'Yearly · Save 5 months'}</button>
                ))}
              </div>
            </div>

            <div className="grid-3" style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:20}}>
              {t.plans.map((p,i)=>(
                <div key={i} data-reveal={`plan-${i}`}
                  style={{...revealStyle(`plan-${i}`),transitionDelay:`${i*0.12}s`}}>
                  <div className="price-card" style={{
                    padding:'36px 28px',
                    background: p.hot
                      ? isDark?`linear-gradient(135deg,rgba(124,90,246,0.22),rgba(192,132,252,0.12))`:`linear-gradient(135deg,rgba(124,90,246,0.07),rgba(192,132,252,0.04))`
                      : isDark?'rgba(13,13,26,0.7)':'rgba(255,255,255,0.9)',
                    border:`2px solid ${p.hot?acc:border}`,
                    borderRadius:22,position:'relative',
                    backdropFilter:'blur(20px)',
                    boxShadow: p.hot?`0 16px 60px ${acc}30,0 0 0 1px ${acc}20`:'none',
                  }}>
                    {p.hot&&(
                      <div style={{
                        position:'absolute',top:-15,left:'50%',transform:'translateX(-50%)',
                        background:`linear-gradient(135deg,${acc},${acc2})`,
                        color:'#fff',borderRadius:100,padding:'5px 18px',
                        fontSize:11,fontWeight:800,whiteSpace:'nowrap',
                        letterSpacing:'0.05em',
                        boxShadow:`0 4px 20px ${acc}66`,
                      }}>✦ BEST VALUE</div>
                    )}
                    <div style={{fontSize:11,fontWeight:700,color:acc,letterSpacing:'0.12em',marginBottom:8,fontFamily:'Space Grotesk'}}>{p.n.toUpperCase()}</div>
                    <div style={{display:'flex',alignItems:'baseline',gap:4,marginBottom:6}}>
                      <span style={{
                        fontFamily:'Plus Jakarta Sans',fontSize:52,fontWeight:800,
                        color:text,letterSpacing:'-2px',lineHeight:1,
                        textShadow: p.hot?`0 0 40px ${acc}44`:'none',
                      }}>{prices[billing][i]}</span>
                      <span style={{fontSize:14,color:muted,fontFamily:'Space Grotesk'}}>/mo</span>
                    </div>
                    <div style={{fontSize:13.5,color:muted,marginBottom:28,fontFamily:'Space Grotesk'}}>{p.d}</div>
                    <button onClick={go} className={p.hot?'btn-primary':'btn-outline'} style={{width:'100%',padding:'12px',fontSize:14,marginBottom:24,borderRadius:12}}>
                      Get Started
                    </button>
                    <div style={{display:'flex',flexDirection:'column',gap:12}}>
                      {p.f.map((f,j)=>(
                        <div key={j} style={{display:'flex',alignItems:'center',gap:10,fontSize:13.5}}>
                          <div style={{
                            width:20,height:20,borderRadius:'50%',
                            background:`linear-gradient(135deg,${acc}30,${acc2}20)`,
                            display:'flex',alignItems:'center',justifyContent:'center',
                            flexShrink:0,
                          }}>
                            <span style={{color:acc,fontSize:11,fontWeight:700}}>✓</span>
                          </div>
                          <span style={{color:muted,fontFamily:'Space Grotesk'}}>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ FAQ ══ */}
        <section id="faq" style={{
          padding: isMobile?'80px 24px':'120px 24px',
          background:isDark?'rgba(13,13,26,0.4)':'rgba(248,247,245,0.7)',
        }}>
          <div style={{maxWidth:700,margin:'0 auto'}}>
            <div data-reveal="faq-head" style={{...revealStyle('faq-head'),textAlign:'center',marginBottom:48}}>
              <div style={{fontSize:11,fontWeight:700,color:acc,letterSpacing:'0.2em',marginBottom:14,fontFamily:'Space Grotesk'}}>FAQ</div>
              <h2 style={{fontFamily:'Plus Jakarta Sans',fontSize: isMobile?28:40,fontWeight:800,letterSpacing:'-0.03em',color:text}}>
                Common <span style={{color:acc}}>Questions</span>
              </h2>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:12}}>
              {t.faqs.map((f,i)=>(
                <div key={i} data-reveal={`faq-${i}`}
                  style={{...revealStyle(`faq-${i}`),transitionDelay:`${i*0.08}s`}}>
                  <div className="faq-item" style={{
                    background:isDark?'rgba(13,13,26,0.7)':'rgba(255,255,255,0.85)',
                    border:`1px solid ${openFaq===i?acc+'55':border}`,
                    borderRadius:16,overflow:'hidden',
                    backdropFilter:'blur(16px)',
                    cursor:'none',
                  }}>
                    <button onClick={()=>setOpenFaq(openFaq===i?null:i)} style={{
                      width:'100%',padding:'20px 24px',
                      display:'flex',justifyContent:'space-between',alignItems:'center',
                      background:'none',border:'none',cursor:'none',textAlign:'left',
                    }}>
                      <span style={{fontFamily:'Plus Jakarta Sans',fontWeight:600,fontSize: isMobile?14:15,color:text}}>{f.q}</span>
                      <div style={{
                        width:32,height:32,borderRadius:'50%',
                        background:openFaq===i?`linear-gradient(135deg,${acc},${acc2})`:`${acc}15`,
                        display:'flex',alignItems:'center',justifyContent:'center',
                        flexShrink:0,marginLeft:16,
                        transition:'all 0.3s ease',
                        boxShadow: openFaq===i?`0 4px 16px ${acc}44`:'none',
                      }}>
                        <span style={{
                          color: openFaq===i?'#fff':acc,
                          fontSize:18,fontWeight:300,
                          transform: openFaq===i?'rotate(45deg)':'rotate(0)',
                          transition:'transform 0.3s ease',
                          display:'inline-block',lineHeight:1,
                        }}>+</span>
                      </div>
                    </button>
                    {openFaq===i&&(
                      <div style={{
                        padding:'0 24px 20px',
                        fontSize:14.5,color:muted,lineHeight:1.75,
                        fontFamily:'Space Grotesk',
                        borderTop:`1px solid ${border}`,
                        paddingTop:16,
                      }}>{f.a}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ FINAL CTA ══ */}
        <section style={{
          padding: isMobile?'100px 24px':'160px 24px',
          textAlign:'center',position:'relative',overflow:'hidden',
        }}>
          <div style={{
            position:'absolute',inset:0,
            background:`radial-gradient(ellipse at center, ${acc}20 0%, transparent 65%)`,
            pointerEvents:'none',
          }}/>
          {!isMobile&&<>
            <div style={{position:'absolute',top:'20%',left:'15%',width:8,height:8,borderRadius:'50%',background:acc,animation:'particleFloat 4s ease-in-out infinite',boxShadow:`0 0 16px ${acc}`}}/>
            <div style={{position:'absolute',top:'60%',right:'12%',width:6,height:6,borderRadius:'50%',background:acc2,animation:'particleFloat 5s ease-in-out infinite 1s',boxShadow:`0 0 12px ${acc2}`}}/>
            <div style={{position:'absolute',bottom:'25%',left:'20%',width:10,height:10,borderRadius:'50%',background:acc,animation:'particleFloat 3.5s ease-in-out infinite 0.5s',boxShadow:`0 0 20px ${acc}`}}/>
          </>}
          <div data-reveal="final-cta" style={{...revealStyle('final-cta'),position:'relative',maxWidth:680,margin:'0 auto'}}>
            <h2 style={{
              fontFamily:'Plus Jakarta Sans',fontWeight:800,
              fontSize: isMobile?34:60,letterSpacing:'-0.04em',
              color:text,marginBottom:20,lineHeight:1.1,
            }}>
              {t.ctaH.split(' ').map((w,i)=>(
                <span key={i} style={{color: i===2||i===3?acc:text}}>{w}{' '}</span>
              ))}
            </h2>
            <p style={{color:muted,fontSize: isMobile?15:18,marginBottom:48,fontFamily:'Space Grotesk',lineHeight:1.7,maxWidth:520,margin:'0 auto 48px'}}>{t.ctaS}</p>
            <button onClick={go} className="btn-primary" style={{fontSize: isMobile?15:17,padding: isMobile?'15px 32px':'18px 52px'}}>
              {t.ctaBtn}
            </button>
          </div>
        </section>

        {/* ══ FOOTER ══ */}
        <footer style={{
          padding: isMobile?'28px 20px':'32px 48px',
          borderTop:`1px solid ${border}`,
          display:'flex',flexDirection: isMobile?'column':'row',
          justifyContent:'space-between',alignItems:'center',
          gap:16,textAlign: isMobile?'center':'left',
          background:isDark?'rgba(6,6,15,0.9)':'rgba(250,250,248,0.9)',
          backdropFilter:'blur(24px)',
        }}>
          <div style={{display:'flex',alignItems:'center',gap:10}}>
            <div style={{
              width:30,height:30,borderRadius:9,
              background:`linear-gradient(135deg,${acc},${acc2})`,
              display:'flex',alignItems:'center',justifyContent:'center',
              fontSize:14,fontWeight:800,color:'#fff',
            }}>C</div>
            <span style={{fontFamily:'Plus Jakarta Sans',fontWeight:800,fontSize:15,color:text}}>
              ClipGen<span style={{color:acc}}>.AI</span>
            </span>
          </div>
          <div style={{display:'flex',gap:24,flexWrap:'wrap',justifyContent:'center'}}>
            {t.nav.map((l,i)=>(
              <button key={i} onClick={()=>scroll(['features','how','pricing','faq'][i])} style={{
                color:muted,fontSize:13.5,background:'none',border:'none',cursor:'none',
                fontFamily:'Space Grotesk',transition:'color 0.2s',
              }}
              onMouseEnter={e=>e.currentTarget.style.color=acc}
              onMouseLeave={e=>e.currentTarget.style.color=muted}
              >{l}</button>
            ))}
          </div>
          <span style={{color:muted,fontSize:12.5,fontFamily:'Space Grotesk'}}>© 2026 ClipGen.AI</span>
        </footer>
      </div>
    </div>
  )
}

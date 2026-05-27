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
    nav:['Features','How It Works','Pricing','FAQ'],
    start:'Get Started →',
    badge:'Next-Gen AI Video Intelligence',
    h1a:'Turn Any Video Into',
    h1b:'Viral Clips',
    h1c:'Automatically',
    sub:'Upload a long video. AI finds the best moments, cuts clips, burns subtitles — TikTok, Reels & Shorts ready in minutes.',
    cta1:'Start Free Trial →',
    cta2:'See How It Works',
    trust:'No card required · 3 days free · Cancel anytime',
    callouts:['AI detects viral moments','Auto subtitles in 50+ languages','9:16 format ready to post','Viral score on every clip'],
    stats:[{v:'2.4M+',l:'Clips Generated'},{v:'96',l:'Avg Viral Score'},{v:'10×',l:'Faster'},{v:'152K',l:'Creators'}],
    howBadge:'HOW IT WORKS',
    howH:'Upload to Viral in 4 Steps',
    howS:'No editing skills. No timeline. No nonsense.',
    steps:[
      {n:'01',t:'Upload',d:'Drop any MP4, MOV or AVI — up to 500MB, 60 minutes long.'},
      {n:'02',t:'AI Analyses',d:'Transcription, emotion peaks, viral hooks detected automatically.'},
      {n:'03',t:'Clips Cut',d:'Best moments trimmed, reformatted 9:16, subtitles burned in.'},
      {n:'04',t:'Publish',d:'Download or push directly to TikTok, Reels & Shorts.'},
    ],
    featBadge:'FEATURES',
    featH:'Everything You Need to Go Viral',
    feats:[
      {i:'🎯',t:'Viral Scoring',d:'Every clip scored 0–100 on hook strength, emotion and shareability.'},
      {i:'📝',t:'Auto Captions',d:'AI subtitles in 50+ languages that boost watch-time by 40%.'},
      {i:'🚀',t:'1-Click Publish',d:'TikTok, Instagram Reels, YouTube Shorts simultaneously.'},
      {i:'⚡',t:'Smart Detection',d:'Best 30–90s segments found from hours of content automatically.'},
      {i:'✍️',t:'Hook Titles',d:'Scroll-stopping hook titles generated for every platform.'},
      {i:'👥',t:'Agency Mode',d:'Multi-client dashboard, white-label, team collaboration.'},
    ],
    priceBadge:'PRICING',
    priceH:'Start Free. Scale When Ready.',
    monthly:'Monthly',yearly:'Yearly · Save 5 months',
    plans:[
      {n:'Starter',p:'€29',d:'For individual creators',f:['10 videos/month','Auto subtitles','9:16 format','3 social accounts','Email support'],hot:false},
      {n:'Pro',p:'€59',d:'For serious creators',f:['50 videos/month','50+ languages','Direct publishing','Priority processing','Priority support'],hot:true},
      {n:'Agency',p:'€99',d:'For teams & agencies',f:['Unlimited videos','White-label','Team workspace','API access','SLA guarantee'],hot:false},
    ],
    faqBadge:'FAQ',faqH:'Common Questions',
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
    nav:['Funkcijos','Kaip veikia','Kainos','DUK'],start:'Pradėti →',
    badge:'Naujos kartos DI vaizdo platforma',
    h1a:'Paversk bet kurį vaizdo įrašą',h1b:'Virusiniais klipais',h1c:'Automatiškai',
    sub:'Įkelkite vaizdo įrašą. Mūsų DI suranda geriausias akimirkas, sukarpо klipus, prideda subtitrus.',
    cta1:'Pradėti nemokamai →',cta2:'Kaip tai veikia',
    trust:'Nereikia kortelės · 3 dienos nemokamai',
    callouts:['DI aptinka viralinius momentus','Automatiniai subtitrai 50+ kalbų','9:16 formatas paruoštas','Viralinis balas kiekvienam klipui'],
    stats:[{v:'2.4M+',l:'Sukurti klipai'},{v:'96',l:'Vidurkis'},{v:'10×',l:'Greičiau'},{v:'152K',l:'Kūrėjų'}],
    howBadge:'KAIP TAI VEIKIA',howH:'Nuo įkėlimo iki viralinio per 4 žingsnius',howS:'Nereikia redagavimo įgūdžių.',
    steps:[{n:'01',t:'Įkelti',d:'MP4, MOV ar AVI iki 500MB.'},{n:'02',t:'DI analizuoja',d:'Transkribavimas ir viralinio potencialo aptikimas.'},{n:'03',t:'Klipai sukurti',d:'Geriausi momentai, 9:16 formatas, subtitrai.'},{n:'04',t:'Publikuoti',d:'TikTok, Reels, Shorts akimirksniu.'}],
    featBadge:'FUNKCIJOS',featH:'Viskas ko reikia tapti viraliniu',
    feats:[{i:'🎯',t:'Viralinis balas',d:'0–100 balas kiekvienam klipui.'},{i:'📝',t:'Automatiniai subtitrai',d:'50+ kalbų, žiūrėjimo laikas +40%.'},{i:'🚀',t:'Publikavimas',d:'Vienu paspaudimu į TikTok, Reels, Shorts.'},{i:'⚡',t:'Aptikimas',d:'Geriausi segmentai iš valandų turinio.'},{i:'✍️',t:'Pavadinimai',d:'Virusiniai pavadinimai kiekvienai platformai.'},{i:'👥',t:'Agentūra',d:'Kelių klientų valdymas.'}],
    priceBadge:'KAINOS',priceH:'Pradėk Nemokamai.',monthly:'Mėnesinis',yearly:'Metinis · Sutaupyk 5 mėnesius',
    plans:[
      {n:'Pradedantysis',p:'€29',d:'Individualiems kūrėjams',f:['10 vaizdo įrašų/mėn','Automatiniai subtitrai','9:16 formatas','3 paskyros','El. pašto palaikymas'],hot:false},
      {n:'Pro',p:'€59',d:'Rimtiems kūrėjams',f:['50 vaizdo įrašų/mėn','50+ kalbų','Tiesioginis publikavimas','Prioritetinis apdorojimas','Prioritetinė pagalba'],hot:true},
      {n:'Agentūra',p:'€99',d:'Komandoms',f:['Neriboti vaizdo įrašai','Baltos etiketės','Komandos erdvė','API prieiga','SLA garantija'],hot:false},
    ],
    faqBadge:'DUK',faqH:'Dažni Klausimai',
    faqs:[{q:'Kaip veikia ClipGen.AI?',a:'Įkelkite vaizdo įrašą — DI transkribuoja, suranda viraliausias akimirkas, iškerpa klipus per kelias minutes.'},{q:'Kokie formatai palaikomi?',a:'MP4, MOV, AVI ir MKV iki 500MB ir 60 minučių.'},{q:'Kiek klipų generuojama?',a:'Nuo 3 iki 10 klipų vienam vaizdo įrašui.'},{q:'Ar palaikoma lietuvių kalba?',a:'Taip — pilnai palaikoma.'},{q:'Ar galiu atšaukti bet kada?',a:'Taip — be jokių mokesčių.'}],
    ctaH:'Pasiruošę Tapti Viraliais?',ctaS:'Prisijunkite prie tūkstančių kūrėjų naudojančių ClipGen.AI.',ctaBtn:'⚡ Pradėti Kurti Klipus',
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
  const [revealed, setRevealed] = useState(new Set())
  const canvasRef = useRef(null)
  const rafRef = useRef(null)
  const t = tFor(lang)
  const prices = { monthly:['€29','€59','€99'], yearly:['€19','€39','€69'] }

  useEffect(() => {
    const onR = () => setIsMobile(window.innerWidth < 768)
    const onS = () => setScrollY(window.scrollY)
    window.addEventListener('resize', onR)
    window.addEventListener('scroll', onS)
    onR()
    return () => { window.removeEventListener('resize', onR); window.removeEventListener('scroll', onS) }
  }, [])

  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting && e.target.dataset.rid) setRevealed(p => new Set([...p, e.target.dataset.rid])) })
    }, { threshold: 0.08 })
    setTimeout(() => { document.querySelectorAll('[data-rid]').forEach(el => obs.observe(el)) }, 100)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    resize()
    window.addEventListener('resize', resize)
    const N = isMobile ? 35 : 70
    const pts = Array.from({length:N}, () => ({
      x: Math.random()*window.innerWidth, y: Math.random()*window.innerHeight,
      vx: (Math.random()-.5)*.4, vy: (Math.random()-.5)*.4,
      r: Math.random()*1.8+.4, ph: Math.random()*Math.PI*2,
    }))
    const draw = () => {
      ctx.clearRect(0,0,canvas.width,canvas.height)
      pts.forEach(p => {
        p.x+=p.vx; p.y+=p.vy; p.ph+=.018
        if(p.x<0)p.x=canvas.width; if(p.x>canvas.width)p.x=0
        if(p.y<0)p.y=canvas.height; if(p.y>canvas.height)p.y=0
        const a = (.4+.3*Math.sin(p.ph))
        ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2)
        ctx.fillStyle = `rgba(124,90,246,${a})`; ctx.fill()
      })
      for(let i=0;i<pts.length;i++) for(let j=i+1;j<pts.length;j++) {
        const d = Math.hypot(pts[i].x-pts[j].x, pts[i].y-pts[j].y)
        if(d<110){
          ctx.beginPath(); ctx.moveTo(pts[i].x,pts[i].y); ctx.lineTo(pts[j].x,pts[j].y)
          ctx.strokeStyle=`rgba(124,90,246,${.12*(1-d/110)})`; ctx.lineWidth=.5; ctx.stroke()
        }
      }
      rafRef.current = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(rafRef.current); window.removeEventListener('resize', resize) }
  }, [isDark, isMobile])

  const go = () => navigate('/signup')
  const scrollTo = id => { document.getElementById(id)?.scrollIntoView({behavior:'smooth'}); setMenuOpen(false) }
  const vis = id => revealed.has(id)
  const rv = (id, delay=0) => ({
    opacity: vis(id) ? 1 : 0,
    transform: vis(id) ? 'translateY(0) scale(1)' : 'translateY(36px) scale(0.97)',
    transition: `opacity .75s ease ${delay}s, transform .75s cubic-bezier(.22,.68,0,1.2) ${delay}s`,
  })

  /* ── COLORS ── */
  const BG     = '#0a0a12'
  const SURF   = '#0f0f1e'
  const SURF2  = '#141428'
  const BORDER = 'rgba(124,90,246,0.18)'
  const TEXT   = '#f0eeff'
  const MUTED  = '#6b6b90'
  const ACC    = '#7c5af6'
  const ACC2   = '#c084fc'

  const sectionPad = isMobile ? '80px 20px' : '120px 48px'

  return (
    <div style={{fontFamily:"'Plus Jakarta Sans','Space Grotesk',system-ui,sans-serif", background:BG, color:TEXT, overflowX:'hidden', minHeight:'100vh'}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,800&family=Space+Grotesk:wght@300;400;500;600&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        html{scroll-behavior:smooth;}
        ::selection{background:rgba(124,90,246,0.35);}
        ::-webkit-scrollbar{width:3px;}
        ::-webkit-scrollbar-thumb{background:${ACC}66;border-radius:2px;}

        @keyframes floatA{0%,100%{transform:translateY(0) rotate(0deg);}50%{transform:translateY(-16px) rotate(2deg);}}
        @keyframes floatB{0%,100%{transform:translateY(0);}50%{transform:translateY(-10px);}}
        @keyframes pulse{0%,100%{opacity:.5;transform:scale(1);}50%{opacity:1;transform:scale(1.3);}}
        @keyframes orbitCW{from{transform:rotate(0deg);}to{transform:rotate(360deg);}}
        @keyframes orbitCCW{from{transform:rotate(0deg);}to{transform:rotate(-360deg);}}
        @keyframes shimmer{0%{background-position:-300% 0;}100%{background-position:300% 0;}}
        @keyframes glowPulse{0%,100%{box-shadow:0 0 24px ${ACC}44;}50%{box-shadow:0 0 64px ${ACC}88, 0 0 120px ${ACC}33;}}
        @keyframes calloutIn{from{opacity:0;transform:translateX(-12px);}to{opacity:1;transform:translateX(0);}}
        @keyframes scanLine{0%{top:-2px;}100%{top:100vh;}}
        @keyframes countIn{from{opacity:0;transform:translateY(16px);}to{opacity:1;transform:translateY(0);}}
        @keyframes badgeSlide{from{opacity:0;transform:translateY(-8px);}to{opacity:1;transform:translateY(0);}}
        @keyframes borderRotate{from{background-position:0% 50%;}to{background-position:100% 50%;}}

        .btn-main{
          background:linear-gradient(135deg,${ACC},${ACC2});
          color:#fff;border:none;border-radius:14px;
          font-family:'Plus Jakarta Sans',sans-serif;
          font-weight:700;letter-spacing:0.01em;cursor:pointer;
          position:relative;overflow:hidden;transition:all .3s ease;
          box-shadow:0 8px 32px ${ACC}55;
        }
        .btn-main::after{content:'';position:absolute;inset:0;
          background:linear-gradient(135deg,rgba(255,255,255,.18),transparent 60%);
          opacity:0;transition:opacity .3s;}
        .btn-main:hover{transform:translateY(-3px) scale(1.02);box-shadow:0 16px 52px ${ACC}77;}
        .btn-main:hover::after{opacity:1;}
        .btn-main:active{transform:scale(.98);}

        .btn-ghost{
          background:rgba(124,90,246,.08);
          color:${TEXT};border:1px solid ${BORDER};
          border-radius:14px;font-family:'Plus Jakarta Sans',sans-serif;
          font-weight:500;cursor:pointer;transition:all .3s ease;
          backdrop-filter:blur(12px);
        }
        .btn-ghost:hover{border-color:${ACC}55;background:rgba(124,90,246,.15);transform:translateY(-2px);}

        .feat-card{
          transition:all .4s cubic-bezier(.175,.885,.32,1.275);
          position:relative;
        }
        .feat-card::before{
          content:'';position:absolute;inset:-1px;border-radius:21px;
          background:linear-gradient(135deg,${ACC}44,${ACC2}22,transparent 60%);
          opacity:0;transition:opacity .4s;z-index:0;
        }
        .feat-card:hover{transform:translateY(-10px) scale(1.02);}
        .feat-card:hover::before{opacity:1;}
        .feat-card>*{position:relative;z-index:1;}

        .feat-icon-box{
          transition:all .4s cubic-bezier(.175,.885,.32,1.275);
        }
        .feat-card:hover .feat-icon-box{
          transform:scale(1.12) rotate(6deg);
          box-shadow:0 12px 40px ${ACC}44 !important;
        }

        .price-card{transition:all .4s cubic-bezier(.175,.885,.32,1.275);}
        .price-card:hover{transform:translateY(-12px) scale(1.015);}

        .step-num{
          background:linear-gradient(135deg,${ACC}33,${ACC2}22);
          border:1px solid ${ACC}44;
          transition:all .3s ease;
        }
        .step-card:hover .step-num{
          background:linear-gradient(135deg,${ACC},${ACC2});
          border-color:transparent;
          box-shadow:0 4px 20px ${ACC}55;
          color:#fff !important;
        }
        .step-card{transition:all .3s ease;}
        .step-card:hover{transform:translateY(-8px);}

        .nav-btn{
          background:none;border:none;cursor:pointer;
          font-family:'Plus Jakarta Sans',sans-serif;
          font-size:14px;font-weight:500;color:${MUTED};
          padding:6px 0;position:relative;transition:color .2s;
        }
        .nav-btn::after{content:'';position:absolute;bottom:-2px;left:0;right:100%;
          height:1px;background:${ACC};transition:right .3s;}
        .nav-btn:hover{color:${TEXT};}
        .nav-btn:hover::after{right:0;}

        .callout-tag{
          animation:calloutIn .6s ease both;
          transition:all .3s ease;
        }
        .callout-tag:hover{transform:scale(1.05) translateY(-2px);box-shadow:0 8px 32px rgba(0,0,0,.4);}

        .faq-row{
          transition:all .25s ease;border:1px solid ${BORDER};
        }
        .faq-row:hover{border-color:${ACC}44;}

        @media(max-width:767px){
          .hide-mob{display:none!important;}
          .show-mob{display:flex!important;}
          .grid-3{grid-template-columns:1fr!important;}
          .grid-4{grid-template-columns:repeat(2,1fr)!important;}
          .hero-ctas{flex-direction:column!important;align-items:stretch!important;}
        }
        @media(min-width:768px){.show-mob{display:none!important;}}
      `}</style>

      {/* Particle canvas */}
      <canvas ref={canvasRef} style={{position:'fixed',inset:0,width:'100%',height:'100%',pointerEvents:'none',zIndex:0,opacity:.65}}/>

      {/* Scanline */}
      <div style={{position:'fixed',left:0,right:0,height:2,background:`linear-gradient(90deg,transparent,${ACC}55,transparent)`,animation:'scanLine 10s linear infinite',pointerEvents:'none',zIndex:1,opacity:.35}}/>

      {/* Global glow top */}
      <div style={{position:'fixed',top:'-25%',left:'50%',transform:'translateX(-50%)',width:'90vw',height:'70vh',background:`radial-gradient(ellipse,rgba(124,90,246,.14) 0%,transparent 65%)`,pointerEvents:'none',zIndex:0}}/>

      {/* ══ NAV ══ */}
      <nav style={{
        position:'fixed',top:0,left:0,right:0,zIndex:200,height:66,
        display:'flex',alignItems:'center',justifyContent:'space-between',
        padding:isMobile?'0 18px':'0 48px',
        background:scrollY>40?'rgba(10,10,18,.92)':'transparent',
        backdropFilter:scrollY>40?'blur(24px)':'none',
        borderBottom:`1px solid ${scrollY>40?BORDER:'transparent'}`,
        transition:'all .35s ease',
      }}>
        <div onClick={()=>window.scrollTo({top:0,behavior:'smooth'})}
          style={{display:'flex',alignItems:'center',gap:10,cursor:'pointer',zIndex:1}}>
          <div style={{
            width:40,height:40,borderRadius:12,
            background:`linear-gradient(135deg,${ACC},${ACC2})`,
            display:'flex',alignItems:'center',justifyContent:'center',
            fontFamily:'Plus Jakarta Sans',fontSize:20,fontWeight:800,color:'#fff',
            animation:'glowPulse 3s ease-in-out infinite',
          }}>C</div>
          <span style={{fontFamily:'Plus Jakarta Sans',fontWeight:800,fontSize:18,letterSpacing:'-.5px',color:TEXT}}>
            ClipGen<span style={{color:ACC}}>.AI</span>
          </span>
        </div>

        <div className="hide-mob" style={{display:'flex',gap:32,alignItems:'center'}}>
          {t.nav.map((l,i)=>(
            <button key={i} className="nav-btn" onClick={()=>scrollTo(['features','how','pricing','faq'][i])}>{l}</button>
          ))}
        </div>

        <div style={{display:'flex',gap:10,alignItems:'center',zIndex:1}}>
          <select value={lang} onChange={e=>setLang(e.target.value)} style={{
            padding:'6px 10px',borderRadius:8,border:`1px solid ${BORDER}`,
            background:'rgba(15,15,30,.85)',color:TEXT,fontSize:12,cursor:'pointer',outline:'none',
            backdropFilter:'blur(12px)',maxWidth:isMobile?64:'auto',
          }}>
            {LANGS.slice(0,isMobile?4:10).map(l=><option key={l.code} value={l.code}>{l.flag} {isMobile?'':l.label}</option>)}
          </select>
          <ThemeToggle/>
          <button className="hide-mob btn-main" onClick={go} style={{padding:'9px 22px',fontSize:13.5}}>{t.start}</button>
          <button className="show-mob" onClick={()=>setMenuOpen(!menuOpen)} style={{background:'none',border:'none',color:TEXT,fontSize:24,cursor:'pointer'}}>{menuOpen?'✕':'☰'}</button>
        </div>
      </nav>

      {menuOpen&&(
        <div style={{position:'fixed',top:66,left:0,right:0,zIndex:199,background:'rgba(10,10,18,.97)',backdropFilter:'blur(24px)',borderBottom:`1px solid ${BORDER}`,padding:'24px',display:'flex',flexDirection:'column',gap:16}}>
          {t.nav.map((l,i)=>(
            <button key={i} onClick={()=>scrollTo(['features','how','pricing','faq'][i])} style={{background:'none',border:'none',color:TEXT,fontSize:18,fontWeight:600,textAlign:'left',cursor:'pointer',padding:'8px 0'}}>{l}</button>
          ))}
          <button onClick={go} className="btn-main" style={{marginTop:8,padding:'14px',fontSize:15}}>{t.start}</button>
        </div>
      )}

      <div style={{position:'relative',zIndex:1}}>

        {/* ══ HERO ══ */}
        <section style={{
          minHeight:'100vh',
          display:'flex',flexDirection:'column',
          alignItems:'center',justifyContent:'center',
          textAlign:'center',
          padding:isMobile?'110px 20px 60px':'110px 24px 60px',
          position:'relative',overflow:'hidden',
        }}>
          {/* Orbital rings */}
          {!isMobile&&<>
            <div style={{position:'absolute',top:'50%',left:'50%',marginLeft:-320,marginTop:-320,width:640,height:640,borderRadius:'50%',border:`1px solid ${ACC}12`,animation:'orbitCW 25s linear infinite',pointerEvents:'none'}}>
              <div style={{position:'absolute',top:-5,left:'50%',marginLeft:-5,width:10,height:10,borderRadius:'50%',background:ACC,boxShadow:`0 0 16px ${ACC}, 0 0 32px ${ACC}55`}}/>
            </div>
            <div style={{position:'absolute',top:'50%',left:'50%',marginLeft:-220,marginTop:-220,width:440,height:440,borderRadius:'50%',border:`1px solid ${ACC2}10`,animation:'orbitCCW 18s linear infinite',pointerEvents:'none'}}>
              <div style={{position:'absolute',bottom:-4,left:'50%',marginLeft:-4,width:8,height:8,borderRadius:'50%',background:ACC2,boxShadow:`0 0 12px ${ACC2}`}}/>
            </div>
            {/* Floating orbs */}
            {[[{top:'18%',left:'6%',w:160,h:160,c:ACC,d:0},{top:'25%',right:'4%',w:120,h:120,c:ACC2,d:1.5},{bottom:'22%',left:'8%',w:90,h:90,c:ACC,d:0.8},{bottom:'28%',right:'6%',w:140,h:140,c:ACC2,d:2}]].flat().map((o,i)=>(
              <div key={i} style={{position:'absolute',...o,borderRadius:'50%',background:`radial-gradient(circle,${o.c}20,transparent 70%)`,animation:`floatA ${6+i}s ease-in-out infinite ${o.d}s`,pointerEvents:'none'}}/>
            ))}
          </>}

          {/* Badge */}
          <div data-rid="badge" style={{...rv('badge'),marginBottom:28}}>
            <div style={{display:'inline-flex',alignItems:'center',gap:8,background:`linear-gradient(135deg,${ACC}22,${ACC2}12)`,border:`1px solid ${ACC}44`,borderRadius:100,padding:'7px 20px',animation:'badgeSlide .6s ease both'}}>
              <span style={{width:7,height:7,borderRadius:'50%',background:ACC,animation:'pulse 2s infinite',display:'inline-block'}}/>
              <span style={{fontSize:12.5,fontWeight:600,color:ACC,letterSpacing:'.08em',fontFamily:'Space Grotesk'}}>{t.badge}</span>
            </div>
          </div>

          {/* H1 */}
          <div data-rid="h1" style={{...rv('h1',.08),marginBottom:22,maxWidth:1000}}>
            <h1 style={{fontFamily:'Plus Jakarta Sans',fontWeight:800,lineHeight:1.04,letterSpacing:'-.04em',fontSize:isMobile?'clamp(34px,10vw,50px)':'clamp(56px,7vw,100px)'}}>
              <span style={{display:'block',color:TEXT}}>{t.h1a}</span>
              <span style={{display:'block',background:`linear-gradient(90deg,${ACC} 0%,${ACC2} 30%,#fff 55%,${ACC2} 75%,${ACC} 100%)`,backgroundSize:'250% auto',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text',animation:'shimmer 4s linear infinite'}}>{t.h1b}</span>
              <span style={{display:'block',color:TEXT}}>{t.h1c}</span>
            </h1>
          </div>

          {/* Sub */}
          <div data-rid="sub" style={{...rv('sub',.16),marginBottom:38}}>
            <p style={{fontSize:isMobile?16:19,color:MUTED,lineHeight:1.7,maxWidth:580,fontFamily:'Space Grotesk',fontWeight:400}}>{t.sub}</p>
          </div>

          {/* CTAs */}
          <div data-rid="ctas" style={{...rv('ctas',.22),marginBottom:16}}>
            <div className="hero-ctas" style={{display:'flex',gap:14,flexWrap:'wrap',justifyContent:'center'}}>
              <button onClick={go} className="btn-main" style={{padding:isMobile?'14px 28px':'16px 44px',fontSize:isMobile?15:16}}>{t.cta1}</button>
              <button onClick={()=>scrollTo('how')} className="btn-ghost" style={{padding:isMobile?'14px 28px':'16px 36px',fontSize:isMobile?15:16}}>{t.cta2}</button>
            </div>
          </div>

          <div data-rid="trust" style={{...rv('trust',.28),marginBottom:72}}>
            <p style={{fontSize:13,color:MUTED,fontFamily:'Space Grotesk'}}>{t.trust}</p>
          </div>

          {/* ── SHOWCASE CARD (like your video) ── */}
          <div data-rid="showcase" style={{...rv('showcase',.34),width:'100%',maxWidth:900}}>
            <div style={{
              position:'relative',
              borderRadius:isMobile?16:24,
              overflow:'hidden',
              border:`1px solid ${BORDER}`,
              boxShadow:`0 32px 80px rgba(0,0,0,.6), 0 0 0 1px ${ACC}22, 0 0 80px ${ACC}15`,
            }}>
              {/* Mock video/hero background */}
              <div style={{
                width:'100%',
                aspectRatio: isMobile?'16/10':'16/7',
                background:`linear-gradient(135deg, #0d1117 0%, #111827 30%, #1a1040 60%, #0d1117 100%)`,
                position:'relative',overflow:'hidden',
                display:'flex',alignItems:'center',justifyContent:'center',
              }}>
                {/* Grid overlay */}
                <div style={{position:'absolute',inset:0,backgroundImage:`linear-gradient(${ACC}08 1px,transparent 1px),linear-gradient(90deg,${ACC}08 1px,transparent 1px)`,backgroundSize:'50px 50px'}}/>
                {/* Glow center */}
                <div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',width:'60%',height:'60%',background:`radial-gradient(ellipse,${ACC}25,transparent 70%)`}}/>

                {/* Mock dashboard preview inside */}
                <div style={{
                  position:'relative',zIndex:2,
                  width:isMobile?'90%':'75%',
                  background:'rgba(13,13,22,.9)',
                  borderRadius:14,border:`1px solid ${BORDER}`,
                  padding:isMobile?'12px':'20px',
                  backdropFilter:'blur(16px)',
                  boxShadow:`0 24px 60px rgba(0,0,0,.5), inset 0 1px 0 rgba(255,255,255,.05)`,
                }}>
                  {/* Mock top bar */}
                  <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:isMobile?10:16}}>
                    {['#ff5f57','#ffbd2e','#28c840'].map((c,i)=>(
                      <div key={i} style={{width:10,height:10,borderRadius:'50%',background:c}}/>
                    ))}
                    <div style={{flex:1,height:8,background:'rgba(255,255,255,.06)',borderRadius:4,marginLeft:8}}/>
                    <div style={{width:60,height:8,background:`${ACC}33`,borderRadius:4}}/>
                  </div>
                  {/* Mock clip grid */}
                  <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:isMobile?8:10}}>
                    {[9.8,9.5,9.2].map((score,i)=>(
                      <div key={i} style={{
                        background:'rgba(255,255,255,.04)',
                        borderRadius:10,border:`1px solid ${BORDER}`,
                        padding:isMobile?'8px':'12px',
                        display:'flex',flexDirection:'column',gap:6,
                      }}>
                        <div style={{
                          width:'100%',aspectRatio:'9/16',maxHeight:isMobile?60:90,
                          background:`linear-gradient(135deg,${ACC}22,${ACC2}15)`,
                          borderRadius:7,display:'flex',alignItems:'center',justifyContent:'center',
                          fontSize:isMobile?14:18,
                        }}>▶</div>
                        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                          <span style={{fontSize:isMobile?9:11,color:MUTED,fontFamily:'Space Grotesk'}}>Clip {i+1}</span>
                          <span style={{fontSize:isMobile?9:11,fontWeight:700,color:'#22c55e',fontFamily:'Plus Jakarta Sans'}}>{score}</span>
                        </div>
                        <div style={{height:3,background:'rgba(255,255,255,.08)',borderRadius:2}}>
                          <div style={{width:`${score*10}%`,height:'100%',background:`linear-gradient(90deg,${ACC},${ACC2})`,borderRadius:2}}/>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Callout tags — like your video */}
                {!isMobile&&<>
                  <div className="callout-tag" style={{position:'absolute',top:'14%',left:'8%',animationDelay:'.4s',background:'rgba(13,13,22,.92)',border:`1px solid ${ACC}55`,borderRadius:100,padding:'7px 16px',display:'flex',alignItems:'center',gap:8,backdropFilter:'blur(12px)',boxShadow:`0 8px 32px rgba(0,0,0,.4)`}}>
                    <span style={{width:6,height:6,borderRadius:'50%',background:'#22c55e',boxShadow:'0 0 8px #22c55e',display:'inline-block'}}/>
                    <span style={{fontSize:12,fontWeight:600,color:TEXT,fontFamily:'Plus Jakarta Sans'}}>AI detects viral moments</span>
                  </div>
                  <div className="callout-tag" style={{position:'absolute',top:'14%',right:'8%',animationDelay:'.6s',background:'rgba(13,13,22,.92)',border:`1px solid ${ACC}55`,borderRadius:100,padding:'7px 16px',display:'flex',alignItems:'center',gap:8,backdropFilter:'blur(12px)',boxShadow:`0 8px 32px rgba(0,0,0,.4)`}}>
                    <span style={{width:6,height:6,borderRadius:'50%',background:ACC,boxShadow:`0 0 8px ${ACC}`,display:'inline-block'}}/>
                    <span style={{fontSize:12,fontWeight:600,color:TEXT,fontFamily:'Plus Jakarta Sans'}}>Auto subtitles 50+ langs</span>
                  </div>
                  <div className="callout-tag" style={{position:'absolute',bottom:'14%',left:'8%',animationDelay:'.8s',background:'rgba(13,13,22,.92)',border:`1px solid ${ACC}55`,borderRadius:100,padding:'7px 16px',display:'flex',alignItems:'center',gap:8,backdropFilter:'blur(12px)',boxShadow:`0 8px 32px rgba(0,0,0,.4)`}}>
                    <span style={{width:6,height:6,borderRadius:'50%',background:'#f59e0b',boxShadow:'0 0 8px #f59e0b',display:'inline-block'}}/>
                    <span style={{fontSize:12,fontWeight:600,color:TEXT,fontFamily:'Plus Jakarta Sans'}}>9:16 ready to post</span>
                  </div>
                  <div className="callout-tag" style={{position:'absolute',bottom:'14%',right:'8%',animationDelay:'1s',background:'rgba(13,13,22,.92)',border:`1px solid ${ACC}55`,borderRadius:100,padding:'7px 16px',display:'flex',alignItems:'center',gap:8,backdropFilter:'blur(12px)',boxShadow:`0 8px 32px rgba(0,0,0,.4)`}}>
                    <span style={{width:6,height:6,borderRadius:'50%',background:ACC2,boxShadow:`0 0 8px ${ACC2}`,display:'inline-block'}}/>
                    <span style={{fontSize:12,fontWeight:600,color:TEXT,fontFamily:'Plus Jakarta Sans'}}>Viral score on every clip</span>
                  </div>
                </>}
              </div>

              {/* Bottom bar like your video */}
              <div style={{
                background:'rgba(10,10,18,.96)',
                borderTop:`1px solid ${BORDER}`,
                padding:isMobile?'14px 16px':'20px 28px',
                display:'flex',flexWrap:'wrap',gap:isMobile?12:0,
                justifyContent:'space-between',alignItems:'center',
              }}>
                {t.stats.map((s,i)=>(
                  <div key={i} style={{textAlign:isMobile?'left':'center',flex:isMobile?'0 0 calc(50% - 6px)':1,borderRight:!isMobile&&i<3?`1px solid ${BORDER}`:'none',padding:isMobile?0:'0 20px'}}>
                    <div style={{fontFamily:'Plus Jakarta Sans',fontSize:isMobile?24:32,fontWeight:800,color:ACC,letterSpacing:'-1px',textShadow:`0 0 24px ${ACC}66`}}>{s.v}</div>
                    <div style={{fontSize:12,color:MUTED,fontFamily:'Space Grotesk',marginTop:2}}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ══ HOW IT WORKS ══ */}
        <section id="how" style={{padding:sectionPad}}>
          <div style={{maxWidth:1040,margin:'0 auto'}}>
            <div data-rid="how-h" style={{...rv('how-h'),textAlign:'center',marginBottom:64}}>
              <div style={{fontSize:11,fontWeight:700,color:ACC,letterSpacing:'.2em',marginBottom:14,fontFamily:'Space Grotesk'}}>{t.howBadge}</div>
              <h2 style={{fontFamily:'Plus Jakarta Sans',fontSize:isMobile?28:50,fontWeight:800,letterSpacing:'-.03em',color:TEXT,marginBottom:12}}>
                {t.howH.split('4 Steps')[0]}<span style={{color:ACC}}>4 Steps</span>
              </h2>
              <p style={{color:MUTED,fontSize:16,fontFamily:'Space Grotesk'}}>{t.howS}</p>
            </div>
            <div className="grid-4" style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:16}}>
              {t.steps.map((s,i)=>(
                <div key={i} data-rid={`step${i}`} style={{...rv(`step${i}`,i*.1)}}>
                  <div className="step-card" style={{padding:'28px 22px',background:SURF,border:`1px solid ${BORDER}`,borderRadius:18,height:'100%'}}>
                    <div className="step-num" style={{display:'inline-flex',alignItems:'center',justifyContent:'center',width:48,height:48,borderRadius:14,fontFamily:'Plus Jakarta Sans',fontSize:13,fontWeight:800,color:ACC,marginBottom:18}}>{s.n}</div>
                    <div style={{fontFamily:'Plus Jakarta Sans',fontSize:16,fontWeight:700,color:TEXT,marginBottom:8}}>{s.t}</div>
                    <div style={{fontSize:13.5,color:MUTED,lineHeight:1.65,fontFamily:'Space Grotesk'}}>{s.d}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ FEATURES — big icons like your screenshot ══ */}
        <section id="features" style={{padding:sectionPad,background:'rgba(15,15,30,.5)',position:'relative',overflow:'hidden'}}>
          <div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',width:'50vw',height:'50vw',borderRadius:'50%',background:`radial-gradient(circle,${ACC}08,transparent 65%)`,pointerEvents:'none'}}/>
          <div style={{maxWidth:1040,margin:'0 auto',position:'relative'}}>
            <div data-rid="feat-h" style={{...rv('feat-h'),textAlign:'center',marginBottom:64}}>
              <div style={{fontSize:11,fontWeight:700,color:ACC,letterSpacing:'.2em',marginBottom:14,fontFamily:'Space Grotesk'}}>{t.featBadge}</div>
              <h2 style={{fontFamily:'Plus Jakarta Sans',fontSize:isMobile?28:50,fontWeight:800,letterSpacing:'-.03em',color:TEXT}}>
                {t.featH.includes('Go Viral')
                  ? <>{t.featH.split('Go Viral')[0]}<span style={{color:ACC}}>Go Viral</span></>
                  : t.featH}
              </h2>
            </div>
            <div className="grid-3" style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:18}}>
              {t.feats.map((f,i)=>(
                <div key={i} data-rid={`feat${i}`} style={{...rv(`feat${i}`,i*.08)}}>
                  <div className="feat-card" style={{
                    padding:'30px',
                    background:SURF,
                    border:`1px solid ${BORDER}`,
                    borderRadius:20,height:'100%',
                  }}>
                    {/* Big icon like your screenshot */}
                    <div className="feat-icon-box" style={{
                      width:72,height:72,borderRadius:18,
                      background:`linear-gradient(135deg,${ACC}30,${ACC2}18)`,
                      border:`1px solid ${ACC}35`,
                      display:'flex',alignItems:'center',justifyContent:'center',
                      fontSize:34,marginBottom:22,
                      boxShadow:`0 8px 32px ${ACC}20`,
                    }}>{f.i}</div>
                    <div style={{fontFamily:'Plus Jakarta Sans',fontSize:18,fontWeight:700,color:TEXT,marginBottom:10}}>{f.t}</div>
                    <div style={{fontSize:14.5,color:MUTED,lineHeight:1.65,fontFamily:'Space Grotesk'}}>{f.d}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ PRICING ══ */}
        <section id="pricing" style={{padding:sectionPad}}>
          <div style={{maxWidth:1040,margin:'0 auto'}}>
            <div data-rid="price-h" style={{...rv('price-h'),textAlign:'center',marginBottom:48}}>
              <div style={{fontSize:11,fontWeight:700,color:ACC,letterSpacing:'.2em',marginBottom:14,fontFamily:'Space Grotesk'}}>{t.priceBadge}</div>
              <h2 style={{fontFamily:'Plus Jakarta Sans',fontSize:isMobile?28:50,fontWeight:800,letterSpacing:'-.03em',color:TEXT,marginBottom:28}}>{t.priceH}</h2>
              <div style={{display:'inline-flex',background:'rgba(15,15,30,.9)',borderRadius:14,padding:4,border:`1px solid ${BORDER}`}}>
                {['monthly','yearly'].map(b=>(
                  <button key={b} onClick={()=>setBilling(b)} style={{
                    padding:'9px 22px',borderRadius:11,
                    background:billing===b?`linear-gradient(135deg,${ACC},${ACC2})`:'transparent',
                    color:billing===b?'#fff':MUTED,fontWeight:billing===b?700:400,
                    fontSize:14,border:'none',cursor:'pointer',transition:'all .25s',
                    fontFamily:'Plus Jakarta Sans',
                    boxShadow:billing===b?`0 4px 20px ${ACC}44`:'none',
                  }}>{b==='monthly'?t.monthly:t.yearly}</button>
                ))}
              </div>
            </div>
            <div className="grid-3" style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:20}}>
              {t.plans.map((p,i)=>(
                <div key={i} data-rid={`plan${i}`} style={{...rv(`plan${i}`,i*.12)}}>
                  <div className="price-card" style={{
                    padding:'36px 28px',
                    background:p.hot?`linear-gradient(135deg,rgba(124,90,246,.22),rgba(192,132,252,.12))`:SURF,
                    border:`2px solid ${p.hot?ACC:BORDER}`,
                    borderRadius:22,position:'relative',
                    boxShadow:p.hot?`0 20px 60px ${ACC}33,0 0 0 1px ${ACC}22`:'none',
                  }}>
                    {p.hot&&<div style={{position:'absolute',top:-15,left:'50%',transform:'translateX(-50%)',background:`linear-gradient(135deg,${ACC},${ACC2})`,color:'#fff',borderRadius:100,padding:'5px 18px',fontSize:11,fontWeight:800,whiteSpace:'nowrap',letterSpacing:'.05em',boxShadow:`0 4px 20px ${ACC}66`,fontFamily:'Plus Jakarta Sans'}}>✦ BEST VALUE</div>}
                    <div style={{fontSize:11,fontWeight:700,color:ACC,letterSpacing:'.12em',marginBottom:8,fontFamily:'Space Grotesk'}}>{p.n.toUpperCase()}</div>
                    <div style={{display:'flex',alignItems:'baseline',gap:4,marginBottom:6}}>
                      <span style={{fontFamily:'Plus Jakarta Sans',fontSize:54,fontWeight:800,color:TEXT,letterSpacing:'-2px',lineHeight:1,textShadow:p.hot?`0 0 40px ${ACC}44`:'none'}}>{prices[billing][i]}</span>
                      <span style={{fontSize:14,color:MUTED,fontFamily:'Space Grotesk'}}>/mo</span>
                    </div>
                    <div style={{fontSize:13.5,color:MUTED,marginBottom:28,fontFamily:'Space Grotesk'}}>{p.d}</div>
                    <button onClick={go} className={p.hot?'btn-main':'btn-ghost'} style={{width:'100%',padding:'13px',fontSize:14.5,marginBottom:24,borderRadius:12,fontFamily:'Plus Jakarta Sans'}}>Get Started</button>
                    <div style={{display:'flex',flexDirection:'column',gap:12}}>
                      {p.f.map((f,j)=>(
                        <div key={j} style={{display:'flex',alignItems:'center',gap:10,fontSize:14}}>
                          <div style={{width:22,height:22,borderRadius:'50%',background:`linear-gradient(135deg,${ACC}33,${ACC2}22)`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                            <span style={{color:ACC,fontSize:12,fontWeight:700}}>✓</span>
                          </div>
                          <span style={{color:MUTED,fontFamily:'Space Grotesk'}}>{f}</span>
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
        <section id="faq" style={{padding:sectionPad,background:'rgba(15,15,30,.4)'}}>
          <div style={{maxWidth:720,margin:'0 auto'}}>
            <div data-rid="faq-h" style={{...rv('faq-h'),textAlign:'center',marginBottom:48}}>
              <div style={{fontSize:11,fontWeight:700,color:ACC,letterSpacing:'.2em',marginBottom:14,fontFamily:'Space Grotesk'}}>{t.faqBadge}</div>
              <h2 style={{fontFamily:'Plus Jakarta Sans',fontSize:isMobile?28:42,fontWeight:800,letterSpacing:'-.03em',color:TEXT}}>{t.faqH}</h2>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:12}}>
              {t.faqs.map((f,i)=>(
                <div key={i} data-rid={`faq${i}`} style={{...rv(`faq${i}`,i*.07)}}>
                  <div className="faq-row" style={{background:SURF,borderRadius:16,overflow:'hidden',cursor:'pointer'}} onClick={()=>setOpenFaq(openFaq===i?null:i)}>
                    <div style={{padding:'20px 24px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                      <span style={{fontFamily:'Plus Jakarta Sans',fontWeight:600,fontSize:isMobile?14:15.5,color:TEXT,paddingRight:16}}>{f.q}</span>
                      <div style={{width:34,height:34,borderRadius:'50%',background:openFaq===i?`linear-gradient(135deg,${ACC},${ACC2})`:`${ACC}18`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,transition:'all .3s',boxShadow:openFaq===i?`0 4px 16px ${ACC}55`:'none'}}>
                        <span style={{color:openFaq===i?'#fff':ACC,fontSize:20,fontWeight:300,transform:openFaq===i?'rotate(45deg)':'rotate(0)',transition:'transform .3s',display:'inline-block',lineHeight:1}}>+</span>
                      </div>
                    </div>
                    {openFaq===i&&<div style={{padding:'0 24px 20px 24px',fontSize:14.5,color:MUTED,lineHeight:1.75,fontFamily:'Space Grotesk',borderTop:`1px solid ${BORDER}`,paddingTop:16,marginTop:0}}>{f.a}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ FINAL CTA ══ */}
        <section style={{padding:isMobile?'100px 24px':'160px 48px',textAlign:'center',position:'relative',overflow:'hidden'}}>
          <div style={{position:'absolute',inset:0,background:`radial-gradient(ellipse at center,${ACC}22,transparent 65%)`,pointerEvents:'none'}}/>
          {!isMobile&&<>
            <div style={{position:'absolute',top:'20%',left:'18%',width:8,height:8,borderRadius:'50%',background:ACC,boxShadow:`0 0 20px ${ACC}`,animation:'floatB 4s ease-in-out infinite'}}/>
            <div style={{position:'absolute',top:'65%',right:'15%',width:6,height:6,borderRadius:'50%',background:ACC2,boxShadow:`0 0 14px ${ACC2}`,animation:'floatB 5s ease-in-out infinite 1.2s'}}/>
            <div style={{position:'absolute',bottom:'25%',left:'22%',width:10,height:10,borderRadius:'50%',background:ACC,boxShadow:`0 0 24px ${ACC}`,animation:'floatB 3.5s ease-in-out infinite .6s'}}/>
          </>}
          <div data-rid="cta-final" style={{...rv('cta-final'),position:'relative',maxWidth:700,margin:'0 auto'}}>
            <h2 style={{fontFamily:'Plus Jakarta Sans',fontWeight:800,fontSize:isMobile?34:64,letterSpacing:'-.04em',color:TEXT,marginBottom:20,lineHeight:1.06}}>{t.ctaH}</h2>
            <p style={{color:MUTED,fontSize:isMobile?16:19,marginBottom:48,fontFamily:'Space Grotesk',lineHeight:1.7,maxWidth:520,margin:'0 auto 48px'}}>{t.ctaS}</p>
            <button onClick={go} className="btn-main" style={{padding:isMobile?'16px 36px':'20px 56px',fontSize:isMobile?16:18}}>{t.ctaBtn}</button>
          </div>
        </section>

        {/* ══ FOOTER ══ */}
        <footer style={{padding:isMobile?'28px 20px':'32px 48px',borderTop:`1px solid ${BORDER}`,display:'flex',flexDirection:isMobile?'column':'row',justifyContent:'space-between',alignItems:'center',gap:16,textAlign:isMobile?'center':'left',background:'rgba(10,10,18,.9)',backdropFilter:'blur(24px)'}}>
          <div style={{display:'flex',alignItems:'center',gap:10}}>
            <div style={{width:32,height:32,borderRadius:10,background:`linear-gradient(135deg,${ACC},${ACC2})`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,fontWeight:800,color:'#fff'}}>C</div>
            <span style={{fontFamily:'Plus Jakarta Sans',fontWeight:800,fontSize:16,color:TEXT}}>ClipGen<span style={{color:ACC}}>.AI</span></span>
          </div>
          <div style={{display:'flex',gap:24,flexWrap:'wrap',justifyContent:'center'}}>
            {t.nav.map((l,i)=>(
              <button key={i} onClick={()=>scrollTo(['features','how','pricing','faq'][i])} style={{color:MUTED,fontSize:14,background:'none',border:'none',cursor:'pointer',fontFamily:'Space Grotesk',transition:'color .2s'}} onMouseEnter={e=>e.currentTarget.style.color=ACC} onMouseLeave={e=>e.currentTarget.style.color=MUTED}>{l}</button>
            ))}
          </div>
          <span style={{color:MUTED,fontSize:13,fontFamily:'Space Grotesk'}}>© 2026 ClipGen.AI</span>
        </footer>
      </div>
    </div>
  )
}

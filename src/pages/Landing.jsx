import { useEffect, useRef, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

/* ── PALETTE ─────────────────────────────────────── */
const C = {
  bg:      '#020308',
  bgAlt:   '#040812',
  navy:    '#060d1f',
  blue:    '#0a84ff',
  cyan:    '#00d4ff',
  purple:  '#7b2fff',
  pink:    '#ff2d78',
  gold:    '#ffd60a',
  text:    '#e8f4ff',
  muted:   '#4a6080',
  glass:   'rgba(10,30,60,0.55)',
  glassB:  'rgba(0,212,255,0.08)',
}

/* ── FONTS ───────────────────────────────────────── */
const FONT_DISPLAY = "'Orbitron','Exo 2',monospace"
const FONT_BODY    = "'Rajdhani','Share Tech Mono',sans-serif"
const FONT_MONO    = "'Share Tech Mono','Courier New',monospace"

/* ── LOADING SEQUENCE ───────────────────────────── */
const BOOT_LINES = [
  { t: 0,    text: 'CLIPGEN.AI OS v2077.06.03' },
  { t: 400,  text: 'INITIALIZING NEURAL CORE...' },
  { t: 900,  text: 'CONNECTING TO GLOBAL NETWORK...' },
  { t: 1500, text: 'LOADING VIRAL DETECTION ENGINE...' },
  { t: 2100, text: 'AUTHENTICATING USER CREDENTIALS...' },
  { t: 2600, text: 'CALIBRATING AI ASSISTANT NOVA...' },
  { t: 3200, text: '████████████████████ 100%' },
  { t: 3600, text: '✓ ACCESS GRANTED — WELCOME TO CLIPGEN.AI' },
]

/* ── DATA ────────────────────────────────────────── */
const DISTRICTS = [
  {
    id: 'hero',
    code: 'DST-01',
    name: 'NEXUS HUB',
    subtitle: 'Command Center',
    icon: '◈',
    color: C.cyan,
  },
  {
    id: 'features',
    code: 'DST-02',
    name: 'INTELLIGENCE',
    subtitle: 'AI Engine District',
    icon: '⬡',
    color: C.blue,
  },
  {
    id: 'how',
    code: 'DST-03',
    name: 'DATAFLOW',
    subtitle: 'Process Architecture',
    icon: '⟁',
    color: C.purple,
  },
  {
    id: 'pricing',
    code: 'DST-04',
    name: 'LAUNCH PAD',
    subtitle: 'Deployment Zone',
    icon: '▲',
    color: C.gold,
  },
]

const FEATURES = [
  { icon: '◉', label: 'VIRAL SCORING', desc: 'Neural analysis scores every clip 0–100 on hook strength, emotion peaks, and shareability vectors.', color: C.cyan, stat: '9.8 avg' },
  { icon: '⟨⟩', label: 'WHISPER AI', desc: 'OpenAI Whisper transcribes speech in 50+ languages with millisecond-accurate timestamps.', color: C.blue, stat: '50+ langs' },
  { icon: '◑', label: 'AUTO 9:16', desc: 'FFmpeg pipeline reformats to TikTok, Reels and Shorts with intelligent crop and padding.', color: C.purple, stat: '1080×1920' },
  { icon: '⬡', label: 'GPT-4 ANALYSIS', desc: 'GPT-4o-mini finds the 5–8 highest-potential moments from any long-form content.', color: C.pink, stat: 'GPT-4o' },
  { icon: '◈', label: '1-CLICK PUBLISH', desc: 'Push clips directly to TikTok, Instagram Reels, and YouTube Shorts simultaneously.', color: C.gold, stat: '3 platforms' },
  { icon: '▲', label: 'INSTANT CLIPS', desc: 'Full pipeline runs in 3–8 minutes. Upload → viral clips, no editing skills required.', color: C.cyan, stat: '<8 min' },
]

const STEPS = [
  { n: '01', label: 'UPLOAD', desc: 'Drop any MP4/MOV/AVI up to 500MB or paste a URL. Secure Cloudinary storage.' },
  { n: '02', label: 'TRANSCRIBE', desc: 'OpenAI Whisper extracts speech with segment-level timestamps in 50+ languages.' },
  { n: '03', label: 'ANALYZE', desc: 'GPT-4o-mini identifies viral moments — hooks, emotion peaks, quotable facts.' },
  { n: '04', label: 'CUT & PUBLISH', desc: 'FFmpeg cuts clips, reformats to 9:16. Push to all platforms in one click.' },
]

const PLANS = [
  { name: 'STARTER', price: '€29', period: '/mo', features: ['10 videos/month', 'Auto Whisper subtitles', '9:16 reformat', '5 clips per video', 'Email support'], hot: false, color: C.blue },
  { name: 'PRO', price: '€59', period: '/mo', features: ['50 videos/month', '50+ languages', 'Direct publishing', '10 clips per video', 'Priority queue', 'API access'], hot: true, color: C.cyan },
  { name: 'AGENCY', price: '€99', period: '/mo', features: ['Unlimited videos', 'White-label dashboard', 'Team workspace', 'Custom branding', 'Dedicated support', 'Webhook integrations'], hot: false, color: C.purple },
]

const NOVA_MESSAGES = {
  hero:     'Welcome to ClipGen.AI. I am NOVA — your AI content strategist. Upload any long video and I will extract the viral moments automatically.',
  features: 'Powered by OpenAI Whisper and GPT-4o. Our neural engine analyzes every second of your content for maximum viral potential.',
  how:      'The full pipeline takes 3–8 minutes. No editing skills required — just upload and let the AI work.',
  pricing:  'Start free. The Pro plan gives you 50 videos per month with direct publishing to all major platforms.',
}

/* ── CURSOR COMPONENT ───────────────────────────── */
function HoloCursor() {
  const outerRef = useRef(null)
  const innerRef = useRef(null)
  const pos = useRef({ x: 0, y: 0 })
  const outer = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const move = (e) => {
      pos.current = { x: e.clientX, y: e.clientY }
      if (innerRef.current) {
        innerRef.current.style.transform = `translate(${e.clientX - 4}px, ${e.clientY - 4}px)`
      }
    }
    window.addEventListener('mousemove', move)

    let raf
    const lerp = (a, b, t) => a + (b - a) * t
    const animate = () => {
      outer.current.x = lerp(outer.current.x, pos.current.x, 0.12)
      outer.current.y = lerp(outer.current.y, pos.current.y, 0.12)
      if (outerRef.current) {
        outerRef.current.style.transform = `translate(${outer.current.x - 20}px, ${outer.current.y - 20}px)`
      }
      raf = requestAnimationFrame(animate)
    }
    animate()
    return () => { window.removeEventListener('mousemove', move); cancelAnimationFrame(raf) }
  }, [])

  return (
    <>
      <div ref={outerRef} style={{
        position: 'fixed', top: 0, left: 0, zIndex: 9999, pointerEvents: 'none',
        width: 40, height: 40, borderRadius: '50%',
        border: `1px solid ${C.cyan}88`,
        boxShadow: `0 0 12px ${C.cyan}44`,
        willChange: 'transform',
      }} />
      <div ref={innerRef} style={{
        position: 'fixed', top: 0, left: 0, zIndex: 9999, pointerEvents: 'none',
        width: 8, height: 8, borderRadius: '50%',
        background: C.cyan,
        boxShadow: `0 0 8px ${C.cyan}`,
        willChange: 'transform',
      }} />
    </>
  )
}

/* ── PARTICLE CANVAS ─────────────────────────────── */
function NeuralCanvas() {
  const ref = useRef(null)
  useEffect(() => {
    const c = ref.current; if (!c) return
    const ctx = c.getContext('2d')
    const resize = () => { c.width = window.innerWidth; c.height = window.innerHeight }
    resize()
    window.addEventListener('resize', resize)

    const N = 120
    const pts = Array.from({ length: N }, () => ({
      x:  Math.random() * window.innerWidth,
      y:  Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r:  Math.random() * 1.5 + 0.5,
      ph: Math.random() * Math.PI * 2,
      color: Math.random() > 0.5 ? C.cyan : C.blue,
    }))

    let raf
    const draw = () => {
      ctx.clearRect(0, 0, c.width, c.height)
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.ph += 0.012
        if (p.x < 0) p.x = c.width; if (p.x > c.width) p.x = 0
        if (p.y < 0) p.y = c.height; if (p.y > c.height) p.y = 0
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        const alpha = 0.3 + 0.25 * Math.sin(p.ph)
        ctx.fillStyle = p.color + Math.round(alpha * 255).toString(16).padStart(2, '0')
        ctx.fill()
      })
      for (let i = 0; i < N; i++) {
        for (let j = i + 1; j < N; j++) {
          const d = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y)
          if (d < 100) {
            ctx.beginPath()
            ctx.moveTo(pts[i].x, pts[i].y)
            ctx.lineTo(pts[j].x, pts[j].y)
            ctx.strokeStyle = C.cyan + Math.round(0.08 * (1 - d / 100) * 255).toString(16).padStart(2, '0')
            ctx.lineWidth = 0.4
            ctx.stroke()
          }
        }
      }
      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [])
  return <canvas ref={ref} style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }} />
}

/* ── GRID OVERLAY ────────────────────────────────── */
function GridOverlay() {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
      backgroundImage: `
        linear-gradient(rgba(0,212,255,0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0,212,255,0.03) 1px, transparent 1px)
      `,
      backgroundSize: '60px 60px',
    }} />
  )
}

/* ── HUD CORNERS ─────────────────────────────────── */
function HudCorner({ pos }) {
  const size = 20
  const [style, borderStyle] = {
    tl: [{ top: 0, left: 0 }, { borderTop: `2px solid ${C.cyan}`, borderLeft: `2px solid ${C.cyan}` }],
    tr: [{ top: 0, right: 0 }, { borderTop: `2px solid ${C.cyan}`, borderRight: `2px solid ${C.cyan}` }],
    bl: [{ bottom: 0, left: 0 }, { borderBottom: `2px solid ${C.cyan}`, borderLeft: `2px solid ${C.cyan}` }],
    br: [{ bottom: 0, right: 0 }, { borderBottom: `2px solid ${C.cyan}`, borderRight: `2px solid ${C.cyan}` }],
  }[pos]
  return (
    <div style={{
      position: 'absolute', width: size, height: size,
      ...style, ...borderStyle,
    }} />
  )
}

function GlassCard({ children, accent, style: s = {} }) {
  const [hovered, setHovered] = useState(false)
  const col = accent || C.cyan
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        background: C.glass,
        backdropFilter: 'blur(20px)',
        border: `1px solid ${col}${hovered ? '55' : '22'}`,
        borderRadius: 4,
        padding: '2px',
        transition: 'border-color 0.3s, box-shadow 0.3s',
        boxShadow: hovered ? `0 0 32px ${col}22, inset 0 0 32px ${col}08` : 'none',
        ...s,
      }}
    >
      <HudCorner pos="tl" />
      <HudCorner pos="tr" />
      <HudCorner pos="bl" />
      <HudCorner pos="br" />
      <div style={{ padding: '24px' }}>{children}</div>
    </div>
  )
}

/* ── NOVA AI ASSISTANT ───────────────────────────── */
function NovaPanel({ message, visible }) {
  const [displayed, setDisplayed] = useState('')
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    setDisplayed('')
    setIdx(0)
  }, [message])

  useEffect(() => {
    if (idx < message.length) {
      const t = setTimeout(() => {
        setDisplayed(prev => prev + message[idx])
        setIdx(i => i + 1)
      }, 18)
      return () => clearTimeout(t)
    }
  }, [idx, message])

  return (
    <div style={{
      position: 'fixed', bottom: 32, right: 32, zIndex: 200,
      width: 320,
      transform: `translateY(${visible ? 0 : 100}px)`,
      opacity: visible ? 1 : 0,
      transition: 'transform 0.5s cubic-bezier(0.22,1,0.36,1), opacity 0.5s',
    }}>
      <GlassCard accent={C.cyan}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          {/* NOVA orb */}
          <div style={{
            flexShrink: 0, width: 40, height: 40, borderRadius: '50%',
            background: `radial-gradient(circle at 35% 35%, ${C.cyan}, ${C.blue}, ${C.purple})`,
            boxShadow: `0 0 20px ${C.cyan}66`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            animation: 'novaPulse 2s ease-in-out infinite',
          }}>
            <span style={{ fontSize: 16, color: '#fff' }}>◈</span>
          </div>
          <div>
            <div style={{ fontFamily: FONT_MONO, fontSize: 9, color: C.cyan, letterSpacing: 2, marginBottom: 6 }}>
              NOVA — AI ASSISTANT
            </div>
            <div style={{ fontFamily: FONT_BODY, fontSize: 13, color: C.text, lineHeight: 1.6 }}>
              {displayed}
              <span style={{ animation: 'blink 1s step-end infinite', color: C.cyan }}>▋</span>
            </div>
          </div>
        </div>
      </GlassCard>
      <style>{`
        @keyframes novaPulse { 0%,100%{box-shadow:0 0 20px ${C.cyan}66} 50%{box-shadow:0 0 40px ${C.cyan}99} }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
      `}</style>
    </div>
  )
}

/* ── HOLOGRAPHIC ORB ─────────────────────────────── */
function HoloOrb() {
  const [t, setT] = useState(0)
  useEffect(() => {
    let raf
    const animate = () => { setT(prev => prev + 0.01); raf = requestAnimationFrame(animate) }
    animate()
    return () => cancelAnimationFrame(raf)
  }, [])

  const rings = [300, 220, 140]
  return (
    <div style={{ position: 'relative', width: 300, height: 300, margin: '0 auto' }}>
      {rings.map((size, i) => (
        <div key={i} style={{
          position: 'absolute',
          top: '50%', left: '50%',
          width: size, height: size,
          marginLeft: -size / 2, marginTop: -size / 2,
          borderRadius: '50%',
          border: `1px solid ${[C.cyan, C.blue, C.purple][i]}44`,
          transform: `rotateX(75deg) rotate(${t * (i % 2 === 0 ? 1 : -1) * 30}deg)`,
          boxShadow: `0 0 ${20 - i * 4}px ${[C.cyan, C.blue, C.purple][i]}22`,
          transition: 'transform 0.016s linear',
        }}>
          <div style={{
            position: 'absolute', top: -4, left: '50%', marginLeft: -4,
            width: 8, height: 8, borderRadius: '50%',
            background: [C.cyan, C.blue, C.purple][i],
            boxShadow: `0 0 12px ${[C.cyan, C.blue, C.purple][i]}`,
          }} />
        </div>
      ))}
      {/* Core */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%,-50%)',
        width: 80, height: 80, borderRadius: '50%',
        background: `radial-gradient(circle at 35% 35%, ${C.cyan}cc, ${C.blue}99, ${C.purple}66, transparent)`,
        boxShadow: `0 0 60px ${C.cyan}66, 0 0 120px ${C.blue}33`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 32, color: '#fff',
      }}>◈</div>
    </div>
  )
}

/* ── STAT COUNTER ────────────────────────────────── */
function StatTicker({ value, label, color }) {
  const [cur, setCur] = useState(0)
  const num = parseFloat(value)
  const suffix = value.replace(/[0-9.]/g, '')
  useEffect(() => {
    let frame = 0
    const total = 60
    const tick = () => {
      frame++
      setCur(Math.round((frame / total) * num * 10) / 10)
      if (frame < total) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [])
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontFamily: FONT_DISPLAY, fontSize: 36, fontWeight: 900, color, textShadow: `0 0 20px ${color}88`, letterSpacing: '-1px' }}>
        {cur}{suffix}
      </div>
      <div style={{ fontFamily: FONT_MONO, fontSize: 10, color: C.muted, letterSpacing: 2, marginTop: 4 }}>{label}</div>
    </div>
  )
}

/* ── SCAN LINE BUTTON ────────────────────────────── */
function HudButton({ children, onClick, accent, big, outline }) {
  const [hovered, setHovered] = useState(false)
  const [scanned, setScanned] = useState(false)
  const col = accent || C.cyan

  const handleEnter = () => { setHovered(true); setScanned(true); setTimeout(() => setScanned(false), 400) }
  return (
    <button
      onClick={onClick}
      onMouseEnter={handleEnter}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative', overflow: 'hidden',
        fontFamily: FONT_DISPLAY, fontWeight: 700,
        fontSize: big ? 14 : 12,
        letterSpacing: 3,
        padding: big ? '18px 48px' : '12px 28px',
        borderRadius: 2,
        background: outline ? 'transparent' : (hovered ? col : `${col}22`),
        color: outline ? col : (hovered ? '#000' : col),
        border: `1px solid ${col}${hovered ? 'ff' : '66'}`,
        cursor: 'pointer',
        transition: 'all 0.25s',
        boxShadow: hovered ? `0 0 30px ${col}66, inset 0 0 30px ${col}22` : 'none',
      }}
    >
      {scanned && (
        <div style={{
          position: 'absolute', left: 0, right: 0, height: 2,
          background: `linear-gradient(90deg, transparent, ${col}, transparent)`,
          animation: 'scanLine 0.4s ease-out forwards',
        }} />
      )}
      <style>{`@keyframes scanLine { from{top:0} to{top:100%} }`}</style>
      {children}
    </button>
  )
}

/* ── DISTRICT NAV ────────────────────────────────── */
function DistrictNav({ active }) {
  const scroll = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  return (
    <div style={{
      position: 'fixed', left: 24, top: '50%', transform: 'translateY(-50%)',
      zIndex: 150, display: 'flex', flexDirection: 'column', gap: 8,
    }}>
      {DISTRICTS.map(d => (
        <div
          key={d.id}
          onClick={() => scroll(d.id)}
          title={`${d.code} ${d.name}`}
          style={{
            display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer',
            opacity: active === d.id ? 1 : 0.3,
            transition: 'opacity 0.3s',
          }}
        >
          <div style={{
            width: active === d.id ? 24 : 6,
            height: 2,
            background: d.color,
            transition: 'width 0.3s',
            boxShadow: active === d.id ? `0 0 8px ${d.color}` : 'none',
          }} />
          {active === d.id && (
            <span style={{ fontFamily: FONT_MONO, fontSize: 9, color: d.color, letterSpacing: 1, whiteSpace: 'nowrap' }}>
              {d.code}
            </span>
          )}
        </div>
      ))}
    </div>
  )
}

/* ── MAIN COMPONENT ──────────────────────────────── */
export default function Landing() {
  const navigate = useNavigate()
  const [booting, setBooting] = useState(true)
  const [bootLines, setBootLines] = useState([])
  const [bootDone, setBootDone] = useState(false)
  const [activeDistrict, setActiveDistrict] = useState('hero')
  const [novaMsg, setNovaMsg] = useState(NOVA_MESSAGES.hero)
  const [novaVisible, setNovaVisible] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [navScrolled, setNavScrolled] = useState(false)
  const sectionRefs = useRef({})

  /* Boot sequence */
  useEffect(() => {
    BOOT_LINES.forEach(({ t, text }) => {
      setTimeout(() => {
        setBootLines(prev => [...prev, text])
        if (text.includes('ACCESS GRANTED')) {
          setTimeout(() => { setBootDone(true); setTimeout(() => { setBooting(false); setNovaVisible(true) }, 600) }, 500)
        }
      }, t)
    })
  }, [])

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768)
    const onScroll = () => {
      setNavScrolled(window.scrollY > 60)
      // District tracking
      const sections = ['hero', 'features', 'how', 'pricing']
      for (const id of sections.reverse()) {
        const el = document.getElementById(id)
        if (el && window.scrollY >= el.offsetTop - 200) {
          setActiveDistrict(id)
          setNovaMsg(NOVA_MESSAGES[id])
          break
        }
      }
    }
    window.addEventListener('resize', onResize)
    window.addEventListener('scroll', onScroll)
    onResize()
    return () => { window.removeEventListener('resize', onResize); window.removeEventListener('scroll', onScroll) }
  }, [])

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  const go = () => navigate('/signup')

  /* ── BOOT SCREEN ── */
  if (booting) {
    return (
      <div style={{
        position: 'fixed', inset: 0, background: C.bg, zIndex: 9999,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        fontFamily: FONT_MONO, padding: 32,
        opacity: bootDone ? 0 : 1, transition: 'opacity 0.6s',
      }}>
        <NeuralCanvas />
        <GridOverlay />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 640, width: '100%' }}>
          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ fontFamily: FONT_DISPLAY, fontSize: isMobile ? 28 : 42, fontWeight: 900, color: C.cyan, letterSpacing: 8, textShadow: `0 0 40px ${C.cyan}` }}>
              CLIPGEN.AI
            </div>
            <div style={{ fontSize: 10, color: C.muted, letterSpacing: 4, marginTop: 4 }}>VIRAL CONTENT INTELLIGENCE SYSTEM</div>
          </div>

          {/* Terminal */}
          <div style={{
            border: `1px solid ${C.cyan}33`,
            background: 'rgba(0,212,255,0.04)',
            padding: 24, borderRadius: 4,
            minHeight: 200,
          }}>
            <div style={{ fontSize: 10, color: C.cyan, letterSpacing: 2, marginBottom: 16 }}>
              SYSTEM TERMINAL — {new Date().toISOString()}
            </div>
            {bootLines.map((line, i) => (
              <div key={i} style={{
                fontSize: 12, lineHeight: 2,
                color: line.includes('✓') ? '#00ff88' : line.includes('100%') ? C.gold : C.muted,
                fontWeight: line.includes('✓') ? 700 : 400,
              }}>
                {line.includes('✓') ? '' : '> '}{line}
              </div>
            ))}
            {bootLines.length < BOOT_LINES.length && (
              <span style={{ color: C.cyan, animation: 'blink 1s step-end infinite' }}>_</span>
            )}
          </div>

          {/* Progress bar */}
          <div style={{ marginTop: 24, height: 2, background: `${C.cyan}22`, borderRadius: 1 }}>
            <div style={{
              height: '100%',
              background: `linear-gradient(90deg, ${C.cyan}, ${C.blue})`,
              borderRadius: 1,
              width: `${(bootLines.length / BOOT_LINES.length) * 100}%`,
              transition: 'width 0.4s ease',
              boxShadow: `0 0 8px ${C.cyan}`,
            }} />
          </div>
        </div>
        <style>{`@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}`}</style>
      </div>
    )
  }

  /* ── MAIN SITE ── */
  return (
    <div style={{ fontFamily: FONT_BODY, background: C.bg, color: C.text, overflowX: 'hidden', cursor: 'none' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@300;400;500;600;700&family=Share+Tech+Mono&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        html{scroll-behavior:smooth;}
        ::selection{background:${C.cyan}44;color:#fff;}
        ::-webkit-scrollbar{width:2px;}
        ::-webkit-scrollbar-thumb{background:${C.cyan}44;}
        @keyframes floatY{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
        @keyframes glitch{
          0%,90%,100%{transform:none;clip-path:none}
          91%{transform:translate(-2px,1px);clip-path:polygon(0 20%,100% 20%,100% 40%,0 40%)}
          93%{transform:translate(2px,-1px);clip-path:polygon(0 60%,100% 60%,100% 80%,0 80%)}
          95%{transform:none}
        }
        @keyframes scanH{0%{transform:translateY(-100%)}100%{transform:translateY(100vh)}}
        @keyframes dataStream{0%{opacity:0;transform:translateY(-20px)}100%{opacity:1;transform:translateY(0)}}
        @keyframes borderPulse{0%,100%{border-color:${C.cyan}22}50%{border-color:${C.cyan}66}}
        @media(max-width:767px){.hide-mob{display:none!important;}.dist-nav{display:none!important;}.nova-panel{display:none!important;}}
      `}</style>

      <NeuralCanvas />
      <GridOverlay />
      {!isMobile && <HoloCursor />}

      {/* Scanline effect */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1,
        height: 2, background: `linear-gradient(90deg, transparent, ${C.cyan}22, transparent)`,
        animation: 'scanH 8s linear infinite', pointerEvents: 'none',
      }} />

      {/* Top ambient glow */}
      <div style={{
        position: 'fixed', top: -100, left: '50%', transform: 'translateX(-50%)',
        width: '70vw', height: 300,
        background: `radial-gradient(ellipse, ${C.blue}18, transparent 70%)`,
        pointerEvents: 'none', zIndex: 0,
      }} />

      {/* DISTRICT NAV */}
      <div className="dist-nav">
        <DistrictNav active={activeDistrict} />
      </div>

      {/* NOVA */}
      <div className="nova-panel">
        <NovaPanel message={novaMsg} visible={novaVisible} />
      </div>

      {/* ═══════════ NAV ═══════════ */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200, height: 64,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: isMobile ? '0 20px' : '0 60px',
        background: navScrolled ? 'rgba(2,3,8,0.92)' : 'transparent',
        backdropFilter: navScrolled ? 'blur(20px)' : 'none',
        borderBottom: `1px solid ${navScrolled ? C.cyan + '22' : 'transparent'}`,
        transition: 'all 0.4s',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div style={{
            width: 36, height: 36, borderRadius: 4,
            background: `linear-gradient(135deg, ${C.cyan}, ${C.blue}, ${C.purple})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, boxShadow: `0 0 16px ${C.cyan}66`,
            fontFamily: FONT_DISPLAY, color: '#000', fontWeight: 900,
          }}>C</div>
          <div>
            <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 900, fontSize: 14, letterSpacing: 3, color: C.text }}>
              CLIPGEN<span style={{ color: C.cyan }}>.AI</span>
            </div>
            <div style={{ fontFamily: FONT_MONO, fontSize: 8, color: C.muted, letterSpacing: 2 }}>VIRAL INTELLIGENCE OS</div>
          </div>
        </div>

        {/* Nav links */}
        <div className="hide-mob" style={{ display: 'flex', gap: 36, alignItems: 'center' }}>
          {[['FEATURES', 'features'], ['PROCESS', 'how'], ['PRICING', 'pricing']].map(([label, id]) => (
            <button key={id} onClick={() => scrollTo(id)} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontFamily: FONT_DISPLAY, fontSize: 10, letterSpacing: 3,
              color: C.muted, transition: 'color 0.2s',
            }}
            onMouseEnter={e => e.target.style.color = C.cyan}
            onMouseLeave={e => e.target.style.color = C.muted}
            >{label}</button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <button onClick={() => navigate('/signin')} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontFamily: FONT_DISPLAY, fontSize: 10, letterSpacing: 3,
            color: C.muted,
          }}
          onMouseEnter={e => e.target.style.color = C.text}
          onMouseLeave={e => e.target.style.color = C.muted}
          >LOGIN</button>
          <HudButton onClick={go} accent={C.cyan}>LAUNCH →</HudButton>
        </div>
      </nav>

      {/* ═══════════ HERO ═══════════ */}
      <section id="hero" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: isMobile ? '100px 24px 60px' : '100px 60px 80px', position: 'relative', zIndex: 1 }}>

        {/* District header */}
        <div style={{ fontFamily: FONT_MONO, fontSize: 10, color: C.cyan, letterSpacing: 4, marginBottom: 32, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 30, height: 1, background: C.cyan }} />
          DST-01 / NEXUS HUB / COMMAND CENTER
          <div style={{ width: 30, height: 1, background: C.cyan }} />
        </div>

        {/* Orb */}
        <div style={{ marginBottom: 48, animation: 'floatY 4s ease-in-out infinite' }}>
          <HoloOrb />
        </div>

        {/* Headline with glitch */}
        <div style={{ marginBottom: 16 }}>
          <div style={{
            fontFamily: FONT_DISPLAY, fontWeight: 900,
            fontSize: isMobile ? 'clamp(32px,9vw,48px)' : 'clamp(48px,6vw,88px)',
            lineHeight: 1, letterSpacing: '-2px', color: C.text,
            animation: 'glitch 6s ease-in-out infinite',
          }}>
            TURN ANY VIDEO
          </div>
          <div style={{
            fontFamily: FONT_DISPLAY, fontWeight: 900,
            fontSize: isMobile ? 'clamp(32px,9vw,48px)' : 'clamp(48px,6vw,88px)',
            lineHeight: 1, letterSpacing: '-2px',
            background: `linear-gradient(90deg, ${C.cyan}, ${C.blue}, ${C.purple}, ${C.cyan})`,
            backgroundSize: '300% auto',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            animation: 'gradShift 4s linear infinite',
          }}>
            INTO VIRAL CLIPS
          </div>
          <style>{`@keyframes gradShift{0%{background-position:0}100%{background-position:300%}}`}</style>
        </div>

        {/* Sub */}
        <p style={{ fontFamily: FONT_BODY, fontSize: isMobile ? 15 : 18, color: C.muted, lineHeight: 1.8, maxWidth: 560, marginBottom: 40, marginTop: 16 }}>
          OpenAI Whisper + GPT-4o + FFmpeg. Upload any long-form video — AI extracts the viral moments and delivers 9:16 clips in minutes.
        </p>

        {/* CTAs */}
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 16 }}>
          <HudButton onClick={go} accent={C.cyan} big>⚡ INITIALIZE FREE TRIAL</HudButton>
          <HudButton onClick={() => scrollTo('how')} accent={C.muted} outline>▶ VIEW PROCESS</HudButton>
        </div>
        <div style={{ fontFamily: FONT_MONO, fontSize: 10, color: C.muted, letterSpacing: 2 }}>
          NO CARD REQUIRED · 3 DAYS FREE · CANCEL ANYTIME
        </div>

        {/* Stats HUD */}
        <div style={{
          marginTop: 80, display: 'grid',
          gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(4,1fr)',
          gap: 1, maxWidth: 800, width: '100%',
          border: `1px solid ${C.cyan}22`,
          background: `${C.cyan}08`,
        }}>
          {[['2.4M+', 'CLIPS GENERATED', C.cyan], ['96', 'AVG VIRAL SCORE', C.blue], ['10×', 'TIME SAVED', C.purple], ['152K', 'CREATORS', C.gold]].map(([v, l, col], i) => (
            <div key={i} style={{
              padding: isMobile ? '20px 12px' : '28px 16px',
              borderRight: i < 3 ? `1px solid ${C.cyan}22` : 'none',
              borderBottom: isMobile && i < 2 ? `1px solid ${C.cyan}22` : 'none',
              textAlign: 'center',
            }}>
              <StatTicker value={v} label={l} color={col} />
            </div>
          ))}
        </div>

        {/* Scroll indicator */}
        <div style={{ marginTop: 64, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, opacity: 0.4 }}>
          <div style={{ fontFamily: FONT_MONO, fontSize: 9, letterSpacing: 3, color: C.muted }}>SCROLL TO EXPLORE</div>
          <div style={{ width: 1, height: 40, background: `linear-gradient(${C.cyan}, transparent)` }} />
        </div>
      </section>

      {/* ═══════════ FEATURES ═══════════ */}
      <section id="features" style={{ padding: isMobile ? '80px 24px' : '120px 60px', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          {/* District header */}
          <div style={{ marginBottom: 64, display: 'flex', alignItems: 'center', gap: 20 }}>
            <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, transparent, ${C.blue}44)` }} />
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: FONT_MONO, fontSize: 10, color: C.blue, letterSpacing: 4, marginBottom: 8 }}>DST-02 / INTELLIGENCE DISTRICT</div>
              <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 900, fontSize: isMobile ? 28 : 48, letterSpacing: '-1px', color: C.text }}>
                AI <span style={{ color: C.blue }}>CAPABILITIES</span>
              </div>
            </div>
            <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${C.blue}44, transparent)` }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)', gap: 16 }}>
            {FEATURES.map((f, i) => (
              <GlassCard key={i} accent={f.color} style={{ animation: `dataStream 0.5s ease-out ${i * 0.1}s both` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                  <div style={{
                    width: 52, height: 52, borderRadius: 4,
                    border: `1px solid ${f.color}44`,
                    background: `${f.color}12`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 24, color: f.color,
                    boxShadow: `0 0 16px ${f.color}33`,
                  }}>{f.icon}</div>
                  <div style={{ fontFamily: FONT_MONO, fontSize: 11, color: f.color, fontWeight: 700, letterSpacing: 1 }}>
                    {f.stat}
                  </div>
                </div>
                <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 13, letterSpacing: 2, color: C.text, marginBottom: 10 }}>
                  {f.label}
                </div>
                <div style={{ fontFamily: FONT_BODY, fontSize: 14, color: C.muted, lineHeight: 1.7 }}>
                  {f.desc}
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ HOW IT WORKS ═══════════ */}
      <section id="how" style={{ padding: isMobile ? '80px 24px' : '120px 60px', position: 'relative', zIndex: 1, background: `linear-gradient(180deg, transparent, ${C.navy}88, transparent)` }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ marginBottom: 64, textAlign: 'center' }}>
            <div style={{ fontFamily: FONT_MONO, fontSize: 10, color: C.purple, letterSpacing: 4, marginBottom: 8 }}>DST-03 / DATAFLOW ARCHITECTURE</div>
            <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 900, fontSize: isMobile ? 28 : 48, letterSpacing: '-1px', color: C.text }}>
              PIPELINE <span style={{ color: C.purple }}>PROTOCOL</span>
            </div>
          </div>

          {/* Steps with connector lines */}
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(4,1fr)', gap: 0, position: 'relative' }}>
            {/* Connector line */}
            {!isMobile && (
              <div style={{ position: 'absolute', top: 40, left: '12.5%', right: '12.5%', height: 1, background: `linear-gradient(90deg, ${C.purple}00, ${C.purple}66, ${C.cyan}66, ${C.cyan}00)`, zIndex: 0 }} />
            )}
            {STEPS.map((s, i) => (
              <div key={i} style={{ position: 'relative', zIndex: 1, padding: isMobile ? '24px 0' : '0 20px', textAlign: 'center' }}>
                {/* Step number orb */}
                <div style={{
                  width: 80, height: 80, borderRadius: '50%',
                  border: `2px solid ${i < 2 ? C.purple : C.cyan}66`,
                  background: `${i < 2 ? C.purple : C.cyan}12`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 20px',
                  boxShadow: `0 0 24px ${i < 2 ? C.purple : C.cyan}33`,
                  position: 'relative',
                }}>
                  <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 900, fontSize: 20, color: i < 2 ? C.purple : C.cyan }}>
                    {s.n}
                  </div>
                  {/* Pulse ring */}
                  <div style={{
                    position: 'absolute', inset: -8, borderRadius: '50%',
                    border: `1px solid ${i < 2 ? C.purple : C.cyan}22`,
                    animation: `borderPulse 2s ease-in-out ${i * 0.5}s infinite`,
                  }} />
                </div>
                <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 12, letterSpacing: 3, color: C.text, marginBottom: 10 }}>
                  {s.label}
                </div>
                <div style={{ fontFamily: FONT_BODY, fontSize: 13, color: C.muted, lineHeight: 1.7 }}>
                  {s.desc}
                </div>
              </div>
            ))}
          </div>

          {/* Live demo card */}
          <div style={{ marginTop: 60 }}>
            <GlassCard accent={C.cyan}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
                <div>
                  <div style={{ fontFamily: FONT_MONO, fontSize: 9, color: C.cyan, letterSpacing: 3, marginBottom: 6 }}>PROCESSING SIMULATION</div>
                  <div style={{ fontFamily: FONT_DISPLAY, fontSize: 16, color: C.text, fontWeight: 700 }}>Average Processing Time: <span style={{ color: C.cyan }}>4 min 32 sec</span></div>
                  <div style={{ fontFamily: FONT_BODY, fontSize: 13, color: C.muted, marginTop: 4 }}>For a 45-minute podcast episode → 7 viral clips</div>
                </div>
                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                  {[['EXTRACT', C.purple, '20s'], ['TRANSCRIBE', C.blue, '90s'], ['ANALYZE', C.cyan, '45s'], ['CUT', C.gold, '135s']].map(([label, col, time]) => (
                    <div key={label} style={{ textAlign: 'center' }}>
                      <div style={{ fontFamily: FONT_MONO, fontSize: 18, fontWeight: 700, color: col }}>{time}</div>
                      <div style={{ fontFamily: FONT_MONO, fontSize: 9, color: C.muted, letterSpacing: 1 }}>{label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* ═══════════ PRICING ═══════════ */}
      <section id="pricing" style={{ padding: isMobile ? '80px 24px 120px' : '120px 60px 160px', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ marginBottom: 64, textAlign: 'center' }}>
            <div style={{ fontFamily: FONT_MONO, fontSize: 10, color: C.gold, letterSpacing: 4, marginBottom: 8 }}>DST-04 / LAUNCH PAD / DEPLOYMENT ZONE</div>
            <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 900, fontSize: isMobile ? 28 : 48, letterSpacing: '-1px', color: C.text }}>
              SELECT <span style={{ color: C.gold }}>ACCESS TIER</span>
            </div>
            <div style={{ fontFamily: FONT_BODY, fontSize: 16, color: C.muted, marginTop: 12 }}>
              All plans include OpenAI Whisper + GPT-4o + FFmpeg pipeline
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)', gap: 16, alignItems: 'start' }}>
            {PLANS.map((p, i) => (
              <div key={i} style={{ position: 'relative' }}>
                {p.hot && (
                  <div style={{
                    position: 'absolute', top: -16, left: '50%', transform: 'translateX(-50%)',
                    fontFamily: FONT_MONO, fontSize: 9, letterSpacing: 3,
                    background: `linear-gradient(90deg, ${C.cyan}, ${C.blue})`,
                    color: '#000', padding: '4px 16px', borderRadius: 2,
                    whiteSpace: 'nowrap', fontWeight: 700,
                    boxShadow: `0 0 16px ${C.cyan}66`,
                    zIndex: 2,
                  }}>◈ RECOMMENDED TIER</div>
                )}
                <GlassCard accent={p.color} style={{
                  boxShadow: p.hot ? `0 0 60px ${p.color}22` : 'none',
                  transform: p.hot ? 'scale(1.03)' : 'none',
                }}>
                  <div style={{ fontFamily: FONT_MONO, fontSize: 9, color: p.color, letterSpacing: 3, marginBottom: 12 }}>
                    TIER — {p.name}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 6 }}>
                    <span style={{ fontFamily: FONT_DISPLAY, fontSize: 52, fontWeight: 900, color: C.text, letterSpacing: '-2px', textShadow: p.hot ? `0 0 30px ${p.color}66` : 'none' }}>
                      {p.price}
                    </span>
                    <span style={{ fontFamily: FONT_MONO, fontSize: 12, color: C.muted }}>{p.period}</span>
                  </div>
                  <div style={{ marginBottom: 24 }}>
                    <HudButton onClick={go} accent={p.color} big={p.hot}>
                      {p.hot ? '⚡ DEPLOY NOW' : 'INITIALIZE'}
                    </HudButton>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {p.features.map((f, j) => (
                      <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 16, height: 16, borderRadius: 2, background: `${p.color}22`, border: `1px solid ${p.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <span style={{ color: p.color, fontSize: 10 }}>✓</span>
                        </div>
                        <span style={{ fontFamily: FONT_BODY, fontSize: 13, color: C.muted }}>{f}</span>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ FINAL CTA ═══════════ */}
      <section style={{ padding: isMobile ? '80px 24px' : '120px 60px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at center, ${C.cyan}12, transparent 60%)`, pointerEvents: 'none' }} />
        <div style={{ position: 'relative', maxWidth: 700, margin: '0 auto' }}>
          <div style={{ fontFamily: FONT_MONO, fontSize: 10, color: C.cyan, letterSpacing: 4, marginBottom: 16 }}>SYSTEM READY — AWAITING AUTHORIZATION</div>
          <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 900, fontSize: isMobile ? 36 : 64, letterSpacing: '-2px', color: C.text, marginBottom: 12, textShadow: `0 0 60px ${C.cyan}44` }}>
            GO VIRAL.<br /><span style={{ color: C.cyan }}>GO NOW.</span>
          </div>
          <p style={{ fontFamily: FONT_BODY, fontSize: 17, color: C.muted, marginBottom: 40, lineHeight: 1.7 }}>
            Join 152,000 creators. The AI does the work. You collect the views.
          </p>
          <HudButton onClick={go} accent={C.cyan} big>
            ⚡ ACTIVATE FREE TRIAL
          </HudButton>
          <div style={{ marginTop: 16, fontFamily: FONT_MONO, fontSize: 10, color: C.muted, letterSpacing: 2 }}>
            SECURE · NO CARD REQUIRED · CANCEL ANYTIME
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{
        padding: isMobile ? '24px 20px' : '32px 60px',
        borderTop: `1px solid ${C.cyan}15`,
        background: 'rgba(2,3,8,0.95)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexWrap: 'wrap', gap: 16,
        position: 'relative', zIndex: 1,
      }}>
        <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 900, fontSize: 13, letterSpacing: 4, color: C.muted }}>
          CLIPGEN<span style={{ color: C.cyan }}>.AI</span>
        </div>
        <div style={{ fontFamily: FONT_MONO, fontSize: 10, color: C.muted, letterSpacing: 2 }}>
          © 2077 CLIPGEN.AI — ALL RIGHTS RESERVED
        </div>
        <div style={{ display: 'flex', gap: 24 }}>
          {['FEATURES', 'PROCESS', 'PRICING'].map(label => (
            <button key={label} onClick={() => scrollTo(label.toLowerCase())} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontFamily: FONT_MONO, fontSize: 9, letterSpacing: 3, color: C.muted,
            }}
            onMouseEnter={e => e.target.style.color = C.cyan}
            onMouseLeave={e => e.target.style.color = C.muted}
            >{label}</button>
          ))}
        </div>
      </footer>
    </div>
  )
}

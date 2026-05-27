import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../contexts/ThemeContext'
import ThemeToggle from '../components/ThemeToggle'
import { motion, useScroll, useTransform, useSpring, useMotionValue, useAnimationFrame, AnimatePresence } from 'framer-motion'

/* ─────────────────────────── CONSTANTS ─────────────────────────── */
const ACC  = '#7c5af6'
const ACC2 = '#c084fc'
const BG   = '#06060f'
const SURF = '#0d0d1c'
const TEXT = '#f0eeff'
const MUTE = '#5a5a78'

const LANGS = [
  {code:'en',flag:'🇬🇧',label:'English'},
  {code:'lt',flag:'🇱🇹',label:'Lietuvių'},
  {code:'de',flag:'🇩🇪',label:'Deutsch'},
  {code:'fr',flag:'🇫🇷',label:'Français'},
  {code:'es',flag:'🇪🇸',label:'Español'},
  {code:'pl',flag:'🇵🇱',label:'Polski'},
  {code:'ru',flag:'🇷🇺',label:'Русский'},
  {code:'it',flag:'🇮🇹',label:'Italiano'},
  {code:'pt',flag:'🇵🇹',label:'Português'},
  {code:'nl',flag:'🇳🇱',label:'Nederlands'},
]

const FEATURES = [
  {icon:'🎯',title:'Viral Scoring',desc:'Every clip scored 0–100 on hook strength, emotion and shareability.'},
  {icon:'📝',title:'Auto Captions',desc:'AI subtitles in 50+ languages that boost watch-time by 40%.'},
  {icon:'🚀',title:'1-Click Publish',desc:'TikTok, Instagram Reels, YouTube Shorts — all at once.'},
  {icon:'⚡',title:'Smart Detection',desc:'Best 30–90s segments found from hours of content.'},
  {icon:'✍️',title:'Hook Titles',desc:'Scroll-stopping titles generated for every platform.'},
  {icon:'👥',title:'Agency Mode',desc:'Multi-client dashboard with white-label support.'},
]

const STEPS = [
  {n:'01',t:'Upload',d:'Drop any MP4, MOV or AVI up to 500MB.'},
  {n:'02',t:'AI Analyses',d:'Transcription, emotion peaks, viral hooks detected.'},
  {n:'03',t:'Clips Cut',d:'Best moments trimmed, 9:16 formatted, subtitles burned.'},
  {n:'04',t:'Publish',d:'Push directly to TikTok, Reels & Shorts.'},
]

const PLANS = [
  {name:'Starter',price:'€29',desc:'Individual creators',features:['10 videos/month','Auto subtitles','9:16 format','3 social accounts'],hot:false},
  {name:'Pro',price:'€59',desc:'Serious creators',features:['50 videos/month','50+ languages','Direct publishing','Priority processing'],hot:true},
  {name:'Agency',price:'€99',desc:'Teams & agencies',features:['Unlimited videos','White-label','Team workspace','API access'],hot:false},
]

const FAQS = [
  {q:'How does ClipGen.AI work?',a:'Upload a long video — AI transcribes it, finds the most viral moments, cuts clips, adds subtitles and reformats to 9:16 in minutes.'},
  {q:'What formats are supported?',a:'MP4, MOV, AVI and MKV files up to 500MB and 60 minutes.'},
  {q:'Is Lithuanian supported?',a:'Yes — Lithuanian is fully supported for subtitles and the platform interface.'},
  {q:'Can I cancel anytime?',a:'Yes — no fees or long-term commitments.'},
  {q:'How many clips per video?',a:'3 to 10 clips per video depending on your plan, each scored 0–100.'},
]

/* ─────────────────────────── HOOKS ─────────────────────────── */

// Mouse-tracking 3D tilt
function use3DTilt() {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), { stiffness: 400, damping: 30 })
  const rotY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), { stiffness: 400, damping: 30 })
  const onMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    x.set((e.clientX - rect.left) / rect.width - 0.5)
    y.set((e.clientY - rect.top) / rect.height - 0.5)
  }
  const onLeave = () => { x.set(0); y.set(0) }
  return { rotX, rotY, onMove, onLeave }
}

/* ─────────────────────────── SMALL COMPONENTS ─────────────────────────── */

function GlowButton({ children, onClick, big }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05, y: -3 }}
      whileTap={{ scale: 0.97 }}
      style={{
        background: `linear-gradient(135deg, ${ACC}, ${ACC2})`,
        color: '#fff', border: 'none',
        borderRadius: 14,
        padding: big ? '18px 52px' : '13px 30px',
        fontSize: big ? 18 : 15,
        fontWeight: 700, cursor: 'pointer',
        fontFamily: 'inherit',
        boxShadow: `0 8px 40px ${ACC}66`,
        position: 'relative', overflow: 'hidden',
        letterSpacing: '0.01em',
      }}
    >
      <motion.div
        style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,rgba(255,255,255,.2),transparent)', opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      />
      {children}
    </motion.button>
  )
}

function GhostButton({ children, onClick }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.03, y: -2, borderColor: `${ACC}88`, background: `${ACC}15` }}
      whileTap={{ scale: 0.97 }}
      style={{
        background: 'transparent', color: TEXT,
        border: `1px solid rgba(124,90,246,0.25)`,
        borderRadius: 14, padding: '13px 28px',
        fontSize: 15, fontWeight: 500, cursor: 'pointer',
        fontFamily: 'inherit',
        backdropFilter: 'blur(12px)',
      }}
    >
      {children}
    </motion.button>
  )
}

function ParticleCanvas() {
  const ref = useRef(null)
  const raf = useRef(null)
  useEffect(() => {
    const c = ref.current; if (!c) return
    const ctx = c.getContext('2d')
    const resize = () => { c.width = window.innerWidth; c.height = window.innerHeight }
    resize()
    window.addEventListener('resize', resize)
    const N = 80
    const pts = Array.from({ length: N }, () => ({
      x: Math.random() * c.width, y: Math.random() * c.height,
      vx: (Math.random() - .5) * .45, vy: (Math.random() - .5) * .45,
      r: Math.random() * 1.8 + .4, ph: Math.random() * Math.PI * 2,
    }))
    const draw = () => {
      ctx.clearRect(0, 0, c.width, c.height)
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.ph += .018
        if (p.x < 0) p.x = c.width; if (p.x > c.width) p.x = 0
        if (p.y < 0) p.y = c.height; if (p.y > c.height) p.y = 0
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(124,90,246,${.35 + .3 * Math.sin(p.ph)})`; ctx.fill()
      })
      for (let i = 0; i < N; i++) for (let j = i + 1; j < N; j++) {
        const d = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y)
        if (d < 110) {
          ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y)
          ctx.strokeStyle = `rgba(124,90,246,${.12 * (1 - d / 110)})`; ctx.lineWidth = .5; ctx.stroke()
        }
      }
      raf.current = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(raf.current); window.removeEventListener('resize', resize) }
  }, [])
  return <canvas ref={ref} style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }} />
}

function OrbitalRings() {
  return (
    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', pointerEvents: 'none', zIndex: 0 }}>
      {[620, 420, 240].map((size, i) => (
        <motion.div
          key={i}
          animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
          transition={{ duration: 25 - i * 5, repeat: Infinity, ease: 'linear' }}
          style={{
            position: 'absolute',
            width: size, height: size,
            top: -size / 2, left: -size / 2,
            borderRadius: '50%',
            border: `1px solid rgba(124,90,246,${0.08 + i * 0.02})`,
          }}
        >
          <div style={{
            position: 'absolute',
            width: 10 - i * 2, height: 10 - i * 2,
            borderRadius: '50%',
            background: i === 0 ? ACC : ACC2,
            top: -5 + i, left: '50%', marginLeft: -5 + i,
            boxShadow: `0 0 ${20 - i * 4}px ${i === 0 ? ACC : ACC2}`,
          }} />
        </motion.div>
      ))}
    </div>
  )
}

function FloatingOrbs() {
  const orbs = [
    { top: '15%', left: '5%', size: 180, color: ACC, delay: 0, dur: 7 },
    { top: '20%', right: '4%', size: 130, color: ACC2, delay: 1.5, dur: 5 },
    { bottom: '22%', left: '7%', size: 90, color: ACC, delay: 0.8, dur: 6 },
    { bottom: '25%', right: '5%', size: 150, color: ACC2, delay: 2, dur: 8 },
  ]
  return <>
    {orbs.map((o, i) => (
      <motion.div
        key={i}
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: o.dur, delay: o.delay, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute', ...o,
          width: o.size, height: o.size,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${o.color}22, transparent 70%)`,
          pointerEvents: 'none',
        }}
      />
    ))}
  </>
}

// Animated counter
function Counter({ target }) {
  const [val, setVal] = useState(0)
  const ref = useRef(null)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      const num = parseFloat(target.replace(/[^0-9.]/g, ''))
      const suffix = target.replace(/[0-9.]/g, '')
      let start = 0
      const step = () => {
        start += num / 60
        if (start >= num) { setVal(target); return }
        setVal(Math.round(start) + suffix)
        requestAnimationFrame(step)
      }
      requestAnimationFrame(step)
      obs.disconnect()
    }, { threshold: 0.5 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [target])
  return <span ref={ref}>{val || '0'}</span>
}

// Feature card with 3D tilt
function FeatureCard({ icon, title, desc, index }) {
  const { rotX, rotY, onMove, onLeave } = use3DTilt()
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 0.68, 0, 1.2] }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{
        rotateX: rotX, rotateY: rotY,
        transformStyle: 'preserve-3d',
        perspective: 1000,
      }}
    >
      <motion.div
        whileHover={{ y: -10, boxShadow: `0 30px 80px ${ACC}30` }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        style={{
          background: SURF,
          border: `1px solid rgba(124,90,246,0.15)`,
          borderRadius: 20, padding: 28,
          position: 'relative', overflow: 'hidden',
          cursor: 'default',
        }}
      >
        {/* Hover glow overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          style={{
            position: 'absolute', inset: -1, borderRadius: 21,
            background: `linear-gradient(135deg, ${ACC}44, ${ACC2}22, transparent 60%)`,
            zIndex: 0,
          }}
        />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <motion.div
            whileHover={{ scale: 1.15, rotate: 8 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            style={{
              width: 72, height: 72, borderRadius: 18,
              background: `linear-gradient(135deg, ${ACC}30, ${ACC2}18)`,
              border: `1px solid ${ACC}35`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 34, marginBottom: 22,
              boxShadow: `0 8px 32px ${ACC}22`,
            }}
          >{icon}</motion.div>
          <div style={{ fontSize: 17, fontWeight: 700, color: TEXT, marginBottom: 8 }}>{title}</div>
          <div style={{ fontSize: 14, color: MUTE, lineHeight: 1.65 }}>{desc}</div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// Showcase / Hero card
function ShowcaseCard() {
  const callouts = [
    { text: 'AI detects viral moments', color: '#22c55e', pos: { top: '10%', left: '3%' }, delay: 0.5 },
    { text: 'Auto subtitles 50+ langs', color: ACC, pos: { top: '10%', right: '3%' }, delay: 0.7 },
    { text: '9:16 ready to post', color: '#f59e0b', pos: { bottom: '10%', left: '3%' }, delay: 0.9 },
    { text: 'Viral score every clip', color: ACC2, pos: { bottom: '10%', right: '3%' }, delay: 1.1 },
  ]
  const clips = [
    { score: 9.8, w: '98%' }, { score: 9.5, w: '95%' }, { score: 9.2, w: '92%' }
  ]
  return (
    <motion.div
      initial={{ opacity: 0, y: 60, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 1, delay: 0.4, ease: [0.22, 0.68, 0, 1.1] }}
      style={{ width: '100%', maxWidth: 880, margin: '0 auto' }}
    >
      <div style={{
        borderRadius: 24, overflow: 'hidden',
        border: `1px solid rgba(124,90,246,0.25)`,
        boxShadow: `0 40px 120px rgba(0,0,0,.8), 0 0 0 1px ${ACC}22, 0 0 120px ${ACC}12`,
      }}>
        {/* Card header – cinematic */}
        <div style={{
          background: `linear-gradient(135deg, #0d1117, #111827, #1a1040, #0a0a18)`,
          position: 'relative', padding: '40px 24px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          minHeight: 280, overflow: 'hidden',
        }}>
          {/* Grid overlay */}
          <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(${ACC}07 1px,transparent 1px),linear-gradient(90deg,${ACC}07 1px,transparent 1px)`, backgroundSize: '48px 48px' }} />
          {/* Center glow */}
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '60%', height: '70%', background: `radial-gradient(ellipse, ${ACC}25, transparent 70%)`, pointerEvents: 'none' }} />

          {/* Mock dashboard */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            style={{
              position: 'relative', zIndex: 2, width: '70%',
              background: 'rgba(8,8,18,.92)',
              borderRadius: 16, border: `1px solid ${ACC}25`,
              padding: 18,
              boxShadow: `0 24px 80px rgba(0,0,0,.6), inset 0 1px 0 rgba(255,255,255,.05)`,
            }}
          >
            {/* Titlebar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 14 }}>
              {['#ff5f57','#ffbd2e','#28c840'].map((c, i) => (
                <div key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />
              ))}
              <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,.05)', borderRadius: 3, marginLeft: 8 }} />
              <div style={{ width: 52, height: 6, background: `${ACC}33`, borderRadius: 3 }} />
            </div>
            {/* Clips grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
              {clips.map((clip, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 + i * 0.15, type: 'spring', stiffness: 300 }}
                  whileHover={{ scale: 1.05, y: -3 }}
                  style={{
                    background: 'rgba(255,255,255,.04)',
                    borderRadius: 10, border: `1px solid ${ACC}18`,
                    padding: 10, cursor: 'pointer',
                  }}
                >
                  <div style={{ aspectRatio: '9/16', maxHeight: 82, background: `linear-gradient(135deg,${ACC}${28+i*4},${ACC2}${18+i*4})`, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, marginBottom: 8 }}>▶</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <span style={{ fontSize: 10, color: MUTE }}>Clip {i + 1}</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#22c55e' }}>{clip.score}</span>
                  </div>
                  <div style={{ height: 3, background: 'rgba(255,255,255,.08)', borderRadius: 2 }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: clip.w }}
                      transition={{ delay: 1.2 + i * 0.1, duration: 0.8, ease: 'easeOut' }}
                      style={{ height: '100%', background: `linear-gradient(90deg,${ACC},${ACC2})`, borderRadius: 2 }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Callout tags */}
          {callouts.map((tag, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: i < 2 ? -16 : 16, scale: 0.85 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ delay: tag.delay, type: 'spring', stiffness: 300, damping: 20 }}
              whileHover={{ scale: 1.06, y: -2 }}
              style={{
                position: 'absolute', ...tag.pos,
                background: 'rgba(8,8,18,.92)',
                border: `1px solid ${tag.color}55`,
                borderRadius: 100, padding: '6px 14px',
                display: 'flex', alignItems: 'center', gap: 7,
                backdropFilter: 'blur(12px)',
                boxShadow: `0 8px 32px rgba(0,0,0,.4), 0 0 16px ${tag.color}22`,
                zIndex: 3, cursor: 'default',
              }}
            >
              <motion.span
                animate={{ scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{ width: 6, height: 6, borderRadius: '50%', background: tag.color, boxShadow: `0 0 8px ${tag.color}`, display: 'inline-block' }}
              />
              <span style={{ fontSize: 11, fontWeight: 600, color: TEXT, whiteSpace: 'nowrap' }}>{tag.text}</span>
            </motion.div>
          ))}
        </div>

        {/* Stats bar */}
        <div style={{ background: 'rgba(6,6,15,.97)', borderTop: `1px solid ${ACC}15`, display: 'grid', gridTemplateColumns: 'repeat(4,1fr)' }}>
          {[['2.4M+','Clips Generated'],['96','Avg Viral Score'],['10×','Faster'],['152K','Creators']].map(([v, l], i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              style={{
                padding: '22px 16px', textAlign: 'center',
                borderRight: i < 3 ? `1px solid ${ACC}12` : 'none',
              }}
            >
              <div style={{ fontSize: 28, fontWeight: 800, color: ACC, letterSpacing: '-1px', textShadow: `0 0 24px ${ACC}66` }}>
                <Counter target={v} />
              </div>
              <div style={{ fontSize: 11, color: MUTE, marginTop: 3 }}>{l}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

/* ─────────────────────────── MAIN COMPONENT ─────────────────────────── */
export default function Landing() {
  const navigate = useNavigate()
  const { isDark } = useTheme()
  const [lang, setLang] = useState('en')
  const [billing, setBilling] = useState('monthly')
  const [openFaq, setOpenFaq] = useState(null)
  const [isMobile, setIsMobile] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrollY, setScrollY] = useState(0)

  const { scrollYProgress } = useScroll()
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -80])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0])

  useEffect(() => {
    const onR = () => setIsMobile(window.innerWidth < 768)
    const onS = () => setScrollY(window.scrollY)
    window.addEventListener('resize', onR)
    window.addEventListener('scroll', onS)
    onR()
    return () => { window.removeEventListener('resize', onR); window.removeEventListener('scroll', onS) }
  }, [])

  const go = () => navigate('/signup')
  const scrollTo = id => { document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); setMenuOpen(false) }
  const prices = { monthly: ['€29', '€59', '€99'], yearly: ['€19', '€39', '€69'] }

  const NAV_ITEMS = [
    ['Features', 'features'], ['How It Works', 'how'],
    ['Pricing', 'pricing'], ['FAQ', 'faq']
  ]

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans','Space Grotesk',system-ui,sans-serif", background: BG, color: TEXT, overflowX: 'hidden', minHeight: '100vh' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Space+Grotesk:wght@300;400;500;600&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        html{scroll-behavior:smooth;}
        ::selection{background:rgba(124,90,246,.35);}
        ::-webkit-scrollbar{width:3px;}
        ::-webkit-scrollbar-thumb{background:${ACC}55;border-radius:2px;}
        @media(max-width:767px){.hide-mob{display:none!important;}.grid3{grid-template-columns:1fr!important;}.grid4{grid-template-columns:repeat(2,1fr)!important;}.heroCtas{flex-direction:column!important;}}
        @media(min-width:768px){.show-mob{display:none!important;}}
      `}</style>

      <ParticleCanvas />

      {/* Top glow */}
      <div style={{ position: 'fixed', top: '-20%', left: '50%', transform: 'translateX(-50%)', width: '80vw', height: '60vh', background: `radial-gradient(ellipse,rgba(124,90,246,.14),transparent 65%)`, pointerEvents: 'none', zIndex: 0 }} />

      {/* ── NAV ── */}
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200, height: 66,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: isMobile ? '0 18px' : '0 48px',
          background: scrollY > 40 ? 'rgba(6,6,15,.92)' : 'transparent',
          backdropFilter: scrollY > 40 ? 'blur(24px)' : 'none',
          borderBottom: `1px solid ${scrollY > 40 ? 'rgba(124,90,246,.18)' : 'transparent'}`,
          transition: 'background .35s, border-color .35s, backdrop-filter .35s',
        }}
      >
        <motion.div
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}
        >
          <motion.div
            animate={{ boxShadow: [`0 4px 20px ${ACC}55`, `0 4px 40px ${ACC}99`, `0 4px 20px ${ACC}55`] }}
            transition={{ duration: 2.5, repeat: Infinity }}
            style={{ width: 40, height: 40, borderRadius: 12, background: `linear-gradient(135deg,${ACC},${ACC2})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 800, color: '#fff' }}
          >C</motion.div>
          <span style={{ fontWeight: 800, fontSize: 18, letterSpacing: '-.5px', color: TEXT }}>
            ClipGen<span style={{ color: ACC }}>.AI</span>
          </span>
        </motion.div>

        <div className="hide-mob" style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
          {NAV_ITEMS.map(([label, id]) => (
            <motion.button
              key={id}
              onClick={() => scrollTo(id)}
              whileHover={{ color: TEXT, y: -1 }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 500, color: MUTE, fontFamily: 'inherit', position: 'relative' }}
            >
              {label}
              <motion.div
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                style={{ position: 'absolute', bottom: -3, left: 0, right: 0, height: 1, background: ACC, originX: 0 }}
              />
            </motion.button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <select value={lang} onChange={e => setLang(e.target.value)} style={{ padding: '6px 10px', borderRadius: 8, border: `1px solid rgba(124,90,246,.2)`, background: 'rgba(13,13,28,.85)', color: TEXT, fontSize: 12, cursor: 'pointer', outline: 'none', maxWidth: isMobile ? 64 : 'auto' }}>
            {LANGS.slice(0, isMobile ? 4 : 10).map(l => <option key={l.code} value={l.code}>{l.flag} {isMobile ? '' : l.label}</option>)}
          </select>
          <ThemeToggle />
          <div className="hide-mob"><GlowButton onClick={go}>Get Started →</GlowButton></div>
          <motion.button className="show-mob" whileTap={{ scale: 0.9 }} onClick={() => setMenuOpen(!menuOpen)} style={{ background: 'none', border: 'none', color: TEXT, fontSize: 24, cursor: 'pointer' }}>
            {menuOpen ? '✕' : '☰'}
          </motion.button>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{ position: 'fixed', top: 66, left: 0, right: 0, zIndex: 199, background: 'rgba(6,6,15,.97)', backdropFilter: 'blur(24px)', borderBottom: `1px solid rgba(124,90,246,.15)`, padding: '24px', display: 'flex', flexDirection: 'column', gap: 16 }}
          >
            {NAV_ITEMS.map(([label, id], i) => (
              <motion.button key={id} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.07 }} onClick={() => scrollTo(id)} style={{ background: 'none', border: 'none', color: TEXT, fontSize: 18, fontWeight: 600, textAlign: 'left', cursor: 'pointer', padding: '8px 0', fontFamily: 'inherit' }}>
                {label}
              </motion.button>
            ))}
            <div style={{ marginTop: 8 }}><GlowButton onClick={go}>Get Started →</GlowButton></div>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ position: 'relative', zIndex: 1 }}>

        {/* ══ HERO ══ */}
        <motion.section style={{ y: heroY, opacity: heroOpacity }} id="hero">
          <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: isMobile ? '100px 20px 60px' : '100px 24px 60px', position: 'relative', overflow: 'hidden' }}>
            <OrbitalRings />
            <FloatingOrbs />

            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, ease: 'backOut' }}
              style={{ marginBottom: 28 }}
            >
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: `linear-gradient(135deg,${ACC}22,${ACC2}12)`, border: `1px solid ${ACC}44`, borderRadius: 100, padding: '7px 20px' }}>
                <motion.span
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{ width: 7, height: 7, borderRadius: '50%', background: ACC, boxShadow: `0 0 10px ${ACC}`, display: 'inline-block' }}
                />
                <span style={{ fontSize: 12.5, fontWeight: 600, color: ACC, letterSpacing: '.08em' }}>NEXT-GEN AI VIDEO INTELLIGENCE</span>
              </div>
            </motion.div>

            {/* Headline */}
            <div style={{ marginBottom: 22, maxWidth: 1000 }}>
              {['Turn Any Video Into', 'Viral Clips', 'Automatically'].map((line, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 40, rotateX: -15 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ duration: 0.7, delay: 0.1 + i * 0.12, ease: [0.22, 0.68, 0, 1.2] }}
                  style={{ display: 'block' }}
                >
                  {i === 1 ? (
                    <span style={{
                      display: 'block',
                      fontFamily: 'Plus Jakarta Sans', fontWeight: 800, lineHeight: 1.04, letterSpacing: '-.04em',
                      fontSize: isMobile ? 'clamp(36px,10vw,50px)' : 'clamp(56px,7vw,96px)',
                      background: `linear-gradient(90deg,${ACC} 0%,${ACC2} 30%,#fff 55%,${ACC2} 75%,${ACC} 100%)`,
                      backgroundSize: '250% auto',
                      WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      animation: 'shimmer 4s linear infinite',
                    }}>
                      <style>{`@keyframes shimmer{0%{background-position:-250% 0}100%{background-position:250% 0}}`}</style>
                      {line}
                    </span>
                  ) : (
                    <span style={{ display: 'block', color: TEXT, fontFamily: 'Plus Jakarta Sans', fontWeight: 800, lineHeight: 1.04, letterSpacing: '-.04em', fontSize: isMobile ? 'clamp(36px,10vw,50px)' : 'clamp(56px,7vw,96px)' }}>{line}</span>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Sub */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.7 }}
              style={{ fontSize: isMobile ? 16 : 19, color: MUTE, lineHeight: 1.7, maxWidth: 580, marginBottom: 36 }}
            >
              Upload a long video. AI finds the best moments, cuts clips, burns subtitles — TikTok, Reels & Shorts ready in minutes.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.7 }}
              className="heroCtas"
              style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 14 }}
            >
              <GlowButton onClick={go} big>⚡ Start Free Trial →</GlowButton>
              <GhostButton onClick={() => scrollTo('how')}>▶ See How It Works</GhostButton>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              style={{ fontSize: 13, color: `${MUTE}99`, marginBottom: 64 }}
            >
              No card required · 3 days free · Cancel anytime
            </motion.p>

            <ShowcaseCard />
          </section>
        </motion.section>

        {/* ══ HOW IT WORKS ══ */}
        <section id="how" style={{ padding: isMobile ? '80px 20px' : '120px 48px' }}>
          <div style={{ maxWidth: 1000, margin: '0 auto' }}>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              style={{ textAlign: 'center', marginBottom: 64 }}
            >
              <div style={{ fontSize: 11, fontWeight: 700, color: ACC, letterSpacing: '.2em', marginBottom: 14 }}>HOW IT WORKS</div>
              <h2 style={{ fontFamily: 'Plus Jakarta Sans', fontSize: isMobile ? 28 : 48, fontWeight: 800, letterSpacing: '-.03em', color: TEXT, marginBottom: 12 }}>
                Upload to Viral in <span style={{ color: ACC }}>4 Steps</span>
              </h2>
              <p style={{ color: MUTE, fontSize: 16 }}>No editing skills. No timeline. No nonsense.</p>
            </motion.div>
            <div className="grid4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
              {STEPS.map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 50, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.12, type: 'spring', stiffness: 200 }}
                  whileHover={{ y: -8, boxShadow: `0 20px 60px ${ACC}22` }}
                  style={{ background: SURF, border: `1px solid rgba(124,90,246,.15)`, borderRadius: 18, padding: '28px 22px', cursor: 'default' }}
                >
                  <motion.div
                    whileHover={{ background: `linear-gradient(135deg,${ACC},${ACC2})`, color: '#fff', boxShadow: `0 4px 20px ${ACC}55` }}
                    style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 48, height: 48, borderRadius: 14, background: `linear-gradient(135deg,${ACC}28,${ACC2}18)`, border: `1px solid ${ACC}40`, fontSize: 13, fontWeight: 800, color: ACC, marginBottom: 18 }}
                    transition={{ duration: 0.2 }}
                  >{s.n}</motion.div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: TEXT, marginBottom: 8 }}>{s.t}</div>
                  <div style={{ fontSize: 13.5, color: MUTE, lineHeight: 1.65 }}>{s.d}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ FEATURES ══ */}
        <section id="features" style={{ padding: isMobile ? '80px 20px' : '120px 48px', background: 'rgba(13,13,28,.5)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '60vw', height: '60vw', borderRadius: '50%', background: `radial-gradient(circle,${ACC}08,transparent 60%)`, pointerEvents: 'none' }} />
          <div style={{ maxWidth: 1000, margin: '0 auto', position: 'relative' }}>
            <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: 64 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: ACC, letterSpacing: '.2em', marginBottom: 14 }}>FEATURES</div>
              <h2 style={{ fontFamily: 'Plus Jakarta Sans', fontSize: isMobile ? 28 : 48, fontWeight: 800, letterSpacing: '-.03em', color: TEXT }}>
                Built to <span style={{ color: ACC }}>Go Viral</span>
              </h2>
            </motion.div>
            <div className="grid3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 18 }}>
              {FEATURES.map((f, i) => <FeatureCard key={i} {...f} index={i} />)}
            </div>
          </div>
        </section>

        {/* ══ PRICING ══ */}
        <section id="pricing" style={{ padding: isMobile ? '80px 20px' : '120px 48px' }}>
          <div style={{ maxWidth: 1000, margin: '0 auto' }}>
            <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: 48 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: ACC, letterSpacing: '.2em', marginBottom: 14 }}>PRICING</div>
              <h2 style={{ fontFamily: 'Plus Jakarta Sans', fontSize: isMobile ? 28 : 48, fontWeight: 800, letterSpacing: '-.03em', color: TEXT, marginBottom: 28 }}>
                Start Free. <span style={{ color: ACC }}>Scale When Ready.</span>
              </h2>
              <div style={{ display: 'inline-flex', background: 'rgba(13,13,28,.9)', borderRadius: 14, padding: 4, border: `1px solid rgba(124,90,246,.18)` }}>
                {['monthly', 'yearly'].map(b => (
                  <motion.button key={b} onClick={() => setBilling(b)} whileTap={{ scale: 0.97 }} style={{ padding: '9px 22px', borderRadius: 11, background: billing === b ? `linear-gradient(135deg,${ACC},${ACC2})` : 'transparent', color: billing === b ? '#fff' : MUTE, fontWeight: billing === b ? 700 : 400, fontSize: 14, border: 'none', cursor: 'pointer', fontFamily: 'inherit', boxShadow: billing === b ? `0 4px 20px ${ACC}44` : 'none', transition: 'all .25s' }}>
                    {b === 'monthly' ? 'Monthly' : 'Yearly · Save 5 months'}
                  </motion.button>
                ))}
              </div>
            </motion.div>
            <div className="grid3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20, alignItems: 'start' }}>
              {PLANS.map((p, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 60 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12, type: 'spring', stiffness: 200 }}
                  whileHover={{ y: -12, scale: 1.015 }}
                  style={{
                    padding: '36px 28px',
                    background: p.hot ? `linear-gradient(135deg,rgba(124,90,246,.22),rgba(192,132,252,.12))` : SURF,
                    border: `2px solid ${p.hot ? ACC : 'rgba(124,90,246,.18)'}`,
                    borderRadius: 22, position: 'relative',
                    boxShadow: p.hot ? `0 20px 80px ${ACC}33` : 'none',
                  }}
                >
                  {p.hot && (
                    <motion.div
                      animate={{ boxShadow: [`0 4px 20px ${ACC}55`, `0 4px 40px ${ACC}88`, `0 4px 20px ${ACC}55`] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', background: `linear-gradient(135deg,${ACC},${ACC2})`, color: '#fff', borderRadius: 100, padding: '5px 18px', fontSize: 11, fontWeight: 800, whiteSpace: 'nowrap', letterSpacing: '.05em' }}
                    >✦ BEST VALUE</motion.div>
                  )}
                  <div style={{ fontSize: 11, fontWeight: 700, color: ACC, letterSpacing: '.12em', marginBottom: 8 }}>{p.name.toUpperCase()}</div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 6 }}>
                    <span style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 52, fontWeight: 800, color: TEXT, letterSpacing: '-2px', lineHeight: 1, textShadow: p.hot ? `0 0 40px ${ACC}44` : 'none' }}>{prices[billing][i]}</span>
                    <span style={{ fontSize: 14, color: MUTE }}>/mo</span>
                  </div>
                  <div style={{ fontSize: 13.5, color: MUTE, marginBottom: 24 }}>{p.desc}</div>
                  <div style={{ marginBottom: 24 }}>
                    {p.hot ? <GlowButton onClick={go}>Get Started</GlowButton> : <GhostButton onClick={go}>Get Started</GhostButton>}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {p.features.map((f, j) => (
                      <motion.div key={j} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: j * 0.05 }} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14 }}>
                        <div style={{ width: 22, height: 22, borderRadius: '50%', background: `linear-gradient(135deg,${ACC}33,${ACC2}22)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <span style={{ color: ACC, fontSize: 12, fontWeight: 700 }}>✓</span>
                        </div>
                        <span style={{ color: MUTE }}>{f}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ FAQ ══ */}
        <section id="faq" style={{ padding: isMobile ? '80px 20px' : '120px 48px', background: 'rgba(13,13,28,.4)' }}>
          <div style={{ maxWidth: 720, margin: '0 auto' }}>
            <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: 48 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: ACC, letterSpacing: '.2em', marginBottom: 14 }}>FAQ</div>
              <h2 style={{ fontFamily: 'Plus Jakarta Sans', fontSize: isMobile ? 28 : 40, fontWeight: 800, letterSpacing: '-.03em', color: TEXT }}>Common <span style={{ color: ACC }}>Questions</span></h2>
            </motion.div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {FAQS.map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  style={{ background: SURF, border: `1px solid ${openFaq === i ? ACC + '55' : 'rgba(124,90,246,.15)'}`, borderRadius: 16, overflow: 'hidden', transition: 'border-color .2s', cursor: 'pointer' }}
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <div style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 600, fontSize: 15, color: TEXT, paddingRight: 16 }}>{f.q}</span>
                    <motion.div
                      animate={{ rotate: openFaq === i ? 45 : 0, background: openFaq === i ? `linear-gradient(135deg,${ACC},${ACC2})` : `${ACC}18` }}
                      style={{ width: 34, height: 34, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
                    >
                      <span style={{ color: openFaq === i ? '#fff' : ACC, fontSize: 20, fontWeight: 300, lineHeight: 1 }}>+</span>
                    </motion.div>
                  </div>
                  <AnimatePresence>
                    {openFaq === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        style={{ overflow: 'hidden' }}
                      >
                        <div style={{ padding: '0 24px 20px', fontSize: 14.5, color: MUTE, lineHeight: 1.75, borderTop: `1px solid rgba(124,90,246,.12)`, paddingTop: 16 }}>{f.a}</div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ FINAL CTA ══ */}
        <section style={{ padding: isMobile ? '100px 24px' : '160px 48px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at center,${ACC}22,transparent 65%)`, pointerEvents: 'none' }} />
          <motion.div initial={{ opacity: 0, y: 60 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, type: 'spring' }} style={{ position: 'relative', maxWidth: 680, margin: '0 auto' }}>
            <h2 style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: isMobile ? 34 : 62, letterSpacing: '-.04em', color: TEXT, marginBottom: 20, lineHeight: 1.06 }}>
              Ready to <span style={{ color: ACC }}>Go Viral?</span>
            </h2>
            <p style={{ color: MUTE, fontSize: isMobile ? 16 : 19, marginBottom: 48, lineHeight: 1.7, maxWidth: 500, margin: '0 auto 48px' }}>Join thousands of creators turning long videos into viral clips automatically.</p>
            <GlowButton onClick={go} big>⚡ Start Creating Free</GlowButton>
          </motion.div>
        </section>

        {/* ══ FOOTER ══ */}
        <footer style={{ padding: isMobile ? '28px 20px' : '32px 48px', borderTop: `1px solid rgba(124,90,246,.15)`, display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: 'center', gap: 16, textAlign: isMobile ? 'center' : 'left', background: 'rgba(6,6,15,.9)', backdropFilter: 'blur(24px)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 10, background: `linear-gradient(135deg,${ACC},${ACC2})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 800, color: '#fff' }}>C</div>
            <span style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: 16, color: TEXT }}>ClipGen<span style={{ color: ACC }}>.AI</span></span>
          </div>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
            {NAV_ITEMS.map(([label, id]) => (
              <motion.button key={id} onClick={() => scrollTo(id)} whileHover={{ color: ACC }} style={{ color: MUTE, fontSize: 14, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', transition: 'color .2s' }}>{label}</motion.button>
            ))}
          </div>
          <span style={{ color: MUTE, fontSize: 13 }}>© 2026 ClipGen.AI</span>
        </footer>
      </div>
    </div>
  )
}

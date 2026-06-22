// src/theme/ui.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Shared UI primitives — the SAME Icon / Btn / Card / Eyebrow used on the
// landing page, so the dashboard is visually identical, not just similar.
// ─────────────────────────────────────────────────────────────────────────────
import { useState } from 'react'
import { ICON_PATHS, FONT_MONO } from './landingTheme'

/* Stroke-SVG icon (matches landing's <Icon>) */
export function Icon({ name, size = 20, color = 'currentColor', stroke = 2, fill = 'none' }) {
  return (
    <svg
      width={size} height={size} viewBox="0 0 24 24"
      fill={fill} stroke={color} strokeWidth={stroke}
      strokeLinecap="round" strokeLinejoin="round"
      dangerouslySetInnerHTML={{ __html: ICON_PATHS[name] || '' }}
    />
  )
}

/* Button (matches landing's <Btn>) */
export function Btn({ children, onClick, accent, big, ghost, P, full, disabled, type = 'button' }) {
  const [h, setH] = useState(false)
  const col = accent || P.cyan
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        fontFamily: P.fontD, fontWeight: 700, fontSize: big ? 15 : 13, letterSpacing: 0.3,
        padding: big ? '14px 28px' : '10px 18px', borderRadius: 10,
        cursor: disabled ? 'not-allowed' : 'pointer',
        border: ghost ? `1px solid ${P.line}` : 'none', width: full ? '100%' : 'auto',
        background: disabled ? P.line : (ghost ? 'transparent' : col),
        color: disabled ? P.muted : (ghost ? P.text : '#fff'),
        boxShadow: ghost || disabled ? 'none' : (h ? `0 10px 28px ${col}55` : `0 4px 14px ${col}33`),
        transform: h && !disabled ? 'translateY(-1px)' : 'none', transition: 'all .2s',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, whiteSpace: 'nowrap',
        opacity: disabled ? 0.7 : 1,
      }}
    >
      {children}
    </button>
  )
}

/* Card (matches landing's <Card>) */
export function Card({ children, P, style: s = {}, hover = true, onClick }) {
  const [h, setH] = useState(false)
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        background: P.surface,
        border: `1px solid ${h && hover ? P.cyan + '55' : P.line}`,
        borderRadius: 16,
        boxShadow: h && hover
          ? (P.dark ? '0 16px 40px rgba(0,0,0,0.4)' : '0 16px 40px rgba(15,30,55,0.12)')
          : (P.dark ? '0 2px 8px rgba(0,0,0,0.2)' : '0 2px 8px rgba(15,30,55,0.05)'),
        transform: h && hover ? 'translateY(-3px)' : 'none',
        transition: 'all .25s',
        ...s,
      }}
    >
      {children}
    </div>
  )
}

/* Mono eyebrow label (the landing's signature section label) */
export function Eyebrow({ children, color, P, style = {} }) {
  return (
    <div style={{ fontFamily: FONT_MONO, fontSize: 11, color: color || P.cyan, letterSpacing: 2, ...style }}>
      {children}
    </div>
  )
}

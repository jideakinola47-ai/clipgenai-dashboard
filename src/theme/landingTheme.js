// src/theme/landingTheme.js
// ─────────────────────────────────────────────────────────────────────────────
// Single source of truth for ClipGen's visual identity.
// Extracted verbatim from Landing.jsx so every page (dashboard, clips,
// analytics, settings, pricing) shares ONE palette, type system and set of
// primitives. Import from here instead of redefining a local `theme` object.
// ─────────────────────────────────────────────────────────────────────────────

/* FONTS — load these once in index.html (see note at bottom of this file). */
export const FONT_DISPLAY = "'Space Grotesk','Exo 2',sans-serif"
export const FONT_BODY    = "'Inter',-apple-system,'Segoe UI',sans-serif"
export const FONT_MONO    = "'JetBrains Mono','Courier New',monospace"

/* PALETTE — identical to Landing.jsx makePalette(). `d` = isDark. */
export function makePalette(d) {
  return {
    dark:    d,
    bg:      d ? '#0d1117'                : '#f4f6fb',
    bgAlt:   d ? '#11161f'                : '#e9edf5',
    navy:    d ? '#161c27'                : '#dfe6f1',
    surface: d ? '#1a2130'                : '#ffffff',
    line:    d ? 'rgba(255,255,255,0.08)' : 'rgba(15,30,55,0.10)',
    text:    d ? '#eef3fb'                : '#0d1626',
    muted:   d ? '#8a99b0'                : '#5d6b82',
    glass:   d ? 'rgba(26,33,48,0.7)'     : 'rgba(255,255,255,0.85)',
    cyan:    d ? '#22d3ee'                : '#0891b2',
    blue:    d ? '#3b82f6'                : '#2563eb',
    purple:  d ? '#8b5cf6'                : '#7c3aed',
    pink:    d ? '#fb7185'                : '#e11d63',
    gold:    d ? '#fbbf24'                : '#d97706',
  }
}

/* ICONS — same stroke-SVG vocabulary as the landing (no emojis). */
export const ICON_PATHS = {
  gauge:    '<path d="M12 14l4-4"/><path d="M3.5 18a9 9 0 1 1 17 0"/><circle cx="12" cy="14" r="1.5"/>',
  captions: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M7 11h3M7 14h6M14 11h3"/>',
  portrait: '<rect x="7" y="3" width="10" height="18" rx="2"/><path d="M11 18h2"/>',
  sparkles: '<path d="M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6z"/><path d="M18 14l.7 1.8L20.5 16.5 18.7 17.2 18 19l-.7-1.8L15.5 16.5l1.8-.7z"/>',
  share:    '<circle cx="18" cy="5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="19" r="2.5"/><path d="M8.2 10.8l7.6-4.4M8.2 13.2l7.6 4.4"/>',
  zap:      '<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',
  upload:   '<path d="M12 16V4M7 9l5-5 5 5"/><path d="M4 17v2a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-2"/>',
  scissors: '<circle cx="6" cy="6" r="2.5"/><circle cx="6" cy="18" r="2.5"/><path d="M8 8l12 8M8 16l12-8"/>',
  play:     '<path d="M7 4l13 8-13 8z"/>',
  film:     '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 4v16M17 4v16M3 9h4M3 15h4M17 9h4M17 15h4"/>',
  globe:    '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18"/>',
  check:    '<path d="M20 6L9 17l-5-5"/>',
  link:     '<path d="M10 13a5 5 0 0 0 7 0l2-2a5 5 0 0 0-7-7l-1 1"/><path d="M14 11a5 5 0 0 0-7 0l-2 2a5 5 0 0 0 7 7l1-1"/>',
  chart:    '<path d="M3 3v18h18"/><rect x="7" y="11" width="3" height="6"/><rect x="12" y="7" width="3" height="10"/><rect x="17" y="13" width="3" height="4"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
  logout:   '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5M21 12H9"/>',
  refresh:  '<path d="M21 2v6h-6"/><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M3 22v-6h6"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/>',
  clock:    '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
}

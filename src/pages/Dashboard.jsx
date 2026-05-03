// Dashboard.jsx - Updated with Vizard-supported languages
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { uploadAndProcess } from "../utils/upload";
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

// Vizard supported languages only
const VIZARD_LANGUAGES = [
  { code: 'auto', name: 'Auto Detect', flag: '🌐' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺' },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const { user } = useAuth();
  const { language, setLanguage, LANGS, t } = useLanguage();
  const [videoUrl, setVideoUrl] = useState('');
  const [videoType, setVideoType] = useState(2);
  const [progress, setProgress] = useState(null);
  const [error, setError] = useState("");
  const [style, setStyle] = useState(t('educational'));
  const [platforms, setPlatforms] = useState(["Instagram Reels", "YouTube Shorts"]);
  const [subtitleLang, setSubtitleLang] = useState('auto'); // Default to auto-detect
  const [autoCap, setAutoCap] = useState(true);
  const [viral, setViral] = useState(true);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);

  const theme = {
    bg: isDark ? '#0d0d0d' : '#f8f7f5',
    cardBg: isDark ? '#111' : '#ffffff',
    border: isDark ? '#1f1f1f' : '#e8e5e0',
    text: isDark ? '#fff' : '#0a0a0a',
    textMuted: isDark ? '#888' : '#666',
    inputBg: isDark ? '#1a1a2e' : '#fafaf8',
    accent: '#5b4cf5',
  }

  const STYLES = [
    t('educational'), t('entertainment'), t('news'),
    t('productReview'), t('vlog'), t('motivational'), t('comedy'),
    "Interview", "Podcast Highlight", "Sports Highlight"
  ];
  
  const PLATFORMS = ["TikTok", "Instagram Reels", "YouTube Shorts", "LinkedIn", "Twitter/X"];
  
  const VIDEO_TYPES = [
    { value: 2, label: t('youtube') },
    { value: 1, label: t('directUrl') },
    { value: 3, label: t('googleDrive') },
    { value: 4, label: t('vimeo') },
    { value: 5, label: "StreamYard" },
    { value: 6, label: "TikTok" },
    { value: 7, label: "Twitter" },
    { value: 9, label: "Twitch" },
    { value: 10, label: "Loom" },
    { value: 11, label: "Facebook" },
    { value: 12, label: "LinkedIn" },
  ];

  function togglePlatform(p) {
    setPlatforms(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]);
  }

  async function handleGenerate() {
    if (!videoUrl) {
      setError(t('urlRequired'));
      return;
    }
    
    setError("");
    setProgress({ stage: "starting", percent: 0, message: "Starting..." });

    try {
      const clips = await uploadAndProcess(videoUrl, videoType, subtitleLang, (p) => setProgress(p));
      if (clips && clips.length > 0) {
        sessionStorage.setItem('generatedClips', JSON.stringify(clips));
        navigate('/clips');
      } else {
        setError(t('noClipsError'));
        setProgress(null);
      }
    } catch (e) {
      setError(e.message || t('generalError'));
      setProgress(null);
    }
  }

  // Get current language display
  const currentLanguage = LANGS.find(lang => lang.code === language) || LANGS[0];
  const currentSubtitleLang = VIZARD_LANGUAGES.find(lang => lang.code === subtitleLang) || VIZARD_LANGUAGES[0];

  return (
    <div style={{ padding: "32px", maxWidth: "1100px", margin: "0 auto", background: theme.bg, minHeight: '100vh' }}>
      {/* Header with Language Selector */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start',
        marginBottom: "24px",
        flexWrap: 'wrap',
        gap: '16px',
      }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 600, color: theme.text, margin: 0 }}>{t('title')}</h1>
          <p style={{ color: theme.textMuted, fontSize: 14, marginTop: 8 }}>
            {t('welcome', { name: user?.full_name || '' })}
          </p>
        </div>
        
        {/* Language Selector Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowLanguageMenu(!showLanguageMenu)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 16px',
              borderRadius: 20,
              background: theme.cardBg,
              border: `1px solid ${theme.border}`,
              color: theme.text,
              fontSize: 13,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = theme.hoverBg}
            onMouseLeave={(e) => e.currentTarget.style.background = theme.cardBg}
          >
            <span style={{ fontSize: 16 }}>{currentLanguage.flag}</span>
            <span>{currentLanguage.label}</span>
            <span style={{ fontSize: 12 }}>▼</span>
          </button>
          
          {showLanguageMenu && (
            <>
              <div 
                onClick={() => setShowLanguageMenu(false)}
                style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  zIndex: 998,
                }}
              />
              <div style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: 8,
                background: theme.cardBg,
                border: `1px solid ${theme.border}`,
                borderRadius: 12,
                padding: '8px',
                minWidth: 180,
                maxHeight: 400,
                overflowY: 'auto',
                zIndex: 999,
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              }}>
                {LANGS.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code);
                      setShowLanguageMenu(false);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: 8,
                      background: language === lang.code ? theme.hoverBg : 'transparent',
                      border: 'none',
                      color: theme.text,
                      fontSize: 13,
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = theme.hoverBg}
                    onMouseLeave={(e) => {
                      if (language !== lang.code) {
                        e.currentTarget.style.background = 'transparent';
                      }
                    }}
                  >
                    <span style={{ fontSize: 18 }}>{lang.flag}</span>
                    <span>{lang.label}</span>
                    {language === lang.code && (
                      <span style={{ marginLeft: 'auto', color: theme.accent }}>✓</span>
                    )}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Video URL Input */}
      <div style={{ 
        background: theme.cardBg, 
        border: `1px solid ${theme.border}`, 
        borderRadius: 16, 
        padding: "24px",
        marginBottom: 24 
      }}>
        <label style={{ fontSize: 12, fontWeight: 600, color: theme.textMuted, display: 'block', marginBottom: 8, letterSpacing: '0.5px' }}>
          {t('videoUrl')}
        </label>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <input
            type="text"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder={t('videoUrlPlaceholder')}
            style={{
              flex: 1,
              padding: "12px 16px",
              borderRadius: 8,
              border: `1px solid ${theme.border}`,
              background: theme.inputBg,
              color: theme.text,
              fontSize: 14,
              outline: 'none',
              transition: 'all 0.2s',
            }}
          />
          <select
            value={videoType}
            onChange={(e) => setVideoType(parseInt(e.target.value))}
            style={{
              padding: "12px 16px",
              borderRadius: 8,
              border: `1px solid ${theme.border}`,
              background: theme.inputBg,
              color: theme.text,
              fontSize: 14,
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            {VIDEO_TYPES.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
        </div>
        <p style={{ fontSize: 12, color: theme.textMuted, marginTop: 8 }}>
          {t('tip')}
        </p>
      </div>

      {/* Content Style & Platform Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px", marginBottom: "24px" }}>
        {/* Content Style */}
        <div style={{ background: theme.cardBg, borderRadius: "12px", padding: "20px", border: `1px solid ${theme.border}` }}>
          <div style={{ color: theme.textMuted, fontSize: "11px", letterSpacing: "1px", marginBottom: "12px" }}>{t('contentStyle')}</div>
          <select 
            value={style} 
            onChange={e => setStyle(e.target.value)}
            style={{ 
              width: "100%", 
              background: theme.inputBg, 
              color: theme.text, 
              border: `1px solid ${theme.border}`,
              borderRadius: "8px", 
              padding: "10px 12px", 
              fontSize: "14px",
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            {STYLES.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>

        {/* Target Platform */}
        <div style={{ background: theme.cardBg, borderRadius: "12px", padding: "20px", border: `1px solid ${theme.border}` }}>
          <div style={{ color: theme.textMuted, fontSize: "11px", letterSpacing: "1px", marginBottom: "12px" }}>{t('targetPlatform')}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {PLATFORMS.map(p => (
              <div 
                key={p} 
                onClick={() => togglePlatform(p)}
                style={{ 
                  padding: "8px 12px", 
                  borderRadius: "8px", 
                  cursor: "pointer", 
                  fontSize: "14px",
                  display: "flex", 
                  justifyContent: "space-between", 
                  alignItems: "center",
                  background: platforms.includes(p) ? "rgba(124,106,247,0.2)" : "transparent",
                  border: `1px solid ${platforms.includes(p) ? "#7c6af7" : "transparent"}`,
                  color: platforms.includes(p) ? "#a99ff7" : theme.textMuted,
                  transition: 'all 0.2s',
                }}
              >
                {p}
                {platforms.includes(p) && <span>✓</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Advanced Options */}
        <div style={{ background: theme.cardBg, borderRadius: "12px", padding: "20px", border: `1px solid ${theme.border}` }}>
          <div style={{ color: theme.textMuted, fontSize: "11px", letterSpacing: "1px", marginBottom: "16px" }}>{t('advancedOptions')}</div>
          
          {/* Auto-captions toggle */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <span style={{ color: theme.text, fontSize: "14px" }}>{t('autoCaptions')}</span>
            <div 
              onClick={() => setAutoCap(!autoCap)} 
              style={{
                width: "44px", 
                height: "24px", 
                borderRadius: "12px", 
                cursor: "pointer",
                background: autoCap ? "#7c6af7" : theme.border, 
                position: "relative", 
                transition: "background 0.2s"
              }}
            >
              <div style={{
                position: "absolute", 
                top: "2px", 
                left: autoCap ? "22px" : "2px",
                width: "20px", 
                height: "20px", 
                borderRadius: "50%",
                background: "#fff", 
                transition: "left 0.2s"
              }} />
            </div>
          </div>

          {/* Viral optimization toggle */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <span style={{ color: theme.text, fontSize: "14px" }}>{t('viralOptimization')}</span>
            <div 
              onClick={() => setViral(!viral)} 
              style={{
                width: "44px", 
                height: "24px", 
                borderRadius: "12px", 
                cursor: "pointer",
                background: viral ? "#7c6af7" : theme.border, 
                position: "relative", 
                transition: "background 0.2s"
              }}
            >
              <div style={{
                position: "absolute", 
                top: "2px", 
                left: viral ? "22px" : "2px",
                width: "20px", 
                height: "20px", 
                borderRadius: "50%",
                background: "#fff", 
                transition: "left 0.2s"
              }} />
            </div>
          </div>

          {/* Subtitle language - Vizard supported only */}
          <div style={{ color: theme.textMuted, fontSize: "11px", letterSpacing: "1px", marginBottom: "8px" }}>{t('subtitleLanguage')}</div>
          <select 
            value={subtitleLang} 
            onChange={e => setSubtitleLang(e.target.value)}
            style={{ 
              width: "100%", 
              background: theme.inputBg, 
              color: theme.text, 
              border: `1px solid ${theme.border}`,
              borderRadius: "8px", 
              padding: "8px 12px", 
              fontSize: "13px",
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            {VIZARD_LANGUAGES.map(lang => (
              <option key={lang.code} value={lang.code}>
                {lang.flag} {lang.name}
              </option>
            ))}
          </select>
          <p style={{ fontSize: 10, color: theme.textMuted, marginTop: 6 }}>
            {subtitleLang === 'auto' ? '🤖 AI will auto-detect the language' : `📝 Subtitles will be generated in ${VIZARD_LANGUAGES.find(l => l.code === subtitleLang)?.name}`}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      {progress && (
        <div style={{ 
          background: "rgba(124,106,247,0.1)", 
          border: "1px solid rgba(124,106,247,0.3)",
          borderRadius: 12, 
          padding: 20, 
          marginBottom: 16 
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ color: "#a99ff7", fontSize: 14 }}>{progress.message}</span>
            <span style={{ color: "#7c6af7", fontSize: 14, fontWeight: 600 }}>{Math.round(progress.percent)}%</span>
          </div>
          <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: 4, height: 6 }}>
            <div style={{ 
              width: `${progress.percent}%`, 
              height: "100%", 
              borderRadius: 4,
              background: "linear-gradient(90deg, #7c6af7, #a855f7)", 
              transition: "width 0.5s" 
            }} />
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div style={{ 
          background: "rgba(239,68,68,0.1)", 
          border: "1px solid rgba(239,68,68,0.3)",
          borderRadius: 12, 
          padding: 16, 
          marginBottom: 16, 
          color: "#f87171", 
          fontSize: 14 
        }}>
          {error}
        </div>
      )}

      {/* Generate Button */}
      <button
        onClick={handleGenerate}
        disabled={!videoUrl || !!progress}
        style={{
          width: "100%", 
          padding: "16px", 
          borderRadius: 12, 
          border: "none",
          background: !videoUrl || progress ? theme.border : "linear-gradient(135deg, #7c6af7, #a855f7)",
          color: !videoUrl || progress ? theme.textMuted : "#fff",
          fontSize: 16, 
          fontWeight: 700, 
          cursor: !videoUrl || progress ? "not-allowed" : "pointer",
          transition: "all 0.2s"
        }}
      >
        {progress ? `⏳ ${progress.message}` : t('generateButton')}
      </button>
    </div>
  );
}
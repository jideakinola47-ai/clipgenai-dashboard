import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { uploadAndProcess } from "../utils/upload";
import { useTheme } from '../contexts/ThemeContext'

const LANGUAGES = [
  "English","Lithuanian","German","French","Spanish","Polish","Russian","Italian",
  "Portuguese","Dutch","Swedish","Norwegian","Danish","Finnish","Japanese",
  "Chinese","Korean","Arabic","Turkish","Hindi","Ukrainian","Czech","Romanian",
  "Hungarian","Greek","Bulgarian","Croatian","Slovak","Slovenian","Estonian",
  "Latvian","Serbian","Catalan","Vietnamese","Thai","Indonesian","Malay",
  "Filipino","Hebrew","Persian","Swahili","Afrikaans","Welsh","Irish",
  "Albanian","Macedonian","Bosnian","Montenegrin","Luxembourgish","Maltese"
];

export default function Dashboard() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [progress, setProgress] = useState(null);
  const [error, setError] = useState("");
  const [style, setStyle] = useState("Educational / Tutorial");
  const [platforms, setPlatforms] = useState(["Instagram Reels","YouTube Shorts"]);
  const [language, setLanguage] = useState("English");
  const [autoCap, setAutoCap] = useState(true);
  const [viral, setViral] = useState(true);
  const fileRef = useRef();

  const theme = {
    bg: isDark ? '#0d0d0d' : '#f8f7f5',
    cardBg: isDark ? '#111' : '#ffffff',
    border: isDark ? '#1f1f1f' : '#e8e5e0',
    text: isDark ? '#fff' : '#0a0a0a',
    textMuted: isDark ? '#888' : '#666',
    inputBg: isDark ? '#1a1a2e' : '#fafaf8',
  }

  const STYLES = [
    "Educational / Tutorial","Entertainment","News & Commentary",
    "Product Review","Vlog / Personal","Motivational","Comedy / Skit",
    "Interview","Podcast Highlight","Sports Highlight"
  ];
  const PLATFORMS = ["TikTok","Instagram Reels","YouTube Shorts","LinkedIn","Twitter/X"];

  function togglePlatform(p) {
    setPlatforms(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]);
  }

  function handleDrop(e) {
    e.preventDefault(); 
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f && f.type.startsWith("video/")) setFile(f);
  }

  async function handleGenerate() {
    if (!file) return;
    setError("");
    setProgress({ stage: "uploading", percent: 5, message: "Starting upload..." });

    try {
      const clips = await uploadAndProcess(file, (p) => setProgress(p));
      if (clips && clips.length > 0) {
        sessionStorage.setItem('generatedClips', JSON.stringify(clips));
        navigate('/clips');
      } else {
        setError("No clips were generated. Please try a longer video.");
        setProgress(null);
      }
    } catch (e) {
      setError(e.message || "Something went wrong. Please try again.");
      setProgress(null);
    }
  }

  return (
    <div style={{ padding: "32px", maxWidth: "1100px", margin: "0 auto", background: theme.bg, minHeight: '100vh' }}>
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ color: theme.text, fontSize: "24px", fontWeight: 600, margin: 0 }}>Create New Clips</h1>
        <p style={{ color: theme.textMuted, fontSize: "14px", marginTop: "8px" }}>Upload a video and let AI generate viral clips</p>
      </div>

      <div
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => !file && fileRef.current?.click()}
        style={{
          border: `2px dashed ${dragging ? "#7c6af7" : file ? "#4caf50" : theme.border}`,
          borderRadius: "16px", padding: "48px 24px", textAlign: "center",
          cursor: file ? "default" : "pointer", marginBottom: "24px",
          background: dragging ? "rgba(124,106,247,0.08)" : "rgba(255,255,255,0.03)",
          transition: "all 0.2s"
        }}
      >
        <input ref={fileRef} type="file" accept="video/*" style={{ display: "none" }}
          onChange={e => e.target.files[0] && setFile(e.target.files[0])} />

        {file ? (
          <>
            <div style={{ fontSize: "40px", marginBottom: "12px" }}>✅</div>
            <div style={{ color: theme.text, fontWeight: 600, fontSize: "16px" }}>{file.name}</div>
            <div style={{ color: theme.textMuted, fontSize: "13px", marginTop: "4px" }}>
              {(file.size / 1024 / 1024).toFixed(1)} MB — Ready to process
            </div>
            <button onClick={e => { e.stopPropagation(); setFile(null); setProgress(null); setError(""); }}
              style={{ marginTop: "12px", background: "none", border: `1px solid ${theme.border}`,
                color: theme.textMuted, padding: "4px 16px", borderRadius: "8px", cursor: "pointer" }}>
              Remove
            </button>
          </>
        ) : (
          <>
            <div style={{ fontSize: "40px", marginBottom: "12px" }}>🎬</div>
            <div style={{ color: theme.text, fontWeight: 600, fontSize: "18px" }}>Drop your video here</div>
            <div style={{ color: theme.textMuted, fontSize: "14px", marginTop: "8px" }}>
              or click to browse — MP4, MOV, AVI supported
            </div>
          </>
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px", marginBottom: "24px" }}>
        <div style={{ background: theme.cardBg, borderRadius: "12px", padding: "20px", border: `1px solid ${theme.border}` }}>
          <div style={{ color: theme.textMuted, fontSize: "11px", letterSpacing: "1px", marginBottom: "12px" }}>CONTENT STYLE</div>
          <select value={style} onChange={e => setStyle(e.target.value)}
            style={{ width: "100%", background: theme.inputBg, color: theme.text, border: `1px solid ${theme.border}`,
              borderRadius: "8px", padding: "10px 12px", fontSize: "14px" }}>
            {STYLES.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>

        <div style={{ background: theme.cardBg, borderRadius: "12px", padding: "20px", border: `1px solid ${theme.border}` }}>
          <div style={{ color: theme.textMuted, fontSize: "11px", letterSpacing: "1px", marginBottom: "12px" }}>TARGET PLATFORM</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {PLATFORMS.map(p => (
              <div key={p} onClick={() => togglePlatform(p)}
                style={{ padding: "8px 12px", borderRadius: "8px", cursor: "pointer", fontSize: "14px",
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  background: platforms.includes(p) ? "rgba(124,106,247,0.2)" : "transparent",
                  border: `1px solid ${platforms.includes(p) ? "#7c6af7" : "transparent"}`,
                  color: platforms.includes(p) ? "#a99ff7" : theme.textMuted }}>
                {p}
                {platforms.includes(p) && <span>✓</span>}
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: theme.cardBg, borderRadius: "12px", padding: "20px", border: `1px solid ${theme.border}` }}>
          <div style={{ color: theme.textMuted, fontSize: "11px", letterSpacing: "1px", marginBottom: "16px" }}>ADVANCED OPTIONS</div>
          {[["Auto-captions", autoCap, setAutoCap], ["Viral optimization", viral, setViral]].map(([label, val, set]) => (
            <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <span style={{ color: theme.text, fontSize: "14px" }}>{label}</span>
              <div onClick={() => set(!val)} style={{
                width: "44px", height: "24px", borderRadius: "12px", cursor: "pointer",
                background: val ? "#7c6af7" : theme.border, position: "relative", transition: "background 0.2s"
              }}>
                <div style={{
                  position: "absolute", top: "2px", left: val ? "22px" : "2px",
                  width: "20px", height: "20px", borderRadius: "50%",
                  background: "#fff", transition: "left 0.2s"
                }} />
              </div>
            </div>
          ))}
          <div style={{ color: theme.textMuted, fontSize: "11px", letterSpacing: "1px", marginBottom: "8px" }}>SUBTITLE LANGUAGE</div>
          <select value={language} onChange={e => setLanguage(e.target.value)}
            style={{ width: "100%", background: theme.inputBg, color: theme.text, border: `1px solid ${theme.border}`,
              borderRadius: "8px", padding: "8px 12px", fontSize: "13px" }}>
            {LANGUAGES.map(l => <option key={l}>{l}</option>)}
          </select>
        </div>
      </div>

      {progress && (
        <div style={{ background: "rgba(124,106,247,0.1)", border: "1px solid rgba(124,106,247,0.3)",
          borderRadius: "12px", padding: "20px", marginBottom: "16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
            <span style={{ color: "#a99ff7", fontSize: "14px" }}>{progress.message}</span>
            <span style={{ color: "#7c6af7", fontSize: "14px", fontWeight: 600 }}>{Math.round(progress.percent)}%</span>
          </div>
          <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: "4px", height: "6px" }}>
            <div style={{ width: `${progress.percent}%`, height: "100%", borderRadius: "4px",
              background: "linear-gradient(90deg, #7c6af7, #a855f7)", transition: "width 0.5s" }} />
          </div>
        </div>
      )}

      {error && (
        <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
          borderRadius: "12px", padding: "16px", marginBottom: "16px", color: "#f87171", fontSize: "14px" }}>
          {error}
        </div>
      )}

      <button
        onClick={handleGenerate}
        disabled={!file || !!progress}
        style={{
          width: "100%", padding: "16px", borderRadius: "12px", border: "none",
          background: !file || progress ? theme.border : "linear-gradient(135deg, #7c6af7, #a855f7)",
          color: !file || progress ? theme.textMuted : "#fff",
          fontSize: "16px", fontWeight: 700, cursor: !file || progress ? "not-allowed" : "pointer",
          transition: "all 0.2s"
        }}>
        {progress ? `⏳ ${progress.message}` : "⚡ Generate Clips"}
      </button>
    </div>
  );
}
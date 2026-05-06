// contexts/LanguageContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';

export const LANGS = [
  { code: 'lt', flag: '🇱🇹', label: 'Lietuvių', name: 'Lithuanian' },
  { code: 'en', flag: '🇬🇧', label: 'English', name: 'English' },
  { code: 'de', flag: '🇩🇪', label: 'Deutsch', name: 'German' },
  { code: 'fr', flag: '🇫🇷', label: 'Français', name: 'French' },
  { code: 'es', flag: '🇪🇸', label: 'Español', name: 'Spanish' },
  { code: 'pl', flag: '🇵🇱', label: 'Polski', name: 'Polish' },
  { code: 'ru', flag: '🇷🇺', label: 'Русский', name: 'Russian' },
  { code: 'it', flag: '🇮🇹', label: 'Italiano', name: 'Italian' },
  { code: 'pt', flag: '🇵🇹', label: 'Português', name: 'Portuguese' },
  { code: 'nl', flag: '🇳🇱', label: 'Nederlands', name: 'Dutch' },
  { code: 'sv', flag: '🇸🇪', label: 'Svenska', name: 'Swedish' },
  { code: 'no', flag: '🇳🇴', label: 'Norsk', name: 'Norwegian' },
  { code: 'da', flag: '🇩🇰', label: 'Dansk', name: 'Danish' },
  { code: 'fi', flag: '🇫🇮', label: 'Suomi', name: 'Finnish' },
  { code: 'ja', flag: '🇯🇵', label: '日本語', name: 'Japanese' },
  { code: 'zh', flag: '🇨🇳', label: '中文', name: 'Chinese' },
  { code: 'ko', flag: '🇰🇷', label: '한국어', name: 'Korean' },
  { code: 'ar', flag: '🇸🇦', label: 'العربية', name: 'Arabic' },
  { code: 'tr', flag: '🇹🇷', label: 'Türkçe', name: 'Turkish' },
  { code: 'hi', flag: '🇮🇳', label: 'हिन्दी', name: 'Hindi' },
];

const LanguageContext = createContext();

// Helper to fill missing keys with English (fallback)
const withFallback = (target, base) => {
  for (let key in base) {
    if (!target[key]) target[key] = base[key];
  }
  return target;
};

const enDashboard = {
  title: "Create New Clips",
  welcome: "Welcome back, {{name}}!",
  subtitle: "Paste a YouTube URL or video link to generate viral clips",
  videoUrl: "VIDEO URL",
  videoUrlPlaceholder: "https://www.youtube.com/watch?v=... or https://example.com/video.mp4",
  videoType: "Video Type",
  tip: "💡 Tip: YouTube videos work best. Make sure the video is public or unlisted.",
  contentStyle: "CONTENT STYLE",
  targetPlatform: "TARGET PLATFORM",
  advancedOptions: "ADVANCED OPTIONS",
  autoCaptions: "Auto-captions",
  viralOptimization: "Viral optimization",
  subtitleLanguage: "SUBTITLE LANGUAGE",
  generateButton: "🚀 Generate Clips with Clip Gen AI",
  generating: "⏳ Generating clips...",
  noClipsError: "No clips were generated. Please try a different video.",
  generalError: "Something went wrong. Please try again.",
  urlRequired: "Please enter a video URL",
  youtube: "YouTube",
  directUrl: "Direct Video URL",
  googleDrive: "Google Drive",
  vimeo: "Vimeo",
  streamYard: "StreamYard",
  tiktok: "TikTok",
  twitter: "Twitter",
  twitch: "Twitch",
  loom: "Loom",
  facebook: "Facebook",
  linkedin: "LinkedIn",
  educational: "Educational / Tutorial",
  entertainment: "Entertainment",
  news: "News & Commentary",
  productReview: "Product Review",
  vlog: "Vlog / Personal",
  motivational: "Motivational",
  comedy: "Comedy / Skit",
  interview: "Interview",
  podcastHighlight: "Podcast Highlight",
  sportsHighlight: "Sports Highlight",
  uploadFileLabel: "OR UPLOAD VIDEO FILE",
  chooseFile: "Choose File",
  noFileChosen: "No file chosen",
  startingUpload: "Starting upload...",
  uploadGenerate: "Upload & Generate Clips",
  supportedFormats: "Supports MP4, MOV, AVI, MKV (max 100MB recommended)",
};

const ltDashboard = {
  title: "Kurti Naujus Klipus",
  welcome: "Sveiki sugrįžę, {{name}}!",
  subtitle: "Įklijuokite YouTube nuorodą ar vaizdo įrašo saitą, kad sukurtumėte virusinius klipus",
  videoUrl: "VAIZDO ĮRAŠO ADRESAS",
  videoUrlPlaceholder: "https://www.youtube.com/watch?v=... arba https://example.com/video.mp4",
  videoType: "Vaizdo įrašo tipas",
  tip: "💡 Patarimas: YouTube vaizdo įrašai veikia geriausiai. Įsitikinkite, kad vaizdo įrašas yra viešas arba neįrašytas.",
  contentStyle: "TURINIO STILIUS",
  targetPlatform: "TIKSLINĖ PLATFORMA",
  advancedOptions: "IŠPLĖSTINĖS OPCIJOS",
  autoCaptions: "Automatiniai subtitrai",
  viralOptimization: "Virusinė optimizacija",
  subtitleLanguage: "SUBTITRŲ KALBA",
  generateButton: "🚀 Kurti Klipus su Clip Gen AI",
  generating: "⏳ Kuriami klipai...",
  noClipsError: "Klipai nebuvo sukurti. Bandykite kitą vaizdo įrašą.",
  generalError: "Kažkas nepavyko. Bandykite dar kartą.",
  urlRequired: "Įveskite vaizdo įrašo adresą",
  youtube: "YouTube",
  directUrl: "Tiesioginis vaizdo adresas",
  googleDrive: "Google Drive",
  vimeo: "Vimeo",
  streamYard: "StreamYard",
  tiktok: "TikTok",
  twitter: "Twitter",
  twitch: "Twitch",
  loom: "Loom",
  facebook: "Facebook",
  linkedin: "LinkedIn",
  educational: "Edukacinis / Mokomasis",
  entertainment: "Pramoginis",
  news: "Naujienos / Komentarai",
  productReview: "Produkto Apžvalga",
  vlog: "Tinklaraštis / Asmeninis",
  motivational: "Motyvacinis",
  comedy: "Komedija / Scenarijus",
  interview: "Interviu",
  podcastHighlight: "Podcast akimirka",
  sportsHighlight: "Sporto akimirka",
  uploadFileLabel: "ARBA ĮKELKITE VAIZDO FAILĄ",
  chooseFile: "Pasirinkti failą",
  noFileChosen: "Nepasirinktas failas",
  startingUpload: "Pradedamas įkėlimas...",
  uploadGenerate: "Įkelti ir generuoti klipus",
  supportedFormats: "Palaikomi MP4, MOV, AVI, MKV (rekomenduojama max 100MB)",
};

const deDashboard = {
  title: "Neue Clips erstellen",
  welcome: "Willkommen zurück, {{name}}!",
  subtitle: "Fügen Sie eine YouTube-URL oder einen Video-Link ein, um virale Clips zu generieren",
  videoUrl: "VIDEO-URL",
  videoUrlPlaceholder: "https://www.youtube.com/watch?v=... oder https://example.com/video.mp4",
  videoType: "Video-Typ",
  tip: "💡 Tipp: YouTube-Videos funktionieren am besten. Stellen Sie sicher, dass das Video öffentlich oder nicht gelistet ist.",
  contentStyle: "INHALTSSTIL",
  targetPlatform: "ZIELPLATTFORM",
  advancedOptions: "ERWEITERTE OPTIONEN",
  autoCaptions: "Auto-Untertitel",
  viralOptimization: "Virale Optimierung",
  subtitleLanguage: "UNTERITEL-SPRACHE",
  generateButton: "🚀 Clips mit Clip Gen AI generieren",
  generating: "⏳ Clips werden generiert...",
  noClipsError: "Es wurden keine Clips generiert. Bitte versuchen Sie ein anderes Video.",
  generalError: "Etwas ist schief gelaufen. Bitte versuchen Sie es erneut.",
  urlRequired: "Bitte geben Sie eine Video-URL ein",
  youtube: "YouTube",
  directUrl: "Direkte Video-URL",
  googleDrive: "Google Drive",
  vimeo: "Vimeo",
  streamYard: "StreamYard",
  tiktok: "TikTok",
  twitter: "Twitter",
  twitch: "Twitch",
  loom: "Loom",
  facebook: "Facebook",
  linkedin: "LinkedIn",
  educational: "Bildung / Tutorial",
  entertainment: "Unterhaltung",
  news: "Nachrichten / Kommentare",
  productReview: "Produktbewertung",
  vlog: "Vlog / Persönlich",
  motivational: "Motivierend",
  comedy: "Komödie / Sketch",
  interview: "Interview",
  podcastHighlight: "Podcast-Highlight",
  sportsHighlight: "Sport-Highlight",
  uploadFileLabel: "ODER VIDEO-DATEI HOCHLADEN",
  chooseFile: "Datei auswählen",
  noFileChosen: "Keine Datei ausgewählt",
  startingUpload: "Upload startet...",
  uploadGenerate: "Hochladen & Clips generieren",
  supportedFormats: "Unterstützt MP4, MOV, AVI, MKV (max. 100MB empfohlen)",
};

const frDashboard = {
  title: "Créer de nouveaux clips",
  welcome: "Bon retour, {{name}} !",
  subtitle: "Collez une URL YouTube ou un lien vidéo pour générer des clips viraux",
  videoUrl: "URL DE LA VIDÉO",
  videoUrlPlaceholder: "https://www.youtube.com/watch?v=... ou https://example.com/video.mp4",
  videoType: "Type de vidéo",
  tip: "💡 Astuce : Les vidéos YouTube fonctionnent le mieux. Assurez-vous que la vidéo est publique ou non répertoriée.",
  contentStyle: "STYLE DE CONTENU",
  targetPlatform: "PLATEFORME CIBLE",
  advancedOptions: "OPTIONS AVANCÉES",
  autoCaptions: "Sous-titres auto",
  viralOptimization: "Optimisation virale",
  subtitleLanguage: "LANGUE DES SOUS-TITRES",
  generateButton: "🚀 Générer des clips avec Clip Gen AI",
  generating: "⏳ Génération des clips...",
  noClipsError: "Aucun clip n'a été généré. Veuillez essayer une vidéo différente.",
  generalError: "Quelque chose s'est mal passé. Veuillez réessayer.",
  urlRequired: "Veuillez entrer une URL vidéo",
  youtube: "YouTube",
  directUrl: "URL vidéo directe",
  googleDrive: "Google Drive",
  vimeo: "Vimeo",
  streamYard: "StreamYard",
  tiktok: "TikTok",
  twitter: "Twitter",
  twitch: "Twitch",
  loom: "Loom",
  facebook: "Facebook",
  linkedin: "LinkedIn",
  educational: "Éducatif / Tutoriel",
  entertainment: "Divertissement",
  news: "Actualités / Commentaires",
  productReview: "Avis produit",
  vlog: "Vlog / Personnel",
  motivational: "Motivationnel",
  comedy: "Comédie / Sketch",
  interview: "Interview",
  podcastHighlight: "Extrait de podcast",
  sportsHighlight: "Extrait sportif",
  uploadFileLabel: "OU TÉLÉCHARGER UN FICHIER VIDÉO",
  chooseFile: "Choisir un fichier",
  noFileChosen: "Aucun fichier choisi",
  startingUpload: "Début du téléchargement...",
  uploadGenerate: "Télécharger et générer des clips",
  supportedFormats: "Supporte MP4, MOV, AVI, MKV (max 100MB recommandé)",
};

const esDashboard = {
  title: "Crear Nuevos Clips",
  welcome: "¡Bienvenido de nuevo, {{name}}!",
  subtitle: "Pega una URL de YouTube o enlace de video para generar clips virales",
  videoUrl: "URL DEL VIDEO",
  videoUrlPlaceholder: "https://www.youtube.com/watch?v=... o https://example.com/video.mp4",
  videoType: "Tipo de video",
  tip: "💡 Consejo: Los videos de YouTube funcionan mejor. Asegúrate de que el video sea público o no listado.",
  contentStyle: "ESTILO DE CONTENIDO",
  targetPlatform: "PLATAFORMA OBJETIVO",
  advancedOptions: "OPCIONES AVANZADAS",
  autoCaptions: "Subtítulos automáticos",
  viralOptimization: "Optimización viral",
  subtitleLanguage: "IDIOMA DE SUBTÍTULOS",
  generateButton: "🚀 Generar Clips con Clip Gen AI",
  generating: "⏳ Generando clips...",
  noClipsError: "No se generaron clips. Prueba con un video diferente.",
  generalError: "Algo salió mal. Por favor, inténtalo de nuevo.",
  urlRequired: "Por favor, ingresa una URL de video",
  youtube: "YouTube",
  directUrl: "URL de video directo",
  googleDrive: "Google Drive",
  vimeo: "Vimeo",
  streamYard: "StreamYard",
  tiktok: "TikTok",
  twitter: "Twitter",
  twitch: "Twitch",
  loom: "Loom",
  facebook: "Facebook",
  linkedin: "LinkedIn",
  educational: "Educativo / Tutorial",
  entertainment: "Entretenimiento",
  news: "Noticias / Comentarios",
  productReview: "Revisión de producto",
  vlog: "Vlog / Personal",
  motivational: "Motivacional",
  comedy: "Comedia / Sketch",
  interview: "Entrevista",
  podcastHighlight: "Destacado de podcast",
  sportsHighlight: "Destacado deportivo",
  uploadFileLabel: "O SUBIR ARCHIVO DE VIDEO",
  chooseFile: "Elegir archivo",
  noFileChosen: "Ningún archivo seleccionado",
  startingUpload: "Iniciando subida...",
  uploadGenerate: "Subir y generar clips",
  supportedFormats: "Soporta MP4, MOV, AVI, MKV (máx 100MB recomendado)",
};

// For languages without full translations, we fallback to English for missing keys.
// We'll define partial overrides only for the differences, then merge with English.

const plDashboard = {
  title: "Utwórz nowe klipy",
  welcome: "Witaj ponownie, {{name}}!",
  uploadFileLabel: "LUB PRZEŚLIJ PLIK WIDEO",
  chooseFile: "Wybierz plik",
  noFileChosen: "Nie wybrano pliku",
  startingUpload: "Rozpoczynanie wysyłania...",
  uploadGenerate: "Prześlij i generuj klipy",
  supportedFormats: "Obsługuje MP4, MOV, AVI, MKV (zalecane max 100MB)",
};
const ruDashboard = {
  title: "Создать новые клипы",
  welcome: "С возвращением, {{name}}!",
  uploadFileLabel: "ИЛИ ЗАГРУЗИТЕ ВИДЕОФАЙЛ",
  chooseFile: "Выбрать файл",
  noFileChosen: "Файл не выбран",
  startingUpload: "Начало загрузки...",
  uploadGenerate: "Загрузить и создать клипы",
  supportedFormats: "Поддерживает MP4, MOV, AVI, MKV (макс. 100МБ)",
};
const itDashboard = {
  title: "Crea nuovi clip",
  welcome: "Bentornato, {{name}}!",
  uploadFileLabel: "O CARICA UN FILE VIDEO",
  chooseFile: "Scegli file",
  noFileChosen: "Nessun file selezionato",
  startingUpload: "Avvio caricamento...",
  uploadGenerate: "Carica e genera clip",
  supportedFormats: "Supporta MP4, MOV, AVI, MKV (max 100MB consigliato)",
};
const ptDashboard = {
  title: "Criar novos clipes",
  welcome: "Bem-vindo de volta, {{name}}!",
  uploadFileLabel: "OU CARREGAR ARQUIVO DE VÍDEO",
  chooseFile: "Escolher arquivo",
  noFileChosen: "Nenhum arquivo escolhido",
  startingUpload: "Iniciando upload...",
  uploadGenerate: "Carregar e gerar clipes",
  supportedFormats: "Suporta MP4, MOV, AVI, MKV (máx 100MB recomendado)",
};
const nlDashboard = {
  title: "Nieuwe clips maken",
  welcome: "Welkom terug, {{name}}!",
  uploadFileLabel: "OF VIDEOBESTAND UPLOADEN",
  chooseFile: "Kies bestand",
  noFileChosen: "Geen bestand gekozen",
  startingUpload: "Uploaden starten...",
  uploadGenerate: "Uploaden en clips genereren",
  supportedFormats: "Ondersteunt MP4, MOV, AVI, MKV (max 100MB aanbevolen)",
};
const svDashboard = {
  title: "Skapa nya klipp",
  welcome: "Välkommen tillbaka, {{name}}!",
  uploadFileLabel: "ELLER LADDA UPP VIDEOFIL",
  chooseFile: "Välj fil",
  noFileChosen: "Ingen fil vald",
  startingUpload: "Startar uppladdning...",
  uploadGenerate: "Ladda upp och generera klipp",
  supportedFormats: "Stöder MP4, MOV, AVI, MKV (max 100MB rekommenderas)",
};
const noDashboard = {
  title: "Lag nye klipp",
  welcome: "Velkommen tilbake, {{name}}!",
  uploadFileLabel: "ELLER LAST OPP VIDEOFIL",
  chooseFile: "Velg fil",
  noFileChosen: "Ingen fil valgt",
  startingUpload: "Starter opplasting...",
  uploadGenerate: "Last opp og generer klipp",
  supportedFormats: "Støtter MP4, MOV, AVI, MKV (anbefalt maks 100MB)",
};
const daDashboard = {
  title: "Opret nye klip",
  welcome: "Velkommen tilbage, {{name}}!",
  uploadFileLabel: "ELLER UPLOAD VIDEOFIL",
  chooseFile: "Vælg fil",
  noFileChosen: "Ingen fil valgt",
  startingUpload: "Starter upload...",
  uploadGenerate: "Upload og generer klip",
  supportedFormats: "Understøtter MP4, MOV, AVI, MKV (max 100MB anbefales)",
};
const fiDashboard = {
  title: "Luo uusia leikkeitä",
  welcome: "Tervetuloa takaisin, {{name}}!",
  uploadFileLabel: "TAI LATA VIDEOTIEDOSTO",
  chooseFile: "Valitse tiedosto",
  noFileChosen: "Ei tiedostoa valittu",
  startingUpload: "Lataus alkaa...",
  uploadGenerate: "Lataa ja luo leikkeitä",
  supportedFormats: "Tukee MP4, MOV, AVI, MKV (suositus max 100MB)",
};
const jaDashboard = {
  title: "新しいクリップを作成",
  welcome: "おかえりなさい、{{name}}さん！",
  uploadFileLabel: "またはビデオファイルをアップロード",
  chooseFile: "ファイルを選択",
  noFileChosen: "ファイルが選択されていません",
  startingUpload: "アップロード開始...",
  uploadGenerate: "アップロードしてクリップを生成",
  supportedFormats: "MP4, MOV, AVI, MKVに対応（推奨最大100MB）",
};
const zhDashboard = {
  title: "创建新剪辑",
  welcome: "欢迎回来，{{name}}！",
  uploadFileLabel: "或上传视频文件",
  chooseFile: "选择文件",
  noFileChosen: "未选择文件",
  startingUpload: "开始上传...",
  uploadGenerate: "上传并生成剪辑",
  supportedFormats: "支持MP4、MOV、AVI、MKV（建议最大100MB）",
};
const koDashboard = {
  title: "새 클립 만들기",
  welcome: "어서 오세요, {{name}}님!",
  uploadFileLabel: "또는 비디오 파일 업로드",
  chooseFile: "파일 선택",
  noFileChosen: "선택된 파일 없음",
  startingUpload: "업로드 시작...",
  uploadGenerate: "업로드 및 클립 생성",
  supportedFormats: "MP4, MOV, AVI, MKV 지원 (최대 100MB 권장)",
};
const arDashboard = {
  title: "إنشاء مقاطع جديدة",
  welcome: "مرحبًا بعودتك، {{name}}!",
  uploadFileLabel: "أو رفع ملف فيديو",
  chooseFile: "اختر ملف",
  noFileChosen: "لم يتم اختيار ملف",
  startingUpload: "بدء الرفع...",
  uploadGenerate: "رفع وإنشاء مقاطع",
  supportedFormats: "يدعم MP4، MOV، AVI، MKV (الحد الأقصى الموصى به 100 ميغابايت)",
};
const trDashboard = {
  title: "Yeni Klipler Oluştur",
  welcome: "Tekrar hoş geldiniz, {{name}}!",
  uploadFileLabel: "VEYA VİDEO DOSYASI YÜKLEYİN",
  chooseFile: "Dosya Seç",
  noFileChosen: "Dosya seçilmedi",
  startingUpload: "Yükleme başlatılıyor...",
  uploadGenerate: "Yükle ve Klipleri Oluştur",
  supportedFormats: "MP4, MOV, AVI, MKV destekler (önerilen max 100MB)",
};
const hiDashboard = {
  title: "नए क्लिप बनाएँ",
  welcome: "वापसी पर स्वागत है, {{name}}!",
  uploadFileLabel: "या वीडियो फ़ाइल अपलोड करें",
  chooseFile: "फ़ाइल चुनें",
  noFileChosen: "कोई फ़ाइल नहीं चुनी गई",
  startingUpload: "अपलोड शुरू...",
  uploadGenerate: "अपलोड करें और क्लिप बनाएँ",
  supportedFormats: "MP4, MOV, AVI, MKV समर्थित (अनुशंसित अधिकतम 100MB)",
};

// Merge each language's dashboard with the English base (fallback)
const translations = {
  en: { dashboard: enDashboard, common: { loading: "Loading...", save: "Save", cancel: "Cancel" } },
  lt: { dashboard: withFallback(ltDashboard, enDashboard), common: { loading: "Kraunama...", save: "Išsaugoti", cancel: "Atšaukti" } },
  de: { dashboard: withFallback(deDashboard, enDashboard), common: { loading: "Wird geladen...", save: "Speichern", cancel: "Abbrechen" } },
  fr: { dashboard: withFallback(frDashboard, enDashboard), common: { loading: "Chargement...", save: "Enregistrer", cancel: "Annuler" } },
  es: { dashboard: withFallback(esDashboard, enDashboard), common: { loading: "Cargando...", save: "Guardar", cancel: "Cancelar" } },
  pl: { dashboard: withFallback({ ...enDashboard, ...plDashboard }, enDashboard), common: { loading: "Ładowanie...", save: "Zapisz", cancel: "Anuluj" } },
  ru: { dashboard: withFallback({ ...enDashboard, ...ruDashboard }, enDashboard), common: { loading: "Загрузка...", save: "Сохранить", cancel: "Отмена" } },
  it: { dashboard: withFallback({ ...enDashboard, ...itDashboard }, enDashboard), common: { loading: "Caricamento...", save: "Salva", cancel: "Annulla" } },
  pt: { dashboard: withFallback({ ...enDashboard, ...ptDashboard }, enDashboard), common: { loading: "Carregando...", save: "Salvar", cancel: "Cancelar" } },
  nl: { dashboard: withFallback({ ...enDashboard, ...nlDashboard }, enDashboard), common: { loading: "Laden...", save: "Opslaan", cancel: "Annuleren" } },
  sv: { dashboard: withFallback({ ...enDashboard, ...svDashboard }, enDashboard), common: { loading: "Laddar...", save: "Spara", cancel: "Avbryt" } },
  no: { dashboard: withFallback({ ...enDashboard, ...noDashboard }, enDashboard), common: { loading: "Laster...", save: "Lagre", cancel: "Avbryt" } },
  da: { dashboard: withFallback({ ...enDashboard, ...daDashboard }, enDashboard), common: { loading: "Indlæser...", save: "Gem", cancel: "Annuller" } },
  fi: { dashboard: withFallback({ ...enDashboard, ...fiDashboard }, enDashboard), common: { loading: "Ladataan...", save: "Tallenna", cancel: "Peruuta" } },
  ja: { dashboard: withFallback({ ...enDashboard, ...jaDashboard }, enDashboard), common: { loading: "読み込み中...", save: "保存", cancel: "キャンセル" } },
  zh: { dashboard: withFallback({ ...enDashboard, ...zhDashboard }, enDashboard), common: { loading: "加载中...", save: "保存", cancel: "取消" } },
  ko: { dashboard: withFallback({ ...enDashboard, ...koDashboard }, enDashboard), common: { loading: "로딩 중...", save: "저장", cancel: "취소" } },
  ar: { dashboard: withFallback({ ...enDashboard, ...arDashboard }, enDashboard), common: { loading: "جار التحميل...", save: "حفظ", cancel: "إلغاء" } },
  tr: { dashboard: withFallback({ ...enDashboard, ...trDashboard }, enDashboard), common: { loading: "Yükleniyor...", save: "Kaydet", cancel: "İptal" } },
  hi: { dashboard: withFallback({ ...enDashboard, ...hiDashboard }, enDashboard), common: { loading: "लोड हो रहा है...", save: "सहेजें", cancel: "रद्द करें" } },
};

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('language');
    return saved && LANGS.some(l => l.code === saved) ? saved : 'en';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key, params = {}) => {
    let text = translations[language]?.dashboard?.[key] || translations.en.dashboard[key] || key;
    Object.keys(params).forEach(param => {
      text = text.replace(new RegExp(`{{${param}}}`, 'g'), params[param]);
    });
    return text;
  };

  const value = {
    language,
    setLanguage,
    t,
    LANGS,
    translations: translations[language] || translations.en,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within a LanguageProvider');
  return context;
}
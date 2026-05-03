// contexts/LanguageContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';

const LANGS = [
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

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('language');
    return saved || 'en';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const translations = {
    en: {
      dashboard: {
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
      },
      common: {
        loading: "Loading...",
        save: "Save",
        cancel: "Cancel"
      }
    },
    lt: {
      dashboard: {
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
      },
      common: {
        loading: "Kraunama...",
        save: "Išsaugoti",
        cancel: "Atšaukti"
      }
    },
    de: {
      dashboard: {
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
      },
      common: {
        loading: "Wird geladen...",
        save: "Speichern",
        cancel: "Abbrechen"
      }
    },
    fr: {
      dashboard: {
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
      },
      common: {
        loading: "Chargement...",
        save: "Enregistrer",
        cancel: "Annuler"
      }
    },
    es: {
      dashboard: {
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
      },
      common: {
        loading: "Cargando...",
        save: "Guardar",
        cancel: "Cancelar"
      }
    }
  };

  const t = (key, params = {}) => {
    let text = translations[language]?.dashboard?.[key] || translations.en.dashboard[key] || key;
    Object.keys(params).forEach(param => {
      text = text.replace(`{{${param}}}`, params[param]);
    });
    return text;
  };

  const value = {
    language,
    setLanguage,
    t,
    LANGS,
    translations: translations[language] || translations.en
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
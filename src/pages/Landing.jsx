import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

/* ════════════════════════════════════════════════════════════════
   FONTS
   Orbitron = cyberpunk display — ASCII/basic-Latin only.
   Exo 2 latin-ext = same aesthetic + full Lithuanian/Polish/Czech
   diacritics (Č Š Ž Ū Ę etc). We swap to Exo 2 for any language
   that uses extended Latin characters.
   ════════════════════════════════════════════════════════════════ */
/* ════════════════════════════════════════════════════════════════
   FONTS — premium, professional type system
   Space Grotesk = modern high-end display, natively covers Lithuanian/
   Polish/Czech diacritics (Č Š Ž Ū Ė …) so no font-swap hack needed.
   Inter = clean premium body. JetBrains Mono = crisp technical labels.
   ════════════════════════════════════════════════════════════════ */
const FONT_DISPLAY  = "'Space Grotesk','Exo 2',sans-serif"
const FONT_DISPLAY2 = "'Space Grotesk','Exo 2',sans-serif"
const FONT_BODY     = "'Inter',-apple-system,'Segoe UI',sans-serif"
const FONT_MONO     = "'JetBrains Mono','Courier New',monospace"
// Space Grotesk already covers extended Latin, but keep the helper for safety.
const EXTENDED_LATIN = new Set(['lt','pl','cs','sk','hu','ro','tr','et','lv','hr','sr','sl','ca','is','fi','da','no','sv'])
const fd = (lang) => EXTENDED_LATIN.has(lang) ? FONT_DISPLAY2 : FONT_DISPLAY

/* ════════════════════════════════════════════════════════════════
   THEME-AWARE PALETTE  (accents adjust for contrast in each mode)
   ════════════════════════════════════════════════════════════════ */
function makePalette(d) {
  return {
    dark:    d,
    bg:      d ? '#0d1117'              : '#f4f6fb',
    bgAlt:   d ? '#11161f'              : '#e9edf5',
    navy:    d ? '#161c27'              : '#dfe6f1',
    surface: d ? '#1a2130'              : '#ffffff',
    line:    d ? 'rgba(255,255,255,0.08)' : 'rgba(15,30,55,0.10)',
    text:    d ? '#eef3fb'              : '#0d1626',
    muted:   d ? '#8a99b0'              : '#5d6b82',
    glass:   d ? 'rgba(26,33,48,0.7)'   : 'rgba(255,255,255,0.85)',
    cyan:    d ? '#22d3ee'              : '#0891b2',
    blue:    d ? '#3b82f6'              : '#2563eb',
    purple:  d ? '#8b5cf6'              : '#7c3aed',
    pink:    d ? '#fb7185'              : '#e11d63',
    gold:    d ? '#fbbf24'              : '#d97706',
  }
}

/* ════════════════════════════════════════════════════════════════
   IMAGERY  (free Unsplash CDN — cyberpunk / tech)
   ════════════════════════════════════════════════════════════════ */
const IMG = {
  neonCity: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&w=1600&q=80',
  creator:  'https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?auto=format&fit=crop&w=900&q=80',
  dataCore: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
  clip1:    'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=400&q=80',
  clip2:    'https://images.unsplash.com/photo-1598550476439-6847785fcea6?auto=format&fit=crop&w=400&q=80',
  clip3:    'https://images.unsplash.com/photo-1626379953822-baec19c3accd?auto=format&fit=crop&w=400&q=80',
}

/* ════════════════════════════════════════════════════════════════
   50 LANGUAGES
   ════════════════════════════════════════════════════════════════ */
const LANGS = [
  { code:'en', flag:'🇬🇧', label:'English' },
  { code:'lt', flag:'🇱🇹', label:'Lietuvių' },
  { code:'es', flag:'🇪🇸', label:'Español' },
  { code:'fr', flag:'🇫🇷', label:'Français' },
  { code:'de', flag:'🇩🇪', label:'Deutsch' },
  { code:'pt', flag:'🇵🇹', label:'Português' },
  { code:'it', flag:'🇮🇹', label:'Italiano' },
  { code:'nl', flag:'🇳🇱', label:'Nederlands' },
  { code:'pl', flag:'🇵🇱', label:'Polski' },
  { code:'ru', flag:'🇷🇺', label:'Русский' },
  { code:'uk', flag:'🇺🇦', label:'Українська' },
  { code:'sv', flag:'🇸🇪', label:'Svenska' },
  { code:'no', flag:'🇳🇴', label:'Norsk' },
  { code:'da', flag:'🇩🇰', label:'Dansk' },
  { code:'fi', flag:'🇫🇮', label:'Suomi' },
  { code:'is', flag:'🇮🇸', label:'Íslenska' },
  { code:'et', flag:'🇪🇪', label:'Eesti' },
  { code:'lv', flag:'🇱🇻', label:'Latviešu' },
  { code:'cs', flag:'🇨🇿', label:'Čeština' },
  { code:'sk', flag:'🇸🇰', label:'Slovenčina' },
  { code:'hu', flag:'🇭🇺', label:'Magyar' },
  { code:'ro', flag:'🇷🇴', label:'Română' },
  { code:'bg', flag:'🇧🇬', label:'Български' },
  { code:'hr', flag:'🇭🇷', label:'Hrvatski' },
  { code:'sr', flag:'🇷🇸', label:'Српски' },
  { code:'sl', flag:'🇸🇮', label:'Slovenščina' },
  { code:'el', flag:'🇬🇷', label:'Ελληνικά' },
  { code:'tr', flag:'🇹🇷', label:'Türkçe' },
  { code:'ar', flag:'🇸🇦', label:'العربية', rtl:true },
  { code:'he', flag:'🇮🇱', label:'עברית', rtl:true },
  { code:'fa', flag:'🇮🇷', label:'فارسی', rtl:true },
  { code:'hi', flag:'🇮🇳', label:'हिन्दी' },
  { code:'bn', flag:'🇧🇩', label:'বাংলা' },
  { code:'ur', flag:'🇵🇰', label:'اردو', rtl:true },
  { code:'ta', flag:'🇮🇳', label:'தமிழ்' },
  { code:'te', flag:'🇮🇳', label:'తెలుగు' },
  { code:'th', flag:'🇹🇭', label:'ไทย' },
  { code:'vi', flag:'🇻🇳', label:'Tiếng Việt' },
  { code:'id', flag:'🇮🇩', label:'Indonesia' },
  { code:'ms', flag:'🇲🇾', label:'Melayu' },
  { code:'fil',flag:'🇵🇭', label:'Filipino' },
  { code:'ja', flag:'🇯🇵', label:'日本語' },
  { code:'ko', flag:'🇰🇷', label:'한국어' },
  { code:'zh', flag:'🇨🇳', label:'中文' },
  { code:'zt', flag:'🇹🇼', label:'繁體中文' },
  { code:'sw', flag:'🇰🇪', label:'Kiswahili' },
  { code:'am', flag:'🇪🇹', label:'አማርኛ' },
  { code:'yo', flag:'🇳🇬', label:'Yorùbá' },
  { code:'zu', flag:'🇿🇦', label:'isiZulu' },
  { code:'ca', flag:'🇪🇸', label:'Català' },
]

/* ── English base (every key) ── */
const EN = {
  sys:'VIRAL CONTENT INTELLIGENCE',
  hero1:'TURN ANY VIDEO', hero2:'INTO VIRAL CLIPS',
  heroSub:'OpenAI Whisper + GPT-4o + FFmpeg. Upload any long video — AI extracts the viral moments and delivers 9:16 clips in minutes.',
  ctaPrimary:'INITIALIZE FREE TRIAL', ctaSecondary:'VIEW PROCESS',
  trust:'NO CARD REQUIRED · 3 DAYS FREE · CANCEL ANYTIME',
  scroll:'SCROLL TO EXPLORE',
  navFeatures:'FEATURES', navProcess:'PROCESS', navPricing:'PRICING', navLogin:'LOGIN', navLaunch:'LAUNCH',
  featTitle:'AI CAPABILITIES', procTitle:'PIPELINE PROTOCOL',
  priceTitle:'SELECT ACCESS TIER', priceSub:'All plans include OpenAI Whisper + GPT-4o + FFmpeg pipeline',
  inputLabel:'INPUT // RAW FOOTAGE', outputLabel:'OUTPUT // VIRAL CLIPS',
  inputTitle:'You film. The AI watches.', outputTitle:'AI cuts. You go viral.',
  inputDesc:'Podcasts, vlogs, interviews, streams — any long-form video becomes raw material.',
  outputDesc:'5–8 scored, subtitled, 9:16 clips ready to post in minutes — fully automatic.',
  finalTitle1:'GO VIRAL.', finalTitle2:'GO NOW.',
  finalSub:'Join 152,000 creators. The AI does the work. You collect the views.',
  finalCta:'ACTIVATE FREE TRIAL', recommended:'RECOMMENDED', deploy:'DEPLOY NOW', initialize:'INITIALIZE',
  // district labels
  distNexus:'NEXUS HUB / COMMAND CENTER', distIntel:'INTELLIGENCE DISTRICT', distFlow:'DATAFLOW ARCHITECTURE', distZone:'LAUNCH PAD / DEPLOYMENT ZONE',
  // stats
  stClips:'CLIPS GENERATED', stScore:'AVG VIRAL SCORE', stTime:'TIME SAVED', stCreators:'CREATORS',
  // features
  f1l:'VIRAL SCORING', f1d:'Neural analysis scores every clip 0–100 on hook strength, emotion peaks, and shareability vectors.',
  f2l:'WHISPER AI', f2d:'OpenAI Whisper transcribes speech in 50+ languages with millisecond-accurate timestamps.',
  f3l:'AUTO 9:16', f3d:'FFmpeg pipeline reformats to TikTok, Reels and Shorts with intelligent crop and padding.',
  f4l:'GPT-4 ANALYSIS', f4d:'GPT-4o-mini finds the 5–8 highest-potential moments from any long-form content.',
  f5l:'1-CLICK PUBLISH', f5d:'Push clips directly to TikTok, Instagram Reels, and YouTube Shorts simultaneously.',
  f6l:'INSTANT CLIPS', f6d:'Full pipeline runs in 3–8 minutes. Upload → viral clips, no editing skills required.',
  // steps
  s1l:'UPLOAD', s1d:'Drop any MP4/MOV/AVI up to 500MB or paste a URL. Secure Cloudinary storage.',
  s2l:'TRANSCRIBE', s2d:'OpenAI Whisper extracts speech with segment-level timestamps in 50+ languages.',
  s3l:'ANALYZE', s3d:'GPT-4o-mini identifies viral moments — hooks, emotion peaks, quotable facts.',
  s4l:'CUT & PUBLISH', s4d:'FFmpeg cuts clips, reformats to 9:16. Push to all platforms in one click.',
  // process card
  procSim:'PROCESSING SIMULATION', procAvg:'Avg Processing:', procClips:'45-min podcast → 7 viral clips',
  peExtract:'EXTRACT', peTranscribe:'TRANSCRIBE', peAnalyze:'ANALYZE', peCut:'CUT',
  // pricing
  tierWord:'TIER', perMo:'/mo',
  pStarter1:'10 videos/month', pStarter2:'Auto Whisper subtitles', pStarter3:'9:16 reformat', pStarter4:'5 clips per video', pStarter5:'Email support',
  pPro1:'50 videos/month', pPro2:'50+ languages', pPro3:'Direct publishing', pPro4:'10 clips per video', pPro5:'Priority queue', pPro6:'API access',
  pAgency1:'Unlimited videos', pAgency2:'White-label dashboard', pAgency3:'Team workspace', pAgency4:'Custom branding', pAgency5:'Dedicated support', pAgency6:'Webhook integrations',
  // NOVA assistant
  nova1:'Welcome to ClipGen.AI. I am NOVA — your AI content strategist. Upload any long video and I extract the viral moments automatically.',
  nova2:'Powered by OpenAI Whisper and GPT-4o. Our neural engine analyzes every second of your content for maximum viral potential.',
  nova3:'The full pipeline takes 3–8 minutes. No editing skills required — just upload and let the AI work.',
  nova4:'Start free. The Pro plan gives you 50 videos per month with direct publishing to all major platforms.',
}

/* ── Translations (merged with EN fallback for any missing key) ── */
const RAW = {
  lt:{ sys:'VIRUSINIO TURINIO INTELEKTAS', hero1:'PAVERSK BET KOKĮ VIDEO', hero2:'VIRUSINIAIS KLIPAIS',
    heroSub:'OpenAI Whisper + GPT-4o + FFmpeg. Įkelkite ilgą vaizdo įrašą — DI suras virusinius momentus ir per kelias minutes pateiks 9:16 klipus.',
    ctaPrimary:'PRADĖTI NEMOKAMĄ BANDYMĄ', ctaSecondary:'PERŽIŪRĖTI PROCESĄ',
    trust:'NEREIKIA KORTELĖS · 3 DIENOS NEMOKAMAI · ATŠAUKITE BET KADA', scroll:'SLINKITE TYRINĖTI',
    navFeatures:'FUNKCIJOS', navProcess:'PROCESAS', navPricing:'KAINOS', navLogin:'PRISIJUNGTI', navLaunch:'PRADĖTI',
    featTitle:'DI GALIMYBĖS', procTitle:'PROCESO PROTOKOLAS', priceTitle:'PASIRINKITE PLANĄ',
    priceSub:'Visi planai apima OpenAI Whisper + GPT-4o + FFmpeg sistemą',
    inputLabel:'ĮVESTIS // ŽALIA MEDŽIAGA', outputLabel:'IŠVESTIS // VIRUSINIAI KLIPAI',
    inputTitle:'Jūs filmuojate. DI stebi.', outputTitle:'DI karpo. Jūs tampate virusiniai.',
    inputDesc:'Podkastai, tinklaraščiai, interviu, transliacijos — bet koks ilgas video tampa medžiaga.',
    outputDesc:'5–8 įvertinti, su subtitrais, 9:16 klipai paruošti per kelias minutes — visiškai automatiškai.',
    finalTitle1:'TAPK VIRUSINIS.', finalTitle2:'PRADĖK DABAR.',
    finalSub:'Prisijunk prie 152 000 kūrėjų. DI dirba. Tu renki peržiūras.',
    finalCta:'AKTYVUOTI NEMOKAMĄ BANDYMĄ', recommended:'REKOMENDUOJAMA', deploy:'PRADĖTI DABAR', initialize:'PRADĖTI' },

  es:{ sys:'INTELIGENCIA DE CONTENIDO VIRAL', hero1:'CONVIERTE CUALQUIER VIDEO', hero2:'EN CLIPS VIRALES',
    heroSub:'OpenAI Whisper + GPT-4o + FFmpeg. Sube un video largo — la IA extrae los momentos virales y entrega clips 9:16 en minutos.',
    ctaPrimary:'INICIAR PRUEBA GRATIS', ctaSecondary:'VER PROCESO',
    trust:'SIN TARJETA · 3 DÍAS GRATIS · CANCELA CUANDO QUIERAS', scroll:'DESLIZA PARA EXPLORAR',
    navFeatures:'FUNCIONES', navProcess:'PROCESO', navPricing:'PRECIOS', navLogin:'ENTRAR', navLaunch:'EMPEZAR',
    featTitle:'CAPACIDADES IA', procTitle:'PROTOCOLO DEL PROCESO', priceTitle:'ELIGE TU PLAN',
    priceSub:'Todos los planes incluyen OpenAI Whisper + GPT-4o + FFmpeg',
    inputLabel:'ENTRADA // MATERIAL BRUTO', outputLabel:'SALIDA // CLIPS VIRALES',
    inputTitle:'Tú grabas. La IA observa.', outputTitle:'La IA corta. Tú te vuelves viral.',
    inputDesc:'Podcasts, vlogs, entrevistas, streams — cualquier video largo se vuelve material.',
    outputDesc:'5–8 clips puntuados, subtitulados y en 9:16 listos en minutos — totalmente automático.',
    finalTitle1:'HAZTE VIRAL.', finalTitle2:'HAZLO YA.',
    finalSub:'Únete a 152.000 creadores. La IA hace el trabajo. Tú recoges las vistas.',
    finalCta:'ACTIVAR PRUEBA GRATIS', recommended:'RECOMENDADO', deploy:'EMPEZAR YA', initialize:'INICIAR' },

  fr:{ sys:'INTELLIGENCE DE CONTENU VIRAL', hero1:'TRANSFORMEZ TOUTE VIDÉO', hero2:'EN CLIPS VIRAUX',
    heroSub:'OpenAI Whisper + GPT-4o + FFmpeg. Importez une longue vidéo — l\u2019IA extrait les moments viraux et livre des clips 9:16 en minutes.',
    ctaPrimary:'ESSAI GRATUIT', ctaSecondary:'VOIR LE PROCESSUS',
    trust:'SANS CARTE · 3 JOURS GRATUITS · ANNULEZ À TOUT MOMENT', scroll:'FAITES DÉFILER',
    navFeatures:'FONCTIONS', navProcess:'PROCESSUS', navPricing:'TARIFS', navLogin:'CONNEXION', navLaunch:'LANCER',
    featTitle:'CAPACITÉS IA', procTitle:'PROTOCOLE DU PROCESSUS', priceTitle:'CHOISISSEZ VOTRE OFFRE',
    priceSub:'Toutes les offres incluent OpenAI Whisper + GPT-4o + FFmpeg',
    inputLabel:'ENTRÉE // SÉQUENCE BRUTE', outputLabel:'SORTIE // CLIPS VIRAUX',
    inputTitle:'Vous filmez. L\u2019IA observe.', outputTitle:'L\u2019IA découpe. Vous devenez viral.',
    inputDesc:'Podcasts, vlogs, interviews, streams — toute vidéo longue devient matière première.',
    outputDesc:'5–8 clips notés, sous-titrés, en 9:16 prêts en quelques minutes — entièrement automatique.',
    finalTitle1:'DEVENEZ VIRAL.', finalTitle2:'MAINTENANT.',
    finalSub:'Rejoignez 152 000 créateurs. L\u2019IA travaille. Vous récoltez les vues.',
    finalCta:'ACTIVER L\u2019ESSAI GRATUIT', recommended:'RECOMMANDÉ', deploy:'LANCER', initialize:'DÉMARRER' },

  de:{ sys:'INTELLIGENZ FÜR VIRALE INHALTE', hero1:'MACH AUS JEDEM VIDEO', hero2:'VIRALE CLIPS',
    heroSub:'OpenAI Whisper + GPT-4o + FFmpeg. Lade ein langes Video hoch — die KI findet die viralen Momente und liefert 9:16-Clips in Minuten.',
    ctaPrimary:'KOSTENLOS TESTEN', ctaSecondary:'PROZESS ANSEHEN',
    trust:'KEINE KARTE · 3 TAGE GRATIS · JEDERZEIT KÜNDBAR', scroll:'ZUM ENTDECKEN SCROLLEN',
    navFeatures:'FUNKTIONEN', navProcess:'ABLAUF', navPricing:'PREISE', navLogin:'ANMELDEN', navLaunch:'STARTEN',
    featTitle:'KI-FÄHIGKEITEN', procTitle:'PIPELINE-PROTOKOLL', priceTitle:'TARIF WÄHLEN',
    priceSub:'Alle Tarife enthalten OpenAI Whisper + GPT-4o + FFmpeg',
    inputLabel:'EINGABE // ROHMATERIAL', outputLabel:'AUSGABE // VIRALE CLIPS',
    inputTitle:'Du filmst. Die KI schaut zu.', outputTitle:'Die KI schneidet. Du wirst viral.',
    inputDesc:'Podcasts, Vlogs, Interviews, Streams — jedes lange Video wird zum Rohmaterial.',
    outputDesc:'5–8 bewertete, untertitelte 9:16-Clips in Minuten — vollautomatisch.',
    finalTitle1:'WERDE VIRAL.', finalTitle2:'JETZT.',
    finalSub:'Schließe dich 152.000 Creatorn an. Die KI arbeitet. Du sammelst die Views.',
    finalCta:'GRATIS-TEST STARTEN', recommended:'EMPFOHLEN', deploy:'JETZT STARTEN', initialize:'STARTEN' },

  pt:{ sys:'INTELIGÊNCIA DE CONTEÚDO VIRAL', hero1:'TRANSFORME QUALQUER VÍDEO', hero2:'EM CLIPES VIRAIS',
    heroSub:'OpenAI Whisper + GPT-4o + FFmpeg. Envie um vídeo longo — a IA extrai os momentos virais e entrega clipes 9:16 em minutos.',
    ctaPrimary:'INICIAR TESTE GRÁTIS', ctaSecondary:'VER O PROCESSO',
    trust:'SEM CARTÃO · 3 DIAS GRÁTIS · CANCELE QUANDO QUISER', scroll:'ROLE PARA EXPLORAR',
    navFeatures:'RECURSOS', navProcess:'PROCESSO', navPricing:'PREÇOS', navLogin:'ENTRAR', navLaunch:'COMEÇAR',
    featTitle:'CAPACIDADES DE IA', procTitle:'PROTOCOLO DO PROCESSO', priceTitle:'ESCOLHA SEU PLANO',
    priceSub:'Todos os planos incluem OpenAI Whisper + GPT-4o + FFmpeg',
    inputLabel:'ENTRADA // MATERIAL BRUTO', outputLabel:'SAÍDA // CLIPES VIRAIS',
    inputTitle:'Você grava. A IA observa.', outputTitle:'A IA corta. Você viraliza.',
    inputDesc:'Podcasts, vlogs, entrevistas, lives — qualquer vídeo longo vira matéria-prima.',
    outputDesc:'5–8 clipes pontuados, legendados e em 9:16 prontos em minutos — totalmente automático.',
    finalTitle1:'VIRALIZE.', finalTitle2:'AGORA.',
    finalSub:'Junte-se a 152.000 criadores. A IA faz o trabalho. Você colhe as visualizações.',
    finalCta:'ATIVAR TESTE GRÁTIS', recommended:'RECOMENDADO', deploy:'COMEÇAR AGORA', initialize:'INICIAR' },

  it:{ sys:'INTELLIGENZA PER CONTENUTI VIRALI', hero1:'TRASFORMA OGNI VIDEO', hero2:'IN CLIP VIRALI',
    heroSub:'OpenAI Whisper + GPT-4o + FFmpeg. Carica un video lungo — l\u2019IA estrae i momenti virali e crea clip 9:16 in pochi minuti.',
    ctaPrimary:'INIZIA LA PROVA GRATUITA', ctaSecondary:'VEDI IL PROCESSO',
    trust:'NESSUNA CARTA · 3 GIORNI GRATIS · DISDICI QUANDO VUOI', scroll:'SCORRI PER ESPLORARE',
    navFeatures:'FUNZIONI', navProcess:'PROCESSO', navPricing:'PREZZI', navLogin:'ACCEDI', navLaunch:'AVVIA',
    featTitle:'CAPACITÀ IA', procTitle:'PROTOCOLLO DEL PROCESSO', priceTitle:'SCEGLI IL PIANO',
    priceSub:'Tutti i piani includono OpenAI Whisper + GPT-4o + FFmpeg',
    inputLabel:'INPUT // MATERIALE GREZZO', outputLabel:'OUTPUT // CLIP VIRALI',
    inputTitle:'Tu giri. L\u2019IA osserva.', outputTitle:'L\u2019IA taglia. Tu diventi virale.',
    inputDesc:'Podcast, vlog, interviste, dirette — ogni video lungo diventa materiale.',
    outputDesc:'5–8 clip valutate, sottotitolate, in 9:16 pronte in minuti — completamente automatico.',
    finalTitle1:'DIVENTA VIRALE.', finalTitle2:'ORA.',
    finalSub:'Unisciti a 152.000 creator. L\u2019IA lavora. Tu raccogli le views.',
    finalCta:'ATTIVA LA PROVA GRATUITA', recommended:'CONSIGLIATO', deploy:'AVVIA ORA', initialize:'INIZIA' },

  nl:{ sys:'INTELLIGENTIE VOOR VIRALE CONTENT', hero1:'MAAK VAN ELKE VIDEO', hero2:'VIRALE CLIPS',
    heroSub:'OpenAI Whisper + GPT-4o + FFmpeg. Upload een lange video — AI haalt de virale momenten eruit en levert 9:16-clips in minuten.',
    ctaPrimary:'GRATIS PROEF STARTEN', ctaSecondary:'BEKIJK HET PROCES',
    trust:'GEEN KAART · 3 DAGEN GRATIS · ALTIJD OPZEGBAAR', scroll:'SCROLL OM TE ONTDEKKEN',
    navFeatures:'FUNCTIES', navProcess:'PROCES', navPricing:'PRIJZEN', navLogin:'INLOGGEN', navLaunch:'STARTEN',
    featTitle:'AI-MOGELIJKHEDEN', procTitle:'PIPELINE-PROTOCOL', priceTitle:'KIES JE PAKKET',
    priceSub:'Alle pakketten bevatten OpenAI Whisper + GPT-4o + FFmpeg',
    inputLabel:'INVOER // RUW MATERIAAL', outputLabel:'UITVOER // VIRALE CLIPS',
    inputTitle:'Jij filmt. AI kijkt mee.', outputTitle:'AI knipt. Jij gaat viraal.',
    inputDesc:'Podcasts, vlogs, interviews, streams — elke lange video wordt grondstof.',
    outputDesc:'5–8 gescoorde, ondertitelde 9:16-clips klaar in minuten — volledig automatisch.',
    finalTitle1:'GA VIRAAL.', finalTitle2:'NU.',
    finalSub:'Sluit je aan bij 152.000 creators. AI doet het werk. Jij verzamelt de views.',
    finalCta:'GRATIS PROEF ACTIVEREN', recommended:'AANBEVOLEN', deploy:'NU STARTEN', initialize:'STARTEN' },

  pl:{ sys:'INTELIGENCJA TREŚCI WIRALOWYCH', hero1:'ZAMIEŃ KAŻDE WIDEO', hero2:'W WIRALOWE KLIPY',
    heroSub:'OpenAI Whisper + GPT-4o + FFmpeg. Wgraj długie wideo — AI znajdzie wiralowe momenty i w kilka minut wytnie klipy 9:16.',
    ctaPrimary:'ROZPOCZNIJ DARMOWY OKRES', ctaSecondary:'ZOBACZ PROCES',
    trust:'BEZ KARTY · 3 DNI ZA DARMO · ANULUJ KIEDY CHCESZ', scroll:'PRZEWIŃ, BY ODKRYĆ',
    navFeatures:'FUNKCJE', navProcess:'PROCES', navPricing:'CENNIK', navLogin:'ZALOGUJ', navLaunch:'START',
    featTitle:'MOŻLIWOŚCI AI', procTitle:'PROTOKÓŁ PROCESU', priceTitle:'WYBIERZ PLAN',
    priceSub:'Wszystkie plany zawierają OpenAI Whisper + GPT-4o + FFmpeg',
    inputLabel:'WEJŚCIE // SUROWY MATERIAŁ', outputLabel:'WYJŚCIE // WIRALOWE KLIPY',
    inputTitle:'Ty nagrywasz. AI ogląda.', outputTitle:'AI tnie. Ty stajesz się wiralowy.',
    inputDesc:'Podcasty, vlogi, wywiady, streamy — każde długie wideo staje się materiałem.',
    outputDesc:'5–8 ocenionych klipów z napisami w 9:16 gotowych w kilka minut — w pełni automatycznie.',
    finalTitle1:'BĄDŹ WIRALOWY.', finalTitle2:'TERAZ.',
    finalSub:'Dołącz do 152 000 twórców. AI pracuje. Ty zbierasz wyświetlenia.',
    finalCta:'AKTYWUJ DARMOWY OKRES', recommended:'POLECANE', deploy:'START TERAZ', initialize:'START' },

  ru:{ sys:'ИНТЕЛЛЕКТ ВИРУСНОГО КОНТЕНТА', hero1:'ПРЕВРАТИ ЛЮБОЕ ВИДЕО', hero2:'В ВИРУСНЫЕ КЛИПЫ',
    heroSub:'OpenAI Whisper + GPT-4o + FFmpeg. Загрузите длинное видео — ИИ найдёт вирусные моменты и за минуты создаст клипы 9:16.',
    ctaPrimary:'НАЧАТЬ БЕСПЛАТНО', ctaSecondary:'СМОТРЕТЬ ПРОЦЕСС',
    trust:'БЕЗ КАРТЫ · 3 ДНЯ БЕСПЛАТНО · ОТМЕНА В ЛЮБОЙ МОМЕНТ', scroll:'ЛИСТАЙТЕ, ЧТОБЫ ИЗУЧИТЬ',
    navFeatures:'ФУНКЦИИ', navProcess:'ПРОЦЕСС', navPricing:'ЦЕНЫ', navLogin:'ВОЙТИ', navLaunch:'ЗАПУСК',
    featTitle:'ВОЗМОЖНОСТИ ИИ', procTitle:'ПРОТОКОЛ ПРОЦЕССА', priceTitle:'ВЫБЕРИТЕ ТАРИФ',
    priceSub:'Все тарифы включают OpenAI Whisper + GPT-4o + FFmpeg',
    inputLabel:'ВХОД // ИСХОДНОЕ ВИДЕО', outputLabel:'ВЫХОД // ВИРУСНЫЕ КЛИПЫ',
    inputTitle:'Вы снимаете. ИИ смотрит.', outputTitle:'ИИ режет. Вы становитесь вирусным.',
    inputDesc:'Подкасты, влоги, интервью, стримы — любое длинное видео становится материалом.',
    outputDesc:'5–8 оценённых клипов с субтитрами в 9:16 за минуты — полностью автоматически.',
    finalTitle1:'СТАНЬ ВИРУСНЫМ.', finalTitle2:'ПРЯМО СЕЙЧАС.',
    finalSub:'Присоединяйтесь к 152 000 авторов. ИИ работает. Вы собираете просмотры.',
    finalCta:'АКТИВИРОВАТЬ БЕСПЛАТНО', recommended:'РЕКОМЕНДУЕМ', deploy:'ЗАПУСТИТЬ', initialize:'НАЧАТЬ' },

  uk:{ sys:'ІНТЕЛЕКТ ВІРУСНОГО КОНТЕНТУ', hero1:'ПЕРЕТВОРИ БУДЬ-ЯКЕ ВІДЕО', hero2:'НА ВІРУСНІ КЛІПИ',
    heroSub:'OpenAI Whisper + GPT-4o + FFmpeg. Завантажте довге відео — ШІ знайде вірусні моменти й за хвилини зробить кліпи 9:16.',
    ctaPrimary:'ПОЧАТИ БЕЗКОШТОВНО', ctaSecondary:'ПЕРЕГЛЯНУТИ ПРОЦЕС',
    trust:'БЕЗ КАРТКИ · 3 ДНІ БЕЗКОШТОВНО · СКАСУВАННЯ БУДЬ-КОЛИ', scroll:'ГОРТАЙТЕ, ЩОБ ДОСЛІДИТИ',
    navFeatures:'ФУНКЦІЇ', navProcess:'ПРОЦЕС', navPricing:'ЦІНИ', navLogin:'УВІЙТИ', navLaunch:'СТАРТ',
    featTitle:'МОЖЛИВОСТІ ШІ', procTitle:'ПРОТОКОЛ ПРОЦЕСУ', priceTitle:'ОБЕРІТЬ ТАРИФ',
    priceSub:'Усі тарифи містять OpenAI Whisper + GPT-4o + FFmpeg',
    inputLabel:'ВХІД // СИРИЙ МАТЕРІАЛ', outputLabel:'ВИХІД // ВІРУСНІ КЛІПИ',
    inputTitle:'Ви знімаєте. ШІ дивиться.', outputTitle:'ШІ ріже. Ви стаєте вірусним.',
    finalTitle1:'СТАНЬ ВІРУСНИМ.', finalTitle2:'ЗАРАЗ.',
    finalSub:'Приєднуйтесь до 152 000 авторів. ШІ працює. Ви збираєте перегляди.',
    finalCta:'АКТИВУВАТИ БЕЗКОШТОВНО', recommended:'РЕКОМЕНДОВАНО', deploy:'ЗАПУСТИТИ', initialize:'ПОЧАТИ' },

  sv:{ sys:'INTELLIGENS FÖR VIRALT INNEHÅLL', hero1:'GÖR VALFRI VIDEO', hero2:'TILL VIRALA KLIPP',
    heroSub:'OpenAI Whisper + GPT-4o + FFmpeg. Ladda upp en lång video — AI hittar de virala ögonblicken och levererar 9:16-klipp på minuter.',
    ctaPrimary:'STARTA GRATIS', ctaSecondary:'SE PROCESSEN',
    trust:'INGET KORT · 3 DAGAR GRATIS · AVSLUTA NÄR DU VILL', scroll:'SCROLLA FÖR ATT UTFORSKA',
    navFeatures:'FUNKTIONER', navProcess:'PROCESS', navPricing:'PRISER', navLogin:'LOGGA IN', navLaunch:'STARTA',
    featTitle:'AI-FÖRMÅGOR', procTitle:'PIPELINE-PROTOKOLL', priceTitle:'VÄLJ PLAN',
    priceSub:'Alla planer inkluderar OpenAI Whisper + GPT-4o + FFmpeg',
    inputLabel:'INDATA // RÅMATERIAL', outputLabel:'UTDATA // VIRALA KLIPP',
    inputTitle:'Du filmar. AI tittar.', outputTitle:'AI klipper. Du blir viral.',
    finalTitle1:'BLI VIRAL.', finalTitle2:'NU.',
    finalSub:'Gå med i 152 000 kreatörer. AI gör jobbet. Du samlar visningarna.',
    finalCta:'AKTIVERA GRATIS', recommended:'REKOMMENDERAS', deploy:'STARTA NU', initialize:'STARTA' },

  no:{ sys:'INTELLIGENS FOR VIRALT INNHOLD', hero1:'GJØR ENHVER VIDEO', hero2:'TIL VIRALE KLIPP',
    heroSub:'OpenAI Whisper + GPT-4o + FFmpeg. Last opp en lang video — KI finner de virale øyeblikkene og lager 9:16-klipp på minutter.',
    ctaPrimary:'START GRATIS', ctaSecondary:'SE PROSESSEN',
    trust:'INGEN KORT · 3 DAGER GRATIS · AVSLUTT NÅR DU VIL', scroll:'BLA FOR Å UTFORSKE',
    navFeatures:'FUNKSJONER', navProcess:'PROSESS', navPricing:'PRISER', navLogin:'LOGG INN', navLaunch:'START',
    featTitle:'KI-EVNER', procTitle:'PIPELINE-PROTOKOLL', priceTitle:'VELG PLAN',
    priceSub:'Alle planer inkluderer OpenAI Whisper + GPT-4o + FFmpeg',
    inputLabel:'INNDATA // RÅMATERIALE', outputLabel:'UTDATA // VIRALE KLIPP',
    inputTitle:'Du filmer. KI ser på.', outputTitle:'KI klipper. Du blir viral.',
    finalTitle1:'BLI VIRAL.', finalTitle2:'NÅ.',
    finalSub:'Bli med 152 000 skapere. KI gjør jobben. Du samler visningene.',
    finalCta:'AKTIVER GRATIS', recommended:'ANBEFALT', deploy:'START NÅ', initialize:'START' },

  da:{ sys:'INTELLIGENS TIL VIRALT INDHOLD', hero1:'LAV ENHVER VIDEO', hero2:'OM TIL VIRALE KLIP',
    heroSub:'OpenAI Whisper + GPT-4o + FFmpeg. Upload en lang video — AI finder de virale øjeblikke og leverer 9:16-klip på minutter.',
    ctaPrimary:'START GRATIS', ctaSecondary:'SE PROCESSEN',
    trust:'INTET KORT · 3 DAGE GRATIS · OPSIG NÅR SOM HELST', scroll:'RUL FOR AT UDFORSKE',
    navFeatures:'FUNKTIONER', navProcess:'PROCES', navPricing:'PRISER', navLogin:'LOG IND', navLaunch:'START',
    featTitle:'AI-EVNER', procTitle:'PIPELINE-PROTOKOL', priceTitle:'VÆLG PLAN',
    priceSub:'Alle planer inkluderer OpenAI Whisper + GPT-4o + FFmpeg',
    inputLabel:'INPUT // RÅMATERIALE', outputLabel:'OUTPUT // VIRALE KLIP',
    inputTitle:'Du filmer. AI ser med.', outputTitle:'AI klipper. Du går viralt.',
    finalTitle1:'GÅ VIRALT.', finalTitle2:'NU.',
    finalSub:'Bliv en del af 152.000 skabere. AI gør arbejdet. Du samler visningerne.',
    finalCta:'AKTIVÉR GRATIS', recommended:'ANBEFALET', deploy:'START NU', initialize:'START' },

  fi:{ sys:'VIRAALISISÄLLÖN ÄLY', hero1:'TEE MISTÄ TAHANSA VIDEOSTA', hero2:'VIRAALILEIKKEITÄ',
    heroSub:'OpenAI Whisper + GPT-4o + FFmpeg. Lataa pitkä video — tekoäly löytää viraalihetket ja tekee 9:16-leikkeet minuuteissa.',
    ctaPrimary:'ALOITA ILMAISEKSI', ctaSecondary:'KATSO PROSESSI',
    trust:'EI KORTTIA · 3 PÄIVÄÄ ILMAISEKSI · PERU MILLOIN VAIN', scroll:'VIERITÄ TUTKIAKSESI',
    navFeatures:'OMINAISUUDET', navProcess:'PROSESSI', navPricing:'HINNAT', navLogin:'KIRJAUDU', navLaunch:'ALOITA',
    featTitle:'TEKOÄLYN KYVYT', procTitle:'PROSESSIPROTOKOLLA', priceTitle:'VALITSE PAKETTI',
    priceSub:'Kaikki paketit sisältävät OpenAI Whisper + GPT-4o + FFmpeg',
    inputLabel:'SYÖTE // RAAKAMATERIAALI', outputLabel:'TULOSTE // VIRAALILEIKKEET',
    inputTitle:'Sinä kuvaat. Tekoäly katsoo.', outputTitle:'Tekoäly leikkaa. Sinä leviät viraalisti.',
    finalTitle1:'LEVIÄ VIRAALISTI.', finalTitle2:'NYT.',
    finalSub:'Liity 152 000 tekijään. Tekoäly tekee työn. Sinä keräät katselut.',
    finalCta:'AKTIVOI ILMAINEN KOKEILU', recommended:'SUOSITELTU', deploy:'ALOITA NYT', initialize:'ALOITA' },

  cs:{ sys:'INTELIGENCE VIRÁLNÍHO OBSAHU', hero1:'PROMĚŇTE JAKÉKOLI VIDEO', hero2:'VE VIRÁLNÍ KLIPY',
    heroSub:'OpenAI Whisper + GPT-4o + FFmpeg. Nahrajte dlouhé video — AI najde virální momenty a během minut vytvoří klipy 9:16.',
    ctaPrimary:'ZAČÍT ZDARMA', ctaSecondary:'ZOBRAZIT PROCES',
    trust:'BEZ KARTY · 3 DNY ZDARMA · ZRUŠENÍ KDYKOLI', scroll:'POSOUVEJTE PRO PRŮZKUM',
    navFeatures:'FUNKCE', navProcess:'PROCES', navPricing:'CENY', navLogin:'PŘIHLÁSIT', navLaunch:'SPUSTIT',
    featTitle:'SCHOPNOSTI AI', procTitle:'PROTOKOL PROCESU', priceTitle:'VYBERTE PLÁN',
    priceSub:'Všechny plány zahrnují OpenAI Whisper + GPT-4o + FFmpeg',
    inputLabel:'VSTUP // SUROVÝ MATERIÁL', outputLabel:'VÝSTUP // VIRÁLNÍ KLIPY',
    inputTitle:'Vy natáčíte. AI sleduje.', outputTitle:'AI stříhá. Vy jste virální.',
    finalTitle1:'BUĎTE VIRÁLNÍ.', finalTitle2:'TEĎ.',
    finalSub:'Připojte se k 152 000 tvůrcům. AI pracuje. Vy sbíráte zhlédnutí.',
    finalCta:'AKTIVOVAT ZDARMA', recommended:'DOPORUČENO', deploy:'SPUSTIT', initialize:'ZAČÍT' },

  sk:{ sys:'INTELIGENCIA VIRÁLNEHO OBSAHU', hero1:'PREMEŇTE AKÉKOĽVEK VIDEO', hero2:'NA VIRÁLNE KLIPY',
    heroSub:'OpenAI Whisper + GPT-4o + FFmpeg. Nahrajte dlhé video — AI nájde virálne momenty a za minúty vytvorí klipy 9:16.',
    ctaPrimary:'ZAČAŤ ZADARMO', ctaSecondary:'ZOBRAZIŤ PROCES',
    trust:'BEZ KARTY · 3 DNI ZADARMO · ZRUŠENIE KEDYKOĽVEK', scroll:'POSÚVAJTE PRE PRIESKUM',
    navFeatures:'FUNKCIE', navProcess:'PROCES', navPricing:'CENY', navLogin:'PRIHLÁSIŤ', navLaunch:'SPUSTIŤ',
    featTitle:'SCHOPNOSTI AI', procTitle:'PROTOKOL PROCESU', priceTitle:'VYBERTE PLÁN',
    priceSub:'Všetky plány zahŕňajú OpenAI Whisper + GPT-4o + FFmpeg',
    inputLabel:'VSTUP // SUROVÝ MATERIÁL', outputLabel:'VÝSTUP // VIRÁLNE KLIPY',
    inputTitle:'Vy natáčate. AI sleduje.', outputTitle:'AI strihá. Vy ste virálni.',
    finalTitle1:'BUĎTE VIRÁLNI.', finalTitle2:'TERAZ.',
    finalSub:'Pripojte sa k 152 000 tvorcom. AI pracuje. Vy zbierate zhliadnutia.',
    finalCta:'AKTIVOVAŤ ZADARMO', recommended:'ODPORÚČANÉ', deploy:'SPUSTIŤ', initialize:'ZAČAŤ' },

  hu:{ sys:'VIRÁLIS TARTALOM INTELLIGENCIA', hero1:'ALAKÍTS BÁRMILYEN VIDEÓT', hero2:'VIRÁLIS KLIPEKKÉ',
    heroSub:'OpenAI Whisper + GPT-4o + FFmpeg. Tölts fel egy hosszú videót — az MI megtalálja a virális pillanatokat és percek alatt 9:16 klipeket készít.',
    ctaPrimary:'INGYENES PRÓBA INDÍTÁSA', ctaSecondary:'FOLYAMAT MEGTEKINTÉSE',
    trust:'NINCS KÁRTYA · 3 NAP INGYEN · BÁRMIKOR LEMONDHATÓ', scroll:'GÖRGESS A FELFEDEZÉSHEZ',
    navFeatures:'FUNKCIÓK', navProcess:'FOLYAMAT', navPricing:'ÁRAK', navLogin:'BELÉPÉS', navLaunch:'INDÍTÁS',
    featTitle:'MI KÉPESSÉGEK', procTitle:'FOLYAMAT PROTOKOLL', priceTitle:'VÁLASSZ CSOMAGOT',
    priceSub:'Minden csomag tartalmazza az OpenAI Whisper + GPT-4o + FFmpeg rendszert',
    inputLabel:'BEMENET // NYERS ANYAG', outputLabel:'KIMENET // VIRÁLIS KLIPEK',
    inputTitle:'Te forgatsz. Az MI figyel.', outputTitle:'Az MI vág. Te virálissá válsz.',
    finalTitle1:'LÉGY VIRÁLIS.', finalTitle2:'MOST.',
    finalSub:'Csatlakozz 152 000 alkotóhoz. Az MI dolgozik. Te gyűjtöd a nézettséget.',
    finalCta:'INGYENES PRÓBA AKTIVÁLÁSA', recommended:'AJÁNLOTT', deploy:'INDÍTÁS MOST', initialize:'INDÍTÁS' },

  ro:{ sys:'INTELIGENȚĂ PENTRU CONȚINUT VIRAL', hero1:'TRANSFORMĂ ORICE VIDEO', hero2:'ÎN CLIPURI VIRALE',
    heroSub:'OpenAI Whisper + GPT-4o + FFmpeg. Încarcă un video lung — IA extrage momentele virale și livrează clipuri 9:16 în câteva minute.',
    ctaPrimary:'ÎNCEPE GRATUIT', ctaSecondary:'VEZI PROCESUL',
    trust:'FĂRĂ CARD · 3 ZILE GRATIS · ANULEZI ORICÂND', scroll:'DERULEAZĂ PENTRU A EXPLORA',
    navFeatures:'FUNCȚII', navProcess:'PROCES', navPricing:'PREȚURI', navLogin:'AUTENTIFICARE', navLaunch:'LANSEAZĂ',
    featTitle:'CAPACITĂȚI IA', procTitle:'PROTOCOLUL PROCESULUI', priceTitle:'ALEGE PLANUL',
    priceSub:'Toate planurile includ OpenAI Whisper + GPT-4o + FFmpeg',
    inputLabel:'INTRARE // MATERIAL BRUT', outputLabel:'IEȘIRE // CLIPURI VIRALE',
    inputTitle:'Tu filmezi. IA observă.', outputTitle:'IA taie. Tu devii viral.',
    finalTitle1:'DEVINO VIRAL.', finalTitle2:'ACUM.',
    finalSub:'Alătură-te celor 152.000 de creatori. IA face treaba. Tu aduni vizualizările.',
    finalCta:'ACTIVEAZĂ GRATUIT', recommended:'RECOMANDAT', deploy:'LANSEAZĂ ACUM', initialize:'ÎNCEPE' },

  el:{ sys:'ΝΟΗΜΟΣΥΝΗ ΙΟΓΕΝΟΥΣ ΠΕΡΙΕΧΟΜΕΝΟΥ', hero1:'ΜΕΤΑΤΡΕΨΕ ΟΠΟΙΟΔΗΠΟΤΕ ΒΙΝΤΕΟ', hero2:'ΣΕ VIRAL ΚΛΙΠ',
    heroSub:'OpenAI Whisper + GPT-4o + FFmpeg. Ανέβασε ένα μεγάλο βίντεο — η AI βρίσκει τις viral στιγμές και παραδίδει κλιπ 9:16 σε λεπτά.',
    ctaPrimary:'ΞΕΚΙΝΑ ΔΩΡΕΑΝ', ctaSecondary:'ΔΕΣ ΤΗ ΔΙΑΔΙΚΑΣΙΑ',
    trust:'ΧΩΡΙΣ ΚΑΡΤΑ · 3 ΜΕΡΕΣ ΔΩΡΕΑΝ · ΑΚΥΡΩΣΗ ΟΠΟΤΕ ΘΕΛΕΙΣ', scroll:'ΚΥΛΗΣΕ ΓΙΑ ΕΞΕΡΕΥΝΗΣΗ',
    navFeatures:'ΛΕΙΤΟΥΡΓΙΕΣ', navProcess:'ΔΙΑΔΙΚΑΣΙΑ', navPricing:'ΤΙΜΕΣ', navLogin:'ΣΥΝΔΕΣΗ', navLaunch:'ΕΚΚΙΝΗΣΗ',
    featTitle:'ΔΥΝΑΤΟΤΗΤΕΣ AI', procTitle:'ΠΡΩΤΟΚΟΛΛΟ ΔΙΑΔΙΚΑΣΙΑΣ', priceTitle:'ΕΠΙΛΕΞΕ ΠΑΚΕΤΟ',
    priceSub:'Όλα τα πακέτα περιλαμβάνουν OpenAI Whisper + GPT-4o + FFmpeg',
    inputLabel:'ΕΙΣΟΔΟΣ // ΑΚΑΤΕΡΓΑΣΤΟ ΥΛΙΚΟ', outputLabel:'ΕΞΟΔΟΣ // VIRAL ΚΛΙΠ',
    inputTitle:'Εσύ τραβάς. Η AI παρακολουθεί.', outputTitle:'Η AI κόβει. Εσύ γίνεσαι viral.',
    finalTitle1:'ΓΙΝΕ VIRAL.', finalTitle2:'ΤΩΡΑ.',
    finalSub:'Γίνε μέλος 152.000 δημιουργών. Η AI δουλεύει. Εσύ μαζεύεις τις προβολές.',
    finalCta:'ΕΝΕΡΓΟΠΟΙΗΣΕ ΔΩΡΕΑΝ', recommended:'ΣΥΝΙΣΤΑΤΑΙ', deploy:'ΕΚΚΙΝΗΣΗ ΤΩΡΑ', initialize:'ΞΕΚΙΝΑ' },

  tr:{ sys:'VİRAL İÇERİK ZEKÂSI', hero1:'HERHANGİ BİR VİDEOYU', hero2:'VİRAL KLİPLERE DÖNÜŞTÜR',
    heroSub:'OpenAI Whisper + GPT-4o + FFmpeg. Uzun bir video yükleyin — yapay zekâ viral anları bulur ve dakikalar içinde 9:16 klipler üretir.',
    ctaPrimary:'ÜCRETSİZ BAŞLA', ctaSecondary:'SÜRECİ GÖR',
    trust:'KART GEREKMEZ · 3 GÜN ÜCRETSİZ · İSTEDİĞİN ZAMAN İPTAL', scroll:'KEŞFETMEK İÇİN KAYDIR',
    navFeatures:'ÖZELLİKLER', navProcess:'SÜREÇ', navPricing:'FİYATLAR', navLogin:'GİRİŞ', navLaunch:'BAŞLAT',
    featTitle:'YAPAY ZEKÂ YETENEKLERİ', procTitle:'SÜREÇ PROTOKOLÜ', priceTitle:'PLAN SEÇ',
    priceSub:'Tüm planlar OpenAI Whisper + GPT-4o + FFmpeg içerir',
    inputLabel:'GİRİŞ // HAM GÖRÜNTÜ', outputLabel:'ÇIKIŞ // VİRAL KLİPLER',
    inputTitle:'Sen çekersin. Yapay zekâ izler.', outputTitle:'Yapay zekâ keser. Sen viral olursun.',
    finalTitle1:'VİRAL OL.', finalTitle2:'ŞİMDİ.',
    finalSub:'152.000 içerik üreticisine katıl. Yapay zekâ çalışır. Sen izlenmeleri toplarsın.',
    finalCta:'ÜCRETSİZ DENEMEYİ BAŞLAT', recommended:'ÖNERİLEN', deploy:'ŞİMDİ BAŞLAT', initialize:'BAŞLAT' },

  ar:{ sys:'ذكاء المحتوى الفيروسي', hero1:'حوّل أي فيديو', hero2:'إلى مقاطع فيروسية',
    heroSub:'OpenAI Whisper + GPT-4o + FFmpeg. ارفع فيديو طويلاً — يستخرج الذكاء الاصطناعي اللحظات الفيروسية ويُنتج مقاطع 9:16 في دقائق.',
    ctaPrimary:'ابدأ مجاناً', ctaSecondary:'شاهد العملية',
    trust:'بدون بطاقة · 3 أيام مجاناً · ألغِ في أي وقت', scroll:'مرّر للاستكشاف',
    navFeatures:'الميزات', navProcess:'العملية', navPricing:'الأسعار', navLogin:'تسجيل الدخول', navLaunch:'ابدأ',
    featTitle:'قدرات الذكاء الاصطناعي', procTitle:'بروتوكول العملية', priceTitle:'اختر خطتك',
    priceSub:'جميع الخطط تشمل OpenAI Whisper + GPT-4o + FFmpeg',
    inputLabel:'إدخال // لقطات خام', outputLabel:'إخراج // مقاطع فيروسية',
    inputTitle:'أنت تصوّر. الذكاء الاصطناعي يراقب.', outputTitle:'الذكاء الاصطناعي يقص. أنت تنتشر.',
    finalTitle1:'انتشر فيروسياً.', finalTitle2:'الآن.',
    finalSub:'انضم إلى 152,000 صانع محتوى. الذكاء الاصطناعي يعمل. أنت تجمع المشاهدات.',
    finalCta:'فعّل التجربة المجانية', recommended:'موصى به', deploy:'ابدأ الآن', initialize:'ابدأ' },

  he:{ sys:'בינת תוכן ויראלי', hero1:'הפוך כל סרטון', hero2:'לקליפים ויראליים',
    heroSub:'OpenAI Whisper + GPT-4o + FFmpeg. העלה סרטון ארוך — ה-AI מאתר את הרגעים הוויראליים ומפיק קליפים 9:16 בדקות.',
    ctaPrimary:'התחל בחינם', ctaSecondary:'צפה בתהליך',
    trust:'ללא כרטיס · 3 ימים חינם · בטל בכל עת', scroll:'גלול כדי לחקור',
    navFeatures:'תכונות', navProcess:'תהליך', navPricing:'מחירים', navLogin:'התחבר', navLaunch:'שיגור',
    featTitle:'יכולות AI', procTitle:'פרוטוקול התהליך', priceTitle:'בחר תוכנית',
    priceSub:'כל התוכניות כוללות OpenAI Whisper + GPT-4o + FFmpeg',
    inputLabel:'קלט // חומר גלם', outputLabel:'פלט // קליפים ויראליים',
    inputTitle:'אתה מצלם. ה-AI צופה.', outputTitle:'ה-AI חותך. אתה הופך לוויראלי.',
    finalTitle1:'הפוך לוויראלי.', finalTitle2:'עכשיו.',
    finalSub:'הצטרף ל-152,000 יוצרים. ה-AI עובד. אתה אוסף את הצפיות.',
    finalCta:'הפעל ניסיון חינם', recommended:'מומלץ', deploy:'התחל עכשיו', initialize:'התחל' },

  hi:{ sys:'वायरल कंटेंट इंटेलिजेंस', hero1:'किसी भी वीडियो को बनाएं', hero2:'वायरल क्लिप्स',
    heroSub:'OpenAI Whisper + GPT-4o + FFmpeg. कोई लंबा वीडियो अपलोड करें — AI वायरल पल ढूंढता है और मिनटों में 9:16 क्लिप्स देता है।',
    ctaPrimary:'मुफ़्त शुरू करें', ctaSecondary:'प्रक्रिया देखें',
    trust:'कार्ड नहीं · 3 दिन मुफ़्त · कभी भी रद्द करें', scroll:'खोजने के लिए स्क्रॉल करें',
    navFeatures:'विशेषताएँ', navProcess:'प्रक्रिया', navPricing:'मूल्य', navLogin:'लॉगिन', navLaunch:'शुरू करें',
    featTitle:'AI क्षमताएँ', procTitle:'प्रक्रिया प्रोटोकॉल', priceTitle:'अपना प्लान चुनें',
    priceSub:'सभी प्लान में OpenAI Whisper + GPT-4o + FFmpeg शामिल है',
    inputLabel:'इनपुट // कच्चा फुटेज', outputLabel:'आउटपुट // वायरल क्लिप्स',
    inputTitle:'आप शूट करें. AI देखता है.', outputTitle:'AI काटता है. आप वायरल होते हैं.',
    finalTitle1:'वायरल बनें.', finalTitle2:'अभी.',
    finalSub:'1,52,000 क्रिएटर्स से जुड़ें। AI काम करता है। आप व्यूज़ बटोरते हैं।',
    finalCta:'मुफ़्त ट्रायल सक्रिय करें', recommended:'अनुशंसित', deploy:'अभी शुरू करें', initialize:'शुरू करें' },

  th:{ sys:'ปัญญาประดิษฐ์คอนเทนต์ไวรัล', hero1:'เปลี่ยนวิดีโอใดก็ได้', hero2:'ให้เป็นคลิปไวรัล',
    heroSub:'OpenAI Whisper + GPT-4o + FFmpeg. อัปโหลดวิดีโอยาว — AI ค้นหาช่วงเวลาไวรัลและสร้างคลิป 9:16 ในไม่กี่นาที',
    ctaPrimary:'เริ่มฟรี', ctaSecondary:'ดูขั้นตอน',
    trust:'ไม่ต้องใช้บัตร · ฟรี 3 วัน · ยกเลิกได้ทุกเมื่อ', scroll:'เลื่อนเพื่อสำรวจ',
    navFeatures:'ฟีเจอร์', navProcess:'ขั้นตอน', navPricing:'ราคา', navLogin:'เข้าสู่ระบบ', navLaunch:'เริ่ม',
    featTitle:'ความสามารถ AI', procTitle:'โปรโตคอลขั้นตอน', priceTitle:'เลือกแพ็กเกจ',
    priceSub:'ทุกแพ็กเกจมี OpenAI Whisper + GPT-4o + FFmpeg',
    inputLabel:'อินพุต // ฟุตเทจดิบ', outputLabel:'เอาต์พุต // คลิปไวรัล',
    inputTitle:'คุณถ่าย AI ดู', outputTitle:'AI ตัด คุณไวรัล',
    finalTitle1:'ไปไวรัล', finalTitle2:'เดี๋ยวนี้',
    finalSub:'ร่วมกับครีเอเตอร์ 152,000 คน AI ทำงาน คุณเก็บยอดวิว',
    finalCta:'เปิดใช้ทดลองฟรี', recommended:'แนะนำ', deploy:'เริ่มเลย', initialize:'เริ่ม' },

  vi:{ sys:'TRÍ TUỆ NỘI DUNG LAN TRUYỀN', hero1:'BIẾN MỌI VIDEO', hero2:'THÀNH CLIP VIRAL',
    heroSub:'OpenAI Whisper + GPT-4o + FFmpeg. Tải lên video dài — AI tìm các khoảnh khắc viral và tạo clip 9:16 trong vài phút.',
    ctaPrimary:'DÙNG THỬ MIỄN PHÍ', ctaSecondary:'XEM QUY TRÌNH',
    trust:'KHÔNG CẦN THẺ · 3 NGÀY MIỄN PHÍ · HỦY BẤT KỲ LÚC NÀO', scroll:'CUỘN ĐỂ KHÁM PHÁ',
    navFeatures:'TÍNH NĂNG', navProcess:'QUY TRÌNH', navPricing:'GIÁ', navLogin:'ĐĂNG NHẬP', navLaunch:'BẮT ĐẦU',
    featTitle:'NĂNG LỰC AI', procTitle:'GIAO THỨC QUY TRÌNH', priceTitle:'CHỌN GÓI',
    priceSub:'Tất cả gói đều bao gồm OpenAI Whisper + GPT-4o + FFmpeg',
    inputLabel:'ĐẦU VÀO // CẢNH QUAY THÔ', outputLabel:'ĐẦU RA // CLIP VIRAL',
    inputTitle:'Bạn quay. AI quan sát.', outputTitle:'AI cắt. Bạn viral.',
    finalTitle1:'TRỞ NÊN VIRAL.', finalTitle2:'NGAY BÂY GIỜ.',
    finalSub:'Tham gia 152.000 nhà sáng tạo. AI làm việc. Bạn thu về lượt xem.',
    finalCta:'KÍCH HOẠT DÙNG THỬ', recommended:'ĐỀ XUẤT', deploy:'BẮT ĐẦU NGAY', initialize:'BẮT ĐẦU' },

  id:{ sys:'INTELIJEN KONTEN VIRAL', hero1:'UBAH VIDEO APA PUN', hero2:'JADI KLIP VIRAL',
    heroSub:'OpenAI Whisper + GPT-4o + FFmpeg. Unggah video panjang — AI menemukan momen viral dan menghasilkan klip 9:16 dalam hitungan menit.',
    ctaPrimary:'MULAI GRATIS', ctaSecondary:'LIHAT PROSES',
    trust:'TANPA KARTU · GRATIS 3 HARI · BATALKAN KAPAN SAJA', scroll:'GULIR UNTUK MENJELAJAH',
    navFeatures:'FITUR', navProcess:'PROSES', navPricing:'HARGA', navLogin:'MASUK', navLaunch:'MULAI',
    featTitle:'KEMAMPUAN AI', procTitle:'PROTOKOL PROSES', priceTitle:'PILIH PAKET',
    priceSub:'Semua paket termasuk OpenAI Whisper + GPT-4o + FFmpeg',
    inputLabel:'MASUKAN // REKAMAN MENTAH', outputLabel:'KELUARAN // KLIP VIRAL',
    inputTitle:'Anda merekam. AI mengamati.', outputTitle:'AI memotong. Anda jadi viral.',
    finalTitle1:'JADI VIRAL.', finalTitle2:'SEKARANG.',
    finalSub:'Bergabunglah dengan 152.000 kreator. AI bekerja. Anda mengumpulkan tayangan.',
    finalCta:'AKTIFKAN UJI COBA GRATIS', recommended:'DIREKOMENDASIKAN', deploy:'MULAI SEKARANG', initialize:'MULAI' },

  ms:{ sys:'KECERDASAN KANDUNGAN VIRAL', hero1:'TUKAR MANA-MANA VIDEO', hero2:'KEPADA KLIP VIRAL',
    heroSub:'OpenAI Whisper + GPT-4o + FFmpeg. Muat naik video panjang — AI mencari detik viral dan menghasilkan klip 9:16 dalam beberapa minit.',
    ctaPrimary:'MULA PERCUMA', ctaSecondary:'LIHAT PROSES',
    trust:'TANPA KAD · 3 HARI PERCUMA · BATAL BILA-BILA MASA', scroll:'TATAL UNTUK MENEROKA',
    navFeatures:'CIRI', navProcess:'PROSES', navPricing:'HARGA', navLogin:'LOG MASUK', navLaunch:'MULA',
    featTitle:'KEUPAYAAN AI', procTitle:'PROTOKOL PROSES', priceTitle:'PILIH PELAN',
    priceSub:'Semua pelan termasuk OpenAI Whisper + GPT-4o + FFmpeg',
    inputLabel:'INPUT // RAKAMAN MENTAH', outputLabel:'OUTPUT // KLIP VIRAL',
    inputTitle:'Anda merakam. AI memerhati.', outputTitle:'AI memotong. Anda jadi viral.',
    finalTitle1:'JADI VIRAL.', finalTitle2:'SEKARANG.',
    finalSub:'Sertai 152,000 pencipta. AI bekerja. Anda kumpul tontonan.',
    finalCta:'AKTIFKAN PERCUBAAN PERCUMA', recommended:'DISYORKAN', deploy:'MULA SEKARANG', initialize:'MULA' },

  ja:{ sys:'バイラルコンテンツ インテリジェンス', hero1:'どんな動画も', hero2:'バイラルクリップに',
    heroSub:'OpenAI Whisper + GPT-4o + FFmpeg。長尺動画をアップロードするだけで、AIがバイラルな瞬間を抽出し、数分で9:16クリップを生成します。',
    ctaPrimary:'無料で始める', ctaSecondary:'プロセスを見る',
    trust:'カード不要 · 3日間無料 · いつでも解約', scroll:'スクロールして探索',
    navFeatures:'機能', navProcess:'プロセス', navPricing:'料金', navLogin:'ログイン', navLaunch:'開始',
    featTitle:'AI機能', procTitle:'パイプライン プロトコル', priceTitle:'プランを選択',
    priceSub:'すべてのプランに OpenAI Whisper + GPT-4o + FFmpeg を搭載',
    inputLabel:'入力 // 元素材', outputLabel:'出力 // バイラルクリップ',
    inputTitle:'あなたが撮影。AIが分析。', outputTitle:'AIが編集。あなたはバズる。',
    finalTitle1:'バズろう。', finalTitle2:'今すぐ。',
    finalSub:'152,000人のクリエイターに参加。AIが働き、あなたは再生数を集める。',
    finalCta:'無料トライアルを開始', recommended:'おすすめ', deploy:'今すぐ開始', initialize:'開始' },

  ko:{ sys:'바이럴 콘텐츠 인텔리전스', hero1:'어떤 영상이든', hero2:'바이럴 클립으로',
    heroSub:'OpenAI Whisper + GPT-4o + FFmpeg. 긴 영상을 업로드하면 AI가 바이럴 순간을 찾아 몇 분 만에 9:16 클립을 만듭니다.',
    ctaPrimary:'무료로 시작', ctaSecondary:'프로세스 보기',
    trust:'카드 불필요 · 3일 무료 · 언제든 취소', scroll:'스크롤하여 탐색',
    navFeatures:'기능', navProcess:'프로세스', navPricing:'요금', navLogin:'로그인', navLaunch:'시작',
    featTitle:'AI 기능', procTitle:'파이프라인 프로토콜', priceTitle:'플랜 선택',
    priceSub:'모든 플랜에 OpenAI Whisper + GPT-4o + FFmpeg 포함',
    inputLabel:'입력 // 원본 영상', outputLabel:'출력 // 바이럴 클립',
    inputTitle:'당신은 촬영. AI는 분석.', outputTitle:'AI가 편집. 당신은 바이럴.',
    finalTitle1:'바이럴 가자.', finalTitle2:'지금.',
    finalSub:'152,000명의 크리에이터와 함께하세요. AI가 일하고 당신은 조회수를 모읍니다.',
    finalCta:'무료 체험 활성화', recommended:'추천', deploy:'지금 시작', initialize:'시작' },

  zh:{ sys:'病毒内容智能', hero1:'让任何视频', hero2:'变成爆款短片',
    heroSub:'OpenAI Whisper + GPT-4o + FFmpeg。上传长视频，AI 自动找出爆款时刻，几分钟生成 9:16 短片。',
    ctaPrimary:'免费开始', ctaSecondary:'查看流程',
    trust:'无需信用卡 · 免费 3 天 · 随时取消', scroll:'滚动探索',
    navFeatures:'功能', navProcess:'流程', navPricing:'定价', navLogin:'登录', navLaunch:'启动',
    featTitle:'AI 能力', procTitle:'流程协议', priceTitle:'选择套餐',
    priceSub:'所有套餐均含 OpenAI Whisper + GPT-4o + FFmpeg',
    inputLabel:'输入 // 原始素材', outputLabel:'输出 // 爆款短片',
    inputTitle:'你拍摄，AI 观察。', outputTitle:'AI 剪辑，你爆火。',
    finalTitle1:'爆款。', finalTitle2:'立即。',
    finalSub:'加入 152,000 名创作者。AI 干活，你收割流量。',
    finalCta:'激活免费试用', recommended:'推荐', deploy:'立即启动', initialize:'开始' },

  zt:{ sys:'病毒內容智能', hero1:'讓任何影片', hero2:'變成爆紅短片',
    heroSub:'OpenAI Whisper + GPT-4o + FFmpeg。上傳長影片，AI 自動找出爆紅時刻，幾分鐘生成 9:16 短片。',
    ctaPrimary:'免費開始', ctaSecondary:'查看流程',
    trust:'無需信用卡 · 免費 3 天 · 隨時取消', scroll:'滾動探索',
    navFeatures:'功能', navProcess:'流程', navPricing:'定價', navLogin:'登入', navLaunch:'啟動',
    featTitle:'AI 能力', procTitle:'流程協議', priceTitle:'選擇方案',
    priceSub:'所有方案均含 OpenAI Whisper + GPT-4o + FFmpeg',
    inputLabel:'輸入 // 原始素材', outputLabel:'輸出 // 爆紅短片',
    inputTitle:'你拍攝，AI 觀察。', outputTitle:'AI 剪輯，你爆紅。',
    finalTitle1:'爆紅。', finalTitle2:'立即。',
    finalSub:'加入 152,000 名創作者。AI 工作，你收割流量。',
    finalCta:'啟用免費試用', recommended:'推薦', deploy:'立即啟動', initialize:'開始' },

  ca:{ sys:'INTEL·LIGÈNCIA DE CONTINGUT VIRAL', hero1:'CONVERTEIX QUALSEVOL VÍDEO', hero2:'EN CLIPS VIRALS',
    heroSub:'OpenAI Whisper + GPT-4o + FFmpeg. Puja un vídeo llarg — la IA extreu els moments virals i lliura clips 9:16 en minuts.',
    ctaPrimary:'COMENÇA GRATIS', ctaSecondary:'VEURE EL PROCÉS',
    trust:'SENSE TARGETA · 3 DIES GRATIS · CANCEL·LA QUAN VULGUIS', scroll:'DESPLAÇA\u2019T PER EXPLORAR',
    navFeatures:'FUNCIONS', navProcess:'PROCÉS', navPricing:'PREUS', navLogin:'ENTRAR', navLaunch:'INICIAR',
    featTitle:'CAPACITATS IA', procTitle:'PROTOCOL DEL PROCÉS', priceTitle:'TRIA EL TEU PLA',
    priceSub:'Tots els plans inclouen OpenAI Whisper + GPT-4o + FFmpeg',
    inputLabel:'ENTRADA // MATERIAL EN BRUT', outputLabel:'SORTIDA // CLIPS VIRALS',
    inputTitle:'Tu graves. La IA observa.', outputTitle:'La IA talla. Tu et fas viral.',
    finalTitle1:'FES-TE VIRAL.', finalTitle2:'ARA.',
    finalSub:'Uneix-te a 152.000 creadors. La IA treballa. Tu reculls les visualitzacions.',
    finalCta:'ACTIVA LA PROVA GRATIS', recommended:'RECOMANAT', deploy:'INICIAR ARA', initialize:'INICIAR' },

  /* hero-level coverage (rest falls back to EN) */
  is:{ hero1:'BREYTTU HVAÐA MYNDBANDI', hero2:'Í VEIRUKLIPP', ctaPrimary:'BYRJA FRÍTT', navLaunch:'BYRJA', finalCta:'VIRKJA FRÍA PRUFU', finalTitle1:'VERÐU VEIRULEGT.', finalTitle2:'NÚNA.' },
  et:{ hero1:'MUUDA IGA VIDEO', hero2:'VIRAALSETEKS KLIPPIDEKS', ctaPrimary:'ALUSTA TASUTA', navLaunch:'ALUSTA', finalCta:'AKTIVEERI TASUTA PROOV', finalTitle1:'MINE VIRAALSEKS.', finalTitle2:'KOHE.' },
  lv:{ hero1:'PĀRVĒRT JEBKURU VIDEO', hero2:'VIRĀLOS KLIPOS', ctaPrimary:'SĀKT BEZ MAKSAS', navLaunch:'SĀKT', finalCta:'AKTIVIZĒT BEZMAKSAS', finalTitle1:'KĻŪSTI VIRĀLS.', finalTitle2:'TAGAD.' },
  bg:{ hero1:'ПРЕВЪРНИ ВСЯКО ВИДЕО', hero2:'ВЪВ ВИРУСНИ КЛИПОВЕ', ctaPrimary:'ЗАПОЧНИ БЕЗПЛАТНО', navLaunch:'СТАРТ', finalCta:'АКТИВИРАЙ БЕЗПЛАТНО', finalTitle1:'СТАНИ ВИРУСЕН.', finalTitle2:'СЕГА.' },
  hr:{ hero1:'PRETVORI BILO KOJI VIDEO', hero2:'U VIRALNE KLIPOVE', ctaPrimary:'ZAPOČNI BESPLATNO', navLaunch:'POKRENI', finalCta:'AKTIVIRAJ BESPLATNO', finalTitle1:'POSTANI VIRALAN.', finalTitle2:'ODMAH.' },
  sr:{ hero1:'ПРЕТВОРИ БИЛО КОЈИ ВИДЕО', hero2:'У ВИРАЛНЕ КЛИПОВЕ', ctaPrimary:'ПОЧНИ БЕСПЛАТНО', navLaunch:'ПОКРЕНИ', finalCta:'АКТИВИРАЈ БЕСПЛАТНО', finalTitle1:'ПОСТАНИ ВИРАЛАН.', finalTitle2:'ОДМАХ.' },
  sl:{ hero1:'SPREMENI KATERI KOLI VIDEO', hero2:'V VIRALNE KLIPE', ctaPrimary:'ZAČNI BREZPLAČNO', navLaunch:'ZAŽENI', finalCta:'AKTIVIRAJ BREZPLAČNO', finalTitle1:'POSTANI VIRALEN.', finalTitle2:'ZDAJ.' },
  fa:{ hero1:'هر ویدیویی را تبدیل کن', hero2:'به کلیپ‌های وایرال', ctaPrimary:'رایگان شروع کن', navLaunch:'شروع', finalCta:'فعال‌سازی نسخه رایگان', finalTitle1:'وایرال شو.', finalTitle2:'همین حالا.' },
  bn:{ hero1:'যেকোনো ভিডিওকে বানান', hero2:'ভাইরাল ক্লিপ', ctaPrimary:'ফ্রি শুরু করুন', navLaunch:'শুরু', finalCta:'ফ্রি ট্রায়াল চালু করুন', finalTitle1:'ভাইরাল হোন।', finalTitle2:'এখনই।' },
  ur:{ hero1:'کسی بھی ویڈیو کو بنائیں', hero2:'وائرل کلپس', ctaPrimary:'مفت شروع کریں', navLaunch:'شروع', finalCta:'مفت ٹرائل فعال کریں', finalTitle1:'وائرل ہو جائیں۔', finalTitle2:'ابھی۔' },
  ta:{ hero1:'எந்த வீடியோவையும்', hero2:'வைரல் கிளிப்களாக', ctaPrimary:'இலவசமாக தொடங்கு', navLaunch:'தொடங்கு', finalCta:'இலவச சோதனையை இயக்கு', finalTitle1:'வைரல் ஆகு.', finalTitle2:'இப்போதே.' },
  te:{ hero1:'ఏ వీడియోనైనా మార్చండి', hero2:'వైరల్ క్లిప్‌లుగా', ctaPrimary:'ఉచితంగా ప్రారంభించండి', navLaunch:'ప్రారంభించు', finalCta:'ఉచిత ట్రయల్ యాక్టివేట్', finalTitle1:'వైరల్ అవ్వండి.', finalTitle2:'ఇప్పుడే.' },
  fil:{ hero1:'GAWING VIRAL', hero2:'ANG KAHIT ANONG VIDEO', ctaPrimary:'SIMULAN NANG LIBRE', navLaunch:'SIMULAN', finalCta:'I-ACTIVATE ANG LIBRENG TRIAL', finalTitle1:'MAGING VIRAL.', finalTitle2:'NGAYON NA.' },
  sw:{ hero1:'GEUZA VIDEO YOYOTE', hero2:'KUWA KLIPU ZA VIRALI', ctaPrimary:'ANZA BILA MALIPO', navLaunch:'ANZA', finalCta:'WASHA JARIBIO LA BURE', finalTitle1:'KUWA VIRALI.', finalTitle2:'SASA.' },
  am:{ hero1:'ማንኛውንም ቪዲዮ ቀይር', hero2:'ወደ ቫይራል ክሊፖች', ctaPrimary:'በነጻ ጀምር', navLaunch:'ጀምር', finalCta:'ነጻ ሙከራ አግብር', finalTitle1:'ቫይራል ሁን።', finalTitle2:'አሁን።' },
  yo:{ hero1:'SỌ FÍDÍÒ YÒWÙ', hero2:'DÌ ÀWỌN GẸ̀GẸ́ VIRAL', ctaPrimary:'BẸ̀RẸ̀ LÓFE', navLaunch:'BẸ̀RẸ̀', finalCta:'MÚ ÌDÁNWÒ Ọ̀FẸ́ ṢIṢẸ́', finalTitle1:'DÌ VIRAL.', finalTitle2:'NÍSINSÌNYÍ.' },
  zu:{ hero1:'GUQULA NOMA IYIPHI IVIDIYO', hero2:'IBE AMAKILIPHU AVIRAL', ctaPrimary:'QALA MAHHALA', navLaunch:'QALA', finalCta:'VULA ISIVIVINYO SAMAHHALA', finalTitle1:'YIBA VIRAL.', finalTitle2:'MANJE.' },
}

/* ── Full body-content translations (complete languages) ──
   These cover the feature cards, steps, pricing bullets, stat labels,
   process card, district labels and NOVA assistant. Languages not listed
   here fall back to English for body text while keeping translated
   headlines/nav/CTA. ── */
const BODY = {
  lt:{ distNexus:'CENTRINIS MAZGAS / VALDYMO CENTRAS', distIntel:'INTELEKTO RAJONAS', distFlow:'DUOMENŲ SRAUTO ARCHITEKTŪRA', distZone:'PALEIDIMO AIKŠTELĖ / DIEGIMO ZONA',
    stClips:'SUKURTŲ KLIPŲ', stScore:'VID. VIRUSINIS BALAS', stTime:'SUTAUPYTA LAIKO', stCreators:'KŪRĖJŲ',
    f1l:'VIRUSINIS VERTINIMAS', f1d:'Neuroninė analizė kiekvieną klipą įvertina 0–100 pagal kabliuko stiprumą, emocijų pikus ir dalijimosi potencialą.',
    f2l:'WHISPER DI', f2d:'OpenAI Whisper transkribuoja kalbą 50+ kalbų su milisekundžių tikslumo laiko žymomis.',
    f3l:'AUTO 9:16', f3d:'FFmpeg konvertuoja į TikTok, Reels ir Shorts su išmaniu kadravimu ir užpildymu.',
    f4l:'GPT-4 ANALIZĖ', f4d:'GPT-4o-mini suranda 5–8 didžiausio potencialo momentus bet kokiame ilgame turinyje.',
    f5l:'PASKELBIMAS VIENU PASPAUDIMU', f5d:'Siųskite klipus tiesiai į TikTok, Instagram Reels ir YouTube Shorts vienu metu.',
    f6l:'AKIMIRKSNIO KLIPAI', f6d:'Visas procesas trunka 3–8 minutes. Įkėlimas → virusiniai klipai, montavimo įgūdžių nereikia.',
    s1l:'ĮKELTI', s1d:'Įkelkite bet kokį MP4/MOV/AVI iki 500MB arba įklijuokite nuorodą. Saugi Cloudinary saugykla.',
    s2l:'TRANSKRIBUOTI', s2d:'OpenAI Whisper išgauna kalbą su segmentų laiko žymomis 50+ kalbų.',
    s3l:'ANALIZUOTI', s3d:'GPT-4o-mini atpažįsta virusinius momentus — kabliukus, emocijų pikus, cituotinus faktus.',
    s4l:'KARPYTI IR SKELBTI', s4d:'FFmpeg iškerpa klipus, konvertuoja į 9:16. Paskelbkite visur vienu paspaudimu.',
    procSim:'APDOROJIMO SIMULIACIJA', procAvg:'Vid. apdorojimas:', procClips:'45 min podkastas → 7 virusiniai klipai',
    peExtract:'IŠGAVIMAS', peTranscribe:'TRANSKRIPCIJA', peAnalyze:'ANALIZĖ', peCut:'KARPYMAS',
    tierWord:'PLANAS', perMo:'/mėn',
    pStarter1:'10 vaizdo įrašų/mėn', pStarter2:'Automatiniai Whisper subtitrai', pStarter3:'9:16 formatas', pStarter4:'5 klipai per įrašą', pStarter5:'El. pašto pagalba',
    pPro1:'50 vaizdo įrašų/mėn', pPro2:'50+ kalbų', pPro3:'Tiesioginis skelbimas', pPro4:'10 klipų per įrašą', pPro5:'Pirmenybinė eilė', pPro6:'API prieiga',
    pAgency1:'Neriboti vaizdo įrašai', pAgency2:'White-label skydelis', pAgency3:'Komandos erdvė', pAgency4:'Individualus prekės ženklas', pAgency5:'Skirta pagalba', pAgency6:'Webhook integracijos',
    nova1:'Sveiki atvykę į ClipGen.AI. Aš NOVA — jūsų DI turinio strategas. Įkelkite ilgą vaizdo įrašą, o aš automatiškai išgausiu virusinius momentus.',
    nova2:'Varoma OpenAI Whisper ir GPT-4o. Mūsų neuroninis variklis analizuoja kiekvieną turinio sekundę dėl maksimalaus virusinio potencialo.',
    nova3:'Visas procesas trunka 3–8 minutes. Montavimo įgūdžių nereikia — tiesiog įkelkite ir leiskite DI dirbti.',
    nova4:'Pradėkite nemokamai. Pro planas suteikia 50 vaizdo įrašų per mėnesį su tiesioginiu skelbimu visose platformose.' },

  es:{ distNexus:'CENTRO NEXUS / CENTRO DE MANDO', distIntel:'DISTRITO DE INTELIGENCIA', distFlow:'ARQUITECTURA DE DATOS', distZone:'PLATAFORMA DE LANZAMIENTO / ZONA DE DESPLIEGUE',
    stClips:'CLIPS GENERADOS', stScore:'PUNTUACIÓN VIRAL MEDIA', stTime:'TIEMPO AHORRADO', stCreators:'CREADORES',
    f1l:'PUNTUACIÓN VIRAL', f1d:'El análisis neuronal puntúa cada clip de 0 a 100 según el gancho, los picos de emoción y el potencial de difusión.',
    f2l:'WHISPER IA', f2d:'OpenAI Whisper transcribe el habla en más de 50 idiomas con marcas de tiempo de precisión milimétrica.',
    f3l:'AUTO 9:16', f3d:'El pipeline de FFmpeg reformatea a TikTok, Reels y Shorts con recorte y relleno inteligentes.',
    f4l:'ANÁLISIS GPT-4', f4d:'GPT-4o-mini encuentra los 5–8 momentos de mayor potencial de cualquier contenido largo.',
    f5l:'PUBLICAR EN 1 CLIC', f5d:'Envía clips directamente a TikTok, Instagram Reels y YouTube Shorts a la vez.',
    f6l:'CLIPS INSTANTÁNEOS', f6d:'Todo el proceso tarda 3–8 minutos. Sube y obtén clips virales, sin saber editar.',
    s1l:'SUBIR', s1d:'Suelta cualquier MP4/MOV/AVI hasta 500MB o pega una URL. Almacenamiento seguro en Cloudinary.',
    s2l:'TRANSCRIBIR', s2d:'OpenAI Whisper extrae el habla con marcas de tiempo por segmento en más de 50 idiomas.',
    s3l:'ANALIZAR', s3d:'GPT-4o-mini identifica momentos virales: ganchos, picos de emoción, frases citables.',
    s4l:'CORTAR Y PUBLICAR', s4d:'FFmpeg corta los clips y los reformatea a 9:16. Publica en todas las plataformas con un clic.',
    procSim:'SIMULACIÓN DE PROCESO', procAvg:'Proceso medio:', procClips:'Podcast de 45 min → 7 clips virales',
    peExtract:'EXTRAER', peTranscribe:'TRANSCRIBIR', peAnalyze:'ANALIZAR', peCut:'CORTAR',
    tierWord:'PLAN', perMo:'/mes',
    pStarter1:'10 vídeos/mes', pStarter2:'Subtítulos Whisper automáticos', pStarter3:'Reformato 9:16', pStarter4:'5 clips por vídeo', pStarter5:'Soporte por email',
    pPro1:'50 vídeos/mes', pPro2:'Más de 50 idiomas', pPro3:'Publicación directa', pPro4:'10 clips por vídeo', pPro5:'Cola prioritaria', pPro6:'Acceso API',
    pAgency1:'Vídeos ilimitados', pAgency2:'Panel de marca blanca', pAgency3:'Espacio de equipo', pAgency4:'Marca personalizada', pAgency5:'Soporte dedicado', pAgency6:'Integraciones webhook',
    nova1:'Bienvenido a ClipGen.AI. Soy NOVA, tu estratega de contenido con IA. Sube un vídeo largo y extraigo los momentos virales automáticamente.',
    nova2:'Con tecnología de OpenAI Whisper y GPT-4o. Nuestro motor neuronal analiza cada segundo de tu contenido para un máximo potencial viral.',
    nova3:'Todo el proceso tarda 3–8 minutos. No necesitas saber editar: solo sube y deja trabajar a la IA.',
    nova4:'Empieza gratis. El plan Pro te da 50 vídeos al mes con publicación directa en todas las plataformas.' },

  fr:{ distNexus:'NEXUS / CENTRE DE COMMANDE', distIntel:'DISTRICT INTELLIGENCE', distFlow:'ARCHITECTURE DES DONNÉES', distZone:'RAMPE DE LANCEMENT / ZONE DE DÉPLOIEMENT',
    stClips:'CLIPS GÉNÉRÉS', stScore:'SCORE VIRAL MOYEN', stTime:'TEMPS GAGNÉ', stCreators:'CRÉATEURS',
    f1l:'SCORE VIRAL', f1d:'L\u2019analyse neuronale note chaque clip de 0 à 100 selon l\u2019accroche, les pics d\u2019émotion et le potentiel de partage.',
    f2l:'WHISPER IA', f2d:'OpenAI Whisper transcrit la parole en plus de 50 langues avec un horodatage à la milliseconde.',
    f3l:'AUTO 9:16', f3d:'Le pipeline FFmpeg reformate pour TikTok, Reels et Shorts avec recadrage et marges intelligents.',
    f4l:'ANALYSE GPT-4', f4d:'GPT-4o-mini trouve les 5 à 8 moments à plus fort potentiel de tout contenu long.',
    f5l:'PUBLICATION EN 1 CLIC', f5d:'Envoyez vos clips directement sur TikTok, Instagram Reels et YouTube Shorts en même temps.',
    f6l:'CLIPS INSTANTANÉS', f6d:'Tout le processus prend 3 à 8 minutes. Importez, obtenez des clips viraux, sans savoir monter.',
    s1l:'IMPORTER', s1d:'Déposez un MP4/MOV/AVI jusqu\u2019à 500 Mo ou collez une URL. Stockage Cloudinary sécurisé.',
    s2l:'TRANSCRIRE', s2d:'OpenAI Whisper extrait la parole avec horodatage par segment en plus de 50 langues.',
    s3l:'ANALYSER', s3d:'GPT-4o-mini repère les moments viraux : accroches, pics d\u2019émotion, phrases citables.',
    s4l:'COUPER ET PUBLIER', s4d:'FFmpeg découpe les clips et reformate en 9:16. Publiez partout en un clic.',
    procSim:'SIMULATION DE TRAITEMENT', procAvg:'Traitement moyen :', procClips:'Podcast de 45 min → 7 clips viraux',
    peExtract:'EXTRAIRE', peTranscribe:'TRANSCRIRE', peAnalyze:'ANALYSER', peCut:'COUPER',
    tierWord:'OFFRE', perMo:'/mois',
    pStarter1:'10 vidéos/mois', pStarter2:'Sous-titres Whisper automatiques', pStarter3:'Reformatage 9:16', pStarter4:'5 clips par vidéo', pStarter5:'Support par e-mail',
    pPro1:'50 vidéos/mois', pPro2:'Plus de 50 langues', pPro3:'Publication directe', pPro4:'10 clips par vidéo', pPro5:'File prioritaire', pPro6:'Accès API',
    pAgency1:'Vidéos illimitées', pAgency2:'Tableau de bord marque blanche', pAgency3:'Espace d\u2019équipe', pAgency4:'Image de marque personnalisée', pAgency5:'Support dédié', pAgency6:'Intégrations webhook',
    nova1:'Bienvenue sur ClipGen.AI. Je suis NOVA, votre stratège de contenu IA. Importez une longue vidéo et j\u2019extrais automatiquement les moments viraux.',
    nova2:'Propulsé par OpenAI Whisper et GPT-4o. Notre moteur neuronal analyse chaque seconde de votre contenu pour un potentiel viral maximal.',
    nova3:'Tout le processus prend 3 à 8 minutes. Aucun montage requis : importez et laissez l\u2019IA travailler.',
    nova4:'Commencez gratuitement. L\u2019offre Pro vous donne 50 vidéos par mois avec publication directe sur toutes les plateformes.' },

  de:{ distNexus:'NEXUS / KOMMANDOZENTRALE', distIntel:'INTELLIGENZ-BEZIRK', distFlow:'DATENFLUSS-ARCHITEKTUR', distZone:'STARTRAMPE / DEPLOYMENT-ZONE',
    stClips:'ERSTELLTE CLIPS', stScore:'DURCHSCHN. VIRAL-SCORE', stTime:'GESPARTE ZEIT', stCreators:'CREATOR',
    f1l:'VIRAL-SCORING', f1d:'Die neuronale Analyse bewertet jeden Clip von 0–100 nach Hook-Stärke, Emotionsspitzen und Teilbarkeit.',
    f2l:'WHISPER KI', f2d:'OpenAI Whisper transkribiert Sprache in 50+ Sprachen mit millisekundengenauen Zeitstempeln.',
    f3l:'AUTO 9:16', f3d:'Die FFmpeg-Pipeline formatiert für TikTok, Reels und Shorts mit intelligentem Zuschnitt und Rand.',
    f4l:'GPT-4 ANALYSE', f4d:'GPT-4o-mini findet die 5–8 stärksten Momente aus jedem langen Inhalt.',
    f5l:'1-KLICK-VERÖFFENTLICHUNG', f5d:'Sende Clips direkt gleichzeitig an TikTok, Instagram Reels und YouTube Shorts.',
    f6l:'SOFORT-CLIPS', f6d:'Der gesamte Ablauf dauert 3–8 Minuten. Hochladen → virale Clips, ganz ohne Schnittkenntnisse.',
    s1l:'HOCHLADEN', s1d:'Lade ein beliebiges MP4/MOV/AVI bis 500 MB hoch oder füge eine URL ein. Sicherer Cloudinary-Speicher.',
    s2l:'TRANSKRIBIEREN', s2d:'OpenAI Whisper extrahiert Sprache mit Zeitstempeln pro Segment in 50+ Sprachen.',
    s3l:'ANALYSIEREN', s3d:'GPT-4o-mini erkennt virale Momente — Hooks, Emotionsspitzen, zitierfähige Fakten.',
    s4l:'SCHNEIDEN & POSTEN', s4d:'FFmpeg schneidet Clips, formatiert auf 9:16. Mit einem Klick auf alle Plattformen.',
    procSim:'VERARBEITUNGS-SIMULATION', procAvg:'Ø Verarbeitung:', procClips:'45-Min-Podcast → 7 virale Clips',
    peExtract:'EXTRAHIEREN', peTranscribe:'TRANSKRIBIEREN', peAnalyze:'ANALYSIEREN', peCut:'SCHNEIDEN',
    tierWord:'TARIF', perMo:'/Mon.',
    pStarter1:'10 Videos/Monat', pStarter2:'Automatische Whisper-Untertitel', pStarter3:'9:16-Format', pStarter4:'5 Clips pro Video', pStarter5:'E-Mail-Support',
    pPro1:'50 Videos/Monat', pPro2:'50+ Sprachen', pPro3:'Direktes Posten', pPro4:'10 Clips pro Video', pPro5:'Prioritäts-Warteschlange', pPro6:'API-Zugang',
    pAgency1:'Unbegrenzte Videos', pAgency2:'White-Label-Dashboard', pAgency3:'Team-Arbeitsbereich', pAgency4:'Eigenes Branding', pAgency5:'Dedizierter Support', pAgency6:'Webhook-Integrationen',
    nova1:'Willkommen bei ClipGen.AI. Ich bin NOVA — dein KI-Content-Stratege. Lade ein langes Video hoch, und ich extrahiere automatisch die viralen Momente.',
    nova2:'Angetrieben von OpenAI Whisper und GPT-4o. Unsere neuronale Engine analysiert jede Sekunde deines Inhalts für maximales virales Potenzial.',
    nova3:'Der gesamte Ablauf dauert 3–8 Minuten. Keine Schnittkenntnisse nötig — einfach hochladen und die KI arbeiten lassen.',
    nova4:'Starte kostenlos. Der Pro-Tarif bietet 50 Videos pro Monat mit direktem Posten auf allen großen Plattformen.' },

  pt:{ distNexus:'NEXUS / CENTRO DE COMANDO', distIntel:'DISTRITO DE INTELIGÊNCIA', distFlow:'ARQUITETURA DE DADOS', distZone:'PLATAFORMA DE LANÇAMENTO / ZONA DE IMPLANTAÇÃO',
    stClips:'CLIPES GERADOS', stScore:'PONTUAÇÃO VIRAL MÉDIA', stTime:'TEMPO ECONOMIZADO', stCreators:'CRIADORES',
    f1l:'PONTUAÇÃO VIRAL', f1d:'A análise neural pontua cada clipe de 0 a 100 pela força do gancho, picos de emoção e potencial de compartilhamento.',
    f2l:'WHISPER IA', f2d:'O OpenAI Whisper transcreve fala em mais de 50 idiomas com marcas de tempo precisas ao milissegundo.',
    f3l:'AUTO 9:16', f3d:'O pipeline FFmpeg reformata para TikTok, Reels e Shorts com corte e preenchimento inteligentes.',
    f4l:'ANÁLISE GPT-4', f4d:'O GPT-4o-mini encontra os 5–8 momentos de maior potencial de qualquer conteúdo longo.',
    f5l:'PUBLICAR EM 1 CLIQUE', f5d:'Envie clipes direto para TikTok, Instagram Reels e YouTube Shorts ao mesmo tempo.',
    f6l:'CLIPES INSTANTÂNEOS', f6d:'Todo o processo leva 3–8 minutos. Envie e receba clipes virais, sem precisar editar.',
    s1l:'ENVIAR', s1d:'Solte qualquer MP4/MOV/AVI até 500MB ou cole uma URL. Armazenamento seguro na Cloudinary.',
    s2l:'TRANSCREVER', s2d:'O OpenAI Whisper extrai a fala com marcas de tempo por segmento em mais de 50 idiomas.',
    s3l:'ANALISAR', s3d:'O GPT-4o-mini identifica momentos virais — ganchos, picos de emoção, frases citáveis.',
    s4l:'CORTAR E PUBLICAR', s4d:'O FFmpeg corta os clipes e reformata para 9:16. Publique em todas as plataformas com um clique.',
    procSim:'SIMULAÇÃO DE PROCESSAMENTO', procAvg:'Processamento médio:', procClips:'Podcast de 45 min → 7 clipes virais',
    peExtract:'EXTRAIR', peTranscribe:'TRANSCREVER', peAnalyze:'ANALISAR', peCut:'CORTAR',
    tierWord:'PLANO', perMo:'/mês',
    pStarter1:'10 vídeos/mês', pStarter2:'Legendas Whisper automáticas', pStarter3:'Reformato 9:16', pStarter4:'5 clipes por vídeo', pStarter5:'Suporte por e-mail',
    pPro1:'50 vídeos/mês', pPro2:'Mais de 50 idiomas', pPro3:'Publicação direta', pPro4:'10 clipes por vídeo', pPro5:'Fila prioritária', pPro6:'Acesso à API',
    pAgency1:'Vídeos ilimitados', pAgency2:'Painel white-label', pAgency3:'Espaço de equipe', pAgency4:'Marca personalizada', pAgency5:'Suporte dedicado', pAgency6:'Integrações webhook',
    nova1:'Bem-vindo à ClipGen.AI. Sou a NOVA — sua estrategista de conteúdo com IA. Envie um vídeo longo e eu extraio os momentos virais automaticamente.',
    nova2:'Com tecnologia OpenAI Whisper e GPT-4o. Nosso motor neural analisa cada segundo do seu conteúdo para o máximo potencial viral.',
    nova3:'Todo o processo leva 3–8 minutos. Não precisa saber editar — é só enviar e deixar a IA trabalhar.',
    nova4:'Comece grátis. O plano Pro dá 50 vídeos por mês com publicação direta em todas as grandes plataformas.' },

  it:{ distNexus:'NEXUS / CENTRO DI COMANDO', distIntel:'DISTRETTO INTELLIGENZA', distFlow:'ARCHITETTURA DEI DATI', distZone:'RAMPA DI LANCIO / ZONA DI RILASCIO',
    stClips:'CLIP GENERATE', stScore:'PUNTEGGIO VIRALE MEDIO', stTime:'TEMPO RISPARMIATO', stCreators:'CREATOR',
    f1l:'PUNTEGGIO VIRALE', f1d:'L\u2019analisi neurale valuta ogni clip da 0 a 100 in base ad aggancio, picchi emotivi e condivisibilità.',
    f2l:'WHISPER IA', f2d:'OpenAI Whisper trascrive il parlato in oltre 50 lingue con timestamp precisi al millisecondo.',
    f3l:'AUTO 9:16', f3d:'La pipeline FFmpeg riformatta per TikTok, Reels e Shorts con ritaglio e riempimento intelligenti.',
    f4l:'ANALISI GPT-4', f4d:'GPT-4o-mini trova i 5–8 momenti dal potenziale più alto in qualsiasi contenuto lungo.',
    f5l:'PUBBLICA IN 1 CLIC', f5d:'Invia le clip direttamente su TikTok, Instagram Reels e YouTube Shorts contemporaneamente.',
    f6l:'CLIP ISTANTANEE', f6d:'L\u2019intero processo dura 3–8 minuti. Carica e ottieni clip virali, senza saper montare.',
    s1l:'CARICA', s1d:'Trascina qualsiasi MP4/MOV/AVI fino a 500MB o incolla un URL. Archiviazione sicura su Cloudinary.',
    s2l:'TRASCRIVI', s2d:'OpenAI Whisper estrae il parlato con timestamp per segmento in oltre 50 lingue.',
    s3l:'ANALIZZA', s3d:'GPT-4o-mini individua i momenti virali: agganci, picchi emotivi, frasi citabili.',
    s4l:'TAGLIA E PUBBLICA', s4d:'FFmpeg taglia le clip e riformatta in 9:16. Pubblica ovunque con un clic.',
    procSim:'SIMULAZIONE DI ELABORAZIONE', procAvg:'Elaborazione media:', procClips:'Podcast di 45 min → 7 clip virali',
    peExtract:'ESTRAI', peTranscribe:'TRASCRIVI', peAnalyze:'ANALIZZA', peCut:'TAGLIA',
    tierWord:'PIANO', perMo:'/mese',
    pStarter1:'10 video/mese', pStarter2:'Sottotitoli Whisper automatici', pStarter3:'Riformato 9:16', pStarter4:'5 clip per video', pStarter5:'Supporto via email',
    pPro1:'50 video/mese', pPro2:'Oltre 50 lingue', pPro3:'Pubblicazione diretta', pPro4:'10 clip per video', pPro5:'Coda prioritaria', pPro6:'Accesso API',
    pAgency1:'Video illimitati', pAgency2:'Dashboard white-label', pAgency3:'Spazio per il team', pAgency4:'Branding personalizzato', pAgency5:'Supporto dedicato', pAgency6:'Integrazioni webhook',
    nova1:'Benvenuto su ClipGen.AI. Sono NOVA, la tua stratega di contenuti con IA. Carica un video lungo ed estraggo automaticamente i momenti virali.',
    nova2:'Basato su OpenAI Whisper e GPT-4o. Il nostro motore neurale analizza ogni secondo del tuo contenuto per il massimo potenziale virale.',
    nova3:'L\u2019intero processo dura 3–8 minuti. Nessuna competenza di montaggio: carica e lascia lavorare l\u2019IA.',
    nova4:'Inizia gratis. Il piano Pro ti dà 50 video al mese con pubblicazione diretta su tutte le principali piattaforme.' },

  ru:{ distNexus:'НЕКСУС / КОМАНДНЫЙ ЦЕНТР', distIntel:'РАЙОН ИНТЕЛЛЕКТА', distFlow:'АРХИТЕКТУРА ДАННЫХ', distZone:'СТАРТОВАЯ ПЛОЩАДКА / ЗОНА РАЗВЁРТЫВАНИЯ',
    stClips:'СОЗДАНО КЛИПОВ', stScore:'СРЕДНИЙ ВИРУСНЫЙ БАЛЛ', stTime:'СЭКОНОМЛЕНО ВРЕМЕНИ', stCreators:'АВТОРОВ',
    f1l:'ВИРУСНАЯ ОЦЕНКА', f1d:'Нейросеть оценивает каждый клип от 0 до 100 по силе зацепки, пикам эмоций и потенциалу репостов.',
    f2l:'WHISPER ИИ', f2d:'OpenAI Whisper расшифровывает речь на 50+ языках с точностью до миллисекунды.',
    f3l:'АВТО 9:16', f3d:'Конвейер FFmpeg переформатирует под TikTok, Reels и Shorts с умной обрезкой и полями.',
    f4l:'АНАЛИЗ GPT-4', f4d:'GPT-4o-mini находит 5–8 самых перспективных моментов в любом длинном видео.',
    f5l:'ПУБЛИКАЦИЯ В 1 КЛИК', f5d:'Отправляйте клипы сразу в TikTok, Instagram Reels и YouTube Shorts одновременно.',
    f6l:'МГНОВЕННЫЕ КЛИПЫ', f6d:'Весь процесс занимает 3–8 минут. Загрузка → вирусные клипы, навыки монтажа не нужны.',
    s1l:'ЗАГРУЗКА', s1d:'Перетащите любой MP4/MOV/AVI до 500 МБ или вставьте ссылку. Безопасное хранилище Cloudinary.',
    s2l:'РАСШИФРОВКА', s2d:'OpenAI Whisper извлекает речь с посегментными метками времени на 50+ языках.',
    s3l:'АНАЛИЗ', s3d:'GPT-4o-mini находит вирусные моменты — зацепки, пики эмоций, цитируемые факты.',
    s4l:'НАРЕЗКА И ПУБЛИКАЦИЯ', s4d:'FFmpeg нарезает клипы и переформатирует в 9:16. Публикуйте везде в один клик.',
    procSim:'СИМУЛЯЦИЯ ОБРАБОТКИ', procAvg:'Ср. обработка:', procClips:'Подкаст 45 мин → 7 вирусных клипов',
    peExtract:'ИЗВЛЕЧЕНИЕ', peTranscribe:'РАСШИФРОВКА', peAnalyze:'АНАЛИЗ', peCut:'НАРЕЗКА',
    tierWord:'ТАРИФ', perMo:'/мес',
    pStarter1:'10 видео/мес', pStarter2:'Авто-субтитры Whisper', pStarter3:'Формат 9:16', pStarter4:'5 клипов на видео', pStarter5:'Поддержка по email',
    pPro1:'50 видео/мес', pPro2:'50+ языков', pPro3:'Прямая публикация', pPro4:'10 клипов на видео', pPro5:'Приоритетная очередь', pPro6:'Доступ к API',
    pAgency1:'Безлимит видео', pAgency2:'White-label панель', pAgency3:'Рабочее пространство команды', pAgency4:'Свой брендинг', pAgency5:'Выделенная поддержка', pAgency6:'Webhook-интеграции',
    nova1:'Добро пожаловать в ClipGen.AI. Я NOVA — ваш ИИ-стратег контента. Загрузите длинное видео, и я автоматически извлеку вирусные моменты.',
    nova2:'На базе OpenAI Whisper и GPT-4o. Наш нейродвижок анализирует каждую секунду вашего контента ради максимального вирусного потенциала.',
    nova3:'Весь процесс занимает 3–8 минут. Навыки монтажа не нужны — просто загрузите и доверьте работу ИИ.',
    nova4:'Начните бесплатно. Тариф Pro даёт 50 видео в месяц с прямой публикацией на всех крупных платформах.' },

  zh:{ distNexus:'枢纽 / 指挥中心', distIntel:'智能区', distFlow:'数据流架构', distZone:'发射台 / 部署区',
    stClips:'已生成片段', stScore:'平均爆款评分', stTime:'节省时间', stCreators:'创作者',
    f1l:'爆款评分', f1d:'神经分析按钩子强度、情绪高峰和传播潜力为每个片段打 0–100 分。',
    f2l:'WHISPER AI', f2d:'OpenAI Whisper 以毫秒级时间戳转写 50 多种语言的语音。',
    f3l:'自动 9:16', f3d:'FFmpeg 流程智能裁剪与填充，重新适配 TikTok、Reels 和 Shorts。',
    f4l:'GPT-4 分析', f4d:'GPT-4o-mini 从任意长视频中找出 5–8 个最具潜力的时刻。',
    f5l:'一键发布', f5d:'将片段同时直接推送到 TikTok、Instagram Reels 和 YouTube Shorts。',
    f6l:'即时片段', f6d:'整个流程 3–8 分钟。上传即得爆款片段，无需剪辑技能。',
    s1l:'上传', s1d:'拖入任意不超过 500MB 的 MP4/MOV/AVI 或粘贴网址。安全的 Cloudinary 存储。',
    s2l:'转写', s2d:'OpenAI Whisper 以 50 多种语言提取语音并标注分段时间戳。',
    s3l:'分析', s3d:'GPT-4o-mini 识别爆款时刻——钩子、情绪高峰、可引用的金句。',
    s4l:'裁剪并发布', s4d:'FFmpeg 裁剪片段并重排为 9:16。一键发布到所有平台。',
    procSim:'处理模拟', procAvg:'平均处理：', procClips:'45 分钟播客 → 7 个爆款片段',
    peExtract:'提取', peTranscribe:'转写', peAnalyze:'分析', peCut:'裁剪',
    tierWord:'套餐', perMo:'/月',
    pStarter1:'每月 10 个视频', pStarter2:'自动 Whisper 字幕', pStarter3:'9:16 重排', pStarter4:'每视频 5 个片段', pStarter5:'邮件支持',
    pPro1:'每月 50 个视频', pPro2:'50 多种语言', pPro3:'直接发布', pPro4:'每视频 10 个片段', pPro5:'优先队列', pPro6:'API 访问',
    pAgency1:'无限视频', pAgency2:'白标仪表板', pAgency3:'团队工作区', pAgency4:'自定义品牌', pAgency5:'专属支持', pAgency6:'Webhook 集成',
    nova1:'欢迎来到 ClipGen.AI。我是 NOVA——你的 AI 内容策略师。上传长视频，我会自动提取爆款时刻。',
    nova2:'由 OpenAI Whisper 与 GPT-4o 驱动。我们的神经引擎分析你内容的每一秒，挖掘最大爆款潜力。',
    nova3:'整个流程仅需 3–8 分钟。无需剪辑技能——上传即可，交给 AI。',
    nova4:'免费开始。Pro 套餐每月 50 个视频，并可直接发布到所有主流平台。' },
}

/* merge each language with EN fallback + full body translations */
const I18N = Object.fromEntries(
  LANGS.map(l => [l.code, { ...EN, ...(RAW[l.code] || {}), ...(BODY[l.code] || {}) }])
)

/* ════════════════════════════════════════════════════════════════
   STATIC DATA  (color stored as palette key, resolved at render)
   ════════════════════════════════════════════════════════════════ */
const FEATURES = [
  { icon:'gauge',    key:'cyan',   stat:'9.8 avg',     lk:'f1l', dk:'f1d' },
  { icon:'captions', key:'blue',   stat:'50+ langs',   lk:'f2l', dk:'f2d' },
  { icon:'portrait', key:'purple', stat:'1080×1920',   lk:'f3l', dk:'f3d' },
  { icon:'sparkles', key:'pink',   stat:'GPT-4o',      lk:'f4l', dk:'f4d' },
  { icon:'share',    key:'gold',   stat:'3 platforms', lk:'f5l', dk:'f5d' },
  { icon:'zap',      key:'cyan',   stat:'<8 min',      lk:'f6l', dk:'f6d' },
]

const STEPS = [
  { n:'01', icon:'upload',   lk:'s1l', dk:'s1d' },
  { n:'02', icon:'captions', lk:'s2l', dk:'s2d' },
  { n:'03', icon:'sparkles', lk:'s3l', dk:'s3d' },
  { n:'04', icon:'scissors', lk:'s4l', dk:'s4d' },
]

const PLANS = [
  { name:'STARTER', price:'€29', key:'blue',   hot:false, fk:['pStarter1','pStarter2','pStarter3','pStarter4','pStarter5'] },
  { name:'PRO',     price:'€59', key:'purple', hot:true,  fk:['pPro1','pPro2','pPro3','pPro4','pPro5','pPro6'] },
  { name:'AGENCY',  price:'€99', key:'purple', hot:false, fk:['pAgency1','pAgency2','pAgency3','pAgency4','pAgency5','pAgency6'] },
]

/* ════════════════════════════════════════════════════════════════
   ICONS  (clean stroke SVGs — video-tool vocabulary, no sci-fi)
   ════════════════════════════════════════════════════════════════ */
const ICON_PATHS = {
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
}
function Icon({ name, size=20, color='currentColor', stroke=2, fill='none' }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth={stroke}
    strokeLinecap="round" strokeLinejoin="round" dangerouslySetInnerHTML={{ __html: ICON_PATHS[name] || '' }} />
}

/* Flying connected dots — subtle, brand-tinted (toned down, not "space") */
function ParticleField({ P }) {
  const ref = useRef(null)
  useEffect(() => {
    const c = ref.current; if (!c) return
    const ctx = c.getContext('2d'); let w, h
    const resize = () => { w = c.width = window.innerWidth; h = c.height = window.innerHeight }
    resize(); window.addEventListener('resize', resize)
    const N = Math.max(36, Math.min(80, Math.floor(window.innerWidth / 22)))
    const dot = P.purple, line = P.cyan
    const pts = Array.from({ length:N }, () => ({ x:Math.random()*w, y:Math.random()*h, vx:(Math.random()-.5)*.5, vy:(Math.random()-.5)*.5, r:Math.random()*1.8+.7 }))
    let raf
    const hex2 = (n) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2,'0')
    const draw = () => {
      ctx.clearRect(0,0,w,h)
      for (const p of pts) {
        p.x += p.vx; p.y += p.vy
        if (p.x < 0 || p.x > w) p.vx *= -1
        if (p.y < 0 || p.y > h) p.vy *= -1
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2); ctx.fillStyle = dot + '66'; ctx.fill()
      }
      for (let i=0;i<N;i++) for (let j=i+1;j<N;j++) {
        const dx = pts[i].x-pts[j].x, dy = pts[i].y-pts[j].y, d = Math.hypot(dx,dy)
        if (d < 130) { ctx.beginPath(); ctx.moveTo(pts[i].x,pts[i].y); ctx.lineTo(pts[j].x,pts[j].y)
          ctx.strokeStyle = line + hex2((1 - d/130) * 45); ctx.lineWidth = .5; ctx.stroke() }
      }
      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [P.purple, P.cyan])
  return <canvas ref={ref} style={{ position:'fixed', inset:0, zIndex:0, pointerEvents:'none', opacity:P.dark?0.7:0.5 }} />
}

/* Brand logo — drops in /logo.png automatically; branded fallback until then */
function Logo({ P, size=36 }) {
  const [err, setErr] = useState(false)
  if (!err) return <img src="/logo.png" alt="ClipGen.AI" onError={()=>setErr(true)} style={{ width:size, height:size, borderRadius:9, objectFit:'contain' }} />
  return (
    <div style={{ width:size, height:size, borderRadius:9, background:`linear-gradient(135deg, ${P.purple}, ${P.blue})`, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:`0 4px 14px ${P.purple}55` }}>
      <Icon name="film" size={size*0.5} color="#fff" stroke={2.2} />
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════
   UI PRIMITIVES
   ════════════════════════════════════════════════════════════════ */
function Btn({ children, onClick, accent, big, ghost, P, full }) {
  const [h,setH]=useState(false)
  const col = accent || P.cyan
  return (
    <button onClick={onClick} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)} style={{
      fontFamily:P.fontD, fontWeight:700, fontSize:big?15:13, letterSpacing:0.3,
      padding:big?'14px 28px':'10px 18px', borderRadius:10, cursor:'pointer',
      border: ghost?`1px solid ${P.line}`:'none', width: full?'100%':'auto',
      background: ghost?'transparent':col, color: ghost?P.text:'#fff',
      boxShadow: ghost?'none':(h?`0 10px 28px ${col}55`:`0 4px 14px ${col}33`),
      transform: h?'translateY(-1px)':'none', transition:'all .2s',
      display:'inline-flex', alignItems:'center', justifyContent:'center', gap:8, whiteSpace:'nowrap',
    }}>{children}</button>
  )
}

function Card({ children, P, style:s={}, hover=true }) {
  const [h,setH]=useState(false)
  return (
    <div onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)} style={{
      background:P.surface, border:`1px solid ${h&&hover?P.cyan+'55':P.line}`, borderRadius:16,
      boxShadow: h&&hover ? (P.dark?'0 16px 40px rgba(0,0,0,0.4)':'0 16px 40px rgba(15,30,55,0.12)') : (P.dark?'0 2px 8px rgba(0,0,0,0.2)':'0 2px 8px rgba(15,30,55,0.05)'),
      transform: h&&hover?'translateY(-3px)':'none', transition:'all .25s', ...s,
    }}>{children}</div>
  )
}

/* ════════════════════════════════════════════════════════════════
   HERO ANIMATION HELPERS
   ════════════════════════════════════════════════════════════════ */
// Word-by-word rise-in reveal (works for any language/script)
function WordReveal({ text, delay=0, gradient, P }) {
  const words = String(text).split(' ')
  return words.map((w,i) => (
    <span key={i} style={{ display:'inline-block', whiteSpace:'pre',
      animation:`wordUp .7s cubic-bezier(.2,.9,.3,1) ${(delay + i*0.09).toFixed(2)}s both${gradient?', gradFlow 5s linear infinite':''}`,
      ...(gradient ? { backgroundImage:`linear-gradient(90deg, ${P.purple}, ${P.blue}, ${P.cyan}, ${P.purple})`, backgroundSize:'300% auto', WebkitBackgroundClip:'text', backgroundClip:'text', WebkitTextFillColor:'transparent', color:'transparent' } : {}),
    }}>{w}{i < words.length-1 ? '\u00A0' : ''}</span>
  ))
}

// Rotating output-format word (universal platform names — no translation needed)
function RotatingFormat({ P }) {
  const FORMATS = [['TikTok',P.cyan],['Reels',P.pink],['Shorts',P.purple],['YouTube',P.blue],['Podcasts',P.gold]]
  const [idx,setIdx] = useState(0)
  useEffect(() => { const id = setInterval(()=>setIdx(i=>(i+1)%FORMATS.length), 1900); return ()=>clearInterval(id) }, [])
  const [word,col] = FORMATS[idx]
  return (
    <div style={{ display:'inline-flex', alignItems:'center', gap:10, padding:'8px 16px', borderRadius:30, border:`1px solid ${P.line}`, background:P.surface, boxShadow:P.dark?'0 4px 14px rgba(0,0,0,0.25)':'0 4px 14px rgba(15,30,55,0.06)' }}>
      <Icon name="share" size={15} color={P.muted} stroke={2} />
      <span style={{ fontFamily:FONT_MONO, fontSize:12, color:P.muted, letterSpacing:1 }}>auto-publish to</span>
      <span style={{ position:'relative', display:'inline-block', height:'1.35em', minWidth:78, overflow:'hidden', textAlign:'left' }}>
        <span key={idx} style={{ display:'inline-block', fontFamily:FONT_DISPLAY2, fontWeight:800, fontSize:14, color:col, animation:'flipUp .5s cubic-bezier(.2,.9,.3,1)' }}>{word}</span>
      </span>
    </div>
  )
}

// Count-up number for stats
function CountUp({ value, color, font, size }) {
  const m = String(value).match(/^([\d.]+)(.*)$/)
  const target = m ? parseFloat(m[1]) : 0
  const suffix = m ? m[2] : String(value)
  const [n,setN] = useState(0)
  useEffect(() => {
    let f=0, raf; const total=55
    const step=()=>{ f++; const p=f/total; setN(target<10?Math.round(target*p*10)/10:Math.round(target*p)); if(f<total) raf=requestAnimationFrame(step); else setN(target) }
    raf=requestAnimationFrame(step); return ()=>cancelAnimationFrame(raf)
  }, [target])
  return <span style={{ fontFamily:font, fontWeight:900, fontSize:size, color }}>{n}{suffix}</span>
}


/* ════════════════════════════════════════════════════════════════
   EDITOR MOCKUP  — the centerpiece: a believable AI clipping app
   ════════════════════════════════════════════════════════════════ */
const MOCK_CLIPS = [
  { img:IMG.clip1, score:9.8, dur:'0:42', at:18, col:'cyan'   },
  { img:IMG.clip2, score:9.2, dur:'0:31', at:42, col:'gold'   },
  { img:IMG.clip3, score:9.6, dur:'0:55', at:64, col:'purple' },
  { img:IMG.clip1, score:9.4, dur:'0:38', at:83, col:'blue'   },
]

function EditorMockup({ P, t, isMobile }) {
  const [head, setHead] = useState(0)        // playhead %
  const [done, setDone] = useState([])       // indices of clips found
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let pct = 0, raf
    const loop = () => {
      pct += 0.4
      setHead(pct); setProgress(Math.min(100, pct))
      MOCK_CLIPS.forEach((c,i) => { if (pct >= c.at) setDone(prev => prev.includes(i)?prev:[...prev,i]) })
      if (pct < 100) raf = requestAnimationFrame(loop)
      else setTimeout(() => { pct = 0; setHead(0); setDone([]); setProgress(0); raf = requestAnimationFrame(loop) }, 3200)
    }
    const start = setTimeout(()=>{ raf = requestAnimationFrame(loop) }, 600)
    return () => { clearTimeout(start); cancelAnimationFrame(raf) }
  }, [])

  // waveform bars
  const BARS = Array.from({length:120},(_,i)=>Math.max(0.12, Math.abs(Math.sin(i*0.5)*Math.cos(i*0.17)*0.7 + Math.sin(i*0.09)*0.3)))
  const scanning = progress < 100

  const win = {
    background:P.surface, border:`1px solid ${P.line}`, borderRadius:16, overflow:'hidden',
    boxShadow: P.dark?'0 30px 80px rgba(0,0,0,0.55)':'0 30px 80px rgba(15,30,55,0.18)',
    width:'100%', maxWidth:1000, margin:'0 auto', textAlign:'left',
  }

  return (
    <div style={win}>
      {/* Title bar */}
      <div style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 16px', borderBottom:`1px solid ${P.line}`, background:P.bgAlt }}>
        <div style={{ display:'flex', gap:7 }}>
          {['#ff5f57','#febc2e','#28c840'].map(c=> <div key={c} style={{ width:12, height:12, borderRadius:'50%', background:c }} />)}
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:8, marginLeft:6 }}>
          <Icon name="film" size={15} color={P.cyan} />
          <span style={{ fontFamily:P.fontD, fontWeight:700, fontSize:12, color:P.text }}>ClipGen Studio</span>
        </div>
        <span style={{ fontFamily:FONT_MONO, fontSize:11, color:P.muted, marginLeft:4 }}>— interview_keynote.mp4</span>
        <div style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:8 }}>
          <span style={{ fontFamily:FONT_MONO, fontSize:10, color: scanning?P.cyan:'#28c840', letterSpacing:1 }}>
            {scanning ? `ANALYZING ${Math.round(progress)}%` : '✓ DONE'}
          </span>
        </div>
      </div>

      {/* Body: player + clips */}
      <div style={{ display:'grid', gridTemplateColumns: isMobile?'1fr':'1fr 230px' }}>
        {/* Player + timeline */}
        <div style={{ padding:14, borderRight: isMobile?'none':`1px solid ${P.line}` }}>
          {/* video frame */}
          <div style={{ position:'relative', borderRadius:10, overflow:'hidden', aspectRatio:'16/9', background:'#000' }}>
            <img src={IMG.creator} alt="" style={{ width:'100%', height:'100%', objectFit:'cover', opacity:0.92 }} />
            <div style={{ position:'absolute', inset:0, background:'linear-gradient(180deg, transparent 60%, rgba(0,0,0,0.6))' }} />
            <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:54, height:54, borderRadius:'50%', background:'rgba(255,255,255,0.16)', backdropFilter:'blur(6px)', display:'flex', alignItems:'center', justifyContent:'center', border:'1px solid rgba(255,255,255,0.4)' }}>
              <Icon name="play" size={22} color="#fff" fill="#fff" stroke={0} />
            </div>
            <div style={{ position:'absolute', left:10, right:10, bottom:10, display:'flex', alignItems:'center', gap:8 }}>
              <Icon name="play" size={12} color="#fff" fill="#fff" stroke={0} />
              <div style={{ flex:1, height:3, background:'rgba(255,255,255,0.25)', borderRadius:2 }}>
                <div style={{ width:`${head}%`, height:'100%', background:P.cyan, borderRadius:2 }} />
              </div>
              <span style={{ fontFamily:FONT_MONO, fontSize:10, color:'#fff' }}>{String(Math.floor(head*0.45)).padStart(2,'0')}:32 / 45:32</span>
            </div>
          </div>

          {/* Timeline */}
          <div style={{ marginTop:12 }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
              <span style={{ fontFamily:FONT_MONO, fontSize:10, color:P.muted, letterSpacing:1 }}>TIMELINE — AI VIRAL DETECTION</span>
              <span style={{ fontFamily:FONT_MONO, fontSize:10, color:P.muted }}>{done.length}/4 {t('stClips')}</span>
            </div>
            <div style={{ position:'relative', height:54, background:P.bgAlt, borderRadius:8, border:`1px solid ${P.line}`, overflow:'hidden', display:'flex', alignItems:'center', gap:1, padding:'0 4px' }}>
              {BARS.map((bh,i)=>{
                const pct=(i/BARS.length)*100
                const scanned = pct<=head
                const hit = MOCK_CLIPS.some(c=>Math.abs(pct-c.at)<4)
                return <div key={i} style={{ flex:1, height:`${bh*70}%`, borderRadius:1,
                  background: hit ? P.gold : scanned ? P.cyan : P.muted,
                  opacity: scanned?(hit?1:0.65):0.28, transition:'all .15s' }} />
              })}
              {/* clip segment markers */}
              {MOCK_CLIPS.map((c,i)=> done.includes(i) && (
                <div key={i} style={{ position:'absolute', top:0, bottom:0, left:`${c.at}%`, width:2, background:P[c.col], boxShadow:`0 0 8px ${P[c.col]}` }}>
                  <div style={{ position:'absolute', top:2, left:'50%', transform:'translateX(-50%)', background:P[c.col], color:'#fff', fontSize:8, fontWeight:700, padding:'1px 4px', borderRadius:3, fontFamily:FONT_MONO, whiteSpace:'nowrap' }}>{c.score}</div>
                </div>
              ))}
              {/* playhead */}
              {scanning && (
                <div style={{ position:'absolute', top:0, bottom:0, left:`${head}%`, width:2, background:'#fff', boxShadow:`0 0 10px ${P.cyan}` }} />
              )}
            </div>
          </div>
        </div>

        {/* Clips sidebar */}
        <div style={{ padding:14, background:P.bgAlt }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12 }}>
            <Icon name="sparkles" size={15} color={P.purple} />
            <span style={{ fontFamily:P.fontD, fontWeight:700, fontSize:12, color:P.text }}>AI Clips</span>
            <span style={{ fontFamily:FONT_MONO, fontSize:10, color:'#fff', background:P.purple, borderRadius:10, padding:'1px 7px', marginLeft:'auto' }}>{done.length}</span>
          </div>
          <div style={{ display:'grid', gridTemplateColumns: isMobile?'repeat(4,1fr)':'1fr 1fr', gap:8 }}>
            {MOCK_CLIPS.map((c,i)=> done.includes(i) && (
              <div key={i} style={{ position:'relative', borderRadius:8, overflow:'hidden', aspectRatio:'9/16', border:`1px solid ${P[c.col]}55`, animation:'popIn .35s ease-out' }}>
                <img src={c.img} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                <div style={{ position:'absolute', inset:0, background:'linear-gradient(180deg, transparent 45%, rgba(0,0,0,0.78))' }} />
                <div style={{ position:'absolute', top:4, right:4, background:P[c.col], color:'#fff', fontSize:9, fontWeight:700, padding:'1px 5px', borderRadius:4, fontFamily:FONT_MONO }}>{c.score}</div>
                <div style={{ position:'absolute', bottom:4, left:4, right:4, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <span style={{ fontFamily:FONT_MONO, fontSize:8, color:'#fff' }}>{c.dur}</span>
                  <Icon name="portrait" size={10} color="#fff" stroke={2} />
                </div>
              </div>
            ))}
            {done.length===0 && Array.from({length:isMobile?4:2}).map((_,i)=>(
              <div key={i} style={{ borderRadius:8, aspectRatio:'9/16', border:`1px dashed ${P.line}`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                <Icon name="film" size={16} color={P.muted} />
              </div>
            ))}
          </div>
          {!isMobile && done.length>0 && (
            <div style={{ marginTop:12 }}><Btn P={P} accent={P.cyan} full><Icon name="share" size={13} color="#fff" stroke={2.2}/> Export all</Btn></div>
          )}
        </div>
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════
   MAIN
   ════════════════════════════════════════════════════════════════ */
export default function Landing() {
  const navigate = useNavigate()
  const [isDark, setIsDark] = useState(() => localStorage.getItem('clipgen_theme') !== 'light')
  const toggleTheme = () => setIsDark(d => { localStorage.setItem('clipgen_theme', d ? 'light' : 'dark'); return !d })

  const [lang, setLang] = useState(() => localStorage.getItem('clipgen_lang') || 'en')
  const t = (k) => (I18N[lang] || EN)[k] || EN[k] || k
  const isRTL = LANGS.find(l => l.code === lang)?.rtl
  const setLanguage = (code) => { setLang(code); localStorage.setItem('clipgen_lang', code) }

  const P = { ...makePalette(isDark), fontD: fd(lang) }
  const accentFor = (k) => P[k] || P.cyan

  const [isMobile, setIsMobile] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 860)
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('resize', onResize); window.addEventListener('scroll', onScroll); onResize()
    return () => { window.removeEventListener('resize', onResize); window.removeEventListener('scroll', onScroll) }
  }, [])

  const scrollTo = (id) => { document.getElementById(id)?.scrollIntoView({ behavior:'smooth' }); setMenuOpen(false) }
  const go = () => navigate('/signup')
  const navLinks = [[t('navFeatures'),'features'],[t('navProcess'),'how'],[t('navPricing'),'pricing']]
  const PAD = isMobile ? '0 20px' : '0 48px'

  return (
    <div dir={isRTL?'rtl':'ltr'} style={{ fontFamily:FONT_BODY, background:P.bg, color:P.text, minHeight:'100vh', overflowX:'hidden', transition:'background .3s, color .3s' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;700&display=swap&subset=latin,latin-ext');
        *{box-sizing:border-box;margin:0;padding:0;}
        html{scroll-behavior:smooth;}
        ::selection{background:${P.cyan}33;}
        ::-webkit-scrollbar{width:8px;}::-webkit-scrollbar-thumb{background:${P.line};border-radius:4px;}
        @keyframes popIn{0%{opacity:0;transform:scale(.85)}100%{opacity:1;transform:scale(1)}}
        @keyframes fadeUp{0%{opacity:0;transform:translateY(16px)}100%{opacity:1;transform:translateY(0)}}
        @keyframes floaty{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
        @keyframes wordUp{0%{opacity:0;transform:translateY(28px) rotate(2deg)}100%{opacity:1;transform:translateY(0) rotate(0)}}
        @keyframes gradFlow{0%{background-position:0% 50%}100%{background-position:300% 50%}}
        @keyframes flipUp{0%{opacity:0;transform:translateY(110%)}100%{opacity:1;transform:translateY(0)}}
        @keyframes drift{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(40px,-30px) scale(1.08)}66%{transform:translate(-30px,20px) scale(.96)}}
        @keyframes shimmerLine{0%{transform:translateX(-100%)}100%{transform:translateX(300%)}}
        @media(max-width:859px){.hide-mob{display:none!important;}}
        @media(min-width:860px){.show-mob{display:none!important;}}
      `}</style>

      {/* soft background accent */}
      <div style={{ position:'fixed', inset:0, zIndex:0, pointerEvents:'none', background:`radial-gradient(900px 500px at 70% -5%, ${P.purple}1a, transparent 60%), radial-gradient(700px 500px at 0% 10%, ${P.cyan}12, transparent 55%)` }} />
      {/* flying dots (brought back, subtle) */}
      <ParticleField P={P} />
      {/* drifting blobs */}
      <div style={{ position:'fixed', top:'8%', left:'12%', width:340, height:340, borderRadius:'50%', zIndex:0, pointerEvents:'none', background:`radial-gradient(circle, ${P.purple}22, transparent 70%)`, filter:'blur(20px)', animation:'drift 18s ease-in-out infinite' }} />
      <div style={{ position:'fixed', top:'20%', right:'8%', width:300, height:300, borderRadius:'50%', zIndex:0, pointerEvents:'none', background:`radial-gradient(circle, ${P.cyan}1c, transparent 70%)`, filter:'blur(20px)', animation:'drift 22s ease-in-out infinite reverse' }} />

      {/* NAV */}
      <nav style={{ position:'fixed', top:0, left:0, right:0, zIndex:100, height:64, display:'flex', alignItems:'center', justifyContent:'space-between', padding:PAD,
        background: scrolled?P.glass:'transparent', backdropFilter:scrolled?'blur(14px)':'none', borderBottom:`1px solid ${scrolled?P.line:'transparent'}`, transition:'all .3s' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, cursor:'pointer' }} onClick={()=>window.scrollTo({top:0,behavior:'smooth'})}>
          <Logo P={P} size={36} />
          <div>
            <div style={{ fontFamily:fd(lang), fontWeight:900, fontSize:16, letterSpacing:0.5, color:P.text }}>ClipGen<span style={{ color:P.purple }}>.AI</span></div>
            <div style={{ fontFamily:FONT_MONO, fontSize:8, color:P.muted, letterSpacing:1.5 }}>{t('sys')}</div>
          </div>
        </div>

        <div className="hide-mob" style={{ display:'flex', gap:30, alignItems:'center' }}>
          {navLinks.map(([label,id])=>(
            <button key={id} onClick={()=>scrollTo(id)} style={{ background:'none', border:'none', cursor:'pointer', fontFamily:fd(lang), fontSize:13, fontWeight:600, letterSpacing:0.5, color:P.muted, transition:'color .2s' }}
              onMouseEnter={e=>e.target.style.color=P.text} onMouseLeave={e=>e.target.style.color=P.muted}>{label}</button>
          ))}
        </div>

        <div style={{ display:'flex', gap:10, alignItems:'center' }}>
          <select value={lang} onChange={e=>setLanguage(e.target.value)} className="hide-mob" style={{ padding:'7px 8px', borderRadius:8, border:`1px solid ${P.line}`, background:P.surface, color:P.text, fontSize:12, fontFamily:FONT_BODY, cursor:'pointer', outline:'none', maxWidth:140 }}>
            {LANGS.map(l=> <option key={l.code} value={l.code} style={{ background:P.surface, color:P.text }}>{l.flag} {l.label}</option>)}
          </select>
          <button onClick={toggleTheme} title="Theme" style={{ width:36, height:36, borderRadius:8, border:`1px solid ${P.line}`, background:P.surface, color:P.text, cursor:'pointer', fontSize:15, display:'flex', alignItems:'center', justifyContent:'center' }}>{isDark?'☀':'☾'}</button>
          <div className="hide-mob"><Btn onClick={go} accent={P.purple} P={P}>{t('navLaunch')}</Btn></div>
          <button className="show-mob" onClick={()=>setMenuOpen(!menuOpen)} style={{ width:36, height:36, borderRadius:8, border:`1px solid ${P.line}`, background:P.surface, color:P.text, fontSize:18, cursor:'pointer' }}>{menuOpen?'✕':'☰'}</button>
        </div>
      </nav>

      {/* MOBILE DRAWER */}
      {menuOpen && (
        <div className="show-mob" style={{ position:'fixed', top:64, left:0, right:0, zIndex:99, background:P.surface, borderBottom:`1px solid ${P.line}`, padding:20, display:'flex', flexDirection:'column', gap:16 }}>
          {navLinks.map(([label,id])=>(
            <button key={id} onClick={()=>scrollTo(id)} style={{ background:'none', border:'none', color:P.text, fontFamily:fd(lang), fontSize:16, fontWeight:700, textAlign:'left', cursor:'pointer' }}>{label}</button>
          ))}
          <button onClick={()=>{navigate('/signin');setMenuOpen(false)}} style={{ background:'none', border:'none', color:P.muted, fontFamily:fd(lang), fontSize:14, textAlign:'left', cursor:'pointer' }}>{t('navLogin')}</button>
          <select value={lang} onChange={e=>setLanguage(e.target.value)} style={{ padding:'12px', borderRadius:8, border:`1px solid ${P.line}`, background:P.bgAlt, color:P.text, fontSize:14, fontFamily:FONT_BODY }}>
            {LANGS.map(l=> <option key={l.code} value={l.code}>{l.flag} {l.label}</option>)}
          </select>
          <Btn onClick={go} accent={P.purple} big full P={P}>{t('navLaunch')}</Btn>
        </div>
      )}

      {/* HERO */}
      <section id="top" style={{ position:'relative', zIndex:1, padding: isMobile?'110px 20px 50px':'130px 48px 70px', textAlign:'center' }}>
        <div style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'6px 14px', borderRadius:20, border:`1px solid ${P.line}`, background:P.surface, marginBottom:24, animation:'fadeUp .5s ease-out both' }}>
          <span style={{ width:7, height:7, borderRadius:'50%', background:'#28c840', boxShadow:'0 0 8px #28c840' }} />
          <span style={{ fontFamily:FONT_MONO, fontSize:11, color:P.muted, letterSpacing:1 }}>{t('sys')}</span>
        </div>

        <h1 key={lang} style={{ fontFamily:fd(lang), fontWeight:900, fontSize:isMobile?'clamp(30px,8vw,40px)':'clamp(42px,5.5vw,68px)', lineHeight:1.08, letterSpacing:'-1.5px', color:P.text, maxWidth:920, margin:'0 auto' }}>
          <WordReveal text={t('hero1')} delay={0.15} P={P} />{'\u00A0'}
          <WordReveal text={t('hero2')} delay={0.15 + String(t('hero1')).split(' ').length*0.09} gradient P={P} />
        </h1>

        <p style={{ fontFamily:FONT_BODY, fontSize:isMobile?16:19, color:P.muted, lineHeight:1.7, maxWidth:600, margin:'22px auto 0', animation:'fadeUp .7s ease-out .5s both' }}>{t('heroSub')}</p>

        <div style={{ display:'flex', gap:14, flexWrap:'wrap', justifyContent:'center', margin:'30px 0 14px', animation:'fadeUp .7s ease-out .65s both' }}>
          <Btn onClick={go} accent={P.purple} big P={P}><Icon name="upload" size={16} color="#fff" stroke={2.2}/> {t('ctaPrimary')}</Btn>
          <Btn onClick={()=>scrollTo('how')} ghost big P={P}><Icon name="play" size={14} color={P.text} fill={P.text} stroke={0}/> {t('ctaSecondary')}</Btn>
        </div>
        <div style={{ fontFamily:FONT_MONO, fontSize:11, color:P.muted, letterSpacing:1, marginBottom:24 }}>{t('trust')}</div>

        {/* rotating platform formats */}
        <div style={{ marginBottom:48, animation:'fadeUp .7s ease-out .8s both' }}><RotatingFormat P={P} /></div>

        {/* EDITOR MOCKUP */}
        <div style={{ animation:'fadeUp 1s ease-out .9s both' }}>
          <div style={{ animation:'floaty 7s ease-in-out infinite' }}>
            <EditorMockup P={P} t={t} isMobile={isMobile} />
          </div>
        </div>

        {/* stats */}
        <div style={{ display:'flex', flexWrap:'wrap', justifyContent:'center', gap:isMobile?24:56, marginTop:48 }}>
          {[['2.4M+',t('stClips'),P.cyan],['96',t('stScore'),P.blue],['10×',t('stTime'),P.purple],['152K',t('stCreators'),P.gold]].map(([v,l,c],i)=>(
            <div key={i} style={{ textAlign:'center' }}>
              <CountUp value={v} color={c} font={fd(lang)} size={isMobile?26:34} />
              <div style={{ fontFamily:FONT_MONO, fontSize:10, color:P.muted, letterSpacing:1, marginTop:2 }}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" style={{ position:'relative', zIndex:1, padding: isMobile?'60px 20px':'90px 48px' }}>
        <div style={{ maxWidth:1100, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:48 }}>
            <div style={{ fontFamily:FONT_MONO, fontSize:12, color:P.cyan, letterSpacing:2, marginBottom:10 }}>{t('navFeatures')}</div>
            <h2 style={{ fontFamily:fd(lang), fontWeight:900, fontSize:isMobile?28:42, letterSpacing:'-1px', color:P.text }}>{t('featTitle')}</h2>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:isMobile?'1fr':'repeat(3,1fr)', gap:18 }}>
            {FEATURES.map((f,i)=>{ const col=accentFor(f.key); return (
              <Card key={i} P={P} style={{ padding:26 }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18 }}>
                  <div style={{ width:46, height:46, borderRadius:12, background:`${col}1a`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <Icon name={f.icon} size={22} color={col} stroke={2} />
                  </div>
                  <span style={{ fontFamily:FONT_MONO, fontSize:11, color:col, fontWeight:700 }}>{f.stat}</span>
                </div>
                <div style={{ fontFamily:fd(lang), fontWeight:700, fontSize:16, color:P.text, marginBottom:8 }}>{t(f.lk)}</div>
                <div style={{ fontFamily:FONT_BODY, fontSize:14.5, color:P.muted, lineHeight:1.65 }}>{t(f.dk)}</div>
              </Card>
            )})}
          </div>
        </div>
      </section>

      {/* SHOWCASE BAND */}
      <section style={{ position:'relative', zIndex:1, padding: isMobile?'20px 20px':'30px 48px' }}>
        <div style={{ maxWidth:1100, margin:'0 auto', display:'grid', gridTemplateColumns:isMobile?'1fr':'1fr 1fr', gap:18 }}>
          {[[IMG.creator,'cyan','inputLabel','inputTitle','inputDesc','film'],[IMG.dataCore,'purple','outputLabel','outputTitle','outputDesc','sparkles']].map(([img,ck,lab,ti,de,ic],i)=>{
            const col=accentFor(ck); return (
            <div key={i} style={{ position:'relative', minHeight:260, borderRadius:18, overflow:'hidden', border:`1px solid ${P.line}` }}>
              <img src={img} alt="" style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', opacity:P.dark?0.45:0.7 }} />
              <div style={{ position:'absolute', inset:0, background:`linear-gradient(135deg, ${P.bg}f0, ${P.bg}aa 60%, ${col}22)` }} />
              <div style={{ position:'relative', zIndex:1, padding:30, height:'100%', display:'flex', flexDirection:'column', justifyContent:'flex-end' }}>
                <div style={{ width:42, height:42, borderRadius:11, background:`${col}22`, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:14 }}>
                  <Icon name={ic} size={20} color={col} />
                </div>
                <div style={{ fontFamily:FONT_MONO, fontSize:10, color:col, letterSpacing:2, marginBottom:6 }}>{t(lab)}</div>
                <div style={{ fontFamily:fd(lang), fontWeight:800, fontSize:isMobile?22:26, color:P.text, lineHeight:1.2 }}>{t(ti)}</div>
                <div style={{ fontFamily:FONT_BODY, fontSize:14.5, color:P.muted, marginTop:10, lineHeight:1.6 }}>{t(de)}</div>
              </div>
            </div>
          )})}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" style={{ position:'relative', zIndex:1, padding: isMobile?'60px 20px':'90px 48px' }}>
        <div style={{ maxWidth:1000, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:50 }}>
            <div style={{ fontFamily:FONT_MONO, fontSize:12, color:P.purple, letterSpacing:2, marginBottom:10 }}>{t('navProcess')}</div>
            <h2 style={{ fontFamily:fd(lang), fontWeight:900, fontSize:isMobile?28:42, letterSpacing:'-1px', color:P.text }}>{t('procTitle')}</h2>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:isMobile?'1fr':'repeat(4,1fr)', gap:18 }}>
            {STEPS.map((s,i)=>{ const col=i<2?P.blue:P.purple; return (
              <Card key={i} P={P} hover={false} style={{ padding:24, textAlign:'center', position:'relative' }}>
                <div style={{ width:54, height:54, borderRadius:14, background:`${col}1a`, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px' }}>
                  <Icon name={s.icon} size={24} color={col} />
                </div>
                <div style={{ fontFamily:FONT_MONO, fontSize:11, color:col, marginBottom:6 }}>STEP {s.n}</div>
                <div style={{ fontFamily:fd(lang), fontWeight:700, fontSize:15, color:P.text, marginBottom:8 }}>{t(s.lk)}</div>
                <div style={{ fontFamily:FONT_BODY, fontSize:13.5, color:P.muted, lineHeight:1.6 }}>{t(s.dk)}</div>
              </Card>
            )})}
          </div>
          {/* processing summary strip */}
          <Card P={P} hover={false} style={{ marginTop:24, padding:'22px 26px', display:'flex', flexWrap:'wrap', alignItems:'center', justifyContent:'space-between', gap:20 }}>
            <div>
              <div style={{ fontFamily:FONT_MONO, fontSize:10, color:P.cyan, letterSpacing:2, marginBottom:6 }}>{t('procSim')}</div>
              <div style={{ fontFamily:fd(lang), fontWeight:700, fontSize:16, color:P.text }}>{t('procAvg')} <span style={{ color:P.cyan }}>4:32</span></div>
              <div style={{ fontFamily:FONT_BODY, fontSize:13.5, color:P.muted, marginTop:3 }}>{t('procClips')}</div>
            </div>
            <div style={{ display:'flex', gap:22, flexWrap:'wrap' }}>
              {[[t('peExtract'),P.purple,'20s'],[t('peTranscribe'),P.blue,'90s'],[t('peAnalyze'),P.cyan,'45s'],[t('peCut'),P.gold,'135s']].map(([l,c,tm])=>(
                <div key={l} style={{ textAlign:'center' }}>
                  <div style={{ fontFamily:FONT_MONO, fontSize:17, fontWeight:700, color:c }}>{tm}</div>
                  <div style={{ fontFamily:FONT_MONO, fontSize:9, color:P.muted, letterSpacing:1 }}>{l}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" style={{ position:'relative', zIndex:1, padding: isMobile?'60px 20px 80px':'90px 48px 120px' }}>
        <div style={{ maxWidth:980, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:50 }}>
            <div style={{ fontFamily:FONT_MONO, fontSize:12, color:P.gold, letterSpacing:2, marginBottom:10 }}>{t('navPricing')}</div>
            <h2 style={{ fontFamily:fd(lang), fontWeight:900, fontSize:isMobile?28:42, letterSpacing:'-1px', color:P.text }}>{t('priceTitle')}</h2>
            <p style={{ fontFamily:FONT_BODY, fontSize:15, color:P.muted, marginTop:12 }}>{t('priceSub')}</p>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:isMobile?'1fr':'repeat(3,1fr)', gap:18, alignItems:'start' }}>
            {PLANS.map((p,i)=>{ const col=accentFor(p.key); return (
              <Card key={i} P={P} hover={!p.hot} style={{ padding:28, position:'relative', border:p.hot?`2px solid ${col}`:`1px solid ${P.line}`, transform:p.hot&&!isMobile?'scale(1.04)':'none' }}>
                {p.hot && <div style={{ position:'absolute', top:-12, left:'50%', transform:'translateX(-50%)', background:col, color:'#fff', fontFamily:FONT_MONO, fontSize:10, fontWeight:700, letterSpacing:1, padding:'4px 14px', borderRadius:20, whiteSpace:'nowrap' }}>{t('recommended')}</div>}
                <div style={{ fontFamily:FONT_MONO, fontSize:11, color:col, letterSpacing:2, marginBottom:10 }}>{t('tierWord')} · {p.name}</div>
                <div style={{ display:'flex', alignItems:'baseline', gap:4, marginBottom:18 }}>
                  <span style={{ fontFamily:fd(lang), fontSize:46, fontWeight:900, color:P.text, letterSpacing:'-1px' }}>{p.price}</span>
                  <span style={{ fontFamily:FONT_MONO, fontSize:13, color:P.muted }}>{t('perMo')}</span>
                </div>
                <Btn onClick={go} accent={col} full big={p.hot} P={P}>{p.hot?t('deploy'):t('initialize')}</Btn>
                <div style={{ display:'flex', flexDirection:'column', gap:11, marginTop:20 }}>
                  {p.fk.map((fkey,j)=>(
                    <div key={j} style={{ display:'flex', alignItems:'center', gap:10 }}>
                      <Icon name="check" size={16} color={col} stroke={2.5} />
                      <span style={{ fontFamily:FONT_BODY, fontSize:14, color:P.muted }}>{t(fkey)}</span>
                    </div>
                  ))}
                </div>
              </Card>
            )})}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section style={{ position:'relative', zIndex:1, padding:isMobile?'10px 20px 70px':'20px 48px 100px' }}>
        <Card P={P} hover={false} style={{ maxWidth:900, margin:'0 auto', padding:isMobile?'40px 24px':'60px 40px', textAlign:'center', background:`linear-gradient(135deg, ${P.purple}1a, ${P.cyan}14)`, border:`1px solid ${P.purple}33` }}>
          <h2 style={{ fontFamily:fd(lang), fontWeight:900, fontSize:isMobile?30:48, letterSpacing:'-1.5px', color:P.text, lineHeight:1.05 }}>{t('finalTitle1')} <span style={{ color:P.purple }}>{t('finalTitle2')}</span></h2>
          <p style={{ fontFamily:FONT_BODY, fontSize:16, color:P.muted, margin:'16px auto 30px', maxWidth:520, lineHeight:1.6 }}>{t('finalSub')}</p>
          <div style={{ display:'flex', justifyContent:'center' }}><Btn onClick={go} accent={P.purple} big P={P}><Icon name="upload" size={16} color="#fff" stroke={2.2}/> {t('finalCta')}</Btn></div>
          <div style={{ fontFamily:FONT_MONO, fontSize:11, color:P.muted, letterSpacing:1, marginTop:16 }}>{t('trust')}</div>
        </Card>
      </section>

      {/* FOOTER */}
      <footer style={{ position:'relative', zIndex:1, borderTop:`1px solid ${P.line}`, background:P.bgAlt, padding:isMobile?'24px 20px':'28px 48px', display:'flex', flexWrap:'wrap', alignItems:'center', justifyContent:'space-between', gap:16 }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <Logo P={P} size={30} />
          <span style={{ fontFamily:fd(lang), fontWeight:900, fontSize:14, color:P.text }}>ClipGen<span style={{ color:P.purple }}>.AI</span></span>
        </div>
        <div style={{ fontFamily:FONT_MONO, fontSize:11, color:P.muted }}>© {new Date().getFullYear()} ClipGen.AI — {t('sys')}</div>
        <div style={{ display:'flex', gap:22 }}>
          {navLinks.map(([label,id])=>(
            <button key={id} onClick={()=>scrollTo(id)} style={{ background:'none', border:'none', cursor:'pointer', fontFamily:FONT_BODY, fontSize:13, color:P.muted }}
              onMouseEnter={e=>e.target.style.color=P.text} onMouseLeave={e=>e.target.style.color=P.muted}>{label}</button>
          ))}
        </div>
      </footer>
    </div>
  )
}

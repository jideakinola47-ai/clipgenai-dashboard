import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

/* ════════════════════════════════════════════════════════════════
   FONTS
   Orbitron = cyberpunk display — ASCII/basic-Latin only.
   Exo 2 latin-ext = same aesthetic + full Lithuanian/Polish/Czech
   diacritics (Č Š Ž Ū Ę etc). We swap to Exo 2 for any language
   that uses extended Latin characters.
   ════════════════════════════════════════════════════════════════ */
const FONT_DISPLAY  = "'Orbitron','Exo 2',monospace"   // ASCII headlines
const FONT_DISPLAY2 = "'Exo 2','Rajdhani',monospace"   // extended-Latin headlines (lt, pl, cs…)
const FONT_BODY     = "'Rajdhani','Share Tech Mono',sans-serif"
const FONT_MONO     = "'Share Tech Mono','Courier New',monospace"
// Languages that need extended Latin fallback (Orbitron lacks diacritics)
const EXTENDED_LATIN = new Set(['lt','pl','cs','sk','hu','ro','tr','et','lv','hr','sr','sl','ca','is','fi','da','no','sv'])
const fd = (lang) => EXTENDED_LATIN.has(lang) ? FONT_DISPLAY2 : FONT_DISPLAY

/* ════════════════════════════════════════════════════════════════
   THEME-AWARE PALETTE  (accents adjust for contrast in each mode)
   ════════════════════════════════════════════════════════════════ */
function makePalette(d) {
  return {
    dark:   d,
    bg:     d ? '#020308'              : '#eef2f8',
    bgAlt:  d ? '#060d18'              : '#e3eaf4',
    navy:   d ? '#0a1424'              : '#dbe5f3',
    text:   d ? '#e8f4ff'              : '#0a1626',
    muted:  d ? '#6a82a6'              : '#5a6f8c',
    glass:  d ? 'rgba(12,28,52,0.55)'  : 'rgba(255,255,255,0.70)',
    cyan:   d ? '#00d4ff'              : '#0094c7',
    blue:   d ? '#2b8bff'              : '#0a5fd0',
    purple: d ? '#9d5bff'              : '#7028c8',
    pink:   d ? '#ff2d78'              : '#d61f63',
    gold:   d ? '#ffd60a'              : '#b88600',
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
  { icon:'◉',  key:'cyan',   stat:'9.8 avg',     lk:'f1l', dk:'f1d' },
  { icon:'⟨⟩', key:'blue',   stat:'50+ langs',   lk:'f2l', dk:'f2d' },
  { icon:'◑',  key:'purple', stat:'1080×1920',   lk:'f3l', dk:'f3d' },
  { icon:'⬡',  key:'pink',   stat:'GPT-4o',      lk:'f4l', dk:'f4d' },
  { icon:'◈',  key:'gold',   stat:'3 platforms', lk:'f5l', dk:'f5d' },
  { icon:'▲',  key:'cyan',   stat:'<8 min',      lk:'f6l', dk:'f6d' },
]

const STEPS = [
  { n:'01', lk:'s1l', dk:'s1d' },
  { n:'02', lk:'s2l', dk:'s2d' },
  { n:'03', lk:'s3l', dk:'s3d' },
  { n:'04', lk:'s4l', dk:'s4d' },
]

const PLANS = [
  { name:'STARTER', price:'€29', key:'blue',   hot:false, fk:['pStarter1','pStarter2','pStarter3','pStarter4','pStarter5'] },
  { name:'PRO',     price:'€59', key:'cyan',   hot:true,  fk:['pPro1','pPro2','pPro3','pPro4','pPro5','pPro6'] },
  { name:'AGENCY',  price:'€99', key:'purple', hot:false, fk:['pAgency1','pAgency2','pAgency3','pAgency4','pAgency5','pAgency6'] },
]

const BOOT_LINES = [
  'CLIPGEN.AI OS v2077.06.03',
  'INITIALIZING NEURAL CORE...',
  'CONNECTING TO GLOBAL NETWORK...',
  'LOADING VIRAL DETECTION ENGINE...',
  'AUTHENTICATING USER CREDENTIALS...',
  'CALIBRATING AI ASSISTANT NOVA...',
  '████████████████████ 100%',
  '✓ ACCESS GRANTED — WELCOME TO CLIPGEN.AI',
]

/* ════════════════════════════════════════════════════════════════
   PRESENTATIONAL COMPONENTS
   ════════════════════════════════════════════════════════════════ */
function HoloCursor({ color }) {
  const outerRef = useRef(null), innerRef = useRef(null)
  const pos = useRef({ x:0, y:0 }), outer = useRef({ x:0, y:0 })
  useEffect(() => {
    const move = (e) => {
      pos.current = { x:e.clientX, y:e.clientY }
      if (innerRef.current) innerRef.current.style.transform = `translate(${e.clientX-4}px,${e.clientY-4}px)`
    }
    window.addEventListener('mousemove', move)
    let raf
    const lerp = (a,b,t)=>a+(b-a)*t
    const tick = () => {
      outer.current.x = lerp(outer.current.x, pos.current.x, 0.12)
      outer.current.y = lerp(outer.current.y, pos.current.y, 0.12)
      if (outerRef.current) outerRef.current.style.transform = `translate(${outer.current.x-20}px,${outer.current.y-20}px)`
      raf = requestAnimationFrame(tick)
    }
    tick()
    return () => { window.removeEventListener('mousemove', move); cancelAnimationFrame(raf) }
  }, [])
  return (
    <>
      <div ref={outerRef} style={{ position:'fixed', top:0, left:0, zIndex:9999, pointerEvents:'none', width:40, height:40, borderRadius:'50%', border:`1px solid ${color}88`, boxShadow:`0 0 12px ${color}44`, willChange:'transform' }} />
      <div ref={innerRef} style={{ position:'fixed', top:0, left:0, zIndex:9999, pointerEvents:'none', width:8, height:8, borderRadius:'50%', background:color, boxShadow:`0 0 8px ${color}`, willChange:'transform' }} />
    </>
  )
}

function NeuralCanvas({ P }) {
  useEffect(() => {
    const c = document.getElementById('neural-cv'); if (!c) return
    const ctx = c.getContext('2d')
    const resize = () => { c.width = window.innerWidth; c.height = window.innerHeight }
    resize(); window.addEventListener('resize', resize)
    const N = 110
    const pts = Array.from({ length:N }, () => ({
      x:Math.random()*window.innerWidth, y:Math.random()*window.innerHeight,
      vx:(Math.random()-.5)*.3, vy:(Math.random()-.5)*.3,
      r:Math.random()*1.5+.5, ph:Math.random()*Math.PI*2,
      color: Math.random()>.5 ? P.cyan : P.blue,
    }))
    let raf
    const draw = () => {
      ctx.clearRect(0,0,c.width,c.height)
      pts.forEach(p => {
        p.x+=p.vx; p.y+=p.vy; p.ph+=.012
        if(p.x<0)p.x=c.width; if(p.x>c.width)p.x=0
        if(p.y<0)p.y=c.height; if(p.y>c.height)p.y=0
        ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2)
        const a = .3+.25*Math.sin(p.ph)
        ctx.fillStyle = p.color + Math.round(a*255).toString(16).padStart(2,'0'); ctx.fill()
      })
      for(let i=0;i<N;i++) for(let j=i+1;j<N;j++){
        const d=Math.hypot(pts[i].x-pts[j].x,pts[i].y-pts[j].y)
        if(d<100){ ctx.beginPath(); ctx.moveTo(pts[i].x,pts[i].y); ctx.lineTo(pts[j].x,pts[j].y)
          ctx.strokeStyle = P.cyan + Math.round(.08*(1-d/100)*255).toString(16).padStart(2,'0'); ctx.lineWidth=.4; ctx.stroke() }
      }
      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [P.cyan, P.blue])
  return <canvas id="neural-cv" style={{ position:'fixed', inset:0, pointerEvents:'none', zIndex:0 }} />
}

function GridOverlay({ P }) {
  const c = P.cyan + (P.dark ? '08' : '0f')
  return <div style={{ position:'fixed', inset:0, zIndex:0, pointerEvents:'none', backgroundImage:`linear-gradient(${c} 1px,transparent 1px),linear-gradient(90deg,${c} 1px,transparent 1px)`, backgroundSize:'60px 60px' }} />
}

function HudCorner({ pos, color }) {
  const sz = 20
  const map = {
    tl:[{top:0,left:0},{borderTop:`2px solid ${color}`,borderLeft:`2px solid ${color}`}],
    tr:[{top:0,right:0},{borderTop:`2px solid ${color}`,borderRight:`2px solid ${color}`}],
    bl:[{bottom:0,left:0},{borderBottom:`2px solid ${color}`,borderLeft:`2px solid ${color}`}],
    br:[{bottom:0,right:0},{borderBottom:`2px solid ${color}`,borderRight:`2px solid ${color}`}],
  }
  const [s, b] = map[pos]
  return <div style={{ position:'absolute', width:sz, height:sz, ...s, ...b }} />
}

function GlassCard({ children, accent, P, style:s={} }) {
  const [h, setH] = useState(false)
  const col = accent || P.cyan
  return (
    <div onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)} style={{
      position:'relative', background:P.glass, backdropFilter:'blur(20px)',
      border:`1px solid ${col}${h?'55':'22'}`, borderRadius:4, padding:2,
      transition:'border-color .3s, box-shadow .3s',
      boxShadow: h ? `0 0 32px ${col}22, inset 0 0 32px ${col}08` : 'none', ...s,
    }}>
      <HudCorner pos="tl" color={col} /><HudCorner pos="tr" color={col} />
      <HudCorner pos="bl" color={col} /><HudCorner pos="br" color={col} />
      <div style={{ padding:24 }}>{children}</div>
    </div>
  )
}

function HudButton({ children, onClick, accent, big, outline, P }) {
  const [h, setH] = useState(false)
  const col = accent || P.cyan
  const fg = P.dark ? '#000' : '#fff'
  return (
    <button onClick={onClick} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)} style={{
      position:'relative', overflow:'hidden', fontFamily: P?.fontD || FONT_DISPLAY, fontWeight:700,
      fontSize: big?14:12, letterSpacing:3, padding: big?'18px 48px':'12px 24px', borderRadius:2,
      background: outline ? 'transparent' : (h ? col : `${col}22`),
      color: outline ? col : (h ? fg : col),
      border:`1px solid ${col}${h?'ff':'66'}`, cursor:'pointer', transition:'all .25s',
      boxShadow: h ? `0 0 30px ${col}66, inset 0 0 30px ${col}22` : 'none',
    }}>{children}</button>
  )
}

/* ════ VIDEO TIMELINE — makes the product feel like a video tool ════ */
function VideoTimeline({ P }) {
  const [phase, setPhase] = useState(0) // 0=idle 1=scanning 2=found 3=clips
  const [scanPct, setScanPct] = useState(0)
  const [markers, setMarkers] = useState([])
  const [clips, setClips] = useState([])

  const VIRAL_HITS = [
    { pct:18, score:'9.8', col:'#00d4ff', time:'2:14' },
    { pct:38, score:'9.2', col:'#ffd60a', time:'8:33' },
    { pct:61, score:'9.6', col:'#9d5bff', time:'16:45' },
    { pct:79, score:'9.4', col:'#00d4ff', time:'22:07' },
  ]

  useEffect(() => {
    let pct = 0, raf
    const tick = () => {
      pct += 0.35
      setScanPct(pct)
      VIRAL_HITS.forEach(h => {
        if (pct >= h.pct && pct < h.pct + 1) {
          setMarkers(prev => prev.find(m=>m.pct===h.pct) ? prev : [...prev, h])
        }
      })
      if (pct < 100) { raf = requestAnimationFrame(tick) }
      else {
        setTimeout(()=>{ setClips([...VIRAL_HITS]); setPhase(3) }, 300)
        setTimeout(()=>{ setMarkers([]); setClips([]); setScanPct(0); setPhase(0); pct=0; }, 5000)
        setTimeout(()=>{ raf = requestAnimationFrame(tick) }, 5400)
      }
    }
    const start = setTimeout(()=>{ setPhase(1); raf = requestAnimationFrame(tick) }, 800)
    return () => { clearTimeout(start); cancelAnimationFrame(raf) }
  }, [])

  // Waveform bars (deterministic heights)
  const BARS = Array.from({length:80}, (_,i) => {
    const v = Math.abs(Math.sin(i*0.4)*Math.cos(i*0.15)*0.8 + Math.sin(i*0.07)*0.2)
    return Math.max(0.08, v)
  })

  return (
    <div style={{ width:'100%', maxWidth:780, margin:'0 auto', fontFamily:FONT_MONO }}>
      {/* Header bar */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8, padding:'0 4px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <div style={{ width:8, height:8, borderRadius:'50%', background: phase>=1 ? '#00ff88' : P.muted, boxShadow: phase>=1 ? '0 0 8px #00ff88' : 'none', transition:'all .4s' }} />
          <span style={{ fontSize:10, color:P.muted, letterSpacing:2 }}>interview_keynote_final.mp4</span>
        </div>
        <div style={{ display:'flex', gap:16, alignItems:'center' }}>
          <span style={{ fontSize:10, color:P.muted }}>45:32</span>
          <span style={{ fontSize:9, color: phase>=1 ? P.cyan : P.muted, letterSpacing:2, border:`1px solid ${phase>=1?P.cyan:P.muted}33`, padding:'2px 8px', borderRadius:2 }}>
            {phase===0?'READY':phase===1?'SCANNING...':phase===2?'DETECTING...':'CLIPS READY'}
          </span>
        </div>
      </div>

      {/* Main timeline track */}
      <div style={{ position:'relative', height:64, background: P.dark ? 'rgba(6,13,24,0.9)' : 'rgba(219,229,243,0.9)', borderRadius:4, border:`1px solid ${P.cyan}22`, overflow:'hidden' }}>
        {/* Waveform */}
        <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', gap:1, padding:'0 4px' }}>
          {BARS.map((h,i) => {
            const pct = (i / BARS.length) * 100
            const isScanned = pct <= scanPct
            const nearMarker = markers.some(m => Math.abs(pct - m.pct) < 3)
            return (
              <div key={i} style={{
                flex:1, height:`${h*100}%`, minHeight:2, borderRadius:1,
                background: nearMarker ? P.gold : isScanned ? P.cyan : P.muted,
                opacity: isScanned ? (nearMarker ? 1 : 0.7) : 0.25,
                transition: 'background .2s, opacity .2s',
                boxShadow: nearMarker ? `0 0 4px ${P.gold}` : 'none',
              }} />
            )
          })}
        </div>

        {/* Viral markers */}
        {markers.map((m,i) => (
          <div key={i} style={{ position:'absolute', top:0, bottom:0, left:`${m.pct}%`, width:2, background:m.col, boxShadow:`0 0 8px ${m.col}`, zIndex:3, animation:'dataStream .3s ease-out' }}>
            <div style={{ position:'absolute', top:-22, left:'50%', transform:'translateX(-50%)', background:m.col, color:'#000', fontSize:9, fontWeight:700, padding:'2px 5px', borderRadius:2, whiteSpace:'nowrap', boxShadow:`0 0 8px ${m.col}` }}>{m.score}</div>
            <div style={{ position:'absolute', bottom:-18, left:'50%', transform:'translateX(-50%)', color:m.col, fontSize:8, whiteSpace:'nowrap' }}>{m.time}</div>
          </div>
        ))}

        {/* Scan line */}
        {phase >= 1 && scanPct < 100 && (
          <div style={{ position:'absolute', top:0, bottom:0, left:`${scanPct}%`, width:2, background:`linear-gradient(${P.cyan}00, ${P.cyan}, ${P.cyan}00)`, boxShadow:`0 0 12px ${P.cyan}`, zIndex:4, pointerEvents:'none' }}>
            <div style={{ position:'absolute', top:0, left:4, fontSize:8, color:P.cyan, whiteSpace:'nowrap', letterSpacing:1 }}>AI</div>
          </div>
        )}
      </div>

      {/* Output clips */}
      <div style={{ marginTop:12, display:'flex', gap:8, justifyContent:'center', minHeight:72 }}>
        {clips.map((c,i) => (
          <div key={i} style={{ width:40, borderRadius:4, overflow:'hidden', border:`1px solid ${c.col}66`, boxShadow:`0 0 16px ${c.col}33`, animation:`dataStream .4s ease-out ${i*0.12}s both`, position:'relative', aspectRatio:'9/16', background: P.dark ? '#0a1424' : '#dbe5f3' }}>
            {/* mini waveform inside clip */}
            <div style={{ position:'absolute', inset:'30% 2px 30%', display:'flex', alignItems:'center', gap:0.5 }}>
              {Array.from({length:12}, (_,j) => (
                <div key={j} style={{ flex:1, height:`${40+Math.abs(Math.sin(j*0.8))*50}%`, background:c.col, opacity:0.7, borderRadius:1 }} />
              ))}
            </div>
            <div style={{ position:'absolute', bottom:3, left:0, right:0, textAlign:'center', fontSize:7, color:c.col, fontWeight:700 }}>{c.score}</div>
          </div>
        ))}
        {clips.length === 0 && phase < 3 && (
          <div style={{ fontSize:9, color:P.muted, letterSpacing:2, display:'flex', alignItems:'center', gap:8 }}>
            <div style={{ display:'flex', gap:6 }}>
              {[0,1,2,3].map(i=>(
                <div key={i} style={{ width:40, borderRadius:4, border:`1px dashed ${P.muted}44`, aspectRatio:'9/16', opacity:0.3, background:'transparent' }} />
              ))}
            </div>
          </div>
        )}
      </div>
      <div style={{ textAlign:'center', marginTop:6, fontSize:8, color:P.muted, letterSpacing:2 }}>
        {clips.length > 0 ? `${clips.length} VIRAL CLIPS EXTRACTED · READY TO POST` : 'AI ANALYZING CONTENT FOR VIRAL MOMENTS'}
      </div>
    </div>
  )
}

function HoloOrb({ P }) {
  const [t, setT] = useState(0)
  useEffect(() => { let raf; const a=()=>{ setT(p=>p+0.01); raf=requestAnimationFrame(a) }; a(); return ()=>cancelAnimationFrame(raf) }, [])
  const cols = [P.cyan, P.blue, P.purple]
  return (
    <div style={{ position:'relative', width:300, height:300, margin:'0 auto' }}>
      {[300,220,140].map((size,i)=>(
        <div key={i} style={{ position:'absolute', top:'50%', left:'50%', width:size, height:size, marginLeft:-size/2, marginTop:-size/2, borderRadius:'50%', border:`1px solid ${cols[i]}44`, transform:`rotateX(75deg) rotate(${t*(i%2===0?1:-1)*30}deg)`, boxShadow:`0 0 ${20-i*4}px ${cols[i]}22`, transition:'transform .016s linear' }}>
          <div style={{ position:'absolute', top:-4, left:'50%', marginLeft:-4, width:8, height:8, borderRadius:'50%', background:cols[i], boxShadow:`0 0 12px ${cols[i]}` }} />
        </div>
      ))}
      <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:80, height:80, borderRadius:'50%', background:`radial-gradient(circle at 35% 35%, ${P.cyan}cc, ${P.blue}99, ${P.purple}66, transparent)`, boxShadow:`0 0 60px ${P.cyan}66, 0 0 120px ${P.blue}33`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:32, color:'#fff' }}>◈</div>
    </div>
  )
}

function StatTicker({ value, label, color, P }) {
  const [cur, setCur] = useState(0)
  useEffect(() => {
    const num = parseFloat(value), suffix = value.replace(/[0-9.]/g,'')
    let f=0; const total=60
    const tick=()=>{ f++; setCur(num<10 ? Math.round(num*(f/total)*10)/10 : Math.round(num*(f/total))); if(f<total) requestAnimationFrame(tick); else setCur(num) }
    requestAnimationFrame(tick)
  }, [value])
  const suffix = value.replace(/[0-9.]/g,'')
  return (
    <div style={{ textAlign:'center' }}>
      <div style={{ fontFamily:FONT_DISPLAY, fontSize:34, fontWeight:900, color, textShadow:`0 0 20px ${color}66`, letterSpacing:'-1px' }}>{cur}{suffix}</div>
      <div style={{ fontFamily:FONT_MONO, fontSize:10, color:P.muted, letterSpacing:2, marginTop:4 }}>{label}</div>
    </div>
  )
}

function NovaPanel({ message, visible, P }) {
  const [disp, setDisp] = useState(''); const [idx, setIdx] = useState(0)
  useEffect(() => { setDisp(''); setIdx(0) }, [message])
  useEffect(() => {
    if (idx < message.length) { const t=setTimeout(()=>{ setDisp(p=>p+message[idx]); setIdx(i=>i+1) },18); return ()=>clearTimeout(t) }
  }, [idx, message])
  return (
    <div style={{ position:'fixed', bottom:32, right:32, zIndex:200, width:320, transform:`translateY(${visible?0:120}px)`, opacity:visible?1:0, transition:'transform .5s cubic-bezier(.22,1,.36,1), opacity .5s' }}>
      <GlassCard accent={P.cyan} P={P}>
        <div style={{ display:'flex', gap:12, alignItems:'flex-start' }}>
          <div style={{ flexShrink:0, width:40, height:40, borderRadius:'50%', background:`radial-gradient(circle at 35% 35%, ${P.cyan}, ${P.blue}, ${P.purple})`, boxShadow:`0 0 20px ${P.cyan}66`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, color:'#fff', animation:'novaPulse 2s ease-in-out infinite' }}>◈</div>
          <div>
            <div style={{ fontFamily:FONT_MONO, fontSize:9, color:P.cyan, letterSpacing:2, marginBottom:6 }}>NOVA — AI ASSISTANT</div>
            <div style={{ fontFamily:FONT_BODY, fontSize:13, color:P.text, lineHeight:1.6 }}>{disp}<span style={{ animation:'blink 1s step-end infinite', color:P.cyan }}>▋</span></div>
          </div>
        </div>
      </GlassCard>
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


  const [booting, setBooting] = useState(true)
  const [bootLines, setBootLines] = useState([])
  const [bootDone, setBootDone] = useState(false)
  const [active, setActive] = useState('hero')
  const [novaVisible, setNovaVisible] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const NOVA_KEY = { hero:'nova1', features:'nova2', how:'nova3', pricing:'nova4' }
  const [novaSec, setNovaSec] = useState('hero')

  /* boot */
  useEffect(() => {
    const timers = []
    BOOT_LINES.forEach((line, i) => {
      timers.push(setTimeout(() => {
        setBootLines(prev => [...prev, line])
        if (line.includes('ACCESS GRANTED')) {
          timers.push(setTimeout(() => { setBootDone(true); timers.push(setTimeout(()=>{ setBooting(false); setNovaVisible(true) }, 600)) }, 500))
        }
      }, i < 6 ? i * 480 + 300 : i * 480 + 300))
    })
    return () => timers.forEach(clearTimeout)
  }, [])

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768)
    const onScroll = () => {
      setScrolled(window.scrollY > 60)
      for (const id of ['pricing','how','features','hero']) {
        const el = document.getElementById(id)
        if (el && window.scrollY >= el.offsetTop - 220) { setActive(id); setNovaSec(id); break }
      }
    }
    window.addEventListener('resize', onResize); window.addEventListener('scroll', onScroll)
    onResize()
    return () => { window.removeEventListener('resize', onResize); window.removeEventListener('scroll', onScroll) }
  }, [])

  const scrollTo = (id) => { document.getElementById(id)?.scrollIntoView({ behavior:'smooth' }); setMenuOpen(false) }
  const go = () => navigate('/signup')

  /* ── BOOT SCREEN (always dark — system boot) ── */
  if (booting) {
    const BC = { cyan:'#00d4ff', blue:'#2b8bff', muted:'#4a6080', gold:'#ffd60a' }
    return (
      <div style={{ position:'fixed', inset:0, background:'#020308', zIndex:9999, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', fontFamily:FONT_MONO, padding:32, opacity:bootDone?0:1, transition:'opacity .6s' }}>
        <div style={{ maxWidth:640, width:'100%' }}>
          <div style={{ textAlign:'center', marginBottom:48 }}>
            <div style={{ fontFamily:FONT_DISPLAY, fontSize:isMobile?26:42, fontWeight:900, color:BC.cyan, letterSpacing:8, textShadow:`0 0 40px ${BC.cyan}` }}>CLIPGEN.AI</div>
            <div style={{ fontSize:10, color:BC.muted, letterSpacing:4, marginTop:4 }}>VIRAL CONTENT INTELLIGENCE SYSTEM</div>
          </div>
          <div style={{ border:`1px solid ${BC.cyan}33`, background:'rgba(0,212,255,0.04)', padding:24, borderRadius:4, minHeight:200 }}>
            <div style={{ fontSize:10, color:BC.cyan, letterSpacing:2, marginBottom:16 }}>SYSTEM TERMINAL — {new Date().toISOString().slice(0,19)}Z</div>
            {bootLines.map((line,i)=>(
              <div key={i} style={{ fontSize:12, lineHeight:2, color: line.includes('✓')?'#00ff88': line.includes('100%')?BC.gold:BC.muted, fontWeight: line.includes('✓')?700:400 }}>
                {line.includes('✓')?'':'> '}{line}
              </div>
            ))}
            {bootLines.length < BOOT_LINES.length && <span style={{ color:BC.cyan, animation:'blink 1s step-end infinite' }}>_</span>}
          </div>
          <div style={{ marginTop:24, height:2, background:`${BC.cyan}22`, borderRadius:1 }}>
            <div style={{ height:'100%', background:`linear-gradient(90deg,${BC.cyan},${BC.blue})`, borderRadius:1, width:`${(bootLines.length/BOOT_LINES.length)*100}%`, transition:'width .4s ease', boxShadow:`0 0 8px ${BC.cyan}` }} />
          </div>
        </div>
        <style>{`@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}`}</style>
      </div>
    )
  }

  /* ── SITE ── */
  const accentFor = (k) => P[k] || P.cyan
  const navLinks = [[t('navFeatures'),'features'],[t('navProcess'),'how'],[t('navPricing'),'pricing']]

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} style={{ fontFamily:FONT_BODY, background:P.bg, color:P.text, overflowX:'hidden', cursor: isMobile?'auto':'none', minHeight:'100vh', transition:'background .4s, color .4s' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Exo+2:wght@400;600;700;900&family=Rajdhani:wght@300;400;500;600;700&family=Share+Tech+Mono&display=swap&subset=latin,latin-ext');
        *{box-sizing:border-box;margin:0;padding:0;}
        html{scroll-behavior:smooth;}
        ::selection{background:${P.cyan}44;color:${P.dark?'#fff':'#000'};}
        ::-webkit-scrollbar{width:2px;}
        ::-webkit-scrollbar-thumb{background:${P.cyan}44;}
        @keyframes novaPulse{0%,100%{box-shadow:0 0 20px ${P.cyan}66}50%{box-shadow:0 0 40px ${P.cyan}99}}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
        @keyframes floatY{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
        @keyframes glitch{0%,90%,100%{transform:none}91%{transform:translate(-2px,1px)}93%{transform:translate(2px,-1px)}95%{transform:none}}
        @keyframes scanH{0%{transform:translateY(-100%)}100%{transform:translateY(100vh)}}
        @keyframes dataStream{0%{opacity:0;transform:translateY(-16px)}100%{opacity:1;transform:translateY(0)}}
        @keyframes borderPulse{0%,100%{opacity:.3}50%{opacity:.8}}
        @keyframes gradShift{0%{background-position:0}100%{background-position:300%}}
        @keyframes shimmer{0%{background-position:-250% 0}100%{background-position:250% 0}}
        .floating-clip{animation:floatY 6s ease-in-out infinite;}
        @media(max-width:767px){.hide-mob{display:none!important;}.dist-nav{display:none!important;}.nova-panel{display:none!important;}}
        @media(min-width:768px){.show-mob{display:none!important;}}
      `}</style>

      <NeuralCanvas P={P} />
      <GridOverlay P={P} />
      {!isMobile && <HoloCursor color={P.cyan} />}

      {/* city backdrop */}
      <div style={{ position:'fixed', inset:0, zIndex:0, pointerEvents:'none', backgroundImage:`url(${IMG.neonCity})`, backgroundSize:'cover', backgroundPosition:'center', opacity: P.dark?0.12:0.05, maskImage:'radial-gradient(ellipse at center, black 30%, transparent 80%)', WebkitMaskImage:'radial-gradient(ellipse at center, black 30%, transparent 80%)' }} />
      <div style={{ position:'fixed', inset:0, zIndex:0, pointerEvents:'none', background:`linear-gradient(180deg, ${P.bg}dd, ${P.bg}99, ${P.bg}ee)` }} />

      {/* scanline */}
      <div style={{ position:'fixed', top:0, left:0, right:0, zIndex:1, height:2, background:`linear-gradient(90deg, transparent, ${P.cyan}22, transparent)`, animation:'scanH 8s linear infinite', pointerEvents:'none' }} />

      {/* district rail */}
      <div className="dist-nav" style={{ position:'fixed', left:24, top:'50%', transform:'translateY(-50%)', zIndex:150, display:'flex', flexDirection:'column', gap:8 }}>
        {[['hero','DST-01',P.cyan],['features','DST-02',P.blue],['how','DST-03',P.purple],['pricing','DST-04',P.gold]].map(([id,code,col])=>(
          <div key={id} onClick={()=>scrollTo(id)} style={{ display:'flex', alignItems:'center', gap:8, cursor:'pointer', opacity:active===id?1:0.3, transition:'opacity .3s' }}>
            <div style={{ width:active===id?24:6, height:2, background:col, transition:'width .3s', boxShadow:active===id?`0 0 8px ${col}`:'none' }} />
            {active===id && <span style={{ fontFamily:FONT_MONO, fontSize:9, color:col, letterSpacing:1, whiteSpace:'nowrap' }}>{code}</span>}
          </div>
        ))}
      </div>

      {/* NOVA */}
      <div className="nova-panel"><NovaPanel message={t(NOVA_KEY[novaSec])} visible={novaVisible} P={P} /></div>

      {/* ─── NAV ─── */}
      <nav style={{ position:'fixed', top:0, left:0, right:0, zIndex:300, height:64, display:'flex', alignItems:'center', justifyContent:'space-between', padding:isMobile?'0 18px':'0 60px', background:scrolled?(P.dark?'rgba(2,3,8,0.92)':'rgba(238,242,248,0.92)'):'transparent', backdropFilter:scrolled?'blur(20px)':'none', borderBottom:`1px solid ${scrolled?P.cyan+'22':'transparent'}`, transition:'all .4s' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, cursor:'pointer' }} onClick={()=>window.scrollTo({ top:0, behavior:'smooth' })}>
          <div style={{ width:36, height:36, borderRadius:4, background:`linear-gradient(135deg, ${P.cyan}, ${P.blue}, ${P.purple})`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, boxShadow:`0 0 16px ${P.cyan}66`, fontFamily:fd(lang), color:'#fff', fontWeight:900 }}>C</div>
          <div>
            <div style={{ fontFamily:fd(lang), fontWeight:900, fontSize:14, letterSpacing:3, color:P.text }}>CLIPGEN<span style={{ color:P.cyan }}>.AI</span></div>
            <div style={{ fontFamily:FONT_MONO, fontSize:8, color:P.muted, letterSpacing:2 }}>{t('sys')}</div>
          </div>
        </div>

        <div className="hide-mob" style={{ display:'flex', gap:34, alignItems:'center' }}>
          {navLinks.map(([label,id])=>(
            <button key={id} onClick={()=>scrollTo(id)} style={{ background:'none', border:'none', cursor:'pointer', fontFamily:fd(lang), fontSize:10, letterSpacing:3, color:P.muted, transition:'color .2s' }} onMouseEnter={e=>e.target.style.color=P.cyan} onMouseLeave={e=>e.target.style.color=P.muted}>{label}</button>
          ))}
        </div>

        <div style={{ display:'flex', gap:10, alignItems:'center' }}>
          {/* language */}
          <select value={lang} onChange={e=>setLanguage(e.target.value)} className="hide-mob" style={{ padding:'7px 8px', borderRadius:3, border:`1px solid ${P.cyan}33`, background:P.dark?'rgba(10,20,36,0.85)':'rgba(255,255,255,0.85)', color:P.text, fontSize:11, fontFamily:FONT_MONO, cursor:'pointer', outline:'none', maxWidth:130 }}>
            {LANGS.map(l => <option key={l.code} value={l.code} style={{ background:P.bg, color:P.text }}>{l.flag} {l.label}</option>)}
          </select>
          {/* theme toggle */}
          <button onClick={toggleTheme} title="Toggle theme" style={{ width:34, height:34, borderRadius:3, border:`1px solid ${P.cyan}33`, background:`${P.cyan}10`, color:P.cyan, cursor:'pointer', fontSize:14, display:'flex', alignItems:'center', justifyContent:'center' }}>{isDark?'☀':'☾'}</button>
          <div className="hide-mob"><HudButton onClick={go} accent={P.cyan} P={P}>{t('navLaunch')} →</HudButton></div>
          <button className="show-mob" onClick={()=>setMenuOpen(!menuOpen)} style={{ background:'none', border:`1px solid ${P.cyan}33`, borderRadius:3, color:P.cyan, fontSize:18, cursor:'pointer', width:34, height:34 }}>{menuOpen?'✕':'☰'}</button>
        </div>
      </nav>

      {/* ─── MOBILE DRAWER ─── */}
      {menuOpen && (
        <div className="show-mob" style={{ position:'fixed', top:64, left:0, right:0, zIndex:299, background:P.dark?'rgba(2,3,8,0.98)':'rgba(238,242,248,0.98)', backdropFilter:'blur(20px)', borderBottom:`1px solid ${P.cyan}22`, padding:24, display:'flex', flexDirection:'column', gap:18 }}>
          {navLinks.map(([label,id])=>(
            <button key={id} onClick={()=>scrollTo(id)} style={{ background:'none', border:'none', color:P.text, fontFamily:fd(lang), fontSize:16, letterSpacing:3, textAlign:'left', cursor:'pointer', fontWeight:700 }}>{label}</button>
          ))}
          <button onClick={()=>{ navigate('/signin'); setMenuOpen(false) }} style={{ background:'none', border:'none', color:P.muted, fontFamily:fd(lang), fontSize:14, letterSpacing:3, textAlign:'left', cursor:'pointer' }}>{t('navLogin')}</button>
          <select value={lang} onChange={e=>setLanguage(e.target.value)} style={{ padding:'12px', borderRadius:3, border:`1px solid ${P.cyan}33`, background:P.dark?'rgba(10,20,36,0.85)':'rgba(255,255,255,0.85)', color:P.text, fontSize:14, fontFamily:FONT_MONO, cursor:'pointer', outline:'none' }}>
            {LANGS.map(l => <option key={l.code} value={l.code} style={{ background:P.bg, color:P.text }}>{l.flag} {l.label}</option>)}
          </select>
          <HudButton onClick={go} accent={P.cyan} big P={P}>{t('navLaunch')} →</HudButton>
        </div>
      )}

      {/* ═══ HERO ═══ */}
      <section id="hero" style={{ minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center', padding:isMobile?'100px 24px 60px':'100px 60px 80px', position:'relative', zIndex:1 }}>
        <div style={{ fontFamily:FONT_MONO, fontSize:10, color:P.cyan, letterSpacing:4, marginBottom:32, display:'flex', alignItems:'center', gap:12, flexWrap:'wrap', justifyContent:'center' }}>
          <div className="hide-mob" style={{ width:30, height:1, background:P.cyan }} />
          DST-01 / {t('distNexus')}
          <div className="hide-mob" style={{ width:30, height:1, background:P.cyan }} />
        </div>

        {/* Compact orb */}
        <div style={{ marginBottom:24, transform:'scale(0.6)', transformOrigin:'center bottom', opacity:0.8, animation:'floatY 4s ease-in-out infinite' }}><HoloOrb P={P} /></div>

        {/* floating clip previews (desktop) */}
        {!isMobile && (
          <div style={{ position:'absolute', inset:0, pointerEvents:'none', zIndex:0 }}>
            {[
              { img:IMG.clip1, score:'9.8', top:'22%', left:'8%',  rot:-8, col:P.cyan },
              { img:IMG.clip2, score:'9.4', top:'30%', right:'7%', rot:7,  col:P.purple },
              { img:IMG.clip3, score:'9.1', bottom:'20%', left:'11%', rot:6, col:P.gold },
            ].map((c,i)=>(
              <div key={i} className="floating-clip" style={{ position:'absolute', top:c.top, bottom:c.bottom, left:c.left, right:c.right, width:120, height:200, transform:`rotate(${c.rot}deg)`, animationDelay:`${i*0.6}s`, borderRadius:8, overflow:'hidden', border:`1px solid ${c.col}55`, boxShadow:`0 12px 40px rgba(0,0,0,0.5), 0 0 24px ${c.col}33` }}>
                <img src={c.img} alt="" style={{ width:'100%', height:'100%', objectFit:'cover', opacity:0.85 }} />
                <div style={{ position:'absolute', inset:0, background:`linear-gradient(180deg, transparent 40%, ${P.bg}dd)` }} />
                <div style={{ position:'absolute', top:8, right:8, fontFamily:FONT_MONO, fontSize:11, fontWeight:700, color:'#000', background:c.col, padding:'2px 8px', borderRadius:2, boxShadow:`0 0 12px ${c.col}` }}>{c.score}</div>
                <div style={{ position:'absolute', top:8, left:8, fontFamily:FONT_MONO, fontSize:8, color:'#fff', background:'rgba(0,0,0,0.6)', padding:'2px 5px', borderRadius:2 }}>▶ 0:{28+i*14}</div>
                <div style={{ position:'absolute', bottom:10, left:10, right:10, height:3, background:'rgba(255,255,255,0.15)', borderRadius:2 }}>
                  <div style={{ width:`${parseFloat(c.score)*10}%`, height:'100%', background:c.col, borderRadius:2, boxShadow:`0 0 8px ${c.col}` }} />
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ marginBottom:16, position:'relative', zIndex:1 }}>
          <div style={{ fontFamily:fd(lang), fontWeight:900, fontSize:isMobile?'clamp(30px,8vw,46px)':'clamp(46px,6vw,84px)', lineHeight:1.05, letterSpacing:'-2px', color:P.text, animation:'glitch 6s ease-in-out infinite' }}>{t('hero1')}</div>
          <div style={{ display:'inline-block', fontFamily:fd(lang), fontWeight:900, fontSize:isMobile?'clamp(30px,8vw,46px)':'clamp(46px,6vw,84px)', lineHeight:1.05, letterSpacing:'-2px', backgroundImage:`linear-gradient(90deg, ${P.cyan}, ${P.blue}, ${P.purple}, ${P.cyan})`, backgroundSize:'300% auto', WebkitBackgroundClip:'text', backgroundClip:'text', WebkitTextFillColor:'transparent', color:'transparent', animation:'gradShift 4s linear infinite' }}>{t('hero2')}</div>
        </div>

        <p style={{ fontFamily:FONT_BODY, fontSize:isMobile?15:18, color:P.muted, lineHeight:1.8, maxWidth:560, marginBottom:40, marginTop:16, position:'relative', zIndex:1 }}>{t('heroSub')}</p>

        <div style={{ display:'flex', gap:16, flexWrap:'wrap', justifyContent:'center', marginBottom:16, position:'relative', zIndex:1 }}>
          <HudButton onClick={go} accent={P.cyan} big P={P}>⚡ {t('ctaPrimary')}</HudButton>
          <HudButton onClick={()=>scrollTo('how')} accent={P.muted} outline P={P}>▶ {t('ctaSecondary')}</HudButton>
        </div>
        <div style={{ fontFamily:FONT_MONO, fontSize:10, color:P.muted, letterSpacing:2, position:'relative', zIndex:1 }}>{t('trust')}</div>

        {/* === AI VIDEO PROCESSOR DEMO — communicates the product clearly === */}
        <div style={{ width:'100%', maxWidth:760, margin:'40px auto 0', position:'relative', zIndex:1, background: P.dark?'rgba(6,13,24,0.75)':'rgba(219,229,243,0.8)', backdropFilter:'blur(16px)', border:`1px solid ${P.cyan}22`, borderRadius:6, padding:isMobile?'16px 12px':'20px 24px' }}>
          <HudCorner pos="tl" color={P.cyan} /><HudCorner pos="tr" color={P.cyan} />
          <HudCorner pos="bl" color={P.cyan} /><HudCorner pos="br" color={P.cyan} />
          <div style={{ fontFamily:FONT_MONO, fontSize:9, color:P.cyan, letterSpacing:3, marginBottom:12, textAlign:'center' }}>◈ LIVE AI PROCESSING DEMO</div>
          <VideoTimeline P={P} />
        </div>

        <div style={{ marginTop:80, display:'grid', gridTemplateColumns:isMobile?'repeat(2,1fr)':'repeat(4,1fr)', gap:1, maxWidth:800, width:'100%', border:`1px solid ${P.cyan}22`, background:`${P.cyan}08`, position:'relative', zIndex:1 }}>
          {[['2.4M+',t('stClips'),P.cyan],['96',t('stScore'),P.blue],['10×',t('stTime'),P.purple],['152K',t('stCreators'),P.gold]].map(([v,l,col],i)=>(
            <div key={i} style={{ padding:isMobile?'20px 12px':'28px 16px', borderRight:i<3?`1px solid ${P.cyan}22`:'none', borderBottom:isMobile&&i<2?`1px solid ${P.cyan}22`:'none', textAlign:'center' }}>
              <StatTicker value={v} label={l} color={col} P={P} />
            </div>
          ))}
        </div>

        <div style={{ marginTop:56, display:'flex', flexDirection:'column', alignItems:'center', gap:8, opacity:0.4 }}>
          <div style={{ fontFamily:FONT_MONO, fontSize:9, letterSpacing:3, color:P.muted }}>{t('scroll')}</div>
          <div style={{ width:1, height:40, background:`linear-gradient(${P.cyan}, transparent)` }} />
        </div>
      </section>

      {/* ═══ FEATURES ═══ */}
      <section id="features" style={{ padding:isMobile?'80px 24px':'120px 60px', position:'relative', zIndex:1 }}>
        <div style={{ maxWidth:1100, margin:'0 auto' }}>
          <div style={{ marginBottom:64, display:'flex', alignItems:'center', gap:20 }}>
            <div className="hide-mob" style={{ flex:1, height:1, background:`linear-gradient(90deg, transparent, ${P.blue}44)` }} />
            <div style={{ textAlign:'center', flex:isMobile?1:'none' }}>
              <div style={{ fontFamily:FONT_MONO, fontSize:10, color:P.blue, letterSpacing:4, marginBottom:8 }}>DST-02 / {t('distIntel')}</div>
              <div style={{ fontFamily:fd(lang), fontWeight:900, fontSize:isMobile?26:48, letterSpacing:'-1px', color:P.text }}>{t('featTitle')}</div>
            </div>
            <div className="hide-mob" style={{ flex:1, height:1, background:`linear-gradient(90deg, ${P.blue}44, transparent)` }} />
          </div>
          <div style={{ display:'grid', gridTemplateColumns:isMobile?'1fr':'repeat(3,1fr)', gap:16 }}>
            {FEATURES.map((f,i)=>{ const col=accentFor(f.key); return (
              <GlassCard key={i} accent={col} P={P} style={{ animation:`dataStream .5s ease-out ${i*0.08}s both` }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:16 }}>
                  <div style={{ width:52, height:52, borderRadius:4, border:`1px solid ${col}44`, background:`${col}12`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:24, color:col, boxShadow:`0 0 16px ${col}33` }}>{f.icon}</div>
                  <div style={{ fontFamily:FONT_MONO, fontSize:11, color:col, fontWeight:700, letterSpacing:1 }}>{f.stat}</div>
                </div>
                <div style={{ fontFamily:fd(lang), fontWeight:700, fontSize:13, letterSpacing:2, color:P.text, marginBottom:10 }}>{t(f.lk)}</div>
                <div style={{ fontFamily:FONT_BODY, fontSize:14, color:P.muted, lineHeight:1.7 }}>{t(f.dk)}</div>
              </GlassCard>
            )})}
          </div>
        </div>
      </section>

      {/* ═══ SHOWCASE BAND ═══ */}
      <section style={{ padding:isMobile?'40px 24px':'60px 60px', position:'relative', zIndex:1 }}>
        <div style={{ maxWidth:1100, margin:'0 auto', display:'grid', gridTemplateColumns:isMobile?'1fr':'1fr 1fr', gap:16 }}>
          <div style={{ position:'relative', minHeight:280, borderRadius:6, overflow:'hidden', border:`1px solid ${P.cyan}22` }}>
            <img src={IMG.creator} alt="" style={{ width:'100%', height:'100%', objectFit:'cover', position:'absolute', inset:0, opacity:P.dark?0.55:0.7 }} />
            <div style={{ position:'absolute', inset:0, background:`linear-gradient(135deg, ${P.bg}cc, ${P.navy}88, ${P.cyan}11)` }} />
            <HudCorner pos="tl" color={P.cyan} /><HudCorner pos="tr" color={P.cyan} /><HudCorner pos="bl" color={P.cyan} /><HudCorner pos="br" color={P.cyan} />
            <div style={{ position:'relative', zIndex:1, padding:32, height:'100%', display:'flex', flexDirection:'column', justifyContent:'flex-end' }}>
              <div style={{ fontFamily:FONT_MONO, fontSize:10, color:P.cyan, letterSpacing:3, marginBottom:8 }}>{t('inputLabel')}</div>
              <div style={{ fontFamily:fd(lang), fontWeight:700, fontSize:isMobile?22:28, color:P.text, lineHeight:1.15 }}>{t('inputTitle')}</div>
              <div style={{ fontFamily:FONT_BODY, fontSize:14, color:P.muted, marginTop:10 }}>{t('inputDesc')}</div>
            </div>
          </div>
          <div style={{ position:'relative', minHeight:280, borderRadius:6, overflow:'hidden', border:`1px solid ${P.purple}22` }}>
            <img src={IMG.dataCore} alt="" style={{ width:'100%', height:'100%', objectFit:'cover', position:'absolute', inset:0, opacity:P.dark?0.5:0.65 }} />
            <div style={{ position:'absolute', inset:0, background:`linear-gradient(135deg, ${P.purple}22, ${P.bg}cc, ${P.bg}ee)` }} />
            <HudCorner pos="tl" color={P.purple} /><HudCorner pos="tr" color={P.purple} /><HudCorner pos="bl" color={P.purple} /><HudCorner pos="br" color={P.purple} />
            <div style={{ position:'relative', zIndex:1, padding:32, height:'100%', display:'flex', flexDirection:'column', justifyContent:'flex-end' }}>
              <div style={{ fontFamily:FONT_MONO, fontSize:10, color:P.purple, letterSpacing:3, marginBottom:8 }}>{t('outputLabel')}</div>
              <div style={{ fontFamily:fd(lang), fontWeight:700, fontSize:isMobile?22:28, color:P.text, lineHeight:1.15 }}>{t('outputTitle')}</div>
              <div style={{ fontFamily:FONT_BODY, fontSize:14, color:P.muted, marginTop:10 }}>{t('outputDesc')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ HOW ═══ */}
      <section id="how" style={{ padding:isMobile?'80px 24px':'120px 60px', position:'relative', zIndex:1, background:`linear-gradient(180deg, transparent, ${P.navy}88, transparent)` }}>
        <div style={{ maxWidth:1000, margin:'0 auto' }}>
          <div style={{ marginBottom:64, textAlign:'center' }}>
            <div style={{ fontFamily:FONT_MONO, fontSize:10, color:P.purple, letterSpacing:4, marginBottom:8 }}>DST-03 / {t('distFlow')}</div>
            <div style={{ fontFamily:fd(lang), fontWeight:900, fontSize:isMobile?26:48, letterSpacing:'-1px', color:P.text }}>{t('procTitle')}</div>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:isMobile?'1fr':'repeat(4,1fr)', gap:0, position:'relative' }}>
            {!isMobile && <div style={{ position:'absolute', top:40, left:'12.5%', right:'12.5%', height:1, background:`linear-gradient(90deg, ${P.purple}00, ${P.purple}66, ${P.cyan}66, ${P.cyan}00)`, zIndex:0 }} />}
            {STEPS.map((s,i)=>{ const col=i<2?P.purple:P.cyan; return (
              <div key={i} style={{ position:'relative', zIndex:1, padding:isMobile?'24px 0':'0 20px', textAlign:'center' }}>
                <div style={{ width:80, height:80, borderRadius:'50%', border:`2px solid ${col}66`, background:`${col}12`, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px', boxShadow:`0 0 24px ${col}33`, position:'relative' }}>
                  <div style={{ fontFamily:fd(lang), fontWeight:900, fontSize:20, color:col }}>{s.n}</div>
                  <div style={{ position:'absolute', inset:-8, borderRadius:'50%', border:`1px solid ${col}`, animation:`borderPulse 2s ease-in-out ${i*0.5}s infinite` }} />
                </div>
                <div style={{ fontFamily:fd(lang), fontWeight:700, fontSize:12, letterSpacing:3, color:P.text, marginBottom:10 }}>{t(s.lk)}</div>
                <div style={{ fontFamily:FONT_BODY, fontSize:13, color:P.muted, lineHeight:1.7 }}>{t(s.dk)}</div>
              </div>
            )})}
          </div>
          <div style={{ marginTop:60 }}>
            <GlassCard accent={P.cyan} P={P}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:20 }}>
                <div>
                  <div style={{ fontFamily:FONT_MONO, fontSize:9, color:P.cyan, letterSpacing:3, marginBottom:6 }}>{t('procSim')}</div>
                  <div style={{ fontFamily:fd(lang), fontSize:16, color:P.text, fontWeight:700 }}>{t('procAvg')} <span style={{ color:P.cyan }}>4 min 32 sec</span></div>
                  <div style={{ fontFamily:FONT_BODY, fontSize:13, color:P.muted, marginTop:4 }}>{t('procClips')}</div>
                </div>
                <div style={{ display:'flex', gap:16, flexWrap:'wrap' }}>
                  {[[t('peExtract'),P.purple,'20s'],[t('peTranscribe'),P.blue,'90s'],[t('peAnalyze'),P.cyan,'45s'],[t('peCut'),P.gold,'135s']].map(([label,col,time])=>(
                    <div key={label} style={{ textAlign:'center' }}>
                      <div style={{ fontFamily:FONT_MONO, fontSize:18, fontWeight:700, color:col }}>{time}</div>
                      <div style={{ fontFamily:FONT_MONO, fontSize:9, color:P.muted, letterSpacing:1 }}>{label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* ═══ PRICING ═══ */}
      <section id="pricing" style={{ padding:isMobile?'80px 24px 120px':'120px 60px 160px', position:'relative', zIndex:1 }}>
        <div style={{ maxWidth:1000, margin:'0 auto' }}>
          <div style={{ marginBottom:64, textAlign:'center' }}>
            <div style={{ fontFamily:FONT_MONO, fontSize:10, color:P.gold, letterSpacing:4, marginBottom:8 }}>DST-04 / {t('distZone')}</div>
            <div style={{ fontFamily:fd(lang), fontWeight:900, fontSize:isMobile?26:48, letterSpacing:'-1px', color:P.text }}>{t('priceTitle')}</div>
            <div style={{ fontFamily:FONT_BODY, fontSize:16, color:P.muted, marginTop:12 }}>{t('priceSub')}</div>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:isMobile?'1fr':'repeat(3,1fr)', gap:16, alignItems:'start' }}>
            {PLANS.map((p,i)=>{ const col=accentFor(p.key); return (
              <div key={i} style={{ position:'relative' }}>
                {p.hot && <div style={{ position:'absolute', top:-16, left:'50%', transform:'translateX(-50%)', fontFamily:FONT_MONO, fontSize:9, letterSpacing:3, background:`linear-gradient(90deg, ${P.cyan}, ${P.blue})`, color:'#000', padding:'4px 16px', borderRadius:2, whiteSpace:'nowrap', fontWeight:700, boxShadow:`0 0 16px ${P.cyan}66`, zIndex:2 }}>◈ {t('recommended')}</div>}
                <GlassCard accent={col} P={P} style={{ boxShadow:p.hot?`0 0 60px ${col}22`:'none', transform:p.hot&&!isMobile?'scale(1.03)':'none' }}>
                  <div style={{ fontFamily:FONT_MONO, fontSize:9, color:col, letterSpacing:3, marginBottom:12 }}>{t('tierWord')} — {p.name}</div>
                  <div style={{ display:'flex', alignItems:'baseline', gap:4, marginBottom:6 }}>
                    <span style={{ fontFamily:fd(lang), fontSize:52, fontWeight:900, color:P.text, letterSpacing:'-2px', textShadow:p.hot?`0 0 30px ${col}66`:'none' }}>{p.price}</span>
                    <span style={{ fontFamily:FONT_MONO, fontSize:12, color:P.muted }}>{t('perMo')}</span>
                  </div>
                  <div style={{ marginBottom:24 }}>
                    <HudButton onClick={go} accent={col} big={p.hot} P={P}>{p.hot?`⚡ ${t('deploy')}`:t('initialize')}</HudButton>
                  </div>
                  <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                    {p.fk.map((fkey,j)=>(
                      <div key={j} style={{ display:'flex', alignItems:'center', gap:10 }}>
                        <div style={{ width:16, height:16, borderRadius:2, background:`${col}22`, border:`1px solid ${col}44`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}><span style={{ color:col, fontSize:10 }}>✓</span></div>
                        <span style={{ fontFamily:FONT_BODY, fontSize:13, color:P.muted }}>{t(fkey)}</span>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </div>
            )})}
          </div>
        </div>
      </section>

      {/* ═══ FINAL CTA ═══ */}
      <section style={{ padding:isMobile?'80px 24px':'120px 60px', textAlign:'center', position:'relative', zIndex:1 }}>
        <div style={{ position:'absolute', inset:0, background:`radial-gradient(ellipse at center, ${P.cyan}12, transparent 60%)`, pointerEvents:'none' }} />
        <div style={{ position:'relative', maxWidth:700, margin:'0 auto' }}>
          <div style={{ fontFamily:FONT_MONO, fontSize:10, color:P.cyan, letterSpacing:4, marginBottom:16 }}>SYSTEM READY — AWAITING AUTHORIZATION</div>
          <div style={{ fontFamily:fd(lang), fontWeight:900, fontSize:isMobile?36:64, letterSpacing:'-2px', color:P.text, marginBottom:12, textShadow:`0 0 60px ${P.cyan}44` }}>{t('finalTitle1')}<br /><span style={{ color:P.cyan }}>{t('finalTitle2')}</span></div>
          <p style={{ fontFamily:FONT_BODY, fontSize:17, color:P.muted, marginBottom:40, lineHeight:1.7 }}>{t('finalSub')}</p>
          <HudButton onClick={go} accent={P.cyan} big P={P}>⚡ {t('finalCta')}</HudButton>
          <div style={{ marginTop:16, fontFamily:FONT_MONO, fontSize:10, color:P.muted, letterSpacing:2 }}>{t('trust')}</div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding:isMobile?'24px 20px':'32px 60px', borderTop:`1px solid ${P.cyan}15`, background:P.dark?'rgba(2,3,8,0.95)':'rgba(238,242,248,0.95)', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:16, position:'relative', zIndex:1 }}>
        <div style={{ fontFamily:fd(lang), fontWeight:900, fontSize:13, letterSpacing:4, color:P.muted }}>CLIPGEN<span style={{ color:P.cyan }}>.AI</span></div>
        <div style={{ fontFamily:FONT_MONO, fontSize:10, color:P.muted, letterSpacing:2 }}>© 2077 CLIPGEN.AI — ALL RIGHTS RESERVED</div>
        <div style={{ display:'flex', gap:24 }}>
          {navLinks.map(([label,id])=>(
            <button key={id} onClick={()=>scrollTo(id)} style={{ background:'none', border:'none', cursor:'pointer', fontFamily:FONT_MONO, fontSize:9, letterSpacing:3, color:P.muted }} onMouseEnter={e=>e.target.style.color=P.cyan} onMouseLeave={e=>e.target.style.color=P.muted}>{label}</button>
          ))}
        </div>
      </footer>
    </div>
  )
}

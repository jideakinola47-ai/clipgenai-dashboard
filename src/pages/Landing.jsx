import { useState } from 'react'

// ── FULL TRANSLATIONS ──────────────────────────────────────────────────────
const TRANSLATIONS = {
  en: {
    nav: { features: 'Features', how: 'How It Works', pricing: 'Pricing', faq: 'FAQ', start: 'Start Free Trial →' },
    badge: '✦ AI-powered video clipping platform',
    hero1: 'Turn Long Videos Into',
    hero2: 'Viral Short Clips',
    hero3: 'Automatically',
    heroSub: 'Upload any long video. AI detects the best moments, cuts clips, adds subtitles — and publishes directly to TikTok, Reels & Shorts.',
    cta1: 'Start Free Trial →', cta2: '▶ Watch Demo',
    trust: 'No credit card required · 3 days free · Cancel anytime',
    statsLabels: ['Clips Generated','Clips Created','Avg Viral Share','Faster Than Manual'],
    howLabel: 'HOW IT WORKS',
    howTitle: 'From Upload to Viral in', howTitle2: '4 Steps',
    howSub: 'No editing skills needed. Our AI handles everything from analysis to publishing.',
    steps: [
      { title: 'Upload Your Video', desc: 'Drag and drop any MP4, MOV or AVI. Podcasts, interviews, lectures — up to 500MB, 60 minutes.' },
      { title: 'AI Analyses Content', desc: 'Our AI transcribes the audio, detects emotional peaks, strong hooks and viral potential segments.' },
      { title: 'Clips Are Generated', desc: 'AI cuts the best moments, reformats to 9:16 vertical and burns in accurate subtitles automatically.' },
      { title: 'Publish Everywhere', desc: 'Download your clips or publish directly to TikTok, Instagram Reels and YouTube Shorts instantly.' },
    ],
    featLabel: 'FEATURES',
    featTitle: 'Everything you need to', featTitle2: 'go viral',
    featSub: 'Powerful AI tools built specifically for content creators who want results.',
    features: [
      { icon: '🎯', title: 'Viral Score Badges', desc: 'Every clip gets a score from 0-100 based on hook strength, emotion peaks and shareability.' },
      { icon: '📝', title: 'Auto Captions', desc: 'AI-generated subtitles in 50+ languages that increase watch time by 40%.' },
      { icon: '🚀', title: 'Direct Publishing', desc: 'Publish to TikTok, Instagram Reels and YouTube Shorts simultaneously from one dashboard.' },
      { icon: '⚡', title: 'Smart Clip Detection', desc: 'AI identifies the most engaging 30-90 second segments from hours of content automatically.' },
      { icon: '✍', title: 'Hook Title Generator', desc: 'AI writes scroll-stopping hook titles and captions optimised for each platform.' },
      { icon: '👥', title: 'Team & Agency Mode', desc: 'Manage multiple clients, white-label the platform, and collaborate with your team.' },
    ],
    pricingLabel: 'PRICING',
    pricingTitle: 'Start free. Scale as you grow.',
    pricingSub: 'Cancel anytime.',
    monthly: 'Monthly', yearly: 'Yearly · Save 5 months',
    plans: [
      { name: 'Starter', desc: 'For individual creators getting started', cta: 'Get Started Free', features: ['10 videos/month','Auto subtitles','9:16 format','3 social accounts','Email support'] },
      { name: 'Pro', desc: 'For serious content creators who want to go viral', cta: 'Start Free Trial', features: ['Everything in Starter','50 videos/month','Transparent scoring','Unlimited social accounts','Priority processing','50+ languages','Priority support'] },
      { name: 'Agency', desc: 'For managing multiple clients at scale', cta: 'Contact Sales', features: ['Everything in Pro','Unlimited videos','White-label branding','Client management','Team members','Custom integrations','SLA guarantee'] },
    ],
    faqLabel: 'FAQ',
    faqTitle: 'Frequently asked questions',
    faqSub: 'Everything you need to know about ClipGen.AI',
    faqs: [
      { q: 'How does ClipGen.AI work?', a: 'Upload a long video — our AI transcribes it, finds the most viral moments, cuts clips, adds subtitles and reformats to 9:16 vertical for TikTok, Reels and Shorts in minutes.' },
      { q: 'What video formats are supported?', a: 'MP4, MOV, AVI and MKV files up to 500MB and 60 minutes long.' },
      { q: 'How many clips does the AI generate?', a: 'Between 3 and 10 clips per video depending on your plan, each scored for viral potential from 0-100.' },
      { q: 'Is Lithuanian language supported?', a: 'Yes — Lithuanian is fully supported for subtitles and the platform interface. We support 50+ languages total.' },
      { q: 'Can I publish directly to social media?', a: 'Yes — connect TikTok, Instagram and YouTube and publish clips with one click directly from the dashboard.' },
      { q: 'Can I cancel my subscription anytime?', a: 'Yes — cancel anytime with no fees or long-term commitments.' },
      { q: 'What is a viral score?', a: 'Each clip receives a score from 0 to 100 based on hooks, pacing, emotional impact and content quality — so you know which clips to post first.' },
      { q: 'How many languages are supported?', a: 'ClipGen.AI supports 50+ languages for subtitles including Lithuanian, German, French, Spanish, Polish, Russian and more.' },
    ],
    contactTitle: 'Stay in the loop',
    contactSub: 'Have a question? Get in touch and we\'ll respond quickly.',
    namePh: 'Your name', emailPh: 'Email address', msgPh: 'Your message...',
    sendBtn: 'Send message →', sentMsg: '✓ Message sent!',
    ctaFinalTitle: 'Ready to go viral?',
    ctaFinalSub: 'Join thousands of creators turning long videos into viral clips automatically.',
    ctaFinalBtn: '⚡ Start Creating Free Clips',
    footerTagline: 'Built for European creators',
  },
  lt: {
    nav: { features: 'Funkcijos', how: 'Kaip veikia', pricing: 'Kainos', faq: 'DUK', start: 'Pradėti nemokamai →' },
    badge: '✦ Dirbtinio intelekto vaizdo įrašų karpymo platforma',
    hero1: 'Paversk ilgus vaizdo įrašus į',
    hero2: 'Viralinius klipus',
    hero3: 'Automatiškai',
    heroSub: 'Įkelk bet kurį vaizdo įrašą. Dirbtinis intelektas suranda geriausias akimirkas, sukarpо klipus, prideda subtitrus ir formatuoja TikTok, Reels ir Shorts.',
    cta1: 'Pradėti nemokamai →', cta2: '▶ Žiūrėti demonstraciją',
    trust: 'Nereikia kredito kortelės · 3 dienos nemokamai · Atšaukti galima bet kada',
    statsLabels: ['Sukurti klipai','Sukurti klipai','Vid. viralinis balas','Greičiau nei rankiniu būdu'],
    howLabel: 'KAIP TAI VEIKIA',
    howTitle: 'Nuo įkėlimo iki viralinio per', howTitle2: '4 žingsnius',
    howSub: 'Nereikia redagavimo įgūdžių. Mūsų DI viską atlieka automatiškai.',
    steps: [
      { title: 'Įkelk vaizdo įrašą', desc: "Vilk ir mesk bet kurį MP4, MOV ar AVI failą. Podcast\'ai, interviu, paskaitos — iki 500MB, 60 minučių." },
      { title: 'DI analizuoja turinį', desc: 'Mūsų DI transkribuoja garsą, aptinka emocinius piką, stiprius kabliukus ir viralinio potencialo segmentus.' },
      { title: 'Klipai sugeneruojami', desc: 'DI iškerpa geriausias akimirkas, performatuoja į 9:16 vertikalų ir automatiškai prideda tikslius subtitrus.' },
      { title: 'Publikuok visur', desc: 'Atsisiųsk klipus arba publikuok tiesiogiai į TikTok, Instagram Reels ir YouTube Shorts akimirksniu.' },
    ],
    featLabel: 'FUNKCIJOS',
    featTitle: 'Viskas ko reikia', featTitle2: 'tapti viraliniu',
    featSub: 'Galingi DI įrankiai sukurti turinio kūrėjams, kurie nori rezultatų.',
    features: [
      { icon: '🎯', title: 'Viralinio balo ženkleliai', desc: 'Kiekvienas klipas gauna 0-100 balą pagal kabliuko stiprumą, emocinius pikų ir dalinimosi rodiklius.' },
      { icon: '📝', title: 'Automatiniai subtitrai', desc: 'DI sugeneruoti subtitrai 50+ kalbų, kurie padidina žiūrėjimo laiką 40%.' },
      { icon: '🚀', title: 'Tiesioginis publikavimas', desc: 'Publikuok į TikTok, Instagram Reels ir YouTube Shorts vienu mygtuko paspaudimu.' },
      { icon: '⚡', title: 'Išmanaus klipo aptikimas', desc: 'DI identifikuoja įdomiausius 30-90 sekundžių segmentus iš valandų turinio automatiškai.' },
      { icon: '✍', title: 'Kabliuko pavadinimų generatorius', desc: 'DI rašo stabdančius slinkimą kabliuko pavadinimus optimizuotus kiekvienai platformai.' },
      { icon: '👥', title: 'Komandos ir agentūros režimas', desc: 'Valdyk kelis klientus, baltos etiketės platforma ir bendradarbiaukite su savo komanda.' },
    ],
    pricingLabel: 'KAINOS',
    pricingTitle: 'Pradėk nemokamai. Augk toliau.',
    pricingSub: 'Atšaukti galima bet kada.',
    monthly: 'Mėnesinis', yearly: 'Metinis · Sutaupyk 5 mėnesius',
    plans: [
      { name: 'Pradedantysis', desc: 'Individualiems kūrėjams pradedantiesiems', cta: 'Pradėti nemokamai', features: ['10 vaizdo įrašų/mėn','Automatiniai subtitrai','9:16 formatas','3 socialinės paskyros','El. pašto palaikymas'] },
      { name: 'Pro', desc: 'Rimtiems turinio kūrėjams', cta: 'Pradėti nemokamą bandymą', features: ['Viskas iš Pradedančiojo','50 vaizdo įrašų/mėn','Skaidrus vertinimas','Neriboti socialiniai','Prioritetinis apdorojimas','50+ kalbų','Prioritetinė pagalba'] },
      { name: 'Agentūra', desc: 'Kelių klientų valdymui', cta: 'Susisiekti', features: ['Viskas iš Pro','Neriboti vaizdo įrašai','Baltos etiketės dizainas','Klientų valdymas','Komandos nariai','Pritaikytos integracijos','SLA garantija'] },
    ],
    faqLabel: 'DUK',
    faqTitle: 'Dažniausiai užduodami klausimai',
    faqSub: 'Viskas ką reikia žinoti apie ClipGen.AI',
    faqs: [
      { q: 'Kaip veikia ClipGen.AI?', a: 'Įkelk ilgą vaizdo įrašą — mūsų DI jį transkribuoja, suranda viraliausias akimirkas, iškerpa klipus, prideda subtitrus ir performatuoja į 9:16 vertikalų per kelias minutes.' },
      { q: 'Kokie vaizdo formatai palaikomi?', a: 'MP4, MOV, AVI ir MKV failai iki 500MB ir 60 minučių trukmės.' },
      { q: 'Kiek klipų sugeneruoja DI?', a: 'Nuo 3 iki 10 klipų vienam vaizdo įrašui priklausomai nuo jūsų plano, kiekvienas vertinamas nuo 0-100.' },
      { q: 'Ar palaikoma lietuvių kalba?', a: 'Taip — lietuvių kalba visiškai palaikoma subtitrams ir platformos sąsajai. Iš viso palaikome 50+ kalbų.' },
      { q: 'Ar galiu publikuoti tiesiogiai į socialinius tinklus?', a: 'Taip — prijungite TikTok, Instagram ir YouTube ir publikuokite klipus vienu paspaudimu tiesiai iš prietaisų skydelio.' },
      { q: 'Ar galiu atšaukti prenumeratą bet kada?', a: 'Taip — atšaukite bet kada be mokesčių ar ilgalaikių įsipareigojimų.' },
      { q: 'Kas yra viralinis balas?', a: 'Kiekvienas klipas gauna 0-100 balą pagal kabliukus, tempą, emocinį poveikį ir turinio kokybę — kad žinotumėte, kuriuos klipus skelbti pirma.' },
      { q: 'Kiek kalbų palaikoma?', a: 'ClipGen.AI palaiko 50+ kalbų subtitrams, įskaitant lietuvių, vokiečių, prancūzų, ispanų, lenkų, rusų ir kt.' },
    ],
    contactTitle: 'Susisiekite su mumis',
    contactSub: 'Turite klausimų? Parašykite mums ir atsakysime greitai.',
    namePh: 'Jūsų vardas', emailPh: 'El. pašto adresas', msgPh: 'Jūsų žinutė...',
    sendBtn: 'Siųsti žinutę →', sentMsg: '✓ Žinutė išsiųsta!',
    ctaFinalTitle: 'Pasiruošę tapti viraliais?',
    ctaFinalSub: 'Prisijunkite prie tūkstančių kūrėjų, kurie naudoja ClipGen.AI.',
    ctaFinalBtn: '⚡ Pradėti kurti klipus',
    footerTagline: 'Sukurta Europos kūrėjams',
  },
  de: {
    nav: { features: 'Funktionen', how: 'Wie es funktioniert', pricing: 'Preise', faq: 'FAQ', start: 'Kostenlos starten →' },
    badge: '✦ KI-gestützte Video-Clipping-Plattform',
    hero1: 'Verwandle lange Videos in',
    hero2: 'Virale Kurzclips',
    hero3: 'Automatisch',
    heroSub: 'Lade ein beliebiges Video hoch. Die KI erkennt die besten Momente, schneidet Clips, fügt Untertitel hinzu und veröffentlicht direkt auf TikTok, Reels & Shorts.',
    cta1: 'Kostenlos starten →', cta2: '▶ Demo ansehen',
    trust: 'Keine Kreditkarte erforderlich · 3 Tage kostenlos · Jederzeit kündbar',
    statsLabels: ['Clips erstellt','Clips erstellt','Ø Viral-Score','Schneller als manuell'],
    howLabel: 'SO FUNKTIONIERT ES',
    howTitle: 'Vom Upload bis viral in', howTitle2: '4 Schritten',
    howSub: 'Keine Bearbeitungskenntnisse erforderlich. Unsere KI übernimmt alles automatisch.',
    steps: [
      { title: 'Video hochladen', desc: 'Ziehe eine MP4, MOV oder AVI-Datei. Podcasts, Interviews, Vorlesungen — bis zu 500 MB, 60 Minuten.' },
      { title: 'KI analysiert Inhalt', desc: 'Unsere KI transkribiert Audio, erkennt emotionale Höhepunkte und virale Segmente.' },
      { title: 'Clips werden erstellt', desc: 'KI schneidet die besten Momente, formatiert auf 9:16 vertikal und brennt genaue Untertitel ein.' },
      { title: 'Überall veröffentlichen', desc: 'Lade Clips herunter oder veröffentliche direkt auf TikTok, Instagram Reels und YouTube Shorts.' },
    ],
    featLabel: 'FUNKTIONEN',
    featTitle: 'Alles was du brauchst um', featTitle2: 'viral zu gehen',
    featSub: 'Leistungsstarke KI-Tools speziell für Content-Creator gebaut.',
    features: [
      { icon: '🎯', title: 'Viral-Score-Abzeichen', desc: 'Jeder Clip erhält eine Punktzahl von 0-100 basierend auf Hook-Stärke und Teilbarkeit.' },
      { icon: '📝', title: 'Auto-Untertitel', desc: 'KI-generierte Untertitel in 50+ Sprachen, die die Wiedergabezeit um 40% erhöhen.' },
      { icon: '🚀', title: 'Direktveröffentlichung', desc: 'Auf TikTok, Instagram Reels und YouTube Shorts gleichzeitig aus einem Dashboard veröffentlichen.' },
      { icon: '⚡', title: 'Intelligente Clip-Erkennung', desc: 'KI identifiziert die ansprechendsten 30-90 Sekunden Segmente automatisch.' },
      { icon: '✍', title: 'Hook-Titel-Generator', desc: 'KI schreibt aufmerksamkeitsstarke Hook-Titel für jede Plattform.' },
      { icon: '👥', title: 'Team & Agentur-Modus', desc: 'Mehrere Kunden verwalten und mit Ihrem Team zusammenarbeiten.' },
    ],
    pricingLabel: 'PREISE',
    pricingTitle: 'Kostenlos starten. Mit dir wachsen.',
    pricingSub: 'Jederzeit kündbar.',
    monthly: 'Monatlich', yearly: 'Jährlich · 5 Monate sparen',
    plans: [
      { name: 'Starter', desc: 'Für einzelne Creator am Anfang', cta: 'Kostenlos starten', features: ['10 Videos/Monat','Auto-Untertitel','9:16-Format','3 Social-Konten','E-Mail-Support'] },
      { name: 'Pro', desc: 'Für ernsthafte Content-Creator', cta: 'Kostenlos testen', features: ['Alles in Starter','50 Videos/Monat','Transparentes Scoring','Unbegrenzte Soziale','Prioritätsverarbeitung','50+ Sprachen','Prioritätssupport'] },
      { name: 'Agentur', desc: 'Für die Verwaltung mehrerer Kunden', cta: 'Kontakt aufnehmen', features: ['Alles in Pro','Unbegrenzte Videos','White-Label-Branding','Kundenverwaltung','Teammitglieder','Benutzerdefinierte Integrationen','SLA-Garantie'] },
    ],
    faqLabel: 'FAQ',
    faqTitle: 'Häufig gestellte Fragen',
    faqSub: 'Alles was Sie über ClipGen.AI wissen müssen',
    faqs: [
      { q: 'Wie funktioniert ClipGen.AI?', a: 'Lade ein langes Video hoch — unsere KI transkribiert es, findet die viralsten Momente, schneidet Clips, fügt Untertitel hinzu und formatiert auf 9:16 in Minuten.' },
      { q: 'Welche Videoformate werden unterstützt?', a: 'MP4, MOV, AVI und MKV Dateien bis zu 500 MB und 60 Minuten Länge.' },
      { q: 'Wie viele Clips generiert die KI?', a: 'Zwischen 3 und 10 Clips pro Video je nach Plan, jeder bewertet von 0-100.' },
      { q: 'Kann ich jederzeit kündigen?', a: 'Ja — jederzeit ohne Gebühren oder langfristige Verpflichtungen kündigen.' },
      { q: 'Was ist ein Viral-Score?', a: 'Jeder Clip erhält eine Punktzahl von 0-100 basierend auf Hooks, Tempo und emotionaler Wirkung.' },
      { q: 'Wie viele Sprachen werden unterstützt?', a: 'ClipGen.AI unterstützt 50+ Sprachen für Untertitel.' },
      { q: 'Kann ich direkt in sozialen Medien veröffentlichen?', a: 'Ja — TikTok, Instagram und YouTube verbinden und Clips mit einem Klick veröffentlichen.' },
      { q: 'Ist Litauisch unterstützt?', a: 'Ja — Litauisch wird vollständig für Untertitel und die Plattformoberfläche unterstützt.' },
    ],
    contactTitle: 'In Kontakt bleiben',
    contactSub: 'Haben Sie eine Frage? Wir antworten schnell.',
    namePh: 'Ihr Name', emailPh: 'E-Mail-Adresse', msgPh: 'Ihre Nachricht...',
    sendBtn: 'Nachricht senden →', sentMsg: '✓ Nachricht gesendet!',
    ctaFinalTitle: 'Bereit viral zu gehen?',
    ctaFinalSub: 'Schließen Sie sich Tausenden von Creatorn an, die ClipGen.AI nutzen.',
    ctaFinalBtn: '⚡ Clips erstellen',
    footerTagline: 'Gebaut für europäische Creator',
  },
  fr: {
    nav: { features: 'Fonctionnalités', how: 'Comment ça marche', pricing: 'Tarifs', faq: 'FAQ', start: 'Commencer gratuitement →' },
    badge: '✦ Plateforme de découpe vidéo par IA',
    hero1: 'Transformez vos longues vidéos en',
    hero2: 'Clips Viraux',
    hero3: 'Automatiquement',
    heroSub: "Téléchargez n'importe quelle vidéo. L'IA détecte les meilleurs moments, coupe les clips, ajoute des sous-titres et publie directement sur TikTok, Reels & Shorts.",
    cta1: 'Commencer gratuitement →', cta2: '▶ Voir la démo',
    trust: 'Aucune carte de crédit requise · 3 jours gratuits · Annulez à tout moment',
    statsLabels: ['Clips générés','Clips créés','Score viral moyen','Plus rapide que manuel'],
    howLabel: 'COMMENT ÇA MARCHE',
    howTitle: 'Du téléchargement au viral en', howTitle2: '4 étapes',
    howSub: 'Aucune compétence en montage requise. Notre IA gère tout automatiquement.',
    steps: [
      { title: 'Téléchargez votre vidéo', desc: "Glissez-déposez un fichier MP4, MOV ou AVI. Podcasts, interviews, cours — jusqu\'à 500 Mo, 60 minutes." },
      { title: "L'IA analyse le contenu", desc: "Notre IA transcrit l'audio, détecte les pics émotionnels et les segments viraux." },
      { title: 'Les clips sont générés', desc: "L'IA coupe les meilleurs moments, reformate en 9:16 vertical et ajoute des sous-titres précis." },
      { title: 'Publiez partout', desc: 'Téléchargez vos clips ou publiez directement sur TikTok, Instagram Reels et YouTube Shorts.' },
    ],
    featLabel: 'FONCTIONNALITÉS',
    featTitle: 'Tout ce dont vous avez besoin pour', featTitle2: 'devenir viral',
    featSub: 'Des outils IA puissants construits spécifiquement pour les créateurs de contenu.',
    features: [
      { icon: '🎯', title: 'Badges de score viral', desc: 'Chaque clip reçoit un score de 0-100 basé sur la force du hook et la partageabilité.' },
      { icon: '📝', title: 'Sous-titres automatiques', desc: 'Sous-titres générés par IA en 50+ langues qui augmentent le temps de visionnage de 40%.' },
      { icon: '🚀', title: 'Publication directe', desc: 'Publiez sur TikTok, Instagram Reels et YouTube Shorts simultanément depuis un tableau de bord.' },
      { icon: '⚡', title: 'Détection intelligente des clips', desc: "L'IA identifie automatiquement les segments les plus engageants de 30-90 secondes." },
      { icon: '✍', title: 'Générateur de titres accrocheurs', desc: "L'IA écrit des titres accrocheurs optimisés pour chaque plateforme." },
      { icon: '👥', title: 'Mode équipe & agence', desc: 'Gérez plusieurs clients, marque blanche et collaborez avec votre équipe.' },
    ],
    pricingLabel: 'TARIFS',
    pricingTitle: 'Commencez gratuitement. Grandissez à votre rythme.',
    pricingSub: 'Annulez à tout moment.',
    monthly: 'Mensuel', yearly: 'Annuel · Économisez 5 mois',
    plans: [
      { name: 'Débutant', desc: 'Pour les créateurs individuels débutants', cta: 'Commencer gratuitement', features: ['10 vidéos/mois','Sous-titres auto','Format 9:16','3 comptes sociaux','Support par e-mail'] },
      { name: 'Pro', desc: 'Pour les créateurs de contenu sérieux', cta: 'Essai gratuit', features: ['Tout dans Débutant','50 vidéos/mois','Scoring transparent','Réseaux sociaux illimités','Traitement prioritaire','50+ langues','Support prioritaire'] },
      { name: 'Agence', desc: 'Pour gérer plusieurs clients', cta: 'Nous contacter', features: ['Tout dans Pro','Vidéos illimitées','Marque blanche','Gestion des clients','Membres d\'équipe','Intégrations personnalisées','Garantie SLA'] },
    ],
    faqLabel: 'FAQ',
    faqTitle: 'Questions fréquemment posées',
    faqSub: 'Tout ce que vous devez savoir sur ClipGen.AI',
    faqs: [
      { q: 'Comment fonctionne ClipGen.AI?', a: "Téléchargez une longue vidéo — notre IA la transcrit, trouve les moments les plus viraux, coupe les clips, ajoute des sous-titres et reformate en 9:16 en quelques minutes." },
      { q: 'Quels formats vidéo sont pris en charge?', a: "Fichiers MP4, MOV, AVI et MKV jusqu\'à 500 Mo et 60 minutes." },
      { q: "Combien de clips l\'IA génère-t-elle?", a: 'Entre 3 et 10 clips par vidéo selon votre plan, chacun noté de 0 à 100.' },
      { q: 'Puis-je annuler à tout moment?', a: 'Oui — annulez à tout moment sans frais ni engagements à long terme.' },
      { q: 'Qu\'est-ce qu\'un score viral?', a: "Chaque clip reçoit un score de 0 à 100 basé sur les hooks, le rythme et l\'impact émotionnel." },
      { q: 'Combien de langues sont prises en charge?', a: 'ClipGen.AI prend en charge 50+ langues pour les sous-titres.' },
      { q: 'Puis-je publier directement sur les réseaux sociaux?', a: 'Oui — connectez TikTok, Instagram et YouTube et publiez des clips en un clic.' },
      { q: 'Le lituanien est-il pris en charge?', a: "Oui — le lituanien est entièrement pris en charge pour les sous-titres et l\'interface." },
    ],
    contactTitle: 'Restez en contact',
    contactSub: 'Vous avez une question? Nous répondons rapidement.',
    namePh: 'Votre nom', emailPh: 'Adresse e-mail', msgPh: 'Votre message...',
    sendBtn: 'Envoyer le message →', sentMsg: '✓ Message envoyé!',
    ctaFinalTitle: 'Prêt à devenir viral?',
    ctaFinalSub: 'Rejoignez des milliers de créateurs utilisant ClipGen.AI.',
    ctaFinalBtn: '⚡ Créer des clips gratuits',
    footerTagline: 'Conçu pour les créateurs européens',
  },

  es: {
    nav: { features: 'Características', how: 'Cómo funciona', pricing: 'Precios', faq: 'FAQ', start: 'Empezar gratis →' },
    badge: '✦ Plataforma de recorte de video con IA',
    hero1: 'Convierte videos largos en',
    hero2: 'Clips Virales',
    hero3: 'Automáticamente',
    heroSub: 'Sube cualquier video largo. La IA detecta los mejores momentos, corta clips, añade subtítulos y publica directamente en TikTok, Reels y Shorts.',
    cta1: 'Empezar gratis →', cta2: '▶ Ver demo',
    trust: 'Sin tarjeta de crédito · 3 días gratis · Cancela cuando quieras',
    statsLabels: ['Clips generados','Clips creados','Puntuación viral media','Más rápido que manual'],
    howLabel: 'CÓMO FUNCIONA',
    howTitle: 'De la subida a viral en', howTitle2: '4 pasos',
    howSub: 'Sin habilidades de edición. Nuestra IA maneja todo automáticamente.',
    steps: [
      { title: 'Sube tu video', desc: 'Arrastra cualquier MP4, MOV o AVI. Podcasts, entrevistas, clases — hasta 500MB, 60 minutos.' },
      { title: 'La IA analiza el contenido', desc: 'Nuestra IA transcribe el audio, detecta picos emocionales y segmentos virales.' },
      { title: 'Se generan los clips', desc: 'La IA corta los mejores momentos, reformatea a 9:16 vertical y añade subtítulos precisos.' },
      { title: 'Publica en todos lados', desc: 'Descarga tus clips o publica directamente en TikTok, Instagram Reels y YouTube Shorts.' },
    ],
    featLabel: 'CARACTERÍSTICAS',
    featTitle: 'Todo lo que necesitas para', featTitle2: 'hacerte viral',
    featSub: 'Herramientas de IA potentes creadas específicamente para creadores de contenido.',
    features: [
      { icon: '🎯', title: 'Insignias de puntuación viral', desc: 'Cada clip recibe una puntuación de 0-100 basada en la fuerza del gancho y la compartibilidad.' },
      { icon: '📝', title: 'Subtítulos automáticos', desc: 'Subtítulos generados por IA en 50+ idiomas que aumentan el tiempo de visualización un 40%.' },
      { icon: '🚀', title: 'Publicación directa', desc: 'Publica en TikTok, Instagram Reels y YouTube Shorts simultáneamente desde un panel.' },
      { icon: '⚡', title: 'Detección inteligente de clips', desc: 'La IA identifica automáticamente los segmentos más atractivos de 30-90 segundos.' },
      { icon: '✍', title: 'Generador de títulos gancho', desc: 'La IA escribe títulos gancho optimizados para cada plataforma.' },
      { icon: '👥', title: 'Modo equipo y agencia', desc: 'Gestiona varios clientes, marca blanca y colabora con tu equipo.' },
    ],
    pricingLabel: 'PRECIOS',
    pricingTitle: 'Empieza gratis. Crece a tu ritmo.',
    pricingSub: 'Cancela cuando quieras.',
    monthly: 'Mensual', yearly: 'Anual · Ahorra 5 meses',
    plans: [
      { name: 'Básico', desc: 'Para creadores individuales que empiezan', cta: 'Empezar gratis', features: ['10 videos/mes','Subtítulos automáticos','Formato 9:16','3 cuentas sociales','Soporte por email'] },
      { name: 'Pro', desc: 'Para creadores serios de contenido', cta: 'Prueba gratuita', features: ['Todo en Básico','50 videos/mes','Puntuación transparente','Redes sociales ilimitadas','Procesamiento prioritario','50+ idiomas','Soporte prioritario'] },
      { name: 'Agencia', desc: 'Para gestionar múltiples clientes', cta: 'Contactar', features: ['Todo en Pro','Videos ilimitados','Marca blanca','Gestión de clientes','Miembros del equipo','Integraciones personalizadas','Garantía SLA'] },
    ],
    faqLabel: 'FAQ',
    faqTitle: 'Preguntas frecuentes',
    faqSub: 'Todo lo que necesitas saber sobre ClipGen.AI',
    faqs: [
      { q: '¿Cómo funciona ClipGen.AI?', a: 'Sube un video largo — nuestra IA lo transcribe, encuentra los momentos más virales, corta clips, añade subtítulos y reformatea a 9:16 en minutos.' },
      { q: '¿Qué formatos de video se admiten?', a: 'Archivos MP4, MOV, AVI y MKV de hasta 500MB y 60 minutos.' },
      { q: '¿Cuántos clips genera la IA?', a: 'Entre 3 y 10 clips por video según tu plan, cada uno puntuado de 0-100.' },
      { q: '¿Puedo cancelar en cualquier momento?', a: 'Sí — cancela en cualquier momento sin cargos ni compromisos a largo plazo.' },
      { q: '¿Qué es una puntuación viral?', a: 'Cada clip recibe una puntuación de 0 a 100 basada en ganchos, ritmo e impacto emocional.' },
      { q: '¿Cuántos idiomas se admiten?', a: 'ClipGen.AI admite más de 50 idiomas para subtítulos.' },
      { q: '¿Puedo publicar directamente en redes sociales?', a: 'Sí — conecta TikTok, Instagram y YouTube y publica clips con un clic.' },
      { q: '¿Se admite el lituano?', a: 'Sí — el lituano es totalmente compatible con subtítulos e interfaz.' },
    ],
    contactTitle: 'Mantente en contacto',
    contactSub: '¿Tienes una pregunta? Te respondemos rápidamente.',
    namePh: 'Tu nombre', emailPh: 'Correo electrónico', msgPh: 'Tu mensaje...',
    sendBtn: 'Enviar mensaje →', sentMsg: '✓ ¡Mensaje enviado!',
    ctaFinalTitle: '¿Listo para hacerte viral?',
    ctaFinalSub: 'Únete a miles de creadores usando ClipGen.AI.',
    ctaFinalBtn: '⚡ Empezar a crear clips gratis',
    footerTagline: 'Creado para creadores europeos',
  },
  pl: {
    nav: { features: 'Funkcje', how: 'Jak to działa', pricing: 'Cennik', faq: 'FAQ', start: 'Zacznij za darmo →' },
    badge: '✦ Platforma do przycinania wideo z AI',
    hero1: 'Przekształć długie filmy w',
    hero2: 'Wirusowe Klipy',
    hero3: 'Automatycznie',
    heroSub: 'Prześlij dowolny długi film. AI wykrywa najlepsze momenty, tnie klipy, dodaje napisy i publikuje bezpośrednio na TikTok, Reels i Shorts.',
    cta1: 'Zacznij za darmo →', cta2: '▶ Obejrzyj demo',
    trust: 'Bez karty kredytowej · 3 dni za darmo · Anuluj kiedy chcesz',
    statsLabels: ['Wygenerowane klipy','Utworzone klipy','Średni wynik wirusowy','Szybciej niż ręcznie'],
    howLabel: 'JAK TO DZIAŁA',
    howTitle: 'Od przesłania do wirusowego w', howTitle2: '4 krokach',
    howSub: 'Nie potrzeba umiejętności edycji. Nasza AI zajmuje się wszystkim automatycznie.',
    steps: [
      { title: 'Prześlij film', desc: 'Przeciągnij dowolny MP4, MOV lub AVI. Podcasty, wywiady, wykłady — do 500MB, 60 minut.' },
      { title: 'AI analizuje treść', desc: 'Nasza AI transkrybuje audio, wykrywa szczyty emocjonalne i segmenty wirusowe.' },
      { title: 'Klipy są generowane', desc: 'AI tnie najlepsze momenty, formatuje do 9:16 pionowo i dodaje dokładne napisy.' },
      { title: 'Publikuj wszędzie', desc: 'Pobierz klipy lub publikuj bezpośrednio na TikTok, Instagram Reels i YouTube Shorts.' },
    ],
    featLabel: 'FUNKCJE',
    featTitle: 'Wszystko czego potrzebujesz aby', featTitle2: 'stać się wirusowym',
    featSub: 'Potężne narzędzia AI stworzone specjalnie dla twórców treści.',
    features: [
      { icon: '🎯', title: 'Odznaki wyniku wirusowego', desc: 'Każdy klip otrzymuje wynik 0-100 na podstawie siły haczyka i udostępnialności.' },
      { icon: '📝', title: 'Automatyczne napisy', desc: 'Napisy generowane przez AI w 50+ językach, które zwiększają czas oglądania o 40%.' },
      { icon: '🚀', title: 'Bezpośrednia publikacja', desc: 'Publikuj na TikTok, Instagram Reels i YouTube Shorts jednocześnie z jednego panelu.' },
      { icon: '⚡', title: 'Inteligentne wykrywanie klipów', desc: 'AI automatycznie identyfikuje najbardziej angażujące segmenty 30-90 sekund.' },
      { icon: '✍', title: 'Generator tytułów haczyków', desc: 'AI pisze przyciągające uwagę tytuły zoptymalizowane dla każdej platformy.' },
      { icon: '👥', title: 'Tryb zespołu i agencji', desc: 'Zarządzaj wieloma klientami, white label i współpracuj z zespołem.' },
    ],
    pricingLabel: 'CENNIK',
    pricingTitle: 'Zacznij za darmo. Rozwijaj się.',
    pricingSub: 'Anuluj kiedy chcesz.',
    monthly: 'Miesięcznie', yearly: 'Rocznie · Zaoszczędź 5 miesięcy',
    plans: [
      { name: 'Starter', desc: 'Dla indywidualnych twórców na początku', cta: 'Zacznij za darmo', features: ['10 filmów/mies','Automatyczne napisy','Format 9:16','3 konta społecznościowe','Wsparcie e-mail'] },
      { name: 'Pro', desc: 'Dla poważnych twórców treści', cta: 'Bezpłatny okres próbny', features: ['Wszystko w Starter','50 filmów/mies','Przejrzyste punktowanie','Nieograniczone społecznościowe','Priorytetowe przetwarzanie','50+ języków','Wsparcie priorytetowe'] },
      { name: 'Agencja', desc: 'Do zarządzania wieloma klientami', cta: 'Skontaktuj się', features: ['Wszystko w Pro','Nieograniczone filmy','White-label branding','Zarządzanie klientami','Członkowie zespołu','Niestandardowe integracje','Gwarancja SLA'] },
    ],
    faqLabel: 'FAQ',
    faqTitle: 'Często zadawane pytania',
    faqSub: 'Wszystko co musisz wiedzieć o ClipGen.AI',
    faqs: [
      { q: 'Jak działa ClipGen.AI?', a: 'Prześlij długi film — nasza AI go transkrybuje, znajduje najbardziej wirusowe momenty, tnie klipy, dodaje napisy i formatuje do 9:16 w minutach.' },
      { q: 'Jakie formaty wideo są obsługiwane?', a: 'Pliki MP4, MOV, AVI i MKV do 500MB i 60 minut.' },
      { q: 'Ile klipów generuje AI?', a: 'Od 3 do 10 klipów na film w zależności od planu, każdy oceniony 0-100.' },
      { q: 'Czy mogę anulować w dowolnym momencie?', a: 'Tak — anuluj w dowolnym momencie bez opłat ani długoterminowych zobowiązań.' },
      { q: 'Co to jest wynik wirusowy?', a: 'Każdy klip otrzymuje wynik 0-100 na podstawie haczyków, tempa i wpływu emocjonalnego.' },
      { q: 'Ile języków jest obsługiwanych?', a: 'ClipGen.AI obsługuje 50+ języków dla napisów.' },
      { q: 'Czy mogę publikować bezpośrednio w mediach społecznościowych?', a: 'Tak — połącz TikTok, Instagram i YouTube i publikuj klipy jednym kliknięciem.' },
      { q: 'Czy język litewski jest obsługiwany?', a: 'Tak — język litewski jest w pełni obsługiwany dla napisów i interfejsu.' },
    ],
    contactTitle: 'Bądź w kontakcie',
    contactSub: 'Masz pytanie? Odpiszemy szybko.',
    namePh: 'Twoje imię', emailPh: 'Adres e-mail', msgPh: 'Twoja wiadomość...',
    sendBtn: 'Wyślij wiadomość →', sentMsg: '✓ Wiadomość wysłana!',
    ctaFinalTitle: 'Gotowy by stać się wirusowym?',
    ctaFinalSub: 'Dołącz do tysięcy twórców używających ClipGen.AI.',
    ctaFinalBtn: '⚡ Zacznij tworzyć klipy za darmo',
    footerTagline: 'Stworzone dla europejskich twórców',
  },
  ru: {
    nav: { features: 'Функции', how: 'Как это работает', pricing: 'Цены', faq: 'FAQ', start: 'Начать бесплатно →' },
    badge: '✦ Платформа для нарезки видео на основе ИИ',
    hero1: 'Превращай длинные видео в',
    hero2: 'Вирусные Клипы',
    hero3: 'Автоматически',
    heroSub: 'Загрузи любое длинное видео. ИИ находит лучшие моменты, нарезает клипы, добавляет субтитры и публикует напрямую в TikTok, Reels и Shorts.',
    cta1: 'Начать бесплатно →', cta2: '▶ Смотреть демо',
    trust: 'Без кредитной карты · 3 дня бесплатно · Отмена в любое время',
    statsLabels: ['Сгенерировано клипов','Создано клипов','Средний вирусный балл','Быстрее ручного'],
    howLabel: 'КАК ЭТО РАБОТАЕТ',
    howTitle: 'От загрузки до вирусного за', howTitle2: '4 шага',
    howSub: 'Навыки редактирования не нужны. Наш ИИ делает всё автоматически.',
    steps: [
      { title: 'Загрузи видео', desc: 'Перетащи любой MP4, MOV или AVI. Подкасты, интервью, лекции — до 500МБ, 60 минут.' },
      { title: 'ИИ анализирует контент', desc: 'Наш ИИ транскрибирует аудио, обнаруживает эмоциональные пики и вирусные сегменты.' },
      { title: 'Клипы генерируются', desc: 'ИИ вырезает лучшие моменты, форматирует в 9:16 вертикальный и добавляет точные субтитры.' },
      { title: 'Публикуй везде', desc: 'Скачай клипы или публикуй напрямую в TikTok, Instagram Reels и YouTube Shorts.' },
    ],
    featLabel: 'ФУНКЦИИ',
    featTitle: 'Всё что нужно чтобы', featTitle2: 'стать вирусным',
    featSub: 'Мощные инструменты ИИ, созданные специально для контент-мейкеров.',
    features: [
      { icon: '🎯', title: 'Значки вирусного балла', desc: 'Каждый клип получает балл от 0 до 100 на основе силы крючка и виральности.' },
      { icon: '📝', title: 'Автоматические субтитры', desc: 'Субтитры, созданные ИИ, на 50+ языках, увеличивающие время просмотра на 40%.' },
      { icon: '🚀', title: 'Прямая публикация', desc: 'Публикуй в TikTok, Instagram Reels и YouTube Shorts одновременно из одной панели.' },
      { icon: '⚡', title: 'Умное обнаружение клипов', desc: 'ИИ автоматически определяет самые интересные сегменты длительностью 30-90 секунд.' },
      { icon: '✍', title: 'Генератор заголовков-крючков', desc: 'ИИ пишет цепляющие заголовки, оптимизированные для каждой платформы.' },
      { icon: '👥', title: 'Режим команды и агентства', desc: 'Управляй несколькими клиентами, используй white label и сотрудничай с командой.' },
    ],
    pricingLabel: 'ЦЕНЫ',
    pricingTitle: 'Начни бесплатно. Расти дальше.',
    pricingSub: 'Отмена в любое время.',
    monthly: 'Ежемесячно', yearly: 'Ежегодно · Сэкономь 5 месяцев',
    plans: [
      { name: 'Стартовый', desc: 'Для начинающих индивидуальных создателей', cta: 'Начать бесплатно', features: ['10 видео/мес','Автосубтитры','Формат 9:16','3 соцсети','Email поддержка'] },
      { name: 'Pro', desc: 'Для серьёзных контент-мейкеров', cta: 'Бесплатный пробный период', features: ['Всё из Стартового','50 видео/мес','Прозрачная оценка','Неограниченные соцсети','Приоритетная обработка','50+ языков','Приоритетная поддержка'] },
      { name: 'Агентство', desc: 'Для управления несколькими клиентами', cta: 'Связаться', features: ['Всё из Pro','Неограниченные видео','White-label брендинг','Управление клиентами','Члены команды','Кастомные интеграции','Гарантия SLA'] },
    ],
    faqLabel: 'FAQ',
    faqTitle: 'Часто задаваемые вопросы',
    faqSub: 'Всё что нужно знать о ClipGen.AI',
    faqs: [
      { q: 'Как работает ClipGen.AI?', a: 'Загрузи длинное видео — наш ИИ его транскрибирует, находит самые вирусные моменты, нарезает клипы, добавляет субтитры и форматирует в 9:16 за минуты.' },
      { q: 'Какие форматы видео поддерживаются?', a: 'Файлы MP4, MOV, AVI и MKV до 500МБ и 60 минут.' },
      { q: 'Сколько клипов генерирует ИИ?', a: 'От 3 до 10 клипов на видео в зависимости от плана, каждый оценён от 0 до 100.' },
      { q: 'Могу ли я отменить подписку в любое время?', a: 'Да — отмени в любое время без комиссий и долгосрочных обязательств.' },
      { q: 'Что такое вирусный балл?', a: 'Каждый клип получает балл от 0 до 100 на основе крючков, темпа и эмоционального воздействия.' },
      { q: 'Сколько языков поддерживается?', a: 'ClipGen.AI поддерживает 50+ языков для субтитров.' },
      { q: 'Могу ли я публиковать напрямую в соцсетях?', a: 'Да — подключи TikTok, Instagram и YouTube и публикуй клипы в один клик.' },
      { q: 'Поддерживается ли литовский язык?', a: 'Да — литовский полностью поддерживается для субтитров и интерфейса.' },
    ],
    contactTitle: 'Оставайтесь на связи',
    contactSub: 'Есть вопрос? Мы ответим быстро.',
    namePh: 'Ваше имя', emailPh: 'Email адрес', msgPh: 'Ваше сообщение...',
    sendBtn: 'Отправить сообщение →', sentMsg: '✓ Сообщение отправлено!',
    ctaFinalTitle: 'Готовы стать вирусными?',
    ctaFinalSub: 'Присоединяйтесь к тысячам создателей, использующих ClipGen.AI.',
    ctaFinalBtn: '⚡ Начать создавать клипы бесплатно',
    footerTagline: 'Создано для европейских создателей',
  },
  it: {
    nav: { features: 'Funzionalità', how: 'Come funziona', pricing: 'Prezzi', faq: 'FAQ', start: 'Inizia gratis →' },
    badge: '✦ Piattaforma di ritaglio video con IA',
    hero1: 'Trasforma i video lunghi in',
    hero2: 'Clip Virali',
    hero3: 'Automaticamente',
    heroSub: "Carica qualsiasi video lungo. L'IA rileva i momenti migliori, taglia clip, aggiunge sottotitoli e pubblica direttamente su TikTok, Reels e Shorts.",
    cta1: 'Inizia gratis →', cta2: '▶ Guarda la demo',
    trust: 'Nessuna carta di credito · 3 giorni gratis · Annulla quando vuoi',
    statsLabels: ['Clip generate','Clip create','Punteggio virale medio','Più veloce del manuale'],
    howLabel: 'COME FUNZIONA',
    howTitle: 'Dal caricamento al virale in', howTitle2: '4 passaggi',
    howSub: 'Nessuna competenza di editing richiesta. La nostra IA gestisce tutto automaticamente.',
    steps: [
      { title: 'Carica il tuo video', desc: 'Trascina qualsiasi MP4, MOV o AVI. Podcast, interviste, lezioni — fino a 500MB, 60 minuti.' },
      { title: "L'IA analizza il contenuto", desc: "La nostra IA trascrive l'audio, rileva i picchi emotivi e i segmenti virali." },
      { title: 'Le clip vengono generate', desc: "L'IA taglia i momenti migliori, riformatta in 9:16 verticale e aggiunge sottotitoli accurati." },
      { title: 'Pubblica ovunque', desc: 'Scarica le clip o pubblica direttamente su TikTok, Instagram Reels e YouTube Shorts.' },
    ],
    featLabel: 'FUNZIONALITÀ',
    featTitle: 'Tutto ciò di cui hai bisogno per', featTitle2: 'diventare virale',
    featSub: 'Potenti strumenti IA costruiti appositamente per i creatori di contenuti.',
    features: [
      { icon: '🎯', title: 'Badge punteggio virale', desc: 'Ogni clip riceve un punteggio da 0-100 basato sulla forza del gancio e la condivisibilità.' },
      { icon: '📝', title: 'Sottotitoli automatici', desc: "Sottotitoli generati dall'IA in 50+ lingue che aumentano il tempo di visione del 40%." },
      { icon: '🚀', title: 'Pubblicazione diretta', desc: 'Pubblica su TikTok, Instagram Reels e YouTube Shorts simultaneamente da un dashboard.' },
      { icon: '⚡', title: 'Rilevamento intelligente delle clip', desc: "L'IA identifica automaticamente i segmenti più coinvolgenti di 30-90 secondi." },
      { icon: '✍', title: 'Generatore di titoli gancio', desc: "L'IA scrive titoli gancio ottimizzati per ogni piattaforma." },
      { icon: '👥', title: 'Modalità team e agenzia', desc: 'Gestisci più clienti, white label e collabora con il tuo team.' },
    ],
    pricingLabel: 'PREZZI',
    pricingTitle: 'Inizia gratis. Cresci con te.',
    pricingSub: 'Annulla quando vuoi.',
    monthly: 'Mensile', yearly: 'Annuale · Risparmia 5 mesi',
    plans: [
      { name: 'Starter', desc: 'Per creatori individuali alle prime armi', cta: 'Inizia gratis', features: ['10 video/mese','Sottotitoli auto','Formato 9:16','3 account social','Supporto email'] },
      { name: 'Pro', desc: 'Per creatori di contenuti seri', cta: 'Prova gratuita', features: ['Tutto in Starter','50 video/mese','Punteggio trasparente','Social illimitati','Elaborazione prioritaria','50+ lingue','Supporto prioritario'] },
      { name: 'Agenzia', desc: 'Per gestire più clienti', cta: 'Contattaci', features: ['Tutto in Pro','Video illimitati','Branding white-label','Gestione clienti','Membri del team','Integrazioni personalizzate','Garanzia SLA'] },
    ],
    faqLabel: 'FAQ',
    faqTitle: 'Domande frequenti',
    faqSub: 'Tutto quello che devi sapere su ClipGen.AI',
    faqs: [
      { q: 'Come funziona ClipGen.AI?', a: "Carica un video lungo — la nostra IA lo trascrive, trova i momenti più virali, taglia clip, aggiunge sottotitoli e riformatta in 9:16 in minuti." },
      { q: 'Quali formati video sono supportati?', a: 'File MP4, MOV, AVI e MKV fino a 500MB e 60 minuti.' },
      { q: "Quante clip genera l'IA?", a: 'Da 3 a 10 clip per video a seconda del piano, ognuna valutata da 0-100.' },
      { q: 'Posso annullare in qualsiasi momento?', a: 'Sì — annulla in qualsiasi momento senza commissioni o impegni a lungo termine.' },
      { q: "Cos'è un punteggio virale?", a: 'Ogni clip riceve un punteggio da 0 a 100 basato su ganci, ritmo e impatto emotivo.' },
      { q: 'Quante lingue sono supportate?', a: 'ClipGen.AI supporta 50+ lingue per i sottotitoli.' },
      { q: 'Posso pubblicare direttamente sui social media?', a: 'Sì — connetti TikTok, Instagram e YouTube e pubblica clip con un clic.' },
      { q: 'Il lituano è supportato?', a: "Sì — il lituano è completamente supportato per i sottotitoli e l'interfaccia." },
    ],
    contactTitle: 'Rimani in contatto',
    contactSub: 'Hai una domanda? Ti rispondiamo rapidamente.',
    namePh: 'Il tuo nome', emailPh: 'Indirizzo email', msgPh: 'Il tuo messaggio...',
    sendBtn: 'Invia messaggio →', sentMsg: '✓ Messaggio inviato!',
    ctaFinalTitle: 'Pronto a diventare virale?',
    ctaFinalSub: 'Unisciti a migliaia di creatori che usano ClipGen.AI.',
    ctaFinalBtn: '⚡ Inizia a creare clip gratis',
    footerTagline: 'Creato per i creatori europei',
  },
  pt: {
    nav: { features: 'Recursos', how: 'Como funciona', pricing: 'Preços', faq: 'FAQ', start: 'Começar grátis →' },
    badge: '✦ Plataforma de corte de vídeo com IA',
    hero1: 'Transforma vídeos longos em',
    hero2: 'Clips Virais',
    hero3: 'Automaticamente',
    heroSub: "Carrega qualquer vídeo longo. A IA deteta os melhores momentos, corta clips, adiciona legendas e publica diretamente no TikTok, Reels e Shorts.",
    cta1: 'Começar grátis →', cta2: '▶ Ver demo',
    trust: 'Sem cartão de crédito · 3 dias grátis · Cancela quando queres',
    statsLabels: ['Clips gerados','Clips criados','Pontuação viral média','Mais rápido que manual'],
    howLabel: 'COMO FUNCIONA',
    howTitle: 'Do upload ao viral em', howTitle2: '4 passos',
    howSub: 'Sem competências de edição. A nossa IA trata de tudo automaticamente.',
    steps: [
      { title: 'Carrega o teu vídeo', desc: 'Arrasta qualquer MP4, MOV ou AVI. Podcasts, entrevistas, aulas — até 500MB, 60 minutos.' },
      { title: "A IA analisa o conteúdo", desc: "A nossa IA transcreve o áudio, deteta picos emocionais e segmentos virais." },
      { title: 'Os clips são gerados', desc: 'A IA corta os melhores momentos, reformata para 9:16 vertical e adiciona legendas precisas.' },
      { title: 'Publica em todo o lado', desc: 'Descarrega os clips ou publica diretamente no TikTok, Instagram Reels e YouTube Shorts.' },
    ],
    featLabel: 'RECURSOS',
    featTitle: 'Tudo o que precisas para', featTitle2: 'te tornares viral',
    featSub: 'Ferramentas de IA poderosas criadas especificamente para criadores de conteúdo.',
    features: [
      { icon: '🎯', title: 'Emblemas de pontuação viral', desc: 'Cada clip recebe uma pontuação de 0-100 com base na força do gancho e partilhabilidade.' },
      { icon: '📝', title: 'Legendas automáticas', desc: 'Legendas geradas por IA em 50+ idiomas que aumentam o tempo de visualização em 40%.' },
      { icon: '🚀', title: 'Publicação direta', desc: 'Publica no TikTok, Instagram Reels e YouTube Shorts simultaneamente a partir de um painel.' },
      { icon: '⚡', title: 'Deteção inteligente de clips', desc: 'A IA identifica automaticamente os segmentos mais envolventes de 30-90 segundos.' },
      { icon: '✍', title: 'Gerador de títulos gancho', desc: 'A IA escreve títulos gancho otimizados para cada plataforma.' },
      { icon: '👥', title: 'Modo equipa e agência', desc: 'Gere vários clientes, white label e colabora com a tua equipa.' },
    ],
    pricingLabel: 'PREÇOS',
    pricingTitle: 'Começa grátis. Cresce contigo.',
    pricingSub: 'Cancela quando queres.',
    monthly: 'Mensal', yearly: 'Anual · Poupa 5 meses',
    plans: [
      { name: 'Básico', desc: 'Para criadores individuais a começar', cta: 'Começar grátis', features: ['10 vídeos/mês','Legendas automáticas','Formato 9:16','3 contas sociais','Suporte por email'] },
      { name: 'Pro', desc: 'Para criadores de conteúdo a sério', cta: 'Período experimental grátis', features: ['Tudo no Básico','50 vídeos/mês','Pontuação transparente','Redes sociais ilimitadas','Processamento prioritário','50+ idiomas','Suporte prioritário'] },
      { name: 'Agência', desc: 'Para gerir vários clientes', cta: 'Contactar', features: ['Tudo no Pro','Vídeos ilimitados','Branding white-label','Gestão de clientes','Membros da equipa','Integrações personalizadas','Garantia SLA'] },
    ],
    faqLabel: 'FAQ',
    faqTitle: 'Perguntas frequentes',
    faqSub: 'Tudo o que precisas de saber sobre ClipGen.AI',
    faqs: [
      { q: 'Como funciona o ClipGen.AI?', a: "Carrega um vídeo longo — a nossa IA transcreve-o, encontra os momentos mais virais, corta clips, adiciona legendas e reformata para 9:16 em minutos." },
      { q: 'Que formatos de vídeo são suportados?', a: 'Ficheiros MP4, MOV, AVI e MKV até 500MB e 60 minutos.' },
      { q: 'Quantos clips gera a IA?', a: 'Entre 3 e 10 clips por vídeo dependendo do plano, cada um pontuado de 0-100.' },
      { q: 'Posso cancelar a qualquer momento?', a: 'Sim — cancela a qualquer momento sem taxas ou compromissos a longo prazo.' },
      { q: 'O que é uma pontuação viral?', a: 'Cada clip recebe uma pontuação de 0 a 100 com base em ganchos, ritmo e impacto emocional.' },
      { q: 'Quantos idiomas são suportados?', a: 'O ClipGen.AI suporta 50+ idiomas para legendas.' },
      { q: 'Posso publicar diretamente nas redes sociais?', a: 'Sim — liga o TikTok, Instagram e YouTube e publica clips com um clique.' },
      { q: 'O lituano é suportado?', a: 'Sim — o lituano é totalmente suportado para legendas e interface.' },
    ],
    contactTitle: 'Mantém contacto',
    contactSub: 'Tens uma pergunta? Respondemos rapidamente.',
    namePh: 'O teu nome', emailPh: 'Endereço de email', msgPh: 'A tua mensagem...',
    sendBtn: 'Enviar mensagem →', sentMsg: '✓ Mensagem enviada!',
    ctaFinalTitle: 'Pronto para te tornares viral?',
    ctaFinalSub: 'Junta-te a milhares de criadores a usar o ClipGen.AI.',
    ctaFinalBtn: '⚡ Começar a criar clips grátis',
    footerTagline: 'Criado para criadores europeus',
  },
  nl: {
    nav: { features: 'Functies', how: 'Hoe het werkt', pricing: 'Prijzen', faq: 'FAQ', start: 'Gratis starten →' },
    badge: '✦ AI-aangedreven videoknipper platform',
    hero1: "Zet lange video's om in",
    hero2: 'Virale Clips',
    hero3: 'Automatisch',
    heroSub: 'Upload een lange video. AI detecteert de beste momenten, knipt clips, voegt ondertitels toe en publiceert direct op TikTok, Reels en Shorts.',
    cta1: 'Gratis starten →', cta2: '▶ Demo bekijken',
    trust: 'Geen creditcard nodig · 3 dagen gratis · Altijd opzegbaar',
    statsLabels: ['Clips gegenereerd','Clips gemaakt','Gemiddelde virale score','Sneller dan handmatig'],
    howLabel: 'HOE HET WERKT',
    howTitle: 'Van upload naar viraal in', howTitle2: '4 stappen',
    howSub: 'Geen bewerkingsvaardigheden nodig. Onze AI doet alles automatisch.',
    steps: [
      { title: 'Upload je video', desc: 'Sleep een MP4, MOV of AVI. Podcasts, interviews, lezingen — tot 500MB, 60 minuten.' },
      { title: 'AI analyseert content', desc: "Onze AI transcribeert audio, detecteert emotionele pieken en virale segmenten." },
      { title: 'Clips worden gegenereerd', desc: 'AI knipt de beste momenten, formatteert naar 9:16 verticaal en voegt nauwkeurige ondertitels toe.' },
      { title: 'Overal publiceren', desc: 'Download clips of publiceer direct op TikTok, Instagram Reels en YouTube Shorts.' },
    ],
    featLabel: 'FUNCTIES',
    featTitle: 'Alles wat je nodig hebt om', featTitle2: 'viraal te gaan',
    featSub: 'Krachtige AI-tools gebouwd speciaal voor contentmakers.',
    features: [
      { icon: '🎯', title: 'Virale score badges', desc: 'Elke clip krijgt een score van 0-100 op basis van haaksterkte en deelbaarheid.' },
      { icon: '📝', title: 'Auto ondertitels', desc: 'AI-gegenereerde ondertitels in 50+ talen die de kijktijd met 40% verhogen.' },
      { icon: '🚀', title: 'Direct publiceren', desc: 'Publiceer op TikTok, Instagram Reels en YouTube Shorts tegelijkertijd vanuit één dashboard.' },
      { icon: '⚡', title: 'Slimme clip detectie', desc: 'AI identificeert automatisch de meest boeiende segmenten van 30-90 seconden.' },
      { icon: '✍', title: 'Haak titel generator', desc: 'AI schrijft aandachttrekkende haak titels geoptimaliseerd voor elk platform.' },
      { icon: '👥', title: 'Team & bureau modus', desc: 'Beheer meerdere klanten, white label en werk samen met je team.' },
    ],
    pricingLabel: 'PRIJZEN',
    pricingTitle: 'Gratis starten. Met je meegroeien.',
    pricingSub: 'Altijd opzegbaar.',
    monthly: 'Maandelijks', yearly: 'Jaarlijks · Bespaar 5 maanden',
    plans: [
      { name: 'Starter', desc: 'Voor individuele makers die beginnen', cta: 'Gratis starten', features: ['10 videos/maand','Auto ondertitels','9:16 formaat','3 sociale accounts','E-mail ondersteuning'] },
      { name: 'Pro', desc: 'Voor serieuze contentmakers', cta: 'Gratis proberen', features: ['Alles in Starter','50 videos/maand','Transparante scoring','Onbeperkte sociale','Prioriteitsverwerking','50+ talen','Prioriteitsondersteuning'] },
      { name: 'Bureau', desc: 'Voor het beheren van meerdere klanten', cta: 'Contact opnemen', features: ['Alles in Pro','Onbeperkte videos','White-label branding','Klantenbeheer','Teamleden','Aangepaste integraties','SLA garantie'] },
    ],
    faqLabel: 'FAQ',
    faqTitle: 'Veelgestelde vragen',
    faqSub: 'Alles wat je moet weten over ClipGen.AI',
    faqs: [
      { q: 'Hoe werkt ClipGen.AI?', a: 'Upload een lange video — onze AI transcribeert het, vindt de meest virale momenten, knipt clips, voegt ondertitels toe en formatteert naar 9:16 in minuten.' },
      { q: 'Welke videoformaten worden ondersteund?', a: 'MP4, MOV, AVI en MKV bestanden tot 500MB en 60 minuten.' },
      { q: 'Hoeveel clips genereert AI?', a: 'Tussen 3 en 10 clips per video afhankelijk van je plan, elk beoordeeld van 0-100.' },
      { q: 'Kan ik altijd opzeggen?', a: 'Ja — zeg altijd op zonder kosten of langetermijnverplichtingen.' },
      { q: 'Wat is een virale score?', a: 'Elke clip krijgt een score van 0 tot 100 op basis van haken, tempo en emotionele impact.' },
      { q: 'Hoeveel talen worden ondersteund?', a: 'ClipGen.AI ondersteunt 50+ talen voor ondertitels.' },
      { q: 'Kan ik direct op sociale media publiceren?', a: 'Ja — verbind TikTok, Instagram en YouTube en publiceer clips met één klik.' },
      { q: 'Wordt Litouws ondersteund?', a: 'Ja — Litouws wordt volledig ondersteund voor ondertitels en interface.' },
    ],
    contactTitle: 'Blijf in contact',
    contactSub: 'Heb je een vraag? We reageren snel.',
    namePh: 'Jouw naam', emailPh: 'E-mailadres', msgPh: 'Jouw bericht...',
    sendBtn: 'Bericht versturen →', sentMsg: '✓ Bericht verzonden!',
    ctaFinalTitle: 'Klaar om viraal te gaan?',
    ctaFinalSub: 'Sluit je aan bij duizenden makers die ClipGen.AI gebruiken.',
    ctaFinalBtn: '⚡ Gratis clips maken',
    footerTagline: 'Gebouwd voor Europese makers',
  },











}


// Add hero-translated languages (rest of UI falls back to English)
const SIMPLE_LANGS = {
  sv: { hero1: 'Omvandla långa videor till', hero2: 'Virala Klipp', hero3: 'Automatiskt', cta1: 'Börja gratis →' },
  no: { hero1: 'Gjør lange videoer om til', hero2: 'Virale Klipp', hero3: 'Automatisk', cta1: 'Start gratis →' },
  da: { hero1: 'Forvandl lange videoer til', hero2: 'Virale Klip', hero3: 'Automatisk', cta1: 'Start gratis →' },
  fi: { hero1: 'Muunna pitkät videot', hero2: 'Viraalisiksi Klipeiksi', hero3: 'Automaattisesti', cta1: 'Aloita ilmaiseksi →' },
  ja: { hero1: '長い動画を', hero2: 'バイラルクリップ', hero3: 'に自動変換', cta1: '無料で始める →' },
  zh: { hero1: '将长视频转换为', hero2: '病毒式短片', hero3: '自动完成', cta1: '免费开始 →' },
  ko: { hero1: '긴 동영상을', hero2: '바이럴 클립으로', hero3: '자동 변환', cta1: '무료로 시작 →' },
  ar: { hero1: 'حوّل مقاطع الفيديو الطويلة إلى', hero2: 'مقاطع فيروسية', hero3: 'تلقائياً', cta1: 'ابدأ مجاناً →' },
  tr: { hero1: 'Uzun videoları dönüştür', hero2: 'Viral Kliplere', hero3: 'Otomatik olarak', cta1: 'Ücretsiz başla →' },
  hi: { hero1: 'लंबे वीडियो को बदलें', hero2: 'वायरल क्लिप में', hero3: 'स्वचालित रूप से', cta1: 'मुफ्त शुरू करें →' },
}
// Build merged translations (simple langs override hero only)
Object.keys(SIMPLE_LANGS).forEach(code => {
  TRANSLATIONS[code] = { ...TRANSLATIONS.en, ...SIMPLE_LANGS[code], nav: { ...TRANSLATIONS.en.nav, start: SIMPLE_LANGS[code].cta1 } }
})

const LANGS = [
  {code:'lt', flag:'🇱🇹', label:'Lietuvių'},
  {code:'en', flag:'🇬🇧', label:'English'},
  {code:'de', flag:'🇩🇪', label:'Deutsch'},
  {code:'fr', flag:'🇫🇷', label:'Français'},
  {code:'es', flag:'🇪🇸', label:'Español'},
  {code:'pl', flag:'🇵🇱', label:'Polski'},
  {code:'ru', flag:'🇷🇺', label:'Русский'},
  {code:'it', flag:'🇮🇹', label:'Italiano'},
  {code:'pt', flag:'🇵🇹', label:'Português'},
  {code:'nl', flag:'🇳🇱', label:'Nederlands'},
  {code:'sv', flag:'🇸🇪', label:'Svenska'},
  {code:'no', flag:'🇳🇴', label:'Norsk'},
  {code:'da', flag:'🇩🇰', label:'Dansk'},
  {code:'fi', flag:'🇫🇮', label:'Suomi'},
  {code:'ja', flag:'🇯🇵', label:'日本語'},
  {code:'zh', flag:'🇨🇳', label:'中文'},
  {code:'ko', flag:'🇰🇷', label:'한국어'},
  {code:'ar', flag:'🇸🇦', label:'العربية'},
  {code:'tr', flag:'🇹🇷', label:'Türkçe'},
  {code:'hi', flag:'🇮🇳', label:'हिन्दी'},
]

export default function Landing({ setPage }) {
  const [lang, setLang] = useState('lt')
  const [openFaq, setOpenFaq] = useState(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [msg, setMsg] = useState('')
  const [sent, setSent] = useState(false)
  const [billing, setBilling] = useState('monthly')

  const t = TRANSLATIONS[lang] || TRANSLATIONS['en']
  const P = '#5b4cf5'

  const prices = {
    monthly: ['€29', '€59', '€99'],
    yearly: ['€19', '€39', '€69'],
  }

  return (
    <div style={{ fontFamily: 'Inter, -apple-system, sans-serif', color: '#1a1a1a', background: '#fff' }}>

      {/* NAV */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 48px', borderBottom: '1px solid #e8e5e0', position: 'sticky', top: 0, background: '#fff', zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <img src="/logo.png" style={{ width: 34, height: 34, borderRadius: '50%' }} />
          <span style={{ fontWeight: 800, fontSize: 16, letterSpacing: '-0.5px' }}>ClipGen.AI</span>
        </div>
        <div className="nav-links" style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
          {[['features', t.nav.features], ['how', t.nav.how], ['pricing', t.nav.pricing], ['faq', t.nav.faq]].map(([id, label]) => (
            <button key={id} onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })}
              style={{ padding: '7px 12px', color: '#666', fontSize: 13.5, background: 'none', border: 'none', cursor: 'pointer' }}>{label}</button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <select value={lang} onChange={e => setLang(e.target.value)}
            style={{ padding: '7px 10px', borderRadius: 8, border: '1px solid #e8e5e0', background: '#f8f7f5', fontSize: 12.5, outline: 'none', cursor: 'pointer' }}>
            {LANGS.map(l => <option key={l.code} value={l.code}>{l.flag} {l.label}</option>)}
          </select>
          <button onClick={() => setPage('dashboard')}
            style={{ background: P, color: '#fff', border: 'none', borderRadius: 8, padding: '9px 20px', fontSize: 13.5, fontWeight: 600, cursor: 'pointer', boxShadow: '0 2px 8px rgba(91,76,245,0.3)' }}>
            {t.nav.start}
          </button>
        </div>
      </nav>

      {/* HERO */}
      <div style={{ textAlign: 'center', padding: '80px 24px 60px', maxWidth: 800, margin: '0 auto' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#fff5f0', color: '#e85d04', border: '1px solid #ffd7b5', borderRadius: 20, padding: '5px 14px', fontSize: 12, fontWeight: 600, marginBottom: 24 }}>
          {t.badge}
        </div>
        <h1 className="hero-title" style={{ fontSize: 60, fontWeight: 800, letterSpacing: '-3px', lineHeight: 1.05, marginBottom: 20, color: '#0a0a0a' }}>
          {t.hero1}<br />
          <span style={{ color: P }}>{t.hero2}</span><br />
          {t.hero3}
        </h1>
        <p style={{ fontSize: 18, color: '#666', lineHeight: 1.65, maxWidth: 560, margin: '0 auto 36px' }}>{t.heroSub}</p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 20 }}>
          <button onClick={() => setPage('dashboard')} style={{ background: P, color: '#fff', border: 'none', borderRadius: 10, padding: '15px 36px', fontSize: 15, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 16px rgba(91,76,245,0.35)' }}>{t.cta1}</button>
          <button onClick={() => document.getElementById('how')?.scrollIntoView({ behavior: 'smooth' })} style={{ background: '#fff', color: '#1a1a1a', border: '1px solid #e8e5e0', borderRadius: 10, padding: '15px 32px', fontSize: 15, fontWeight: 500, cursor: 'pointer' }}>{t.cta2}</button>
        </div>
        <p style={{ fontSize: 12.5, color: '#bbb' }}>{t.trust}</p>
      </div>

      {/* STATS */}
      <div style={{ background: '#f8f7f5', padding: '40px 24px' }}>
        <div className="hero-stats" style={{ maxWidth: 800, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, textAlign: 'center' }}>
          {['2.4M+','152K','96','10x'].map((val, i) => (
            <div key={i}>
              <div style={{ fontSize: 32, fontWeight: 800, color: '#0a0a0a', letterSpacing: '-1px' }}>{val}</div>
              <div style={{ fontSize: 13, color: '#888', marginTop: 4 }}>{t.statsLabels[i]}</div>
            </div>
          ))}
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div id="how" style={{ padding: '80px 24px', maxWidth: 900, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: P, letterSpacing: '2px', marginBottom: 12 }}>{t.howLabel}</div>
          <h2 style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-1.5px', marginBottom: 8 }}>
            {t.howTitle} <span style={{ color: P }}>{t.howTitle2}</span>
          </h2>
          <p style={{ color: '#888', fontSize: 15 }}>{t.howSub}</p>
        </div>
        <div className="steps-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
          {t.steps.map((s, i) => (
            <div key={i} style={{ position: 'relative' }}>
              {i < 3 && <div style={{ position: 'absolute', top: 20, left: '60%', width: '80%', height: 1, background: '#e8e5e0', zIndex: 0 }} />}
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: P + '15', border: `1px solid ${P}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: P, marginBottom: 14 }}>0{i+1}</div>
                <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 8 }}>{s.title}</div>
                <div style={{ fontSize: 12.5, color: '#888', lineHeight: 1.55 }}>{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FEATURES */}
      <div id="features" style={{ background: '#f8f7f5', padding: '80px 24px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: P, letterSpacing: '2px', marginBottom: 12 }}>{t.featLabel}</div>
            <h2 style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-1.5px', marginBottom: 8 }}>
              {t.featTitle} <span style={{ color: P }}>{t.featTitle2}</span>
            </h2>
            <p style={{ color: '#888', fontSize: 15 }}>{t.featSub}</p>
          </div>
          <div className="features-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {t.features.map((f, i) => (
              <div key={i} style={{ background: '#fff', borderRadius: 14, padding: '24px', border: '1px solid #e8e5e0' }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: P + '12', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, marginBottom: 14 }}>{f.icon}</div>
                <div style={{ fontWeight: 700, fontSize: 14.5, marginBottom: 8 }}>{f.title}</div>
                <div style={{ fontSize: 13, color: '#888', lineHeight: 1.6 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PRICING */}
      <div id="pricing" style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: P, letterSpacing: '2px', marginBottom: 12 }}>{t.pricingLabel}</div>
            <h2 style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-1.5px', marginBottom: 8 }}>{t.pricingTitle}</h2>
            <p style={{ color: '#888', fontSize: 15, marginBottom: 20 }}>{t.pricingSub}</p>
            <div style={{ display: 'inline-flex', background: '#e8e5e0', borderRadius: 10, padding: 4 }}>
              {['monthly','yearly'].map(b => (
                <button key={b} onClick={() => setBilling(b)} style={{ padding: '7px 20px', borderRadius: 8, border: 'none', background: billing === b ? '#fff' : 'transparent', color: billing === b ? '#1a1a1a' : '#888', fontWeight: billing === b ? 600 : 400, fontSize: 13, cursor: 'pointer' }}>
                  {b === 'monthly' ? t.monthly : t.yearly}
                </button>
              ))}
            </div>
          </div>
          <div className="pricing-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {t.plans.map((plan, i) => (
              <div key={i} style={{ background: '#fff', border: `2px solid ${i === 1 ? P : '#e8e5e0'}`, borderRadius: 16, padding: '28px 24px', position: 'relative', boxShadow: i === 1 ? '0 8px 32px rgba(91,76,245,0.15)' : 'none' }}>
                {i === 1 && <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: P, color: '#fff', borderRadius: 20, padding: '3px 14px', fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap' }}>BEST VALUE</div>}
                <div style={{ fontSize: 12, fontWeight: 700, color: '#aaa', letterSpacing: '0.5px', marginBottom: 6 }}>{plan.name.toUpperCase()}</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 6 }}>
                  <span style={{ fontSize: 44, fontWeight: 800, letterSpacing: '-2px', color: '#0a0a0a' }}>{prices[billing][i]}</span>
                  <span style={{ fontSize: 14, color: '#aaa' }}>/month</span>
                </div>
                <div style={{ fontSize: 13, color: '#888', marginBottom: 20, lineHeight: 1.4 }}>{plan.desc}</div>
                <button onClick={() => setPage('dashboard')} style={{ width: '100%', padding: '11px', borderRadius: 8, background: i === 1 ? P : '#fff', color: i === 1 ? '#fff' : P, border: `2px solid ${P}`, fontWeight: 700, fontSize: 14, cursor: 'pointer', marginBottom: 22 }}>{plan.cta}</button>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {plan.features.map((f, j) => (
                    <div key={j} style={{ display: 'flex', gap: 8, fontSize: 13 }}>
                      <span style={{ color: P, fontWeight: 700, flexShrink: 0 }}>✓</span>
                      <span style={{ color: '#555' }}>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div id="faq" style={{ background: '#f8f7f5', padding: '80px 24px' }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: P, letterSpacing: '2px', marginBottom: 12 }}>{t.faqLabel}</div>
            <h2 style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-1.5px', marginBottom: 8 }}>{t.faqTitle}</h2>
            <p style={{ color: '#888', fontSize: 15 }}>{t.faqSub}</p>
          </div>
          {t.faqs.map((faq, i) => (
            <div key={i} style={{ borderBottom: '1px solid #e8e5e0' }}>
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{ width: '100%', padding: '18px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
                <span style={{ fontWeight: 600, fontSize: 14.5, color: '#1a1a1a' }}>{faq.q}</span>
                <span style={{ color: P, fontSize: 20, fontWeight: 300, marginLeft: 16, flexShrink: 0 }}>{openFaq === i ? '−' : '+'}</span>
              </button>
              {openFaq === i && <div style={{ paddingBottom: 18, fontSize: 14, color: '#666', lineHeight: 1.65 }}>{faq.a}</div>}
            </div>
          ))}
        </div>
      </div>

      {/* CONTACT */}
      <div id="contact" style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: 560, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <h2 style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-1.5px', marginBottom: 8 }}>{t.contactTitle}</h2>
            <p style={{ color: '#888', fontSize: 15 }}>{t.contactSub}</p>
          </div>
          <div style={{ background: '#fff', borderRadius: 16, padding: '32px', border: '1px solid #e8e5e0' }}>
            <div className="contact-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
              <input value={name} onChange={e => setName(e.target.value)} placeholder={t.namePh} style={{ padding: '11px 14px', borderRadius: 8, border: '1px solid #e8e5e0', fontSize: 13.5, outline: 'none', background: '#fafaf8', color: '#1a1a1a' }} />
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder={t.emailPh} style={{ padding: '11px 14px', borderRadius: 8, border: '1px solid #e8e5e0', fontSize: 13.5, outline: 'none', background: '#fafaf8', color: '#1a1a1a' }} />
            </div>
            <textarea value={msg} onChange={e => setMsg(e.target.value)} placeholder={t.msgPh} rows={4} style={{ width: '100%', padding: '11px 14px', borderRadius: 8, border: '1px solid #e8e5e0', fontSize: 13.5, outline: 'none', background: '#fafaf8', color: '#1a1a1a', resize: 'vertical', marginBottom: 12, fontFamily: 'inherit' }} />
            <button onClick={() => { if (name && email && msg) { window.open(`mailto:clipgenai@gmail.com?subject=Message from ${name}&body=${msg}`); setSent(true) } }}
              style={{ width: '100%', padding: '12px', borderRadius: 8, background: P, color: '#fff', fontWeight: 700, fontSize: 14, border: 'none', cursor: 'pointer' }}>
              {sent ? t.sentMsg : t.sendBtn}
            </button>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ background: '#0a0a0a', padding: '80px 24px', textAlign: 'center', color: '#fff' }}>
        <h2 style={{ fontSize: 40, fontWeight: 800, letterSpacing: '-2px', marginBottom: 16 }}>{t.ctaFinalTitle}</h2>
        <p style={{ fontSize: 16, color: '#888', marginBottom: 32 }}>{t.ctaFinalSub}</p>
        <button onClick={() => setPage('dashboard')} style={{ background: P, color: '#fff', border: 'none', borderRadius: 10, padding: '15px 36px', fontSize: 15, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 20px rgba(91,76,245,0.4)' }}>{t.ctaFinalBtn}</button>
      </div>

      {/* FOOTER */}
      <div style={{ background: '#0a0a0a', padding: '28px 48px', borderTop: '1px solid #1a1a1a', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <img src="/logo.png" style={{ width: 26, height: 26, borderRadius: '50%' }} />
          <span style={{ fontWeight: 700, fontSize: 14, color: '#fff' }}>ClipGen.AI</span>
        </div>
        <div style={{ display: 'flex', gap: 16 }}>
          {[['features', t.nav.features], ['how', t.nav.how], ['pricing', t.nav.pricing], ['faq', t.nav.faq], ['contact', t.contactTitle]].map(([id, label]) => (
            <button key={id} onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })}
              style={{ color: '#555', fontSize: 13, background: 'none', border: 'none', cursor: 'pointer' }}>{label}</button>
          ))}
        </div>
        <span style={{ color: '#444', fontSize: 12 }}>© 2026 ClipGen.AI — {t.footerTagline}</span>
      </div>
    </div>
  )
}
// placeholder

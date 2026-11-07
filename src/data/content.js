// All page copy lives here so designers/editors can change text without touching layout.
// NOTE: values marked "placeholder" were not in the Figma file — replace with real clinic data.

export const nav = {
  links: [
    { label: 'العلاجات', href: '#services' },
    { label: 'البرنامج', href: '#journey' },
    { label: 'الأسئلة الشائعة', href: '#faq' },
    { label: 'تواصل معنا', href: '#contact' },
  ],
  login: 'دخول',
  language: 'עברית',
  cta: 'احجزي استشارة',
}

export const hero = {
  eyebrow: 'عيادة تنحيف ونحت جسم · سخنين',
  title: ['جسمك يستحق عناية،', 'بلا جراحة'],
  text: 'برنامج شخصي يبدأ باستشارة أولية، ومتابعة أسبوعية، ومسح للجسم يقيس تقدّمك بالأرقام.',
  primary: 'احجزي استشارتك الأولى',
  secondary: 'كيف يعمل البرنامج',
  floating: [
    { text: 'كل خطة تُبنى على قياسات جسمك', side: 'start' },
    { text: 'مسح ثلاثي الأبعاد كل 3 أسابيع', side: 'end' },
  ],
}

export const services = {
  badge: 'خدماتنا',
  title: 'ابدئي من المنطقة',
  accent: 'أو من هدفك',
  featured: {
    title: 'البطن والخصر',
    text: 'برنامج يركّز على محيط البطن والخصر بعد تقييم حالتك.',
    image: '/images/room-abdomen.webp',
    href: '/treatments/abdomen',
  },
  items: [
    { title: 'الفخذين والذراعين', text: 'حسب المنطقة التي تحدّدينها.', image: '/images/room-thighs.webp', href: '/treatments/thighs-arms' },
    { title: 'السيلوليت والترهل', text: 'حسب هدفك، بعد التقييم.', image: '/images/room-cellulite.webp', href: '/treatments/cellulite' },
  ],
  other: {
    title: 'خدمات أخرى',
    text: 'مسارات منفصلة وواضحة.',
    tags: ['الليزر', 'العناية بالبشرة'],
    links: ['/treatments/laser', '/treatments/skin'],
  },
}

export const results = {
  badge: 'نتائج حقيقية',
  title: 'نتائج تغيّر',
  accent: 'علاقتك بجسمك',
  tabs: ['التنحيف', 'نحت الجسم'],
  cases: [
    {
      id: 1,
      program: 'برنامج تنحيف',
      meta: '[6 أشهر] · المرحلة 1',
      phase: 'المرحلة 1',
      duration: '6 أشهر',
      metrics: [
        { label: 'الخصر', value: '−20 سم', start: 0.25, end: 1 },
        { label: 'البطن', value: '−30 سم', start: 0.2, end: 1 },
        { label: 'الأرداف', value: '−40 سم', start: 0.22, end: 1 },
      ],
    },
    // placeholder — only case 1 figures appear in the design
    {
      id: 2,
      program: 'برنامج تنحيف',
      meta: '[9 أشهر] · المرحلة 2',
      phase: 'المرحلة 2',
      duration: '9 أشهر',
      metrics: [
        { label: 'الخصر', value: '−24 سم', start: 0.3, end: 1 },
        { label: 'البطن', value: '−28 سم', start: 0.18, end: 1 },
        { label: 'الأرداف', value: '−35 سم', start: 0.26, end: 1 },
      ],
    },
    {
      id: 3,
      program: 'برنامج تنحيف',
      meta: '[4 أشهر] · المرحلة 1',
      phase: 'المرحلة 1',
      duration: '4 أشهر',
      metrics: [
        { label: 'الخصر', value: '−12 سم', start: 0.4, end: 1 },
        { label: 'البطن', value: '−15 سم', start: 0.35, end: 1 },
        { label: 'الأرداف', value: '−18 سم', start: 0.38, end: 1 },
      ],
    },
  ],
  testimonial: {
    quote:
      '«كنت متخوفة من البداية لأني جربت أشياء كثيرة قبل هيك، بس هون حسّيت الفرق من أول جلسة. أخدوا وقتهم يفهموا شو بدي، وشرحولي كل خطوة بوضوح، وصرت أعرف وين وصلت وشو الجاي.»',
    name: 'نانسي طلال أبو القمر',
    meta: 'فلسطين - 25 عاما',
    avatar: '/images/avatar.webp',
  },
  legend: { start: 'البداية', end: 'آخر مسح 3D' },
  all: 'كل النتائج',
}

export const journey = {
  title: 'طريقة جرين أبل',
  subtitle: 'رحلة واضحة من أول لقاء',
  steps: [
    { title: 'فهم هدفك', text: 'نستمع لما تريدينه فعلاً ولما يهمّك في جسمك.' },
    { title: 'تقييم وتوثيق البداية', text: 'نسجّل نقطة الانطلاق لنقيس عليها تقدّمك.' },
    { title: 'خطة شخصية', text: 'برنامج مبني على هدفك ونتيجة التقييم.' },
    { title: 'جلسات', text: 'علاج منتظم حسب خطتك.' },
    { title: 'متابعة التقدم', text: 'مراجعة دورية، وتعديل الخطة عند الحاجة.' },
  ],
}

export const booking = {
  badge: 'مواعيدك في جيبك',
  title: 'بلا اتصالات ولا انتظار،',
  accent: 'كل شي على WhatsApp',
  text: 'مواعيدك تُرتَّب تلقائياً من خطتك، وبيوصلك رابط شخصي تتابعي فيه كل شي.',
  features: [
    { icon: 'bell', title: 'تذكير قبل 4 أيام وقبل يوم', text: 'بلغتك، بالعربية أو العبرية' },
    { icon: 'check', title: 'تأكيد أو نقل بكبسة', text: 'النقل مجاني حتى 72 ساعة قبل الموعد' },
    { icon: 'clock', title: 'قائمة انتظار تلقائية', text: 'إذا تفرّغ موعد أبكر، بيوصلك العرض فوراً' },
  ],
}

export const team = {
  badge: 'الفريق',
  title: 'مين رح يرافقك',
  accent: 'بكل خطوة',
  text: 'الاستشارة مع إدارة العيادة، والخطة يضعها المدير السريري، والجلسات مع معالجات متخصصات.',
  members: [
    { name: 'د. أحمد عمر', role: 'مديرة العيادة', tag: 'الاستشارة الأولية', image: '/images/team-ahmad-3.webp' },
    { name: 'د. أحمد عمر', role: 'مدير العمليات', tag: 'الاستشارة الأولية', image: '/images/team-ahmad-2.webp' },
    { name: 'د. أحمد عمر', role: 'المدير السريري', tag: 'خطة العلاج', image: '/images/team-ahmad-1.webp' },
    { name: 'د. الاء احمد', role: 'معالجة متخصصة', tag: 'الجلسات', image: '/images/team-alaa.webp' },
  ],
}

export const faq = {
  badge: 'الأسئلة الشائعة',
  title: 'قبل ما تبدئي،',
  accent: 'كل اللي بدك تعرفيه',
  help: { title: 'سؤالك مش هون؟', text: 'راسلينا وبنرد عليكِ بأقرب وقت.', cta: 'اسألينا على WhatsApp' },
  items: [
    {
      q: 'كم بتطوّل الاستشارة الأولية؟',
      a: 'بين ساعتين وثلاث ساعات مع إدارة العيادة. منتعرّف فيها على هدفك وحالتك، ومنبني معك خطة العلاج.',
    },
    // placeholder answers below — only the first answer appears in the design
    { q: 'هل بحجز جلسات العلاج بنفسي؟', a: 'لا، مواعيد الجلسات تُرتَّب تلقائياً حسب خطتك وبتوصلك على WhatsApp للتأكيد أو النقل.' },
    { q: 'شو سياسة الإلغاء ونقل الموعد؟', a: 'نقل الموعد مجاني حتى 72 ساعة قبل الموعد، بكبسة وحدة من الرابط الشخصي.' },
    { q: 'ليش الاستمرارية مهمة؟', a: 'النتائج بتتراكم مع الجلسات المنتظمة، والمتابعة بتخلينا نعدّل الخطة بالوقت المناسب.' },
    { q: 'بقدر أتعالج وأنا حامل؟', a: 'لا ننصح بالعلاج خلال فترة الحمل. بنحدد معك الوقت المناسب للبدء بعد استشارة الطبيب.' },
    { q: 'كل قديش بعمل مسح للجسم؟', a: 'مسح ثلاثي الأبعاد كل 3 أسابيع، لنقيس تقدّمك بالأرقام.' },
    { q: 'شو طرق الدفع المتاحة؟', a: 'نقدي، بطاقة ائتمان، أو تقسيط حسب البرنامج. بنوضح لك كل التفاصيل بالاستشارة.' },
  ],
}

export const cta = {
  title: 'جاهزة تبدئي؟',
  accent: 'احجزي استشارتك بدقيقة',
  steps: ['اختاري الخدمة', 'ابعتيلنا على WhatsApp', 'منرتّب معك الموعد', 'التأكيد على WhatsApp'],
  note: 'الاستشارة 2–3 ساعات مع إدارة العيادة',
  button: 'احجزي استشارة الآن',
  form: {
    title: 'مترددة؟ منتصل فيكِ',
    subtitle: 'اتركي رقمك وبنجاوب على كل أسئلتك.',
    name: 'الاسم',
    phone: 'رقم الهاتف',
    phonePlaceholder: '05X-XXX-XXXX',
    interest: 'شو بيهمك؟',
    interests: ['التنحيف', 'نحت الجسم', 'السيلوليت والترهل', 'الليزر', 'العناية بالبشرة'],
    consent: 'بوافق إنه العيادة تتواصل معي بالهاتف أو WhatsApp.',
    submit: 'اطلبي اتصالاً',
  },
}

export const contact = {
  badge: 'تواصلي معنا',
  title: 'منستناكِ',
  accent: 'بسخنين',
  mapLabel: 'Green Apple · سخنين',
  directions: 'الاتجاهات',
  mapUrl: 'https://www.google.com/maps/search/?api=1&query=Sakhnin',
  cards: [
    { icon: 'pin', label: 'العنوان', value: 'سخنين · [الشارع]' },
    { icon: 'clock', label: 'ساعات العمل', value: '09:00–18:00' },
    { icon: 'phone', label: 'الهاتف', value: '0592373805', href: 'tel:0592373805' },
    { icon: 'whatsapp', label: 'WhatsApp', value: '+972592373805', href: 'https://wa.me/972592373805' },
  ],
}

export const footer = {
  about: 'عيادة تنحيف ونحت جسم بسخنين. برنامج شخصي بخطة ومتابعة وقياس.',
  columns: [
    { title: 'الموقع', links: ['العلاجات', 'النتائج', 'العروض', 'من نحن'] },
    { title: 'للمريضات', links: ['دخول المريضات', 'احجزي استشارة', 'الأسئلة الشائعة'] },
  ],
  follow: 'تابعينا',
  hebrew: 'לאתר בעברית',
  privacy: 'بياناتك الصحية محمية وفق قانون حماية الخصوصية، ولا تُنشر أي صورة إلا بموافقة موقّعة من صاحبتها.',
  copyright: '© 2026 Green Apple · The Art of Health & Beauty',
  legal: ['سياسة الخصوصية', 'الشروط والاحكام'],
}

export const WHATSAPP_URL = 'https://wa.me/972592373805'

// ⚠️ الرقم لسا بانتظار تأكيد العيادة — لما يتأكد غيّريه هون وبالسطر اللي فوق.
export const PHONE = { label: '0592373805', href: 'tel:0592373805' }

// لحد ما يجهز نظام الحجز: أزرار الحجز بتفتح WhatsApp برسالة جاهزة بلغة الصفحة
const BOOKING_TEXT = {
  ar: 'مرحبا، بدي أحجز استشارة',
  en: 'Hi, I would like to book a consultation',
  he: 'שלום, אני רוצה לקבוע ייעוץ',
}
export const bookingUrl = (lang = 'ar') =>
  `${WHATSAPP_URL}?text=${encodeURIComponent(BOOKING_TEXT[lang] || BOOKING_TEXT.ar)}`
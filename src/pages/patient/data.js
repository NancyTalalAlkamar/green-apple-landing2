import { Award, CalendarCheck, Clock, Droplets, Flame, Footprints, Leaf, Receipt, Ruler, Star, TrendingDown, Trophy, X } from 'lucide-react'
import { WHATSAPP_URL } from '../../data/content'

/* ─────────────────────────────────────────────
   منطقة المريضة — نسخة تجريبية (واجهة بس).
   الباك اند بيربط: الدخول برمز SMS، المواعيد، القياسات.
   كل البيانات هون وهمية للعرض.
   ───────────────────────────────────────────── */
const DAY = 24 * 60 * 60 * 1000

export const at = (days, h = 10, m = 0) => {
  const d = new Date(Date.now() + days * DAY)
  d.setHours(h, m, 0, 0)
  return d
}

export const fmtDay = (d) =>
  new Intl.DateTimeFormat('ar-u-nu-latn', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(d)

export const fmtTime = (d) =>
  new Intl.DateTimeFormat('ar-u-nu-latn', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(d)

export const fmtShort = (d) =>
  new Intl.DateTimeFormat('ar-u-nu-latn', {
    weekday: 'long',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(d)

export const fmtWeekday = (d, style = 'long') => new Intl.DateTimeFormat('ar', { weekday: style }).format(d)

export const fmtMonth = (d) => new Intl.DateTimeFormat('ar', { month: 'long' }).format(d)

export const fmtDate = (d) => new Intl.DateTimeFormat('ar-u-nu-latn', { day: 'numeric', month: 'short' }).format(d)

const sameDay = (a, b) => a.toDateString() === b.toDateString()

export const HOUR = 36e5

/* ─────────── البيانات التجريبية (بتيجي من النظام لما ينربط) ─────────── */
export const PATIENT = { name: 'سارة', phone: '+972 50-123-4567' }

export const CLINIC = {
  address: '[الشارع والرقم] · سخنين',
  waze: 'https://waze.com/ul?q=Green%20Apple%20Sakhnin',
  maps: 'https://www.google.com/maps/search/?api=1&query=Green+Apple+Sakhnin',
}

export const wa = (text) => `${WHATSAPP_URL}?text=${encodeURIComponent(text)}`

/* سياسة المواعيد: الأرقام بتتعدّل من إعدادات النظام */
export const POLICY = { freeHours: 72, maxStrikes: 3, lockDays: 4, scanEveryDays: 21 }

export const STAGES = [
  { n: 1, name: 'العلاج المكثّف', span: '9 أشهر', months: 9 },
  { n: 2, name: 'المتابعة', span: '3 أشهر', months: 3 },
  { n: 3, name: 'الصيانة', span: 'مستمرة', months: 0 },
]

export const PROGRAM = {
  name: 'برنامج التنحيف ونحت الجسم',
  stage: 1,
  stageMonth: 3,
  cycle: 1,
  cadence: 'جلسة كل أسبوع',
  sessionsDone: 12,
  sessionsTotal: 39,
}

/* القياسات من كل مسح (كل 21 يوم) */
export const METRICS = [
  { id: 'waist', label: 'الخصر', unit: 'cm', values: [92, 90.5, 89, 87] },
  { id: 'hips', label: 'الأرداف', unit: 'cm', values: [104, 102.5, 101.5, 100] },
  { id: 'weight', label: 'الوزن', unit: 'kg', values: [78, 76.9, 75.8, 75.1] },
]

export const SCAN_DATES = [at(-65, 10), at(-44, 10), at(-23, 10), at(-2, 10)]

export const BADGES = [
  { icon: Star, title: 'أول خطوة', text: 'أول جلسة', earned: true, how: 'كسبتيها بأول جلسة إلك. البداية هي أصعب خطوة!' },
  { icon: Flame, title: 'شهر التزام', text: 'شهر بدون تأخير', earned: true, how: 'شهر كامل بدون تأخير أو إلغاء متأخر. التزامك بيبيّن بالنتيجة 🌟' },
  { icon: Ruler, title: 'أول 5 سم', text: 'من الخصر', earned: true, how: 'نزل خصرك 5 سم من أول مسح. استمري هيك!' },
  { icon: Trophy, title: '20 جلسة', text: 'باقي 8', earned: false, how: 'كمّلي 8 جلسات كمان وبتنفتحلك.' },
  { icon: Award, title: 'نص المرحلة', text: 'الشهر 5', earned: false, how: 'بتنفتح لما توصلي الشهر 5 من المرحلة الأولى.' },
]

export const PACKAGES = [
  { id: 'main', name: 'برنامج التنحيف · المرحلة 1', used: 12, total: 39, color: '#a8766a' },
  { id: 'laser', name: 'ليزر · منطقتين', used: 2, total: 6, color: '#6b645e' },
]

export const PAYMENTS = {
  total: 9000,
  paid: 6000,
  installments: [
    { label: 'الدفعة 1', amount: 3000, date: at(-80), paid: true },
    { label: 'الدفعة 2', amount: 1500, date: at(-50), paid: true },
    { label: 'الدفعة 3', amount: 1500, date: at(-20), paid: true },
    { label: 'الدفعة 4', amount: 1500, date: at(10), paid: false },
    { label: 'الدفعة 5', amount: 1500, date: at(40), paid: false },
  ],
}

export const nis = (n) => `₪${n.toLocaleString('en-US')}`

export const PREP = [
  { icon: Droplets, text: 'اشربي لتر ونص مي اليوم' },
  { icon: Clock, text: 'كلي وجبة خفيفة قبل بساعتين' },
  { icon: Leaf, text: 'البسي لبس مريح وواسع' },
  { icon: X, text: 'بلا كريمات على منطقة العلاج' },
]

export const AFTERCARE = [
  { icon: Droplets, title: 'اشربي مي كتير', text: 'لتنين اليوم بيساعدوا الجسم يتخلّص من الدهون.' },
  { icon: Footprints, title: 'امشي 20 دقيقة', text: 'الحركة الخفيفة بعد الجلسة بتحسّن النتيجة.' },
  { icon: Flame, title: 'بلا ساونا 24 ساعة', text: 'وبلا حمّام سخن كتير على المنطقة.' },
]

export const FAQ = [
  { q: 'ليش في سياسة 72 ساعة؟', a: 'كل موعد إلك بيكون محجوز إلك جهاز وغرفة ومعالِجة. لما نعرف بكّير، منقدر نعطي الوقت لغيرك، وإنتِ بتحافظي على تسلسل خطتك.' },
  { q: 'شو بصير إذا وصلت 3 مخالفات بالشهر؟', a: 'البرنامج بيتجمّد مؤقتاً، ومنحكي معك لنرتّب الرجعة. المخالفات بتتصفّر أول كل شهر.' },
  { q: 'ليش وقت الوصول بيتثبّت قبل 4 أيام؟', a: 'عشان نرتّب الأجهزة والطاقم لكل جلسة. بعد التثبيت، أي تغيير بيمرّ عن طريق الاستقبال.' },
  { q: 'كل قديش بيصير مسح الجسم؟', a: 'كل 3 أسابيع تقريباً. بيوخد 5 دقايق زيادة على الجلسة، ومنقارن النتيجة مع البداية.' },
  { q: 'كيف بدفع الدفعة الجاية؟', a: 'من «الباقة والدفع» بتلاقي رابط دفع آمن. وفيكِ تدفعي بالعيادة كمان.' },
]

/* الحالات اللي بتقدري تجرّبيها بالعرض التجريبي */
export const SCENARIOS = [
  { id: 'normal', label: 'يوم عادي' },
  { id: 'today', label: 'يوم الموعد' },
  { id: 'offer', label: 'فضي موعد أبكر' },
  { id: 'after', label: 'بعد الجلسة' },
  { id: 'frozen', label: 'برنامج مجمّد' },
]

/* سلسلة المواعيد: بتنولّد تلقائياً لـ 12 أسبوع */
export function makeAppointments(scenario) {
  const first = scenario === 'today' ? new Date(Math.ceil((Date.now() + 2 * HOUR) / (30 * 6e4)) * 30 * 6e4) : at(2, 10, 0)
  const list = Array.from({ length: 12 }, (_, k) => {
    const date = new Date(first.getTime() + k * 7 * 24 * HOUR)
    const n = PROGRAM.sessionsDone + 1 + k
    const scan = n % 3 === 0
    return {
      id: `s${n}`,
      n,
      date,
      title: `جلسة ${n}`,
      kind: 'main',
      hours: '2.5 ساعة',
      scan,
      status: scenario === 'frozen' ? 'paused' : k === 0 && scenario !== 'today' ? 'pending' : k === 0 ? 'confirmed' : 'scheduled',
    }
  })
  list.push({
    id: 'l3',
    n: 3,
    date: at(5, 17, 0),
    title: 'ليزر · جلسة 3',
    kind: 'laser',
    hours: '30 دقيقة',
    status: scenario === 'frozen' ? 'paused' : 'scheduled',
  })
  list.push({
    id: 'l4',
    n: 4,
    date: at(33, 17, 0),
    title: 'ليزر · جلسة 4',
    kind: 'laser',
    hours: '30 دقيقة',
    status: scenario === 'frozen' ? 'paused' : 'scheduled',
  })
  return list.sort((a, b) => a.date - b.date)
}

export const PAST = [
  { id: 'p12', title: 'جلسة 12 + مسح 3D', date: at(-2, 10), done: true },
  { id: 'p11', title: 'جلسة 11', date: at(-9, 10), done: true },
  { id: 'pl2', title: 'ليزر · جلسة 2', date: at(-12, 17), done: true },
  { id: 'p10', title: 'جلسة 10', date: at(-16, 16, 30), done: true, moved: true },
]

export const STATUS = {
  pending: { label: 'بانتظار تأكيدك', cls: 'bg-amber-50 text-amber-800 ring-amber-200' },
  confirmed: { label: 'مؤكّد', cls: 'bg-forest-800/5 text-forest-800 ring-forest-800/15' },
  scheduled: { label: 'محجوز', cls: 'bg-sand-100 text-ink/60 ring-sage-200' },
  cancelled: { label: 'ملغي', cls: 'bg-red-50 text-red-700 ring-red-200' },
  paused: { label: 'موقوف', cls: 'bg-sage-100 text-ink/50 ring-sage-200' },
}

export const NOTIFS = [
  { id: 1, icon: CalendarCheck, title: 'أكّدي حضورك', text: 'جلسة 13 بعد يومين. أكّدي حضورك بكبسة.', time: 'قبل ساعة', read: false },
  { id: 2, icon: TrendingDown, title: 'نتيجة المسح جاهزة', text: 'الخصر نزل 2 سم من آخر مسح. شوفي «تقدّمي».', time: 'أمس', read: false },
  { id: 3, icon: Flame, title: 'شارة جديدة 🌟', text: 'شهر كامل بدون أي تأخير. يعطيكِ العافية!', time: 'قبل 3 أيام', read: true },
  { id: 4, icon: Receipt, title: 'وصل الدفع', text: 'استلمنا الدفعة 3. الوصل موجود بـ«الباقة والدفع».', time: 'قبل أسبوعين', read: true },
]

/* تخزين الدخول للتجربة: "تذكّريني" بيحفظه حتى لو سكّرت المتصفح */
const KEY = 'ga-demo-login'

export const store = {
  get: () => {
    try {
      return localStorage.getItem(KEY) === '1' || sessionStorage.getItem(KEY) === '1'
    } catch {
      return false
    }
  },
  set: (v, remember = true) => {
    try {
      localStorage.removeItem(KEY)
      sessionStorage.removeItem(KEY)
      if (v) sessionStorage.setItem(KEY, '1')
    } catch {
      /* ignore */
    }
  },
}

export const isLocked = (a) => a.date - Date.now() < POLICY.lockDays * 24 * HOUR

export const isLate = (a) => a.date - Date.now() < POLICY.freeHours * HOUR
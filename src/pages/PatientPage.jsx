import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, MotionConfig } from 'framer-motion'
import {
  Phone,
  ArrowLeft,
  Pencil,
  MessageCircle,
  Sparkles,
  CalendarDays,
  Clock,
  Check,
  X,
  RefreshCw,
  AlertTriangle,
  ScanLine,
  Bell,
  LogOut,
  TrendingDown,
  ShieldCheck,
  Hourglass,
  Info,
  UserRound,
} from 'lucide-react'
import { EASE } from '../lib/motion'
import { WHATSAPP_URL } from '../data/content'

/* ─────────────────────────────────────────────
   منطقة المريضة — نسخة تجريبية (واجهة بس).
   الباك اند بيربط: الدخول برمز SMS، المواعيد، القياسات.
   كل البيانات هون وهمية للعرض.
   ───────────────────────────────────────────── */
const DAY = 24 * 60 * 60 * 1000
const at = (days, h, m = 0) => {
  const d = new Date(Date.now() + days * DAY)
  d.setHours(h, m, 0, 0)
  return d
}
const fmtDay = (d) =>
  new Intl.DateTimeFormat('ar-u-nu-latn', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(d)
const fmtTime = (d) =>
  new Intl.DateTimeFormat('ar-u-nu-latn', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(d)

const fmtShort = (d) =>
  new Intl.DateTimeFormat('ar-u-nu-latn', {
    weekday: 'long',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(d)

const PATIENT = {
  name: 'سارة',
  phone: '+972 50-123-4567',
}

/* برامجها: ممكن يكون عندها أكتر من خدمة بنفس الوقت */
const PROGRAMS = [
  {
    id: 'sculpt',
    name: 'نحت البطن والخصر',
    short: 'نحت',
    sessionsDone: 4,
    sessionsTotal: 12,
    phases: [
      { name: 'تمهيد', end: 4 },
      { name: 'نحت', end: 9 },
      { name: 'تثبيت', end: 12 },
    ],
    scanSessions: [1, 3, 6, 9, 12],
    scanName: 'مسح 3D',
    metric: { label: 'الخصر', unit: 'cm' },
    scans: [
      { label: 'البداية', v: 92 },
      { label: 'مسح 2', v: 89 },
      { label: 'مسح 3', v: 87 },
    ],
  },
  {
    id: 'slim',
    name: 'برنامج التخسيس',
    short: 'تخسيس',
    sessionsDone: 3,
    sessionsTotal: 8,
    phases: [
      { name: 'بداية', end: 2 },
      { name: 'نزول', end: 6 },
      { name: 'ثبات', end: 8 },
    ],
    scanSessions: [1, 3, 5, 8],
    scanName: 'قياس وزن',
    metric: { label: 'الوزن', unit: 'kg' },
    scans: [
      { label: 'البداية', v: 78 },
      { label: 'وزن 2', v: 76.4 },
      { label: 'وزن 3', v: 75.1 },
    ],
  },
]
const PROGRAM_STYLE = { sculpt: 'bg-copper-300/25 text-copper-700', slim: 'bg-forest-800/10 text-forest-800' }
const PROGRAM_DOT = { sculpt: 'bg-copper-500', slim: 'bg-forest-700' }
const PHASE_COLORS = ['bg-copper-300', 'bg-copper-600', 'bg-forest-800']

const makeAppointments = () => [
  { id: 1, program: 'sculpt', date: at(2, 10, 0), hours: '2.5 ساعة', title: 'جلسة نحت 5', status: 'pending' },
  { id: 2, program: 'slim', date: at(4, 17, 0), hours: '45 دقيقة', title: 'جلسة تخسيس 4', status: 'confirmed' },
  { id: 3, program: 'sculpt', date: at(6, 16, 30), hours: '2.5 ساعة', title: 'جلسة نحت 6 + مسح 3D', status: 'confirmed', scan: true },
  { id: 4, program: 'sculpt', date: at(9, 10, 0), hours: '2 ساعة', title: 'جلسة نحت 7', status: 'pending' },
  { id: 5, program: 'slim', date: at(11, 17, 0), hours: '45 دقيقة', title: 'جلسة تخسيس 5 + وزن', status: 'pending', scan: true },
]

const SLOTS = [at(3, 10, 0), at(3, 16, 30), at(5, 10, 0), at(5, 12, 30), at(5, 18, 0), at(7, 10, 0)]

/* تعليمات التحضير حسب نوع الجلسة */
const PREP = {
  sculpt: ['اشربي مي كفاية اليوم', 'كلي وجبة خفيفة قبل بساعتين', 'البسي لبس مريح وواسع', 'بلا كريمات على المنطقة'],
  slim: ['تعالي قبل الموعد بـ 10 دقايق', 'البسي لبس خفيف للوزن', 'جيبي دفتر الأكل تبعك', 'اشربي مي كفاية اليوم'],
}

/* نصيحة من الأخصائية لكل برنامج (بتتعدّل من لوحة التحكم) */
const TIPS = {
  sculpt: { who: 'أخصائية النحت', text: 'المشي 20 دقيقة بعد الجلسة بيساعد الجسم يتخلّص من الدهون أسرع.' },
  slim: { who: 'أخصائية التغذية', text: 'وجبة فطور فيها بروتين بتخفّف الجوع لآخر النهار.' },
}

/* سياسة النقل والإلغاء (الأرقام بتحددها العيادة) */
const POLICY = { freeHours: 72, maxStrikes: 3, strikes: 0 }

const NOTIFS = [
  { id: 1, icon: CalendarDays, title: 'أكّدي حضورك', text: 'جلسة نحت 5 بعد يومين. اسحبي على البطاقة لتأكيد الحضور.', time: 'قبل ساعة', read: false },
  { id: 2, icon: TrendingDown, title: 'نتيجة القياس جاهزة', text: 'الخصر نزل 2 سم من آخر مسح. شوفي التفاصيل بلوحتك.', time: 'أمس', read: false },
  { id: 3, icon: Sparkles, title: 'انضاف برنامج جديد', text: 'برنامج التخسيس صار جزء من خطتك.', time: 'قبل 3 أيام', read: true },
  { id: 4, icon: MessageCircle, title: 'رسالة من العيادة', text: 'أهلا فيكِ! أي سؤال عن خطتك احكينا على WhatsApp.', time: 'قبل أسبوع', read: true },
]

const STATUS = {
  pending: { label: 'بانتظار تأكيدك', cls: 'bg-amber-50 text-amber-800 border-amber-200' },
  confirmed: { label: 'مؤكّد', cls: 'bg-forest-800/5 text-forest-800 border-forest-800/15' },
  done: { label: 'تم', cls: 'bg-sand-100 text-ink/55 border-sage-200' },
  cancelled: { label: 'ملغي', cls: 'bg-red-50 text-red-700 border-red-200' },
}

/* تخزين الدخول للتجربة: "تذكّريني" بيحفظه حتى لو سكّرت المتصفح */
const KEY = 'ga-demo-login'
const store = {
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
      if (v) (remember ? localStorage : sessionStorage).setItem(KEY, '1')
    } catch {
      /* ignore */
    }
  },
}

/* تنبيه صغير: نسخة تجريبية */
function DemoPill({ className = '' }) {
  return (
    <span
      className={`inline-flex w-fit items-center rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-[11px] font-semibold text-amber-800 ${className}`}
    >
      نسخة تجريبية
      <span className="hidden sm:inline">&nbsp;· البيانات وهمية لحد ما ينربط النظام</span>
    </span>
  )
}

/* ═════════ 1. الدخول: شاشة بطابع العيادة ═════════ */
const PREVIEW = [
  { icon: CalendarDays, title: 'موعدك الجاي', text: 'السبت · 10:00' },
  { icon: TrendingDown, title: 'الخصر من البداية', text: 'نزل 5 سم' },
  { icon: ScanLine, title: 'المسح الجاي', text: 'بعد 7 أيام' },
  { icon: Sparkles, title: 'جلسة 5 من 12', text: 'مرحلة النحت' },
]

/* رقم الجوال بعد +972: 9 أرقام بدون الصفر (50-123-4567) */
const formatPhone = (v) => {
  const d = v.replace(/\D/g, '').replace(/^0+/, '').slice(0, 9)
  return [d.slice(0, 2), d.slice(2, 5), d.slice(5)].filter(Boolean).join('-')
}

function ClinicPanel() {
  const [i, setI] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % PREVIEW.length), 2600)
    return () => clearInterval(t)
  }, [])
  const P = PREVIEW[i]
  return (
    <div className="relative h-44 overflow-hidden bg-forest-900 sm:h-56 lg:absolute lg:inset-0 lg:h-auto lg:rounded-s-5xl">
      <img src="/images/body-scan.webp" alt="" className="absolute inset-0 size-full object-cover opacity-60" />
      <div className="absolute inset-0 bg-gradient-to-t from-forest-900 via-forest-900/40 to-forest-900/10" />

      {/* إطار الماسح وخط المسح */}
      <div className="absolute inset-6 lg:inset-10">
        {[
          'top-0 right-0 border-t-2 border-r-2',
          'top-0 left-0 border-t-2 border-l-2',
          'bottom-0 right-0 border-b-2 border-r-2',
          'bottom-0 left-0 border-b-2 border-l-2',
        ].map((c) => (
          <span key={c} className={`absolute size-6 rounded-sm border-copper-300 ${c}`} />
        ))}
        <motion.span
          className="absolute inset-x-0 h-px bg-copper-300 shadow-[0_0_18px_4px_rgba(217,160,106,0.55)]"
          animate={{ top: ['4%', '96%', '4%'] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="relative flex h-full flex-col justify-end p-6 text-white lg:justify-between lg:p-10">
        <div className="hidden items-center gap-3 lg:flex">
          <img src="/images/logo-mark-white.png" alt="" className="h-9 lg:h-11" />
          <span className="text-[11px] tracking-[0.2em] text-white/60 uppercase">The Art of Health &amp; Beauty</span>
        </div>

        <div className="hidden lg:block">
          <p className="text-4xl leading-tight font-bold">
            رحلتك،
            <br />
            <span className="text-copper-300">بإيدك.</span>
          </p>
          <p className="mt-3 max-w-xs text-sm leading-7 text-white/65">مواعيدك، قياساتك وتحضيرات كل جلسة بمكان واحد.</p>
        </div>

        {/* لمحة عن اللي جوّا */}
        <div className="flex items-center gap-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 14, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -14, filter: 'blur(4px)' }}
              transition={{ duration: 0.45, ease: EASE }}
              className="flex items-center gap-3 rounded-2xl bg-white/10 py-2.5 ps-2.5 pe-5 ring-1 ring-white/15 backdrop-blur-md"
            >
              <span className="grid size-10 place-items-center rounded-xl bg-copper-300 text-forest-900">
                <P.icon className="size-5" />
              </span>
              <span>
                <span className="block text-[11px] text-white/60">{P.title}</span>
                <span className="block font-bold">{P.text}</span>
              </span>
            </motion.div>
          </AnimatePresence>
          <div className="flex gap-1.5">
            {PREVIEW.map((_, k) => (
              <span key={k} className={`h-1.5 rounded-full transition-all duration-500 ${k === i ? 'w-5 bg-copper-300' : 'w-1.5 bg-white/30'}`} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function Login({ onDone }) {
  const [step, setStep] = useState('phone') // phone | code | done
  const [phone, setPhone] = useState('')
  const [remember, setRemember] = useState(true)
  const [code, setCode] = useState(['', '', '', ''])
  const [err, setErr] = useState('')
  const [shake, setShake] = useState(0)
  const [wait, setWait] = useState(0)
  const refs = useRef([])
  const valid = /^5\d{8}$/.test(phone.replace(/\D/g, ''))

  useEffect(() => {
    if (wait <= 0) return undefined
    const t = setTimeout(() => setWait((w) => w - 1), 1000)
    return () => clearTimeout(t)
  }, [wait])

  const fail = (m) => {
    setErr(m)
    setShake((s) => s + 1)
  }

  const sendCode = (e) => {
    e.preventDefault()
    if (!valid) return fail('اكتبي 9 أرقام بعد +972، مثلاً 50-123-4567')
    setErr('')
    setCode(['', '', '', ''])
    setWait(30)
    setStep('code')
  }

  const finish = () => {
    setStep('done')
    setTimeout(() => onDone(remember), 1500)
  }

  const typeDigit = (i, val) => {
    const ds = val.replace(/\D/g, '')
    const next = [...code]
    if (ds.length > 1) {
      // لصق الرمز كامل أو تعبئة تلقائية من SMS
      ds.slice(0, 4)
        .split('')
        .forEach((d, k) => (next[k] = d))
    } else {
      next[i] = ds
      if (ds && i < 3) refs.current[i + 1]?.focus()
    }
    setCode(next)
    setErr('')
    if (next.every(Boolean)) finish()
  }

  const steps = ['رقمك', 'الرمز', 'جاهزة']
  const stepIndex = step === 'phone' ? 0 : step === 'code' ? 1 : 3

  return (
    <div className="grid min-h-svh grid-cols-1 bg-white lg:grid-cols-2">
      {/* الفورم */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE }}
        className="mx-auto flex w-full max-w-lg flex-col px-5 py-6 sm:px-10 sm:py-8"
      >
        {/* راس الصفحة: اللوغو والرجوع للموقع */}
        <div className="mb-8 flex items-center justify-between gap-3">
          <a href="/" className="flex items-center gap-2.5" aria-label="Green Apple · الرئيسية">
            <img src="/images/logo-mark.png" alt="" className="h-9" />
            <span className="font-bold text-ink">Green Apple</span>
          </a>
          <a
            href="/"
            className="group flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-semibold text-ink/60 ring-1 ring-sage-200 transition hover:text-ink"
          >
            رجوع للموقع
            <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
          </a>
        </div>
        <DemoPill className="mb-6" />
        {/* خطوات */}
        <div className="flex items-center gap-2">
          {steps.map((s, k) => (
            <div key={s} className="flex flex-1 items-center gap-2">
              <span
                className={`grid size-7 shrink-0 place-items-center rounded-full text-xs font-bold transition-colors duration-500 ${
                  k < stepIndex ? 'bg-forest-800 text-white' : k === stepIndex ? 'bg-copper-600 text-white' : 'bg-sand-100 text-ink/40'
                }`}
              >
                {k < stepIndex ? <Check className="size-3.5" /> : k + 1}
              </span>
              <span className={`text-xs font-semibold ${k <= stepIndex ? 'text-ink' : 'text-ink/40'}`}>{s}</span>
              {k < steps.length - 1 && (
                <span className="h-0.5 flex-1 overflow-hidden rounded-full bg-sand-100">
                  <motion.span
                    className="block h-full bg-forest-800"
                    animate={{ width: k < stepIndex ? '100%' : '0%' }}
                    transition={{ duration: 0.6, ease: EASE }}
                  />
                </span>
              )}
            </div>
          ))}
        </div>

        <div className="flex flex-1 flex-col justify-center py-10">
          <AnimatePresence mode="wait">
            {step === 'phone' && (
              <motion.form
                key="phone"
                onSubmit={sendCode}
                initial={{ opacity: 0, x: -24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 24 }}
                transition={{ duration: 0.35 }}
              >
                <p className="text-3xl font-bold text-ink sm:text-4xl">
                  أهلا فيكِ{' '}
                  <motion.span className="inline-block origin-bottom-right" animate={{ rotate: [0, 18, -8, 18, 0] }} transition={{ duration: 1.4, delay: 0.5 }}>
                    👋
                  </motion.span>
                </p>
                <p className="mt-2 text-ink/60">ادخلي برقم جوالك اللي سجّلتي فيه بالعيادة.</p>

                <label htmlFor="pp-phone" className="mt-7 block text-sm font-semibold text-ink">
                  رقم الجوال
                </label>
                <motion.div
                  key={shake}
                  animate={shake ? { x: [0, -8, 8, -6, 6, 0] } : {}}
                  transition={{ duration: 0.4 }}
                  className={`mt-2 flex items-center gap-3 rounded-2xl border-2 bg-sand-50 px-4 transition-colors focus-within:bg-white ${
                    err ? 'border-red-300' : valid ? 'border-forest-800/40' : 'border-sage-200 focus-within:border-copper-500'
                  }`}
                  dir="ltr"
                >
                  <span className="flex items-center gap-1.5 border-r border-sage-200 pr-3 text-sm font-semibold text-ink/60">
                    <Phone className="size-4 text-copper-600" /> +972
                  </span>
                  <input
                    id="pp-phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel-national"
                    maxLength={11}
                    autoFocus
                    value={phone}
                    onChange={(e) => {
                      setPhone(formatPhone(e.target.value))
                      setErr('')
                    }}
                    placeholder="50-123-4567"
                    className="h-14 min-w-0 flex-1 bg-transparent text-lg font-semibold tracking-wider text-ink outline-none placeholder:font-normal placeholder:text-ink/25"
                  />
                  <AnimatePresence>
                    {valid && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="grid size-6 place-items-center rounded-full bg-forest-800 text-white"
                      >
                        <Check className="size-3.5" />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.div>
                {err && <p className="mt-2 text-xs text-red-700">{err}</p>}

                <label className="mt-4 flex cursor-pointer items-center gap-2.5 text-sm text-ink/70">
                  <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="size-4 accent-[#b4683b]" />
                  تذكّريني على هاد الجهاز
                </label>

                <button
                  type="submit"
                  className={`group mt-6 flex h-14 w-full items-center justify-center gap-2 rounded-full font-bold transition ${valid ? 'bg-copper-600 text-white hover:bg-copper-700' : 'bg-sand-100 text-ink/40'}`}
                >
                  ابعتولي رمز دخول
                  <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
                </button>
                <p className="mt-3 text-center text-xs text-ink/50">رح يوصلك رمز من 4 أرقام برسالة SMS · ما في كلمة سر تتذكريها</p>
              </motion.form>
            )}

            {step === 'code' && (
              <motion.div
                key="code"
                initial={{ opacity: 0, x: -24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 24 }}
                transition={{ duration: 0.35 }}
              >
                <motion.span
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 16 }}
                  className="grid size-14 place-items-center rounded-2xl bg-sand-100 text-copper-600"
                >
                  <MessageCircle className="size-6" />
                </motion.span>
                <p className="mt-5 text-3xl font-bold text-ink">شيّكي رسائلك</p>
                <p className="mt-2 flex flex-wrap items-center gap-2 text-ink/60">
                  بعتنا رمز على
                  <bdi dir="ltr" className="font-bold text-ink">
                    +972 {phone}
                  </bdi>
                  <button
                    type="button"
                    onClick={() => setStep('phone')}
                    className="inline-flex items-center gap-1 rounded-full bg-sand-50 px-2.5 py-1 text-xs font-semibold text-copper-600 ring-1 ring-sage-200"
                  >
                    <Pencil className="size-3" /> تعديل
                  </button>
                </p>

                <div className="mt-7 flex justify-start gap-3" dir="ltr">
                  {code.map((c, i) => (
                    <motion.input
                      key={i}
                      ref={(el) => (refs.current[i] = el)}
                      autoFocus={i === 0}
                      inputMode="numeric"
                      autoComplete={i === 0 ? 'one-time-code' : 'off'}
                      aria-label={`رقم ${i + 1} من الرمز`}
                      value={c}
                      onChange={(e) => typeDigit(i, e.target.value)}
                      onKeyDown={(e) => e.key === 'Backspace' && !c && i > 0 && refs.current[i - 1]?.focus()}
                      animate={{
                        scale: c ? [1, 1.12, 1] : 1,
                        borderColor: c ? '#b4683b' : '#dbe5de',
                      }}
                      className="size-14 rounded-2xl border-2 bg-sand-50 text-center text-2xl font-bold text-ink outline-none focus:bg-white focus:ring-4 focus:ring-copper-300/25 sm:size-16"
                    />
                  ))}
                </div>
                {err && <p className="mt-2 text-xs text-red-700">{err}</p>}

                <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                  {wait > 0 ? (
                    <span className="flex items-center gap-2 text-ink/50">
                      <svg viewBox="0 0 20 20" className="size-5 -rotate-90">
                        <circle cx="10" cy="10" r="8" fill="none" stroke="#efe6da" strokeWidth="2.5" />
                        <circle
                          cx="10"
                          cy="10"
                          r="8"
                          fill="none"
                          stroke="#b4683b"
                          strokeWidth="2.5"
                          strokeDasharray={50.3}
                          strokeDashoffset={50.3 * (1 - wait / 30)}
                          className="transition-[stroke-dashoffset] duration-1000 ease-linear"
                        />
                      </svg>
                      فيكِ تطلبي رمز جديد بعد <b className="tabular-nums">{wait}</b> ثانية
                    </span>
                  ) : (
                    <>
                      <button type="button" onClick={() => setWait(30)} className="flex items-center gap-1.5 font-semibold text-copper-600">
                        <RefreshCw className="size-4" /> ابعتولي رمز جديد
                      </button>
                      <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 font-semibold text-forest-800">
                        <MessageCircle className="size-4" /> الرمز ما وصل؟ احكي معنا
                      </a>
                    </>
                  )}
                </div>
                <p className="mt-6 inline-block rounded-full bg-amber-50 px-3 py-1 text-xs text-amber-800 ring-1 ring-amber-200">
                  نسخة تجريبية: اكتبي <b>أي 4 أرقام</b>
                </p>
              </motion.div>
            )}

            {step === 'done' && (
              <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="py-6 text-center">
                <svg viewBox="0 0 80 80" className="mx-auto size-20">
                  <motion.circle
                    cx="40"
                    cy="40"
                    r="36"
                    fill="none"
                    stroke="#b4683b"
                    strokeWidth="4"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.6 }}
                  />
                  <motion.path
                    d="M25 41 l10 10 l20 -22"
                    fill="none"
                    stroke="#14291f"
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.4, delay: 0.5 }}
                  />
                </svg>
                <p className="mt-5 text-3xl font-bold text-ink">أهلا {PATIENT.name}!</p>
                <p className="mt-2 text-ink/60">عم نجهّزلك منطقتك…</p>
                <div className="mx-auto mt-5 h-1 w-40 overflow-hidden rounded-full bg-sand-100">
                  <motion.div
                    className="h-full bg-copper-600"
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 1.4, ease: 'easeInOut' }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* مساعدة وثقة */}
        <div className="space-y-3 border-t border-sage-200 pt-5 text-sm">
          <p className="text-ink/60">
            لسا مش مسجّلة عنا؟{' '}
            <a href="/contact" className="font-bold text-copper-600 hover:underline">
              احجزي استشارة أولى
            </a>
          </p>
          <p className="flex items-start gap-2 text-xs leading-5 text-ink/45">
            <ShieldCheck className="mt-0.5 size-4 shrink-0 text-forest-800" />
            <span>
              بياناتك الصحية محمية ومشفّرة، وما حدا بيشوفها غير الفريق المعالج. بدخولك إنتِ موافقة على{' '}
              <a href="#" className="underline">
                سياسة الخصوصية
              </a>
              .
            </span>
          </p>
        </div>
      </motion.div>

      {/* لوحة العيادة */}
      <div className="relative order-first lg:sticky lg:top-0 lg:order-none lg:h-svh">
        <ClinicPanel />
      </div>
    </div>
  )
}

/* ═════════ أدوات صغيرة ═════════ */
function Ring({ value, total, size = 84 }) {
  const r = size / 2 - 7
  const c = 2 * Math.PI * r
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="7" />
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="#d9a06a"
        strokeWidth="7"
        strokeLinecap="round"
        strokeDasharray={c}
        initial={{ strokeDashoffset: c }}
        animate={{ strokeDashoffset: c * (1 - value / total) }}
        transition={{ duration: 1.2, ease: EASE }}
      />
    </svg>
  )
}

function Sheet({ open, onClose, children }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[70] flex items-end justify-center bg-forest-950/50 p-3 sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="relative max-h-[88svh] w-full max-w-md overflow-y-auto rounded-4xl bg-white p-6"
            dir="rtl"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="سكّري"
              className="absolute top-4 left-4 grid size-9 place-items-center rounded-full text-ink/50 transition hover:bg-sand-50 hover:text-ink"
            >
              <X className="size-5" />
            </button>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function Toggle({ on, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={() => onChange(!on)}
      className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${on ? 'bg-copper-600' : 'bg-sage-200'}`}
    >
      <motion.span layout className={`absolute top-1 size-5 rounded-full bg-white shadow ${on ? 'left-1' : 'right-1'}`} />
    </button>
  )
}

function ProgramTag({ id, className = '' }) {
  const p = PROGRAMS.find((x) => x.id === id)
  return <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${PROGRAM_STYLE[id]} ${className}`}>{p.short}</span>
}

/* قائمة منسدلة صغيرة (الإشعارات والحساب) */
function Dropdown({ open, onClose, children, className = '' }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <button type="button" aria-label="سكّري" className="fixed inset-0 z-40 cursor-default" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.2 }}
            className={`absolute top-full left-0 z-50 mt-2 origin-top-left overflow-hidden rounded-3xl bg-white shadow-2xl shadow-forest-900/15 ring-1 ring-sage-200 ${className}`}
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

/* ═════════ 2. الإشعارات ═════════ */
function Notifications({ items, setItems }) {
  const [open, setOpen] = useState(false)
  const unread = items.filter((n) => !n.read).length
  const markAll = () => setItems((list) => list.map((n) => ({ ...n, read: true })))
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={`الإشعارات${unread ? ` (${unread} جديد)` : ''}`}
        className="relative grid size-10 place-items-center rounded-full text-ink/70 transition hover:bg-sand-50 hover:text-ink"
      >
        <motion.span key={unread} animate={unread ? { rotate: [0, -16, 14, -10, 8, 0] } : {}} transition={{ duration: 0.7 }}>
          <Bell className="size-5" />
        </motion.span>
        {unread > 0 && (
          <span className="absolute top-1 right-1 grid size-4.5 min-w-4.5 place-items-center rounded-full bg-copper-600 text-[10px] font-bold text-white ring-2 ring-white">
            {unread}
          </span>
        )}
      </button>
      <Dropdown open={open} onClose={() => setOpen(false)} className="w-[min(22rem,calc(100vw-2rem))]">
        <div className="flex items-center justify-between border-b border-sage-200 px-5 py-4">
          <p className="font-bold text-ink">الإشعارات</p>
          {unread > 0 && (
            <button type="button" onClick={markAll} className="text-xs font-semibold text-copper-600">
              علّمي الكل كمقروء
            </button>
          )}
        </div>
        <ul className="max-h-96 divide-y divide-sage-200 overflow-y-auto">
          {items.map((n) => (
            <li key={n.id}>
              <button
                type="button"
                onClick={() => setItems((list) => list.map((x) => (x.id === n.id ? { ...x, read: true } : x)))}
                className={`flex w-full items-start gap-3 px-5 py-4 text-start transition hover:bg-sand-50 ${n.read ? '' : 'bg-copper-300/10'}`}
              >
                <span className={`grid size-9 shrink-0 place-items-center rounded-xl ${n.read ? 'bg-sand-100 text-ink/50' : 'bg-copper-600 text-white'}`}>
                  <n.icon className="size-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center justify-between gap-2">
                    <span className={`text-sm ${n.read ? 'font-semibold text-ink/70' : 'font-bold text-ink'}`}>{n.title}</span>
                    <span className="shrink-0 text-[11px] text-ink/40">{n.time}</span>
                  </span>
                  <span className="mt-0.5 block text-xs leading-5 text-ink/55">{n.text}</span>
                </span>
                {!n.read && <span className="mt-1.5 size-2 shrink-0 rounded-full bg-copper-600" />}
              </button>
            </li>
          ))}
        </ul>
        <p className="border-t border-sage-200 px-5 py-3 text-[11px] text-ink/45">التذكيرات المهمة بتوصلك كمان على WhatsApp.</p>
      </Dropdown>
    </div>
  )
}

/* ═════════ قائمة الحساب ═════════ */
function AccountMenu({ onProfile, onPolicy, onLogout }) {
  const [open, setOpen] = useState(false)
  const go = (fn) => () => {
    setOpen(false)
    fn()
  }
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="حسابي"
        className="grid size-10 place-items-center rounded-full bg-copper-300 font-bold text-forest-900 ring-2 ring-white transition hover:ring-copper-300/40"
      >
        {PATIENT.name[0]}
      </button>
      <Dropdown open={open} onClose={() => setOpen(false)} className="w-60">
        <div className="border-b border-sage-200 px-5 py-4">
          <p className="font-bold text-ink">{PATIENT.name}</p>
          <p className="text-xs text-ink/50" dir="ltr">
            {PATIENT.phone}
          </p>
        </div>
        <div className="p-2 text-sm">
          <button type="button" onClick={go(onProfile)} className="flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-ink hover:bg-sand-50">
            <UserRound className="size-4 text-ink/50" /> بياناتي والإعدادات
          </button>
          <button type="button" onClick={go(onPolicy)} className="flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-ink hover:bg-sand-50">
            <Info className="size-4 text-ink/50" /> سياسة المواعيد
          </button>
          <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-ink hover:bg-sand-50">
            <MessageCircle className="size-4 text-ink/50" /> احكي مع الاستقبال
          </a>
          <button type="button" onClick={go(onLogout)} className="mt-1 flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-red-700 hover:bg-red-50">
            <LogOut className="size-4" /> تسجيل الخروج
          </button>
        </div>
      </Dropdown>
    </div>
  )
}

/* ═════════ 3. بطاقة الموعد: عدّ تنازلي + اسحبي للتأكيد ═════════ */
function useNow(ms = 1000) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), ms)
    return () => clearInterval(t)
  }, [ms])
  return now
}

function Digit({ value, label }) {
  const v = String(value).padStart(2, '0')
  return (
    <div className="text-center">
      <div className="relative h-12 w-14 overflow-hidden rounded-2xl bg-white/10 sm:h-14 sm:w-16">
        <AnimatePresence initial={false}>
          <motion.span
            key={v}
            initial={{ y: '-100%' }}
            animate={{ y: '0%' }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.35, ease: EASE }}
            className="absolute inset-0 grid place-items-center text-2xl font-bold tabular-nums sm:text-3xl"
          >
            {v}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="mt-1 block text-[10px] text-white/50">{label}</span>
    </div>
  )
}

function Burst() {
  // قصاصات صغيرة بتطير لما يتأكّد الموعد
  return (
    <div className="pointer-events-none absolute inset-0">
      {Array.from({ length: 18 }).map((_, i) => {
        const a = (i / 18) * Math.PI * 2
        return (
          <motion.span
            key={i}
            className="absolute top-1/2 left-1/2 size-2 rounded-sm"
            style={{ background: i % 3 ? '#d9a06a' : '#ffffff' }}
            initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
            animate={{ x: Math.cos(a) * 140, y: Math.sin(a) * 90, opacity: 0, rotate: 200 }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        )
      })}
    </div>
  )
}

function SwipeConfirm({ onConfirm }) {
  const track = useRef(null)
  const [w, setW] = useState(0)
  useEffect(() => {
    if (track.current) setW(track.current.offsetWidth - 56)
  }, [])
  return (
    <div ref={track} className="relative h-14 overflow-hidden rounded-full bg-white/10">
      <motion.span
        className="absolute inset-0 grid place-items-center text-sm font-semibold text-white/70"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        ← اسحبي لتأكيد حضورك
      </motion.span>
      <motion.button
        type="button"
        drag="x"
        dragConstraints={{ left: -w, right: 0 }}
        dragElastic={0.05}
        dragMomentum={false}
        onDragEnd={(_, info) => info.offset.x < -w * 0.7 && onConfirm()}
        onClick={(e) => e.detail === 2 && onConfirm()}
        whileTap={{ scale: 0.95 }}
        className="absolute top-1 right-1 grid size-12 cursor-grab place-items-center rounded-full bg-copper-300 text-forest-900 shadow-lg active:cursor-grabbing"
        aria-label="أكّدي حضورك"
      >
        <Check className="size-5" />
      </motion.button>
    </div>
  )
}

function BoardingPass({ appt, waitlist, onConfirm, onMove, onCancel, onPolicy }) {
  const now = useNow()
  const ms = Math.max(0, appt.date - now)
  const d = Math.floor(ms / DAY)
  const h = Math.floor((ms % DAY) / 36e5)
  const m = Math.floor((ms % 36e5) / 6e4)
  const s = Math.floor((ms % 6e4) / 1e3)
  const deadline = new Date(appt.date.getTime() - POLICY.freeHours * 36e5)
  const free = now < deadline.getTime()
  const [burst, setBurst] = useState(0)

  return (
    <div className="relative overflow-hidden rounded-5xl bg-forest-900 text-white">
      <div className="pointer-events-none absolute -top-32 -left-24 size-96 rounded-full bg-[radial-gradient(circle,rgba(217,160,106,0.3),transparent_65%)]" />
      <div className="relative grid gap-6 p-6 sm:p-8 lg:grid-cols-[1.1fr_1fr] lg:items-center">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-copper-300">موعدك الجاي</span>
            <ProgramTag id={appt.program} className="!bg-white/10 !text-white" />
          </div>
          <p className="mt-2 text-3xl font-bold sm:text-4xl">{appt.title}</p>
          <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-white/70">
            <span className="flex items-center gap-1.5">
              <CalendarDays className="size-4 text-copper-300" /> {fmtDay(appt.date)}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="size-4 text-copper-300" /> {fmtTime(appt.date)} · {appt.hours}
            </span>
          </p>
          <div className="mt-6 flex gap-2" dir="ltr">
            <Digit value={d} label="يوم" />
            <Digit value={h} label="ساعة" />
            <Digit value={m} label="دقيقة" />
            <Digit value={s} label="ثانية" />
          </div>
        </div>

        <div className="relative">
          {burst > 0 && <Burst key={burst} />}
          <AnimatePresence mode="wait">
            {appt.status === 'confirmed' ? (
              <motion.div
                key="ok"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex h-14 items-center justify-center gap-2 rounded-full bg-copper-300 font-bold text-forest-900"
              >
                <Check className="size-5" /> حضورك مؤكّد
              </motion.div>
            ) : (
              <motion.div key="swipe" exit={{ opacity: 0, scale: 0.9 }}>
                <SwipeConfirm
                  onConfirm={() => {
                    setBurst((b) => b + 1)
                    onConfirm()
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={onMove}
              className="flex h-11 flex-1 items-center justify-center gap-2 rounded-full border border-white/15 text-sm font-semibold transition hover:bg-white/10"
            >
              <RefreshCw className="size-4" /> نقل الموعد
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex h-11 flex-1 items-center justify-center gap-2 rounded-full border border-white/15 text-sm font-semibold text-red-300 transition hover:bg-white/10"
            >
              <X className="size-4" /> إلغاء
            </button>
          </div>

          {/* سياسة النقل والإلغاء: واضحة قبل ما تكبس */}
          <button
            type="button"
            onClick={onPolicy}
            className={`mt-3 flex w-full items-center gap-2 rounded-2xl px-3 py-2.5 text-start text-xs leading-5 transition hover:bg-white/10 ${free ? 'bg-white/5 text-white/70' : 'bg-amber-300/10 text-amber-200'}`}
          >
            <Hourglass className="size-4 shrink-0" />
            <span className="flex-1">
              {free ? (
                <>
                  نقل وإلغاء <b>مجاني</b> لحد {fmtShort(deadline)}
                </>
              ) : (
                <>فات وقت النقل المجاني · أي تغيير هلّق بينسجّل مخالفة</>
              )}
            </span>
            <Info className="size-4 shrink-0 opacity-60" />
          </button>
          {waitlist && (
            <p className="mt-2 flex items-center gap-2 text-xs text-copper-300">
              <Bell className="size-3.5" /> إنتِ على قائمة الانتظار، منبلّغك إذا فضي موعد أبكر.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

/* ═════════ 4. خريطة الرحلة: متر الجلسات ═════════ */
function JourneyTape({ program: p }) {
  const [hover, setHover] = useState(null)
  const sessions = Array.from({ length: p.sessionsTotal }, (_, k) => k + 1)
  const pct = (n) => ((n - 0.5) / p.sessionsTotal) * 100
  const phaseOf = (n) => p.phases.findIndex((ph) => n <= ph.end)
  let prev = 0

  return (
    <div className="rounded-5xl bg-white p-6 ring-1 ring-sage-200 sm:p-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-copper-600">خريطة الجلسات</p>
          <p className="mt-1 text-2xl font-bold text-ink">
            خلّصتي {p.sessionsDone} من {p.sessionsTotal} جلسة
          </p>
        </div>
        <div className="flex gap-3 text-[11px] text-ink/55">
          {p.phases.map((ph, i) => (
            <span key={ph.name} className="flex items-center gap-1.5">
              <span className={`size-2.5 rounded-full ${PHASE_COLORS[i]}`} /> {ph.name}
            </span>
          ))}
        </div>
      </div>

      <div className="relative mt-12 mb-8">
        <div className="flex h-2 overflow-hidden rounded-full">
          {p.phases.map((ph, i) => {
            const w = ((ph.end - prev) / p.sessionsTotal) * 100
            prev = ph.end
            return <span key={ph.name} className={PHASE_COLORS[i]} style={{ width: `${w}%` }} />
          })}
        </div>
        <div
          className="mt-1 h-3"
          style={{
            backgroundImage: 'linear-gradient(to right, rgba(16,34,25,.25) 1px, transparent 1px)',
            backgroundSize: `${100 / (p.sessionsTotal * 4)}% 100%`,
          }}
        />
        <div className="absolute inset-x-0 -top-3">
          {sessions.map((n) => {
            const done = n <= p.sessionsDone
            const isNext = n === p.sessionsDone + 1
            const scan = p.scanSessions.includes(n)
            return (
              <button
                key={n}
                type="button"
                onMouseEnter={() => setHover(n)}
                onMouseLeave={() => setHover(null)}
                onClick={() => setHover(hover === n ? null : n)}
                className="absolute translate-x-1/2"
                style={{ right: `${pct(n)}%` }}
              >
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1 + n * 0.04, type: 'spring', stiffness: 300, damping: 18 }}
                  className={`grid size-6 place-items-center rounded-full border-2 text-[9px] font-bold sm:size-8 sm:text-[11px] ${
                    done
                      ? 'border-forest-800 bg-forest-800 text-white'
                      : isNext
                        ? 'border-copper-600 bg-white text-copper-600'
                        : 'border-sage-200 bg-white text-ink/40'
                  }`}
                >
                  {done ? <Check className="size-3 sm:size-3.5" /> : n}
                </motion.span>
                {scan && <ScanLine className="absolute top-9 left-1/2 size-3.5 -translate-x-1/2 text-copper-600 sm:top-11" />}
                <AnimatePresence>
                  {hover === n && (
                    <motion.span
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="absolute bottom-10 left-1/2 z-10 -translate-x-1/2 rounded-xl bg-ink px-3 py-1.5 text-[11px] font-semibold whitespace-nowrap text-white"
                    >
                      جلسة {n} · {p.phases[phaseOf(n)].name}
                      {scan ? ` · ${p.scanName}` : ''}
                      {done ? ' · تمّت' : ''}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            )
          })}
          <motion.div
            className="absolute -top-9 translate-x-1/2"
            initial={{ right: '0%' }}
            animate={{ right: `${pct(Math.min(p.sessionsDone + 1, p.sessionsTotal))}%` }}
            transition={{ duration: 1.4, delay: 0.3, ease: EASE }}
          >
            <motion.span
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 1.4, repeat: Infinity }}
              className="block rounded-full bg-copper-600 px-2.5 py-1 text-[10px] font-bold whitespace-nowrap text-white"
            >
              إنتِ هون
            </motion.span>
          </motion.div>
        </div>
      </div>
      <p className="flex flex-wrap items-center gap-1.5 text-xs text-ink/45">
        اكبسي على أي جلسة لتشوفي تفاصيلها · <ScanLine className="size-3.5 text-copper-600" /> = {p.scanName}
      </p>
    </div>
  )
}

/* ═════════ 5. الجسم بيتغيّر مع كل قياس ═════════ */
function bodyPath(k) {
  const cx = 100
  const pts = [
    [60, 9],
    [78, 30],
    [100, 44],
    [140, 40],
    [175, 22 * k + 12],
    [205, 24 * k + 6],
    [245, 46],
    [290, 40],
    [350, 26],
    [420, 14],
  ]
  const right = pts.map(([y, w]) => [cx + w, y])
  const left = pts.map(([y, w]) => [cx - w, y]).reverse()
  const all = [...right, ...left]
  let d = `M ${all[0][0]} ${all[0][1]}`
  for (let i = 0; i < all.length - 1; i++) {
    const p0 = all[i - 1] || all[i]
    const p1 = all[i]
    const p2 = all[i + 1]
    const p3 = all[i + 2] || p2
    d += ` C ${p1[0] + (p2[0] - p0[0]) / 6} ${p1[1] + (p2[1] - p0[1]) / 6}, ${p2[0] - (p3[0] - p1[0]) / 6} ${p2[1] - (p3[1] - p1[1]) / 6}, ${p2[0]} ${p2[1]}`
  }
  return d + ' Z'
}

function BodyMorph({ program: p }) {
  const scans = p.scans
  const [i, setI] = useState(scans.length - 1)
  const first = scans[0].v
  const v = scans[i].v
  const min = first * 0.86
  const k = 0.6 + ((v - min) / (first - min)) * 0.8
  const delta = Math.round((first - v) * 10) / 10
  return (
    <div className="flex flex-col rounded-5xl bg-white p-6 ring-1 ring-sage-200">
      <p className="flex items-center gap-2 text-xs font-semibold text-copper-600">
        <TrendingDown className="size-4" /> {p.metric.label} مع كل قياس
      </p>
      <div className="relative mt-3 flex flex-1 items-center justify-center">
        <svg viewBox="0 0 200 430" className="h-40 w-auto sm:h-52">
          <path d={bodyPath(1.4)} fill="none" stroke="#dbe5de" strokeWidth="2" strokeDasharray="4 5" />
          <circle cx="100" cy="30" r="24" fill="#e9d6bf" />
          <motion.path
            initial={false}
            d={bodyPath(k)}
            animate={{ d: bodyPath(k) }}
            transition={{ duration: 0.6, ease: EASE }}
            fill="#e9d6bf"
            stroke="#b4683b"
            strokeWidth="1.5"
          />
          <motion.line
            x1="30"
            x2="170"
            y1="205"
            y2="205"
            stroke="#b4683b"
            strokeDasharray="3 4"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </svg>
        <div className="absolute top-2 left-0 text-start">
          <AnimatePresence mode="wait">
            <motion.p
              key={v}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="text-3xl font-bold text-ink"
              dir="ltr"
            >
              {v}
              <span className="text-sm text-ink/50"> {p.metric.unit}</span>
            </motion.p>
          </AnimatePresence>
          <p className="text-xs text-ink/50">{p.metric.label}</p>
          {i > 0 && (
            <p className="mt-1 text-sm font-bold text-copper-600" dir="ltr">
              −{delta} {p.metric.unit}
            </p>
          )}
        </div>
      </div>
      <input
        type="range"
        min={0}
        max={scans.length - 1}
        value={i}
        onChange={(e) => setI(Number(e.target.value))}
        className="mt-3 w-full accent-[#b4683b]"
        aria-label="اختاري القياس"
      />
      <div className="mt-1 flex justify-between text-[11px] text-ink/50">
        {scans.map((s, k2) => (
          <span key={s.label} className={k2 === i ? 'font-bold text-copper-600' : ''}>
            {s.label}
          </span>
        ))}
      </div>
    </div>
  )
}

/* ═════════ 6. جهّزي حالك للجلسة الجاي ═════════ */
function PrepChecklist({ appt }) {
  const items = PREP[appt.program]
  const [done, setDone] = useState(() => items.map(() => false))
  const count = done.filter(Boolean).length
  const all = count === items.length
  const day = new Intl.DateTimeFormat('ar', { weekday: 'long' }).format(appt.date)
  return (
    <div className="flex flex-col rounded-5xl bg-white p-6 ring-1 ring-sage-200">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-copper-600">قبل جلسة {day}</p>
          <p className="mt-1 font-bold text-ink">جهّزي حالك</p>
        </div>
        <AnimatePresence mode="wait">
          {all ? (
            <motion.span
              key="ready"
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center gap-1 rounded-full bg-forest-800/10 px-2.5 py-1 text-xs font-bold text-forest-800"
            >
              <Check className="size-3.5" /> جاهزة
            </motion.span>
          ) : (
            <motion.span key="count" className="text-xs font-bold text-ink/45 tabular-nums" dir="ltr">
              {count}/{items.length}
            </motion.span>
          )}
        </AnimatePresence>
      </div>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-sand-100">
        <motion.div
          className={`h-full rounded-full ${all ? 'bg-forest-800' : 'bg-copper-600'}`}
          animate={{ width: `${(count / items.length) * 100}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>
      <ul className="mt-3 space-y-1">
        {items.map((t, i) => (
          <li key={t}>
            <label
              className={`flex cursor-pointer items-center gap-3 rounded-2xl px-2 py-2.5 text-sm transition-colors hover:bg-sand-50 ${done[i] ? 'text-ink/40' : 'text-ink'}`}
            >
              <input type="checkbox" className="peer sr-only" checked={done[i]} onChange={() => setDone((d) => d.map((x, j) => (j === i ? !x : x)))} />
              <motion.span
                animate={{ scale: done[i] ? [1, 1.25, 1] : 1 }}
                className={`grid size-5 shrink-0 place-items-center rounded-md border-2 peer-focus-visible:ring-4 peer-focus-visible:ring-copper-300/30 ${done[i] ? 'border-forest-800 bg-forest-800 text-white' : 'border-sage-200'}`}
              >
                {done[i] && <Check className="size-3" />}
              </motion.span>
              <span className={done[i] ? 'line-through' : ''}>{t}</span>
            </label>
          </li>
        ))}
      </ul>
      <p className="mt-auto pt-3 text-[11px] text-ink/45">{all ? 'كل إشي جاهز، منستناكِ 🌿' : 'التعليمات حسب نوع الجلسة.'}</p>
    </div>
  )
}

/* ═════════ 7. القياس الجاي ═════════ */
function NextScanCard({ appt, program }) {
  if (!appt) return null
  const days = Math.max(1, Math.ceil((appt.date - Date.now()) / DAY))
  return (
    <div className="flex items-center gap-4 rounded-5xl bg-sand-100 p-6">
      <span className="relative grid size-12 shrink-0 place-items-center overflow-hidden rounded-2xl bg-white text-copper-600">
        <ScanLine className="size-5" />
        <motion.span
          className="absolute inset-x-1 h-0.5 rounded-full bg-copper-600/60"
          animate={{ top: ['15%', '85%', '15%'] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        />
      </span>
      <span>
        <span className="block font-bold text-ink">
          {program.scanName} بعد {days} {days === 1 ? 'يوم' : 'أيام'}
        </span>
        <span className="block text-xs text-ink/55">{fmtDay(appt.date)} · منقارن مع البداية</span>
      </span>
    </div>
  )
}

/* ═════════ 8. الأسبوعين الجايين ═════════ */
function WeekStrip({ appts }) {
  const days = Array.from({ length: 14 }, (_, k) => {
    const d = new Date(Date.now() + k * DAY)
    d.setHours(0, 0, 0, 0)
    return d
  })
  const onDay = (d) => appts.filter((a) => a.status !== 'cancelled' && a.date.toDateString() === d.toDateString())
  const firstWith = days.findIndex((d) => onDay(d).length)
  const [sel, setSel] = useState(Math.max(0, firstWith))
  const list = onDay(days[sel])

  return (
    <div className="min-w-0 rounded-5xl bg-white p-6 ring-1 ring-sage-200">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-semibold text-copper-600">مواعيدك بالأسبوعين الجايين</p>
        <div className="flex gap-3 text-[11px] text-ink/55">
          {PROGRAMS.map((p) => (
            <span key={p.id} className="flex items-center gap-1.5">
              <span className={`size-2 rounded-full ${PROGRAM_DOT[p.id]}`} /> {p.short}
            </span>
          ))}
        </div>
      </div>
      <div className="mt-4 flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
        {days.map((d, i) => {
          const dayAppts = onDay(d)
          const on = i === sel
          return (
            <button
              key={i}
              type="button"
              onClick={() => setSel(i)}
              className={`relative flex min-w-14 flex-1 shrink-0 flex-col items-center rounded-2xl py-2.5 transition-colors ${on ? 'text-white' : 'bg-sand-50 text-ink hover:bg-sand-100'}`}
            >
              {on && (
                <motion.span
                  layoutId="pp-day"
                  className="absolute inset-0 rounded-2xl bg-forest-800"
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                />
              )}
              <span className={`relative text-[10px] ${on ? 'text-white/60' : 'text-ink/45'}`}>
                {new Intl.DateTimeFormat('ar', { weekday: 'short' }).format(d)}
              </span>
              <span className="relative text-lg font-bold">{d.getDate()}</span>
              <span className="relative mt-0.5 flex h-1.5 gap-0.5">
                {dayAppts.map((a) => (
                  <span key={a.id} className={`size-1.5 rounded-full ${PROGRAM_DOT[a.program]}`} />
                ))}
              </span>
            </button>
          )
        })}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={sel} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-4 space-y-2">
          {list.length ? (
            list.map((a) => (
              <div key={a.id} className="flex items-center gap-3 rounded-2xl bg-sand-50 px-4 py-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-forest-800 text-copper-300">
                  {a.scan ? <ScanLine className="size-4" /> : <CalendarDays className="size-4" />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-ink">{a.title}</span>
                    <ProgramTag id={a.program} />
                  </span>
                  <span className="block text-xs text-ink/55">
                    {fmtTime(a.date)} · {a.hours}
                  </span>
                </span>
                <span className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${STATUS[a.status].cls}`}>{STATUS[a.status].label}</span>
              </div>
            ))
          ) : (
            <p className="rounded-2xl bg-sand-50 px-4 py-4 text-center text-sm text-ink/50">ما في موعد بهاليوم · يوم راحة 🌿</p>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

/* ═════════ سياسة المواعيد ═════════ */
function Strikes({ count }) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-sand-50 px-4 py-3 text-sm">
      <span className="text-ink/60">مخالفاتك هالشهر</span>
      <span className="flex items-center gap-2">
        <span className="flex gap-1">
          {Array.from({ length: POLICY.maxStrikes }).map((_, i) => (
            <span key={i} className={`size-2.5 rounded-full ${i < count ? 'bg-amber-500' : 'bg-sage-200'}`} />
          ))}
        </span>
        <b className="text-ink tabular-nums">
          {count} من {POLICY.maxStrikes}
        </b>
      </span>
    </div>
  )
}

function PolicyContent({ strikes }) {
  const rules = [
    { icon: Check, title: `مجاني لحد ${POLICY.freeHours} ساعة قبل الموعد`, text: 'بتنقلي أو بتلغي من هون بكبسة، بدون أي إشي عليكِ.' },
    { icon: Hourglass, title: `أقل من ${POLICY.freeHours} ساعة`, text: 'التغيير بينسجّل مخالفة، لأنه الوقت والجهاز والطاقم محجوزين إلك.' },
    { icon: AlertTriangle, title: `${POLICY.maxStrikes} مخالفات بالشهر`, text: 'البرنامج بيتجمّد مؤقتاً لحد ما نحكي سوا ونرتّب المواعيد.' },
    { icon: MessageCircle, title: 'ظرف طارئ؟', text: 'احكي مع الاستقبال، منتفهّم الحالات الطارئة والمرضية.' },
  ]
  return (
    <>
      <p className="text-xl font-bold text-ink">سياسة المواعيد</p>
      <p className="mt-1 text-sm text-ink/55">عشان نحافظ على وقتك ووقت غيرك.</p>
      <ul className="mt-5 space-y-3">
        {rules.map((r) => (
          <li key={r.title} className="flex gap-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-sand-100 text-copper-600">
              <r.icon className="size-4" />
            </span>
            <span>
              <span className="block font-semibold text-ink">{r.title}</span>
              <span className="block text-sm leading-6 text-ink/60">{r.text}</span>
            </span>
          </li>
        ))}
      </ul>
      <div className="mt-5">
        <Strikes count={strikes} />
      </div>
      <p className="mt-3 text-[11px] text-ink/40">* تفاصيل السياسة النهائية بتحددها العيادة.</p>
    </>
  )
}

/* ═════════ نقل الموعد ═════════ */
function MoveContent({ appt, late, strikes, waitlist, setWaitlist, onConfirm }) {
  const [picked, setPicked] = useState(null)
  const groups = SLOTS.reduce((acc, s) => {
    const key = s.toDateString()
    ;(acc[key] = acc[key] || []).push(s)
    return acc
  }, {})
  return (
    <>
      <p className="text-xl font-bold text-ink">نقل الموعد</p>
      <p className="mt-1 text-sm text-ink/55">
        {appt.title} · {fmtDay(appt.date)}
      </p>
      {late && (
        <p className="mt-4 flex items-start gap-2 rounded-2xl bg-amber-50 px-4 py-3 text-xs leading-5 text-amber-800 ring-1 ring-amber-200">
          <Hourglass className="mt-0.5 size-4 shrink-0" />
          باقي أقل من {POLICY.freeHours} ساعة، فالنقل هلّق بينسجّل مخالفة ({strikes} من {POLICY.maxStrikes} هالشهر).
        </p>
      )}
      <div className="mt-5 space-y-4">
        {Object.values(groups).map((slots) => (
          <div key={slots[0].toDateString()}>
            <p className="mb-2 text-sm font-semibold text-ink">{fmtDay(slots[0])}</p>
            <div className="flex flex-wrap gap-2">
              {slots.map((sl) => {
                const on = picked?.getTime() === sl.getTime()
                return (
                  <button
                    key={sl.getTime()}
                    type="button"
                    onClick={() => setPicked(sl)}
                    className={`rounded-full border-2 px-4 py-2 text-sm font-semibold tabular-nums transition ${
                      on ? 'border-copper-600 bg-copper-600 text-white' : 'border-sage-200 text-ink hover:border-copper-300'
                    }`}
                    dir="ltr"
                  >
                    {fmtTime(sl)}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* قائمة الانتظار: مكانها الطبيعي لما ما في وقت مناسب */}
      <div className="mt-6 flex items-center gap-3 rounded-2xl bg-sand-50 px-4 py-3">
        <Bell className="size-5 shrink-0 text-copper-600" />
        <span className="flex-1">
          <span className="block text-sm font-semibold text-ink">ما في وقت مناسب؟</span>
          <span className="block text-xs text-ink/55">حطّيني على قائمة الانتظار لموعد أبكر</span>
        </span>
        <Toggle on={waitlist} onChange={setWaitlist} label="قائمة الانتظار" />
      </div>

      <button
        type="button"
        disabled={!picked}
        onClick={() => onConfirm(picked)}
        className="mt-5 h-12 w-full rounded-full bg-copper-600 font-bold text-white transition hover:bg-copper-700 disabled:opacity-40"
      >
        {picked ? `أكّدي النقل لـ ${fmtShort(picked)}` : 'اختاري وقت جديد'}
      </button>
    </>
  )
}

/* ═════════ إلغاء الموعد ═════════ */
const CANCEL_REASONS = ['مش حاسّة منيح', 'شغل أو سفر', 'ظرف عائلي', 'سبب تاني']

function CancelContent({ appt, late, strikes, onMove, onConfirm, onKeep }) {
  const [reason, setReason] = useState(null)
  return (
    <>
      <span className="grid size-12 place-items-center rounded-2xl bg-red-50 text-red-700">
        <AlertTriangle className="size-6" />
      </span>
      <p className="mt-4 text-xl font-bold text-ink">إلغاء {appt.title}؟</p>
      <p className="mt-1 text-sm text-ink/55">
        {fmtDay(appt.date)} · {fmtTime(appt.date)}
      </p>

      {late ? (
        <div className="mt-4 space-y-2">
          <p className="flex items-start gap-2 rounded-2xl bg-amber-50 px-4 py-3 text-xs leading-5 text-amber-800 ring-1 ring-amber-200">
            <Hourglass className="mt-0.5 size-4 shrink-0" />
            باقي أقل من {POLICY.freeHours} ساعة، فالإلغاء بينسجّل مخالفة.
          </p>
          <Strikes count={strikes} />
        </div>
      ) : (
        <p className="mt-4 flex items-center gap-2 rounded-2xl bg-forest-800/5 px-4 py-3 text-xs text-forest-800">
          <Check className="size-4" /> الإلغاء مجاني لأنه قبل {POLICY.freeHours} ساعة من الموعد.
        </p>
      )}

      <p className="mt-5 text-sm font-semibold text-ink">شو السبب؟ (اختياري)</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {CANCEL_REASONS.map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setReason(reason === r ? null : r)}
            className={`rounded-full border px-3.5 py-1.5 text-sm transition ${reason === r ? 'border-forest-800 bg-forest-800 text-white' : 'border-sage-200 text-ink/70 hover:border-copper-300'}`}
          >
            {r}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={onMove}
        className="mt-6 flex w-full items-center gap-3 rounded-2xl border-2 border-copper-300 bg-copper-300/10 px-4 py-3 text-start transition hover:bg-copper-300/20"
      >
        <RefreshCw className="size-5 shrink-0 text-copper-600" />
        <span className="flex-1">
          <span className="block font-bold text-ink">بدل ما تلغي، انقليه</span>
          <span className="block text-xs text-ink/55">هيك ما بتتأخّر خطتك</span>
        </span>
        <ArrowLeft className="size-4 text-copper-600" />
      </button>

      <div className="mt-3 flex gap-2">
        <button type="button" onClick={onKeep} className="h-12 flex-1 rounded-full border border-sage-200 font-semibold text-ink">
          خلّي الموعد
        </button>
        <button
          type="button"
          onClick={() => onConfirm(reason)}
          className="h-12 flex-1 rounded-full bg-red-700 font-bold text-white transition hover:bg-red-800"
        >
          تأكيد الإلغاء
        </button>
      </div>
    </>
  )
}

/* ═════════ اللوحة ═════════ */
function Portal({ onLogout }) {
  const [appts, setAppts] = useState(makeAppointments)
  const [programId, setProgramId] = useState(PROGRAMS[0].id)
  const [sheet, setSheet] = useState(null) // move | cancel | policy | profile
  const [waitlist, setWaitlist] = useState(false)
  const [strikes, setStrikes] = useState(POLICY.strikes)
  const [notifs, setNotifs] = useState(NOTIFS)
  const [toast, setToast] = useState('')
  const program = PROGRAMS.find((p) => p.id === programId)
  const greeting = new Date().getHours() < 12 ? 'صباح الخير' : 'مسا الخير'
  const phaseIdx = program.phases.findIndex((ph) => program.sessionsDone < ph.end)

  const upcoming = appts.filter((a) => a.date > Date.now() && a.status !== 'cancelled').sort((a, b) => a.date - b.date)
  const next = upcoming[0]
  const nextScan = upcoming.find((a) => a.scan && a.program === programId)
  const late = next ? next.date - Date.now() < POLICY.freeHours * 36e5 : false

  const update = (id, patch) => setAppts((list) => list.map((a) => (a.id === id ? { ...a, ...patch } : a)))
  const notify = (icon, title, text) => setNotifs((list) => [{ id: Date.now(), icon, title, text, time: 'هلّق', read: false }, ...list])
  const flash = (t) => {
    setToast(t)
    setTimeout(() => setToast(''), 2600)
  }
  const close = () => setSheet(null)

  return (
    <div className="container-page space-y-4 pt-4 pb-16 sm:pt-6">
      {/* راس اللوحة */}
      <div className="relative z-30 mb-6 flex items-center justify-between gap-2 rounded-full bg-white py-1.5 ps-3 pe-1.5 ring-1 ring-sage-200">
        <a href="/" className="flex items-center gap-2" aria-label="Green Apple · الرئيسية">
          <img src="/images/logo-mark.png" alt="" className="h-8" />
          <span className="hidden font-bold text-ink sm:inline">Green Apple</span>
        </a>
        <DemoPill />
        <div className="flex items-center gap-1">
          <a href="/" className="hidden rounded-full px-3 py-2 text-sm font-semibold text-ink/60 transition hover:text-ink md:block">
            الموقع
          </a>
          <Notifications items={notifs} setItems={setNotifs} />
          <AccountMenu onProfile={() => setSheet('profile')} onPolicy={() => setSheet('policy')} onLogout={onLogout} />
        </div>
      </div>

      {/* الترحيب */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="flex flex-wrap items-end justify-between gap-4"
      >
        <div>
          <p className="text-sm text-ink/55">{greeting}</p>
          <p className="text-3xl font-bold text-ink sm:text-4xl">
            أهلا {PATIENT.name}{' '}
            <motion.span className="inline-block origin-bottom-right" animate={{ rotate: [0, 18, -8, 18, 0] }} transition={{ duration: 1.4, delay: 0.6 }}>
              👋
            </motion.span>
          </p>
        </div>
      </motion.div>

      {next && (
        <BoardingPass
          appt={next}
          waitlist={waitlist}
          onConfirm={() => {
            update(next.id, { status: 'confirmed' })
            flash('تمام! تأكّد حضورك ✓')
          }}
          onMove={() => setSheet('move')}
          onCancel={() => setSheet('cancel')}
          onPolicy={() => setSheet('policy')}
        />
      )}

      {/* الجلسة الجاي ومواعيدي (لكل البرامج) */}
      <div className="grid gap-4 lg:grid-cols-[1fr_2fr] lg:items-start">
        {next && <PrepChecklist key={next.id} appt={next} />}
        <WeekStrip appts={appts} />
      </div>

      {/* تقدّمي: حسب البرنامج */}
      <div className="flex flex-wrap items-end justify-between gap-4 pt-6">
        <div>
          <p className="text-xs font-semibold text-copper-600">تقدّمي</p>
          <p className="mt-1 text-2xl font-bold text-ink">
            {program.name} <span className="text-base font-normal text-ink/50">· مرحلة {program.phases[Math.max(0, phaseIdx)].name}</span>
          </p>
        </div>
        {/* لو عندها أكتر من خدمة: بتنقّل بين برامجها */}
        <div className="w-full sm:w-auto">
          <div className="flex gap-2">
            {PROGRAMS.map((p) => {
              const on = p.id === programId
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setProgramId(p.id)}
                  aria-pressed={on}
                  className={`relative flex flex-1 items-center gap-3 rounded-2xl py-2 ps-2 pe-4 text-start transition-colors sm:flex-none ${on ? 'text-white' : 'bg-white text-ink ring-1 ring-sage-200 hover:ring-copper-300'}`}
                >
                  {on && (
                    <motion.span
                      layoutId="pp-program"
                      className="absolute inset-0 rounded-2xl bg-forest-900"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span className="relative grid place-items-center">
                    {on ? (
                      <Ring value={p.sessionsDone} total={p.sessionsTotal} size={44} />
                    ) : (
                      <span className={`grid size-11 place-items-center rounded-full ${PROGRAM_STYLE[p.id]}`}>
                        <Sparkles className="size-4" />
                      </span>
                    )}
                    {on && <span className="absolute text-[10px] font-bold">{Math.round((p.sessionsDone / p.sessionsTotal) * 100)}%</span>}
                  </span>
                  <span className="relative">
                    <span className="block text-sm font-bold">{p.name}</span>
                    <span className={`block text-[11px] ${on ? 'text-white/60' : 'text-ink/50'}`}>
                      جلسة {p.sessionsDone} من {p.sessionsTotal}
                    </span>
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={programId}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3 }}
          className="space-y-4"
        >
          <JourneyTape program={program} />
          <div className="grid gap-4 md:grid-cols-2">
            <BodyMorph program={program} />
            <div className="flex flex-col gap-4">
              <NextScanCard appt={nextScan} program={program} />
              {/* نصيحة الأسبوع */}
              <div className="relative flex-1 overflow-hidden rounded-5xl bg-white p-6 ring-1 ring-sage-200">
                <motion.span
                  className="absolute -top-6 -left-6 text-8xl leading-none text-copper-300/30"
                  animate={{ rotate: [0, 8, 0] }}
                  transition={{ duration: 5, repeat: Infinity }}
                  aria-hidden
                >
                  ”
                </motion.span>
                <p className="relative text-xs font-semibold text-copper-600">نصيحة الأسبوع</p>
                <p className="relative mt-2 leading-7 text-ink">{TIPS[programId].text}</p>
                <p className="relative mt-2 text-xs text-ink/50">— {TIPS[programId].who}</p>
              </div>
              <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="group flex items-center gap-4 rounded-5xl bg-forest-800 p-6 text-white">
                <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-copper-300 text-forest-900 transition-transform group-hover:rotate-12">
                  <MessageCircle className="size-5" />
                </span>
                <span>
                  <span className="block font-bold">عندك سؤال عن خطتك؟</span>
                  <span className="block text-xs text-white/60">احكي مع الاستقبال على WhatsApp</span>
                </span>
              </a>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* النوافذ */}
      <Sheet open={sheet === 'move' && !!next} onClose={close}>
        {next && (
          <MoveContent
            appt={next}
            late={late}
            strikes={strikes}
            waitlist={waitlist}
            setWaitlist={(v) => {
              setWaitlist(v)
              flash(v ? 'انضميتي لقائمة الانتظار ✓' : 'طلعتي من قائمة الانتظار')
            }}
            onConfirm={(date) => {
              if (late) setStrikes((s) => s + 1)
              update(next.id, { date, status: 'confirmed' })
              notify(RefreshCw, 'انتقل موعدك', `${next.title} صار ${fmtShort(date)}.`)
              close()
              flash('انتقل موعدك ✓ وبعتنالك تأكيد')
            }}
          />
        )}
      </Sheet>

      <Sheet open={sheet === 'cancel' && !!next} onClose={close}>
        {next && (
          <CancelContent
            appt={next}
            late={late}
            strikes={strikes}
            onKeep={close}
            onMove={() => setSheet('move')}
            onConfirm={() => {
              if (late) setStrikes((s) => s + 1)
              update(next.id, { status: 'cancelled' })
              notify(X, 'انلغى موعدك', `${next.title} انلغى. فيكِ تحجزي بديل بأي وقت.`)
              close()
              flash('انلغى الموعد')
            }}
          />
        )}
      </Sheet>

      <Sheet open={sheet === 'policy'} onClose={close}>
        <PolicyContent strikes={strikes} />
      </Sheet>

      <Sheet open={sheet === 'profile'} onClose={close}>
        <p className="mb-4 text-xl font-bold text-ink">بياناتي والإعدادات</p>
        <ProfileContent onLogout={onLogout} />
      </Sheet>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            role="status"
            className="fixed inset-x-0 bottom-6 z-[80] mx-auto w-fit rounded-full bg-forest-900 px-5 py-3 text-sm font-semibold text-white shadow-xl"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ═════════ بياناتي والإعدادات ═════════ */
function ProfileContent({ onLogout }) {
  const [lang, setLang] = useState('ar')
  const [waReminders, setWaReminders] = useState(true)
  const [siteNotifs, setSiteNotifs] = useState(true)
  const [marketing, setMarketing] = useState(false)
  return (
    <div className="space-y-4">
      <div className="divide-y divide-sage-200 overflow-hidden rounded-3xl ring-1 ring-sage-200">
        <div className="flex items-center justify-between px-5 py-3.5">
          <span className="text-sm text-ink/55">الاسم</span>
          <span className="font-semibold text-ink">{PATIENT.name}</span>
        </div>
        <div className="flex items-center justify-between px-5 py-3.5">
          <span className="text-sm text-ink/55">رقم الجوال</span>
          <span className="font-semibold text-ink" dir="ltr">
            {PATIENT.phone}
          </span>
        </div>
        <div className="flex items-start justify-between gap-4 px-5 py-3.5">
          <span className="text-sm text-ink/55">برامجي</span>
          <span className="flex flex-wrap justify-end gap-1.5">
            {PROGRAMS.map((p) => (
              <ProgramTag key={p.id} id={p.id} />
            ))}
          </span>
        </div>
      </div>

      <p className="text-xs font-semibold text-ink/50">الإشعارات</p>
      <div className="divide-y divide-sage-200 overflow-hidden rounded-3xl ring-1 ring-sage-200">
        {[
          ['تذكير بالمواعيد على WhatsApp', 'قبل 24 ساعة من كل موعد', waReminders, setWaReminders],
          ['إشعارات هون بحسابي', 'تغييرات المواعيد ونتائج القياس', siteNotifs, setSiteNotifs],
          ['عروض وأخبار العيادة', 'بتقدري تغيّري رأيك بأي وقت', marketing, setMarketing],
        ].map(([t, s, on, set]) => (
          <div key={t} className="flex items-center justify-between gap-4 px-5 py-3.5">
            <span>
              <span className="block text-sm font-semibold text-ink">{t}</span>
              <span className="block text-xs text-ink/50">{s}</span>
            </span>
            <Toggle on={on} onChange={set} label={t} />
          </div>
        ))}
        <div className="flex items-center justify-between px-5 py-3.5">
          <span className="text-sm font-semibold text-ink">لغة الرسائل</span>
          <div className="flex rounded-full bg-sand-100 p-1">
            {[
              ['ar', 'عربي'],
              ['he', 'עברית'],
            ].map(([id, l]) => (
              <button
                key={id}
                type="button"
                onClick={() => setLang(id)}
                className={`relative rounded-full px-4 py-1.5 text-sm font-semibold ${lang === id ? 'text-white' : 'text-ink/60'}`}
              >
                {lang === id && <motion.span layoutId="pp-lang" className="absolute inset-0 rounded-full bg-forest-800" />}
                <span className="relative">{l}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <p className="flex items-start gap-2 text-xs leading-6 text-ink/50">
        <ShieldCheck className="mt-0.5 size-4 shrink-0 text-copper-600" /> بياناتك الصحية محمية، وما حدا بيشوفها غير الفريق المعالج.
      </p>
      <button
        type="button"
        onClick={onLogout}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-full border border-red-200 text-sm font-semibold text-red-700 transition hover:bg-red-50"
      >
        <LogOut className="size-4" /> تسجيل الخروج
      </button>
    </div>
  )
}

export default function PatientPage() {
  const [loggedIn, setLoggedIn] = useState(store.get)

  return (
    <MotionConfig reducedMotion="never">
      <div dir="rtl" className="min-h-svh bg-sand-50">
        <AnimatePresence mode="wait">
          {loggedIn ? (
            <motion.div key="portal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Portal
                onLogout={() => {
                  store.set(false)
                  setLoggedIn(false)
                }}
              />
            </motion.div>
          ) : (
            <motion.div key="login" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Login
                onDone={(remember) => {
                  store.set(true, remember)
                  setLoggedIn(true)
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MotionConfig>
  )
}
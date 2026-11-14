import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, CalendarDays, Check, MessageCircle, Pencil, Phone, RefreshCw, ScanLine, ShieldCheck, Sparkles, TrendingDown } from 'lucide-react'
import { EASE } from '../../lib/motion'
import { WHATSAPP_URL } from '../../data/content'
import { PATIENT } from './data'
import { DemoPill } from './ui'

/* ═════════ 1. الدخول: شاشة بطابع العيادة ═════════ */
const PREVIEW = [
  { icon: CalendarDays, title: 'موعدك الجاي', text: 'السبت · 10:00' },
  { icon: TrendingDown, title: 'الخصر من البداية', text: 'نزل 5 سم' },
  { icon: ScanLine, title: 'المسح الجاي', text: 'بعد 7 أيام' },
  { icon: Sparkles, title: 'جلسة 13 من 39', text: 'المرحلة 1 · الشهر 3' },
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
          className="absolute inset-x-0 h-px bg-copper-300 shadow-[0_0_18px_4px_rgba(232,211,198,0.55)]"
          animate={{ top: ['4%', '96%', '4%'] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="relative flex h-full flex-col justify-end p-6 text-white lg:justify-between lg:p-10">
        <div className="hidden items-center gap-3 lg:flex">
          <img src="/images/logo-mark-white.svg" alt="" className="h-9 lg:h-11" />
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

export function Login({ onDone }) {
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
            <img src="/images/logo-mark.svg" alt="" className="h-9" />
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
                    <Phone className="size-4 text-gold-600" /> +972
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
                  <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="size-4 accent-[#c99a8b]" />
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
                  className="grid size-14 place-items-center rounded-2xl bg-sand-100 text-gold-600"
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
                    className="inline-flex items-center gap-1 rounded-full bg-sand-50 px-2.5 py-1 text-xs font-semibold text-gold-600 ring-1 ring-sage-200"
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
                        borderColor: c ? '#c99a8b' : '#e7e0dc',
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
                        <circle cx="10" cy="10" r="8" fill="none" stroke="#f5f0ed" strokeWidth="2.5" />
                        <circle
                          cx="10"
                          cy="10"
                          r="8"
                          fill="none"
                          stroke="#c99a8b"
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
                      <button type="button" onClick={() => setWait(30)} className="flex items-center gap-1.5 font-semibold text-gold-600">
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
                    stroke="#c99a8b"
                    strokeWidth="4"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.6 }}
                  />
                  <motion.path
                    d="M25 41 l10 10 l20 -22"
                    fill="none"
                    stroke="#2b2826"
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
            <a href="/contact" className="font-bold text-gold-600 hover:underline">
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
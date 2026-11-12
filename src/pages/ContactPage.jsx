import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, MotionConfig } from 'framer-motion'
import {
  MessageCircle,
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCheck,
  CheckCircle2,
  ArrowUpLeft,
  PenLine,
  Loader2,
  RotateCcw,
} from 'lucide-react'
import { WHATSAPP_URL, PHONE } from '../data/content'
import { EASE } from '../lib/motion'
import Badge from '../components/ui/Badge'

/* ───────── معلومات العيادة — عدّليها هون لما توصل من العيادة ───────── */
const EMAIL = '' // مثال: 'info@greenapple.co.il' — إذا فاضي، الإيميل بيطلع "قريباً"
const ADDRESS = 'سخنين · [الشارع والرقم]'
const MAP_QUERY = 'Sakhnin' // لما يوصل العنوان الكامل، حطيه هون
// ساعات الدوام (مبدئية): الأيام 0=الأحد … 6=السبت
const HOURS = { days: [0, 1, 2, 3, 4], open: 9, close: 18 }
// مفتاح Web3Forms (مجاني) لإرسال الاستفسارات على الإيميل. إذا فاضي، بيفتح واتساب.
const FORM_ACCESS_KEY = ''

const DAY_NAMES = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت']
const SERVICES = ['استشارة عامة', 'البطن والخصر', 'الفخذين والذراعين', 'السيلوليت والترهل', 'الليزر', 'البشرة']
const METHODS = ['اتصال', 'WhatsApp', 'إيميل']

/* الوقت هلّق بتوقيت العيادة */
function useClinicNow() {
  const get = () => {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Jerusalem',
      weekday: 'short',
      hour: 'numeric',
      minute: 'numeric',
      hour12: false,
    }).formatToParts(new Date())
    const v = (t) => parts.find((p) => p.type === t)?.value
    const day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(v('weekday'))
    const h = Number(v('hour')) % 24 + Number(v('minute')) / 60
    return { day, h, open: HOURS.days.includes(day) && h >= HOURS.open && h < HOURS.close }
  }
  const [now, setNow] = useState(get)
  useEffect(() => {
    const t = setInterval(() => setNow(get()), 30000)
    return () => clearInterval(t)
  }, [])
  return now
}

/* ═════════ لوحة WhatsApp: محادثة تجريبية ═════════ */
const QUICK = ['بدي أحجز استشارة', 'عندي سؤال عن علاج', 'بدي أعرف شو بيناسبني']

function WhatsAppPanel() {
  const [text, setText] = useState('')
  const [sent, setSent] = useState(null)
  const [typing, setTyping] = useState(false)
  const touched = useRef(false)
  const typer = useRef(null)

  const typeOut = (msg) => {
    clearInterval(typer.current)
    setSent(null)
    setTyping(false)
    let i = 0
    setText('')
    typer.current = setInterval(() => {
      i += 1
      setText(msg.slice(0, i))
      if (i >= msg.length) {
        clearInterval(typer.current)
        setTimeout(() => {
          setSent(msg)
          setText('')
          setTyping(true)
          setTimeout(() => setTyping(false), 1300)
        }, 350)
      }
    }, 45)
  }

  // لحالها بتجرّب الاقتراحات لحد ما المستخدمة تكبس
  useEffect(() => {
    let k = 0
    typeOut(QUICK[0])
    const t = setInterval(() => {
      if (touched.current) return clearInterval(t)
      k = (k + 1) % QUICK.length
      typeOut(QUICK[k])
    }, 5200)
    return () => {
      clearInterval(t)
      clearInterval(typer.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const msg = sent || text || QUICK[0]
  const href = `${WHATSAPP_URL}?text=${encodeURIComponent(msg)}`

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
        <span className="grid size-10 place-items-center rounded-full bg-white/10">
          <img src="/images/logo-mark-white.png" alt="" className="h-5" />
        </span>
        <span className="flex-1">
          <span className="block text-sm font-semibold" dir="ltr">
            Green Apple
          </span>
          <span className="block text-[11px] text-copper-300">{typing ? '...يكتب' : 'WhatsApp · ' + PHONE.label}</span>
        </span>
      </div>

      <div className="flex flex-1 flex-col justify-end gap-2.5 p-5">
        <div className="flex justify-end">
          <div className="max-w-[85%] rounded-3xl rounded-bl-md bg-white/10 px-4 py-2.5 text-[15px] leading-7">أهلا فيكي 👋 كيف منقدر نساعدك؟</div>
        </div>
        <AnimatePresence>
          {sent && (
            <motion.div key={sent} initial={{ opacity: 0, y: 12, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0 }} className="flex justify-start">
              <div className="max-w-[85%] rounded-3xl rounded-br-md bg-copper-600 px-4 py-2.5 text-[15px] leading-7">
                {sent}
                <CheckCheck className="ms-2 inline size-3.5 text-white/70" />
              </div>
            </motion.div>
          )}
          {typing && (
            <motion.div key="typing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0 } }} className="flex justify-end">
              <div className="flex gap-1 rounded-3xl rounded-bl-md bg-white/10 px-4 py-3.5">
                {[0, 1, 2].map((d) => (
                  <motion.span key={d} className="size-2 rounded-full bg-white" animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }} transition={{ duration: 0.8, repeat: Infinity, delay: d * 0.15 }} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="space-y-3 border-t border-white/10 p-4 sm:p-5">
        <div className="flex flex-wrap gap-2">
          {QUICK.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => {
                touched.current = true
                typeOut(q)
              }}
              className="rounded-full border border-white/15 px-3 py-1.5 text-xs font-semibold text-white/80 transition hover:border-copper-300 hover:text-white"
            >
              {q}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <div className="flex h-12 flex-1 items-center rounded-full bg-white/10 px-4 text-[15px] text-white/90">
            {text}
            <motion.span animate={{ opacity: [1, 0] }} transition={{ duration: 0.6, repeat: Infinity }} className="ms-0.5 h-5 w-0.5 bg-copper-300" />
          </div>
          <a href={href} target="_blank" rel="noreferrer" className="flex h-12 items-center gap-2 rounded-full bg-copper-300 px-5 text-sm font-bold text-forest-900 transition hover:bg-white">
            افتحي WhatsApp
            <Send className="size-4 -scale-x-100" />
          </a>
        </div>
      </div>
    </div>
  )
}

/* ═════════ لوحة الاتصال ═════════ */
function CallPanel({ now }) {
  return (
    <div className="flex h-full flex-col items-center justify-center p-8 text-center">
      <div className="relative grid size-28 place-items-center">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="absolute inset-0 rounded-full border-2 border-copper-300"
            animate={{ scale: [0.6, 1.7], opacity: [0.7, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, delay: i * 0.7, ease: 'easeOut' }}
          />
        ))}
        <motion.span
          animate={{ rotate: [0, -14, 14, -10, 10, 0] }}
          transition={{ duration: 0.9, repeat: Infinity, repeatDelay: 1.4 }}
          className="grid size-20 place-items-center rounded-full bg-copper-300 text-forest-900"
        >
          <Phone className="size-8" />
        </motion.span>
      </div>
      <p className="mt-8 text-4xl font-bold tracking-wide sm:text-5xl" dir="ltr">
        {PHONE.label}
      </p>
      <p className="mt-3 text-white/65">{now.open ? 'الاستقبال موجود هلّق، اتصلي فينا.' : 'برا ساعات الدوام هلّق، اتصلي بكرا أو ابعتيلنا رسالة.'}</p>
      <a href={PHONE.href} className="mt-8 inline-flex h-13 items-center gap-2 rounded-full bg-copper-300 px-8 font-bold text-forest-900 transition hover:bg-white">
        <Phone className="size-4" /> اتصلي هلّق
      </a>
    </div>
  )
}

/* ═════════ لوحة الإيميل ═════════ */
function EmailPanel() {
  return (
    <div className="flex h-full flex-col items-center justify-center p-8 text-center">
      <div className="relative h-28 w-40">
        <motion.div
          animate={{ y: [0, -26, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-x-5 top-2 h-20 rounded-lg bg-white p-3"
        >
          <span className="block h-1.5 w-3/4 rounded bg-sage-200" />
          <span className="mt-2 block h-1.5 w-1/2 rounded bg-sage-200" />
          <span className="mt-2 block h-1.5 w-2/3 rounded bg-copper-300" />
        </motion.div>
        <div className="absolute inset-x-0 bottom-0 h-16 rounded-xl bg-copper-300" style={{ clipPath: 'polygon(0 0, 50% 55%, 100% 0, 100% 100%, 0 100%)' }} />
      </div>
      <p className="mt-8 text-2xl font-bold sm:text-3xl" dir="ltr">
        {EMAIL || 'email@greenapple'}
      </p>
      <p className="mt-3 max-w-xs text-white/65">
        {EMAIL ? 'للأسئلة المفصّلة أو إذا بدك تبعتي مستندات.' : 'الإيميل رح يضاف قريباً. لهلّق تواصلي معنا على WhatsApp أو ابعتي رسالة.'}
      </p>
      {EMAIL && (
        <a href={`mailto:${EMAIL}`} className="mt-8 inline-flex h-13 items-center gap-2 rounded-full bg-copper-300 px-8 font-bold text-forest-900 transition hover:bg-white">
          <Mail className="size-4" /> ابعتي إيميل
        </a>
      )}
    </div>
  )
}

/* ═════════ لوحة الرسالة: نموذج كأنه محادثة ═════════ */
const STEPS = [
  { key: 'name', q: 'أهلا! شو اسمك؟', type: 'text', ph: 'الاسم الكامل' },
  { key: 'phone', q: 'على أي رقم منحكي معك؟', type: 'tel', ph: '05X-XXXXXXX' },
  { key: 'service', q: 'بشو مهتمة؟', type: 'chips', options: SERVICES },
  { key: 'method', q: 'كيف بتحبي نرجعلك؟', type: 'chips', options: METHODS },
  { key: 'message', q: 'في إشي حابة تحكيلنا ياه؟ (اختياري)', type: 'text', ph: 'مثلاً: هدفك أو سؤالك', optional: true },
]

function FormPanel() {
  const [step, setStep] = useState(0)
  const [v, setV] = useState({})
  const [input, setInput] = useState('')
  const [err, setErr] = useState('')
  const [consent, setConsent] = useState(false)
  const [status, setStatus] = useState('idle') // idle | sending | done | error
  const bottom = useRef(null)
  const cur = STEPS[step]
  const finished = step >= STEPS.length

  useEffect(() => {
    bottom.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }, [step])

  const answer = (val) => {
    const value = (val ?? input).trim()
    if (!value && !cur.optional) return setErr('هاد الحقل مطلوب')
    if (cur.key === 'phone' && value.replace(/\D/g, '').length < 9) return setErr('رقم الهاتف مش صحيح')
    setErr('')
    setV((s) => ({ ...s, [cur.key]: value }))
    setInput('')
    setStep((s) => s + 1)
  }

  const send = async () => {
    if (!consent) return setErr('لازم توافقي عشان نقدر نتواصل معك')
    setErr('')
    if (!FORM_ACCESS_KEY) {
      const text = ['استفسار جديد من الموقع', `الاسم: ${v.name}`, `الهاتف: ${v.phone}`, `مهتمة بـ: ${v.service}`, `نرجعلها: ${v.method}`, v.message && `الرسالة: ${v.message}`]
        .filter(Boolean)
        .join('\n')
      window.open(`${WHATSAPP_URL}?text=${encodeURIComponent(text)}`, '_blank', 'noopener')
      return setStatus('done')
    }
    setStatus('sending')
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ access_key: FORM_ACCESS_KEY, subject: `استفسار جديد · ${v.service} · ${v.name}`, from_name: 'Green Apple Website', ...v }),
      })
      const data = await res.json()
      setStatus(data.success ? 'done' : 'error')
    } catch {
      setStatus('error')
    }
  }

  const reset = () => {
    setStep(0)
    setV({})
    setConsent(false)
    setStatus('idle')
  }

  if (status === 'done') {
    return (
      <div className="flex h-full flex-col items-center justify-center p-8 text-center">
        <motion.span
          initial={{ scale: 0, rotate: -40 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 240, damping: 14 }}
          className="grid size-20 place-items-center rounded-full bg-copper-300 text-forest-900"
        >
          <CheckCircle2 className="size-9" />
        </motion.span>
        <p className="mt-6 text-2xl font-bold">شكراً {v.name}!</p>
        <p className="mt-2 max-w-xs text-white/65">{FORM_ACCESS_KEY ? 'وصلنا استفسارك، ومنرجعلك بأقرب وقت.' : 'فتحنالك WhatsApp ورسالتك جاهزة، بس اكبسي إرسال.'}</p>
        <button type="button" onClick={reset} className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold hover:bg-white/10">
          <RotateCcw className="size-4" /> استفسار جديد
        </button>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      {/* تقدّم */}
      <div className="flex gap-1.5 px-5 pt-5">
        {STEPS.map((s, i) => (
          <span key={s.key} className={`h-1.5 flex-1 rounded-full transition-colors duration-500 ${i < step ? 'bg-copper-300' : i === step ? 'bg-copper-300/50' : 'bg-white/10'}`} />
        ))}
      </div>

      <div className="flex flex-1 flex-col justify-end gap-2.5 overflow-hidden p-5">
        {STEPS.slice(0, Math.min(step + 1, STEPS.length)).map((s, i) => (
          <div key={s.key} className="space-y-2.5">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="flex justify-end">
              <div className="max-w-[85%] rounded-3xl rounded-bl-md bg-white/10 px-4 py-2.5 text-[15px] leading-7">{s.q}</div>
            </motion.div>
            {i < step && v[s.key] !== undefined && (
              <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} className="flex justify-start">
                <button
                  type="button"
                  onClick={() => setStep(i)}
                  title="عدّلي"
                  className="group flex max-w-[85%] items-center gap-2 rounded-3xl rounded-br-md bg-copper-600 px-4 py-2.5 text-[15px] leading-7"
                >
                  <span dir={s.type === 'tel' ? 'ltr' : undefined}>{v[s.key] || '—'}</span>
                  <PenLine className="size-3.5 opacity-0 transition group-hover:opacity-70" />
                </button>
              </motion.div>
            )}
          </div>
        ))}
        {finished && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-end">
            <div className="max-w-[85%] rounded-3xl rounded-bl-md bg-white/10 px-4 py-2.5 text-[15px] leading-7">تمام، كل إشي جاهز. منبعت؟</div>
          </motion.div>
        )}
        <span ref={bottom} />
      </div>

      <div className="border-t border-white/10 p-4 sm:p-5">
        <AnimatePresence mode="wait">
          {!finished && cur.type === 'chips' ? (
            <motion.div key={cur.key} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex flex-wrap gap-2">
              {cur.options.map((o) => (
                <button
                  key={o}
                  type="button"
                  onClick={() => answer(o)}
                  className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white/85 transition hover:border-copper-300 hover:bg-copper-300 hover:text-forest-900"
                >
                  {o}
                </button>
              ))}
            </motion.div>
          ) : !finished ? (
            <motion.form
              key={cur.key}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              onSubmit={(e) => {
                e.preventDefault()
                answer()
              }}
              className="flex items-center gap-2"
            >
              <input
                autoFocus
                type={cur.type}
                dir={cur.type === 'tel' ? 'ltr' : undefined}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value)
                  setErr('')
                }}
                placeholder={cur.ph}
                className={`h-12 flex-1 rounded-full bg-white/10 px-4 text-[15px] text-white outline-none placeholder:text-white/35 focus:ring-2 focus:ring-copper-300/60 ${cur.type === 'tel' ? 'text-right' : ''}`}
              />
              <button type="submit" className="grid size-12 shrink-0 place-items-center rounded-full bg-copper-300 text-forest-900 transition hover:bg-white" aria-label="التالي">
                <Send className="size-4 -scale-x-100" />
              </button>
            </motion.form>
          ) : (
            <motion.div key="send" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
              <label className="flex cursor-pointer items-start gap-3 text-sm leading-6 text-white/70">
                <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1 size-4 shrink-0 accent-[#d9a06a]" />
                بوافق إنو العيادة تتواصل معي بخصوص استفساري، حسب سياسة الخصوصية.
              </label>
              <button
                type="button"
                onClick={send}
                disabled={status === 'sending'}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-copper-300 font-bold text-forest-900 transition hover:bg-white disabled:opacity-70"
              >
                {status === 'sending' ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4 -scale-x-100" />}
                ابعتي الاستفسار
              </button>
            </motion.div>
          )}
        </AnimatePresence>
        {(err || status === 'error') && <p className="mt-2 text-xs text-red-300">{err || 'ما زبط الإرسال، جرّبي كمان مرة أو تواصلي على WhatsApp.'}</p>}
      </div>
    </div>
  )
}

/* ═════════ أول قسم: اختاري الطريقة ═════════ */
const CHANNELS = [
  { id: 'wa', label: 'WhatsApp', sub: 'محادثة مباشرة', icon: MessageCircle },
  { id: 'form', label: 'رسالة', sub: 'منرجعلك نحنا', icon: PenLine },
  { id: 'call', label: 'اتصال', sub: PHONE.label, icon: Phone },
  { id: 'mail', label: 'إيميل', sub: EMAIL || 'قريباً', icon: Mail },
]
const WORDS = ['على WhatsApp', 'برسالة', 'بالتلفون', 'بالإيميل']

function RotatingWord() {
  const [i, setI] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % WORDS.length), 2000)
    return () => clearInterval(t)
  }, [])
  return (
    <span className="relative inline-grid align-bottom">
      <span className="invisible col-start-1 row-start-1">على WhatsApp</span>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={WORDS[i]}
          initial={{ y: '60%', opacity: 0 }}
          animate={{ y: '0%', opacity: 1 }}
          exit={{ y: '-60%', opacity: 0 }}
          transition={{ duration: 0.45, ease: EASE }}
          className="col-start-1 row-start-1 whitespace-nowrap text-copper-600"
        >
          {WORDS[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

function Channels({ now }) {
  const [ch, setCh] = useState('wa')
  const Panel = { wa: WhatsAppPanel, form: FormPanel, call: CallPanel, mail: EmailPanel }[ch]

  return (
    <section id="inquiry" className="scroll-mt-24 pt-28 pb-10 sm:pt-32 sm:pb-14">
      <div className="container-page grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
        <div className="flex flex-col">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap items-center gap-3">
            <Badge>تواصل معنا</Badge>
            <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${now.open ? 'bg-forest-800 text-white' : 'bg-sand-100 text-ink/70'}`}>
              <span className="relative flex size-2">
                {now.open && <span className="absolute inset-0 animate-ping rounded-full bg-copper-300" />}
                <span className={`relative size-2 rounded-full ${now.open ? 'bg-copper-300' : 'bg-ink/30'}`} />
              </span>
              {now.open ? 'مفتوحين هلّق' : 'مسكّرين هلّق'}
            </span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
            className="mt-5 text-4xl leading-[1.2] font-bold text-ink sm:text-6xl"
          >
            خلينا نحكي
            <br />
            <RotatingWord />
          </motion.h1>
          <p className="mt-4 max-w-md text-base leading-8 text-ink/70 sm:text-lg">اختاري الطريقة الأريح إلك، والتفاصيل بتطلع جنبك.</p>

          <div className="mt-8 grid grid-cols-2 gap-2.5">
            {CHANNELS.map((c) => {
              const on = c.id === ch
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCh(c.id)}
                  className={`relative flex items-center gap-3 rounded-3xl p-3.5 text-start transition-colors ${on ? 'text-white' : 'border border-sage-200 bg-white text-ink hover:border-copper-300'}`}
                >
                  {on && <motion.span layoutId="ch-pill" className="absolute inset-0 rounded-3xl bg-forest-800" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />}
                  <span className={`relative grid size-10 shrink-0 place-items-center rounded-2xl ${on ? 'bg-copper-300 text-forest-900' : 'bg-sand-100 text-copper-600'}`}>
                    <c.icon className="size-5" />
                  </span>
                  <span className="relative min-w-0">
                    <span className="block font-bold">{c.label}</span>
                    <span className={`block truncate text-xs ${on ? 'text-white/60' : 'text-ink/50'}`} dir={c.id === 'call' ? 'ltr' : undefined}>
                      {c.sub}
                    </span>
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: EASE }}
          className="relative h-[480px] overflow-hidden rounded-5xl bg-forest-900 text-white sm:h-[520px]"
        >
          <div className="pointer-events-none absolute -top-32 size-[380px] rounded-full bg-[radial-gradient(circle,rgba(217,160,106,0.25),transparent_65%)] ltr:-left-32 rtl:-right-32" />
          <AnimatePresence mode="wait">
            <motion.div
              key={ch}
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="relative h-full"
            >
              <Panel now={now} />
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}

/* ═════════ ثاني قسم: زورينا + ساعات اليوم ═════════ */
function Visit({ now }) {
  const startH = 7
  const endH = 21
  const pct = (h) => ((h - startH) / (endH - startH)) * 100
  const nowPct = Math.min(100, Math.max(0, pct(now.h)))
  const openToday = HOURS.days.includes(now.day)

  return (
    <section className="pb-16 sm:pb-20">
      <div className="container-page">
        <div className="grid overflow-hidden rounded-5xl border border-sage-200 bg-white lg:grid-cols-[1fr_1.1fr]">
          <div className="p-6 sm:p-10">
            <Badge>زورينا</Badge>
            <p className="mt-4 flex items-start gap-3 text-2xl font-bold text-ink sm:text-3xl">
              <MapPin className="mt-1.5 size-6 shrink-0 text-copper-600" />
              {ADDRESS}
            </p>

            {/* أيام الأسبوع */}
            <div className="mt-8 grid grid-cols-7 gap-1.5">
              {DAY_NAMES.map((d, i) => {
                const open = HOURS.days.includes(i)
                const today = i === now.day
                return (
                  <div
                    key={d}
                    className={`rounded-2xl py-2.5 text-center text-xs font-semibold ${
                      today ? 'bg-forest-800 text-white' : open ? 'bg-sand-100 text-ink' : 'bg-sand-50 text-ink/35 line-through'
                    }`}
                  >
                    {d.replace('ال', '')}
                  </div>
                )
              })}
            </div>

            {/* شريط اليوم مع "هلّق" */}
            <div className="mt-8">
              <div className="flex justify-between text-xs text-ink/50" dir="ltr">
                <span>{startH}:00</span>
                <span>{endH}:00</span>
              </div>
              <div className="relative mt-2 h-4 rounded-full bg-sand-100" dir="ltr">
                {openToday && (
                  <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: EASE }}
                    className="absolute inset-y-0 origin-left rounded-full bg-copper-300"
                    style={{ left: `${pct(HOURS.open)}%`, width: `${pct(HOURS.close) - pct(HOURS.open)}%` }}
                  />
                )}
                <div className="absolute -top-2 -bottom-2 w-0.5 bg-forest-800" style={{ left: `${nowPct}%` }}>
                  <span className="absolute -top-6 left-1/2 -translate-x-1/2 rounded-full bg-forest-800 px-2 py-0.5 text-[10px] font-bold whitespace-nowrap text-white">هلّق</span>
                </div>
              </div>
              <p className="mt-4 text-sm text-ink/60">
                {openToday ? `اليوم مفتوحين من ${HOURS.open}:00 لـ ${HOURS.close}:00` : 'اليوم مسكّرين'} · <span className="text-ink/40">الساعات مبدئية</span>
              </p>
            </div>

            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(MAP_QUERY)}`}
              target="_blank"
              rel="noreferrer"
              className="mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-forest-800 px-6 text-sm font-semibold text-white transition hover:bg-forest-700"
            >
              افتحي بالخريطة <ArrowUpLeft className="size-4" />
            </a>
          </div>
          <div className="relative min-h-[300px]">
            <iframe
              title="map"
              src={`https://www.google.com/maps?q=${encodeURIComponent(MAP_QUERY)}&z=14&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 size-full border-0 grayscale-[30%]"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default function ContactPage() {
  const now = useClinicNow()
  useEffect(() => {
    document.title = 'تواصل معنا · Green Apple'
  }, [])
  return (
    <MotionConfig reducedMotion="never">
      <div dir="rtl" className="bg-sand-50">
        <Channels now={now} />
        <Visit now={now} />
      </div>
    </MotionConfig>
  )
}
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MessageCircle,
  Mail,
  Phone,
  MapPin,
  Clock,
  ArrowUpLeft,
  ArrowUpRight,
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import { WHATSAPP_URL, PHONE } from '../data/content'
import { EASE } from '../lib/motion'
import Badge from '../components/ui/Badge'

/* ───────── معلومات العيادة — عدّليها هون لما توصل من العيادة ───────── */
const EMAIL = '' // مثال: 'info@greenapple.co.il' — إذا فاضي، كرت الإيميل بيطلع "قريباً"
const ADDRESS = { ar: 'سخنين · [الشارع والرقم]', en: 'Sakhnin · [Street & number]' }
const HOURS = { ar: 'الأحد–الخميس · 09:00–18:00', en: 'Sun–Thu · 09:00–18:00' }
const MAP_QUERY = 'Sakhnin' // لما يوصل العنوان الكامل، حطيه هون
// مفتاح Web3Forms (مجاني): بيبعت الاستفسارات على إيميل العيادة.
// إذا فاضي، النموذج بيفتح واتساب مع الرسالة جاهزة.
const FORM_ACCESS_KEY = ''

const T = {
  ar: {
    crumbs: ['الرئيسية', 'تواصل معنا'],
    badge: 'تواصل معنا',
    title: 'كيف بتحبي',
    accent: 'نحكي معك؟',
    lead: 'اختاري الطريقة الأسهل إلك. فريقنا بيرجعلك بساعات الدوام.',
    options: {
      whatsapp: { title: 'WhatsApp', text: 'محادثة مباشرة مع الاستقبال', cta: 'افتحي المحادثة' },
      email: { title: 'إيميل', text: 'للأسئلة المفصّلة والمستندات', cta: 'ابعتي إيميل', soon: 'رح يضاف قريباً' },
      phone: { title: 'اتصال', text: 'احكي معنا مباشرة', cta: 'اتصلي هلّق' },
    },
    form: {
      title: 'ابعتيلنا استفسار',
      text: 'عبّي التفاصيل ومنرجعلك بالطريقة اللي بتختاريها.',
      name: 'الاسم الكامل',
      phone: 'رقم الهاتف',
      email: 'الإيميل (اختياري)',
      service: 'بشو مهتمة؟',
      services: ['استشارة عامة', 'البطن والخصر', 'الفخذين والذراعين', 'السيلوليت والترهل', 'إزالة الشعر بالليزر', 'العناية بالبشرة'],
      method: 'كيف نرجعلك؟',
      methods: ['اتصال', 'WhatsApp', 'إيميل'],
      message: 'رسالتك',
      messagePh: 'احكيلنا باختصار عن هدفك أو سؤالك…',
      consent: 'بوافق إنو العيادة تتواصل معي بخصوص استفساري، حسب سياسة الخصوصية.',
      submit: 'ابعتي الاستفسار',
      sending: 'عم نبعت…',
      required: 'هاد الحقل مطلوب',
      badPhone: 'رقم الهاتف مش صحيح',
      badEmail: 'الإيميل مش صحيح',
      needConsent: 'لازم توافقي عشان نقدر نتواصل معك',
      okTitle: 'وصلنا استفسارك!',
      okText: 'شكراً إلك. منرجعلك بأقرب وقت بساعات الدوام.',
      okWa: 'فتحنالك WhatsApp ورسالتك جاهزة، بس اكبسي إرسال.',
      again: 'استفسار جديد',
      errTitle: 'ما زبط الإرسال',
      errText: 'جرّبي كمان مرة، أو تواصلي معنا على WhatsApp.',
    },
    info: { title: 'زورينا', address: 'العنوان', hours: 'ساعات الدوام', phone: 'الهاتف', directions: 'افتحي بالخريطة' },
  },
  en: {
    crumbs: ['Home', 'Contact'],
    badge: 'Contact Us',
    title: 'How would you like',
    accent: 'to reach us?',
    lead: 'Choose whatever is easiest for you. Our team will get back to you during working hours.',
    options: {
      whatsapp: { title: 'WhatsApp', text: 'Chat directly with reception', cta: 'Open chat' },
      email: { title: 'Email', text: 'For detailed questions and documents', cta: 'Send an email', soon: 'Coming soon' },
      phone: { title: 'Call', text: 'Talk to us directly', cta: 'Call now' },
    },
    form: {
      title: 'Send us an inquiry',
      text: 'Fill in your details and we will get back to you the way you prefer.',
      name: 'Full name',
      phone: 'Phone number',
      email: 'Email (optional)',
      service: 'What are you interested in?',
      services: ['General consultation', 'Abdomen & Waist', 'Thighs & Arms', 'Cellulite & Sagging', 'Laser hair removal', 'Skin care'],
      method: 'How should we reply?',
      methods: ['Call', 'WhatsApp', 'Email'],
      message: 'Your message',
      messagePh: 'Tell us briefly about your goal or question…',
      consent: 'I agree that the clinic may contact me about my inquiry, according to the privacy policy.',
      submit: 'Send inquiry',
      sending: 'Sending…',
      required: 'This field is required',
      badPhone: 'Phone number is not valid',
      badEmail: 'Email is not valid',
      needConsent: 'Please agree so we can contact you',
      okTitle: 'We got your inquiry!',
      okText: 'Thank you. We will get back to you soon during working hours.',
      okWa: 'We opened WhatsApp with your message ready — just tap send.',
      again: 'New inquiry',
      errTitle: 'Sending failed',
      errText: 'Please try again, or contact us on WhatsApp.',
    },
    info: { title: 'Visit us', address: 'Address', hours: 'Working hours', phone: 'Phone', directions: 'Open in Maps' },
  },
}

const EMPTY = { name: '', phone: '', email: '', service: 0, method: 0, message: '', consent: false }

/* ───────── كروت الطرق الثلاث ───────── */
function OptionCard({ icon: Icon, o, href, value, external, dark, disabled, i, Arrow }) {
  const Tag = disabled ? 'div' : 'a'
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.25 + i * 0.1, ease: EASE }}
    >
      <Tag
        href={disabled ? undefined : href}
        target={external ? '_blank' : undefined}
        rel={external ? 'noreferrer' : undefined}
        className={`group relative flex h-full items-center gap-4 overflow-hidden rounded-4xl p-5 transition-all duration-300 sm:flex-col sm:items-stretch sm:gap-0 sm:p-7 ${
          dark
            ? 'bg-forest-800 text-white hover:bg-forest-700'
            : 'border border-sage-200 bg-white text-ink hover:border-copper-300 hover:shadow-xl hover:shadow-copper-600/10'
        } ${disabled ? 'opacity-70' : 'hover:-translate-y-1'}`}
      >
        <span
          className={`grid size-12 shrink-0 place-items-center rounded-2xl ${dark ? 'bg-copper-300 text-forest-900' : 'bg-sand-100 text-copper-600'}`}
        >
          <Icon className="size-5" />
        </span>
        <span className="min-w-0 flex-1 sm:mt-6">
          <span className="block text-lg font-bold sm:text-xl">{o.title}</span>
          <span className={`mt-1 hidden text-sm sm:block ${dark ? 'text-white/65' : 'text-ink/60'}`}>{o.text}</span>
          <span className={`mt-0.5 block text-sm font-semibold sm:mt-4 ${dark ? 'text-copper-300' : 'text-ink/80'}`}>
            {disabled ? (
              <span className="sm:hidden">{o.soon}</span>
            ) : null}
            <bdi className={disabled ? 'hidden sm:inline' : ''} dir={/^[+\d]/.test(value) || value.includes('@') ? 'ltr' : 'auto'}>
              {value}
            </bdi>
          </span>
        </span>
        {/* موبايل: سهم صغير على الجنب */}
        {!disabled && (
          <span
            className={`grid size-10 shrink-0 place-items-center rounded-full sm:hidden ${dark ? 'bg-white text-forest-800' : 'bg-copper-600 text-white'}`}
          >
            <Arrow className="size-4" />
          </span>
        )}
        {/* كمبيوتر: سطر الزر تحت */}
        <span
          className={`mt-6 hidden items-center justify-between border-t pt-4 text-sm font-semibold sm:flex ${
            dark ? 'border-white/10' : 'border-sage-200'
          }`}
        >
          {disabled ? o.soon : o.cta}
          {!disabled && (
            <span
              className={`grid size-9 place-items-center rounded-full transition-transform duration-300 group-hover:rotate-45 ${
                dark ? 'bg-white text-forest-800' : 'bg-copper-600 text-white'
              }`}
            >
              <Arrow className="size-4" />
            </span>
          )}
        </span>
      </Tag>
    </motion.div>
  )
}

/* ───────── حقل بالنموذج ───────── */
function Field({ label, error, children, id }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-ink/80">
        {label}
      </label>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-1 text-xs text-red-700"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}

const inputCls = (bad) =>
  `w-full rounded-2xl border bg-sand-50 px-4 py-3 text-[15px] text-ink outline-none transition placeholder:text-ink/35 focus:bg-white focus:ring-4 ${
    bad ? 'border-red-400 focus:ring-red-100' : 'border-sage-200 focus:border-copper-500 focus:ring-copper-300/25'
  }`

/* ───────── النموذج ───────── */
function InquiryForm({ f, isEn }) {
  const [v, setV] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | sending | ok | okWa | error

  const set = (k) => (e) => {
    const val = e?.target ? (e.target.type === 'checkbox' ? e.target.checked : e.target.value) : e
    setV((s) => ({ ...s, [k]: val }))
    if (errors[k]) setErrors((s) => ({ ...s, [k]: null }))
  }

  const validate = () => {
    const er = {}
    if (!v.name.trim()) er.name = f.required
    if (!v.phone.trim()) er.phone = f.required
    else if (v.phone.replace(/[^\d]/g, '').length < 9) er.phone = f.badPhone
    if (v.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) er.email = f.badEmail
    if (!v.consent) er.consent = f.needConsent
    setErrors(er)
    return Object.keys(er).length === 0
  }

  const submit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    const service = f.services[v.service]
    const method = f.methods[v.method]

    // لسا ما في مفتاح؟ منفتح واتساب مع الرسالة جاهزة
    if (!FORM_ACCESS_KEY) {
      const text = [
        isEn ? 'New inquiry from the website' : 'استفسار جديد من الموقع',
        `${f.name}: ${v.name}`,
        `${f.phone}: ${v.phone}`,
        v.email && `Email: ${v.email}`,
        `${f.service} ${service}`,
        `${f.method} ${method}`,
        v.message && `${f.message}: ${v.message}`,
      ]
        .filter(Boolean)
        .join('\n')
      window.open(`${WHATSAPP_URL}?text=${encodeURIComponent(text)}`, '_blank', 'noopener')
      setStatus('okWa')
      return
    }

    setStatus('sending')
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: FORM_ACCESS_KEY,
          subject: `استفسار جديد · ${service} · ${v.name}`,
          from_name: 'Green Apple Website',
          name: v.name,
          phone: v.phone,
          email: v.email || undefined,
          service,
          contact_method: method,
          message: v.message,
        }),
      })
      const data = await res.json()
      setStatus(data.success ? 'ok' : 'error')
    } catch {
      setStatus('error')
    }
  }

  const done = status === 'ok' || status === 'okWa'

  return (
    <div id="inquiry" className="relative scroll-mt-28 overflow-hidden rounded-5xl border border-sage-200 bg-white p-6 shadow-sm sm:p-10">
      <AnimatePresence mode="wait">
        {done ? (
          <motion.div
            key="ok"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="grid min-h-[420px] place-items-center text-center"
          >
            <div>
              <motion.span
                initial={{ scale: 0, rotate: -30 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 260, damping: 16, delay: 0.1 }}
                className="mx-auto grid size-20 place-items-center rounded-full bg-forest-800 text-copper-300"
              >
                <CheckCircle2 className="size-9" />
              </motion.span>
              <p className="mt-6 text-2xl font-bold text-ink">{f.okTitle}</p>
              <p className="mx-auto mt-2 max-w-sm text-ink/65">{status === 'okWa' ? f.okWa : f.okText}</p>
              <button
                type="button"
                onClick={() => {
                  setV(EMPTY)
                  setStatus('idle')
                }}
                className="mt-8 rounded-full border border-sage-200 px-6 py-2.5 text-sm font-semibold text-ink transition hover:border-forest-600"
              >
                {f.again}
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.form key="form" noValidate onSubmit={submit} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <p className="text-2xl font-bold text-ink sm:text-3xl">{f.title}</p>
            <p className="mt-2 text-ink/60">{f.text}</p>

            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              <Field id="c-name" label={f.name} error={errors.name}>
                <input id="c-name" autoComplete="name" value={v.name} onChange={set('name')} className={inputCls(errors.name)} />
              </Field>
              <Field id="c-phone" label={f.phone} error={errors.phone}>
                <input
                  id="c-phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  dir="ltr"
                  value={v.phone}
                  onChange={set('phone')}
                  className={`${inputCls(errors.phone)} ${isEn ? '' : 'text-right'}`}
                  placeholder="05X-XXXXXXX"
                />
              </Field>
              <Field id="c-email" label={f.email} error={errors.email}>
                <input
                  id="c-email"
                  type="email"
                  autoComplete="email"
                  dir="ltr"
                  value={v.email}
                  onChange={set('email')}
                  className={`${inputCls(errors.email)} ${isEn ? '' : 'text-right'}`}
                />
              </Field>
              <Field id="c-service" label={f.service}>
                <select id="c-service" value={v.service} onChange={(e) => set('service')(Number(e.target.value))} className={inputCls(false)}>
                  {f.services.map((s, i) => (
                    <option key={s} value={i}>
                      {s}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <fieldset className="mt-5">
              <legend className="mb-2 text-sm font-medium text-ink/80">{f.method}</legend>
              <div className="flex flex-wrap gap-2">
                {f.methods.map((m, i) => (
                  <button
                    key={m}
                    type="button"
                    aria-pressed={v.method === i}
                    onClick={() => set('method')(i)}
                    className={`relative rounded-full px-5 py-2.5 text-sm font-semibold transition-colors ${
                      v.method === i ? 'text-white' : 'border border-sage-200 bg-sand-50 text-ink/75 hover:border-copper-300'
                    }`}
                  >
                    {v.method === i && (
                      <motion.span layoutId="method-pill" className="absolute inset-0 rounded-full bg-forest-800" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />
                    )}
                    <span className="relative">{m}</span>
                  </button>
                ))}
              </div>
            </fieldset>

            <div className="mt-5">
              <Field id="c-msg" label={f.message}>
                <textarea id="c-msg" rows={4} value={v.message} onChange={set('message')} placeholder={f.messagePh} className={`${inputCls(false)} resize-none`} />
              </Field>
            </div>

            <label className="mt-5 flex cursor-pointer items-start gap-3 text-sm leading-6 text-ink/70">
              <input type="checkbox" checked={v.consent} onChange={set('consent')} className="mt-1 size-4 shrink-0 accent-[#8c4724]" />
              <span>{f.consent}</span>
            </label>
            {errors.consent && <p className="mt-1 text-xs text-red-700">{errors.consent}</p>}

            <AnimatePresence>
              {status === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-5 flex items-start gap-3 rounded-2xl bg-red-50 p-4 text-sm text-red-800"
                >
                  <AlertCircle className="mt-0.5 size-4 shrink-0" />
                  <span>
                    <b className="block">{f.errTitle}</b>
                    {f.errText}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={status === 'sending'}
              className="mt-7 inline-flex h-13 w-full items-center justify-center gap-2 rounded-full bg-copper-600 px-8 font-semibold text-white shadow-lg shadow-copper-600/25 transition hover:bg-copper-700 disabled:opacity-70 sm:w-auto"
            >
              {status === 'sending' ? (
                <>
                  <Loader2 className="size-4 animate-spin" /> {f.sending}
                </>
              ) : (
                <>
                  {f.submit} <Send className={`size-4 ${isEn ? '' : '-scale-x-100'}`} />
                </>
              )}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ───────── معلومات الزيارة + الخريطة ───────── */
function VisitCard({ t, isEn }) {
  const rows = [
    { icon: MapPin, label: t.info.address, value: ADDRESS[isEn ? 'en' : 'ar'] },
    { icon: Clock, label: t.info.hours, value: HOURS[isEn ? 'en' : 'ar'] },
    { icon: Phone, label: t.info.phone, value: PHONE.label, href: PHONE.href },
  ]
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(MAP_QUERY)}`

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-5xl bg-forest-800 text-white">
      <div className="relative h-64 shrink-0 sm:h-72 lg:h-auto lg:flex-1">
        <iframe
          title="map"
          src={`https://www.google.com/maps?q=${encodeURIComponent(MAP_QUERY)}&z=14&output=embed`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0 size-full border-0 grayscale-[35%]"
        />
      </div>
      <div className="p-6 sm:p-8">
        <p className="text-xl font-bold">{t.info.title}</p>
        <ul className="mt-5 space-y-4">
          {rows.map((r) => {
            const Tag = r.href ? 'a' : 'div'
            return (
              <li key={r.label}>
                <Tag href={r.href} className="flex items-center gap-3">
                  <span className="grid size-10 shrink-0 place-items-center rounded-full bg-white/10 text-copper-300">
                    <r.icon className="size-4" />
                  </span>
                  <span>
                    <span className="block text-xs text-white/55">{r.label}</span>
                    <span className="block text-[15px] font-semibold">
                      <bdi dir={/^[+\d]/.test(r.value) ? 'ltr' : 'auto'}>{r.value}</bdi>
                    </span>
                  </span>
                </Tag>
              </li>
            )
          })}
        </ul>
        <a
          href={mapsUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-copper-300 px-5 text-sm font-semibold text-forest-900 transition hover:bg-white"
        >
          <MapPin className="size-4" />
          {t.info.directions}
        </a>
      </div>
    </div>
  )
}

/* ───────── الصفحة ───────── */
export default function ContactPage() {
  const { lang } = useLanguage() || {}
  const isEn = lang === 'en'
  const t = T[isEn ? 'en' : 'ar']
  const Arrow = isEn ? ArrowUpRight : ArrowUpLeft
  const Crumb = isEn ? ChevronRight : ChevronLeft

  useEffect(() => {
    document.title = isEn ? 'Contact · Green Apple' : 'تواصل معنا · Green Apple'
  }, [isEn])

  const waText = isEn ? 'Hi, I have a question' : 'مرحبا، عندي استفسار'

  return (
    <div dir={isEn ? 'ltr' : 'rtl'} className="relative overflow-hidden bg-sand-50 pb-20 sm:pb-28">
      <div className="pointer-events-none absolute -top-40 size-[620px] rounded-full bg-[radial-gradient(circle,rgba(217,160,106,0.28),transparent_65%)] ltr:-left-56 rtl:-right-56" />

      <div className="container-page relative pt-28 sm:pt-36">
        {/* المسار */}
        <nav aria-label="breadcrumb">
          <ol className="flex items-center gap-1.5 text-xs text-ink/60">
            <li>
              <a href="/" className="transition-colors hover:text-copper-600">
                {t.crumbs[0]}
              </a>
            </li>
            <Crumb className="size-3 opacity-60" />
            <li aria-current="page" className="font-medium text-ink">
              {t.crumbs[1]}
            </li>
          </ol>
        </nav>

        {/* العنوان */}
        <div className="mt-8 max-w-2xl">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE }}>
            <Badge>{t.badge}</Badge>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
            className="mt-5 text-4xl leading-[1.15] font-bold text-ink sm:text-6xl"
          >
            {t.title} <span className="text-copper-600">{t.accent}</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
            className="mt-5 text-lg leading-8 text-ink/70"
          >
            {t.lead}
          </motion.p>
        </div>

        {/* الطرق الثلاث */}
        <div className="mt-10 grid gap-3 sm:mt-12 sm:grid-cols-3 sm:gap-4">
          <OptionCard
            i={0}
            dark
            icon={MessageCircle}
            o={t.options.whatsapp}
            href={`${WHATSAPP_URL}?text=${encodeURIComponent(waText)}`}
            value="+972 59-237-3805"
            external
            Arrow={Arrow}
          />
          <OptionCard
            i={1}
            icon={Mail}
            o={t.options.email}
            href={EMAIL ? `mailto:${EMAIL}` : undefined}
            value={EMAIL || '—'}
            disabled={!EMAIL}
            Arrow={Arrow}
          />
          <OptionCard i={2} icon={Phone} o={t.options.phone} href={PHONE.href} value={PHONE.label} Arrow={Arrow} />
        </div>

        {/* النموذج + الزيارة */}
        <div className="mt-6 grid gap-6 lg:grid-cols-[1.35fr_1fr]">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.8, ease: EASE }}>
            <InquiryForm f={t.form} isEn={isEn} />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
          >
            <VisitCard t={t} isEn={isEn} />
          </motion.div>
        </div>
      </div>
    </div>
  )
}
import { useRef, useState } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'
import { cta as originalCta, bookingUrl } from '../data/content'
import { useLanguage } from '../context/LanguageContext'
import Button from '../components/ui/Button'

const ctaEn = {
  title: 'Ready to Start?',
  accent: 'Book Your Consultation in a Minute',
  steps: [
    'Choose the service',
    'Message us on WhatsApp',
    'We arrange the time with you',
    'Confirmation on WhatsApp',
  ],
  note: 'Initial consultation takes 2-3 hours with clinic management',
  button: 'Book Consultation Now',
  form: {
    title: 'Hesitant? We Will Call You',
    subtitle: 'Leave your number and we will answer all your questions.',
    name: 'Name',
    phone: 'Phone Number',
    phonePlaceholder: '05X-XXX-XXXX',
    interest: 'What interests you?',
    interests: ['Slimming', 'Skin Aesthetics', 'Laser', 'Body Sculpting'],
    consent: 'I agree that the clinic contacts me by phone or WhatsApp.',
    submit: 'Request a Call',
    successTitle: 'We received your request!',
    successText: 'We will call you as soon as possible.',
  }
}

const ctaAr = {
  ...originalCta,
  form: {
    title: 'مترددة؟ منتصل فيكِ',
    subtitle: 'اتركي رقمك وبنجاوب على كل أسئلتك.',
    name: 'الاسم',
    phone: 'رقم الهاتف',
    phonePlaceholder: '05X-XXX-XXXX',
    interest: 'شو بيهمك؟',
    interests: ['التنحيف', 'تجميل البشرة', 'الليزر', 'نحت الجسم'],
    consent: 'بوافق إنه العيادة تتواصل معي بالهاتف أو WhatsApp.',
    submit: 'اطلبي اتصالاً',
    successTitle: 'وصلنا طلبك!',
    successText: 'رح نتصل فيكِ بأقرب وقت.',
  }
}

const inputCls =
  'mt-1.5 h-11 w-full rounded-full border border-forest-600/50 bg-white px-4 text-sm outline-none transition focus:border-forest-800 focus:ring-4 focus:ring-forest-800/10'

function CallbackForm({ ctaData, isEn }) {
  const form = ctaData.form
  const [sent, setSent] = useState(false)

  const onSubmit = (e) => {
    e.preventDefault()
    setSent(true)
  }

  return (
    <div className={`relative w-full max-w-sm rounded-4xl bg-white p-6 shadow-2xl ${isEn ? 'text-left' : 'text-right'}`}>
      <AnimatePresence mode="wait">
        {sent ? (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex min-h-[380px] flex-col items-center justify-center gap-3 text-center"
          >
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 15, delay: 0.1 }}
            >
              <CheckCircle2 className="size-14 text-forest-700" />
            </motion.span>
            <p className="text-lg font-semibold">{form.successTitle}</p>
            <p className="text-sm text-ink/70">{form.successText}</p>
          </motion.div>
        ) : (
          <motion.form key="form" exit={{ opacity: 0, y: -10 }} onSubmit={onSubmit} className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">{form.title}</h3>
              <p className="mt-1 text-xs text-ink/70">{form.subtitle}</p>
            </div>
            <label className="block text-sm">
              {form.name}
              <input required name="name" className={inputCls} />
            </label>
            <label className="block text-sm">
              {form.phone}
              <input
                required
                name="phone"
                type="tel"
                inputMode="tel"
                placeholder={form.phonePlaceholder}
                className={`${inputCls} ${isEn ? 'text-left' : 'text-right'}`}
              />
            </label>
            <label className="block text-sm">
              {form.interest}
              <select name="interest" className={`${inputCls} appearance-none`}>
                {form.interests.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </label>
            <label className="flex items-start gap-2 text-xs text-ink/80">
              <input required type="checkbox" className="mt-0.5 size-4 accent-forest-800 shrink-0" />
              <span>{form.consent}</span>
            </label>
            <Button as="button" type="submit" variant="dark" size="md" className="w-full">
              {form.submit}
            </Button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function CTA() {
  const { lang } = useLanguage() || {}
  const isEn = lang === 'en'

  const ctaData = isEn ? ctaEn : ctaAr

  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const bgY = useTransform(scrollYProgress, [0, 1], ['-10%', '10%'])

  return (
    <section id="cta" ref={ref} className="pb-20 sm:pb-24" dir={isEn ? 'ltr' : 'rtl'}>
      <div className="container-page">
        <div className="relative overflow-hidden rounded-5xl">
          <motion.img
            src="/images/cta-office.webp"
            alt=""
            style={{ y: bgY, scale: 1.2 }}
            className="absolute inset-0 size-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-forest-950/90 via-forest-900/70 to-forest-900/30" />

          <div className="relative grid items-center gap-10 p-6 sm:p-10 lg:grid-cols-[1.2fr_1fr] lg:p-12">
            
            {/* النصوص والعنوان والخطوات */}
            <div className="space-y-6">
              <h2 className={`text-3xl leading-snug font-bold text-white sm:text-4xl lg:text-[2.6rem] ${isEn ? 'text-left' : 'text-right'}`}>
                {ctaData.title}
                <br />
                <span className="text-copper-300">{ctaData.accent}</span>
              </h2>

              {/* الخطوات الأربع */}
              <div className="grid gap-3 sm:grid-cols-2">
                {ctaData.steps && ctaData.steps.map((s, i) => (
                  <div
                    key={s}
                    className={`flex items-center gap-3 rounded-2xl border border-white/15 bg-forest-900/50 p-3 text-sm text-white backdrop-blur-sm ${
                      isEn ? 'text-left' : 'text-right'
                    }`}
                  >
                    <span className="grid size-8 shrink-0 place-items-center rounded-full bg-copper-300 font-semibold text-forest-900">
                      {i + 1}
                    </span>
                    <span>{s}</span>
                  </div>
                ))}
              </div>

              <div className={`flex flex-col gap-4 ${isEn ? 'items-start text-left' : 'items-start text-right'}`}>
                <p className="text-sm text-white/85">{ctaData.note}</p>
                <Button href={bookingUrl(isEn ? 'en' : 'ar')} target="_blank" rel="noreferrer" variant="nude" size="lg">
                  {ctaData.button}
                </Button>
              </div>
            </div>

            {/* فورم التواصل */}
            <div className="flex justify-center lg:justify-end">
              <CallbackForm ctaData={ctaData} isEn={isEn} />
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}
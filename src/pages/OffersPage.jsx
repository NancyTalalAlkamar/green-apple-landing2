import { useState } from 'react'
import { motion, AnimatePresence, MotionConfig } from 'framer-motion'
import { ArrowUpLeft, Check, Scissors, Sparkles, Gift } from 'lucide-react'
import { WHATSAPP_URL } from '../data/content'
import { EASE } from '../lib/motion'
import Badge from '../components/ui/Badge'
import DemoTag from '../components/DemoTag'

/* ─────────────────────────────────────────────
   صفحة العروض — كل العروض هون تجريبية،
   وبتتبدّل بالعروض الحقيقية من لوحة التحكم.
   ───────────────────────────────────────────── */
const FILTERS = [
  { id: 'all', label: 'الكل' },
  { id: 'body', label: 'نحت الجسم' },
  { id: 'laser', label: 'الليزر' },
  { id: 'skin', label: 'البشرة' },
  { id: 'friends', label: 'مع صاحبتك' },
]

const FEATURED = {
  tag: 'عرض البداية',
  title: 'باقة البداية',
  text: 'استشارة كاملة + مسح ثلاثي الأبعاد + أول جلستين من خطتك.',
  value: '25%',
  valueLabel: 'خصم',
  until: 'لحد [تاريخ]',
  image: '/images/body-scan.webp',
}

const OFFERS = [
  { id: 1, cat: 'body', title: 'البطن والخصر', text: 'جلسة هدية مع باقة 10 جلسات.', value: '+1', valueLabel: 'جلسة', until: 'لحد [تاريخ]' },
  { id: 2, cat: 'laser', title: 'الليزر · منطقتين', text: 'المنطقة التانية بنص السعر.', value: '50%', valueLabel: 'ع التانية', until: 'لحد [تاريخ]' },
  { id: 3, cat: 'skin', title: 'العناية بالبشرة', text: 'جلسة تنظيف عميق هدية مع أول خطة.', value: 'هدية', valueLabel: 'جلسة', until: 'لحد [تاريخ]' },
  { id: 4, cat: 'friends', title: 'جيبي صاحبتك', text: 'خصم إلك وإلها لما تبلّشوا مع بعض.', value: '15%', valueLabel: 'لكل وحدة', until: 'لحد [تاريخ]' },
  { id: 5, cat: 'body', title: 'الفخذين والذراعين', text: 'مسح 3D إضافي ببداية الخطة.', value: '+1', valueLabel: 'مسح', until: 'لحد [تاريخ]' },
]

const waFor = (title) => `${WHATSAPP_URL}?text=${encodeURIComponent(`مرحبا، بدي أستفسر عن عرض: ${title}`)}`

/* ═════════ تذكرة العرض: الكعب بينقص لما تطلبيه ═════════ */
function Ticket({ o, i }) {
  const [torn, setTorn] = useState(false)

  const claim = () => {
    setTorn(true)
    setTimeout(() => window.open(waFor(o.title), '_blank', 'noopener'), 650)
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.45, delay: i * 0.05, ease: EASE }}
      className="group relative flex h-44 sm:h-48"
    >
      {/* الجسم */}
      <div className="relative flex flex-1 flex-col justify-between rounded-s-4xl bg-white p-5 shadow-sm ring-1 ring-sage-200 sm:p-6">
        <div>
          <p className="text-xl font-bold text-ink sm:text-2xl">{o.title}</p>
          <p className="mt-1.5 text-sm leading-6 text-ink/65">{o.text}</p>
        </div>
        <p className="text-xs text-ink/45">{o.until}</p>
      </div>

      {/* خط القص */}
      <div className="relative w-0">
        <span className="absolute -top-3 -left-3 z-10 size-6 rounded-full bg-sand-50" />
        <span className="absolute -bottom-3 -left-3 z-10 size-6 rounded-full bg-sand-50" />
        <span className="absolute inset-y-4 left-0 border-l-2 border-dashed border-sage-200" />
        <Scissors className="absolute top-1/2 -left-2.5 z-10 size-5 -translate-y-1/2 rotate-90 text-ink/25 transition-transform duration-500 group-hover:translate-y-2" />
      </div>

      {/* الكعب */}
      <div className="relative w-32 sm:w-36">
        {/* اللي بيبيّن بعد ما ينقص الكعب */}
        <div className="absolute inset-0 grid place-items-center rounded-e-4xl border-2 border-dashed border-copper-300 text-center">
          <div>
            <span className="mx-auto grid size-10 place-items-center rounded-full bg-copper-300 text-forest-900">
              <Check className="size-5" />
            </span>
            <p className="mt-2 text-xs font-semibold text-ink/70">فتحنا WhatsApp</p>
          </div>
        </div>
        <AnimatePresence>
          {!torn && (
            <motion.button
              type="button"
              onClick={claim}
              exit={{ rotate: 18, y: 120, x: 30, opacity: 0, transition: { duration: 0.6, ease: [0.5, 0, 0.75, 0] } }}
              whileHover={{ rotate: -2 }}
              style={{ transformOrigin: '100% 0%' }}
              className="absolute inset-0 flex flex-col items-center justify-center gap-1 rounded-e-4xl bg-forest-800 p-3 text-center text-white"
            >
              <span className="text-3xl font-bold text-copper-300 sm:text-4xl">{o.value}</span>
              <span className="text-xs text-white/70">{o.valueLabel}</span>
              <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold">
                قصّي واطلبي <Scissors className="size-3" />
              </span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

/* ═════════ العرض المميّز ═════════ */
function Featured() {
  const f = FEATURED
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, delay: 0.2, ease: EASE }}
      className="relative mt-8 grid overflow-hidden rounded-5xl bg-forest-900 text-white lg:grid-cols-[1.2fr_1fr]"
    >
      <div className="relative z-10 p-7 sm:p-10">
        <span className="inline-flex items-center gap-2 rounded-full bg-copper-300 px-3 py-1 text-xs font-bold text-forest-900">
          <Sparkles className="size-3.5" /> {f.tag}
        </span>
        <p className="mt-5 text-4xl font-bold sm:text-5xl">{f.title}</p>
        <p className="mt-3 max-w-md leading-8 text-white/70">{f.text}</p>
        <div className="mt-7 flex flex-wrap items-center gap-4">
          <a
            href={waFor(f.title)}
            target="_blank"
            rel="noreferrer"
            className="group inline-flex h-13 items-center gap-3 rounded-full bg-copper-300 ps-6 pe-1.5 font-bold text-forest-900 transition hover:bg-white"
          >
            اطلبي العرض
            <span className="grid size-10 place-items-center rounded-full bg-forest-900 text-copper-300 transition-transform group-hover:-rotate-45">
              <ArrowUpLeft className="size-4" />
            </span>
          </a>
          <span className="text-sm text-white/50">{f.until}</span>
        </div>
      </div>
      <div className="relative min-h-[240px]">
        <img src={f.image} alt="" className="absolute inset-0 size-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-l from-transparent to-forest-900 max-lg:bg-gradient-to-t" />
        {/* ختم الخصم بيلف */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
          className="absolute top-6 left-6 grid size-32 place-items-center sm:size-36"
        >
          <svg viewBox="0 0 100 100" className="absolute inset-0 size-full">
            <circle cx="50" cy="50" r="48" fill="#e8d3c6" />
            <circle cx="50" cy="50" r="41" fill="none" stroke="#2b2826" strokeWidth="1.5" strokeDasharray="2 5" strokeLinecap="round" />
          </svg>
        </motion.div>
        <div className="pointer-events-none absolute top-6 left-6 grid size-32 place-items-center text-center text-forest-900 sm:size-36">
          <div>
            <p className="text-3xl leading-none font-bold">{f.value}</p>
            <p className="text-xs font-semibold">{f.valueLabel}</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function OffersPage() {
  const [filter, setFilter] = useState('all')
  const list = OFFERS.filter((o) => filter === 'all' || o.cat === filter)

  return (
    <MotionConfig reducedMotion="never">
      <div dir="rtl" className="bg-sand-50 pt-28 pb-16 sm:pt-32 sm:pb-20">
        <div className="container-page">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <Badge>العروض</Badge>
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
                className="mt-4 text-4xl leading-[1.15] font-bold text-ink sm:text-6xl"
              >
                عروض <span className="text-gold-600">على قياسك</span>
              </motion.h1>
              <p className="mt-3 max-w-lg text-base leading-8 text-ink/70 sm:text-lg">قصّي الكوبون اللي بيعجبك، ومنكمّل معك على WhatsApp.</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-ink/50">
              <Gift className="size-4 text-gold-600" /> كل عرض بيبلّش باستشارة
            </div>
          </div>
        </div>

        <div className="mt-8">
          <DemoTag>
            <div className="container-page pt-4">
              <Featured />

              {/* الفلاتر */}
              <div className="mt-10 flex flex-wrap gap-2">
                {FILTERS.map((f) => {
                  const on = f.id === filter
                  return (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setFilter(f.id)}
                      className={`relative rounded-full px-4 py-2.5 text-sm font-semibold transition-colors ${on ? 'text-white' : 'border border-sage-200 bg-white text-ink/75 hover:border-copper-300'}`}
                    >
                      {on && <motion.span layoutId="offer-filter" className="absolute inset-0 rounded-full bg-forest-800" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />}
                      <span className="relative">{f.label}</span>
                    </button>
                  )
                })}
              </div>

              <motion.div layout className="mt-6 grid gap-5 md:grid-cols-2">
                <AnimatePresence mode="popLayout">
                  {list.map((o, i) => (
                    <Ticket key={o.id} o={o} i={i} />
                  ))}
                </AnimatePresence>
              </motion.div>

              <p className="mt-8 text-xs leading-6 text-ink/45">
                * العروض بتشمل الاستشارة الأولى، وبتنطبق حسب ملاءمة العلاج بعد التقييم. ما بتنجمع مع عروض تانية. التفاصيل الكاملة بالعيادة.
              </p>
            </div>
          </DemoTag>
        </div>
      </div>
    </MotionConfig>
  )
}
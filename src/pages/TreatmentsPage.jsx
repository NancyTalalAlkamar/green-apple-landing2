import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, MotionConfig, useInView } from 'framer-motion'
import { ArrowUpLeft, Clock, CalendarDays, Pause, Play } from 'lucide-react'
import { treatments } from '../data/treatments'
import { moreTreatments } from '../data/moreTreatments'
import { EASE } from '../lib/motion'
import Badge from '../components/ui/Badge'

/* ─────────────────────────────────────────────
   صفحة كل العلاجات: خريطة جسم تفاعلية.
   العناوين والصور والأرقام بتيجي من ملفات العلاجات (src/data).
   ───────────────────────────────────────────── */
const ALL = { ...treatments, ...moreTreatments }

// الهدف اللي بيكتبه الزائر + أماكن النقاط على الجسم لكل علاج
const ITEMS = [
  { slug: 'abdomen', goal: 'خصر أنحف', points: [[110, 150]] },
  { slug: 'thighs-arms', goal: 'ذراعين وفخذين مشدودين', points: [[62, 122], [158, 122], [96, 246], [124, 246]] },
  { slug: 'cellulite', goal: 'ملمس أنعم', points: [[72, 192], [148, 192]] },
  { slug: 'laser', goal: 'شعر أقل', points: [[90, 284], [130, 284], [84, 96]] },
  { slug: 'skin', goal: 'بشرة أنضر', points: [[110, 35]] },
].filter((it) => ALL[it.slug])

const STEP_MS = 4500

/* أرقام الجلسات من نص مثل "8–12 جلسة" */
function sessionRange(d) {
  const f = d.facts?.find((x) => x.icon === 'calendar')
  const nums = (f?.value || '').match(/\d+/g)?.map(Number) || []
  return { label: f?.value || '—', min: nums[0] || 0, max: nums[1] || nums[0] || 0 }
}
const durationOf = (d) => d.facts?.find((x) => x.icon === 'clock')?.value || '—'

/* ═════════ 1. خريطة الجسم ═════════ */
function BodyMap({ active, onPick }) {
  return (
    <svg viewBox="0 0 220 320" className="h-full w-auto" role="img" aria-label="خريطة الجسم">
      <defs>
        <radialGradient id="glow">
          <stop offset="0%" stopColor="#d9a06a" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#d9a06a" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* شبكة قياس خفيفة */}
      {Array.from({ length: 9 }).map((_, i) => (
        <line key={i} x1="0" x2="220" y1={20 + i * 35} y2={20 + i * 35} stroke="rgba(255,255,255,0.05)" strokeDasharray="2 6" />
      ))}
      <g fill="rgba(255,255,255,0.07)" stroke="rgba(255,255,255,0.5)" strokeWidth="1.6" strokeLinejoin="round">
        <circle cx="110" cy="35" r="21" />
        <path d="M98 58 L122 58 C124 66 132 70 146 74 C156 78 160 88 160 100 L164 150 C165 158 160 160 157 152 L150 108 C148 120 146 128 140 138 C150 156 156 172 154 190 C152 206 146 220 142 236 L136 300 C135 306 126 306 125 300 L114 214 L106 214 L95 300 C94 306 85 306 84 300 L78 236 C74 220 68 206 66 190 C64 172 70 156 80 138 C74 128 72 120 70 108 L63 152 C60 160 55 158 56 150 L60 100 C60 88 64 78 74 74 C88 70 96 66 98 58 Z" />
      </g>

      {ITEMS.map((it, i) =>
        it.points.map(([x, y], k) => {
          const on = i === active
          return (
            <g key={it.slug + k} onClick={() => onPick(i)} className="cursor-pointer">
              {on && <motion.circle cx={x} cy={y} fill="url(#glow)" initial={{ r: 0 }} animate={{ r: 26 }} transition={{ duration: 0.5 }} />}
              {on && (
                <motion.circle
                  cx={x}
                  cy={y}
                  fill="none"
                  stroke="#d9a06a"
                  strokeWidth="1.5"
                  animate={{ r: [6, 18], opacity: [0.9, 0] }}
                  transition={{ duration: 1.4, repeat: Infinity, delay: k * 0.2 }}
                />
              )}
              <motion.circle
                cx={x}
                cy={y}
                animate={{ r: on ? 6 : 4, fill: on ? '#d9a06a' : 'rgba(255,255,255,0.55)' }}
                stroke="#14291f"
                strokeWidth="2"
              />
              {/* منطقة أكبر للكبس */}
              <circle cx={x} cy={y} r="14" fill="transparent" />
            </g>
          )
        }),
      )}
    </svg>
  )
}

function Explorer() {
  const [active, setActive] = useState(0)
  const [playing, setPlaying] = useState(true)
  const ref = useRef(null)
  const inView = useInView(ref, { amount: 0.3 })

  useEffect(() => {
    if (!playing || !inView) return
    const t = setTimeout(() => setActive((a) => (a + 1) % ITEMS.length), STEP_MS)
    return () => clearTimeout(t)
  }, [active, playing, inView])

  const pick = (i) => {
    setPlaying(false)
    setActive(i)
  }
  const it = ITEMS[active]
  const d = ALL[it.slug].ar
  const s = sessionRange(d)

  return (
    <section ref={ref} className="pt-28 pb-10 sm:pt-32 sm:pb-14">
      <div className="container-page">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Badge>العلاجات</Badge>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
          className="mt-4 text-4xl leading-[1.15] font-bold text-ink sm:text-6xl"
        >
          شو <span className="text-copper-600">هدفك؟</span>
        </motion.h1>
        <p className="mt-3 max-w-xl text-base leading-8 text-ink/70 sm:text-lg">اختاري هدفك أو اكبسي على أي نقطة على الجسم، ومنفرجيكي العلاج اللي بيناسبه.</p>

        {/* الأهداف */}
        <div className="mt-6 flex flex-wrap gap-2">
          {ITEMS.map((g, i) => {
            const on = i === active
            return (
              <button
                key={g.slug}
                type="button"
                onClick={() => pick(i)}
                className={`relative overflow-hidden rounded-full px-4 py-2.5 text-sm font-semibold transition-colors ${on ? 'text-white' : 'border border-sage-200 bg-white text-ink/75 hover:border-copper-300'}`}
              >
                {on && <motion.span layoutId="goal-pill" className="absolute inset-0 rounded-full bg-forest-800" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />}
                {on && playing && inView && (
                  <motion.span
                    key={'p' + active}
                    className="absolute inset-x-0 bottom-0 h-0.5 origin-right bg-copper-300"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: STEP_MS / 1000, ease: 'linear' }}
                  />
                )}
                <span className="relative">{g.goal}</span>
              </button>
            )
          })}
          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            aria-label={playing ? 'وقّفي' : 'شغّلي'}
            className="grid size-11 place-items-center rounded-full border border-sage-200 bg-white text-ink/70 hover:border-copper-300"
          >
            {playing ? <Pause className="size-4" /> : <Play className="size-4" />}
          </button>
        </div>

        <div className="mt-8 grid overflow-hidden rounded-5xl bg-forest-900 lg:grid-cols-[0.8fr_1.2fr]">
          {/* الجسم */}
          <div className="relative flex h-[340px] items-center justify-center py-6 sm:h-[420px] lg:h-[460px]">
            <BodyMap active={active} onPick={pick} />
            <AnimatePresence mode="wait">
              <motion.span
                key={it.slug}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="absolute top-5 right-5 rounded-full bg-copper-300 px-3 py-1 text-xs font-bold text-forest-900"
              >
                {it.goal}
              </motion.span>
            </AnimatePresence>
          </div>

          {/* تفاصيل العلاج */}
          <div className="relative min-h-[420px] overflow-hidden bg-forest-800 text-white">
            <AnimatePresence mode="wait">
              <motion.div key={it.slug} className="absolute inset-0 flex flex-col sm:flex-row lg:flex-col xl:flex-row">
                <motion.div
                  initial={{ clipPath: 'inset(0 100% 0 0)' }}
                  animate={{ clipPath: 'inset(0 0% 0 0)' }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.7, ease: EASE }}
                  className="relative h-44 shrink-0 overflow-hidden sm:h-auto sm:w-2/5 lg:h-48 lg:w-auto xl:h-auto xl:w-2/5"
                >
                  <motion.img
                    src={d.heroImage}
                    alt={d.title}
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1.04 }}
                    transition={{ duration: STEP_MS / 1000 + 1, ease: 'linear' }}
                    className="size-full object-cover"
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.5, delay: 0.15, ease: EASE }}
                  className="flex flex-1 flex-col p-6 sm:p-8"
                >
                  <span className="text-xs font-semibold text-copper-300">{d.eyebrow}</span>
                  <p className="mt-2 text-3xl font-bold sm:text-4xl">{d.title}</p>
                  <p className="mt-1 text-lg font-semibold text-copper-300">{d.accent}</p>
                  <p className="mt-3 line-clamp-3 leading-7 text-white/70">{d.lead}</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold">
                      <CalendarDays className="size-3.5 text-copper-300" /> {s.label}
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold">
                      <Clock className="size-3.5 text-copper-300" /> {durationOf(d)}
                    </span>
                  </div>
                  <a
                    href={`/treatments/${it.slug}`}
                    className="group mt-auto inline-flex h-12 items-center gap-3 self-start rounded-full bg-copper-300 ps-6 pe-1.5 pt-0 font-bold text-forest-900 transition hover:bg-white max-sm:mt-6"
                  >
                    شوفي التفاصيل
                    <span className="grid size-9 place-items-center rounded-full bg-forest-900 text-copper-300 transition-transform group-hover:-rotate-45">
                      <ArrowUpLeft className="size-4" />
                    </span>
                  </a>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ═════════ 2. كل العلاجات بلمحة ═════════ */
function Glance() {
  const maxSessions = Math.max(...ITEMS.map((it) => sessionRange(ALL[it.slug].ar).max), 1)
  return (
    <section className="pb-10 sm:pb-14">
      <div className="container-page">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 className="text-3xl font-bold text-ink sm:text-4xl">
            كل العلاجات <span className="text-copper-600">بلمحة</span>
          </h2>
          <p className="text-sm text-ink/50">عدد الجلسات تقريبي، والخطة بتتحدد بالاستشارة.</p>
        </div>
        <ul className="mt-6 overflow-hidden rounded-4xl border border-sage-200 bg-white">
          {ITEMS.map((it, i) => {
            const d = ALL[it.slug].ar
            const s = sessionRange(d)
            return (
              <motion.li
                key={it.slug}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.5, delay: i * 0.06, ease: EASE }}
                className="border-b border-sage-200 last:border-b-0"
              >
                <a href={`/treatments/${it.slug}`} className="group grid grid-cols-[auto_1fr_auto] items-center gap-4 px-4 py-4 transition-colors hover:bg-sand-50 sm:grid-cols-[auto_1.1fr_1.4fr_auto_auto] sm:px-6">
                  <span className="size-12 overflow-hidden rounded-2xl">
                    <img src={d.heroImage} alt="" loading="lazy" className="size-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-bold text-ink">{d.title}</span>
                    <span className="block truncate text-xs text-ink/50">{it.goal}</span>
                  </span>
                  {/* شريط الجلسات */}
                  <span className="hidden items-center gap-3 sm:flex">
                    <span className="relative h-2.5 flex-1 overflow-hidden rounded-full bg-sand-100">
                      {s.max > 0 && (
                        <motion.span
                          initial={{ scaleX: 0 }}
                          whileInView={{ scaleX: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: 0.2 + i * 0.08, ease: EASE }}
                          className="absolute inset-y-0 right-0 origin-right rounded-full bg-copper-300"
                          style={{ width: `${(s.max / maxSessions) * 100}%` }}
                        >
                          <span className="absolute inset-y-0 left-0 rounded-full bg-copper-600" style={{ width: `${s.max ? ((s.max - s.min) / s.max) * 100 : 0}%`, opacity: 0.35 }} />
                        </motion.span>
                      )}
                    </span>
                    <span className="w-24 shrink-0 text-xs font-semibold text-ink/70">{s.label}</span>
                  </span>
                  <span className="hidden text-xs text-ink/55 sm:block">{durationOf(d)}</span>
                  <span className="grid size-9 place-items-center rounded-full border border-sage-200 text-ink transition group-hover:-rotate-45 group-hover:border-copper-600 group-hover:bg-copper-600 group-hover:text-white">
                    <ArrowUpLeft className="size-4" />
                  </span>
                </a>
              </motion.li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

/* ═════════ 3. مش متأكدة؟ ═════════ */
function NotSure() {
  return (
    <section className="pb-16 sm:pb-20">
      <div className="container-page">
        <div className="relative flex flex-col gap-6 overflow-hidden rounded-5xl bg-forest-900 px-6 py-10 text-white sm:flex-row sm:items-center sm:justify-between sm:px-12">
          <div className="pointer-events-none absolute -top-40 size-[420px] rounded-full bg-[radial-gradient(circle,rgba(217,160,106,0.3),transparent_65%)] ltr:-left-40 rtl:-right-40" />
          <div className="relative">
            <p className="text-3xl font-bold sm:text-4xl">
              مش متأكدة <span className="text-copper-300">شو بيناسبك؟</span>
            </p>
            <p className="mt-2 max-w-md text-white/70">بالاستشارة منقيس، منسمعك، ومنختار معك العلاج والخطة.</p>
          </div>
          <motion.a
            href="/contact"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="group relative inline-flex h-14 shrink-0 items-center gap-3 self-start rounded-full bg-copper-300 ps-7 pe-1.5 font-bold text-forest-900 sm:self-auto"
          >
            احجزي استشارة
            <span className="grid size-11 place-items-center rounded-full bg-forest-900 text-copper-300 transition-transform group-hover:-rotate-45">
              <ArrowUpLeft className="size-4" />
            </span>
          </motion.a>
        </div>
      </div>
    </section>
  )
}

export default function TreatmentsPage() {
  return (
    <MotionConfig reducedMotion="never">
      <div dir="rtl" className="bg-sand-50">
        <Explorer />
        <Glance />
        <NotSure />
      </div>
    </MotionConfig>
  )
}
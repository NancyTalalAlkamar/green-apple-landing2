import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, MotionConfig, useInView, animate } from 'framer-motion'
import { ArrowUpLeft, CalendarDays, Clock, Quote, ScanLine, ShieldCheck, MessageCircle, Plus, Sparkles } from 'lucide-react'
import { WHATSAPP_URL } from '../data/content'
import { EASE } from '../lib/motion'
import Badge from '../components/ui/Badge'
import DemoTag from '../components/DemoTag'
import BeforeAfter from '../components/BeforeAfter'

/* ─────────────────────────────────────────────
   صفحة النتائج — كل الحالات هون تجريبية.
   بتتبدّل بحالات حقيقية (بموافقة مكتوبة) من لوحة التحكم.
   ───────────────────────────────────────────── */
const FILTERS = [
  { id: 'all', label: 'أي هدف' },
  { id: 'abdomen', label: 'البطن والخصر' },
  { id: 'thighs', label: 'الفخذين والذراعين' },
  { id: 'cellulite', label: 'السيلوليت' },
]

const AGES = [
  { id: 'all', label: 'أي عمر' },
  { id: 25, label: 'العشرينات' },
  { id: 35, label: 'التلاتينات' },
  { id: 45, label: 'الأربعين وفوق' },
]

const FAQS = [
  { q: 'إمتى ببلّش أشوف فرق؟', a: 'كل جسم غير، بس عادةً بتبيّن أول فروقات بالقياسات بعد أول مسحين. لهيك منقيس كل فترة، عشان تشوفي التقدّم بالأرقام.' },
  { q: 'النتيجة بتضل؟', a: 'الحفاظ على النتيجة بيعتمد على نمط الحياة بعد البرنامج. بآخر الخطة منعطيكي توصيات، ومنقدر نعمل جلسات متابعة.' },
  { q: 'ليش النتائج بتختلف من وحدة لوحدة؟', a: 'بتأثّر نقطة البداية، والعمر، ونوع البشرة، والالتزام بالخطة. هيك منبني خطة لكل وحدة بعد الاستشارة، ومش برنامج واحد للكل.' },
]

const CASES = [
  {
    id: 1,
    cat: 'abdomen',
    title: 'برنامج تنحيف',
    who: 'م.ع · 34 سنة',
    age: 34,
    months: '6 أشهر',
    sessions: '12 جلسة',
    metrics: [
      { label: 'الخصر', before: 92, after: 80 },
      { label: 'البطن', before: 101, after: 88 },
      { label: 'الأرداف', before: 110, after: 101 },
    ],
    scans: [92, 89, 86, 84, 82, 80],
    quote: 'أول مرة بشوف تقدّمي بالأرقام، مش بس بالمراية.',
  },
  {
    id: 2,
    cat: 'thighs',
    title: 'شد الفخذين والذراعين',
    who: 'ر.ح · 41 سنة',
    age: 41,
    months: '4 أشهر',
    sessions: '10 جلسات',
    metrics: [
      { label: 'الفخذ', before: 64, after: 58 },
      { label: 'الذراع', before: 33, after: 30 },
      { label: 'الأرداف', before: 106, after: 100 },
    ],
    scans: [64, 62, 61, 59, 58],
    quote: 'الخطة كانت واضحة من أول يوم، وعرفت شو بستنّى.',
  },
  {
    id: 3,
    cat: 'abdomen',
    title: 'نحت البطن',
    who: 'س.ك · 29 سنة',
    age: 29,
    months: '3 أشهر',
    sessions: '8 جلسات',
    metrics: [
      { label: 'الخصر', before: 78, after: 72 },
      { label: 'البطن', before: 86, after: 79 },
      { label: 'الأرداف', before: 98, after: 95 },
    ],
    scans: [78, 76, 74, 72],
    quote: 'حسّيت إنو في حدا متابع معي كل أسبوع.',
  },
  {
    id: 4,
    cat: 'cellulite',
    title: 'السيلوليت والترهل',
    who: 'ه.م · 37 سنة',
    age: 37,
    months: '3 أشهر',
    sessions: '9 جلسات',
    metrics: [
      { label: 'الفخذ', before: 61, after: 57 },
      { label: 'الأرداف', before: 104, after: 99 },
      { label: 'الخصر', before: 84, after: 81 },
    ],
    scans: [61, 60, 58, 57],
    quote: 'الملمس تغيّر، وصرت أرتاح بلبسي أكتر.',
  },
]

/* رقم بيعدّ */
function Count({ to, prefix = '', suffix = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const [v, setV] = useState(0)
  useEffect(() => {
    if (!inView) return
    const c = animate(0, to, { duration: 1.2, ease: EASE, onUpdate: (x) => setV(Math.round(x)) })
    return () => c.stop()
  }, [inView, to])
  return (
    <span ref={ref} dir="ltr">
      {prefix}
      {v}
      {suffix}
    </span>
  )
}

/* ═════════ عارض الحالة ═════════ */
function CaseViewer({ c }) {
  return (
    <div className="grid overflow-hidden rounded-5xl bg-white ring-1 ring-sage-200 lg:grid-cols-[1.05fr_1fr]">
      <div className="relative min-h-[380px] p-3 sm:min-h-[440px]">
        <BeforeAfter caseKey={c.id} afterLabel={`بعد · ${c.months}`} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={c.id}
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 24 }}
          transition={{ duration: 0.45, ease: EASE }}
          className="flex flex-col p-6 sm:p-9"
        >
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-gold-600">{c.who}</span>
            {/* علامات ثقة */}
            <span className="inline-flex items-center gap-1 rounded-full bg-forest-800/5 px-2 py-0.5 text-[11px] font-semibold text-forest-800">
              <ShieldCheck className="size-3" /> بموافقة موقّعة
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-forest-800/5 px-2 py-0.5 text-[11px] font-semibold text-forest-800">
              <ScanLine className="size-3" /> مقاس بالمسح 3D
            </span>
          </div>
          <p className="mt-2 text-3xl font-bold text-ink">{c.title}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-sand-100 px-3 py-1.5 text-xs font-semibold text-ink/75">
              <Clock className="size-3.5 text-gold-600" /> {c.months}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-sand-100 px-3 py-1.5 text-xs font-semibold text-ink/75">
              <CalendarDays className="size-3.5 text-gold-600" /> {c.sessions}
            </span>
          </div>

          {/* القياسات: الشريط بيقصر من "قبل" لـ "بعد" */}
          <div className="mt-6 space-y-4">
            {c.metrics.map((m, i) => {
              const max = Math.max(...c.metrics.map((x) => x.before))
              return (
                <div key={m.label}>
                  <div className="flex items-baseline justify-between text-sm">
                    <span className="font-semibold text-ink">{m.label}</span>
                    <span className="font-bold text-gold-600">
                      <Count to={m.before - m.after} prefix="−" suffix=" cm" />
                    </span>
                  </div>
                  <div className="relative mt-1.5 h-3 overflow-hidden rounded-full bg-sand-100">
                    <div className="absolute inset-y-0 right-0 rounded-full bg-sage-200" style={{ width: `${(m.before / max) * 100}%` }} />
                    <motion.div
                      initial={{ width: `${(m.before / max) * 100}%` }}
                      animate={{ width: `${(m.after / max) * 100}%` }}
                      transition={{ duration: 1.2, delay: 0.3 + i * 0.12, ease: EASE }}
                      className="absolute inset-y-0 right-0 rounded-full bg-copper-600"
                    />
                  </div>
                  <div className="mt-1 flex justify-between text-[11px] text-ink/45" dir="ltr">
                    <span>{m.after} cm</span>
                    <span>{m.before} cm</span>
                  </div>
                </div>
              )
            })}
          </div>

          <p className="mt-6 flex items-start gap-3 border-t border-sage-200 pt-5 text-[15px] leading-7 text-ink/75">
            <Quote className="mt-1 size-4 shrink-0 text-gold-600" />
            {c.quote}
          </p>

          {/* من الإعجاب للحجز بكبسة */}
          <a
            href={`${WHATSAPP_URL}?text=${encodeURIComponent(`مرحبا، شفت حالة "${c.title} · ${c.months}" على الموقع، وبدي أعرف إذا خطة زي هاي بتناسبني`)}`}
            target="_blank"
            rel="noreferrer"
            className="group mt-5 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-forest-800 px-6 text-sm font-bold text-white transition hover:bg-forest-700"
          >
            <MessageCircle className="size-4 text-copper-300" />
            بدي خطة زي هاي
          </a>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

/* ═════════ رحلة القياس: كل مسح بنقطة ═════════ */
function ScanJourney({ c }) {
  const [step, setStep] = useState(0)
  const ref = useRef(null)
  const inView = useInView(ref, { amount: 0.5 })
  const n = c.scans.length

  useEffect(() => setStep(0), [c.id])
  useEffect(() => {
    if (!inView) return
    const t = setInterval(() => setStep((s) => (s + 1) % n), 1400)
    return () => clearInterval(t)
  }, [inView, n])

  const max = Math.max(...c.scans)
  const min = Math.min(...c.scans) - 4
  const W = 600
  const H = 160
  const x = (i) => 30 + (i / (n - 1)) * (W - 60)
  const y = (v) => 20 + ((max - v) / (max - min)) * (H - 40)
  const path = c.scans.map((v, i) => `${i ? 'L' : 'M'}${x(i)} ${y(v)}`).join(' ')

  return (
    <div ref={ref} className="mt-6 grid items-center gap-6 rounded-5xl bg-forest-900 p-6 text-white sm:p-9 lg:grid-cols-[auto_1fr] lg:gap-12">
      <div>
        <p className="flex items-center gap-2 text-sm font-semibold text-copper-300">
          <ScanLine className="size-4" /> القياس مع كل مسح
        </p>
        <AnimatePresence mode="wait">
          <motion.p
            key={c.id + '-' + step}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="mt-3 text-6xl font-bold tabular-nums"
            dir="ltr"
          >
            {c.scans[step]}
            <span className="text-2xl text-white/50"> cm</span>
          </motion.p>
        </AnimatePresence>
        <p className="mt-2 text-sm text-white/60">
          {c.metrics[0].label} · {step === 0 ? 'أول مسح' : `المسح رقم ${step + 1}`}
        </p>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" dir="ltr">
        {[0, 1, 2].map((g) => (
          <line key={g} x1="20" x2={W - 20} y1={20 + g * 60} y2={20 + g * 60} stroke="rgba(255,255,255,0.07)" strokeDasharray="3 7" />
        ))}
        <motion.path
          key={c.id}
          d={path}
          fill="none"
          stroke="#e8d3c6"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.2, ease: EASE }}
        />
        {c.scans.map((v, i) => (
          <g key={c.id + '-' + i} onClick={() => setStep(i)} className="cursor-pointer">
            <circle cx={x(i)} cy={y(v)} r="16" fill="transparent" />
            <motion.circle
              cx={x(i)}
              cy={y(v)}
              animate={{ r: i === step ? 9 : 5, fill: i <= step ? '#e8d3c6' : '#34302d' }}
              stroke="#e8d3c6"
              strokeWidth="2"
            />
            <text x={x(i)} y={H - 2} textAnchor="middle" style={{ fontSize: 12, fill: 'rgba(255,255,255,0.45)' }}>
              {i === 0 ? 'Start' : `#${i + 1}`}
            </text>
          </g>
        ))}
      </svg>
    </div>
  )
}

function ChipGroup({ items, value, onChange, layoutId }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((f) => {
        const on = f.id === value
        return (
          <button
            key={f.id}
            type="button"
            onClick={() => onChange(f.id)}
            className={`relative rounded-full px-3.5 py-2 text-sm font-semibold transition-colors ${on ? 'text-white' : 'bg-sand-50 text-ink/75 hover:bg-sand-100'}`}
          >
            {on && <motion.span layoutId={layoutId} className="absolute inset-0 rounded-full bg-forest-800" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />}
            <span className="relative">{f.label}</span>
          </button>
        )
      })}
    </div>
  )
}

/* ═════════ أسئلة عن النتائج ═════════ */
function ResultsFaq() {
  const [open, setOpen] = useState(0)
  return (
    <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-12">
      <h2 className="text-3xl leading-tight font-bold text-ink sm:text-4xl">
        أسئلة <span className="text-gold-600">عن النتائج</span>
      </h2>
      <div className="space-y-2.5">
        {FAQS.map((f, i) => {
          const on = open === i
          return (
            <div key={f.q} className={`overflow-hidden rounded-3xl border transition-colors ${on ? 'border-copper-300 bg-white' : 'border-sage-200 bg-white/60'}`}>
              <button type="button" onClick={() => setOpen(on ? -1 : i)} className="flex w-full items-center justify-between gap-4 px-5 py-4 text-start font-semibold text-ink">
                {f.q}
                <motion.span animate={{ rotate: on ? 45 : 0 }} className={`grid size-8 shrink-0 place-items-center rounded-full ${on ? 'bg-forest-800 text-copper-300' : 'bg-sand-100 text-ink/60'}`}>
                  <Plus className="size-4" />
                </motion.span>
              </button>
              <AnimatePresence initial={false}>
                {on && (
                  <motion.p
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: EASE }}
                    className="px-5 pb-5 text-[15px] leading-7 text-ink/65"
                  >
                    {f.a}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function ResultsPage() {
  const [filter, setFilter] = useState('all')
  const [age, setAge] = useState('all')
  // منفلتر حسب الهدف، ومنرتّب حسب الأقرب للعمر
  const list = CASES.filter((c) => filter === 'all' || c.cat === filter).sort((a, b) =>
    age === 'all' ? 0 : Math.abs(a.age - age) - Math.abs(b.age - age),
  )
  const closest = age !== 'all' || filter !== 'all' ? list[0]?.id : null
  const [activeId, setActiveId] = useState(CASES[0].id)
  useEffect(() => {
    if (closest) setActiveId(closest)
  }, [closest])
  const active = list.find((c) => c.id === activeId) || list[0]

  return (
    <MotionConfig reducedMotion="never">
      <div dir="rtl" className="bg-sand-50 pt-28 pb-16 sm:pt-32 sm:pb-20">
        <div className="container-page">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <Badge>النتائج</Badge>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
            className="mt-4 text-4xl leading-[1.15] font-bold text-ink sm:text-6xl"
          >
            نتائج <span className="text-gold-600">بتنقاس</span>
          </motion.h1>
          <p className="mt-3 max-w-xl text-base leading-8 text-ink/70 sm:text-lg">اسحبي الخط بالنص لتقارني قبل وبعد، واختاري حالة لتشوفي قياساتها.</p>
        </div>

        <div className="mt-8">
          <DemoTag>
            <div className="container-page pt-4">
              {/* لاقي حالة زيّك: هدف + عمر */}
              <div className="flex flex-col gap-4 rounded-4xl border border-sage-200 bg-white p-4 sm:p-5 lg:flex-row lg:items-center lg:gap-8">
                <p className="flex shrink-0 items-center gap-2 font-bold text-ink">
                  <Sparkles className="size-4 text-gold-600" /> لاقي حالة زيّك
                </p>
                <ChipGroup items={FILTERS} value={filter} onChange={setFilter} layoutId="res-goal" />
                <span className="hidden h-8 w-px bg-sage-200 lg:block" />
                <ChipGroup items={AGES} value={age} onChange={setAge} layoutId="res-age" />
              </div>

              <div className="mt-4 flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
                {list.map((c, i) => {
                  const on = c.id === active.id
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setActiveId(c.id)}
                      className={`flex shrink-0 items-center gap-3 rounded-2xl border px-4 py-2.5 text-start transition-colors ${on ? 'border-copper-600 bg-white' : 'border-sage-200 bg-white/60 hover:bg-white'}`}
                    >
                      <span className={`grid size-8 place-items-center rounded-full text-xs font-bold ${on ? 'bg-copper-600 text-white' : 'bg-sand-100 text-ink/60'}`}>{i + 1}</span>
                      <span>
                        <span className="block text-sm font-bold text-ink">{c.title}</span>
                        <span className="block text-[11px] text-ink/50">
                          {c.months} · {c.age} سنة
                        </span>
                      </span>
                      {c.id === closest && (
                        <span className="rounded-full bg-copper-300 px-2 py-0.5 text-[10px] font-bold text-forest-900">الأقرب إلك</span>
                      )}
                    </button>
                  )
                })}
              </div>

              <div className="mt-5">
                <CaseViewer c={active} />
                <ScanJourney c={active} />
              </div>

              <p className="mt-6 text-xs leading-6 text-ink/45">* النتائج بتختلف من وحدة لوحدة حسب الجسم والالتزام بالخطة. ما منعرض أي صورة إلا بموافقة مكتوبة من صاحبتها.</p>
            </div>
          </DemoTag>

          <div className="container-page mt-10">
            <ResultsFaq />
          </div>

          <div className="container-page mt-6">
            <div className="relative flex flex-col gap-6 overflow-hidden rounded-5xl bg-forest-800 px-6 py-10 text-white sm:flex-row sm:items-center sm:justify-between sm:px-12">
              <p className="text-3xl font-bold sm:text-4xl">
                بدك تبلّشي <span className="text-copper-300">قصتك؟</span>
              </p>
              <motion.a
                href="/contact"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="group inline-flex h-14 shrink-0 items-center gap-3 self-start rounded-full bg-copper-300 ps-7 pe-1.5 font-bold text-forest-900 sm:self-auto"
              >
                احجزي استشارة
                <span className="grid size-11 place-items-center rounded-full bg-forest-900 text-copper-300 transition-transform group-hover:-rotate-45">
                  <ArrowUpLeft className="size-4" />
                </span>
              </motion.a>
            </div>
          </div>
        </div>
      </div>
    </MotionConfig>
  )
}
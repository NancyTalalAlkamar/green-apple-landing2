import { useRef, useState } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { results as originalResults } from '../data/content'
import { useLanguage } from '../context/LanguageContext'
import { EASE, slideFromStart, slideFromEnd, fadeUp } from '../lib/motion'
import Reveal from '../components/ui/Reveal'
import SectionHeading from '../components/ui/SectionHeading'
import Button from '../components/ui/Button'
import BeforeAfter from '../components/BeforeAfter'

// قاموس الترجمة الإنجليزية لهذا القسم
const enResults = {
  badge: 'Real Results',
  title: 'Results That Change',
  accent: 'Your Body Relationship',
  tabs: ['Body Sculpting', 'Slimming'],
  all: 'All Results',
  legend: {
    start: 'Start',
    end: 'End',
  },
  cases: [
    {
      id: 1,
      program: 'Slimming Program',
      phase: 'Phase 1',
      duration: '6 Months',
      meta: 'Phase 1 · [6 Months]',
      metrics: [
        { label: 'Waist', value: '-20 cm', start: 0.2 },
        { label: 'Abdomen', value: '-30 cm', start: 0.3 },
        { label: 'Hips', value: '-40 cm', start: 0.4 },
      ],
    },
    {
      id: 2,
      program: 'Slimming Program',
      phase: 'Phase 2',
      duration: '9 Months',
      meta: 'Phase 2 · [9 Months]',
      metrics: [
        { label: 'Waist', value: '-15 cm', start: 0.2 },
        { label: 'Abdomen', value: '-25 cm', start: 0.3 },
        { label: 'Hips', value: '-35 cm', start: 0.4 },
      ],
    },
    {
      id: 3,
      program: 'Slimming Program',
      phase: 'Phase 1',
      duration: '4 Months',
      meta: 'Phase 1 · [4 Months]',
      metrics: [
        { label: 'Waist', value: '-12 cm', start: 0.2 },
        { label: 'Abdomen', value: '-18 cm', start: 0.3 },
        { label: 'Hips', value: '-25 cm', start: 0.4 },
      ],
    },
  ],
  testimonial: {
    quote: 'I was hesitant at first because I tried many things before, but here I felt the difference from the first session. They took the time to understand what I want, explained every step clearly, and now I know where I am and where I am going.',
    name: 'Nancy Talal Abo Alkamar',
    meta: 'Palestine - 25 years old',
    avatar: '/images/avatar.webp',
  },
  ctaBtn: 'Book Consultation',
}

function Tabs({ tabs, active, onChange }) {
  return (
    <div className="inline-flex flex-row items-center rounded-full bg-sage-100 p-1">
      {tabs.map((t, i) => (
        <button
          key={t}
          onClick={() => onChange(i)}
          className="relative whitespace-nowrap rounded-full px-6 py-2.5 text-sm font-medium text-ink transition-all"
        >
          {active === i && (
            <motion.span
              layoutId="results-tab"
              className="absolute inset-0 rounded-full bg-white shadow-sm"
              transition={{ type: 'spring', stiffness: 400, damping: 32 }}
            />
          )}
          <span className="relative z-10">{t}</span>
        </button>
      ))}
    </div>
  )
}

function MetricBar({ label, value, start, isEn }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  return (
    <div ref={ref} className={`grid ${isEn ? 'grid-cols-[5rem_1fr_4rem]' : 'grid-cols-[4.5rem_1fr_4rem]'} items-center gap-4 text-sm`}>
      <span className="text-ink/80">{label}</span>
      <div className="relative h-1.5 overflow-hidden rounded-full bg-sage-200">
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: inView ? 1 : 0 }}
          transition={{ duration: 1.2, ease: EASE, delay: 0.3 }}
          style={{ width: `${(1 - start) * 100}%` }}
          className={`absolute inset-y-0 ${isEn ? 'left-0 origin-left' : 'right-0 origin-right'} rounded-full bg-copper-600`}
        />
      </div>
      <span className="text-left font-semibold text-copper-600" dir="ltr">
        {value}
      </span>
    </div>
  )
}

export default function Results() {
  const { lang } = useLanguage()
  const isEn = lang === 'en'

  const [tab, setTab] = useState(0)
  const [active, setActive] = useState(0)

  const resultsData = isEn ? enResults : originalResults
  const current = resultsData.cases[active] || resultsData.cases[0]
  const { testimonial } = resultsData

  const ChevronIcon = isEn ? ChevronRight : ChevronLeft

  return (
    <section id="results" className="pb-20 sm:pb-24" dir={isEn ? 'ltr' : 'rtl'}>
      <div className="container-page">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading badge={resultsData.badge} title={resultsData.title} accent={resultsData.accent} />
          <Reveal>
            <Tabs tabs={resultsData.tabs} active={tab} onChange={setTab} />
          </Reveal>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
          {/* Comparison visual */}
          <Reveal variants={slideFromStart} className="min-h-[420px] lg:min-h-[500px]">
            <BeforeAfter caseKey={`${tab}-${active}`} afterLabel={isEn ? `After · [${current.duration}]` : `بعد · [${current.duration}]`} />
          </Reveal>

          {/* Metrics + testimonial */}
          <Reveal stagger gap={0.15} className="flex flex-col gap-4">
            <Reveal.Item variants={slideFromEnd} className="rounded-4xl bg-sage-50 p-6">
              <div className="flex items-baseline justify-between">
                <h3 className="text-lg font-semibold">{current.program}</h3>
                <span className="text-xs text-copper-600">{current.phase}</span>
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${tab}-${active}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.35 }}
                  className="mt-5 space-y-4"
                >
                  {current.metrics.map((m) => (
                    <MetricBar key={m.label} {...m} isEn={isEn} />
                  ))}
                </motion.div>
              </AnimatePresence>
              <div className="mt-5 flex items-center gap-5 text-xs text-ink/70">
                <span className="flex items-center gap-1.5">
                  <span className="size-2 rounded-sm bg-sage-200" /> {resultsData.legend.start}
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="size-2 rounded-sm bg-copper-600" /> {resultsData.legend.end}
                </span>
              </div>
            </Reveal.Item>

            <Reveal.Item
              variants={slideFromEnd}
              className="flex flex-1 flex-col justify-between gap-6 rounded-4xl bg-sand-100 p-6"
            >
              <p className="text-sm leading-7 text-ink/85">{testimonial.quote}</p>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img src={testimonial.avatar} alt="" className="size-10 rounded-full" />
                  <div>
                    <p className="text-sm font-medium">{testimonial.name}</p>
                    <p className="text-xs text-forest-600">{testimonial.meta}</p>
                  </div>
                </div>
                <Button href="#cta" size="sm">
                  {resultsData.ctaBtn || (isEn ? 'Book Consultation' : 'احجزي استشارتك')}
                </Button>
              </div>
            </Reveal.Item>
          </Reveal>
        </div>

        {/* Case selector */}
        <Reveal stagger gap={0.1} className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="grid gap-3 sm:grid-cols-3 lg:w-[78%]">
            {resultsData.cases.map((c, i) => (
              <Reveal.Item
                as="button"
                key={c.id}
                variants={fadeUp}
                onClick={() => setActive(i)}
                className={`flex items-center gap-3 rounded-2xl border bg-white p-3 ${isEn ? 'text-left' : 'text-right'} transition-all duration-300 ${
                  active === i ? 'border-forest-800 shadow-md' : 'border-sage-200 hover:border-forest-600/40'
                }`}
              >
                <span className="flex h-11 w-12 overflow-hidden rounded-lg">
                  <span className="w-1/2 bg-sand-200" />
                  <span className="w-1/2 bg-sand-100" />
                </span>
                <span>
                  <span className="block text-sm font-semibold">{c.program}</span>
                  <span className="block text-xs text-copper-600">{c.meta}</span>
                </span>
              </Reveal.Item>
            ))}
          </div>
          <Reveal.Item>
            <Button href="#results" variant="outline" size="md" icon={ChevronIcon}>
              {resultsData.all}
            </Button>
          </Reveal.Item>
        </Reveal>
      </div>
    </section>
  )
}
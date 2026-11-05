import { useRef } from 'react'
import { motion, useScroll, useSpring, useTransform } from 'framer-motion'
import { journey as originalJourney } from '../data/content'
import { useLanguage } from '../context/LanguageContext'
import { fadeUp, scaleIn } from '../lib/motion'
import Reveal from '../components/ui/Reveal'

// قاموس الترجمة الإنجليزية لهذا القسم
const enJourney = {
  title: 'The Green Apple Way',
  subtitle: 'A clear journey from the very first meeting',
  steps: [
    {
      title: 'Understand Your Goal',
      text: 'We listen to what you truly want and why your body matters to you.',
    },
    {
      title: 'Assessment & Baseline',
      text: 'We record your starting point to measure your progress.',
    },
    {
      title: 'Personalized Plan',
      text: 'A program built on your goal and evaluation results.',
    },
    {
      title: 'Sessions',
      text: 'Regular treatment according to your customized plan.',
    },
    {
      title: 'Progress Tracking',
      text: 'Periodic reviews and plan adjustments whenever needed.',
    },
  ],
}

export default function Journey() {
  const { lang } = useLanguage()
  const isEn = lang === 'en'

  const journeyData = isEn ? enJourney : originalJourney

  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'center 0.45'] })
  const line = useSpring(scrollYProgress, { stiffness: 80, damping: 20 })
  const glowY = useTransform(scrollYProgress, [0, 1], [-40, 40])

  return (
    <section id="journey" ref={ref} className="pb-20 sm:pb-24">
      <div className="container-page">
        <Reveal
          variants={scaleIn}
          amount={0.15}
          className="relative overflow-hidden rounded-5xl bg-forest-800 px-6 py-12 sm:px-10 lg:px-14 lg:py-14"
        >
          <motion.div
            aria-hidden
            style={{ y: glowY }}
            className={`pointer-events-none absolute -top-24 size-[420px] rounded-full bg-copper-500/45 blur-[100px] ${
              isEn ? '-left-24' : '-right-24'
            }`}
          />

          <div className={`relative ${isEn ? 'text-left' : 'text-right'}`}>
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              {journeyData.title}
            </h2>
            <div className={`mt-3 flex items-center gap-3 text-sm text-copper-300 ${isEn ? 'justify-start' : 'justify-end'}`}>
              <span className="h-px w-8 bg-copper-300" />
              <span>{journeyData.subtitle}</span>
            </div>
          </div>

          {/* Desktop timeline line */}
          <div className="relative mt-12 hidden lg:block">
            <div className="absolute top-6 right-[10%] left-[10%] h-px bg-white/15">
              <motion.div
                style={{ scaleX: line }}
                className={`h-full ${isEn ? 'origin-left' : 'origin-right'} bg-copper-300`}
              />
            </div>
          </div>

          <div className="relative mt-10 grid gap-4 sm:grid-cols-2 lg:mt-12 lg:grid-cols-5 items-stretch">
            {journeyData.steps.map((s, i) => (
              <div
                key={s.title}
                className={`flex flex-col items-start lg:items-center ${isEn ? 'lg:text-left' : 'lg:text-right'}`}
              >
                <span className="relative z-10 grid size-12 shrink-0 place-items-center rounded-full bg-copper-300 font-semibold text-forest-900 ring-8 ring-forest-800">
                  {i + 1}
                </span>
                <div
                  className={`w-full h-full flex flex-col justify-start rounded-2xl border border-white/12 bg-white/5 p-5 backdrop-blur-sm lg:mt-6 ${
                    isEn ? 'text-left' : 'text-right'
                  }`}
                >
                  <h3 className="text-lg font-semibold text-white">{s.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-white/70">{s.text}</p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
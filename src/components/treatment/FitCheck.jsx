import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, X, RotateCcw, MessageCircle, ShieldCheck } from 'lucide-react'
import { EASE } from '../../lib/motion'
import SectionHeading from '../ui/SectionHeading'
import Button from '../ui/Button'

function Ring({ value, total, label }) {
  const r = 46
  const c = 2 * Math.PI * r
  return (
    <div className="relative size-28 shrink-0">
      <svg viewBox="0 0 110 110" className="size-full -rotate-90">
        <circle cx="55" cy="55" r={r} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="9" />
        <motion.circle
          cx="55"
          cy="55"
          r={r}
          fill="none"
          stroke="#e8d3c6"
          strokeWidth="9"
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c - (value / total) * c }}
          transition={{ duration: 1, delay: 0.3, ease: EASE }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <span className="block text-2xl font-bold text-white tabular-nums" dir="ltr">
            {value}/{total}
          </span>
          <span className="text-[11px] text-white/60">{label}</span>
        </div>
      </div>
    </div>
  )
}

const card = {
  enter: { opacity: 0, y: 30, scale: 0.94 },
  center: { opacity: 1, y: 0, scale: 1, rotate: 0, x: 0 },
  exit: (dir) => ({ opacity: 0, x: dir * 280, rotate: dir * 10, transition: { duration: 0.45, ease: EASE } }),
}

export default function FitCheck({ f, waUrl, isEn }) {
  const total = f.yes.length
  const [step, setStep] = useState(0) // 0..total-1 أسئلة، total = سؤال الموانع، total+1 = النتيجة
  const [answers, setAnswers] = useState([]) // true / false لكل سؤال
  const [flags, setFlags] = useState([])
  const [dir, setDir] = useState(1)
  const side = isEn ? 1 : -1

  const yesCount = answers.filter(Boolean).length
  const state = flags.length ? 'flag' : yesCount === 0 ? 'maybe' : yesCount >= 3 ? 'good' : 'maybe'
  const res = f.results[state]
  const done = step > total

  const answer = (val) => {
    setDir(val ? side : -side)
    setAnswers((a) => [...a.slice(0, step), val])
    setStep((s) => s + 1)
  }
  const finish = (clear) => {
    if (clear) setFlags([])
    setDir(side)
    setStep(total + 1)
  }
  const reset = () => {
    setDir(-side)
    setAnswers([])
    setFlags([])
    setStep(0)
  }

  return (
    <section id="fit" className="scroll-mt-40 pb-20 sm:pb-28">
      <div className="container-page">
        <div className="relative overflow-hidden rounded-5xl bg-sage-50 px-5 py-12 sm:px-10 lg:px-14 lg:py-16">
          <div className="pointer-events-none absolute -bottom-32 size-96 rounded-full bg-copper-300/30 blur-3xl ltr:-right-24 rtl:-left-24" />

          <div className="relative grid items-center gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
            <div>
              <SectionHeading badge={f.badge} title={f.title} accent={f.accent} />
              <p className="mt-4 max-w-md text-base leading-8 text-ink/70">{f.intro}</p>

              {/* ملخّص الإجابات */}
              <ul className="mt-8 hidden space-y-2 lg:block">
                {f.yes.map((q, i) => {
                  const a = answers[i]
                  return (
                    <li key={q} className={`flex items-start gap-3 text-sm leading-6 transition-opacity ${i < step ? 'opacity-100' : 'opacity-35'}`}>
                      <span
                        className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded-full ${
                          a === true ? 'bg-forest-800 text-white' : a === false ? 'bg-sage-200 text-ink/60' : 'border border-sage-200'
                        }`}
                      >
                        {a === true && <Check className="size-3" />}
                        {a === false && <X className="size-3" />}
                      </span>
                      <span className="text-ink/80">{q}</span>
                    </li>
                  )
                })}
              </ul>

              <p className="mt-8 flex items-start gap-2 text-xs leading-6 text-ink/55">
                <ShieldCheck className="mt-0.5 size-4 shrink-0 text-gold-600" />
                {f.disclaimer}
              </p>
            </div>

            {/* مجموعة البطاقات */}
            <div className="relative mx-auto h-[400px] w-full max-w-[460px]">
              {!done && (
                <>
                  <div className="absolute inset-0 translate-y-6 scale-[0.9] rotate-[4deg] rounded-4xl bg-white/45 shadow-sm" />
                  <div className="absolute inset-0 translate-y-3 scale-[0.95] -rotate-[2.5deg] rounded-4xl bg-white/75 shadow-sm" />
                </>
              )}

              <AnimatePresence custom={dir} mode="popLayout" initial={false}>
                {step < total && (
                  <motion.div
                    key={`q${step}`}
                    custom={dir}
                    variants={card}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.45, ease: EASE }}
                    className="absolute inset-0 flex flex-col rounded-4xl bg-white p-7 shadow-xl shadow-forest-900/10 sm:p-9"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-gold-600">
                        {f.stepLabel} <span dir="ltr">{step + 1}/{total + 1}</span>
                      </span>
                      <div className="flex gap-1">
                        {Array.from({ length: total + 1 }).map((_, i) => (
                          <span key={i} className={`h-1.5 rounded-full transition-all ${i === step ? 'w-6 bg-copper-600' : i < step ? 'w-1.5 bg-forest-800' : 'w-1.5 bg-sage-200'}`} />
                        ))}
                      </div>
                    </div>
                    <p className="my-auto text-2xl leading-snug font-bold text-ink sm:text-[1.7rem]">{f.yes[step]}</p>
                    <div className="grid grid-cols-[1fr_2fr] gap-2">
                      <Button as="button" type="button" variant="outline" size="lg" onClick={() => answer(false)}>
                        {f.noBtn}
                      </Button>
                      <Button as="button" type="button" variant="dark" size="lg" onClick={() => answer(true)}>
                        {f.yesBtn}
                      </Button>
                    </div>
                  </motion.div>
                )}

                {step === total && (
                  <motion.div
                    key="flags"
                    custom={dir}
                    variants={card}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.45, ease: EASE }}
                    className="absolute inset-0 flex flex-col rounded-4xl bg-white p-7 shadow-xl shadow-forest-900/10 sm:p-9"
                  >
                    <span className="text-xs font-semibold text-gold-600">
                      {f.stepLabel} <span dir="ltr">{total + 1}/{total + 1}</span>
                    </span>
                    <p className="mt-4 text-2xl font-bold text-ink">{f.noTitle}</p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {f.no.map((t, i) => {
                        const on = flags.includes(i)
                        return (
                          <button
                            key={t}
                            type="button"
                            aria-pressed={on}
                            onClick={() => setFlags((fl) => (on ? fl.filter((x) => x !== i) : [...fl, i]))}
                            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors ${
                              on ? 'border-copper-600 bg-copper-600 text-white' : 'border-copper-300/60 text-gold-700 hover:bg-sand-50'
                            }`}
                          >
                            {on ? <Check className="size-3.5" /> : <span className="size-1.5 rounded-full bg-copper-300" />}
                            {t}
                          </button>
                        )
                      })}
                    </div>
                    <div className="mt-auto grid grid-cols-2 gap-2 pt-6">
                      <Button as="button" type="button" variant="outline" size="lg" onClick={() => finish(true)}>
                        {f.none}
                      </Button>
                      <Button as="button" type="button" variant="dark" size="lg" onClick={() => finish(false)} className={flags.length ? '' : 'opacity-40'}>
                        {f.next}
                      </Button>
                    </div>
                  </motion.div>
                )}

                {done && (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.55, ease: EASE }}
                    className="absolute inset-0 flex flex-col overflow-hidden rounded-4xl bg-forest-800 p-7 shadow-2xl sm:p-9"
                  >
                    <div
                      className={`pointer-events-none absolute -top-24 size-72 rounded-full opacity-50 blur-3xl ltr:-right-16 rtl:-left-16 ${
                        state === 'flag' ? 'bg-copper-500' : 'bg-copper-300'
                      }`}
                    />
                    <span className="relative text-xs font-semibold text-copper-300">{f.resultLabel}</span>
                    <div className="relative mt-5 flex items-center gap-5">
                      <Ring value={yesCount} total={total} label={f.matchLabel} />
                      <div>
                        <p className="text-2xl font-bold text-white">{res.title}</p>
                        <p className="mt-2 text-sm leading-7 text-white/75">{res.text}</p>
                      </div>
                    </div>
                    <div className="relative mt-auto flex flex-wrap items-center gap-3 pt-6">
                      {state === 'flag' ? (
                        <Button href={waUrl} target="_blank" rel="noreferrer" variant="light" icon={MessageCircle}>
                          {f.talk}
                        </Button>
                      ) : (
                        <Button href="#cta" variant="nude">{f.cta}</Button>
                      )}
                      <button type="button" onClick={reset} className="inline-flex items-center gap-1.5 text-sm text-white/70 hover:text-white">
                        <RotateCcw className="size-4" />
                        {f.reset}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
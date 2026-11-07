import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { Check, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react'
import { EASE } from '../../lib/motion'
import SectionHeading from '../ui/SectionHeading'

const DURATION = 5 // ثواني لكل مرحلة

/* الطبقة اللي فوق الصورة — بتختلف حسب المرحلة */
function Overlay({ c }) {
  if (c.kind === 'scan') {
    return (
      <>
        {['top-6 left-6 border-t-2 border-l-2', 'top-6 right-6 border-t-2 border-r-2', 'bottom-6 left-6 border-b-2 border-l-2', 'bottom-6 right-6 border-b-2 border-r-2'].map(
          (cls, i) => (
            <motion.span
              key={cls}
              initial={{ opacity: 0, scale: 1.4 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 + i * 0.08, ease: EASE }}
              className={`absolute size-10 rounded-sm border-copper-300 ${cls}`}
            />
          ),
        )}
        <motion.div
          className="absolute inset-x-8 h-16 bg-gradient-to-b from-transparent via-copper-300/35 to-transparent"
          animate={{ top: ['8%', '80%', '8%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          <span className="absolute inset-x-0 top-1/2 h-px bg-copper-300 shadow-[0_0_18px_4px_rgba(217,160,106,0.6)]" />
        </motion.div>
        {/* نقاط قياس بتضوي */}
        {[
          ['top-[30%] left-[28%]', 0.5],
          ['top-[46%] right-[30%]', 0.9],
          ['top-[62%] left-[40%]', 1.3],
        ].map(([pos, d]) => (
          <motion.span
            key={pos}
            className={`absolute ${pos} size-3 rounded-full bg-copper-300`}
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1, 1], boxShadow: ['0 0 0 0 rgba(217,160,106,.6)', '0 0 0 14px rgba(217,160,106,0)', '0 0 0 0 rgba(217,160,106,0)'] }}
            transition={{ duration: 1.6, delay: d, repeat: Infinity, repeatDelay: 0.6 }}
          />
        ))}
      </>
    )
  }
  if (c.kind === 'plan') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.25, ease: EASE }}
        className="absolute inset-x-5 bottom-5 rounded-3xl bg-white/90 p-5 shadow-2xl backdrop-blur-md sm:inset-x-8 sm:bottom-8"
      >
        <div className="space-y-3.5">
          {c.rows.map((r, i) => (
            <div key={r.label}>
              <div className="flex items-center justify-between text-xs font-medium text-ink/70">
                <span>{r.label}</span>
                <motion.span
                  className="tabular-nums text-copper-700"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2 + i * 0.15 }}
                  dir="ltr"
                >
                  {Math.round(r.value * 100)}%
                </motion.span>
              </div>
              <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-sage-100">
                <motion.div
                  className="h-full rounded-full bg-copper-600"
                  initial={{ width: 0 }}
                  animate={{ width: `${r.value * 100}%` }}
                  transition={{ duration: 1.1, delay: 0.5 + i * 0.18, ease: EASE }}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    )
  }
  return (
    <div className="absolute inset-x-5 bottom-5 flex flex-wrap gap-2 sm:inset-x-8 sm:bottom-8">
      {c.chips.map((ch, i) => (
        <motion.span
          key={ch}
          initial={{ opacity: 0, y: 16, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.35 + i * 0.15, ease: EASE }}
          className="glass-dark inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-white"
        >
          <Check className="size-4 text-copper-300" />
          {ch}
        </motion.span>
      ))}
    </div>
  )
}

export default function Story({ a, isEn }) {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const ref = useRef(null)
  const inView = useInView(ref, { amount: 0.3 })
  const n = a.chapters.length
  const running = inView && !paused
  const c = a.chapters[active]
  const next = a.chapters[(active + 1) % n]
  const Prev = isEn ? ChevronLeft : ChevronRight
  const Next = isEn ? ChevronRight : ChevronLeft

  // المراحل بتتبدّل لحالها زي الستوري، وبتلف من الأول
  useEffect(() => {
    if (!running) return
    const t = setTimeout(() => setActive((x) => (x + 1) % n), DURATION * 1000)
    return () => clearTimeout(t)
  }, [running, active, n])

  const go = (i) => setActive((i + n) % n)

  return (
    <section id="about" ref={ref} className="scroll-mt-40 pt-24 pb-20 sm:pt-28 sm:pb-28">
      <div className="container-page">
        <SectionHeading badge={a.badge} title={a.title} accent={a.accent} />

        <div className="mt-10 grid overflow-hidden rounded-5xl border border-sage-200 bg-white lg:grid-cols-[1.15fr_1fr]">
          {/* الصورة: بتقرّب ببطء طول المرحلة */}
          <div className="relative h-[340px] overflow-hidden bg-forest-900 sm:h-[440px] lg:h-[540px]">
            <AnimatePresence initial={false}>
              <motion.div
                key={active}
                initial={{ opacity: 0, clipPath: isEn ? 'inset(0 0 0 100%)' : 'inset(0 100% 0 0)' }}
                animate={{ opacity: 1, clipPath: 'inset(0 0% 0 0%)' }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.9, ease: EASE }}
                className="absolute inset-0"
              >
                <motion.img
                  src={c.image}
                  alt=""
                  className="absolute inset-0 size-full object-cover"
                  initial={{ scale: 1.02 }}
                  animate={{ scale: running ? 1.14 : 1.06 }}
                  transition={{ duration: DURATION + 1, ease: 'linear' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest-950/65 via-transparent to-forest-950/25" />
                <motion.span
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="glass-dark absolute top-5 rounded-full px-3 py-1.5 text-xs font-medium text-white ltr:left-5 rtl:right-5 sm:top-8 sm:ltr:left-8 sm:rtl:right-8"
                >
                  {c.tag}
                </motion.span>
                <Overlay c={c} />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* النص */}
          <div className="relative flex flex-col overflow-hidden p-6 sm:p-10">
            {/* رقم كبير خفيف بالخلفية */}
            <AnimatePresence mode="wait">
              <motion.span
                key={active}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -40 }}
                transition={{ duration: 0.6, ease: EASE }}
                className="pointer-events-none absolute -bottom-10 text-[11rem] leading-none font-bold text-sage-50 select-none ltr:right-4 rtl:left-4"
                dir="ltr"
                aria-hidden
              >
                0{active + 1}
              </motion.span>
            </AnimatePresence>

            {/* أشرطة التقدّم مع أسماء المراحل */}
            <div className="relative grid gap-2" style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}>
              {a.chapters.map((ch, i) => (
                <button key={ch.title} type="button" onClick={() => go(i)} className="group text-start">
                  <span className="block h-1.5 overflow-hidden rounded-full bg-sage-100">
                    <motion.span
                      key={`${i}-${active}-${running}`}
                      className="block h-full bg-copper-600 ltr:origin-left rtl:origin-right"
                      initial={{ scaleX: i < active ? 1 : 0 }}
                      animate={{ scaleX: i < active ? 1 : i === active ? (running ? 1 : 0.5) : 0 }}
                      transition={i === active && running ? { duration: DURATION, ease: 'linear' } : { duration: 0.3 }}
                    />
                  </span>
                  <span
                    className={`mt-2 hidden truncate text-xs transition-colors sm:block ${
                      i === active ? 'font-semibold text-ink' : 'text-ink/45 group-hover:text-ink/70'
                    }`}
                  >
                    {ch.tag}
                  </span>
                </button>
              ))}
            </div>

            <div className="relative mt-8 min-h-[210px] flex-1 sm:mt-10">
              <AnimatePresence mode="wait">
                <motion.div key={active} initial="hidden" animate="show" exit="exit">
                  <motion.span
                    variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -10 } }}
                    transition={{ duration: 0.4, ease: EASE }}
                    className="inline-block text-sm font-semibold text-copper-600 tabular-nums"
                    dir="ltr"
                  >
                    0{active + 1} / 0{n}
                  </motion.span>
                  <h3 className="mt-3 text-3xl leading-tight font-bold text-ink sm:text-4xl">
                    {c.title.split(' ').map((w, i) => (
                      <span key={i} className="inline-block">
                        <motion.span
                          className="inline-block"
                          variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -14 } }}
                          transition={{ duration: 0.55, delay: 0.05 + i * 0.06, ease: EASE }}
                        >
                          {w}
                        </motion.span>
                        {'\u00A0'}
                      </span>
                    ))}
                  </h3>
                  <motion.p
                    variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -8 } }}
                    transition={{ duration: 0.5, delay: 0.3, ease: EASE }}
                    className="mt-4 text-base leading-8 text-ink/70 sm:text-lg"
                  >
                    {c.text}
                  </motion.p>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="relative mt-6 flex items-center gap-2">
              <button
                type="button"
                onClick={() => go(active - 1)}
                aria-label="prev"
                className="grid size-11 place-items-center rounded-full border border-sage-200 bg-white text-ink transition-colors hover:border-forest-800 hover:bg-forest-800 hover:text-white"
              >
                <Prev className="size-5" />
              </button>

              {/* معاينة المرحلة الجاية */}
              <button
                type="button"
                onClick={() => go(active + 1)}
                className="group flex min-w-0 flex-1 items-center gap-3 rounded-full bg-forest-800 py-1.5 ps-1.5 pe-4 text-start text-white transition-colors hover:bg-forest-700"
              >
                <AnimatePresence mode="wait">
                  <motion.img
                    key={next.image}
                    src={next.image}
                    alt=""
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="size-9 shrink-0 rounded-full object-cover"
                  />
                </AnimatePresence>
                <span className="min-w-0 flex-1 truncate text-sm">{next.title}</span>
                <Next className="size-4 shrink-0 transition-transform ltr:group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
              </button>

              <button
                type="button"
                onClick={() => setPaused((p) => !p)}
                aria-label={paused ? 'play' : 'pause'}
                className="grid size-11 shrink-0 place-items-center rounded-full border border-sage-200 bg-white text-ink/60 hover:text-ink"
              >
                {paused ? <Play className="size-4" /> : <Pause className="size-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
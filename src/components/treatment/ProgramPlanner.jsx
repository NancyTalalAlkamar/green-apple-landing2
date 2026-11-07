import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { ClipboardList, Info, MoveHorizontal } from 'lucide-react'
import { EASE } from '../../lib/motion'
import SectionHeading from '../ui/SectionHeading'

const WEEK_MS = 1800 // قديش بيوقف على كل أسبوع (ميلي ثانية) — رقم أكبر = أبطأ

export default function ProgramPlanner({ p }) {
  const max = p.weeks.length
  const [week, setWeek] = useState(0)
  const touched = useRef(false)
  const ref = useRef(null)
  const inView = useInView(ref, { amount: 0.25, once: true })

  // أول ما يبيّن القسم، البرنامج بيمشي لحاله أسبوع أسبوع
  useEffect(() => {
    if (!inView) return
    const t = setInterval(() => {
      if (touched.current) return clearInterval(t)
      setWeek((w) => {
        if (w >= max) {
          clearInterval(t)
          return w
        }
        return w + 1
      })
    }, WEEK_MS)
    return () => clearInterval(t)
  }, [inView, max])

  const phase = p.phases.find((ph) => week >= ph.from && week <= ph.to) || p.phases[0]
  const sessions = p.weeks.slice(0, week).reduce((a, w) => a + w.s, 0)

  return (
    <section id="program" ref={ref} className="scroll-mt-40 pb-20 sm:pb-28">
      <div className="container-page">
        <div className="relative overflow-hidden rounded-5xl bg-forest-800 px-5 py-12 sm:px-10 lg:px-14 lg:py-16">
          <div className="pointer-events-none absolute -top-32 size-[460px] rounded-full bg-copper-500/40 blur-[110px] ltr:-left-24 rtl:-right-24" />

          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading badge={p.badge} title={p.title} accent={p.accent} tone="dark" />
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {p.stats.map((s) => (
                <div key={s.label} className="rounded-2xl border border-white/12 bg-white/5 px-3 py-3 backdrop-blur-sm sm:px-5">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xl font-bold whitespace-nowrap text-white sm:text-3xl" dir="ltr">
                      {s.value}
                    </span>
                    <span className="text-[11px] font-medium text-copper-300 sm:text-xs">{s.unit}</span>
                  </div>
                  <p className="mt-1 text-[11px] text-white/60 sm:text-xs">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* الأسابيع */}
          <div className="relative mt-10 overflow-x-auto pt-3 pb-2" style={{ scrollbarWidth: 'none' }}>
            <div className="grid min-w-[560px] gap-1.5" style={{ gridTemplateColumns: `repeat(${max + 1}, minmax(0, 1fr))` }}>
              {Array.from({ length: max + 1 }).map((_, i) => {
                const lit = i <= week
                const w = i > 0 ? p.weeks[i - 1] : null
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      touched.current = true
                      setWeek(i)
                    }}
                    className="group flex flex-col items-center"
                  >
                    <motion.div
                      animate={{ opacity: lit ? 1 : 0.28, y: i === week ? -4 : 0 }}
                      transition={{ duration: 0.35 }}
                      className={`flex h-36 w-full flex-col items-center justify-end gap-1.5 rounded-2xl border pb-3 transition-colors ${
                        i === week ? 'border-copper-300/70 bg-white/10' : 'border-white/10 bg-white/[0.03] group-hover:bg-white/5'
                      }`}
                    >
                      {w?.scan && (
                        <span className="mb-auto mt-3 rounded-full bg-copper-300 px-2 py-0.5 text-[10px] font-bold text-forest-900">3D</span>
                      )}
                      {i === 0 ? (
                        <span className="grid size-9 place-items-center rounded-full bg-white text-forest-800">
                          <ClipboardList className="size-4" />
                        </span>
                      ) : (
                        Array.from({ length: w.s }).map((__, k) => (
                          <span key={k} className="size-4 rounded-full bg-copper-300 shadow-[0_0_12px_rgba(217,160,106,0.6)]" />
                        ))
                      )}
                    </motion.div>
                    <span className={`mt-2 text-xs tabular-nums ${i === week ? 'font-semibold text-white' : 'text-white/50'}`}>
                      {i === 0 ? p.startLabel : i}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="relative mt-6">
            <label htmlFor="program-week" className="sr-only">
              {p.weekLabel}
            </label>
            <input
              id="program-week"
              type="range"
              min={0}
              max={max}
              step={1}
              value={week}
              onChange={(e) => {
                touched.current = true
                setWeek(Number(e.target.value))
              }}
              className="w-full cursor-pointer rounded-full accent-[#d9a06a] focus:outline-none focus-visible:ring-2 focus-visible:ring-copper-300/60 focus-visible:ring-offset-4 focus-visible:ring-offset-forest-800"
            />
            <p className="mt-2 flex items-center gap-2 text-xs text-white/50">
              <MoveHorizontal className="size-4" />
              {p.hint}
              <span className="ms-auto flex items-center gap-3">
                <span className="flex items-center gap-1.5">
                  <span className="size-2.5 rounded-full bg-copper-300" /> {p.legendSession}
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="rounded-full bg-copper-300 px-1.5 text-[9px] font-bold text-forest-900">3D</span> {p.legendScan}
                </span>
              </span>
            </p>
          </div>

          {/* المرحلة الحالية */}
          <div className="relative mt-8 grid gap-3 sm:grid-cols-[1fr_auto]">
            <AnimatePresence mode="wait">
              <motion.div
                key={phase.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: EASE }}
                className="rounded-3xl bg-white p-5 sm:p-6"
              >
                <span className="text-xs font-semibold text-copper-600">
                  {week === 0 ? p.startLabel : `${p.weekLabel} ${week}`}
                </span>
                <p className="mt-1 text-xl font-bold text-ink">{phase.title}</p>
                <p className="mt-1 text-sm text-ink/70">{phase.text}</p>
              </motion.div>
            </AnimatePresence>
            <div className="flex items-center gap-3 rounded-3xl border border-white/12 bg-white/5 p-5 sm:flex-col sm:justify-center sm:px-8">
              <motion.span key={sessions} initial={{ scale: 1.25 }} animate={{ scale: 1 }} className="text-4xl font-bold text-copper-300 tabular-nums">
                {sessions}
              </motion.span>
              <span className="text-sm text-white/70">{p.sessionsSoFar}</span>
            </div>
          </div>

          <p className="relative mt-5 flex items-start gap-2 text-xs leading-6 text-white/55">
            <Info className="mt-0.5 size-4 shrink-0 text-copper-300" />
            {p.note}
          </p>
        </div>
      </div>
    </section>
  )
}
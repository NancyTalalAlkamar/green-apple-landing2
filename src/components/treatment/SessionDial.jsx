import { useRef, useState } from 'react'
import { motion, AnimatePresence, useInView, useMotionValue, useTransform, useAnimationFrame } from 'framer-motion'
import { EASE } from '../../lib/motion'
import SectionHeading from '../ui/SectionHeading'

const COLORS = ['#2f5240', '#22402f', '#8c4724', '#d9a06a']
const R = 120
const C = 2 * Math.PI * R
const STEP_SECONDS = 3.5 // قديش العقرب بيقضي بكل مرحلة
const HAND = 92 // طول العقرب

export default function SessionDial({ s }) {
  const n = s.steps.length
  const [active, setActive] = useState(0)
  const [hover, setHover] = useState(false)
  const ref = useRef(null)
  const inView = useInView(ref, { amount: 0.4 })

  const total = s.steps.reduce((a, b) => a + b.minutes, 0)
  let acc = 0
  const segs = s.steps.map((st) => {
    const start = acc / total
    const len = st.minutes / total
    acc += st.minutes
    return { start, len }
  })

  // t = رقم المرحلة + قديش مشينا فيها (مثلاً 2.4 يعني 40% من المرحلة التالتة)
  const t = useMotionValue(0)
  const frac = useTransform(t, (v) => v % 1)
  const angle = useTransform(t, (v) => {
    const i = Math.floor(v) % n
    return (segs[i].start + (v % 1) * segs[i].len) * 360
  })
  const handX = useTransform(angle, (a) => 150 + HAND * Math.sin((a * Math.PI) / 180))
  const handY = useTransform(angle, (a) => 150 - HAND * Math.cos((a * Math.PI) / 180))
  // الجزء اللي العقرب مرق عليه من المرحلة الحالية
  const trail = useTransform(t, (v) => {
    const i = Math.floor(v) % n
    return `${Math.max((v % 1) * segs[i].len * C - 3, 0)} ${C}`
  })
  const trailOffset = useTransform(t, (v) => -segs[Math.floor(v) % n].start * C)
  const trailColor = useTransform(t, (v) => COLORS[(Math.floor(v) % n) % COLORS.length])

  // العقرب بيلف لحاله بشكل متواصل، وبيوقف بس لما توقفي على الكروت
  useAnimationFrame((_, delta) => {
    if (!inView || hover) return
    let v = t.get() + Math.min(delta, 64) / 1000 / STEP_SECONDS
    if (v >= n) v -= n
    t.set(v)
    const i = Math.floor(v)
    if (i !== active) setActive(i)
  })

  const pick = (i) => {
    t.set(i)
    setActive(i)
  }

  return (
    <section id="session" ref={ref} className="scroll-mt-40 pb-20 sm:pb-28">
      <div className="container-page">
        <div className="relative overflow-hidden rounded-5xl bg-sand-100 px-5 py-10 sm:px-10 lg:px-12 lg:py-12">
          <div className="pointer-events-none absolute -top-32 size-96 rounded-full bg-white/70 blur-3xl ltr:-left-20 rtl:-right-20" />
          <div className="relative grid items-center gap-8 lg:grid-cols-[280px_1fr] lg:gap-14">
            {/* الساعة */}
            <div className="order-2 mx-auto w-full max-w-[250px] lg:order-none lg:max-w-[280px]">
              <svg viewBox="0 0 300 300" className="w-full" role="img" aria-label={s.title}>
                {/* علامات الدقائق */}
                {Array.from({ length: total }).map((_, i) => {
                  const a = (i / total) * 2 * Math.PI - Math.PI / 2
                  const long = i % 5 === 0
                  const r1 = 146
                  const r2 = long ? 136 : 141
                  return (
                    <line
                      key={i}
                      x1={150 + r1 * Math.cos(a)}
                      y1={150 + r1 * Math.sin(a)}
                      x2={150 + r2 * Math.cos(a)}
                      y2={150 + r2 * Math.sin(a)}
                      stroke="#1b2a22"
                      strokeOpacity={long ? 0.45 : 0.2}
                      strokeWidth={long ? 2 : 1}
                    />
                  )
                })}
                <g transform="rotate(-90 150 150)">
                  <circle cx="150" cy="150" r={R} fill="none" stroke="#fff" strokeWidth="22" />
                  {/* المراحل باهتة، والمرحلة الحالية أوضح */}
                  {segs.map((sg, i) => (
                    <motion.circle
                      key={i}
                      cx="150"
                      cy="150"
                      r={R}
                      fill="none"
                      stroke={COLORS[i % COLORS.length]}
                      strokeDasharray={`${Math.max(sg.len * C - 6, 2)} ${C}`}
                      strokeDashoffset={-sg.start * C}
                      animate={{ strokeWidth: active === i ? 28 : 20, opacity: active === i ? 0.45 : 0.22 }}
                      transition={{ duration: 0.45, ease: EASE }}
                      style={{ cursor: 'pointer' }}
                      onClick={() => pick(i)}
                    />
                  ))}
                  {/* اللون بينرسم ورا العقرب */}
                  <motion.circle
                    cx="150"
                    cy="150"
                    r={R}
                    fill="none"
                    strokeWidth="28"
                    style={{ stroke: trailColor, strokeDasharray: trail, strokeDashoffset: trailOffset }}
                    pointerEvents="none"
                  />
                </g>

                {/* العقرب */}
                <motion.line x1="150" y1="150" x2={handX} y2={handY} stroke="#14291f" strokeWidth="3" strokeLinecap="round" />
                <motion.circle cx={handX} cy={handY} r="6" fill="#14291f" stroke="#fff" strokeWidth="2" />

                <circle cx="150" cy="150" r="64" fill="#fff" />
                <AnimatePresence mode="wait">
                  <motion.g
                    key={active}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.3 }}
                  >
                    <text x="150" y="150" textAnchor="middle" fontSize="22" fontWeight="700" fill="#14291f">
                      {s.steps[active].time}
                    </text>
                    <text x="150" y="174" textAnchor="middle" fontSize="11" fill="#5d6a62">
                      {s.steps[active].title}
                    </text>
                  </motion.g>
                </AnimatePresence>
              </svg>
            </div>

            {/* المراحل */}
            <div className="min-w-0">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <SectionHeading badge={s.badge} title={s.title} accent={s.accent} />
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-forest-800 tabular-nums" dir="ltr">
                    ~{total}
                  </span>
                  <span className="text-sm font-medium text-copper-600">{s.centerUnit}</span>
                </div>
              </div>

              <div
                className="mt-7 grid grid-cols-2 gap-2 pt-1 lg:grid-cols-4"
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
              >
                {s.steps.map((st, i) => {
                  const on = active === i
                  return (
                    <motion.button
                      key={st.title}
                      type="button"
                      onClick={() => pick(i)}
                      aria-pressed={on}
                      animate={{ y: on ? -4 : 0 }}
                      transition={{ duration: 0.35, ease: EASE }}
                      className={`relative overflow-hidden rounded-2xl p-4 text-start transition-colors duration-300 ${
                        on ? 'bg-white shadow-lg shadow-forest-900/10' : 'bg-white/40 hover:bg-white/70'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="relative grid size-3 shrink-0 place-items-center">
                          {on && (
                            <motion.span
                              className="absolute size-3 rounded-full"
                              style={{ background: COLORS[i % COLORS.length] }}
                              animate={{ scale: [1, 2.2], opacity: [0.5, 0] }}
                              transition={{ duration: 1.2, repeat: Infinity }}
                            />
                          )}
                          <span className="size-3 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                        </span>
                        <span className="text-xs font-semibold text-copper-700" dir="auto">
                          {st.time}
                        </span>
                      </div>
                      <p className={`mt-3 text-sm leading-6 font-semibold ${on ? 'text-ink' : 'text-ink/60'}`}>{st.title}</p>
                      {/* شريط بيمتلي مع حركة العقرب */}
                      {on && (
                        <motion.span
                          style={{ scaleX: frac, background: COLORS[i % COLORS.length] }}
                          className="absolute inset-x-0 bottom-0 h-1 ltr:origin-left rtl:origin-right"
                        />
                      )}
                    </motion.button>
                  )
                })}
              </div>

              <div className="mt-4 min-h-[56px]">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={active}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.3, ease: EASE }}
                    className="text-base leading-7 text-ink/75"
                  >
                    {s.steps[active].text}
                  </motion.p>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
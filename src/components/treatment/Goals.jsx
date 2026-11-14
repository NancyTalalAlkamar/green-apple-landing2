import { useLayoutEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useAnimationFrame } from 'framer-motion'
import { Info, Pause } from 'lucide-react'
import SectionHeading from '../ui/SectionHeading'

/* رسومات صغيرة متحركة لكل هدف */
function Visual({ kind, dark }) {
  const stroke = dark ? '#e8d3c6' : '#a8766a'
  const soft = dark ? 'rgba(255,255,255,0.18)' : 'rgba(52,48,45,0.15)'
  const loop = { repeat: Infinity, repeatType: 'reverse', duration: 2.4, ease: 'easeInOut' }

  if (kind === 'shrink') {
    const dots = [
      [80, 70], [120, 58], [160, 72], [100, 100], [142, 102],
    ]
    return (
      <svg viewBox="0 0 240 160" className="h-full w-full" aria-hidden>
        <ellipse cx="120" cy="82" rx="92" ry="62" fill="none" stroke={soft} strokeWidth="2" strokeDasharray="5 7" />
        {dots.map(([x, y], i) => (
          <motion.circle
            key={i}
            cx={x}
            cy={y}
            fill={stroke}
            initial={{ r: 17, opacity: 0.9 }}
            animate={{ r: 7, opacity: 0.55 }}
            transition={{ ...loop, delay: i * 0.18 }}
          />
        ))}
      </svg>
    )
  }
  if (kind === 'tighten') {
    const wavy = 'M14 80 C 44 40, 64 40, 94 80 S 144 120, 174 80 S 214 40, 226 80'
    const flat = 'M14 80 C 44 80, 64 80, 94 80 S 144 80, 174 80 S 214 80, 226 80'
    return (
      <svg viewBox="0 0 240 160" className="h-full w-full" aria-hidden>
        <path d={wavy} fill="none" stroke={soft} strokeWidth="3" strokeDasharray="4 6" />
        <motion.path
          fill="none"
          stroke={stroke}
          strokeWidth="5"
          strokeLinecap="round"
          initial={{ d: wavy }}
          animate={{ d: flat }}
          transition={loop}
        />
        <circle cx="14" cy="80" r="6" fill={stroke} />
        <circle cx="226" cy="80" r="6" fill={stroke} />
      </svg>
    )
  }
  const straightL = 'M84 12 C 84 60, 84 70, 84 80 C 84 90, 84 100, 84 148'
  const curvedL = 'M80 12 C 80 58, 104 66, 104 80 C 104 94, 80 102, 80 148'
  const straightR = 'M156 12 C 156 60, 156 70, 156 80 C 156 90, 156 100, 156 148'
  const curvedR = 'M160 12 C 160 58, 136 66, 136 80 C 136 94, 160 102, 160 148'
  return (
    <svg viewBox="0 0 240 160" className="h-full w-full" aria-hidden>
      <motion.path fill="none" stroke={stroke} strokeWidth="5" strokeLinecap="round" initial={{ d: straightL }} animate={{ d: curvedL }} transition={loop} />
      <motion.path fill="none" stroke={stroke} strokeWidth="5" strokeLinecap="round" initial={{ d: straightR }} animate={{ d: curvedR }} transition={loop} />
      <motion.ellipse
        cx="120"
        cy="80"
        ry="7"
        fill="none"
        stroke={dark ? '#fff' : '#34302d'}
        strokeWidth="2"
        strokeDasharray="3 4"
        initial={{ rx: 40 }}
        animate={{ rx: 20 }}
        transition={loop}
      />
    </svg>
  )
}

const STYLES = [
  { card: 'bg-forest-800 text-white', text: 'text-white/75', num: 'text-copper-300', dark: true },
  { card: 'bg-sand-100 text-ink', text: 'text-ink/70', num: 'text-gold-600', dark: false },
  { card: 'bg-white text-ink border border-sage-200', text: 'text-ink/70', num: 'text-gold-600', dark: false },
]

function GoalCard({ it, i, total, className = '' }) {
  const s = STYLES[i % STYLES.length]
  return (
    <article className={`relative flex shrink-0 flex-col overflow-hidden rounded-5xl p-7 sm:p-9 ${s.card} ${className}`}>
      {s.dark && <div className="pointer-events-none absolute -bottom-24 size-72 rounded-full bg-copper-500/40 blur-3xl ltr:-right-16 rtl:-left-16" />}
      <div className="relative flex items-center justify-between">
        <span className={`text-sm font-semibold tabular-nums ${s.num}`} dir="ltr">
          0{i + 1} / 0{total}
        </span>
      </div>
      <div className="relative my-6 h-36 sm:h-44">
        <Visual kind={it.visual} dark={s.dark} />
      </div>
      <h3 className="relative mt-auto text-2xl font-bold sm:text-3xl">{it.title}</h3>
      <p className={`relative mt-3 text-[15px] leading-7 ${s.text}`}>{it.text}</p>
    </article>
  )
}

const COPIES = 3
const SPEED = 45 // بكسل بالثانية

export default function Goals({ g, isEn }) {
  const trackRef = useRef(null)
  const copy = useRef(0)
  const x = useMotionValue(0)
  const [hover, setHover] = useState(false)
  const dirSign = isEn ? -1 : 1 // بالعربي البطاقات بتمشي لليمين، وبالإنجليزي لليسار
  const items = isEn ? g.items : [...g.items].reverse()

  useLayoutEffect(() => {
    const measure = () => {
      if (!trackRef.current) return
      copy.current = trackRef.current.scrollWidth / COPIES
      x.set(isEn ? 0 : -copy.current)
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(trackRef.current)
    return () => ro.disconnect()
  }, [isEn, x])

  // الحركة لحالها، وبتوقف لما تمرّري الماوس أو تلمسي البطاقة
  useAnimationFrame((_, delta) => {
    if (hover || !copy.current) return
    let v = x.get() + dirSign * SPEED * (Math.min(delta, 64) / 1000)
    if (v <= -copy.current) v += copy.current
    if (v >= 0) v -= copy.current
    x.set(v)
  })

   return (
    <section id="goals" className="scroll-mt-40 pb-20 sm:pb-28">
      <div className="container-page">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading badge={g.badge} title={g.title} accent={g.accent} />
          <p className="flex max-w-sm items-start gap-2 text-sm leading-7 text-ink/65">
            <Info className="mt-1 size-4 shrink-0 text-gold-600" />
            {g.note}
          </p>
        </div>

        {/* البطاقات جوّا عرض الصفحة، مع تلاشي ناعم عالأطراف */}
        <div
          dir="ltr"
          className="relative mt-10 overflow-hidden"
          style={{
            maskImage: 'linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)',
            WebkitMaskImage: 'linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)',
          }}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          onTouchStart={() => setHover(true)}
          onTouchEnd={() => setHover(false)}
        >
          <motion.div ref={trackRef} dir="ltr" style={{ x }} className="flex w-max gap-4 py-2 sm:gap-5">
            {Array.from({ length: COPIES }).flatMap((_, k) =>
              items.map((it) => {
                const i = g.items.indexOf(it)
                return (
                  <div key={`${k}-${i}`} dir={isEn ? 'ltr' : 'rtl'} aria-hidden={k > 0}>
                    <GoalCard it={it} i={i} total={g.items.length} className="h-[400px] w-[78vw] max-w-[380px] sm:h-[420px]" />
                  </div>
                )
              }),
            )}
          </motion.div>
          <motion.span
            animate={{ opacity: hover ? 1 : 0 }}
            className="glass-dark pointer-events-none absolute top-5 left-1/2 inline-flex -translate-x-1/2 items-center gap-1.5 rounded-full px-3 py-1 text-xs text-white"
          >
            <Pause className="size-3" />
          </motion.span>
        </div>
      </div>
    </section>
  )
}
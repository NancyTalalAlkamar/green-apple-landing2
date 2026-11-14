import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { X } from 'lucide-react'
import { EASE } from '../../lib/motion'
import { STATUS } from './data'

/* ═════════ أدوات صغيرة ═════════ */
const CARD = 'rounded-4xl shadow-[0_1px_2px_rgba(16,34,25,0.04),0_12px_32px_-16px_rgba(16,34,25,0.18)]'

export function Card({ className = '', children, lift = true, ...rest }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      whileHover={lift ? { y: -4, transition: { duration: 0.25 } } : undefined}
      transition={{ duration: 0.5, ease: EASE }}
      className={`${CARD} ${/(^|\s)bg-/.test(className) ? '' : 'bg-white'} ${className}`}
      {...rest}
    >
      {children}
    </motion.div>
  )
}

export function Eyebrow({ children, className = '' }) {
  return <p className={`text-xs font-semibold text-copper-600 ${className}`}>{children}</p>
}

export function useNow(ms = 1000) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), ms)
    return () => clearInterval(t)
  }, [ms])
  return now
}

/* ميلان خفيف مع حركة الماوس (على الكمبيوتر) */
export function useTilt(max = 4) {
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [max, -max]), { stiffness: 150, damping: 18 })
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-max, max]), { stiffness: 150, damping: 18 })
  return {
    style: { rotateX: rx, rotateY: ry, transformPerspective: 1200 },
    onMouseMove: (e) => {
      const r = e.currentTarget.getBoundingClientRect()
      mx.set((e.clientX - r.left) / r.width - 0.5)
      my.set((e.clientY - r.top) / r.height - 0.5)
    },
    onMouseLeave: () => {
      mx.set(0)
      my.set(0)
    },
  }
}

/* رقم بيعدّ لفوق لما يبيّن */
export function CountUp({ value, decimals = 0, duration = 900 }) {
  const [v, setV] = useState(0)
  useEffect(() => {
    let raf
    const start = performance.now()
    const tick = (t) => {
      const p = Math.min(1, (t - start) / duration)
      setV(value * (1 - Math.pow(1 - p, 3)))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [value, duration])
  return <>{Number(v.toFixed(decimals)).toLocaleString('en-US', { minimumFractionDigits: decimals })}</>
}

export function Ring({ value, total, size = 84, stroke = 7, color = '#d9a06a', track = 'rgba(255,255,255,0.12)' }) {
  const r = size / 2 - stroke
  const c = 2 * Math.PI * r
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track} strokeWidth={stroke} />
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={c}
        initial={{ strokeDashoffset: c }}
        animate={{ strokeDashoffset: c * (1 - value / total) }}
        transition={{ duration: 1.2, ease: EASE }}
      />
    </svg>
  )
}

export function Sheet({ open, onClose, children }) {
  // Esc بيسكّر النافذة
  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[70] flex items-end justify-center bg-forest-950/50 p-3 backdrop-blur-[2px] sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="relative max-h-[88svh] w-full max-w-md overflow-y-auto rounded-4xl bg-white p-6"
            dir="rtl"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="سكّري"
              className="absolute top-4 left-4 grid size-9 place-items-center rounded-full text-ink/50 transition hover:bg-sand-50 hover:text-ink"
            >
              <X className="size-5" />
            </button>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function Toggle({ on, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={() => onChange(!on)}
      className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${on ? 'bg-copper-600' : 'bg-sage-200'}`}
    >
      <motion.span layout className={`absolute top-1 size-5 rounded-full bg-white shadow ${on ? 'left-1' : 'right-1'}`} />
    </button>
  )
}

export function Dropdown({ open, onClose, children, className = '' }) {
  const ref = useRef(null)
  // بتسكّر لما تكبسي برّا القائمة أو على Esc
  useEffect(() => {
    if (!open) return undefined
    const onDown = (e) => {
      const box = ref.current?.parentElement
      if (box && !box.contains(e.target)) onClose()
    }
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('pointerdown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: -8, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.97 }}
          transition={{ duration: 0.2 }}
          className={`absolute top-full left-0 z-50 mt-2 origin-top-left overflow-hidden rounded-3xl bg-white shadow-2xl shadow-forest-900/15 ring-1 ring-sage-200 ${className}`}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function Burst({ colors = ['#d9a06a', '#ffffff'] }) {
  return (
    <div className="pointer-events-none absolute inset-0">
      {Array.from({ length: 18 }).map((_, i) => {
        const a = (i / 18) * Math.PI * 2
        return (
          <motion.span
            key={i}
            className="absolute top-1/2 left-1/2 size-2 rounded-sm"
            style={{ background: i % 3 ? colors[0] : colors[1] }}
            initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
            animate={{ x: Math.cos(a) * 130, y: Math.sin(a) * 70, opacity: 0, rotate: 200 }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        )
      })}
    </div>
  )
}

export function StatusChip({ status }) {
  const s = STATUS[status]
  return <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ring-1 ${s.cls}`}>{s.label}</span>
}

/* تنبيه صغير: نسخة تجريبية */
export function DemoPill({ className = '' }) {
  return (
    <span
      className={`inline-flex w-fit items-center rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-[11px] font-semibold text-amber-800 ${className}`}
    >
      نسخة تجريبية
      <span className="hidden sm:inline">&nbsp;· البيانات وهمية لحد ما ينربط النظام</span>
    </span>
  )
}
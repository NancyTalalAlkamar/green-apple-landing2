import { useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronsLeftRight } from 'lucide-react'

/* ---------- Silhouette generator (smooth body outline) ---------- */
// Half-widths at given heights; `k` scales the mid-body to show "before" vs "after".
function bodyPath(k) {
  const cx = 100
  const pts = [
    [62, 10], [80, 34], [96, 38], [124, 35], [160, 28 * k + 4], [205, 36 * k + 2],
    [250, 40 * k + 2], [300, 30 * k + 3], [360, 22 * k + 2], [420, 18],
  ]
  const right = pts.map(([y, w]) => [cx + w, y])
  const left = pts.map(([y, w]) => [cx - w, y]).reverse()
  const all = [...right, ...left]
  // Catmull-Rom → cubic Bézier for a soft outline
  let d = `M ${all[0][0]} ${all[0][1]}`
  for (let i = 0; i < all.length - 1; i++) {
    const p0 = all[i - 1] || all[i]
    const p1 = all[i]
    const p2 = all[i + 1]
    const p3 = all[i + 2] || p2
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6]
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6]
    d += ` C ${c1[0]} ${c1[1]}, ${c2[0]} ${c2[1]}, ${p2[0]} ${p2[1]}`
  }
  return d + ' Z'
}

function Silhouette({ k, fill, stroke }) {
  return (
    <svg viewBox="0 0 200 410" preserveAspectRatio="xMidYMid meet" className="absolute inset-x-0 bottom-0 mx-auto h-[86%] w-full" aria-hidden>
      <circle cx="100" cy="30" r="24" fill={fill} stroke={stroke} strokeWidth="1" />
      <path d={bodyPath(k)} fill={fill} stroke={stroke} strokeWidth="1" />
    </svg>
  )
}

/* ---------- Draggable comparison slider ---------- */
export default function BeforeAfter({ afterLabel, beforeLabel = 'قبل', caseKey }) {
  const ref = useRef(null)
  const [pos, setPos] = useState(50) // % from the left edge
  const [dragging, setDragging] = useState(false)

  const update = useCallback((clientX) => {
    const r = ref.current.getBoundingClientRect()
    const p = ((clientX - r.left) / r.width) * 100
    setPos(Math.min(95, Math.max(5, p)))
  }, [])

  const onPointerDown = (e) => {
    setDragging(true)
    e.currentTarget.setPointerCapture(e.pointerId)
    update(e.clientX)
  }

  const onKeyDown = (e) => {
    if (e.key === 'ArrowLeft') setPos((p) => Math.max(5, p - 5))
    if (e.key === 'ArrowRight') setPos((p) => Math.min(95, p + 5))
  }

  return (
    <div
      ref={ref}
      onPointerDown={onPointerDown}
      onPointerMove={(e) => dragging && update(e.clientX)}
      onPointerUp={() => setDragging(false)}
      className="relative h-full min-h-[380px] cursor-ew-resize touch-none overflow-hidden rounded-4xl bg-gradient-to-b from-sand-50 to-sand-200 select-none"
    >
      {/* BEFORE layer (right side) */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#f5f0ed] to-[#ece4df]">
        <Silhouette k={1.3} fill="#d6c4ac" stroke="#c2ab8f" />
      </div>

      {/* AFTER layer (left side), clipped by the handle */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-[#f2ece8] to-[#f1ebe7]"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={caseKey}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.45 }}
            className="absolute inset-0"
          >
            <Silhouette k={0.85} fill="#e2cdb5" stroke="#c9ad8d" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Divider + handle */}
      <div className="absolute inset-y-0 w-0.5 bg-white/90" style={{ left: `${pos}%` }}>
        <motion.button
          type="button"
          role="slider"
          aria-label="قارني قبل وبعد"
          aria-valuenow={Math.round(pos)}
          aria-valuemin={5}
          aria-valuemax={95}
          onKeyDown={onKeyDown}
          whileHover={{ scale: 1.1 }}
          animate={dragging ? { scale: 1.15 } : { scale: 1 }}
          className="absolute top-1/2 left-1/2 grid size-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-ink shadow-xl outline-none focus-visible:ring-2 focus-visible:ring-copper-600"
        >
          <ChevronsLeftRight className="size-5" />
        </motion.button>
      </div>

      {/* Labels */}
      <span className="absolute top-4 right-4 rounded-full bg-white px-3 py-1 text-xs font-medium text-ink shadow-sm">
        {beforeLabel}
      </span>
      <AnimatePresence mode="wait">
        <motion.span
          key={afterLabel}
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 6 }}
          className="absolute top-4 left-4 rounded-full bg-copper-600 px-3 py-1 text-xs font-medium text-white shadow-sm"
        >
          {afterLabel}
        </motion.span>
      </AnimatePresence>
    </div>
  )
}

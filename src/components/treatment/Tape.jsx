import { motion, useMotionValue, useAnimationFrame } from 'framer-motion'

/**
 * شريط قياس (متر خياطة) — العنصر المميّز لصفحات العلاج.
 * الأرقام بالسنتيمتر، والكلمات بتمرّ بينها، والشريط بيضل يمشي لحاله.
 */
const CELL = 110 // عرض كل 10 سم على الشريط
const CELLS = 20 // عدد الخانات بكل نسخة
const WIDTH = CELL * CELLS // عرض النسخة الوحدة

function Segment({ labels }) {
  return (
    <div className="flex shrink-0">
      {Array.from({ length: CELLS }).map((_, i) => {
        const word = i % 3 === 1 ? labels[Math.floor(i / 3) % labels.length] : null
        return (
          <div
            key={i}
            className="relative h-full shrink-0"
            style={{
              width: CELL,
              backgroundImage:
                'linear-gradient(to right, rgba(16,34,25,.55) 1px, transparent 1px), linear-gradient(to right, rgba(16,34,25,.8) 1.5px, transparent 1.5px), linear-gradient(to right, rgba(16,34,25,.95) 2px, transparent 2px)',
              backgroundSize: `${CELL / 10}px 26%, ${CELL / 2}px 42%, ${CELL}px 60%`,
              backgroundRepeat: 'repeat-x',
            }}
          >
            {!word && (
              <span className="absolute bottom-1.5 left-1.5 text-[11px] font-semibold text-forest-900/80 tabular-nums">
                {(i + 1) * 10}
              </span>
            )}
            {word && (
              <span className="absolute bottom-1.5 left-1/2 flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap text-[12px] font-semibold text-forest-900">
                <span className="size-1.5 rounded-full bg-copper-700" />
                {word}
              </span>
            )}
          </div>
        )
      })}
    </div>
  )
}

// duration = كم ثانية بتاخد النسخة لتمرق كاملة (رقم أكبر = أبطأ)
export default function Tape({ labels, duration = 38, className = '' }) {
  const x = useMotionValue(0)

  // الحركة بكل فريم، فبتضل شغّالة دايماً
  useAnimationFrame((_, delta) => {
    let v = x.get() - (WIDTH / duration) * (Math.min(delta, 64) / 1000)
    if (v <= -WIDTH) v += WIDTH
    x.set(v)
  })

  return (
    <div
      dir="ltr"
      aria-hidden
      className={`relative h-12 overflow-hidden bg-copper-300 shadow-lg shadow-copper-700/20 ${className}`}
    >
      <motion.div className="flex h-full w-max" style={{ x }}>
        <Segment labels={labels} />
        <Segment labels={labels} />
      </motion.div>
      {/* لمعة خفيفة على الشريط */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/25 via-transparent to-copper-700/15" />
    </div>
  )
}
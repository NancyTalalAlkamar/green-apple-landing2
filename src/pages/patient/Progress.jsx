import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Lock, Sparkles } from 'lucide-react'
import { EASE } from '../../lib/motion'
import { fmtDate, HOUR, POLICY, STAGES, PROGRAM, METRICS, SCAN_DATES, BADGES } from './data'
import { Card, Eyebrow, CountUp } from './ui'

/* ═════════ تقدّمي ═════════ */
function StageTrack({ frozen }) {
  const pct = PROGRAM.stageMonth / STAGES[0].months
  return (
    <Card className="p-6 sm:p-8">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <Eyebrow>رحلتك</Eyebrow>
          <p className="mt-1 text-2xl font-bold text-ink">{PROGRAM.name}</p>
        </div>
        <span className="rounded-full bg-sand-100 px-3 py-1 text-xs font-semibold text-ink/60">الدورة {PROGRAM.cycle}</span>
      </div>
      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        {STAGES.map((s) => {
          const current = s.n === PROGRAM.stage
          const done = s.n < PROGRAM.stage
          return (
            <div key={s.n} className={`relative rounded-3xl p-5 ${current ? 'bg-forest-900 text-white' : 'bg-sand-50 text-ink'}`}>
              <div className="flex items-center justify-between">
                <span
                  className={`grid size-8 place-items-center rounded-full text-sm font-bold ${current ? 'bg-copper-300 text-forest-900' : done ? 'bg-forest-800 text-white' : 'bg-white text-ink/40 ring-1 ring-sage-200'}`}
                >
                  {done ? <Check className="size-4" /> : s.n}
                </span>
                <span className={`text-[11px] ${current ? 'text-white/50' : 'text-ink/40'}`}>{s.span}</span>
              </div>
              <p className="mt-4 font-bold">المرحلة {s.n}</p>
              <p className={`text-sm ${current ? 'text-white/70' : 'text-ink/50'}`}>{s.name}</p>
              {current && (
                <div className="mt-4">
                  <div className="h-1.5 overflow-hidden rounded-full bg-white/15">
                    <motion.div
                      className="relative h-full overflow-hidden rounded-full bg-copper-300"
                      initial={{ width: 0 }}
                      animate={{ width: frozen ? '0%' : `${pct * 100}%` }}
                      transition={{ duration: 1.2, ease: EASE }}
                    >
                      <motion.span
                        className="absolute inset-y-0 w-8 bg-gradient-to-r from-transparent via-white/70 to-transparent"
                        animate={{ right: ['-30%', '130%'] }}
                        transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 1 }}
                      />
                    </motion.div>
                  </div>
                  <p className="mt-2 text-xs text-white/60">
                    {frozen ? 'موقوف مؤقتاً' : `الشهر ${PROGRAM.stageMonth} من ${s.months} · ${PROGRAM.sessionsDone} جلسة من ${PROGRAM.sessionsTotal}`}
                  </p>
                </div>
              )}
              {!current && !done && <Lock className="absolute bottom-5 left-5 size-4 text-ink/20" />}
            </div>
          )
        })}
      </div>
    </Card>
  )
}

function MetricChart() {
  const [id, setId] = useState('waist')
  const [act, setAct] = useState(null)
  const m = METRICS.find((x) => x.id === id)
  const ai = act ?? m.values.length - 1
  const W = 560
  const H = 220
  const pad = { x: 36, top: 34, bottom: 34 }
  const min = Math.min(...m.values) - 1
  const max = Math.max(...m.values) + 1
  // الوقت بيمشي من اليمين لليسار (RTL)
  const pts = m.values.map((v, i) => [
    W - pad.x - (i / (m.values.length - 1)) * (W - pad.x * 2),
    pad.top + ((max - v) / (max - min)) * (H - pad.top - pad.bottom),
  ])
  const line = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x} ${y}`).join(' ')
  const delta = Math.round((m.values[0] - m.values[ai]) * 10) / 10
  return (
    <Card className="p-6 sm:p-8" lift={false}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Eyebrow>قياساتك مع كل مسح</Eyebrow>
          <p className="mt-1 flex items-baseline gap-2">
            <span className="text-4xl font-bold text-ink" dir="ltr">
              −<CountUp key={`${id}-${ai}`} value={delta} decimals={delta % 1 ? 1 : 0} duration={600} />
            </span>
            <span className="text-sm text-ink/50">
              {m.unit} من {m.label} {ai === m.values.length - 1 ? 'منذ البداية' : `لحد ${fmtDate(SCAN_DATES[ai])}`}
            </span>
          </p>
        </div>
        <div className="flex rounded-full bg-sand-100 p-1">
          {METRICS.map((x) => (
            <button
              key={x.id}
              type="button"
              onClick={() => {
                setId(x.id)
                setAct(null)
              }}
              className={`relative rounded-full px-4 py-1.5 text-sm font-semibold ${id === x.id ? 'text-white' : 'text-ink/60'}`}
            >
              {id === x.id && <motion.span layoutId="metric-tab" className="absolute inset-0 rounded-full bg-forest-800" />}
              <span className="relative">{x.label}</span>
            </button>
          ))}
        </div>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="mt-6 w-full">
        <defs>
          <linearGradient id="area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#d9a06a" stopOpacity="0.35" />
            <stop offset="1" stopColor="#d9a06a" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0, 1, 2, 3].map((i) => (
          <line
            key={i}
            x1={pad.x}
            x2={W - pad.x}
            y1={pad.top + (i / 3) * (H - pad.top - pad.bottom)}
            y2={pad.top + (i / 3) * (H - pad.top - pad.bottom)}
            stroke="#f3ebe1"
          />
        ))}
        <motion.path
          key={`a-${id}`}
          d={`${line} L ${pts[pts.length - 1][0]} ${H - pad.bottom} L ${pts[0][0]} ${H - pad.bottom} Z`}
          fill="url(#area)"
          pointerEvents="none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        />
        <motion.path
          key={`l-${id}`}
          d={line}
          fill="none"
          stroke="#8c4724"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, ease: EASE }}
        />
        <motion.line
          x1={pts[ai][0]}
          x2={pts[ai][0]}
          y1={pad.top - 10}
          y2={H - pad.bottom}
          animate={{ x1: pts[ai][0], x2: pts[ai][0] }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          stroke="#d9a06a"
          strokeDasharray="4 4"
        />
        {pts.map(([x, y], i) => (
          <motion.g
            key={`${id}-${i}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.15 }}
            onMouseEnter={() => setAct(i)}
            onClick={() => setAct(i)}
            className="cursor-pointer"
          >
            <circle cx={x} cy={y} r="22" fill="transparent" />
            <motion.circle cx={x} cy={y} animate={{ r: i === ai ? 8 : 5 }} fill={i === ai ? '#8c4724' : 'white'} stroke="#8c4724" strokeWidth="2.5" />
            <text x={x} y={y - 16} textAnchor="middle" className={`text-[13px] font-bold ${i === ai ? 'fill-copper-600' : 'fill-ink/60'}`}>
              {m.values[i]}
            </text>
            <text x={x} y={H - 10} textAnchor="middle" className="fill-ink/45 text-[11px]">
              {fmtDate(SCAN_DATES[i])}
            </text>
          </motion.g>
        ))}
      </svg>
      <p className="mt-2 text-center text-[11px] text-ink/40">مرّري أو اكبسي على أي نقطة لتشوفي الفرق لحد هداك المسح</p>
    </Card>
  )
}

function bodyPath(k) {
  const cx = 100
  const pts = [
    [60, 9],
    [78, 30],
    [100, 44],
    [140, 40],
    [175, 22 * k + 12],
    [205, 24 * k + 6],
    [245, 46],
    [290, 40],
    [350, 26],
    [420, 14],
  ]
  const right = pts.map(([y, w]) => [cx + w, y])
  const left = pts.map(([y, w]) => [cx - w, y]).reverse()
  const all = [...right, ...left]
  let d = `M ${all[0][0]} ${all[0][1]}`
  for (let i = 0; i < all.length - 1; i++) {
    const p0 = all[i - 1] || all[i]
    const p1 = all[i]
    const p2 = all[i + 1]
    const p3 = all[i + 2] || p2
    d += ` C ${p1[0] + (p2[0] - p0[0]) / 6} ${p1[1] + (p2[1] - p0[1]) / 6}, ${p2[0] - (p3[0] - p1[0]) / 6} ${p2[1] - (p3[1] - p1[1]) / 6}, ${p2[0]} ${p2[1]}`
  }
  return d + ' Z'
}

function ScanCard() {
  const vals = METRICS[0].values
  const [i, setI] = useState(vals.length - 1)
  const first = vals[0]
  const min = first * 0.86
  const k = 0.6 + ((vals[i] - min) / (first - min)) * 0.8
  const nextScan = Math.max(1, Math.round((SCAN_DATES[SCAN_DATES.length - 1].getTime() + POLICY.scanEveryDays * 24 * HOUR - Date.now()) / (24 * HOUR)))
  return (
    <Card className="flex flex-col p-6">
      <Eyebrow>مسح الجسم 3D</Eyebrow>
      <div className="relative mt-2 flex flex-1 items-center justify-center py-2">
        <svg viewBox="0 0 200 430" className="h-48 w-auto">
          <path d={bodyPath(1.4)} fill="none" stroke="#dbe5de" strokeWidth="2" strokeDasharray="4 5" />
          <circle cx="100" cy="30" r="24" fill="#e9d6bf" />
          <motion.path
            initial={false}
            d={bodyPath(k)}
            animate={{ d: bodyPath(k) }}
            transition={{ duration: 0.6, ease: EASE }}
            fill="#e9d6bf"
            stroke="#b4683b"
            strokeWidth="1.5"
          />
          <motion.line
            x1="20"
            x2="180"
            y1="0"
            y2="0"
            stroke="#d9a06a"
            strokeWidth="2"
            animate={{ y1: [40, 420, 40], y2: [40, 420, 40] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          />
        </svg>
        <div className="absolute top-2 left-0">
          <p className="text-2xl font-bold text-ink" dir="ltr">
            {vals[i]} <span className="text-xs text-ink/45">cm</span>
          </p>
          <p className="text-[11px] text-ink/45">الخصر · {fmtDate(SCAN_DATES[i])}</p>
        </div>
      </div>
      <input
        type="range"
        min={0}
        max={vals.length - 1}
        value={i}
        onChange={(e) => setI(Number(e.target.value))}
        className="w-full accent-[#8c4724]"
        aria-label="اختاري المسح"
      />
      <div className="mt-4 flex items-center justify-between gap-2 rounded-2xl bg-sand-50 px-4 py-3 text-xs">
        <span className="text-ink/60">
          المسح الجاي بعد <b className="text-ink">{nextScan} يوم</b>
        </span>
        <a href="#" className="font-semibold text-copper-600">
          النتيجة الكاملة
        </a>
      </div>
    </Card>
  )
}

function BadgesCard() {
  const [sel, setSel] = useState(BADGES.map((b) => b.earned).lastIndexOf(true))
  const b0 = BADGES[sel]
  return (
    <Card className="p-6" lift={false}>
      <Eyebrow>شاراتك</Eyebrow>
      <p className="mt-1 text-sm text-ink/55">بتنكسب مع الالتزام، مش بس بالنتيجة.</p>
      <div className="mt-5 grid grid-cols-3 gap-3 sm:grid-cols-5">
        {BADGES.map((b, i) => (
          <motion.button
            type="button"
            key={b.title}
            onClick={() => setSel(i)}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.92 }}
            transition={{ delay: 0.1 + i * 0.08, type: 'spring', stiffness: 250, damping: 16 }}
            className={`rounded-3xl py-3 text-center transition-colors ${sel === i ? 'bg-sand-50 ring-1 ring-copper-300' : ''}`}
          >
            <motion.span
              animate={sel === i ? { rotateY: 360 } : { rotateY: 0 }}
              transition={{ duration: 0.7, ease: EASE }}
              className={`mx-auto grid size-14 place-items-center rounded-full ${b.earned ? 'bg-gradient-to-br from-copper-300 to-copper-500 text-forest-950 shadow-md shadow-copper-500/30' : 'bg-sand-100 text-ink/25'}`}
            >
              {b.earned ? <b.icon className="size-6" /> : <Lock className="size-5" />}
            </motion.span>
            <p className={`mt-2 text-xs font-bold ${b.earned ? 'text-ink' : 'text-ink/40'}`}>{b.title}</p>
            <p className="text-[10px] text-ink/40">{b.text}</p>
          </motion.button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.p
          key={sel}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          className={`mt-4 flex items-center gap-2 rounded-2xl px-4 py-3 text-sm ${b0.earned ? 'bg-copper-300/15 text-copper-700' : 'bg-sand-50 text-ink/60'}`}
        >
          {b0.earned ? <Sparkles className="size-4 shrink-0" /> : <Lock className="size-4 shrink-0" />}
          {b0.how}
        </motion.p>
      </AnimatePresence>
    </Card>
  )
}

export function ProgressPage({ ctx }) {
  return (
    <div className="space-y-5">
      <StageTrack frozen={ctx.frozen} />
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <MetricChart />
        </div>
        <ScanCard />
      </div>
      <BadgesCard />
    </div>
  )
}
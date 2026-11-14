import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, MotionConfig, useInView } from 'framer-motion'
import { ArrowUpLeft, Play, Pause, MapPin, Clock, ScanLine, Sparkles, Zap, MessageCircle, Languages } from 'lucide-react'
import { EASE } from '../lib/motion'
import Badge from '../components/ui/Badge'
import Tape from '../components/treatment/Tape'

/* ─────────────────────────────────────────────
   صفحة "من نحن" — جولة تفاعلية بالعيادة.
   المعلومات مأخوذة من ملف نطاق العمل،
   ولازم العيادة توافق عليها قبل النشر الرسمي.
   ───────────────────────────────────────────── */

/* ═════════ 1. الجولة: خريطة العيادة ═════════ */
const ROOMS = [
  {
    id: 'reception',
    name: 'الاستقبال',
    icon: MessageCircle,
    img: '/images/cta-office.webp',
    text: 'هون بتبلّشي. الاستقبال بيرتّب مواعيدك، وبيتابع معك على WhatsApp بالعربي والعبري.',
    fact: 'تأكيد المواعيد على WhatsApp',
    rect: { x: 330, y: 250, w: 250, h: 130 },
  },
  {
    id: 'consult',
    name: 'غرفة الاستشارة',
    icon: Clock,
    img: '/images/hero.webp',
    text: 'أول لقاء بياخد وقته: منسمعك، منقيّم، ومنبني خطتك قبل أي جلسة.',
    fact: 'حوالي ساعتين ونص',
    rect: { x: 330, y: 130, w: 250, h: 105 },
  },
  {
    id: 'scan',
    name: 'المسح ثلاثي الأبعاد',
    icon: ScanLine,
    img: '/images/body-scan.webp',
    text: 'جهاز Body Scan 3D بيقيس جسمك بدقة، ومنعيد المسح كل فترة عشان نقارن بالأرقام.',
    fact: 'مسح كل 3 أسابيع',
    rect: { x: 330, y: 20, w: 250, h: 95 },
  },
  {
    id: 'rooms',
    name: 'غرف العلاج',
    icon: Sparkles,
    img: '/images/room-abdomen.webp',
    text: 'غرف خاصة وأجهزة متنوعة. بتتنقّلي بينهم حسب خطتك، ضمن موعد واحد.',
    fact: '6 غرف · حوالي 15 جهاز',
    rect: { x: 20, y: 20, w: 270, h: 240 },
  },
  {
    id: 'laser',
    name: 'غرفة الليزر',
    icon: Zap,
    img: '/images/room-thighs.webp',
    text: 'لليزر غرفة ومعالجة مختصة، بجدول مستقل عن باقي العلاجات.',
    fact: 'معالجة ليزر مختصة',
    rect: { x: 20, y: 275, w: 270, h: 105 },
  },
]
const center = (r) => ({ cx: r.x + r.w / 2, cy: r.y + r.h / 2 })
const TOUR_MS = 4200

function FloorPlan({ active, onPick }) {
  const r = ROOMS[active].rect
  const c = center(r)
  return (
    <svg viewBox="0 0 600 400" className="h-auto w-full" role="img" aria-label="خريطة العيادة">
      {/* الممر */}
      <rect x="300" y="20" width="20" height="360" rx="10" fill="rgba(255,255,255,0.04)" />
      <path d="M310 30 L310 370" stroke="rgba(232,211,198,0.35)" strokeWidth="2" strokeDasharray="2 10" strokeLinecap="round" />

      {ROOMS.map((room, i) => {
        const on = i === active
        const { x, y, w, h } = room.rect
        return (
          <g key={room.id} onClick={() => onPick(i)} className="cursor-pointer">
            <motion.rect
              x={x}
              y={y}
              width={w}
              height={h}
              rx="18"
              animate={{
                fill: on ? 'rgba(232,211,198,0.22)' : 'rgba(255,255,255,0.05)',
                stroke: on ? '#e8d3c6' : 'rgba(255,255,255,0.18)',
              }}
              strokeWidth={on ? 2.5 : 1.5}
              transition={{ duration: 0.4 }}
            />
            {/* غرف العلاج: 6 غرف صغيرة جوّا */}
            {room.id === 'rooms' &&
              Array.from({ length: 6 }).map((_, k) => {
                const col = k % 3
                const row = Math.floor(k / 3)
                return (
                  <motion.rect
                    key={k}
                    x={x + 14 + col * 84}
                    y={y + 46 + row * 92}
                    width={74}
                    height={80}
                    rx="10"
                    animate={{ fill: on ? 'rgba(232,211,198,0.35)' : 'rgba(255,255,255,0.06)' }}
                    transition={{ duration: 0.35, delay: on ? k * 0.08 : 0 }}
                  />
                )
              })}
            {/* باب */}
            <rect x={room.id === 'rooms' || room.id === 'laser' ? x + w - 4 : x - 4} y={y + h / 2 - 14} width="8" height="28" rx="4" fill="#2b2826" />
            <text
              x={x + w - 16}
              y={y + 30}
              textAnchor="start"
              direction="rtl"
              className="select-none"
              style={{ fontSize: 17, fontWeight: 700, fill: on ? '#e8d3c6' : 'rgba(255,255,255,0.7)' }}
            >
              {room.name}
            </text>
          </g>
        )
      })}

      {/* "إنتِ هون" — نقطة بتتنقّل بين الغرف */}
      <motion.circle
        initial={false}
        animate={{ cx: c.cx, cy: c.cy, r: [14, 32], opacity: [0.7, 0] }}
        transition={{ cx: { type: 'spring', stiffness: 70, damping: 16 }, cy: { type: 'spring', stiffness: 70, damping: 16 }, r: { duration: 1.4, repeat: Infinity }, opacity: { duration: 1.4, repeat: Infinity } }}
        fill="rgba(232,211,198,0.45)"
      />
      <motion.circle
        initial={false}
        animate={{ cx: c.cx, cy: c.cy }}
        transition={{ type: 'spring', stiffness: 70, damping: 16 }}
        r="10"
        fill="#e8d3c6"
        stroke="#fff"
        strokeWidth="3"
      />
    </svg>
  )
}

function Tour() {
  const [active, setActive] = useState(0)
  const [playing, setPlaying] = useState(true)
  const ref = useRef(null)
  const inView = useInView(ref, { amount: 0.3 })

  useEffect(() => {
    if (!playing || !inView) return
    const t = setTimeout(() => setActive((a) => (a + 1) % ROOMS.length), TOUR_MS)
    return () => clearTimeout(t)
  }, [active, playing, inView])

  const pick = (i) => {
    setPlaying(false)
    setActive(i)
  }
  const room = ROOMS[active]
  const Icon = room.icon

  return (
    <section ref={ref} className="bg-sand-50 pt-28 pb-10 sm:pt-32 sm:pb-14">
      <div className="container-page">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <Badge>من نحن</Badge>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
              className="mt-4 text-4xl leading-[1.15] font-bold text-ink sm:text-6xl"
            >
              اتفضلي، <span className="text-gold-600">ادخلي عنا.</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.25, ease: EASE }}
              className="mt-4 max-w-xl text-base leading-8 text-ink/70 sm:text-lg"
            >
              Green Apple عيادة تنحيف ونحت جسم في سخنين. خدي جولة سريعة: اكبسي على أي غرفة، أو خلي الجولة تمشي لحالها.
            </motion.p>
          </div>
          <div className="flex items-center gap-2 text-sm text-ink/60">
            <MapPin className="size-4 text-gold-600" /> سخنين
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3, ease: EASE }}
          className="mt-8 grid overflow-hidden rounded-5xl bg-forest-900 lg:grid-cols-[1.25fr_1fr]"
        >
          {/* الخريطة */}
          <div className="relative p-5 sm:p-8">
            <div className="mb-4 flex items-center justify-between text-white">
              <span className="text-sm font-semibold text-copper-300">خريطة العيادة</span>
              <button
                type="button"
                onClick={() => setPlaying((p) => !p)}
                className="flex items-center gap-2 rounded-full border border-white/15 px-3.5 py-1.5 text-xs font-semibold text-white/85 transition hover:bg-white/10"
              >
                {playing ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
                {playing ? 'وقّفي الجولة' : 'كمّلي الجولة'}
              </button>
            </div>
            <FloorPlan active={active} onPick={pick} />
            {/* تقدّم الجولة */}
            <div className="mt-5 flex gap-1.5">
              {ROOMS.map((rm, i) => (
                <button key={rm.id} type="button" onClick={() => pick(i)} aria-label={rm.name} className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
                  {i === active && (
                    <motion.span
                      key={active + String(playing)}
                      className="block h-full origin-right rounded-full bg-copper-300"
                      initial={{ scaleX: playing && inView ? 0 : 1 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: playing && inView ? TOUR_MS / 1000 : 0, ease: 'linear' }}
                    />
                  )}
                  {i < active && <span className="block h-full bg-copper-300/50" />}
                </button>
              ))}
            </div>
          </div>

          {/* تفاصيل الغرفة */}
          <div className="relative min-h-[420px] overflow-hidden bg-forest-800">
            <AnimatePresence mode="wait">
              <motion.div key={room.id} className="absolute inset-0 flex flex-col">
                <motion.div
                  initial={{ clipPath: 'inset(0 0 100% 0)' }}
                  animate={{ clipPath: 'inset(0 0 0% 0)' }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.7, ease: EASE }}
                  className="relative h-1/2 min-h-[200px] overflow-hidden"
                >
                  <motion.img
                    src={room.img}
                    alt={room.name}
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1.05 }}
                    transition={{ duration: TOUR_MS / 1000 + 1, ease: 'linear' }}
                    className="size-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest-800 via-transparent to-transparent" />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.5, delay: 0.2, ease: EASE }}
                  className="flex-1 p-6 text-white sm:p-8"
                >
                  <div className="flex items-center gap-3">
                    <span className="grid size-11 place-items-center rounded-2xl bg-copper-300 text-forest-900">
                      <Icon className="size-5" />
                    </span>
                    <span className="text-xs font-semibold text-white/50 tabular-nums" dir="ltr">
                      0{active + 1} / 0{ROOMS.length}
                    </span>
                  </div>
                  <p className="mt-4 text-2xl font-bold sm:text-3xl">{room.name}</p>
                  <p className="mt-2 leading-7 text-white/70">{room.text}</p>
                  <span className="mt-4 inline-flex rounded-full border border-copper-300/40 bg-copper-300/10 px-3.5 py-1.5 text-sm font-semibold text-copper-300">
                    {room.fact}
                  </span>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

/* ═════════ 2. شو بيصير بالموعد: محاكي البلوك ═════════ */
const STATIONS = ['نحت', 'شد', 'سيلوليت', 'تصريف']
const PEOPLE = [
  { label: 'إنتِ', color: '#e8d3c6', you: true },
  { label: 'س', color: '#9bb8a6' },
  { label: 'ر', color: '#c9b79c' },
  { label: 'م', color: '#7fa08c' },
]
const ROTATE_MS = 2600

function BlockSim() {
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(true)
  const ref = useRef(null)
  const inView = useInView(ref, { amount: 0.4 })

  useEffect(() => {
    if (!playing || !inView) return
    const t = setTimeout(() => setStep((s) => s + 1), ROTATE_MS)
    return () => clearTimeout(t)
  }, [step, playing, inView])

  const R = 100
  const pos = (k, rad = R) => {
    const a = (k / 4) * 2 * Math.PI - Math.PI / 2
    return { x: 160 + rad * Math.cos(a), y: 160 + rad * Math.sin(a) }
  }
  const round = step % 4
  const minutes = Math.min(150, Math.round(((step % 5) / 4) * 150))
  const youAt = STATIONS[(0 + step) % 4]

  return (
    <section ref={ref} className="pb-10 sm:pb-14">
      <div className="container-page grid items-center gap-10 lg:grid-cols-[1fr_auto] lg:gap-16">
        <div>
          <Badge>كيف بيكون موعدك</Badge>
          <h2 className="mt-4 text-3xl leading-tight font-bold text-ink sm:text-5xl">
            موعد واحد، <span className="text-gold-600">كذا جهاز</span>
          </h2>
          <p className="mt-4 max-w-lg text-base leading-8 text-ink/70 sm:text-lg">
            منحجزلك موعد من ساعتين لثلاث ساعات، معك 3 نساء كحد أقصى. كل وحدة بتتنقّل بين الأجهزة حسب خطتها، بالدور، ومن غير ما حدا يستنّى.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-forest-800 px-4 py-2 text-sm font-semibold text-white">
              <span className="size-2.5 rounded-full bg-copper-300" />
              هلّق إنتِ على: <span className="text-copper-300">{youAt}</span>
            </span>
            <span className="rounded-full border border-sage-200 bg-white px-4 py-2 text-sm font-semibold text-ink/70 tabular-nums">
              الجولة {round + 1} من 4
            </span>
            <button
              type="button"
              onClick={() => setPlaying((p) => !p)}
              className="grid size-10 place-items-center rounded-full border border-sage-200 bg-white text-ink transition hover:border-copper-300"
              aria-label={playing ? 'وقّفي' : 'شغّلي'}
            >
              {playing ? <Pause className="size-4" /> : <Play className="size-4" />}
            </button>
          </div>
          <p className="mt-4 text-xs text-ink/45">* أسماء الأجهزة للتوضيح بس، والخطة بتتحدد بالاستشارة.</p>
        </div>

        <div className="relative mx-auto size-[320px] sm:size-[380px]">
          <svg viewBox="0 0 320 320" className="absolute inset-0 size-full">
            <circle cx="160" cy="160" r={R} fill="none" stroke="#e7e0dc" strokeWidth="2" strokeDasharray="3 8" />
            {/* عدّاد الوقت بالنص */}
            <circle cx="160" cy="160" r="58" fill="#2b2826" />
            <motion.circle
              cx="160"
              cy="160"
              r="58"
              fill="none"
              stroke="#e8d3c6"
              strokeWidth="5"
              strokeLinecap="round"
              transform="rotate(-90 160 160)"
              animate={{ pathLength: minutes / 150 }}
              transition={{ duration: 0.8, ease: EASE }}
            />
          </svg>
          <div className="absolute inset-0 grid place-items-center text-center text-white">
            <div>
              <motion.p key={minutes} initial={{ scale: 1.2, opacity: 0.6 }} animate={{ scale: 1, opacity: 1 }} className="text-3xl font-bold tabular-nums">
                {minutes}
              </motion.p>
              <p className="text-[11px] text-white/60">دقيقة</p>
            </div>
          </div>

          {/* المحطات */}
          {STATIONS.map((s, k) => {
            const p = pos(k, 150)
            return (
              <span
                key={s}
                className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full px-3 py-1.5 text-xs font-bold whitespace-nowrap shadow-sm transition-colors ${
                  STATIONS[step % 4] === s ? 'bg-forest-800 text-copper-300' : 'border border-sage-200 bg-white text-ink'
                }`}
                style={{ left: `${(p.x / 320) * 100}%`, top: `${(p.y / 320) * 100}%` }}
              >
                {s}
              </span>
            )
          })}

          {/* المريضات بيتنقّلوا */}
          {PEOPLE.map((person, i) => {
            const p = pos((i + step) % 4)
            return (
              <motion.span
                key={i}
                animate={{ left: `${(p.x / 320) * 100}%`, top: `${(p.y / 320) * 100}%` }}
                transition={{ type: 'spring', stiffness: 60, damping: 14 }}
                className={`absolute grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full font-bold text-forest-900 shadow-lg ring-4 ring-sand-50 ${
                  person.you ? 'h-10 px-3 text-xs' : 'size-9 text-xs'
                }`}
                style={{ background: person.color }}
              >
                {person.label}
              </motion.span>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ═════════ 3. منقيس مش منحزر: المسح ═════════ */
const MARKS = [
  { label: 'الخصر', y: 134, rx: 34 },
  { label: 'البطن', y: 160, rx: 40 },
  { label: 'الورك', y: 190, rx: 48 },
  { label: 'الفخذ', y: 236, rx: 36 },
]

function ScanSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { amount: 0.4 })
  const [week, setWeek] = useState(0)

  useEffect(() => {
    if (!inView) return
    const t = setInterval(() => setWeek((w) => (w + 1) % 5), 1800)
    return () => clearInterval(t)
  }, [inView])

  return (
    <section ref={ref} className="pb-10 sm:pb-14">
      <div className="container-page">
        <div className="grid items-center gap-8 overflow-hidden rounded-5xl bg-forest-800 p-6 text-white sm:p-10 lg:grid-cols-[auto_1fr] lg:gap-14 lg:px-14 lg:py-10">
          {/* الجسم والمسح */}
          <div className="relative mx-auto h-[300px] w-[206px]">
            <svg viewBox="0 0 220 320" className="absolute inset-0 size-full">
              {/* هيكل مبسّط */}
              <g fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.45)" strokeWidth="2" strokeLinejoin="round">
                <circle cx="110" cy="35" r="21" />
                <path d="M98 58 L122 58 C124 66 132 70 146 74 C156 78 160 88 160 100 L164 150 C165 158 160 160 157 152 L150 108 C148 120 146 128 140 138 C150 156 156 172 154 190 C152 206 146 220 142 236 L136 300 C135 306 126 306 125 300 L114 214 L106 214 L95 300 C94 306 85 306 84 300 L78 236 C74 220 68 206 66 190 C64 172 70 156 80 138 C74 128 72 120 70 108 L63 152 C60 160 55 158 56 150 L60 100 C60 88 64 78 74 74 C88 70 96 66 98 58 Z" />
              </g>
              {MARKS.map((m) => (
                <motion.ellipse
                  key={m.label}
                  cx="110"
                  cy={m.y}
                  rx={m.rx}
                  ry="8"
                  fill="none"
                  stroke="#e8d3c6"
                  strokeWidth="2"
                  strokeDasharray="4 5"
                  initial={{ opacity: 0.25 }}
                  animate={{ opacity: [0.25, 1, 0.25] }}
                  transition={{ duration: 3.2, repeat: Infinity, delay: (m.y - 100) / 90 }}
                />
              ))}
              {/* حلقة المسح */}
              <motion.ellipse
                cx="110"
                rx="70"
                ry="12"
                fill="rgba(232,211,198,0.15)"
                stroke="#e8d3c6"
                strokeWidth="2.5"
                animate={{ cy: [20, 300, 20] }}
                transition={{ duration: 6.4, repeat: Infinity, ease: 'easeInOut' }}
                style={{ filter: 'drop-shadow(0 0 8px rgba(232,211,198,0.8))' }}
              />
            </svg>
            {MARKS.map((m, i) => (
              <motion.span
                key={m.label}
                initial={{ opacity: 0.3 }}
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 3.2, repeat: Infinity, delay: (m.y - 100) / 90 }}
                className={`absolute rounded-full bg-white px-2 py-0.5 text-[11px] font-bold text-forest-900 ${i % 2 ? 'left-0' : 'right-0'}`}
                style={{ top: m.y - 10 }}
              >
                {m.label}
              </motion.span>
            ))}
          </div>

          <div>
            <Badge tone="dark">منقيس، مش منحزر</Badge>
            <h2 className="mt-4 text-3xl leading-tight font-bold sm:text-5xl">
              تقدّمك <span className="text-copper-300">بالأرقام</span>
            </h2>
            <p className="mt-4 max-w-lg leading-8 text-white/70 sm:text-lg">
              بأول الطريق منعمل مسح ثلاثي الأبعاد لجسمك، ومنعيده كل 3 أسابيع. هيك بتشوفي التغيير بالقياسات، مش بس بالمراية.
            </p>

            {/* خط زمني للمسوحات */}
            <div className="mt-8">
              <div className="relative flex items-center justify-between">
                <div className="absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 bg-white/15" />
                <motion.div
                  className="absolute top-1/2 right-0 h-0.5 -translate-y-1/2 bg-copper-300"
                  animate={{ width: `${(week / 4) * 100}%` }}
                  transition={{ duration: 0.8, ease: EASE }}
                />
                {[0, 3, 6, 9, 12].map((w, i) => (
                  <motion.span
                    key={w}
                    animate={{ scale: i === week ? 1.25 : 1, backgroundColor: i <= week ? '#e8d3c6' : '#34302d' }}
                    className="relative z-10 grid size-9 place-items-center rounded-full border-2 border-copper-300/60 text-[11px] font-bold text-forest-900"
                  >
                    <ScanLine className={`size-4 ${i <= week ? 'text-forest-900' : 'text-white/50'}`} />
                  </motion.span>
                ))}
              </div>
              <div className="mt-2 flex justify-between text-[11px] text-white/55">
                {['البداية', 'أسبوع 3', 'أسبوع 6', 'أسبوع 9', 'أسبوع 12'].map((l) => (
                  <span key={l}>{l}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ═════════ 4. منحكي لغتك ═════════ */
const HELLOS = [
  { t: 'أهلا وسهلا فيكي', dir: 'rtl' },
  { t: 'ברוכה הבאה', dir: 'rtl' },
]

function LanguageBand() {
  const [i, setI] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % HELLOS.length), 2400)
    return () => clearInterval(t)
  }, [])
  return (
    <section className="pb-10 sm:pb-14">
      <div className="container-page">
        <div className="flex flex-col items-start gap-6 rounded-5xl border border-sage-200 bg-white px-6 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-12">
          <div className="flex items-center gap-4">
            <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-sand-100 text-gold-600">
              <Languages className="size-6" />
            </span>
            <div>
              <p className="text-sm font-semibold text-gold-600">منحكي لغتك</p>
              <p className="mt-1 text-ink/70">الفريق والرسائل والمتابعة بالعربي والعبري.</p>
            </div>
          </div>
          <div className="relative h-14 min-w-[260px] overflow-hidden text-end sm:h-16">
            <AnimatePresence mode="wait">
              <motion.p
                key={i}
                dir={HELLOS[i].dir}
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -40, opacity: 0 }}
                transition={{ duration: 0.5, ease: EASE }}
                className="text-4xl font-bold text-ink sm:text-5xl"
              >
                {HELLOS[i].t}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ═════════ 5. الختام ═════════ */
function Ending() {
  return (
    <section className="pb-16 sm:pb-20">
      <div className="container-page">
        <div className="relative overflow-hidden rounded-5xl bg-forest-900 px-6 pt-10 pb-24 text-white sm:px-12 sm:pt-12 sm:pb-24">
          <div className="pointer-events-none absolute -top-40 size-[460px] rounded-full bg-[radial-gradient(circle,rgba(232,211,198,0.35),transparent_65%)] ltr:-left-40 rtl:-right-40" />
          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="text-5xl leading-[1.1] font-bold sm:text-7xl">
                الجولة الحقيقية <span className="text-copper-300">أحلى.</span>
              </h2>
              <p className="mt-4 max-w-md text-lg text-white/70">تعالي على استشارة، منسمعك فيها ومنفرجيكي العيادة من جوّا.</p>
            </div>
            <motion.a
              href="/contact"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="group inline-flex h-16 shrink-0 items-center gap-4 self-start rounded-full bg-copper-300 ps-8 pe-2 text-lg font-bold text-forest-900 lg:self-auto"
            >
              احجزي استشارة
              <span className="grid size-12 place-items-center rounded-full bg-forest-900 text-copper-300 transition-transform duration-300 group-hover:-rotate-45">
                <ArrowUpLeft className="size-5" />
              </span>
            </motion.a>
          </div>
          <div className="absolute inset-x-[-5%] bottom-6 rotate-[-1.5deg]">
            <Tape labels={['الاستقبال', 'الاستشارة', 'المسح', 'العلاج', 'Green Apple']} />
          </div>
        </div>
      </div>
    </section>
  )
}

export default function AboutPage() {
  return (
    // الحركات بهاي الصفحة بتشتغل دايماً، حتى لو إعداد الحركة بالجهاز مطفي
    <MotionConfig reducedMotion="never">
      <div dir="rtl" className="bg-sand-50">
        <Tour />
        <BlockSim />
        <ScanSection />
        <LanguageBand />
        <Ending />
      </div>
    </MotionConfig>
  )
}
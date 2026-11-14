import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, ChevronLeft, Lock, Moon, ScanLine, Snowflake, Sun } from 'lucide-react'
import { EASE } from '../../lib/motion'
import { NextHero, TodayHero, OfferHero, AfterHero, FrozenHero } from './Heroes'
import { at, fmtDay, fmtTime, fmtWeekday, PATIENT, POLICY, STAGES, PROGRAM, METRICS, BADGES, PREP } from './data'
import { Card, Eyebrow, CountUp, Ring, Burst, StatusChip } from './ui'

/* ═════════ بطاقات الرئيسية ═════════ */
function StatusChips({ strikes, frozen, goHelp, goProgress }) {
  const tone =
    strikes >= 3 ? 'bg-red-50 text-red-700 ring-red-200' : strikes === 2 ? 'bg-amber-50 text-amber-800 ring-amber-300' : 'bg-white text-ink/70 ring-sage-200'
  return (
    <div className="flex flex-wrap gap-2">
      <span
        className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold ring-1 ${frozen ? 'bg-sage-100 text-ink/60 ring-sage-200' : 'bg-forest-800 text-white ring-forest-800'}`}
      >
        {frozen ? (
          <Snowflake className="size-3.5" />
        ) : (
          <span className="relative flex size-2">
            <span className="absolute inset-0 animate-ping rounded-full bg-copper-300" />
            <span className="relative size-2 rounded-full bg-copper-300" />
          </span>
        )}
        {frozen ? 'البرنامج موقوف' : 'البرنامج فعّال'}
      </span>
      <button
        type="button"
        onClick={goProgress}
        className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-ink/70 ring-1 ring-sage-200 transition hover:ring-copper-300"
      >
        المرحلة {PROGRAM.stage} · الشهر {PROGRAM.stageMonth} من {STAGES[0].months}
      </button>
      <button
        type="button"
        onClick={goHelp}
        className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ring-1 transition hover:ring-copper-300 ${tone}`}
      >
        <span className="flex gap-0.5">
          {Array.from({ length: POLICY.maxStrikes }).map((_, i) => (
            <span key={i} className={`size-1.5 rounded-full ${i < strikes ? (strikes >= 3 ? 'bg-red-600' : 'bg-amber-500') : 'bg-sage-200'}`} />
          ))}
        </span>
        مخالفات {strikes}/{POLICY.maxStrikes}
      </button>
      {!frozen && <span className="rounded-full bg-copper-300/20 px-3 py-1.5 text-xs font-semibold text-copper-700">🌟 شهر التزام</span>}
    </div>
  )
}

function PrepCard({ appt }) {
  const [done, setDone] = useState(() => PREP.map(() => false))
  const [burst, setBurst] = useState(0)
  const count = done.filter(Boolean).length
  const all = count === PREP.length
  const toggle = (i) => {
    const next = done.map((x, j) => (j === i ? !x : x))
    setDone(next)
    if (next.every(Boolean)) setBurst((b) => b + 1)
  }
  return (
    <Card className="relative flex h-full flex-col p-6">
      {burst > 0 && <Burst key={burst} colors={['#8c4724', '#193327']} />}
      <div className="flex items-start justify-between gap-3">
        <div>
          <Eyebrow>قبل جلسة {fmtWeekday(appt.date)}</Eyebrow>
          <p className="mt-1 text-lg font-bold text-ink">جهّزي حالك</p>
        </div>
        <span className="relative grid place-items-center">
          <Ring value={count} total={PREP.length} size={46} stroke={4} color={all ? '#193327' : '#8c4724'} track="#f3ebe1" />
          <span className="absolute text-[11px] font-bold text-ink">{all ? <Check className="size-4 text-forest-800" /> : `${count}/${PREP.length}`}</span>
        </span>
      </div>
      {appt.scan && (
        <p className="mt-3 flex items-center gap-2 rounded-2xl bg-sand-50 px-3 py-2 text-xs text-ink/70">
          <ScanLine className="size-4 text-copper-600" /> جلستك فيها مسح 3D · احسبي 5 دقايق زيادة
        </p>
      )}
      <ul className="mt-3 space-y-1">
        {PREP.map((t, i) => (
          <li key={t.text}>
            <label
              className={`flex cursor-pointer items-center gap-3 rounded-2xl px-2 py-2 text-sm transition-colors hover:bg-sand-50 ${done[i] ? 'text-ink/40' : 'text-ink'}`}
            >
              <input type="checkbox" className="peer sr-only" checked={done[i]} onChange={() => toggle(i)} />
              <motion.span
                whileHover={{ rotate: -8 }}
                animate={{ scale: done[i] ? [1, 1.25, 1] : 1 }}
                className={`grid size-8 shrink-0 place-items-center rounded-xl transition-colors peer-focus-visible:ring-4 peer-focus-visible:ring-copper-300/30 ${done[i] ? 'bg-forest-800 text-white' : 'bg-sand-100 text-copper-600'}`}
              >
                {done[i] ? <Check className="size-4" /> : <t.icon className="size-4" />}
              </motion.span>
              <span className={done[i] ? 'line-through' : ''}>{t.text}</span>
            </label>
          </li>
        ))}
      </ul>
      <AnimatePresence>
        {all && (
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-auto pt-3 text-xs font-semibold text-forest-800"
          >
            جاهزة! منستناكِ 🌿
          </motion.p>
        )}
      </AnimatePresence>
    </Card>
  )
}

function Sparkline({ values, w = 220, h = 64 }) {
  const min = Math.min(...values)
  const max = Math.max(...values)
  const pts = values.map((v, i) => [w - (i / (values.length - 1)) * (w - 8) - 4, 6 + ((max - v) / (max - min || 1)) * (h - 14)])
  // الخط بينزل يعني تحسّن: منعكس عشان يطلع لفوق
  const flipped = pts.map(([x, y]) => [x, h - y])
  const d = flipped.map(([x, y], i) => `${i ? 'L' : 'M'}${x} ${y}`).join(' ')
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-16 w-full overflow-visible">
      <defs>
        <linearGradient id="spark" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#d9a06a" stopOpacity="0.45" />
          <stop offset="1" stopColor="#d9a06a" stopOpacity="0" />
        </linearGradient>
      </defs>
      <motion.path
        d={`${d} L ${flipped[flipped.length - 1][0]} ${h} L ${flipped[0][0]} ${h} Z`}
        fill="url(#spark)"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      />
      <motion.path
        d={d}
        fill="none"
        stroke="#8c4724"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.2, ease: EASE }}
      />
      <circle cx={flipped.at(-1)[0]} cy={flipped.at(-1)[1]} r="4.5" fill="#8c4724" stroke="white" strokeWidth="2" />
    </svg>
  )
}

function ProgressSnapshot({ goProgress }) {
  const w = METRICS[0]
  const delta = w.values[0] - w.values[w.values.length - 1]
  const pct = Math.round((PROGRAM.stageMonth / STAGES[0].months) * 100)
  return (
    <Card className="flex h-full flex-col p-6">
      <Eyebrow>تقدّمك</Eyebrow>
      <p className="mt-2 flex items-baseline gap-2">
        <span className="text-4xl font-bold text-ink" dir="ltr">
          −<CountUp value={delta} />
        </span>
        <span className="text-sm text-ink/50">cm من الخصر</span>
      </p>
      <Sparkline values={w.values} />
      <div className="mt-3">
        <div className="flex justify-between text-xs text-ink/55">
          <span>المرحلة 1</span>
          <span className="font-bold text-ink">{pct}%</span>
        </div>
        <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-sand-100">
          <motion.div
            className="h-full rounded-full bg-gradient-to-l from-copper-500 to-copper-300"
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 1.2, ease: EASE }}
          />
        </div>
      </div>
      <button type="button" onClick={goProgress} className="mt-auto flex items-center gap-1 pt-4 text-sm font-semibold text-copper-600">
        كل التفاصيل <ChevronLeft className="size-4" />
      </button>
    </Card>
  )
}

function UpcomingMini({ appts, goAppts }) {
  return (
    <Card className="flex h-full flex-col p-6">
      <Eyebrow>المواعيد الجاية</Eyebrow>
      <ul className="mt-3 space-y-2">
        {appts.slice(0, 3).map((a, i) => (
          <motion.li
            key={a.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + i * 0.08 }}
            whileHover={{ x: -4 }}
            className="flex items-center gap-3"
          >
            <span className="grid w-11 shrink-0 rounded-2xl bg-sand-50 py-1.5 text-center">
              <span className="text-[10px] text-ink/45">{fmtWeekday(a.date, 'short')}</span>
              <span className="text-lg leading-none font-bold text-ink">{a.date.getDate()}</span>
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex items-center gap-1.5 font-semibold text-ink">
                {a.title}
                {a.scan && <ScanLine className="size-3.5 text-copper-600" />}
              </span>
              <span className="block text-xs text-ink/50">وصول {fmtTime(a.date)}</span>
            </span>
            <StatusChip status={a.status} />
          </motion.li>
        ))}
      </ul>
      <button type="button" onClick={goAppts} className="mt-auto flex items-center gap-1 pt-4 text-sm font-semibold text-copper-600">
        كل المواعيد <ChevronLeft className="size-4" />
      </button>
    </Card>
  )
}

function BadgesMini({ goProgress }) {
  const earned = BADGES.filter((b) => b.earned)
  const latest = earned[earned.length - 1]
  return (
    <Card className="relative flex h-full flex-col overflow-hidden bg-gradient-to-br from-forest-800 to-forest-950 p-6 text-white">
      <motion.div
        className="pointer-events-none absolute -top-10 -left-10 size-40 rounded-full bg-copper-300/20 blur-2xl"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 5, repeat: Infinity }}
      />
      <Eyebrow className="relative !text-copper-300">آخر شارة</Eyebrow>
      <div className="relative mt-3 flex items-center gap-4">
        <motion.span
          initial={{ rotate: -20, scale: 0.6 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 12, delay: 0.2 }}
          className="grid size-16 place-items-center rounded-full bg-gradient-to-br from-copper-300 to-copper-500 text-forest-950 shadow-lg shadow-black/30 ring-4 ring-white/10"
        >
          <latest.icon className="size-7" />
        </motion.span>
        <span>
          <span className="block text-lg font-bold">{latest.title}</span>
          <span className="block text-xs text-white/60">{latest.text}</span>
        </span>
      </div>
      <div className="relative mt-5 flex gap-2">
        {BADGES.map((b) => (
          <span
            key={b.title}
            title={b.title}
            className={`grid size-9 place-items-center rounded-full ${b.earned ? 'bg-white/15 text-copper-300' : 'bg-white/5 text-white/25'}`}
          >
            {b.earned ? <b.icon className="size-4" /> : <Lock className="size-3.5" />}
          </span>
        ))}
      </div>
      <button type="button" onClick={goProgress} className="relative mt-auto flex items-center gap-1 pt-4 text-sm font-semibold text-copper-300">
        {earned.length} من {BADGES.length} شارات <ChevronLeft className="size-4" />
      </button>
    </Card>
  )
}

function PrepTipsMini() {
  return (
    <Card className="flex h-full flex-col p-6">
      <Eyebrow>نصيحة الأسبوع</Eyebrow>
      <p className="mt-3 text-lg leading-8 font-semibold text-ink">المشي 20 دقيقة بعد كل جلسة بيساعد الجسم يتخلّص من الدهون أسرع.</p>
      <p className="mt-auto pt-3 text-xs text-ink/45">— أخصائية النحت</p>
    </Card>
  )
}

export function HomePage({ ctx }) {
  const { scenario, upcoming, strikes, frozen, offerOpen, setTab, openSheet, confirm, acceptOffer, declineOffer } = ctx
  const next = upcoming[0]
  const greeting = new Date().getHours() < 12 ? 'صباح الخير' : 'مسا الخير'
  let hero
  if (frozen) hero = <FrozenHero onHelp={() => setTab('help')} />
  else if (scenario === 'today' && next) hero = <TodayHero appt={next} />
  else if (scenario === 'offer' && offerOpen && next) hero = <OfferHero from={next} to={at(1, 16, 30)} onAccept={acceptOffer} onDecline={declineOffer} />
  else if (scenario === 'after') hero = <AfterHero next={next} />
  else if (next)
    hero = (
      <NextHero
        appt={next}
        onConfirm={() => confirm(next.id)}
        onMove={() => openSheet('move', next)}
        onCancel={() => openSheet('cancel', next)}
        onHelp={() => setTab('help')}
      />
    )

  return (
    <div className="space-y-5">
      <div>
        <p className="flex items-center gap-1.5 text-sm text-ink/50">
          <motion.span
            animate={new Date().getHours() < 17 ? { rotate: 360 } : { rotate: [-10, 10, -10] }}
            transition={new Date().getHours() < 17 ? { duration: 12, repeat: Infinity, ease: 'linear' } : { duration: 3, repeat: Infinity }}
            className="inline-grid"
          >
            {new Date().getHours() < 17 ? <Sun className="size-4 text-copper-500" /> : <Moon className="size-4 text-copper-500" />}
          </motion.span>
          {greeting} · {fmtDay(new Date())}
        </p>
        <h1 className="mt-1 text-3xl font-bold text-ink sm:text-4xl">
          أهلا {PATIENT.name}{' '}
          <motion.span className="inline-block origin-bottom-right" animate={{ rotate: [0, 18, -8, 18, 0] }} transition={{ duration: 1.4, delay: 0.5 }}>
            👋
          </motion.span>
        </h1>
        <div className="mt-4">
          <StatusChips strikes={strikes} frozen={frozen} goHelp={() => setTab('help')} goProgress={() => setTab('progress')} />
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-3 xl:items-start">
        <div className="xl:col-span-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${scenario}-${offerOpen}`}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35 }}
            >
              {hero}
            </motion.div>
          </AnimatePresence>
        </div>
        <div>
          {!frozen && next && scenario !== 'after' ? <PrepCard key={next.id} appt={next} /> : <UpcomingMini appts={upcoming} goAppts={() => setTab('appts')} />}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <ProgressSnapshot goProgress={() => setTab('progress')} />
        {!frozen && scenario !== 'after' ? <UpcomingMini appts={upcoming.slice(1)} goAppts={() => setTab('appts')} /> : <PrepTipsMini />}
        <div className="md:col-span-2 xl:col-span-1">
          <BadgesMini goProgress={() => setTab('progress')} />
        </div>
      </div>
    </div>
  )
}
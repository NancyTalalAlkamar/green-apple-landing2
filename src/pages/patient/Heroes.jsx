import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, CalendarCheck, Car, Check, Clock, Info, Lock, MapPin, MessageCircle, Navigation, ScanLine, Snowflake, Timer, Zap } from 'lucide-react'
import { EASE } from '../../lib/motion'
import { fmtTime, fmtShort, fmtWeekday, fmtMonth, HOUR, PATIENT, CLINIC, wa, POLICY, PROGRAM, AFTERCARE, isLocked } from './data'
import { Card, Eyebrow, useNow, useTilt, Burst } from './ui'

/* ═════════ رؤوس الصفحة الرئيسية حسب الحالة ═════════ */
function DateTile({ date, className = '' }) {
  return (
    <motion.div
      initial={{ rotate: -8, y: 10, opacity: 0 }}
      animate={{ rotate: -4, y: 0, opacity: 1 }}
      whileHover={{ rotate: 0 }}
      transition={{ type: 'spring', stiffness: 200, damping: 16 }}
      className={`w-20 shrink-0 self-start overflow-hidden rounded-3xl bg-white sm:w-24 text-center text-ink shadow-2xl shadow-black/30 ${className}`}
    >
      <div className="bg-copper-600 py-1.5 text-xs font-bold text-white">{fmtWeekday(date)}</div>
      <div className="pt-2 text-4xl leading-none font-bold sm:text-5xl">{date.getDate()}</div>
      <div className="pt-1 pb-3 text-xs text-ink/50">{fmtMonth(date)}</div>
    </motion.div>
  )
}

/* شريط الـ72 ساعة: بيبيّن وين إنتِ هلّق */
function PolicyStrip({ appt, onHelp }) {
  const now = useNow(60000)
  const windowH = 7 * 24
  const leftH = Math.max(0, (appt.date - now) / HOUR)
  const pos = Math.min(100, Math.max(0, (1 - leftH / windowH) * 100))
  const free = leftH > POLICY.freeHours
  const deadline = new Date(appt.date.getTime() - POLICY.freeHours * HOUR)
  return (
    <button type="button" onClick={onHelp} className="relative block w-full border-t border-white/10 px-6 py-4 text-start transition hover:bg-white/5 sm:px-8">
      <div className="flex items-center justify-between gap-3 text-xs">
        <span className={free ? 'text-white/75' : 'text-amber-200'}>
          {free ? (
            <>
              النقل والإلغاء <b className="text-white">مجاني</b> لحد {fmtShort(deadline)}
            </>
          ) : (
            <>فات وقت التغيير المجاني · أي نقل أو إلغاء بينحسب مخالفة</>
          )}
        </span>
        <Info className="size-4 shrink-0 text-white/40" />
      </div>
      <div className="relative mt-3 flex h-1.5 gap-1">
        <span className="rounded-full bg-white/25" style={{ width: `${((windowH - POLICY.freeHours) / windowH) * 100}%` }} />
        <span className="flex-1 rounded-full bg-amber-300/60" />
        <motion.span
          className="absolute -top-1.5 size-4.5 translate-x-1/2"
          initial={{ right: '0%' }}
          animate={{ right: `${pos}%` }}
          transition={{ duration: 1.2, ease: EASE }}
        >
          <motion.span
            className="absolute inset-0 rounded-full bg-white"
            animate={{ scale: [1, 2.4], opacity: [0.6, 0] }}
            transition={{ duration: 1.6, repeat: Infinity }}
          />
          <span className="absolute inset-0 rounded-full bg-white shadow-lg" />
        </motion.span>
      </div>
      <div className="mt-2 flex justify-between text-[10px] text-white/40">
        <span>قبل أسبوع</span>
        <span>72 ساعة</span>
        <span>الموعد</span>
      </div>
    </button>
  )
}

export function NextHero({ appt, onConfirm, onMove, onCancel, onHelp }) {
  const now = useNow()
  const ms = Math.max(0, appt.date - now)
  const d = Math.floor(ms / (24 * HOUR))
  const h = Math.floor((ms % (24 * HOUR)) / HOUR)
  const m = Math.floor((ms % HOUR) / 6e4)
  const s = Math.floor((ms % 6e4) / 1e3)
  const [burst, setBurst] = useState(0)
  const confirmed = appt.status === 'confirmed'
  const tilt = useTilt(3)
  return (
    <motion.div {...tilt} className="relative overflow-hidden rounded-4xl bg-forest-900 text-white">
      <svg className="pointer-events-none absolute -bottom-24 -left-24 size-96 text-copper-300/10" viewBox="0 0 200 200" aria-hidden>
        {[90, 70, 50, 30].map((r) => (
          <circle key={r} cx="100" cy="100" r={r} fill="none" stroke="currentColor" strokeWidth="1.5" />
        ))}
      </svg>
      <motion.div
        className="pointer-events-none absolute -top-24 right-1/3 size-80 rounded-full bg-[radial-gradient(circle,rgba(232,211,198,0.25),transparent_65%)]"
        animate={{ x: [0, -120, 40, 0], y: [0, 60, 20, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="relative flex gap-4 p-5 sm:gap-6 sm:p-8">
        <DateTile date={appt.date} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Eyebrow className="!text-copper-300">موعدك الجاي</Eyebrow>
            {appt.scan && (
              <span className="flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-0.5 text-[11px] font-semibold">
                <ScanLine className="size-3.5" /> + مسح 3D · 5 دقايق زيادة
              </span>
            )}
          </div>
          <p className="mt-1 text-3xl font-bold sm:text-4xl">{appt.title}</p>
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/75">
            <span className="flex items-center gap-1.5">
              <Clock className="size-4 text-copper-300" /> وصول <b className="text-white">{fmtTime(appt.date)}</b>
              {isLocked(appt) && (
                <span className="ms-1 flex items-center gap-1 rounded-full bg-white/10 px-2 py-0.5 text-[10px]">
                  <Lock className="size-3" /> مثبّت
                </span>
              )}
            </span>
            <span className="flex items-center gap-1.5">
              <Timer className="size-4 text-copper-300" /> {appt.hours}
            </span>
          </div>

          {/* العدّ التنازلي */}
          <div className="mt-5 flex items-end gap-1.5" dir="ltr">
            {[
              [d, 'يوم'],
              [h, 'ساعة'],
              [m, 'دقيقة'],
              [s, 'ثانية'],
            ].map(([v, l]) => (
              <div key={l} className="text-center">
                <div className="relative h-11 w-12 overflow-hidden rounded-xl bg-white/10 sm:w-14">
                  <AnimatePresence initial={false}>
                    <motion.span
                      key={v}
                      initial={{ y: '-100%' }}
                      animate={{ y: '0%' }}
                      exit={{ y: '100%' }}
                      transition={{ duration: 0.35, ease: EASE }}
                      className="absolute inset-0 grid place-items-center text-xl font-bold tabular-nums"
                    >
                      {String(v).padStart(2, '0')}
                    </motion.span>
                  </AnimatePresence>
                </div>
                <span className="mt-1 block text-[10px] text-white/45">{l}</span>
              </div>
            ))}
          </div>

          <div className="relative mt-6 flex flex-wrap items-center gap-3">
            {burst > 0 && <Burst key={burst} />}
            <AnimatePresence mode="wait">
              {confirmed ? (
                <motion.span
                  key="ok"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex h-12 items-center gap-2 rounded-full bg-white/10 px-5 font-bold text-copper-300 ring-1 ring-copper-300/40"
                >
                  <Check className="size-5" /> حضورك مؤكّد
                </motion.span>
              ) : (
                <motion.button
                  key="btn"
                  type="button"
                  exit={{ scale: 0.9, opacity: 0 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => {
                    setBurst((b) => b + 1)
                    onConfirm()
                  }}
                  className="flex h-12 items-center gap-2 rounded-full bg-copper-300 px-6 font-bold text-forest-900 shadow-lg shadow-black/20 transition hover:bg-white"
                >
                  <CalendarCheck className="size-5" /> أكّدي حضوري
                </motion.button>
              )}
            </AnimatePresence>
            <span className="flex items-center gap-1 text-sm">
              <span className="text-white/45">{confirmed ? 'صار عندك ظرف؟' : ''}</span>
              <button
                type="button"
                onClick={onMove}
                className="rounded-full px-3 py-2 font-semibold text-white/80 underline-offset-4 transition hover:text-white hover:underline"
              >
                نقل
              </button>
              <span className="text-white/25">·</span>
              <button
                type="button"
                onClick={onCancel}
                className="rounded-full px-3 py-2 font-semibold text-red-300/90 underline-offset-4 transition hover:text-red-200 hover:underline"
              >
                إلغاء
              </button>
            </span>
          </div>
        </div>
      </div>
      <PolicyStrip appt={appt} onHelp={onHelp} />
    </motion.div>
  )
}

/* يوم الموعد: كل اللي بتحتاجيه وإنتِ طالعة */
export function TodayHero({ appt }) {
  const now = useNow()
  const ms = Math.max(0, appt.date - now)
  const h = Math.floor(ms / HOUR)
  const m = Math.floor((ms % HOUR) / 6e4)
  const actions = [
    { href: CLINIC.waze, icon: Navigation, label: 'افتحي Waze', primary: true },
    { href: CLINIC.maps, icon: MapPin, label: 'Google Maps' },
    { href: wa(`مرحبا، أنا ${PATIENT.name}، بالطريق لموعد ${fmtTime(appt.date)} 🚗`), icon: Car, label: 'أنا بالطريق' },
    { href: wa(`مرحبا، أنا ${PATIENT.name}، رح أتأخّر شوي عن موعد ${fmtTime(appt.date)}`), icon: Clock, label: 'رح أتأخّر شوي' },
  ]
  return (
    <div className="relative overflow-hidden rounded-4xl bg-forest-900 text-white">
      <div className="relative grid gap-6 p-6 sm:p-8 md:grid-cols-[1fr_1.1fr]">
        <div>
          <Eyebrow className="!text-copper-300">اليوم موعدك 🌿</Eyebrow>
          <p className="mt-2 text-6xl leading-none font-bold tabular-nums" dir="ltr">
            {fmtTime(appt.date)}
          </p>
          <p className="mt-3 text-white/70">
            {appt.title} · بعد{' '}
            <b className="text-white">
              {h > 0 ? `${h} ساعة و` : ''}
              {m} دقيقة
            </b>
          </p>
          <div className="mt-6 grid grid-cols-2 gap-2">
            {actions.map((a) => (
              <a
                key={a.label}
                href={a.href}
                target="_blank"
                rel="noreferrer"
                className={`flex items-center justify-center gap-2 rounded-2xl px-3 py-3 text-sm font-bold transition ${a.primary ? 'bg-copper-300 text-forest-900 hover:bg-white' : 'bg-white/10 text-white hover:bg-white/15'}`}
              >
                <a.icon className="size-4" /> {a.label}
              </a>
            ))}
          </div>
          <p className="mt-4 text-xs leading-5 text-white/50">إذا رح تتأخّري أكتر من 15 دقيقة، ابعتيلنا لنرتّب جلستك.</p>
        </div>

        {/* خريطة مرسومة */}
        <div className="relative min-h-52 overflow-hidden rounded-3xl bg-forest-800">
          <svg viewBox="0 0 300 220" className="absolute inset-0 size-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
            <g stroke="#6b645e" strokeWidth="14" fill="none" strokeLinecap="round">
              <path d="M-10 160 C 80 150, 120 90, 310 70" />
              <path d="M60 -10 L 110 230" />
              <path d="M200 -10 C 190 80, 230 150, 220 230" />
            </g>
            <g stroke="#4d4844" strokeWidth="6" fill="none">
              <path d="M-10 40 L 310 120" />
              <path d="M-10 210 L 310 190" />
            </g>
            <motion.path
              d="M20 200 C 70 170, 100 150, 120 120 S 160 95, 168 98"
              fill="none"
              stroke="#e8d3c6"
              strokeWidth="4"
              strokeDasharray="2 8"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, ease: 'easeInOut' }}
            />
          </svg>
          <div className="absolute top-[38%] left-[56%] -translate-x-1/2 -translate-y-full">
            <motion.span
              className="absolute top-full left-1/2 size-14 -translate-x-1/2 -translate-y-1/2 rounded-full bg-copper-300/30"
              animate={{ scale: [0.6, 1.4], opacity: [0.8, 0] }}
              transition={{ duration: 1.8, repeat: Infinity }}
            />
            <motion.span animate={{ y: [0, -6, 0] }} transition={{ duration: 1.6, repeat: Infinity }} className="relative block">
              <MapPin className="size-10 fill-copper-300 text-forest-950" />
            </motion.span>
          </div>
          <div className="absolute inset-x-3 bottom-3 flex items-center gap-3 rounded-2xl bg-white/95 p-3 text-ink">
            <img src="/images/logo-mark.svg" alt="" className="h-8" />
            <span className="min-w-0">
              <span className="block text-sm font-bold">Green Apple</span>
              <span className="block truncate text-[11px] text-ink/55">{CLINIC.address}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

/* فضي موعد أبكر: عرض بعدّاد 15 دقيقة */
export function OfferHero({ from, to, onAccept, onDecline }) {
  const [deadline] = useState(() => Date.now() + 15 * 6e4)
  const now = useNow()
  const left = Math.max(0, deadline - now)
  const mm = String(Math.floor(left / 6e4)).padStart(2, '0')
  const ss = String(Math.floor((left % 6e4) / 1e3)).padStart(2, '0')
  const expired = left === 0
  const r = 34
  const c = 2 * Math.PI * r
  return (
    <div className="relative overflow-hidden rounded-4xl bg-gradient-to-br from-copper-500 via-copper-600 to-copper-700 text-white">
      <motion.div
        className="pointer-events-none absolute -top-20 -left-20 size-72 rounded-full bg-white/10 blur-2xl"
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      <div className="relative flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:p-8">
        <div className="min-w-0 flex-1">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-bold">
            <motion.span animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1, repeat: Infinity }}>
              <Zap className="size-3.5 fill-white" />
            </motion.span>
            فضي مكان أبكر إلك
          </span>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <span className="text-white/60 line-through decoration-white/50">{fmtShort(from.date)}</span>
            <ArrowLeft className="size-5 text-white/70" />
            <span className="text-2xl font-bold sm:text-3xl">{fmtShort(to)}</span>
          </div>
          <p className="mt-2 text-sm text-white/75">{from.title} · نفس الجلسة، بس أبكر.</p>
          <div className="mt-6 flex flex-wrap gap-2">
            <button
              type="button"
              disabled={expired}
              onClick={onAccept}
              className="flex h-12 items-center gap-2 rounded-full bg-white px-6 font-bold text-gold-700 shadow-lg transition hover:bg-sand-50 disabled:opacity-50"
            >
              <Check className="size-5" /> اقبلي الموعد الجديد
            </button>
            <button
              type="button"
              onClick={onDecline}
              className="h-12 rounded-full px-5 font-semibold text-white/85 ring-1 ring-white/30 transition hover:bg-white/10"
            >
              لا، خلّيني بموعدي
            </button>
          </div>
          <p className="mt-4 text-xs text-white/60">لما تقبلي، موعدك القديم بيتحرّر لحاله لغيرك.</p>
        </div>
        <div className="relative grid size-28 shrink-0 place-items-center self-center">
          <svg viewBox="0 0 80 80" className="absolute inset-0 size-full -rotate-90">
            <circle cx="40" cy="40" r={r} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="5" />
            <circle
              cx="40"
              cy="40"
              r={r}
              fill="none"
              stroke="white"
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray={c}
              strokeDashoffset={c * (1 - left / (15 * 6e4))}
              className="transition-[stroke-dashoffset] duration-1000 ease-linear"
            />
          </svg>
          <div className="text-center">
            <p className="text-2xl font-bold tabular-nums" dir="ltr">
              {mm}:{ss}
            </p>
            <p className="text-[10px] text-white/70">{expired ? 'خلص العرض' : 'باقي للعرض'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

/* بعد الجلسة: عناية وتقييم */
export function AfterHero({ next }) {
  const faces = ['😣', '😕', '😐', '🙂', '😍']
  const [rate, setRate] = useState(null)
  return (
    <Card className="relative overflow-hidden p-6 sm:p-8">
      <div className="pointer-events-none absolute -top-16 -left-16 size-56 rounded-full bg-sage-100" />
      <div className="relative">
        <Eyebrow>خلّصتي جلسة {PROGRAM.sessionsDone} اليوم</Eyebrow>
        <p className="mt-1 text-3xl font-bold text-ink">يعطيكِ العافية 💚</p>
        <p className="mt-2 text-ink/60">
          صار عندك <b className="text-ink">{PROGRAM.sessionsDone}</b> جلسة من {PROGRAM.sessionsTotal}. {next && <>جلستك الجاية {fmtShort(next.date)}.</>}
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {AFTERCARE.map((t, i) => (
            <motion.div
              key={t.title}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.1 }}
              className="flex items-start gap-3 rounded-3xl bg-sand-50 p-4 sm:block"
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-white text-gold-600 shadow-sm">
                <t.icon className="size-5" />
              </span>
              <span className="block">
                <span className="block font-bold text-ink sm:mt-3">{t.title}</span>
                <span className="mt-1 block text-xs leading-5 text-ink/55">{t.text}</span>
              </span>
            </motion.div>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3 rounded-3xl bg-forest-900 px-5 py-4 text-white">
          <span className="text-sm font-semibold">{rate === null ? 'كيف كانت جلستك؟' : 'شكراً! وصلت ملاحظتك للفريق 🌿'}</span>
          <div className="flex gap-1">
            {faces.map((f, i) => (
              <motion.button
                key={f}
                type="button"
                whileHover={{ scale: 1.25, y: -3 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setRate(i)}
                aria-label={`تقييم ${i + 1}`}
                className={`grid size-10 place-items-center rounded-full text-2xl transition ${rate === i ? 'bg-white/20' : rate !== null ? 'opacity-40' : ''}`}
              >
                {f}
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </Card>
  )
}

/* البرنامج موقوف */
export function FrozenHero({ onHelp }) {
  const steps = ['احكي مع الاستقبال', 'منحدد سوا خطة الرجعة', 'منرجع نولّدلك مواعيدك']
  return (
    <Card className="relative overflow-hidden p-6 sm:p-8">
      <motion.div
        className="pointer-events-none absolute -top-6 -left-6 text-sage-200"
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
      >
        <Snowflake className="size-40" strokeWidth={1} />
      </motion.div>
      <div className="relative">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-sage-100 px-3 py-1 text-xs font-bold text-forest-800">
          <Snowflake className="size-3.5" /> البرنامج موقوف مؤقتاً
        </span>
        <p className="mt-4 text-3xl font-bold text-ink">ولا يهمك، منرتّبها سوا</p>
        <p className="mt-2 max-w-lg leading-7 text-ink/60">
          وصلتي {POLICY.maxStrikes} مخالفات بهالشهر، فحسب سياسة العيادة البرنامج توقّف لحد ما نحكي. هاد عشان نضمن إنه خطتك ترجع تمشي صح ونتيجتك ما تتأثر.
        </p>
        <ol className="mt-6 grid gap-2 sm:grid-cols-3">
          {steps.map((s, i) => (
            <li key={s} className="flex items-center gap-3 rounded-2xl bg-sand-50 px-4 py-3 text-sm font-semibold text-ink">
              <span className="grid size-7 shrink-0 place-items-center rounded-full bg-forest-800 text-xs text-white">{i + 1}</span>
              {s}
            </li>
          ))}
        </ol>
        <div className="mt-6 flex flex-wrap gap-2">
          <a
            href={wa(`مرحبا، أنا ${PATIENT.name}. بدي أرتّب رجعة البرنامج.`)}
            target="_blank"
            rel="noreferrer"
            className="flex h-12 items-center gap-2 rounded-full bg-copper-600 px-6 font-bold text-white transition hover:bg-copper-700"
          >
            <MessageCircle className="size-5" /> احكي مع الاستقبال
          </a>
          <button type="button" onClick={onHelp} className="h-12 rounded-full px-5 font-semibold text-ink/70 ring-1 ring-sage-200 transition hover:bg-sand-50">
            شو يعني تجميد؟
          </button>
        </div>
      </div>
    </Card>
  )
}
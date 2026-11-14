import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, ArrowLeft, Bell, Check, Hourglass, LogOut, Moon, RefreshCw, ShieldCheck, Sun, Sunset } from 'lucide-react'
import { fmtTime, fmtShort, fmtWeekday, fmtDate, HOUR, PATIENT, POLICY, isLate } from './data'
import { Toggle } from './ui'

/* ═════════ النوافذ: نقل · إلغاء · قائمة انتظار · بياناتي ═════════ */
export function MoveContent({ appt, strikes, onConfirm, onWaitlist }) {
  const [picked, setPicked] = useState(null)
  const late = isLate(appt)
  const base = appt.date.getTime()
  const sameWeek = [new Date(base - 24 * HOUR + 6.5 * HOUR), new Date(base + 24 * HOUR), new Date(base + 24 * HOUR + 8 * HOUR)].filter((d) => d > Date.now())
  const otherWeeks = [new Date(base + 6 * 24 * HOUR), new Date(base + 8 * 24 * HOUR + 2.5 * HOUR)]
  const outside = picked && otherWeeks.some((d) => d.getTime() === picked.getTime())
  const Slot = ({ d }) => {
    const on = picked?.getTime() === d.getTime()
    return (
      <button
        type="button"
        onClick={() => setPicked(d)}
        className={`flex flex-col items-start rounded-2xl border-2 px-4 py-2.5 text-start transition ${on ? 'border-copper-600 bg-copper-600 text-white' : 'border-sage-200 text-ink hover:border-copper-300'}`}
      >
        <span className={`text-[11px] ${on ? 'text-white/70' : 'text-ink/50'}`}>{fmtWeekday(d)}</span>
        <span className="font-bold tabular-nums" dir="ltr">
          {fmtTime(d)}
        </span>
      </button>
    )
  }
  return (
    <>
      <p className="text-xl font-bold text-ink">نقل {appt.title}</p>
      <p className="mt-1 text-sm text-ink/55">
        الموعد الحالي: {fmtShort(appt.date)} · {fmtDate(appt.date)}
      </p>
      {late && (
        <p className="mt-4 flex items-start gap-2 rounded-2xl bg-amber-50 px-4 py-3 text-xs leading-5 text-amber-800 ring-1 ring-amber-200">
          <Hourglass className="mt-0.5 size-4 shrink-0" />
          باقي أقل من {POLICY.freeHours} ساعة، فالنقل هلّق بينسجّل مخالفة ({strikes} من {POLICY.maxStrikes} هالشهر).
        </p>
      )}
      <div className="mt-5">
        <p className="flex items-center gap-2 text-sm font-bold text-ink">
          نفس الأسبوع
          <span className="rounded-full bg-forest-800/10 px-2 py-0.5 text-[10px] font-bold text-forest-800">مستحسن</span>
        </p>
        <p className="mt-0.5 text-xs text-ink/50">بيحافظ على تسلسل جلساتك.</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {sameWeek.map((d) => (
            <Slot key={d.getTime()} d={d} />
          ))}
        </div>
      </div>
      <div className="mt-5">
        <p className="text-sm font-bold text-ink">أسابيع تانية</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {otherWeeks.map((d) => (
            <Slot key={d.getTime()} d={d} />
          ))}
        </div>
      </div>
      <AnimatePresence>
        {outside && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 flex items-start gap-2 overflow-hidden rounded-2xl bg-amber-50 px-4 py-3 text-xs leading-5 text-amber-800 ring-1 ring-amber-200"
          >
            <AlertTriangle className="mt-0.5 size-4 shrink-0" />
            هاد الوقت برّا أسبوعك، فرح يصير فرق أكبر بين الجلسات. إذا بتقدري، اختاري من نفس الأسبوع.
          </motion.p>
        )}
      </AnimatePresence>
      <button
        type="button"
        disabled={!picked}
        onClick={() => onConfirm(picked)}
        className="mt-6 h-12 w-full rounded-full bg-copper-600 font-bold text-white transition hover:bg-copper-700 disabled:opacity-40"
      >
        {picked ? `أكّدي النقل لـ ${fmtShort(picked)}` : 'اختاري وقت جديد'}
      </button>
      <button type="button" onClick={onWaitlist} className="mt-3 w-full text-center text-sm font-semibold text-copper-600">
        ما في وقت مناسب؟ انضمي لقائمة الانتظار
      </button>
    </>
  )
}

export function CancelContent({ appt, strikes, onMove, onConfirm, onKeep }) {
  const [reason, setReason] = useState(null)
  const late = isLate(appt)
  const reasons = ['مش حاسّة منيح', 'شغل أو سفر', 'ظرف عائلي', 'سبب تاني']
  return (
    <>
      <span className="grid size-12 place-items-center rounded-2xl bg-red-50 text-red-700">
        <AlertTriangle className="size-6" />
      </span>
      <p className="mt-4 text-xl font-bold text-ink">إلغاء {appt.title}؟</p>
      <p className="mt-1 text-sm text-ink/55">
        {fmtShort(appt.date)} · {fmtDate(appt.date)}
      </p>
      {late ? (
        <div className="mt-4 rounded-2xl bg-amber-50 px-4 py-3 ring-1 ring-amber-200">
          <p className="flex items-start gap-2 text-xs leading-5 text-amber-800">
            <Hourglass className="mt-0.5 size-4 shrink-0" /> باقي أقل من {POLICY.freeHours} ساعة، فالإلغاء بينحسب مخالفة.
          </p>
          <p className="mt-2 flex items-center gap-2 text-xs font-bold text-amber-900">
            <span className="flex gap-1">
              {Array.from({ length: POLICY.maxStrikes }).map((_, i) => (
                <span
                  key={i}
                  className={`size-2.5 rounded-full ${i < strikes ? 'bg-amber-500' : i === strikes ? 'animate-pulse bg-amber-500/50' : 'bg-amber-200'}`}
                />
              ))}
            </span>
            رح تصيري {strikes + 1} من {POLICY.maxStrikes}
          </p>
        </div>
      ) : (
        <p className="mt-4 flex items-center gap-2 rounded-2xl bg-forest-800/5 px-4 py-3 text-xs text-forest-800">
          <Check className="size-4" /> الإلغاء مجاني لأنه قبل {POLICY.freeHours} ساعة من الموعد.
        </p>
      )}
      <p className="mt-5 text-sm font-semibold text-ink">شو السبب؟ (اختياري)</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {reasons.map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setReason(reason === r ? null : r)}
            className={`rounded-full border px-3.5 py-1.5 text-sm transition ${reason === r ? 'border-forest-800 bg-forest-800 text-white' : 'border-sage-200 text-ink/70 hover:border-copper-300'}`}
          >
            {r}
          </button>
        ))}
      </div>
      <button
        type="button"
        onClick={onMove}
        className="mt-6 flex w-full items-center gap-3 rounded-2xl border-2 border-copper-300 bg-copper-300/10 px-4 py-3 text-start transition hover:bg-copper-300/20"
      >
        <RefreshCw className="size-5 shrink-0 text-copper-600" />
        <span className="flex-1">
          <span className="block font-bold text-ink">بدل ما تلغي، انقليه</span>
          <span className="block text-xs text-ink/55">هيك ما بتتأخّر خطتك</span>
        </span>
        <ArrowLeft className="size-4 text-copper-600" />
      </button>
      <div className="mt-3 flex gap-2">
        <button type="button" onClick={onKeep} className="h-12 flex-1 rounded-full border border-sage-200 font-semibold text-ink">
          خلّي الموعد
        </button>
        <button
          type="button"
          onClick={() => onConfirm(reason)}
          className="h-12 flex-1 rounded-full bg-red-700 font-bold text-white transition hover:bg-red-800"
        >
          تأكيد الإلغاء
        </button>
      </div>
    </>
  )
}

export function WaitlistContent({ value, onSave }) {
  const days = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس']
  const times = [
    { id: 'am', label: 'الصبح', sub: '9 – 12', icon: Sun },
    { id: 'noon', label: 'الضهر', sub: '12 – 15', icon: Sunset },
    { id: 'pm', label: 'المسا', sub: '15 – 18', icon: Moon },
  ]
  const [d, setD] = useState(value.days)
  const [t, setT] = useState(value.times)
  const toggle = (list, set, x) => set(list.includes(x) ? list.filter((y) => y !== x) : [...list, x])
  return (
    <>
      <span className="grid size-12 place-items-center rounded-2xl bg-copper-300/20 text-copper-600">
        <Bell className="size-6" />
      </span>
      <p className="mt-4 text-xl font-bold text-ink">بدك وقت أبكر أو مختلف؟</p>
      <p className="mt-1 text-sm leading-6 text-ink/55">قوليلنا شو بيناسبك، ولما يفضى وقت منبعتلك عرض بتقبليه بكبسة. العرض بيضل 15 دقيقة.</p>
      <p className="mt-5 text-sm font-bold text-ink">الأيام</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {days.map((x) => (
          <button
            key={x}
            type="button"
            onClick={() => toggle(d, setD, x)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${d.includes(x) ? 'bg-forest-800 text-white' : 'text-ink/70 ring-1 ring-sage-200 hover:ring-copper-300'}`}
          >
            {x}
          </button>
        ))}
      </div>
      <p className="mt-5 text-sm font-bold text-ink">الوقت</p>
      <div className="mt-2 grid grid-cols-3 gap-2">
        {times.map((x) => {
          const on = t.includes(x.id)
          return (
            <button
              key={x.id}
              type="button"
              onClick={() => toggle(t, setT, x.id)}
              className={`flex flex-col items-center gap-1 rounded-2xl py-3 transition ${on ? 'bg-forest-800 text-white' : 'bg-sand-50 text-ink ring-1 ring-sage-200 hover:ring-copper-300'}`}
            >
              <x.icon className={`size-5 ${on ? 'text-copper-300' : 'text-copper-600'}`} />
              <span className="text-sm font-bold">{x.label}</span>
              <span className={`text-[10px] ${on ? 'text-white/60' : 'text-ink/45'}`} dir="ltr">
                {x.sub}
              </span>
            </button>
          )
        })}
      </div>
      <button
        type="button"
        disabled={!d.length || !t.length}
        onClick={() => onSave({ on: true, days: d, times: t })}
        className="mt-6 h-12 w-full rounded-full bg-copper-600 font-bold text-white transition hover:bg-copper-700 disabled:opacity-40"
      >
        حطّيني على قائمة الانتظار
      </button>
      {value.on && (
        <button type="button" onClick={() => onSave({ on: false, days: [], times: [] })} className="mt-3 w-full text-center text-sm font-semibold text-red-700">
          طلّعيني من القائمة
        </button>
      )}
    </>
  )
}

export function ProfileContent({ onLogout }) {
  const [lang, setLang] = useState('ar')
  const [wa1, setWa1] = useState(true)
  const [site, setSite] = useState(true)
  const [mk, setMk] = useState(false)
  return (
    <div className="space-y-4">
      <p className="text-xl font-bold text-ink">بياناتي والإعدادات</p>
      <div className="divide-y divide-sage-200 overflow-hidden rounded-3xl ring-1 ring-sage-200">
        <div className="flex items-center justify-between px-5 py-3.5">
          <span className="text-sm text-ink/55">الاسم</span>
          <span className="font-semibold text-ink">{PATIENT.name}</span>
        </div>
        <div className="flex items-center justify-between px-5 py-3.5">
          <span className="text-sm text-ink/55">رقم الجوال</span>
          <span className="font-semibold text-ink" dir="ltr">
            {PATIENT.phone}
          </span>
        </div>
        <div className="flex items-center justify-between px-5 py-3.5">
          <span className="text-sm text-ink/55">اللغة</span>
          <div className="flex rounded-full bg-sand-100 p-1">
            {[
              ['ar', 'عربي'],
              ['he', 'עברית'],
            ].map(([id, l]) => (
              <button
                key={id}
                type="button"
                onClick={() => setLang(id)}
                className={`relative rounded-full px-4 py-1.5 text-sm font-semibold ${lang === id ? 'text-white' : 'text-ink/60'}`}
              >
                {lang === id && <motion.span layoutId="pp-lang" className="absolute inset-0 rounded-full bg-forest-800" />}
                <span className="relative">{l}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      <p className="text-xs font-semibold text-ink/50">الإشعارات</p>
      <div className="divide-y divide-sage-200 overflow-hidden rounded-3xl ring-1 ring-sage-200">
        {[
          ['تذكير المواعيد على WhatsApp', 'قبل 24 ساعة من كل موعد', wa1, setWa1],
          ['إشعارات هون بحسابي', 'تغييرات المواعيد ونتائج المسح', site, setSite],
          ['عروض وأخبار العيادة', 'بتقدري تغيّري رأيك بأي وقت', mk, setMk],
        ].map(([t, s, on, set]) => (
          <div key={t} className="flex items-center justify-between gap-4 px-5 py-3.5">
            <span>
              <span className="block text-sm font-semibold text-ink">{t}</span>
              <span className="block text-xs text-ink/50">{s}</span>
            </span>
            <Toggle on={on} onChange={set} label={t} />
          </div>
        ))}
      </div>
      <p className="flex items-start gap-2 text-xs leading-6 text-ink/50">
        <ShieldCheck className="mt-0.5 size-4 shrink-0 text-copper-600" /> بياناتك الصحية محمية، وما حدا بيشوفها غير الفريق المعالج.
      </p>
      <button
        type="button"
        onClick={onLogout}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-full border border-red-200 text-sm font-semibold text-red-700 transition hover:bg-red-50"
      >
        <LogOut className="size-4" /> تسجيل الخروج
      </button>
    </div>
  )
}
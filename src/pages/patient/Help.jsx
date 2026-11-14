import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CalendarDays, Check, Hourglass, MessageCircle, Navigation, Plus, RefreshCw } from 'lucide-react'
import { WHATSAPP_URL } from '../../data/content'
import { CLINIC, POLICY, AFTERCARE, FAQ } from './data'
import { Card, Eyebrow } from './ui'

/* ═════════ المساعدة ═════════ */
function PolicyVisual({ strikes }) {
  return (
    <Card className="p-6 sm:p-8">
      <Eyebrow>سياسة المواعيد ببساطة</Eyebrow>
      <p className="mt-1 text-2xl font-bold text-ink">مش عقوبة، هي عشان نتيجتك</p>
      <p className="mt-2 max-w-xl text-sm leading-7 text-ink/60">
        كل موعد إلك محجوز إلك جهاز وغرفة ومعالِجة. لما نعرف بكّير، منعطي الوقت لغيرك، وخطتك بتضل ماشية بتسلسلها.
      </p>

      <div className="mt-8">
        <div className="flex h-14 overflow-hidden rounded-2xl text-xs font-bold">
          <div className="flex flex-[4] items-center justify-center gap-1.5 bg-forest-800/10 text-forest-800">
            <Check className="size-4" /> قبل 72 ساعة وأكتر: مجاني
          </div>
          <div className="flex flex-[3] items-center justify-center gap-1.5 bg-amber-100 text-amber-800">
            <Hourglass className="size-4" /> أقل من 72 ساعة: مخالفة
          </div>
          <div className="grid w-16 place-items-center bg-forest-900 text-white">
            <CalendarDays className="size-5" />
          </div>
        </div>
        <div className="mt-2 flex justify-between text-[11px] text-ink/45">
          <span>قبل أسبوع</span>
          <span>قبل 3 أيام</span>
          <span>الموعد</span>
        </div>
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        {[
          { icon: Hourglass, t: '3 مخالفات بالشهر', d: 'البرنامج بيتوقّف مؤقتاً لحد ما نحكي.' },
          { icon: RefreshCw, t: 'بتتصفّر كل شهر', d: 'أول كل شهر بتبلّشي من صفر.' },
          { icon: MessageCircle, t: 'ظرف طارئ؟', d: 'احكي معنا، منتفهّم الحالات الطارئة.' },
        ].map((x) => (
          <div key={x.t} className="rounded-3xl bg-sand-50 p-4">
            <x.icon className="size-5 text-copper-600" />
            <p className="mt-2 font-bold text-ink">{x.t}</p>
            <p className="mt-1 text-xs leading-5 text-ink/55">{x.d}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-3xl bg-forest-900 px-5 py-4 text-white">
        <span className="text-sm">مخالفاتك هالشهر</span>
        <span className="flex items-center gap-3">
          <span className="flex gap-1.5">
            {Array.from({ length: POLICY.maxStrikes }).map((_, i) => (
              <motion.span
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className={`size-3.5 rounded-full ${i < strikes ? (strikes >= 3 ? 'bg-red-400' : 'bg-amber-400') : 'bg-white/20'}`}
              />
            ))}
          </span>
          <b className="tabular-nums">
            {strikes} من {POLICY.maxStrikes}
          </b>
        </span>
        {strikes > 0 && <p className="w-full text-xs text-white/55">آخر وحدة: نقل جلسة 10 قبل 48 ساعة من الموعد.</p>}
      </div>
    </Card>
  )
}

function FaqList() {
  const [open, setOpen] = useState(0)
  return (
    <Card className="p-6 sm:p-8">
      <Eyebrow>أسئلة بتتكرر</Eyebrow>
      <ul className="mt-3 divide-y divide-sage-200">
        {FAQ.map((f, i) => (
          <li key={f.q}>
            <button
              type="button"
              onClick={() => setOpen(open === i ? null : i)}
              className="flex w-full items-center justify-between gap-4 py-4 text-start font-semibold text-ink"
              aria-expanded={open === i}
            >
              {f.q}
              <span
                className={`grid size-7 shrink-0 place-items-center rounded-full transition ${open === i ? 'rotate-45 bg-copper-600 text-white' : 'bg-sand-100 text-ink/50'}`}
              >
                <Plus className="size-4" />
              </span>
            </button>
            <AnimatePresence initial={false}>
              {open === i && (
                <motion.p
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden pb-4 text-sm leading-7 text-ink/60"
                >
                  {f.a}
                </motion.p>
              )}
            </AnimatePresence>
          </li>
        ))}
      </ul>
    </Card>
  )
}

export function HelpPage({ ctx }) {
  return (
    <div className="grid gap-5 lg:grid-cols-3">
      <div className="space-y-5 lg:col-span-2">
        <PolicyVisual strikes={ctx.strikes} />
        <FaqList />
      </div>
      <div className="space-y-5">
        <Card className="p-6">
          <Eyebrow>بعد الجلسة</Eyebrow>
          <ul className="mt-4 space-y-4">
            {AFTERCARE.map((t) => (
              <li key={t.title} className="flex gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-sand-100 text-copper-600">
                  <t.icon className="size-5" />
                </span>
                <span>
                  <span className="block font-bold text-ink">{t.title}</span>
                  <span className="block text-xs leading-5 text-ink/55">{t.text}</span>
                </span>
              </li>
            ))}
          </ul>
        </Card>
        <Card className="bg-forest-900 p-6 text-white">
          <Eyebrow className="!text-copper-300">احكي معنا</Eyebrow>
          <div className="mt-4 grid gap-2">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 rounded-2xl bg-copper-300 px-4 py-3 font-bold text-forest-900 transition hover:bg-white"
            >
              <MessageCircle className="size-5" /> WhatsApp للاستقبال
            </a>
            <a
              href={CLINIC.waze}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3 font-semibold transition hover:bg-white/15"
            >
              <Navigation className="size-5" /> الطريق للعيادة
            </a>
          </div>
          <p className="mt-4 text-xs text-white/50">الأحد – الخميس · 9:00 – 18:00</p>
        </Card>
      </div>
    </div>
  )
}
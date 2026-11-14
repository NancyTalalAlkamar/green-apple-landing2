import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Clock, CreditCard, Download, ShieldCheck } from 'lucide-react'
import { EASE } from '../../lib/motion'
import { fmtDate, PACKAGES, PAYMENTS, nis } from './data'
import { Card, Eyebrow, CountUp, Ring } from './ui'

/* ═════════ الباقة والدفع ═════════ */
function PackageRing({ p }) {
  const [used, setUsed] = useState(false)
  return (
    <motion.button
      type="button"
      onClick={() => setUsed((u) => !u)}
      whileTap={{ scale: 0.92 }}
      whileHover={{ rotate: -6 }}
      className="relative grid shrink-0 place-items-center"
      aria-label="بدّلي بين الباقي والمستعمل"
    >
      <Ring value={p.used} total={p.total} size={96} stroke={8} color={p.color} track="#f3ebe1" />
      <AnimatePresence mode="wait">
        <motion.span
          key={used ? 'u' : 'r'}
          initial={{ opacity: 0, rotateX: 90 }}
          animate={{ opacity: 1, rotateX: 0 }}
          exit={{ opacity: 0, rotateX: -90 }}
          transition={{ duration: 0.25 }}
          className="absolute text-center"
        >
          <span className="block text-2xl leading-none font-bold text-ink">
            <CountUp value={used ? p.used : p.total - p.used} duration={500} />
          </span>
          <span className="text-[10px] text-ink/45">{used ? 'استعملتي' : 'باقي'}</span>
        </motion.span>
      </AnimatePresence>
    </motion.button>
  )
}

export function PlanPage() {
  const remaining = PAYMENTS.total - PAYMENTS.paid
  const nextDue = PAYMENTS.installments.find((p) => !p.paid)
  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        {PACKAGES.map((p) => (
          <Card key={p.id} className="flex items-center gap-5 p-6">
            <PackageRing p={p} />
            <span>
              <Eyebrow>الباقة</Eyebrow>
              <span className="mt-1 block text-lg font-bold text-ink">{p.name}</span>
              <span className="mt-1 block text-sm text-ink/55">
                استعملتي {p.used} من {p.total} جلسة
              </span>
            </span>
          </Card>
        ))}
      </div>

      <Card className="overflow-hidden">
        <div className="grid gap-6 p-6 sm:p-8 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <Eyebrow>الدفعات</Eyebrow>
            <div className="mt-3 flex flex-wrap gap-x-8 gap-y-3">
              {[
                ['المجموع', PAYMENTS.total, 'text-ink'],
                ['دفعتي', PAYMENTS.paid, 'text-forest-800'],
                ['باقي', remaining, 'text-copper-600'],
              ].map(([l, v, c]) => (
                <div key={l}>
                  <p className="text-xs text-ink/50">{l}</p>
                  <p className={`text-2xl font-bold tabular-nums ${c}`} dir="ltr">
                    ₪<CountUp value={v} />
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-sand-100">
              <motion.div
                className="h-full rounded-full bg-forest-800"
                initial={{ width: 0 }}
                animate={{ width: `${(PAYMENTS.paid / PAYMENTS.total) * 100}%` }}
                transition={{ duration: 1.2, ease: EASE }}
              />
            </div>
          </div>
          {nextDue && (
            <div className="rounded-3xl bg-forest-900 p-5 text-white md:w-72">
              <p className="text-xs text-white/55">الدفعة الجاية · {fmtDate(nextDue.date)}</p>
              <p className="mt-1 text-3xl font-bold" dir="ltr">
                {nis(nextDue.amount)}
              </p>
              <a
                href="#"
                className="relative mt-4 flex h-11 items-center justify-center gap-2 overflow-hidden rounded-full bg-copper-300 font-bold text-forest-900 transition hover:bg-white"
              >
                <motion.span
                  className="pointer-events-none absolute inset-y-0 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/60 to-transparent"
                  animate={{ left: ['-40%', '140%'] }}
                  transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 1.5, ease: 'easeInOut' }}
                />
                <CreditCard className="relative size-4" /> <span className="relative">ادفعي هلّق</span>
              </a>
              <p className="mt-3 flex items-center gap-1.5 text-[11px] text-white/50">
                <ShieldCheck className="size-3.5" /> رابط دفع آمن
              </p>
            </div>
          )}
        </div>
        <ul className="divide-y divide-sage-200 border-t border-sage-200">
          {PAYMENTS.installments.map((p) => (
            <li key={p.label} className="flex items-center gap-3 px-6 py-3.5 sm:px-8">
              <span className={`grid size-8 place-items-center rounded-full ${p.paid ? 'bg-forest-800 text-white' : 'bg-sand-100 text-ink/40'}`}>
                {p.paid ? <Check className="size-4" /> : <Clock className="size-4" />}
              </span>
              <span className="flex-1">
                <span className="block text-sm font-semibold text-ink">{p.label}</span>
                <span className="block text-xs text-ink/45">{fmtDate(p.date)}</span>
              </span>
              <span className="text-sm font-bold text-ink tabular-nums" dir="ltr">
                {nis(p.amount)}
              </span>
              {p.paid ? (
                <a
                  href="#"
                  className="grid size-9 place-items-center rounded-full text-ink/50 transition hover:bg-sand-50 hover:text-ink"
                  aria-label="تنزيل الوصل"
                >
                  <Download className="size-4" />
                </a>
              ) : (
                <span className="w-9" />
              )}
            </li>
          ))}
        </ul>
      </Card>
    </div>
  )
}
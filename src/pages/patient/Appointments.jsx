import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, CalendarCheck, Check, ChevronDown, Hourglass, Lock, RefreshCw, Repeat, ScanLine, X } from 'lucide-react'
import { fmtDay, fmtTime, fmtShort, fmtWeekday, fmtMonth, HOUR, POLICY, PROGRAM, PAST, isLocked, isLate } from './data'
import { Card, Eyebrow, StatusChip } from './ui'

/* ═════════ مواعيدي ═════════ */
function ApptRow({ a, open, onToggle, onConfirm, onMove, onCancel, frozen }) {
  const locked = isLocked(a)
  const late = isLate(a)
  const canConfirm = a.status === 'pending' || a.status === 'scheduled'
  return (
    <li
      className={`overflow-hidden rounded-3xl transition-colors ${open ? 'bg-white shadow-[0_12px_32px_-16px_rgba(28,26,25,0.25)]' : 'bg-white/60 hover:bg-white'}`}
    >
      <button type="button" onClick={onToggle} className="flex w-full items-center gap-3 p-3 text-start sm:gap-4 sm:p-4" aria-expanded={open}>
        <span className={`grid w-12 shrink-0 rounded-2xl py-1.5 text-center ${a.kind === 'laser' ? 'bg-sage-100' : 'bg-sand-100'}`}>
          <span className="text-[10px] text-ink/50">{fmtWeekday(a.date, 'short')}</span>
          <span className="text-xl leading-none font-bold text-ink">{a.date.getDate()}</span>
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-1.5">
            <span className="font-bold text-ink">{a.title}</span>
            {a.scan && (
              <span className="flex items-center gap-1 rounded-full bg-copper-300/20 px-2 py-0.5 text-[10px] font-bold text-gold-700">
                <ScanLine className="size-3" /> مسح 3D
              </span>
            )}
          </span>
          <span className="mt-0.5 flex items-center gap-1.5 text-xs text-ink/55">
            وصول {fmtTime(a.date)} · {a.hours}
            {locked && <Lock className="size-3 text-ink/40" />}
          </span>
        </span>
        <StatusChip status={a.status} />
        <ChevronDown className={`size-4 shrink-0 text-ink/40 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="space-y-3 border-t border-sage-200 px-4 py-4">
              <div className="grid gap-2 text-xs text-ink/60 sm:grid-cols-2">
                <p className="flex items-center gap-2">
                  <Lock className="size-3.5 text-ink/40" />
                  {locked ? 'وقت الوصول مثبّت (أقل من 4 أيام)' : `وقت الوصول بيتثبّت ${fmtShort(new Date(a.date.getTime() - POLICY.lockDays * 24 * HOUR))}`}
                </p>
                <p className={`flex items-center gap-2 ${late ? 'text-amber-700' : ''}`}>
                  <Hourglass className="size-3.5" />
                  {late ? 'أي تغيير هلّق بينحسب مخالفة' : `تغيير مجاني لحد ${fmtShort(new Date(a.date.getTime() - POLICY.freeHours * HOUR))}`}
                </p>
              </div>
              {frozen ? (
                <p className="rounded-2xl bg-sage-100 px-3 py-2 text-xs text-ink/60">المواعيد موقوفة لحد ما يرجع البرنامج.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {canConfirm && (
                    <button
                      type="button"
                      onClick={onConfirm}
                      className="flex h-10 items-center gap-1.5 rounded-full bg-forest-800 px-4 text-sm font-bold text-white transition hover:bg-forest-700"
                    >
                      <CalendarCheck className="size-4" /> أكّدي حضوري
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={onMove}
                    className="flex h-10 items-center gap-1.5 rounded-full px-4 text-sm font-semibold text-ink ring-1 ring-sage-200 transition hover:bg-sand-50"
                  >
                    <RefreshCw className="size-4" /> نقل
                  </button>
                  <button
                    type="button"
                    onClick={onCancel}
                    className="flex h-10 items-center gap-1.5 rounded-full px-4 text-sm font-semibold text-red-700 transition hover:bg-red-50"
                  >
                    <X className="size-4" /> إلغاء
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  )
}

export function ApptsPage({ ctx }) {
  const { upcoming, frozen, waitlist, confirm, openSheet } = ctx
  const [view, setView] = useState('next')
  const [open, setOpen] = useState(upcoming[0]?.id)
  const [all, setAll] = useState(false)
  const shown = all ? upcoming : upcoming.slice(0, 6)
  const groups = shown.reduce((acc, a) => {
    const k = fmtMonth(a.date)
    ;(acc[k] = acc[k] || []).push(a)
    return acc
  }, {})
  return (
    <div className="space-y-5">
      <Card className="relative overflow-hidden p-6">
        <div className="flex flex-wrap items-center gap-4">
          <span className="grid size-14 place-items-center rounded-2xl bg-forest-800 text-copper-300">
            <Repeat className="size-6" />
          </span>
          <div className="min-w-0 flex-1">
            <Eyebrow>سلسلة مواعيدك</Eyebrow>
            <p className="mt-0.5 text-xl font-bold text-ink">
              {PROGRAM.cadence} · {upcoming[0] ? `${fmtWeekday(upcoming[0].date)} ${fmtTime(upcoming[0].date)}` : ''}
            </p>
            <p className="mt-0.5 text-xs text-ink/50">المواعيد بتنحجز لحالها لـ 12 أسبوع لقدّام، فما في داعي تحجزي كل مرة.</p>
          </div>
          <button
            type="button"
            onClick={() => openSheet('waitlist')}
            disabled={frozen}
            className={`flex h-11 items-center gap-2 rounded-full px-4 text-sm font-semibold transition disabled:opacity-40 ${waitlist.on ? 'bg-copper-300/20 text-gold-700 ring-1 ring-copper-300' : 'text-ink ring-1 ring-sage-200 hover:bg-sand-50'}`}
          >
            <Bell className="size-4" />
            {waitlist.on ? 'على قائمة الانتظار' : 'بدي وقت أبكر'}
          </button>
        </div>
      </Card>

      <div className="flex w-fit rounded-full bg-white p-1 ring-1 ring-sage-200">
        {[
          ['next', `الجاية (${upcoming.length})`],
          ['past', 'اللي خلصت'],
        ].map(([id, l]) => (
          <button
            key={id}
            type="button"
            onClick={() => setView(id)}
            className={`relative rounded-full px-5 py-2 text-sm font-semibold ${view === id ? 'text-white' : 'text-ink/60'}`}
          >
            {view === id && <motion.span layoutId="appt-view" className="absolute inset-0 rounded-full bg-forest-800" />}
            <span className="relative">{l}</span>
          </button>
        ))}
      </div>

      {view === 'next' ? (
        <div className="space-y-6">
          {Object.entries(groups).map(([month, list]) => (
            <div key={month}>
              <p className="mb-2 px-1 text-sm font-bold text-ink/50">{month}</p>
              <ul className="space-y-2">
                {list.map((a) => (
                  <ApptRow
                    key={a.id}
                    a={a}
                    frozen={frozen}
                    open={open === a.id}
                    onToggle={() => setOpen(open === a.id ? null : a.id)}
                    onConfirm={() => confirm(a.id)}
                    onMove={() => openSheet('move', a)}
                    onCancel={() => openSheet('cancel', a)}
                  />
                ))}
              </ul>
            </div>
          ))}
          {!all && upcoming.length > 6 && (
            <button
              type="button"
              onClick={() => setAll(true)}
              className="mx-auto flex h-11 items-center gap-2 rounded-full px-5 text-sm font-semibold text-gold-600 ring-1 ring-sage-200 transition hover:bg-white"
            >
              اعرضي كل المواعيد ({upcoming.length}) <ChevronDown className="size-4" />
            </button>
          )}
        </div>
      ) : (
        <ul className="space-y-2">
          {PAST.map((p) => (
            <li key={p.id} className="flex items-center gap-3 rounded-3xl bg-white/60 p-4">
              <span className="grid size-10 place-items-center rounded-2xl bg-forest-800 text-white">
                <Check className="size-4" />
              </span>
              <span className="flex-1">
                <span className="block font-semibold text-ink">{p.title}</span>
                <span className="block text-xs text-ink/50">{fmtDay(p.date)}</span>
              </span>
              {p.moved && <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-semibold text-amber-800 ring-1 ring-amber-200">انتقلت</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
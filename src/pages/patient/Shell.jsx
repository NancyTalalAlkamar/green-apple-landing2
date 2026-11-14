import { useState } from 'react'
import { motion } from 'framer-motion'
import { Bell, CalendarDays, ChartLine, House, LifeBuoy, LogOut, MessageCircle, Settings, Wallet } from 'lucide-react'
import { WHATSAPP_URL } from '../../data/content'
import { PATIENT, STAGES, PROGRAM, SCENARIOS } from './data'
import { Ring, Dropdown } from './ui'

/* ═════════ الإشعارات ═════════ */
export function Notifications({ items, setItems }) {
  const [open, setOpen] = useState(false)
  const unread = items.filter((n) => !n.read).length
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={`الإشعارات${unread ? ` (${unread} جديد)` : ''}`}
        className="relative grid size-10 place-items-center rounded-full text-ink/70 transition hover:bg-white hover:text-ink"
      >
        <motion.span key={unread} animate={unread ? { rotate: [0, -16, 14, -10, 8, 0] } : {}} transition={{ duration: 0.7 }}>
          <Bell className="size-5" />
        </motion.span>
        {unread > 0 && (
          <span className="absolute top-1 right-1 grid size-4.5 place-items-center rounded-full bg-copper-600 text-[10px] font-bold text-white ring-2 ring-sand-50">
            {unread}
          </span>
        )}
      </button>
      <Dropdown open={open} onClose={() => setOpen(false)} className="w-[min(22rem,calc(100vw-2rem))]">
        <div className="flex items-center justify-between border-b border-sage-200 px-5 py-4">
          <p className="font-bold text-ink">الإشعارات</p>
          {unread > 0 && (
            <button type="button" onClick={() => setItems((l) => l.map((n) => ({ ...n, read: true })))} className="text-xs font-semibold text-gold-600">
              علّمي الكل كمقروء
            </button>
          )}
        </div>
        <ul className="max-h-96 divide-y divide-sage-200 overflow-y-auto">
          {items.map((n) => (
            <li key={n.id}>
              <button
                type="button"
                onClick={() => setItems((l) => l.map((x) => (x.id === n.id ? { ...x, read: true } : x)))}
                className={`flex w-full items-start gap-3 px-5 py-4 text-start transition hover:bg-sand-50 ${n.read ? '' : 'bg-copper-300/10'}`}
              >
                <span className={`grid size-9 shrink-0 place-items-center rounded-xl ${n.read ? 'bg-sand-100 text-ink/50' : 'bg-copper-600 text-white'}`}>
                  <n.icon className="size-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center justify-between gap-2">
                    <span className={`text-sm ${n.read ? 'font-semibold text-ink/70' : 'font-bold text-ink'}`}>{n.title}</span>
                    <span className="shrink-0 text-[11px] text-ink/40">{n.time}</span>
                  </span>
                  <span className="mt-0.5 block text-xs leading-5 text-ink/55">{n.text}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
        <p className="border-t border-sage-200 px-5 py-3 text-[11px] text-ink/45">التذكيرات المهمة بتوصلك كمان على WhatsApp.</p>
      </Dropdown>
    </div>
  )
}

export function AccountMenu({ onProfile, onLogout }) {
  const [open, setOpen] = useState(false)
  const go = (fn) => () => {
    setOpen(false)
    fn()
  }
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="حسابي"
        className="grid size-10 place-items-center rounded-full bg-copper-300 font-bold text-forest-900 ring-2 ring-white transition hover:ring-copper-300/40"
      >
        {PATIENT.name[0]}
      </button>
      <Dropdown open={open} onClose={() => setOpen(false)} className="w-60">
        <div className="border-b border-sage-200 px-5 py-4">
          <p className="font-bold text-ink">{PATIENT.name}</p>
          <p className="text-xs text-ink/50" dir="ltr">
            {PATIENT.phone}
          </p>
        </div>
        <div className="p-2 text-sm">
          <button type="button" onClick={go(onProfile)} className="flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-ink hover:bg-sand-50">
            <Settings className="size-4 text-ink/50" /> بياناتي والإعدادات
          </button>
          <a href="/" className="flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-ink hover:bg-sand-50">
            <House className="size-4 text-ink/50" /> رجوع للموقع
          </a>
          <button type="button" onClick={go(onLogout)} className="mt-1 flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-red-700 hover:bg-red-50">
            <LogOut className="size-4" /> تسجيل الخروج
          </button>
        </div>
      </Dropdown>
    </div>
  )
}

/* ═════════ الهيكل: قائمة جانبية للكمبيوتر وشريط تحت للموبايل ═════════ */
const NAV = [
  { id: 'home', label: 'الرئيسية', icon: House },
  { id: 'appts', label: 'مواعيدي', icon: CalendarDays },
  { id: 'progress', label: 'تقدّمي', icon: ChartLine },
  { id: 'plan', label: 'الباقة والدفع', short: 'الباقة', icon: Wallet },
  { id: 'help', label: 'المساعدة', icon: LifeBuoy },
]

export function Sidebar({ tab, setTab, frozen }) {
  const pct = Math.round((PROGRAM.stageMonth / STAGES[0].months) * 100)
  return (
    <aside className="sticky top-0 hidden h-svh w-72 shrink-0 flex-col bg-forest-950 p-6 text-white lg:flex">
      <a href="/" className="flex items-center gap-3">
        <img src="/images/logo-mark-white.svg" alt="" className="h-10" />
        <span>
          <span className="block font-bold">Green Apple</span>
          <span className="block text-[11px] text-white/50">منطقة المريضة</span>
        </span>
      </a>

      <nav className="mt-10 space-y-1">
        {NAV.map((n) => {
          const on = n.id === tab
          return (
            <button
              key={n.id}
              type="button"
              onClick={() => setTab(n.id)}
              className={`relative flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-start text-sm font-semibold transition-colors ${on ? 'text-white' : 'text-white/55 hover:text-white'}`}
            >
              {on && (
                <motion.span
                  layoutId="side-pill"
                  className="absolute inset-0 rounded-2xl bg-white/10"
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                />
              )}
              {on && <motion.span layoutId="side-bar" className="absolute top-3 bottom-3 right-0 w-1 rounded-full bg-copper-300" />}
              <n.icon className="relative size-5" />
              <span className="relative">{n.label}</span>
            </button>
          )
        })}
      </nav>

      <div className="mt-auto space-y-3">
        <button
          type="button"
          onClick={() => setTab('progress')}
          className="flex w-full items-center gap-3 rounded-3xl bg-white/5 p-3 text-start ring-1 ring-white/10 transition hover:bg-white/10"
        >
          <span className="relative grid place-items-center">
            <Ring value={frozen ? 0 : PROGRAM.stageMonth} total={STAGES[0].months} size={52} stroke={5} />
            <span className="absolute text-[11px] font-bold">{frozen ? '—' : `${pct}%`}</span>
          </span>
          <span>
            <span className="block text-sm font-bold">المرحلة {PROGRAM.stage}</span>
            <span className="block text-[11px] text-white/55">{frozen ? 'البرنامج موقوف' : `الشهر ${PROGRAM.stageMonth} من ${STAGES[0].months}`}</span>
          </span>
        </button>
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-3 rounded-3xl px-3 py-2 text-sm text-white/60 transition hover:text-white"
        >
          <MessageCircle className="size-4" /> احكي مع الاستقبال
        </a>
      </div>
    </aside>
  )
}

export function BottomNav({ tab, setTab }) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-sage-200 bg-white/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden">
      <div className="grid grid-cols-5">
        {NAV.map((n) => {
          const on = n.id === tab
          return (
            <button
              key={n.id}
              type="button"
              onClick={() => setTab(n.id)}
              className="flex flex-col items-center gap-1 pt-2 pb-2.5"
              aria-current={on ? 'page' : undefined}
            >
              <span className="relative grid h-8 w-14 place-items-center">
                {on && (
                  <motion.span
                    layoutId="bottom-pill"
                    className="absolute inset-0 rounded-full bg-forest-800"
                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                  />
                )}
                <motion.span
                  key={on ? 'on' : 'off'}
                  className="relative"
                  animate={on ? { y: [0, -5, 0], scale: [1, 1.15, 1] } : {}}
                  transition={{ duration: 0.45 }}
                >
                  <n.icon className={`size-5 ${on ? 'text-copper-300' : 'text-ink/50'}`} />
                </motion.span>
              </span>
              <span className={`text-[10px] font-semibold ${on ? 'text-ink' : 'text-ink/50'}`}>{n.short || n.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}

/* شريط العرض التجريبي: بتقدري تفرجي العميلة كل حالات الصفحة */
export function ScenarioBar({ scenario, setScenario }) {
  return (
    <div
      className="flex items-center gap-3 overflow-x-auto rounded-full bg-amber-50 py-1.5 ps-4 pe-1.5 ring-1 ring-amber-200"
      style={{ scrollbarWidth: 'none' }}
    >
      <span className="shrink-0 text-[11px] font-bold text-amber-800">نسخة تجريبية · جرّبي:</span>
      <div className="flex gap-1">
        {SCENARIOS.map((s) => {
          const on = s.id === scenario
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => setScenario(s.id)}
              className={`relative shrink-0 rounded-full px-3 py-1 text-[11px] font-semibold whitespace-nowrap transition-colors ${on ? 'text-white' : 'text-amber-900/70 hover:text-amber-900'}`}
            >
              {on && (
                <motion.span
                  layoutId="scenario-pill"
                  className="absolute inset-0 rounded-full bg-amber-700"
                  transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                />
              )}
              <span className="relative">{s.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
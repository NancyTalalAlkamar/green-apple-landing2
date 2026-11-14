import { useState } from 'react'
import { motion, AnimatePresence, MotionConfig } from 'framer-motion'
import { RefreshCw, X, Zap } from 'lucide-react'
import { EASE } from '../lib/motion'
import { ApptsPage } from './patient/Appointments'
import { HelpPage } from './patient/Help'
import { HomePage } from './patient/Home'
import { Login } from './patient/Login'
import { PlanPage } from './patient/Plan'
import { ProgressPage } from './patient/Progress'
import { MoveContent, CancelContent, WaitlistContent, ProfileContent } from './patient/Sheets'
import { Notifications, AccountMenu, Sidebar, BottomNav, ScenarioBar } from './patient/Shell'
import { at, fmtShort, HOUR, makeAppointments, NOTIFS, store, isLate } from './patient/data'
import { Sheet } from './patient/ui'

/* ─────────────────────────────────────────────
   منطقة المريضة — نسخة تجريبية (واجهة بس).
   الباك اند بيربط: الدخول برمز SMS، المواعيد، القياسات.
   كل البيانات هون وهمية للعرض.
   ───────────────────────────────────────────── */

/* ═════════ اللوحة ═════════ */
function Portal({ onLogout }) {
  const [tab, setTabRaw] = useState('home')
  const [scenario, setScenarioRaw] = useState('normal')
  const [appts, setAppts] = useState(() => makeAppointments('normal'))
  const [strikes, setStrikes] = useState(1)
  const [offerOpen, setOfferOpen] = useState(true)
  const [sheet, setSheet] = useState(null) // { type, appt }
  const [waitlist, setWaitlist] = useState({ on: false, days: [], times: [] })
  const [notifs, setNotifs] = useState(NOTIFS)
  const [toast, setToast] = useState('')
  const frozen = scenario === 'frozen'

  const setTab = (t) => {
    setTabRaw(t)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  const setScenario = (s) => {
    setScenarioRaw(s)
    setAppts(makeAppointments(s))
    setStrikes(s === 'frozen' ? 3 : 1)
    setOfferOpen(true)
    setTabRaw('home')
  }
  const flash = (t) => {
    setToast(t)
    setTimeout(() => setToast(''), 2600)
  }
  const notify = (icon, title, text) => setNotifs((l) => [{ id: Date.now(), icon, title, text, time: 'هلّق', read: false }, ...l])
  const update = (id, patch) => setAppts((l) => l.map((a) => (a.id === id ? { ...a, ...patch } : a)).sort((a, b) => a.date - b.date))
  const upcoming = appts.filter((a) => a.status !== 'cancelled' && a.date > Date.now() - HOUR)
  const close = () => setSheet(null)

  const ctx = {
    scenario,
    upcoming,
    strikes,
    frozen,
    offerOpen,
    waitlist,
    setTab,
    openSheet: (type, appt) => setSheet({ type, appt }),
    confirm: (id) => {
      update(id, { status: 'confirmed' })
      flash('تمام! تأكّد حضورك ✓')
    },
    acceptOffer: () => {
      const next = upcoming[0]
      update(next.id, { date: at(1, 16, 30), status: 'confirmed' })
      setOfferOpen(false)
      notify(Zap, 'انتقل موعدك لوقت أبكر', `${next.title} صار ${fmtShort(at(1, 16, 30))}.`)
      flash('انتقل موعدك لوقت أبكر ✓')
    },
    declineOffer: () => {
      setOfferOpen(false)
      flash('تمام، ضلّيتي بموعدك')
    },
  }

  const titles = { home: 'الرئيسية', appts: 'مواعيدي', progress: 'تقدّمي', plan: 'الباقة والدفع', help: 'المساعدة' }
  const pages = { home: HomePage, appts: ApptsPage, progress: ProgressPage, plan: PlanPage, help: HelpPage }
  const Page = pages[tab]

  return (
    <div className="min-h-svh bg-sand-50 lg:flex">
      <Sidebar tab={tab} setTab={setTab} frozen={frozen} />

      <div className="min-w-0 flex-1">
        {/* الشريط اللي فوق */}
        <header className="sticky top-0 z-30 bg-sand-50/85 backdrop-blur-xl">
          <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:px-6 lg:px-10">
            <a href="/" className="lg:hidden" aria-label="Green Apple">
              <img src="/images/logo-mark.svg" alt="" className="h-9" />
            </a>
            <p className="text-lg font-bold text-ink lg:text-xl">{titles[tab]}</p>
            <div className="ms-auto flex items-center gap-1">
              <Notifications items={notifs} setItems={setNotifs} />
              <AccountMenu onProfile={() => setSheet({ type: 'profile' })} onLogout={onLogout} />
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-4 pt-2 pb-32 sm:px-6 lg:px-10 lg:pb-14">
          <div className="mb-6">
            <ScenarioBar scenario={scenario} setScenario={setScenario} />
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: EASE }}
            >
              <Page ctx={ctx} />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <BottomNav tab={tab} setTab={setTab} />

      {/* النوافذ */}
      <Sheet open={sheet?.type === 'move'} onClose={close}>
        {sheet?.appt && (
          <MoveContent
            appt={sheet.appt}
            strikes={strikes}
            onWaitlist={() => setSheet({ type: 'waitlist' })}
            onConfirm={(date) => {
              if (isLate(sheet.appt)) setStrikes((s) => s + 1)
              update(sheet.appt.id, { date, status: 'confirmed' })
              notify(RefreshCw, 'انتقل موعدك', `${sheet.appt.title} صار ${fmtShort(date)}.`)
              close()
              flash('انتقل موعدك ✓ وبعتنالك تأكيد')
            }}
          />
        )}
      </Sheet>
      <Sheet open={sheet?.type === 'cancel'} onClose={close}>
        {sheet?.appt && (
          <CancelContent
            appt={sheet.appt}
            strikes={strikes}
            onKeep={close}
            onMove={() => setSheet({ type: 'move', appt: sheet.appt })}
            onConfirm={() => {
              if (isLate(sheet.appt)) setStrikes((s) => s + 1)
              update(sheet.appt.id, { status: 'cancelled' })
              notify(X, 'انلغى موعدك', `${sheet.appt.title} انلغى.`)
              close()
              flash('انلغى الموعد')
            }}
          />
        )}
      </Sheet>
      <Sheet open={sheet?.type === 'waitlist'} onClose={close}>
        <WaitlistContent
          value={waitlist}
          onSave={(v) => {
            setWaitlist(v)
            close()
            flash(v.on ? 'انضميتي لقائمة الانتظار ✓' : 'طلعتي من قائمة الانتظار')
          }}
        />
      </Sheet>
      <Sheet open={sheet?.type === 'profile'} onClose={close}>
        <ProfileContent onLogout={onLogout} />
      </Sheet>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            role="status"
            className="fixed inset-x-0 bottom-24 z-[80] mx-auto w-fit rounded-full bg-forest-900 px-5 py-3 text-sm font-semibold text-white shadow-xl lg:bottom-8"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function PatientPage() {
  const [loggedIn, setLoggedIn] = useState(store.get)
  return (
    <MotionConfig reducedMotion="never">
      <div dir="rtl" className="min-h-svh bg-sand-50">
        {/* بدون AnimatePresence هون: الانتقال بين الدخول واللوحة بيكون بظهور ناعم بس */}
        {loggedIn ? (
          <motion.div key="portal" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Portal
              onLogout={() => {
                store.set(false)
                setLoggedIn(false)
                window.scrollTo(0, 0)
              }}
            />
          </motion.div>
        ) : (
          <motion.div key="login" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Login
              onDone={(remember) => {
                store.set(true, remember)
                setLoggedIn(true)
                window.scrollTo(0, 0)
              }}
            />
          </motion.div>
        )}
      </div>
    </MotionConfig>
  )
}
import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, CheckCheck } from 'lucide-react'
import { EASE } from '../../lib/motion'
import SectionHeading from '../ui/SectionHeading'
import Button from '../ui/Button'

function Bubble({ from, children }) {
  const me = from === 'me'
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.35, ease: EASE }}
      className={`flex ${me ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`max-w-[82%] rounded-3xl px-4 py-3 text-[15px] leading-7 shadow-sm ${
          me
            ? 'bg-copper-600 text-white ltr:rounded-br-md rtl:rounded-bl-md'
            : 'bg-white text-ink ltr:rounded-bl-md rtl:rounded-br-md'
        }`}
      >
        {children}
        {me && <CheckCheck className="ms-2 inline size-3.5 text-white/70" />}
      </div>
    </motion.div>
  )
}

function Typing() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex justify-start">
      <div className="flex gap-1 rounded-3xl bg-white px-4 py-3.5 shadow-sm">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="size-2 rounded-full bg-forest-600"
            animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
          />
        ))}
      </div>
    </motion.div>
  )
}

export default function ChatFAQ({ f, waUrl }) {
  // أول سؤال مجاوب من البداية عشان المحادثة ما تكون فاضية
  const [asked, setAsked] = useState([0])
  const [typing, setTyping] = useState(false)
  const boxRef = useRef(null)

  useEffect(() => {
    const box = boxRef.current
    if (box) box.scrollTo({ top: box.scrollHeight, behavior: 'smooth' })
  }, [asked, typing])

  const ask = (i) => {
    if (typing) return
    setAsked((a) => [...a, i])
    setTyping(true)
    setTimeout(() => setTyping(false), 900)
  }

  const remaining = f.items.map((_, i) => i).filter((i) => !asked.includes(i))
  const last = asked[asked.length - 1]

  return (
    <section id="questions" className="scroll-mt-40 pb-20 sm:pb-28">
      <div className="container-page grid items-center gap-10 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
        <div>
          <SectionHeading badge={f.badge} title={f.title} accent={f.accent} />
          <p className="mt-5 max-w-md text-base leading-8 text-ink/70">{f.text}</p>
          <Button href={waUrl} target="_blank" rel="noreferrer" variant="dark" className="mt-7" icon={MessageCircle}>
            {f.continue}
          </Button>
        </div>

        <div className="relative">
          <div className="pointer-events-none absolute -inset-6 -z-10 rounded-[3rem] bg-gradient-to-br from-copper-300/30 via-sand-100 to-sage-100 blur-2xl" />
          <div className="overflow-hidden rounded-5xl border border-sage-200 bg-sage-50 shadow-2xl shadow-forest-900/10">
            {/* رأس المحادثة */}
            <div className="flex items-center gap-3 bg-forest-800 px-5 py-4">
              <span className="relative grid size-11 place-items-center rounded-full bg-forest-700">
                <img src="/images/logo-mark-white.svg" alt="" className="h-6 w-auto" />
                <span className="absolute bottom-0 size-3 rounded-full bg-[#3fbf6a] ring-2 ring-forest-800 ltr:right-0 rtl:left-0" />
              </span>
              <div>
                <p className="font-semibold text-white" dir="ltr">
                  {f.chatName}
                </p>
                <p className="text-xs text-white/60">{f.chatStatus}</p>
              </div>
            </div>

            {/* الرسائل */}
            <div
              ref={boxRef}
              className="h-[420px] space-y-3 overflow-y-auto px-4 py-5 sm:h-[460px] sm:px-6"
              style={{
                scrollbarWidth: 'thin',
                backgroundImage: 'radial-gradient(rgba(52,48,45,0.06) 1px, transparent 1px)',
                backgroundSize: '18px 18px',
              }}
            >
              <Bubble from="clinic">{f.greeting}</Bubble>
              {asked.map((i) => (
                <div key={i} className="space-y-3">
                  <Bubble from="me">{f.items[i].q}</Bubble>
                  {!(typing && i === last) && <Bubble from="clinic">{f.items[i].a}</Bubble>}
                </div>
              ))}
              <AnimatePresence>{typing && <Typing />}</AnimatePresence>
            </div>

            {/* اقتراحات الأسئلة */}
            <div className="border-t border-sage-200 bg-white px-4 py-4 sm:px-6">
              <p className="text-xs text-ink/50">{f.pick}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <AnimatePresence>
                  {remaining.map((i) => (
                    <motion.button
                      key={i}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      type="button"
                      onClick={() => ask(i)}
                      className="rounded-full border border-forest-600/30 px-3.5 py-1.5 text-sm text-forest-800 transition-colors hover:border-forest-800 hover:bg-forest-800 hover:text-white"
                    >
                      {f.items[i].q}
                    </motion.button>
                  ))}
                </AnimatePresence>
                {remaining.length === 0 && (
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-forest-800 px-4 py-2 text-sm font-medium text-white"
                  >
                    <MessageCircle className="size-4" />
                    {f.continue}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
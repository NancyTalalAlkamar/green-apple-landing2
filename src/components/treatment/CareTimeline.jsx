import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { AlertCircle } from 'lucide-react'
import { EASE } from '../../lib/motion'
import SectionHeading from '../ui/SectionHeading'
import { ICONS } from './shared'

function Item({ it, i, tone }) {
  const Icon = ICONS[it.icon]
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.6, delay: i * 0.1, ease: EASE }}
      className="relative"
    >
      <span
        className={`absolute -top-[30px] size-3.5 rounded-full ring-4 ring-white max-lg:hidden ltr:left-6 rtl:right-6 ${
          tone === 'before' ? 'bg-forest-600' : 'bg-copper-300'
        }`}
      />
      <div className={`h-full rounded-3xl p-5 ${tone === 'before' ? 'bg-sage-50' : 'bg-sand-50'}`}>
        <div className="flex items-center gap-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-white text-copper-600 shadow-sm">
            <Icon className="size-4" />
          </span>
          <span className="text-xs font-semibold text-copper-700">{it.when}</span>
        </div>
        <p className="mt-3 text-[15px] leading-7 text-ink">{it.text}</p>
      </div>
    </motion.div>
  )
}

export default function CareTimeline({ c }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.8', 'center 0.5'] })
  const fill = useTransform(scrollYProgress, [0, 1], [0, 1])

  return (
    <section id="care" ref={ref} className="scroll-mt-40 pb-20 sm:pb-28">
      <div className="container-page">
        <SectionHeading badge={c.badge} title={c.title} accent={c.accent} />

        {/* كمبيوتر: خط أفقي، الجلسة بالنص */}
        <div className="mt-14 hidden lg:block">
          <div className="grid grid-cols-[1fr_auto_1fr] items-start gap-6">
            <div>
              <span className="inline-flex rounded-full bg-forest-800 px-3 py-1 text-xs font-semibold text-white">{c.beforeLabel}</span>
              <div className="relative mt-8">
                <div className="absolute inset-x-0 -top-6 h-0.5 overflow-hidden rounded-full bg-sage-200">
                  <motion.div style={{ scaleX: fill }} className="h-full bg-forest-600 ltr:origin-left rtl:origin-right" />
                </div>
                <div className="grid grid-cols-3 gap-3 pt-2">
                  {c.before.map((it, i) => (
                    <Item key={it.when} it={it} i={i} tone="before" />
                  ))}
                </div>
              </div>
            </div>

            <div className="relative flex flex-col items-center pt-6">
              <motion.span
                className="absolute top-6 size-28 rounded-full bg-copper-300/40"
                animate={{ scale: [1, 1.35, 1], opacity: [0.6, 0, 0.6] }}
                transition={{ duration: 2.6, repeat: Infinity, ease: 'easeOut' }}
              />
              <span className="relative grid size-28 place-items-center rounded-full bg-copper-600 text-center text-lg font-bold text-white shadow-xl shadow-copper-600/30">
                {c.sessionLabel}
              </span>
            </div>

            <div>
              <span className="inline-flex rounded-full bg-copper-300 px-3 py-1 text-xs font-semibold text-forest-900">{c.afterLabel}</span>
              <div className="relative mt-8">
                <div className="absolute inset-x-0 -top-6 h-0.5 overflow-hidden rounded-full bg-sand-200">
                  <motion.div style={{ scaleX: fill }} className="h-full bg-copper-300 ltr:origin-left rtl:origin-right" />
                </div>
                <div className="grid grid-cols-3 gap-3 pt-2">
                  {c.after.map((it, i) => (
                    <Item key={it.when} it={it} i={i + 3} tone="after" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* موبايل: خط عمودي */}
        <div className="relative mt-10 lg:hidden">
          <div className="absolute top-2 bottom-2 w-0.5 bg-sage-200 ltr:left-[13px] rtl:right-[13px]" />
          <div className="space-y-3 ps-10">
            <span className="relative inline-flex rounded-full bg-forest-800 px-3 py-1 text-xs font-semibold text-white">{c.beforeLabel}</span>
            {c.before.map((it, i) => (
              <Item key={it.when} it={it} i={i} tone="before" />
            ))}
            <div className="relative py-2">
              <span className="absolute top-1/2 size-7 -translate-y-1/2 rounded-full bg-copper-600 ring-4 ring-copper-300/40 ltr:-left-10 rtl:-right-10" />
              <span className="text-lg font-bold text-copper-600">{c.sessionLabel}</span>
            </div>
            <span className="relative inline-flex rounded-full bg-copper-300 px-3 py-1 text-xs font-semibold text-forest-900">{c.afterLabel}</span>
            {c.after.map((it, i) => (
              <Item key={it.when} it={it} i={i} tone="after" />
            ))}
          </div>
        </div>

        <div className="mt-8 flex items-start gap-3 rounded-2xl border border-copper-300/50 bg-sand-50 p-4 text-sm leading-7 text-copper-700">
          <AlertCircle className="mt-1 size-4 shrink-0" />
          {c.alert}
        </div>
      </div>
    </section>
  )
}
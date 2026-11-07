import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ChevronLeft, ChevronRight, MessageCircle } from 'lucide-react'
import { EASE } from '../../lib/motion'
import Badge from '../ui/Badge'
import Button from '../ui/Button'
import Tape from './Tape'
import { ICONS } from './shared'

function Fact({ f, i }) {
  const Icon = ICONS[f.icon]
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.7 + i * 0.08, ease: EASE }}
      className="glass-dark flex items-center gap-3 rounded-2xl p-3 text-white"
    >
      <span className="grid size-9 shrink-0 place-items-center rounded-full bg-copper-300 text-forest-900">
        <Icon className="size-4" />
      </span>
      <span className="min-w-0">
        <span className="block text-[11px] text-white/65">{f.label}</span>
        <span className="block text-sm font-semibold">{f.value}</span>
      </span>
    </motion.div>
  )
}

function Corners() {
  return ['top-5 left-5 border-t-2 border-l-2', 'top-5 right-5 border-t-2 border-r-2', 'bottom-5 left-5 border-b-2 border-l-2', 'bottom-5 right-5 border-b-2 border-r-2'].map(
    (cls) => <span key={cls} className={`absolute size-8 rounded-sm border-white/70 ${cls}`} />,
  )
}

function ScanLine() {
  return (
    <motion.div
      aria-hidden
      className="absolute inset-x-0 h-px bg-copper-300/90 shadow-[0_0_24px_6px_rgba(217,160,106,0.5)]"
      animate={{ top: ['14%', '70%', '14%'] }}
      transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
    />
  )
}

export default function TreatmentHero({ d, isEn, waUrl }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '14%'])
  const tapeX = useTransform(scrollYProgress, [0, 1], [0, isEn ? -120 : 120])
  const Crumb = isEn ? ChevronRight : ChevronLeft
  const words = d.title.split(' ')

  const crumbs = (
    <nav aria-label="breadcrumb">
      <ol className="flex flex-wrap items-center gap-1.5 text-xs text-ink/60">
        {d.breadcrumb.map((c, i) => (
          <li key={c} className="flex items-center gap-1.5">
            {i < d.breadcrumb.length - 1 ? (
              <a href={i === 0 ? '/' : '/#services'} className="transition-colors hover:text-copper-600">
                {c}
              </a>
            ) : (
              <span aria-current="page" className="font-medium text-ink">
                {c}
              </span>
            )}
            {i < d.breadcrumb.length - 1 && <Crumb className="size-3 opacity-60" />}
          </li>
        ))}
      </ol>
    </nav>
  )

  const title = (cls) => (
    <h1 className={cls}>
      {words.map((w, i) => (
        <span key={i} className="inline-block">
          <motion.span
            className="inline-block"
            initial={{ opacity: 0, y: 30, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.9, delay: 0.1 + i * 0.12, ease: EASE }}
          >
            {w}
          </motion.span>
          {i < words.length - 1 && '\u00A0'}
        </span>
      ))}
    </h1>
  )

  const buttons = (
    <div className="flex flex-wrap gap-3">
      <Button href="#cta" size="lg">
        {d.primary}
      </Button>
      <Button href={waUrl} target="_blank" rel="noreferrer" variant="outline" size="lg" icon={MessageCircle}>
        {d.whatsapp}
      </Button>
    </div>
  )

  return (
    <section ref={ref} id="top" className="relative overflow-hidden bg-sand-50 pb-24 lg:pb-28">
      <div className="pointer-events-none absolute -top-40 size-[560px] rounded-full bg-copper-300/25 blur-[120px] ltr:-left-40 rtl:-right-40" />

      {/* ─── كمبيوتر: النص جنب الصورة ─── */}
      <div className="container-page relative hidden grid-cols-[1fr_1.05fr] items-center gap-14 pt-32 lg:grid">
        <div>
          {crumbs}
          <motion.div className="mt-8" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE }}>
            <Badge>{d.eyebrow}</Badge>
          </motion.div>
          {title('mt-5 text-[5.4rem] leading-[1.02] font-bold text-ink')}
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45, ease: EASE }}
            className="mt-1 text-4xl font-semibold text-copper-600"
          >
            {d.accent}
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6, ease: EASE }}>
            <p className="mt-6 max-w-lg text-lg leading-8 text-ink/75">{d.lead}</p>
            <div className="mt-8">{buttons}</div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94, clipPath: 'inset(8% 8% 8% 8% round 40px)' }}
          animate={{ opacity: 1, scale: 1, clipPath: 'inset(0% 0% 0% 0% round 40px)' }}
          transition={{ duration: 1.2, ease: EASE }}
          className="relative h-[640px] overflow-hidden rounded-5xl"
        >
          <motion.img src={d.heroImage} alt="" style={{ y: imgY, scale: 1.18 }} className="absolute inset-0 size-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-forest-950/75 via-forest-900/5 to-forest-950/20" />
          <Corners />
          <ScanLine />
          <div className="absolute inset-x-6 bottom-16 grid grid-cols-2 gap-2.5">
            {d.facts.map((f, i) => (
              <Fact key={f.label} f={f} i={i} />
            ))}
          </div>
        </motion.div>
      </div>

      {/* ─── موبايل: الصورة هي الواجهة والعنوان عليها ─── */}
      <div className="relative px-3 pt-24 lg:hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: EASE }}
          className="relative h-[68svh] min-h-[480px] overflow-hidden rounded-5xl"
        >
          <motion.img src={d.heroImage} alt="" style={{ y: imgY, scale: 1.18 }} className="absolute inset-0 size-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-forest-950/90 via-forest-950/30 to-forest-950/10" />
          <Corners />
          <ScanLine />
          <div className="absolute inset-x-5 bottom-6 text-white">
            <Badge tone="dark">{d.eyebrow}</Badge>
            {title('mt-4 text-[2.9rem] leading-[1.05] font-bold')}
            <p className="mt-1 text-xl font-semibold text-copper-300">{d.accent}</p>
          </div>
        </motion.div>
        <div className="px-1 pt-6">
          {crumbs}
          <p className="mt-4 text-base leading-8 text-ink/75">{d.lead}</p>
          <div className="mt-6">{buttons}</div>
          <div className="mt-6 grid grid-cols-2 gap-2">
            {d.facts.map((f) => {
              const Icon = ICONS[f.icon]
              return (
                <div key={f.label} className="flex items-center gap-2.5 rounded-2xl border border-sage-200 bg-white p-3">
                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-forest-800 text-copper-300">
                    <Icon className="size-4" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[11px] text-ink/55">{f.label}</span>
                    <span className="block text-[13px] font-semibold text-ink">{f.value}</span>
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* شريط القياس بيقطع تحت الواجهة */}
      <motion.div style={{ x: tapeX }} className="absolute inset-x-[-10%] bottom-6 z-10 -rotate-[2.2deg] lg:bottom-10">
        <Tape labels={d.tape} />
      </motion.div>
    </section>
  )
}
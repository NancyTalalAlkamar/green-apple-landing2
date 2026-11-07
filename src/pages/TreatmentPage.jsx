import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion'
import { ArrowLeft, ArrowRight, MessageCircle } from 'lucide-react'
import { treatments } from '../data/treatments'
import { moreTreatments } from '../data/moreTreatments'
import { WHATSAPP_URL } from '../data/content'
import { useLanguage } from '../context/LanguageContext'
import { EASE, scaleIn } from '../lib/motion'
import Reveal from '../components/ui/Reveal'
import Button from '../components/ui/Button'
import SectionHeading from '../components/ui/SectionHeading'
import TreatmentHero from '../components/treatment/TreatmentHero'
import Story from '../components/treatment/Story'
import Goals from '../components/treatment/Goals'
import FitCheck from '../components/treatment/FitCheck'
import SessionDial from '../components/treatment/SessionDial'
import ProgramPlanner from '../components/treatment/ProgramPlanner'
import CareTimeline from '../components/treatment/CareTimeline'
import Tape from '../components/treatment/Tape'
import ChatFAQ from '../components/treatment/ChatFAQ'
/* ─────────────── شريط الأقسام الثابت (بيبيّن وين إنتِ) ─────────────── */
function SectionNav({ items }) {
  const [active, setActive] = useState(items[0].id)
  const barRef = useRef(null)

  useEffect(() => {
    const els = items.map((i) => document.getElementById(i.id)).filter(Boolean)
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting)
        if (visible.length) setActive(visible[0].target.id)
      },
      { rootMargin: '-35% 0px -60% 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [items])

  // نخلي الزر الفعّال بالنص على الموبايل بدون ما نحرّك الصفحة
  useEffect(() => {
    const bar = barRef.current
    const btn = bar?.querySelector(`[data-id="${active}"]`)
    if (!bar || !btn) return
    const target = btn.offsetLeft - bar.clientWidth / 2 + btn.clientWidth / 2
    bar.scrollTo({ left: target, behavior: 'smooth' })
  }, [active])

  return (
    <div className="sticky top-[76px] z-40 mt-6 sm:top-[84px]">
      <div className="container-page">
        <div className="rounded-full border border-sage-200 bg-white/85 p-1.5 shadow-lg shadow-forest-900/5 backdrop-blur-xl">
          <div ref={barRef} className="flex gap-1 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
            {items.map((it) => (
              <a
                key={it.id}
                data-id={it.id}
                href={`#${it.id}`}
                className={`relative shrink-0 rounded-full px-4 py-2 text-sm whitespace-nowrap transition-colors lg:flex-1 lg:text-center ${
                  active === it.id ? 'text-white' : 'text-ink/70 hover:text-ink'
                }`}
              >
                {active === it.id && (
                  <motion.span
                    layoutId="section-pill"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    className="absolute inset-0 rounded-full bg-forest-800"
                  />
                )}
                <span className="relative">{it.label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─────────────── علاجات مرتبطة ─────────────── */
function Related({ r, isEn }) {
  const Arrow = isEn ? ArrowRight : ArrowLeft
  return (
    <section className="pb-20 sm:pb-24">
      <div className="container-page">
        <SectionHeading title={r.title} accent={r.accent} />
        <Reveal stagger gap={0.12} amount={0.15} className="mt-10 grid gap-4 md:grid-cols-2">
          {r.items.map((it) => (
            <Reveal.Item
              key={it.title}
              variants={scaleIn}
              as="a"
              href={it.href}
              className="group relative block h-[300px] overflow-hidden rounded-4xl sm:h-[340px]"
            >
              <img
                src={it.image}
                alt={it.title}
                loading="lazy"
                className="absolute inset-0 size-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
              <div className="glass-dark absolute inset-x-3 bottom-4 flex items-center justify-between gap-3 rounded-2xl p-4 transition-colors duration-500 group-hover:bg-forest-900/60 sm:bottom-6 sm:p-5">
                <div>
                  <h3 className="text-lg font-semibold text-white">{it.title}</h3>
                  <p className="mt-1 text-sm text-white/80">{it.text}</p>
                </div>
                <span className="grid size-11 shrink-0 place-items-center rounded-full bg-copper-600 text-white transition-transform duration-500 ltr:group-hover:translate-x-1 rtl:group-hover:-translate-x-1">
                  <Arrow className="size-4" />
                </span>
              </div>
            </Reveal.Item>
          ))}
        </Reveal>
      </div>
    </section>
  )
}

/* ─────────────── شريط الموبايل (ما بيغطي المحتوى) ─────────────── */
function MobileBar({ label, waUrl }) {
  const { scrollY } = useScroll()
  const [show, setShow] = useState(false)
  useMotionValueEvent(scrollY, 'change', (y) => {
    const cta = document.getElementById('cta')
    const ctaTop = cta ? cta.getBoundingClientRect().top : Infinity
    // بيختفي لما يوصل قسم الحجز لأنه نفس الهدف
    setShow(y > 520 && ctaTop > window.innerHeight * 0.6)
  })
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.4, ease: EASE }}
          className="fixed inset-x-3 bottom-3 z-50 flex items-center gap-2 rounded-full border border-white/15 bg-forest-900/90 p-2 shadow-2xl shadow-black/20 backdrop-blur-xl lg:hidden"
          style={{ marginBottom: 'env(safe-area-inset-bottom)' }}
        >
          <Button href="#cta" size="md" className="flex-1">
            {label}
          </Button>
          <a
            href={waUrl}
            target="_blank"
            rel="noreferrer"
            aria-label="WhatsApp"
            className="grid size-11 shrink-0 place-items-center rounded-full bg-white text-forest-800"
          >
            <MessageCircle className="size-5" />
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* ───────────── أقسام الصفحة بالترتيب ─────────────
   id = رابط القسم بالشريط · key = اسم المحتوى بملف treatments.js */
const SECTIONS = [
  // الأقسام بتنضاف هون خطوة خطوة
  { id: 'about', key: 'about', render: (v, o) => <Story a={v} isEn={o.isEn} /> },
  { id: 'goals', key: 'goals', render: (v, o) => <Goals g={v} isEn={o.isEn} /> },
  { id: 'fit', key: 'fit', render: (v, o) => <FitCheck f={v} waUrl={o.waUrl} isEn={o.isEn} /> },
  { id: 'session', key: 'session', render: (v) => <SessionDial s={v} /> },
  { id: 'program', key: 'program', render: (v) => <ProgramPlanner p={v} /> },
  {
    id: 'care',
    key: 'care',
    render: (v, o) => (
      <>
        <CareTimeline c={v} />
        <div className="mb-20 rotate-[1deg] sm:mb-28">
          <Tape labels={o.d.tape} duration={46} />
        </div>
      </>
    ),
  },
    { id: 'questions', key: 'faq', render: (v, o) => <ChatFAQ f={v} waUrl={o.waUrl} /> },
]

/* ───────────────────────── الصفحة ───────────────────────── */
export default function TreatmentPage({ slug }) {
   const { lang } = useLanguage() || {}
  const entry = treatments[slug] || moreTreatments[slug]
  // إذا العلاج لسا ما إله نسخة إنجليزي، الصفحة بتطلع بالعربي
  const isEn = lang === 'en' && !!entry?.en
  const d = entry ? entry[isEn ? 'en' : 'ar'] : null

  useEffect(() => {
    if (d) document.title = d.seoTitle
  }, [d])

  if (!d) {
    return (
      <section className="container-page grid min-h-[70vh] place-items-center pt-32 text-center">
        <div>
          <p className="text-2xl font-bold">{isEn ? 'Page not found' : 'الصفحة مش موجودة'}</p>
          <Button href="/" className="mt-6">
            {isEn ? 'Back home' : 'للرئيسية'}
          </Button>
        </div>
      </section>
    )
  }

  const waUrl = `${WHATSAPP_URL}?text=${encodeURIComponent(d.whatsappText)}`
  // أي قسم ما إله محتوى بملف treatments.js بيختفي لحاله، ومعه رابطه بالشريط
  const sections = SECTIONS.filter((s) => d[s.key])
  const navItems = d.nav.filter((n) => sections.some((s) => s.id === n.id))

  return (
    <div dir={isEn ? 'ltr' : 'rtl'}>
      <TreatmentHero d={d} isEn={isEn} waUrl={waUrl} />
      {navItems.length > 0 && <SectionNav items={navItems} />}
      {sections.map(({ id, key, render }) => (
        <div key={id}>{render(d[key], { d, isEn, waUrl })}</div>
      ))}
      {d.related && <Related r={d.related} isEn={isEn} />}
      <MobileBar label={d.mobileBar} waUrl={waUrl} />
    </div>
  )
}
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { services as originalServices } from '../data/content'
import { useLanguage } from '../context/LanguageContext'
import { scaleIn, fadeUp } from '../lib/motion'
import Reveal from '../components/ui/Reveal'
import SectionHeading from '../components/ui/SectionHeading'

function ArrowCircle({ large, isEn }) {
  const Icon = isEn ? ArrowRight : ArrowLeft
  return (
    <span
      className={`grid shrink-0 place-items-center rounded-full bg-copper-600 text-white shadow-lg shadow-black/20 transition-transform duration-500 ${
        isEn ? 'group-hover:translate-x-1' : 'group-hover:-translate-x-1'
      } ${large ? 'size-12' : 'size-10'}`}
    >
      <Icon className="size-4" />
    </span>
  )
}

function ServiceCard({ title, text, image, href = '#cta', large = false, className = '', isEn = false }) {  return (
    <Reveal.Item
      variants={scaleIn}
      as="a"
           href={href}
      className={`group relative block overflow-hidden rounded-4xl ${className}`}
    >
      <img
        src={image}
        alt={title}
        loading="lazy"
        className="absolute inset-0 size-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

      <div
        className={`glass-dark absolute inset-x-3 rounded-2xl sm:inset-x-3 ${
          large ? 'bottom-6 p-5' : 'top-1/2 -translate-y-1/2 p-4 sm:top-auto sm:bottom-6 sm:translate-y-0'
        } flex items-center justify-between gap-3 transition-colors duration-500 group-hover:bg-forest-900/60`}
      >
        <div>
          <h3 className={`font-semibold text-white ${large ? 'text-xl' : 'text-base'}`}>{title}</h3>
          <p className="mt-1.5 text-xs text-white/80 sm:text-sm">{text}</p>
        </div>
        <ArrowCircle large={large} isEn={isEn} />
      </div>
    </Reveal.Item>
  )
}

export default function Services() {
  const { lang } = useLanguage()
  const isEn = lang === 'en'

  // النصوص بناءً على اللغة لمنع أي خطأ في المصفوفات
  const badge = isEn ? 'Our Services' : originalServices.badge
  const titleText = isEn ? 'Start From The Area Or From Your Goal' : originalServices.title
  const accentText = isEn ? '' : originalServices.accent

  const featured = {
    ...originalServices.featured,
    title: isEn ? 'Abdomen & Waist' : originalServices.featured.title,
    text: isEn ? 'A program focused on waistline and abdomen area based on your case assessment.' : originalServices.featured.text,
  }

  const items = originalServices.items.map((item, index) => {
    if (isEn) {
         if (index === 0) {
        return { ...item, title: 'Thighs & Arms', text: 'According to the area you choose.' }
      }
      if (index === 1) {
        return { ...item, title: 'Cellulite & Sagging', text: 'Based on your goal, after assessment.' }
      }
    }
    return item
  })

  const other = {
    title: isEn ? 'Other Services' : originalServices.other.title,
    text: isEn ? 'Detailed & clear treatment pathways' : originalServices.other.text,
        tags: isEn ? ['Laser', 'Skin Care'] : originalServices.other.tags,
    links: originalServices.other.links,
  }

  const TagArrow = isEn ? ArrowRight : ArrowLeft

  return (
    <section id="services" className="py-20 sm:py-24" dir={isEn ? 'ltr' : 'rtl'}>
      <div className="container-page">
        <SectionHeading badge={badge} title={titleText} accent={accentText} />

        <Reveal
          stagger
          gap={0.15}
          amount={0.1}
          className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3 lg:grid-rows-[300px_156px]"
        >
          <ServiceCard
            {...featured}
            large
            isEn={isEn}
            className="min-h-[420px] md:col-span-2 lg:col-span-1 lg:row-span-2 lg:min-h-0"
          />
          {items.map((s, index) => (
            <ServiceCard key={index} {...s} isEn={isEn} className="min-h-[260px] lg:min-h-0" />
          ))}

          {/* "Other services" dark card */}
          <Reveal.Item
            variants={fadeUp}
            className="relative flex flex-col justify-center gap-5 overflow-hidden rounded-4xl bg-forest-800 p-7 md:col-span-2 sm:flex-row sm:items-center sm:justify-between"
          >
            <motion.div
              aria-hidden
              animate={{ scale: [1, 1.15, 1], opacity: [0.35, 0.55, 0.35] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
              className={`pointer-events-none absolute -bottom-20 size-64 rounded-full bg-copper-500 blur-3xl ${
                isEn ? '-right-16' : '-left-16'
              }`}
            />
            <div className="relative">
              <h3 className="text-xl font-semibold text-white">{other.title}</h3>
              <p className="mt-2 text-sm text-white/70">{other.text}</p>
            </div>
            <div className="relative flex flex-wrap gap-2">
                           {other.tags.map((t, i) => (
                <a
                  key={t}
                                    href={other.links?.[i] || '#cta'}
                  className="group inline-flex items-center gap-2 rounded-full border border-white/25 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-white hover:text-forest-800"
                >
                  {t}
                  <TagArrow className={`size-3.5 transition-transform ${isEn ? 'group-hover:translate-x-0.5' : 'group-hover:-translate-x-0.5'}`} />
                </a>
              ))}
            </div>
          </Reveal.Item>
        </Reveal>
      </div>
    </section>
  )
}
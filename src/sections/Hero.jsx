import { useCallback, useEffect, useRef, useState } from 'react'
import {
  motion,
  AnimatePresence,
  MotionConfig,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { hero, bookingUrl } from '../data/content'
import { useLanguage } from '../context/LanguageContext'
import Button from '../components/ui/Button'

/* ─────────────────────────── Settings ─────────────────────────── */
const DURATION = 4500
const SLIDE_TIME = 0.65
const EASE = [0.83, 0, 0.17, 1]
const SOFT = [0.22, 1, 0.36, 1]
const TEXT_START = SLIDE_TIME * 0.35

/* ─────────────────────────── الضباب ───────────────────────────
   ثلاث طبقات بدل الغيمة الدائرية:
   1) تظليل علوي ناعم خلف شريط التنقّل.
   2) ضبابية حقيقية (backdrop-blur) بتزيد تدريجياً من النص لتحت.
   3) ضباب لوني دافئ بتدرّج smoothstep، فما في أي حد ظاهر.
   كلها جوّا السلايد نفسه، فبتتحرك مع الصورة بدون ما نلمس الأنيميشن. */
const MIST_RGB = '250,246,241'
const SCRIM_RGB = '20,41,31'

const SCRIM_TOP = `linear-gradient(180deg,
  rgba(${SCRIM_RGB},0.45) 0%, rgba(${SCRIM_RGB},0.42) 12%, rgba(${SCRIM_RGB},0.35) 25%,
  rgba(${SCRIM_RGB},0.25) 40%, rgba(${SCRIM_RGB},0.15) 55%, rgba(${SCRIM_RGB},0.07) 70%,
  rgba(${SCRIM_RGB},0.02) 85%, rgba(${SCRIM_RGB},0) 100%)`

const MIST = `linear-gradient(180deg,
  rgba(${MIST_RGB},0) 0%, rgba(${MIST_RGB},0.039) 7.5%, rgba(${MIST_RGB},0.141) 15%,
  rgba(${MIST_RGB},0.285) 22.5%, rgba(${MIST_RGB},0.45) 30%, rgba(${MIST_RGB},0.615) 37.5%,
  rgba(${MIST_RGB},0.759) 45%, rgba(${MIST_RGB},0.861) 52.5%, rgba(${MIST_RGB},0.9) 60%,
  rgba(${MIST_RGB},0.92) 100%)`

const BLUR_MASK = `linear-gradient(0deg,
  #000 0%, #000 38%, rgba(0,0,0,0.85) 50%, rgba(0,0,0,0.55) 62%,
  rgba(0,0,0,0.25) 75%, rgba(0,0,0,0.08) 88%, transparent 100%)`

const getSlides = (lang) => {
  if (lang === 'en') {
    return [
      {
        label: 'Program',
        image: '/images/hero.webp',
        eyebrow: 'Personalized Program',
        title: ['Your First Consultation', 'The Start of Your Personal Plan'],
        text: 'Two to three hours with clinic management to understand your goal and set your starting point.',
        chips: ['Consultation with Management', 'Plan Built For Your Goal'],
        primary: { label: 'Book Consultation', href: '#cta' },
        secondary: { label: 'Our Journey', href: '#journey' },
      },
      {
        label: 'Technology',
        image: '/images/room-cellulite.webp',
        eyebrow: 'Devices & Technology',
        title: ['Non-surgical devices', 'Chosen for your plan'],
        text: 'We choose the device and the number of sessions after your assessment, and track progress with consistent measurements.',
        chips: ['Chosen after assessment', 'Progress you can measure'],
        primary: { label: 'Book Your Session', href: '#cta' },
        secondary: { label: 'View Treatments', href: '#services' },
      },
      {
        label: 'Consultation',
        image: '/images/cta-office.webp',
        eyebrow: 'The Right Beginning',
        title: ['Your First Consultation', 'Begin Your Personal Journey'],
        text: 'Comprehensive session with the clinical team to assess your needs and build your bespoke plan.',
        chips: ['Expert Clinical Review', 'Tailored Strategy'],
        primary: { label: 'Book Consultation', href: '#cta' },
        secondary: { label: 'View Treatments', href: '#services' },
      },
      {
        label: 'Tracking',
        image: '/images/room-thighs.webp',
        eyebrow: 'Measured Progress',
        title: ['Clear Results', 'With Every 3D Scan'],
        text: '3D body scan every 3 weeks measuring waist, abdomen, and thighs to track your exact numbers.',
        chips: ['3D Scan Every 3 Weeks', 'Clear Progress Reports'],
        primary: { label: 'Start Journey', href: '#cta' },
        secondary: { label: 'Our Journey', href: '#journey' },
      },
    ]
  }

  if (lang === 'he') {
    return [
      {
        label: 'התוכנית',
        image: '/images/hero.webp',
        eyebrow: 'תוכנית אישית',
        title: ['הייעוץ הראשון שלך', 'תחילת התוכנית האישית שלך'],
        text: 'שעתיים עד שלוש שעות עם הנהלת הקליניקה, כדי להבין את המטרה שלך ולתעד את נקודת ההתחלה.',
        chips: ['ייעוץ עם הנהלת הקליניקה', 'תוכנית שנבנית סביב המטרה שלך'],
        primary: { label: 'לקביעת ייעוץ', href: '#cta' },
        secondary: { label: 'הדרך שלנו', href: '#journey' },
      },
      {
        label: 'הטכנולוגיות',
        image: '/images/room-cellulite.webp',
        eyebrow: 'מכשירים וטכנולוגיה',
        title: ['מכשירים לא ניתוחיים', 'שנבחרים לפי התוכנית שלך'],
        text: 'אנחנו בוחרים את המכשיר ואת מספר הטיפולים אחרי ההערכה, ועוקבים אחרי ההתקדמות במדידות קבועות.',
        chips: ['נבחר אחרי הערכה', 'התקדמות שאפשר למדוד'],
        primary: { label: 'לקביעת טיפול', href: '#cta' },
        secondary: { label: 'לטיפולים שלנו', href: '#services' },
      },
      {
        label: 'הייעוץ',
        image: '/images/cta-office.webp',
        eyebrow: 'ההתחלה הנכונה',
        title: ['הייעוץ הראשון שלך', 'תחילת הדרך האישית שלך'],
        text: 'שעתיים עד שלוש שעות עם הנהלת הקליניקה, שבהן נכיר את המטרה שלך ונתעד את נקודת ההתחלה.',
        chips: ['ייעוץ עם הנהלת הקליניקה', 'תוכנית שנבנית סביב המטרה שלך'],
        primary: { label: 'לקביעת ייעוץ', href: '#cta' },
        secondary: { label: 'לטיפולים שלנו', href: '#services' },
      },
      {
        label: 'המעקב',
        image: '/images/room-thighs.webp',
        eyebrow: 'מעקב במספרים',
        title: ['ההתקדמות שלך ברורה', 'בכל סריקת 3D'],
        text: 'סריקת גוף תלת־ממדית כל 3 שבועות, שמודדת מותניים, בטן וישבן, כדי שתראי את ההבדל במספרים.',
        chips: ['סריקת 3D כל 3 שבועות', 'דוחות התקדמות ברורים'],
        primary: { label: 'להתחיל את הדרך', href: '#cta' },
        secondary: { label: 'הדרך שלנו', href: '#journey' },
      },
    ]
  }

  return [
    {
      label: 'البرنامج',
      image: '/images/hero.webp',
      eyebrow: hero.eyebrow,
      title: hero.title,
      text: hero.text,
      chips: [hero.floating[0].text, hero.floating[1].text],
      primary: { label: hero.primary, href: '#cta' },
      secondary: { label: hero.secondary, href: '#journey' },
    },
    {
      label: 'التقنيات',
      image: '/images/room-cellulite.webp',
      eyebrow: 'الأجهزة والتقنيات',
      title: ['أجهزة غير جراحية', 'بنختارها حسب خطتك'],
      text: 'منختار الجهاز وعدد الجلسات بعد التقييم، ومنتابع التقدّم بقياسات ثابتة.',
      chips: ['اختيار حسب التقييم', 'تقدّم بتقدري تقيسيه'],
      primary: { label: 'احجزي جلستك', href: '#cta' },
      secondary: { label: 'شوفي العلاجات', href: '#services' },
    },
    {
      label: 'الاستشارة',
      image: '/images/cta-office.webp',
      eyebrow: 'البداية الصحيحة',
      title: ['استشارتك الأولى', 'بداية خطتك الشخصية'],
      text: 'ساعتين لثلاث ساعات مع إدارة العيادة، نتعرّف فيها على هدفك ونوثّق نقطة البداية.',
      chips: ['استشارة مع إدارة العيادة', 'خطة مبنية على هدفك'],
      primary: { label: 'احجزي استشارتك', href: '#cta' },
      secondary: { label: 'شوفي العلاجات', href: '#services' },
    },
    {
      label: 'المتابعة',
      image: '/images/room-thighs.webp',
      eyebrow: 'متابعة بالأرقام',
      title: ['تقدّمك واضح', 'مع كل مسح 3D'],
      text: 'مسح ثلاثي الأبعاد كل 3 أسابيع يقيس الخصر والبطن والأرداف، لتشوفي الفرق بالأرقام.',
      chips: ['مسح 3D كل 3 أسابيع', 'تقارير تقدّم واضحة'],
      primary: { label: 'ابدئي رحلتك', href: '#cta' },
      secondary: { label: 'كيف يعمل البرنامج', href: '#journey' },
    },
  ]
}

const getFrame = (isEn) => ({
  enter: (dir) =>
    dir === 0
      ? { x: '0%', scale: 1.08, opacity: 0, borderRadius: 0 }
      : {
          x: isEn ? (dir > 0 ? '100%' : '-100%') : (dir > 0 ? '-100%' : '100%'),
          scale: 0.88,
          opacity: 1,
          borderRadius: 48
        },
  center: {
    x: '0%',
    scale: 1,
    opacity: 1,
    borderRadius: 0,
    transition: {
      x: { duration: SLIDE_TIME, ease: EASE },
      scale: { duration: SLIDE_TIME + 0.4, ease: SOFT },
      opacity: { duration: 0.6 },
      borderRadius: { duration: SLIDE_TIME + 0.15, ease: EASE },
    },
  },
  exit: (dir) => ({
    x: isEn ? (dir > 0 ? '-100%' : '100%') : (dir > 0 ? '100%' : '-100%'),
    scale: 0.88,
    borderRadius: 48,
    transition: { duration: SLIDE_TIME, ease: EASE },
  }),
})

const edge = {
  enter: { opacity: 1 },
  center: { opacity: 0, transition: { duration: SLIDE_TIME, ease: 'easeIn' } },
}

function OpeningTitle({ lines }) {
  return (
    <h1 className="max-w-4xl text-[2.6rem] leading-[1.3] font-extrabold tracking-tight sm:text-[56px] sm:leading-[76px] lg:text-[56px] lg:leading-[76px]">
      {lines.map((line, i) => (
        <motion.span
          key={line}
          className={`block pb-[0.1em] ${i === lines.length - 1 ? 'text-copper-600' : 'text-forest-900'}`}
          initial={{ clipPath: 'inset(-10% 0% -10% 100%)', filter: 'blur(8px)', opacity: 0.4 }}
          animate={{ clipPath: 'inset(-10% 0% -10% 0%)', filter: 'blur(0px)', opacity: 1 }}
          transition={{ duration: 0.9, ease: SOFT, delay: TEXT_START + i * 0.12 }}
        >
          {line}
        </motion.span>
      ))}
    </h1>
  )
}

const rise = (extra = 0) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay: TEXT_START + extra, ease: SOFT },
})

function Chip({ text, className, x }) {
  return (
    <motion.div style={{ x }} className={`pointer-events-none absolute z-30 hidden lg:block ${className}`}>
      <AnimatePresence mode="popLayout">
        <motion.div
          key={text}
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0, transition: { delay: 0.25, type: 'spring', stiffness: 260, damping: 22 } }}
          exit={{ opacity: 0, x: 60, transition: { duration: 0.25 } }}
        >
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="flex items-center gap-2.5 rounded-full border border-white/30 bg-forest-900/80 px-5 py-2.5 text-xs text-white shadow-xl backdrop-blur-md"
          >
            <Sparkles className="size-4 animate-spin text-copper-300" style={{ animationDuration: '4s' }} />
            <span className="font-semibold">{text}</span>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  )
}

function Slide({ data, dir, isEn, lang, imgX, imgY, bgY, contentY, contentOpacity }) {
  const frame = getFrame(isEn)
  return (
    <motion.div
      custom={dir}
      variants={frame}
      initial="enter"
      animate="center"
      exit="exit"
      className="absolute inset-0 overflow-hidden will-change-transform"
    >
      <motion.div style={{ y: bgY }} className="absolute inset-0">
        <motion.img
          src={data.image}
          alt=""
          draggable={false}
          style={{ x: imgX, y: imgY }}
          className="absolute -inset-8 size-[calc(100%+4rem)] max-w-none object-cover"
        />
      </motion.div>

      {/* ── الضباب: 1) تظليل علوي ناعم خلف شريط التنقّل ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 z-10 h-[30%]"
        style={{ backgroundImage: SCRIM_TOP }}
      />

      {/* ── الضباب: 2) ضبابية حقيقية بتزيد تدريجياً لتحت ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[72%]"
        style={{
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          maskImage: BLUR_MASK,
          WebkitMaskImage: BLUR_MASK,
        }}
      />

      {/* ── الضباب: 3) ضباب لوني دافئ بتدرّج ناعم بدون حدود ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[72%]"
        style={{ backgroundImage: MIST }}
      />

      {/* إضاءات خفيفة جانبية لتعزيز التناغم */}
      <div className="absolute -left-20 top-1/3 size-[400px] rounded-full bg-[radial-gradient(circle,_rgba(245,121,3,0.12)_0%,_transparent_70%)] blur-3xl pointer-events-none z-10" />
      <div className="absolute -right-20 top-1/3 size-[400px] rounded-full bg-[radial-gradient(circle,_rgba(245,121,3,0.12)_0%,_transparent_70%)] blur-3xl pointer-events-none z-10" />

      {dir !== 0 && (
        <motion.div
          variants={edge}
          className={`absolute inset-y-0 w-1.5 bg-copper-500 shadow-[0_0_50px_16px_rgba(164,88,47,0.6)] ${
            isEn ? (dir > 0 ? 'left-0' : 'right-0') : (dir > 0 ? 'right-0' : 'left-0')
          }`}
        />
      )}

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="container-page relative z-20 flex h-full flex-col items-center justify-center pt-24 pb-32 text-center"
      >
        <motion.span
          {...rise(0)}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-copper-600/30 bg-white/90 px-5 py-2 text-xs font-bold text-forest-900 shadow-md backdrop-blur"
        >
          <span className="relative flex size-2.5">
            <span className="absolute inset-0 animate-ping rounded-full bg-copper-600/60" />
            <span className="relative size-2.5 rounded-full bg-copper-600" />
          </span>
          {data.eyebrow}
        </motion.span>

        <OpeningTitle lines={data.title} />

        <motion.p
          {...rise(0.35)}
          className="mt-6 max-w-xl text-[20px] leading-[36px] font-semibold text-forest-950/90 sm:text-[20px] sm:leading-[36px]"
        >
          {data.text}
        </motion.p>

        <motion.div {...rise(0.45)} className="mt-9 flex flex-wrap items-center justify-center gap-4">
          <Button href={bookingUrl(lang)} target="_blank" rel="noreferrer" size="lg">
            {data.primary.label}
          </Button>
          <Button
            href={data.secondary.href}
            variant="light"
            size="lg"
            className="bg-white/90 backdrop-blur-md"
          >
            {data.secondary.label}
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

function HeroSlider() {
  const { lang } = useLanguage()
  const isEn = lang === 'en'
  const isHe = lang === 'he'
  const slides = getSlides(lang)

  const sectionRef = useRef(null)
  const inView = useInView(sectionRef, { amount: 0.1 })

  const [slide, setSlide] = useState({ current: 0, dir: 0 })
  const { current, dir } = slide
  const progress = useMotionValue(0)

  const goTo = useCallback(
    (index, direction) => {
      progress.set(0)
      setSlide((s) => {
        const n = slides.length
        const next = (index + n) % n
        if (next === s.current) return s
        return { current: next, dir: direction ?? (next > s.current ? 1 : -1) }
      })
    },
    [progress, slides.length],
  )

  useAnimationFrame((_, delta) => {
    if (!inView) return
    const p = progress.get() + delta / DURATION
    if (p >= 1) {
      progress.set(0)
      setSlide((s) => ({ current: (s.current + 1) % slides.length, dir: 1 }))
    } else {
      progress.set(p)
    }
  })

  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 60, damping: 20 })
  const sy = useSpring(my, { stiffness: 60, damping: 20 })
  const imgX = useTransform(sx, (v) => v * -28)
  const imgY = useTransform(sy, (v) => v * -18)
  const chipX = useTransform(sx, (v) => v * 22)
  const onMouseMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width - 0.5)
    my.set((e.clientY - r.top) / r.height - 0.5)
  }

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] })
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '20%'])
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -110])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  const s = slides[current] || slides[0]

  return (
    <motion.section
      id="top"
      ref={sectionRef}
      tabIndex={-1}
      dir={isEn ? 'ltr' : 'rtl'}
      lang={isEn ? 'en' : isHe ? 'he' : 'ar'}
      aria-roledescription="carousel"
      onMouseMove={onMouseMove}
      className="relative min-h-[700px] touch-pan-y overflow-hidden rounded-b-[3.5rem] bg-sand-100 outline-none select-none sm:min-h-[780px]"
    >
      <AnimatePresence initial={false} custom={dir}>
        <Slide
          key={`${lang}-${current}`}
          data={s}
          dir={dir}
          isEn={isEn}
          lang={lang}
          imgX={imgX}
          imgY={imgY}
          bgY={bgY}
          contentY={contentY}
          contentOpacity={contentOpacity}
        />
      </AnimatePresence>

      <Chip text={s.chips[1]} className="top-40 left-[5%] xl:left-[8%]" x={chipX} />
      <Chip text={s.chips[0]} className="top-40 right-[5%] xl:right-[8%]" x={chipX} />

      <div className="absolute inset-x-0 bottom-6 z-30 sm:bottom-8">
        <div className="container-page flex items-center justify-center">
          <div className="flex flex-1 items-center justify-center gap-2 sm:max-w-lg sm:gap-4">
            {slides.map((sl, i) => (
              <button
                key={sl.label}
                onClick={() => goTo(i)}
                aria-label={`${isEn ? 'Slide' : isHe ? 'שקופית' : 'شريحة'} ${i + 1}: ${sl.label}`}
                aria-current={i === current}
                className="group flex-1 cursor-pointer text-left sm:text-right"
              >
                <span
                  className={`mb-2 hidden text-xs font-semibold transition-colors sm:block ${
                    i === current ? 'text-forest-900' : 'text-forest-900/45 group-hover:text-forest-900/75'
                  }`}
                >
                  {sl.label}
                </span>
                <span className="relative block h-[3px] overflow-hidden rounded-full bg-forest-900/15">
                  <motion.span
                    className={`absolute inset-0 rounded-full bg-copper-600 ${isEn ? 'origin-left' : 'origin-right'}`}
                    style={{ scaleX: i === current ? progress : i < current ? 1 : 0 }}
                  />
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  )
}

export default function Hero() {
  return (
    <MotionConfig reducedMotion="never">
      <HeroSlider />
    </MotionConfig>
  )
}
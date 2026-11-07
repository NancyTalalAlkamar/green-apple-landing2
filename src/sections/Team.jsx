import { useLayoutEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useAnimationFrame } from 'framer-motion'
import { ChevronRight, ChevronLeft } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import SectionHeading from '../components/ui/SectionHeading'

// ⚠️ الأسماء والألقاب مؤقتة — لازم تعتمدها العيادة قبل النشر.
// الصور من مجلد public/images (محلية، فبتفتح بسرعة ودايماً موجودة).
const teamDataAr = {
  badge: 'الفريق',
  title: 'مين رح يرافقك',
  accent: 'بكل خطوة',
  text: 'الاستشارة مع إدارة العيادة، والخطة يضعها المدير السريري، والجلسات مع معالجات متخصصات.',
  members: [
    { name: 'د. أحمد عمر', role: 'المدير السريري', tag: 'خطة العلاج', image: '/images/team-ahmad-1.webp' },
    { name: 'د. الاء احمد', role: 'معالجة متخصصة', tag: 'الجلسات', image: '/images/team-alaa.webp' },
    { name: 'د. رامي حسن', role: 'استشاري تجميل البشرة', tag: 'البشرة', image: '/images/team-ahmad-3.webp' },
    { name: 'د. طارق محمود', role: 'أخصائي تأهيل جسم', tag: 'الجسم', image: '/images/team-ahmad-2.webp' },
  ],
}

const teamDataEn = {
  badge: 'The Team',
  title: 'Who accompanies you',
  accent: 'at every step',
  text: 'Consultation with clinic management, a plan set by the clinical director, and sessions with specialized practitioners.',
  members: [
    { name: 'Dr. Ahmed Omar', role: 'Clinical Director', tag: 'Treatment plan', image: '/images/team-ahmad-1.webp' },
    { name: 'Dr. Alaa Ahmed', role: 'Specialized Practitioner', tag: 'Sessions', image: '/images/team-alaa.webp' },
    { name: 'Dr. Rami Hassan', role: 'Skin Aesthetics Consultant', tag: 'Skin', image: '/images/team-ahmad-3.webp' },
    { name: 'Dr. Tarek Mahmoud', role: 'Body Rehabilitation Specialist', tag: 'Body', image: '/images/team-ahmad-2.webp' },
  ],
}

const COPIES = 3 // بنكرر القائمة عشان الشريط يلف بدون ما يوقف
const SPEED = 40 // سرعة الحركة (بكسل بالثانية) — رقم أكبر = أسرع
const GAP = 16

function perViewFor(w) {
  if (w >= 1024) return 4
  if (w >= 640) return 3
  return 2
}

export default function Team() {
  const { lang } = useLanguage()
  const isEn = lang === 'en'
  const data = isEn ? teamDataEn : teamDataAr
  // بالعربي منقلب الترتيب، عشان أول عضو يبيّن عاليمين
  const list = isEn ? data.members : [...data.members].reverse()
  const n = list.length

  const viewRef = useRef(null)
  const [cardW, setCardW] = useState(260)
  const [hover, setHover] = useState(false)
  const x = useMotionValue(0)
  const pending = useRef(0) // مسافة إضافية لما تكبسي عالأسهم
  const dirSign = isEn ? -1 : 1 // بالعربي الشريط بيمشي لليمين، وبالإنجليزي لليسار
  const copyW = n * (cardW + GAP)

  // عرض البطاقة حسب عرض الشاشة
  useLayoutEffect(() => {
    const measure = () => {
      const w = viewRef.current?.clientWidth || 1000
      const per = perViewFor(window.innerWidth)
      const cw = (w - GAP * (per - 1)) / per
      setCardW(cw)
      x.set(-n * (cw + GAP)) // بنبلّش من النسخة النص
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(viewRef.current)
    return () => ro.disconnect()
  }, [n, x])

  // الحركة لحالها بشكل متواصل، وبتوقف لما توقفي بالماوس
  useAnimationFrame((_, delta) => {
    const dt = Math.min(delta, 64) / 1000
    const nudge = pending.current * 0.12
    pending.current -= nudge
    let v = x.get() + nudge + (hover ? 0 : dirSign * SPEED * dt)
    // بنضل جوّا النسخة النص بدون ما يبيّن القفز
    if (v <= -2 * copyW) v += copyW
    if (v > -copyW) v -= copyW
    x.set(v)
  })

  const move = (dir) => {
    pending.current += dir * dirSign * (cardW + GAP)
  }

  const PrevIcon = isEn ? ChevronLeft : ChevronRight
  const NextIcon = isEn ? ChevronRight : ChevronLeft
  const cards = Array.from({ length: COPIES }).flatMap((_, k) => list.map((m, j) => ({ ...m, key: `${k}-${j}` })))

  return (
    <section id="team" className="pb-20 sm:pb-24" dir={isEn ? 'ltr' : 'rtl'}>
      <div className="container-page">
        <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading badge={data.badge} title={data.title} accent={data.accent} />

          <div className="flex items-center justify-between gap-6 lg:justify-end">
            <p className="max-w-sm text-sm leading-7 text-ink/75">{data.text}</p>
            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={() => move(-1)}
                className="grid size-10 place-items-center rounded-full border border-forest-900/20 transition-colors hover:bg-forest-900 hover:text-white"
                aria-label={isEn ? 'Previous' : 'السابق'}
              >
                <PrevIcon className="size-5" />
              </button>
              <button
                type="button"
                onClick={() => move(1)}
                className="grid size-10 place-items-center rounded-full border border-forest-900/20 transition-colors hover:bg-forest-900 hover:text-white"
                aria-label={isEn ? 'Next' : 'التالي'}
              >
                <NextIcon className="size-5" />
              </button>
            </div>
          </div>
        </div>

        {/* الشريط المتحرك */}
        <div
          ref={viewRef}
          dir="ltr"
          className="relative overflow-hidden pt-2 pb-2"
          style={{
            maskImage: 'linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent)',
            WebkitMaskImage: 'linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent)',
          }}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          onTouchStart={() => setHover(true)}
          onTouchEnd={() => setHover(false)}
        >
          <motion.div className="flex w-max" style={{ x, gap: GAP }}>
            {cards.map((m, i) => (
              <div
                key={m.key}
                dir={isEn ? 'ltr' : 'rtl'}
                aria-hidden={i < n || i >= 2 * n}
                style={{ width: cardW }}
                className="group relative aspect-[3/4] shrink-0 overflow-hidden rounded-4xl bg-sage-100 shadow-sm"
              >
                <img
                  src={m.image}
                  alt={m.name}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 size-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <span className="absolute top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-ink shadow-sm start-4">
                  {m.tag}
                </span>
                <div className="absolute inset-x-3 bottom-3 rounded-2xl border border-white/60 bg-white/80 p-4 backdrop-blur-md transition-transform duration-300 group-hover:-translate-y-1">
                  <h3 className="text-base font-semibold text-forest-900">{m.name}</h3>
                  <p className="mt-0.5 text-xs text-ink/70">{m.role}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus, MessageCircle } from 'lucide-react'
import { WHATSAPP_URL } from '../data/content'
import { useLanguage } from '../context/LanguageContext'
import { EASE, fadeUp, slideFromStart } from '../lib/motion'
import Reveal from '../components/ui/Reveal'
import SectionHeading from '../components/ui/SectionHeading'
import Button from '../components/ui/Button'

// قاموس الأسئلة الشائعة للغتين معاً بشكل مضمون
const allFaqContent = {
  ar: {
    badge: 'الأسئلة الشائعة',
    title: 'قبل ما تبدئي،',
    accent: 'كل اللي بدك تعرفيه',
    help: {
      title: 'سؤالك مش هون؟',
      text: 'راسلنا وبنرد عليك بأقرب وقت.',
      cta: 'اسألينا على WhatsApp',
    },
    items: [
      {
        q: 'كم بتطوّل الاستشارة الأولية؟',
        a: 'بين ساعتين وثلاث ساعات مع إدارة العيادة. نتعرّف فيها على هدفك وحالتك، ومنبي معك خططة العلاج.',
      },
      {
        q: 'هل بحجز جلسات العلاج بنفسي؟',
        a: 'يتم ترتيب جلسات العلاج تلقائياً بناءً على خطتك العلاجية الشخصية والجدول الزمني.',
      },
      {
        q: 'شو سياسة الإلغاء ونقل الموعد؟',
        a: 'يتوفر إعادة جدولة مجانية حتى 72 ساعة قبل الموعد المحدد.',
      },
      {
        q: 'ليش الاستمرارية مهمة؟',
        a: 'تضمن الاستمرارية تقدماً ثابتاً وتتيح لفريق الرعاية متابعة التعديلات بفعالية.',
      },
      {
        q: 'بقدر أتعالج وأنا حامل؟',
        a: 'بعض العلاجات المتخصصة يتم تعديلها أو تأجيلها أثناء الحمل حفاظاً على السلامة، يرجى استشارة المختص.',
      },
      {
        q: 'كل قديش بعمل مسح للجسم؟',
        a: 'يتم إجراء مسح للجسم بتقنية 3D في محطات منتظمة لتقييم التقدم بدقة.',
      },
      {
        q: 'شو طرق الدفع المتاحة؟',
        a: 'ندعم طرق دفع آمنة متعددة والتنسيق المباشر من خلال فريقنا.',
      },
    ],
  },
  en: {
    badge: 'FAQ',
    title: 'Before You Start',
    accent: 'Everything You Need to Know',
    help: {
      title: 'Your question is not here?',
      text: 'Message us and we will reply to you as soon as possible.',
      cta: 'Ask us on WhatsApp',
    },
    items: [
      {
        q: 'How long does the initial consultation take?',
        a: 'Between two to three hours with clinic management. We discuss your goal and condition, and build your treatment plan together.',
      },
      {
        q: 'Can I book treatment sessions by myself?',
        a: 'Treatment sessions are arranged automatically based on your personalized clinical plan and schedule.',
      },
      {
        q: 'What is the cancellation and rescheduling policy?',
        a: 'Free rescheduling is available up to 72 hours before the scheduled appointment.',
      },
      {
        q: 'Why is continuity important?',
        a: 'Continuity ensures steady progress and allows your care team to track adjustments effectively.',
      },
      {
        q: 'Can I undergo treatment while pregnant?',
        a: 'Certain specialized treatments are adjusted or postponed during pregnancy for safety. Consult your specialist.',
      },
      {
        q: 'How often is a body scan performed?',
        a: 'A 3D body scan is conducted at milestone intervals to evaluate progress accurately.',
      },
      {
        q: 'What payment methods are available?',
        a: 'We support multiple secure payment methods and direct coordination through our team.',
      },
    ],
  },
}

function Item({ q, a, open, onToggle, isEn }) {
  return (
    <motion.div
      layout
      className={`overflow-hidden rounded-2xl border transition-colors duration-300 ${
        open ? 'border-transparent bg-sage-50' : 'border-sage-200 bg-white hover:border-sage-200/0 hover:bg-sage-50/60'
      }`}
    >
      <button
        onClick={onToggle}
        aria-expanded={open}
        className={`flex w-full items-center justify-between gap-4 px-5 py-4 ${isEn ? 'text-left' : 'text-right'}`}
      >
        <span className="font-semibold">{q}</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.35, ease: EASE }}
          className={`grid size-7 shrink-0 place-items-center rounded-full ${
            open ? 'bg-forest-800 text-white' : 'bg-sage-100 text-copper-600'
          }`}
        >
          {open ? <Minus className="size-3.5" /> : <Plus className="size-3.5" />}
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
          >
            <p className={`px-5 pb-5 text-sm leading-7 text-ink/75 ${isEn ? 'text-left' : 'text-right'}`}>{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function FAQ() {
  const { lang } = useLanguage() || {}
  const isEn = lang === 'en'

  // جلب البيانات بشكل مباشر بناءً على لغة النظام الحالية دون تأخير
  const currentData = allFaqContent[isEn ? 'en' : 'ar'] || allFaqContent.ar
  const [open, setOpen] = useState(0)

  return (
    <section id="faq" className="pb-20 sm:pb-24" dir={isEn ? 'ltr' : 'rtl'}>
      <div className="container-page grid gap-10 lg:grid-cols-[1fr_1.6fr]">
        
        {/* Heading + help card */}
        <div className={`lg:sticky lg:top-28 lg:self-start ${isEn ? 'text-left' : 'text-right'}`}>
          <SectionHeading badge={currentData.badge} title={currentData.title} accent={currentData.accent} breakLine />
          <Reveal
            variants={slideFromStart}
            className="relative mt-8 overflow-hidden rounded-4xl bg-forest-800 p-6"
          >
            <div className="pointer-events-none absolute -bottom-16 -left-10 size-48 rounded-full bg-copper-500/50 blur-3xl" />
            <div className={`relative ${isEn ? 'text-left' : 'text-right'}`}>
              <h3 className="text-lg font-semibold text-white">{currentData.help.title}</h3>
              <p className="mt-2 text-sm text-white/75">{currentData.help.text}</p>
              <Button href={WHATSAPP_URL} target="_blank" rel="noreferrer" variant="light" className="mt-5" icon={MessageCircle}>
                {currentData.help.cta}
              </Button>
            </div>
          </Reveal>
        </div>

        {/* Accordion Items */}
        <Reveal stagger gap={0.07} amount={0.1} className="space-y-3" key={lang}>
          {currentData.items.map((it, i) => (
            <Reveal.Item key={`${lang}-${it.q}`} variants={fadeUp}>
              <Item {...it} open={open === i} onToggle={() => setOpen(open === i ? -1 : i)} isEn={isEn} />
            </Reveal.Item>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
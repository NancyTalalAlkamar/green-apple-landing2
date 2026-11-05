import { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Bell, Check, Clock, MessageCircle } from 'lucide-react'
import { booking as originalBooking } from '../data/content'
import { useLanguage } from '../context/LanguageContext'
import { slideFromStart, fadeUp } from '../lib/motion'
import SectionHeading from '../components/ui/SectionHeading'

// قاموس الترجمة الإنجليزية لهذا القسم
const enBooking = {
  badge: 'Your Appointments in Your Pocket',
  title: 'No Calls, No Waiting',
  accent: 'Everything on WhatsApp',
  text: 'Your appointments are organized automatically from your plan, and a personal link is sent to you to track everything.',
  features: [
    {
      icon: 'bell',
      title: 'Reminder 4 Days & 1 Day Prior',
      text: 'In your language, in Arabic or English.',
    },
    {
      icon: 'check',
      title: 'Confirm or Reschedule with a Click',
      text: 'Free rescheduling up to 72 hours before the appointment.',
    },
    {
      icon: 'clock',
      title: 'Automatic Waiting List',
      text: 'If an earlier slot frees up, the offer is sent to you instantly.',
    },
  ],
  phone: {
    brand: 'My Appointments',
    langTag: 'English',
    upcoming: 'Upcoming Appointment',
    waiting: 'Waiting for your confirmation',
    dateTime: 'Wednesday · 09:00',
    includes: 'Includes 3D Body Scan',
    confirm: 'Confirm',
    reschedule: 'Reschedule',
    nextAppt: 'Next Appointment',
    nextApptTime: 'Next Wednesday',
  },
  toast1: {
    title: 'Reminder',
    body: 'Your appointment is in 4 days. Please confirm via the link.',
  },
  toast2: {
    title: 'Earlier Slot Available',
    body: 'Monday 12:00 · Move to it?',
  },
}

const icons = { bell: Bell, check: Check, clock: Clock }

function PhoneMockup({ isEn, bookingData }) {
  const content = isEn ? bookingData.phone : {
    brand: 'مواعيدي',
    langTag: 'عربي',
    upcoming: 'الموعد القادم',
    waiting: 'بانتظار تأكيدك',
    dateTime: 'الأربعاء · 09:00',
    includes: 'يشمل مسح الجسم 3D',
    confirm: 'تأكيد',
    reschedule: 'نقل',
    nextAppt: 'الموعد التالي',
    nextApptTime: 'الأربعاء القادم',
  }

  return (
    <div className={`relative w-[240px] rounded-[2.2rem] border-[7px] border-forest-900 bg-white p-4 shadow-2xl sm:w-[260px] ${isEn ? 'text-left' : 'text-right'}`}>
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-sm font-semibold">
          <img src="/images/logo-mark.png" alt="" className="h-5" />
          {content.brand}
        </span>
        <span className="text-xs text-muted">{content.langTag}</span>
      </div>

      <div className="mt-4 rounded-2xl bg-sage-50 p-3">
        <div className="flex items-center justify-between text-xs">
          <span className="text-ink/80">{content.upcoming}</span>
          <span className="rounded-full bg-sage-200 px-2 py-0.5 text-[10px]">{content.waiting}</span>
        </div>
        <p className="mt-2 text-lg font-semibold" dir="ltr">
          {isEn ? 'Wednesday · 09:00' : 'الأربعاء · 09:00'}
        </p>
        <p className="mt-1 text-[11px] text-ink/70">{content.includes}</p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <button className="rounded-full bg-copper-600 py-2 text-xs font-semibold text-white">{content.confirm}</button>
          <button className="rounded-full border border-copper-600 py-2 text-xs font-semibold text-copper-600">
            {content.reschedule}
          </button>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between rounded-2xl bg-sage-50 p-3 text-xs">
        <span className="text-ink/70">{content.nextAppt}</span>
        <span>{content.nextApptTime}</span>
      </div>
    </div>
  )
}

function Toast({ children, className, style }) {
  return (
    <motion.div
      style={style}
      className={`absolute z-10 rounded-2xl bg-white/95 p-3 text-xs shadow-xl backdrop-blur pulse-card ${className}`}
    >
      {children}
    </motion.div>
  )
}

export default function Booking() {
  const languageContext = useLanguage() || {}
  const lang = languageContext.lang || 'ar'
  
  const [isEnglish, setIsEnglish] = useState(lang === 'en')

  useEffect(() => {
    setIsEnglish(lang === 'en')
  }, [lang])

  const bookingData = isEnglish ? enBooking : originalBooking

  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const phoneY = useTransform(scrollYProgress, [0, 1], [60, -60])
  const toast1Y = useTransform(scrollYProgress, [0, 1], [110, -110])
  const toast2Y = useTransform(scrollYProgress, [0, 1], [20, -20])

  return (
    <section id="booking" ref={ref} className="pb-20 sm:pb-24" dir={isEnglish ? 'ltr' : 'rtl'}>
      <div className="container-page grid items-center gap-8 lg:grid-cols-2 lg:gap-10">
        
        {/* Visual (Phone) - يسار في العربية، يمين في الإنجليزية */}
        <div
          className={`relative flex min-h-[520px] items-center justify-center overflow-hidden rounded-4xl bg-gradient-to-br from-sage-50 via-sand-50 to-sand-200 ${
            isEnglish ? 'lg:order-2' : 'lg:order-1'
          }`}
        >
          <motion.div style={{ y: phoneY }}>
            <PhoneMockup isEn={isEnglish} bookingData={bookingData} />
          </motion.div>

          <Toast style={{ y: toast1Y }} className={`top-16 w-52 ${isEnglish ? 'right-6 sm:right-10 text-left' : 'left-6 sm:left-10 text-right'}`}>
            <div className="flex items-start gap-2">
              <span className="grid size-7 shrink-0 place-items-center rounded-full bg-forest-700 text-white">
                <MessageCircle className="size-3.5" />
              </span>
              <div>
                <p className="font-semibold">
                  <span dir="ltr">Green Apple</span> · {isEnglish ? enBooking.toast1.title : 'تذكير'}
                </p>
                <p className="mt-0.5 text-ink/70">
                  {isEnglish ? enBooking.toast1.body : 'موعدك بعد 4 أيام. أكّدي من الرابط'}
                </p>
              </div>
            </div>
          </Toast>

          <Toast style={{ y: toast2Y }} className={`bottom-12 ${isEnglish ? 'left-6 sm:left-8 text-left' : 'right-6 sm:right-8 text-right'}`}>
            <p className="font-semibold text-forest-700">{isEnglish ? enBooking.toast2.title : 'تفرّغ مكان أبكر'}</p>
            <p className="mt-0.5 text-ink/70">
              {isEnglish ? enBooking.toast2.body : <>الاثنين <span dir="ltr">12:00</span> · تنتقلين إليه؟</>}
            </p>
          </Toast>
        </div>

        {/* Copy (Text & Features) - يمين في العربية، يسار في الإنجليزية */}
        <div className={`text-left ${isEnglish ? 'lg:order-1 text-left' : 'lg:order-2 text-right'}`}>
          <SectionHeading badge={bookingData.badge} title={bookingData.title} accent={bookingData.accent} breakLine>
            <p className={`mt-4 max-w-md leading-8 text-ink/75 ${isEnglish ? 'text-left' : 'text-right'}`}>{bookingData.text}</p>
          </SectionHeading>

          <div className="mt-7 space-y-3">
            {bookingData.features.map((f, index) => {
              const Icon = icons[f.icon]
              return (
                <div
                  key={f.title}
                  className={`flex items-center gap-4 rounded-2xl bg-sage-50 p-4 transition-all duration-300 ${
                    index === 0 ? 'pulse-card' : ''
                  }`}
                >
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white text-copper-600 shadow-sm">
                    <Icon className="size-4" />
                  </span>
                  <div className={isEnglish ? 'text-left' : 'text-right'}>
                    <h3 className="font-semibold">{f.title}</h3>
                    <p className="mt-0.5 text-xs text-ink/70">{f.text}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

      </div>
    </section>
  )
}
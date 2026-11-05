import { motion } from 'framer-motion'
import { MapPin, Clock, Phone, MessageCircle } from 'lucide-react'
import { contact as originalContact } from '../data/content'
import { useLanguage } from '../context/LanguageContext'
import SectionHeading from '../components/ui/SectionHeading'
import Button from '../components/ui/Button'

// قاموس الترجمة الإنجليزية
const contactEn = {
  badge: 'Contact Us',
  title: 'We Are Waiting For You',
  accent: 'In Sakhnin',
  mapLabel: 'Green Apple • Sakhnin',
  directions: 'Directions',
  mapUrl: originalContact?.mapUrl || 'https://maps.google.com',
  cards: [
    {
      icon: 'clock',
      label: 'Working Hours',
      value: '09:00–18:00',
    },
    {
      icon: 'pin',
      label: 'Address',
      value: 'Sakhnin • [Street]',
    },
    {
      icon: 'whatsapp',
      label: 'WhatsApp',
      value: '+972592373805',
      href: 'https://wa.me/972592373805',
    },
    {
      icon: 'phone',
      label: 'Phone',
      value: '0592373805',
      href: 'tel:0592373805',
    },
  ],
}

// قاموس الترجمة العربية
const contactAr = {
  badge: 'تواصل معنا',
  title: 'منستنّاكِ',
  accent: 'بسخنين',
  mapLabel: 'Green Apple • سخنين',
  directions: 'الاتجاهات',
  mapUrl: originalContact?.mapUrl || 'https://maps.google.com',
  cards: [
    {
      icon: 'clock',
      label: 'ساعات العمل',
      value: '09:00–18:00',
    },
    {
      icon: 'pin',
      label: 'العنوان',
      value: 'سخنين • [الشارع]',
    },
    {
      icon: 'whatsapp',
      label: 'WhatsApp',
      value: '+972592373805',
      href: 'https://wa.me/972592373805',
    },
    {
      icon: 'phone',
      label: 'الهاتف',
      value: '0592373805',
      href: 'tel:0592373805',
    },
  ],
}

const icons = { pin: MapPin, clock: Clock, phone: Phone, whatsapp: MessageCircle }

function MapCard({ contactData, isEn }) {
  return (
    <div className="relative h-full min-h-[340px] overflow-hidden rounded-4xl bg-sage-100">
      {/* خريطة تصميمية */}
      <svg className="absolute inset-0 size-full text-sage-200" aria-hidden>
        <defs>
          <pattern id="grid" width="56" height="56" patternUnits="userSpaceOnUse">
            <path d="M56 0H0V56" fill="none" stroke="currentColor" strokeWidth="1.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        <path d="M-20 220 C 120 160, 260 280, 640 180" stroke="white" strokeWidth="14" fill="none" />
        <path d="M200 -20 C 240 120, 180 260, 260 420" stroke="white" strokeWidth="10" fill="none" />
      </svg>

      {/* أيقونة الموقع النابضة */}
      <div className="absolute top-[38%] left-1/2 -translate-x-1/2 -translate-y-1/2">
        <motion.span
          animate={{ scale: [1, 2.4], opacity: [0.45, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
          className="absolute top-full left-1/2 size-6 -translate-x-1/2 -translate-y-1/2 rounded-full bg-copper-600"
        />
        <MapPin className="size-12 fill-copper-600 text-white drop-shadow-lg" strokeWidth={1.5} />
      </div>

      <div className={`absolute inset-x-3 bottom-3 flex items-center justify-between gap-3 rounded-2xl bg-white/90 p-3 backdrop-blur ${isEn ? 'ps-5' : 'pe-5'}`}>
        <span className="font-medium">{contactData.mapLabel}</span>
        <Button href={contactData.mapUrl} target="_blank" rel="noreferrer" variant="dark" size="sm">
          {contactData.directions}
        </Button>
      </div>
    </div>
  )
}

export default function Contact() {
  const { lang } = useLanguage() || {}
  const isEn = lang === 'en'

  const contactData = isEn ? contactEn : contactAr

  return (
    <section id="contact" className="pb-20 sm:pb-24" dir={isEn ? 'ltr' : 'rtl'}>
      <div className="container-page grid gap-8 lg:grid-cols-[1fr_1.15fr] lg:items-end">
        
        {/* العنوان والبطاقات الأربع */}
        <div className={isEn ? 'text-left' : 'text-right'}>
          <SectionHeading badge={contactData.badge} title={contactData.title} accent={contactData.accent} />
          
          <div className="mt-8 grid grid-cols-1 gap-3 min-[420px]:grid-cols-2">
            {contactData.cards.map((c) => {
              const Icon = icons[c.icon]
              const Tag = c.href ? 'a' : 'div'
              return (
                <Tag
                  key={c.label}
                  href={c.href}
                  className={`block rounded-2xl bg-sage-50 p-4 transition-colors hover:bg-sage-100 ${isEn ? 'text-left' : 'text-right'}`}
                >
                  <Icon className="size-4 text-copper-600" />
                  <p className="mt-3 text-sm font-semibold">{c.label}</p>
                  <p className="mt-1 text-sm text-ink/80">
                    <bdi dir={/^[+\d]/.test(c.value) ? 'ltr' : 'auto'}>{c.value}</bdi>
                  </p>
                </Tag>
              )
            })}
          </div>
        </div>

        {/* الخريطة */}
        <div className="h-full">
          <MapCard contactData={contactData} isEn={isEn} />
        </div>

      </div>
    </section>
  )
}
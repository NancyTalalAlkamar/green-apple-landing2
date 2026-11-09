import { CalendarCheck, MessageCircle, Phone } from 'lucide-react'
import { WHATSAPP_URL, PHONE } from '../data/content'
import { useLanguage } from '../context/LanguageContext'

// شريط ثابت تحت بالموبايل بكل صفحات الموقع: حجز + WhatsApp + اتصال
const LABELS = {
  ar: { book: 'احجزي استشارة', form: 'ابعتي استفسار', wa: 'WhatsApp', call: 'اتصلي فينا' },
  en: { book: 'Book a consultation', form: 'Send an inquiry', wa: 'WhatsApp', call: 'Call us' },
}

export default function MobileBar() {
  const { lang } = useLanguage() || {}
  const isEn = lang === 'en'
  const t = LABELS[isEn ? 'en' : 'ar']
  // بصفحة التواصل نفسها، الزر الرئيسي بينزل على النموذج
  const onContact = /^\/contact\/?$/.test(window.location.pathname)

  return (
    <div
      dir={isEn ? 'ltr' : 'rtl'}
      className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-forest-900/95 px-3 pt-2 backdrop-blur-xl lg:hidden"
      style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))' }}
    >
      <div className="flex items-center gap-2">
        <a
          href={onContact ? '#inquiry' : '/contact'}
          className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-copper-600 text-[15px] font-semibold text-white"
        >
          <CalendarCheck className="size-5" />
          {onContact ? t.form : t.book}
        </a>
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noreferrer"
          aria-label={t.wa}
          className="grid size-12 shrink-0 place-items-center rounded-full bg-white text-forest-800"
        >
          <MessageCircle className="size-5" />
        </a>
        <a
          href={PHONE.href}
          aria-label={t.call}
          className="grid size-12 shrink-0 place-items-center rounded-full border border-white/25 text-white"
        >
          <Phone className="size-5" />
        </a>
      </div>
    </div>
  )
}
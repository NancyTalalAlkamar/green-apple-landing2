import { Instagram, Facebook, MessageCircle, ShieldCheck } from 'lucide-react'
import { WHATSAPP_URL } from '../data/content'
import { useLanguage } from '../context/LanguageContext'

// قواميس محتوى التذييل للغتين لضمان ظهورها بشكل دائم
const footerContent = {
  ar: {
    about: 'عيادة تنحيف ونحت جسم بسخنين. برنامج شخصي بخطة ومتابعة وقياس.',
    follow: 'تابعينا',
    hebrew: 'لاستر بالعبرية',
    privacy: 'بياناتك الصحية محمية وفق قانون حماية الخصوصية، ولا تُنشر أي صورة إلا بموافقة موقَّعة من صاحبتها.',
    copyright: '© 2026 Green Apple • The Art of Health & Beauty',
    columns: [
      {
        title: 'الموقع',
        links: ['العلاجات', 'النتائج', 'العروض', 'من نحن'],
      },
      {
        title: 'للمريضات',
        links: ['دخول المريضات', 'احجزي استشارة', 'الأسئلة الشائعة'],
      },
    ],
    legal: ['سياسة الخصوصية', 'الشروط والاحكام'],
  },
  en: {
    about: 'Slimming and body sculpting clinic in Sakhnin. Personalized program with a plan, follow-up, and measurement.',
    follow: 'Follow Us',
    hebrew: 'View in Hebrew',
    privacy: 'Your health data is protected in accordance with privacy laws, and no image is published without signed consent from its owner.',
    copyright: '© 2026 Green Apple • The Art of Health & Beauty',
    columns: [
      {
        title: 'Site',
        links: ['Treatments', 'Results', 'Offers', 'About Us'],
      },
      {
        title: 'For Patients',
        links: ['Patient Login', 'Book Consultation', 'FAQ'],
      },
    ],
    legal: ['Privacy Policy', 'Terms & Conditions'],
  },
}

const socials = [
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: MessageCircle, href: WHATSAPP_URL, label: 'WhatsApp' },
]

export default function Footer() {
  const { lang } = useLanguage() || {}
  const isEn = lang === 'en'

  const currentFooter = footerContent[isEn ? 'en' : 'ar'] || footerContent.ar

  return (
    <footer className={`relative overflow-hidden rounded-t-[2.5rem] bg-forest-900 text-white ${isEn ? 'text-left' : 'text-right'}`} dir={isEn ? 'ltr' : 'rtl'}>
      <div className="pointer-events-none absolute -bottom-40 -left-32 size-[420px] rounded-full bg-copper-500/30 blur-[120px]" />

      <div className="container-page relative pt-14 pb-8">
        
        {/* شبكة محتوى التذييل ثابتة تماماً */}
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          
          {/* معلومات العيادة والشعار */}
          <div>
            <img src="/images/logo-full.png" alt="Green Apple — The Art of Health & Beauty" className="h-20 w-auto" />
            <p className="mt-5 max-w-xs text-sm leading-7 text-white/75">{currentFooter.about}</p>
          </div>

          {/* أعمدة الروابط */}
          {currentFooter.columns.map((col) => (
            <div key={col.title}>
              <h4 className="font-semibold">{col.title}</h4>
              <ul className="mt-4 space-y-3 text-sm text-white/70">
                {col.links.map((l) => (
                  <li key={l}>
                    <a href="#" className="transition-colors hover:text-copper-300">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* متابعة وشبكات التواصل */}
          <div>
            <h4 className="font-semibold">{currentFooter.follow}</h4>
            <div className={`mt-4 flex gap-2 ${isEn ? 'justify-start' : 'justify-start'}`}>
              {socials.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="grid size-10 place-items-center rounded-full border border-white/20 transition-all hover:-translate-y-0.5 hover:border-copper-300 hover:text-copper-300"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
            <a
              href="#"
              className="mt-4 inline-block rounded-full border border-copper-300/60 px-4 py-1.5 text-sm text-copper-300 hover:bg-copper-300/10"
            >
              {currentFooter.hebrew}
            </a>
          </div>

        </div>

        {/* شريط حماية البيانات */}
        <div className="mt-10 flex items-center gap-3 rounded-2xl bg-white/5 p-4 text-sm text-white/80">
          <ShieldCheck className="size-5 shrink-0 text-copper-300" />
          <span>{currentFooter.privacy}</span>
        </div>

        {/* حقوق النشر والسياسة */}
        <div className={`mt-8 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/60 sm:flex-row sm:items-center ${isEn ? 'sm:justify-between' : 'sm:justify-between'}`}>
          <span dir="ltr">{currentFooter.copyright}</span>
          <div className="flex gap-5">
            {currentFooter.legal.map((l) => (
              <a key={l} href="#" className="hover:text-white">
                {l}
              </a>
            ))}
          </div>
        </div>

      </div>
    </footer>
  )
}
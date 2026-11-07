import { MessageCircle, ShieldCheck } from 'lucide-react'
import { WHATSAPP_URL, bookingUrl } from '../data/content'
import { useLanguage } from '../context/LanguageContext'

// كل رابط إله وجهة حقيقية. الروابط اللي لسا ما إلها صفحة مخفية لحد ما تجهز:
// النتائج، العروض، من نحن، دخول المريضات، النسخة العبرية، إنستغرام وفيسبوك.
const footerContent = {
  ar: {
    about: 'عيادة تنحيف ونحت جسم بسخنين. برنامج شخصي بخطة ومتابعة وقياس.',
    follow: 'تواصلي معنا',
    privacy: 'بياناتك الصحية محمية وفق قانون حماية الخصوصية، ولا تُنشر أي صورة إلا بموافقة موقَّعة من صاحبتها.',
    copyright: '© 2026 Green Apple • The Art of Health & Beauty',
    columns: [
      {
        title: 'الموقع',
        links: [
          { label: 'العلاجات', href: '/#services' },
          { label: 'طريقة جرين أبل', href: '/#journey' },
          { label: 'الأسئلة الشائعة', href: '/#faq' },
          { label: 'تواصل معنا', href: '/#contact' },
        ],
      },
      {
        title: 'للمريضات',
        links: [
          { label: 'احجزي استشارة', href: bookingUrl('ar'), external: true },
          { label: 'اسألينا على WhatsApp', href: WHATSAPP_URL, external: true },
          { label: 'منتصل فيكِ', href: '/#cta' },
        ],
      },
    ],
    // صفحات الخصوصية والشروط: بتنضاف لما توصل النصوص بعد مراجعة المحامي
    legal: [
      { label: 'سياسة الخصوصية', href: '#' },
      { label: 'الشروط والاحكام', href: '#' },
    ],
  },
  en: {
    about: 'Slimming and body sculpting clinic in Sakhnin. Personalized program with a plan, follow-up, and measurement.',
    follow: 'Contact us',
    privacy: 'Your health data is protected in accordance with privacy laws, and no image is published without signed consent from its owner.',
    copyright: '© 2026 Green Apple • The Art of Health & Beauty',
    columns: [
      {
        title: 'Site',
        links: [
          { label: 'Treatments', href: '/#services' },
          { label: 'The Green Apple way', href: '/#journey' },
          { label: 'FAQ', href: '/#faq' },
          { label: 'Contact us', href: '/#contact' },
        ],
      },
      {
        title: 'For Patients',
        links: [
          { label: 'Book a consultation', href: bookingUrl('en'), external: true },
          { label: 'Ask us on WhatsApp', href: WHATSAPP_URL, external: true },
          { label: 'Request a call', href: '/#cta' },
        ],
      },
    ],
    legal: [
      { label: 'Privacy Policy', href: '#' },
      { label: 'Terms & Conditions', href: '#' },
    ],
  },
}

export default function Footer() {
  const { lang } = useLanguage() || {}
  const isEn = lang === 'en'
  const f = footerContent[isEn ? 'en' : 'ar']

  return (
    <footer className="relative overflow-hidden rounded-t-[2.5rem] bg-forest-900 text-start text-white" dir={isEn ? 'ltr' : 'rtl'}>
      <div className="pointer-events-none absolute -bottom-40 -left-32 size-[420px] rounded-full bg-copper-500/30 blur-[120px]" />

      <div className="container-page relative pt-14 pb-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          {/* معلومات العيادة والشعار */}
          <div>
            <img src="/images/logo-full.png" alt="Green Apple — The Art of Health & Beauty" className="h-20 w-auto" />
            <p className="mt-5 max-w-xs text-sm leading-7 text-white/75">{f.about}</p>
          </div>

          {/* أعمدة الروابط */}
          {f.columns.map((col) => (
            <div key={col.title}>
              <h4 className="font-semibold">{col.title}</h4>
              <ul className="mt-4 space-y-3 text-sm text-white/75">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      {...(l.external ? { target: '_blank', rel: 'noreferrer' } : {})}
                      className="transition-colors hover:text-copper-300"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* التواصل */}
          <div>
            <h4 className="font-semibold">{f.follow}</h4>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noreferrer"
              aria-label="WhatsApp"
              className="mt-4 grid size-10 place-items-center rounded-full border border-white/20 transition-all hover:-translate-y-0.5 hover:border-copper-300 hover:text-copper-300"
            >
              <MessageCircle className="size-4" />
            </a>
          </div>
        </div>

        {/* شريط حماية البيانات */}
        <div className="mt-10 flex items-center gap-3 rounded-2xl bg-white/5 p-4 text-sm text-white/80">
          <ShieldCheck className="size-5 shrink-0 text-copper-300" />
          <span>{f.privacy}</span>
        </div>

        {/* حقوق النشر والسياسة */}
        <div className="mt-8 flex flex-col gap-3 border-t border-white/10 pt-6 text-sm text-white/65 sm:flex-row sm:items-center sm:justify-between">
          <span dir="ltr">{f.copyright}</span>
          <div className="flex gap-5">
            {f.legal.map((l) => (
              <a key={l.label} href={l.href} className="hover:text-white">
                {l.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
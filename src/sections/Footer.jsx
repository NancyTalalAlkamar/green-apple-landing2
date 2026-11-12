import { Instagram, Facebook, MessageCircle, ShieldCheck } from 'lucide-react'
import { WHATSAPP_URL } from '../data/content'
import { useLanguage } from '../context/LanguageContext'

// روابط السوشال ميديا — بدّلي '#' برابط حساب العيادة لما يوصل
const SOCIAL = {
  instagram: '#',
  facebook: '#',
  tiktok: '#',
}

function TikTok(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M16.6 5.82A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 0 1-2.59 2.5 2.6 2.6 0 0 1-2.6-2.6 2.6 2.6 0 0 1 3.36-2.49V9.66a5.73 5.73 0 0 0-.76-.05A5.69 5.69 0 0 0 4.17 15.3 5.69 5.69 0 0 0 9.86 21a5.69 5.69 0 0 0 5.69-5.69V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3a4.3 4.3 0 0 1-3.25-1.48Z" />
    </svg>
  )
}

const socials = [
  { icon: Instagram, href: SOCIAL.instagram, label: 'Instagram' },
  { icon: Facebook, href: SOCIAL.facebook, label: 'Facebook' },
  { icon: TikTok, href: SOCIAL.tiktok, label: 'TikTok' },
  { icon: MessageCircle, href: WHATSAPP_URL, label: 'WhatsApp' },
]

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
          { label: 'من نحن', href: '/about' },
          { label: 'العلاجات', href: '/treatments' },
          { label: 'النتائج', href: '/results' },
          { label: 'الفريق', href: '/#team' },
          { label: 'الأسئلة الشائعة', href: '/#faq' },
          { label: 'تواصل معنا', href: '/contact' },
        ],
      },
      {
        title: 'للمريضات',
        links: [
          { label: 'احجزي استشارة', href: '/contact' },
          { label: 'العروض', href: '/offers' },
          { label: 'اسألينا على WhatsApp', href: WHATSAPP_URL, external: true },
          { label: 'طريقة جرين أبل', href: '/#journey' },
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
          { label: 'About', href: '/about' },
          { label: 'Treatments', href: '/treatments' },
          { label: 'Results', href: '/results' },
          { label: 'Team', href: '/#team' },
          { label: 'FAQ', href: '/#faq' },
          { label: 'Contact us', href: '/contact' },
        ],
      },
      {
        title: 'For Patients',
        links: [
          { label: 'Book a consultation', href: '/contact' },
          { label: 'Offers', href: '/offers' },
          { label: 'Ask us on WhatsApp', href: WHATSAPP_URL, external: true },
          { label: 'The Green Apple way', href: '/#journey' },
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
            <div className="mt-4 flex flex-wrap gap-2.5">
              {socials.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  {...(href !== '#' ? { target: '_blank', rel: 'noreferrer' } : {})}
                  aria-label={label}
                  title={label}
                  className="grid size-10 place-items-center rounded-full border border-white/20 transition-all hover:-translate-y-0.5 hover:border-copper-300 hover:text-copper-300"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
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
import { useState } from 'react'
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion'
import { Globe, ChevronDown, Menu, X } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import { nav as originalNav } from '../data/content'
import { EASE } from '../lib/motion'
import Button from '../components/ui/Button'

export default function Navbar() {
  const { lang, setLang, t } = useLanguage()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const { scrollY, scrollYProgress } = useScroll()

  useMotionValueEvent(scrollY, 'change', (y) => setScrolled(y > 40))

  // إذا كانت اللغة إنجليزية نأخذ الترجمة، وإذا كانت عربية نأخذ ملفك الأصلي كما هو
  // "تواصل معنا" بيفتح صفحة التواصل المنفصلة
  // + "من نحن" بأول القائمة
  const navLinks = [
    { label: lang === 'en' ? 'About' : 'من نحن', href: '/about' },
    ...(lang === 'en' ? t.nav.links : originalNav.links).map((l) =>
      l.href === '#contact' ? { ...l, href: '/contact' } : l,
    ),
  ]
  const ctaText = lang === 'en' ? t.nav.cta : originalNav.cta

  // بصفحات العلاجات، روابط الأقسام بترجع للرئيسية (مثلاً /#results)
  const onHome = window.location.pathname === '/'
  const linkHref = (h) => (onHome || !h.startsWith('#') ? h : `/${h}`)

  return (
    <>
      {/* Thin reading-progress bar */}
      <motion.div
        style={{ scaleX: scrollYProgress }}
        className="fixed inset-x-0 top-0 z-[60] h-0.5 origin-right bg-copper-600"
      />

      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: EASE }}
        className="fixed inset-x-0 top-3 z-50 sm:top-4"
      >
        <div className="container-page">
          <motion.nav
            animate={{
              backgroundColor: scrolled ? 'rgba(20,41,31,0.92)' : 'rgba(30,50,38,0.55)',
              paddingTop: scrolled ? 8 : 10,
              paddingBottom: scrolled ? 8 : 10,
            }}
            transition={{ duration: 0.4 }}
            className="flex items-center justify-between gap-4 rounded-full border border-white/15 px-3 shadow-xl shadow-black/10 backdrop-blur-xl sm:px-4"
          >
            {/* Logo */}
            <a href={onHome ? '#top' : '/'} className="flex items-center gap-2 ps-2">
              <img src="/images/logo-mark-white.png" alt="" className="h-8 w-auto" />
              <span className="text-lg font-bold whitespace-nowrap text-white" dir="ltr">
                Green Apple
              </span>
            </a>

            {/* Links */}
            <ul className="hidden items-center gap-7 lg:flex">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <a
                    href={linkHref(l.href)}
                    className="group relative text-sm text-white/85 transition-colors hover:text-white"
                  >
                    {l.label}
                    <span className="absolute -bottom-1 right-0 h-px w-0 bg-copper-300 transition-all duration-300 group-hover:w-full" />
                  </a>
                </li>
              ))}
            </ul>

            {/* Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* زر القائمة المنسدلة للغة */}
              <div className="relative hidden md:block">
                <button 
                  onClick={() => setLangOpen((prev) => !prev)}
                  className="flex items-center gap-1.5 rounded-full border border-white/25 px-3 py-1.5 text-sm text-white/90 hover:bg-white/10 transition"
                >
                  <Globe className="size-4" />
                  <span>{lang === 'ar' ? 'العربية' : 'English'}</span>
                  <ChevronDown className={`size-3.5 opacity-70 transition-transform ${langOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {langOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-36 overflow-hidden rounded-2xl border border-white/15 bg-forest-900/95 py-1.5 shadow-xl backdrop-blur-xl"
                    >
                      <button
                        onClick={() => { setLang('ar'); setLangOpen(false); }}
                        className={`w-full px-4 py-2 text-right text-sm transition hover:bg-white/10 ${lang === 'ar' ? 'text-copper-300 font-bold' : 'text-white/90'}`}
                      >
                        العربية
                      </button>
                      <button
                        onClick={() => { setLang('en'); setLangOpen(false); }}
                        className={`w-full px-4 py-2 text-right text-sm transition hover:bg-white/10 ${lang === 'en' ? 'text-copper-300 font-bold' : 'text-white/90'}`}
                      >
                        English
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* زر "دخول" مخفي لحد ما تجهز منطقة المريضات وتكون محمية */}
              {/* بالموبايل الزر مخفي (موجود بالشريط اللي تحت) عشان ما يركب على اللوغو */}
              <span className="hidden sm:block">
                <Button href="/contact" size="sm">
                  {ctaText}
                </Button>
              </span>
              <button
                onClick={() => setOpen((v) => !v)}
                className="grid size-10 place-items-center rounded-full text-white hover:bg-white/10 lg:hidden"
                aria-label="القائمة"
                aria-expanded={open}
              >
                {open ? <X className="size-5" /> : <Menu className="size-5" />}
              </button>
            </div>
          </motion.nav>

          {/* Mobile menu */}
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: -12, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -12, scale: 0.98 }}
                transition={{ duration: 0.3, ease: EASE }}
                className="mt-2 rounded-3xl border border-white/15 bg-forest-900/95 p-4 backdrop-blur-xl lg:hidden"
              >
                <ul className="flex flex-col">
                  {navLinks.map((l, i) => (
                    <motion.li
                      key={l.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.04 * i }}
                    >
                      <a
                        href={linkHref(l.href)}
                        onClick={() => setOpen(false)}
                        className="block rounded-xl px-3 py-3 text-white/90 hover:bg-white/10"
                      >
                        {l.label}
                      </a>
                    </motion.li>
                  ))}
                </ul>
                <div className="mt-3 flex items-center gap-2 border-t border-white/10 pt-3">
                  <Button href="/contact" size="sm" className="flex-1" onClick={() => setOpen(false)}>
                    {ctaText}
                  </Button>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setLang('ar')}
                      className={`rounded-full border px-3 py-1.5 text-xs ${lang === 'ar' ? 'border-copper-300 text-copper-300 font-bold' : 'border-white/25 text-white'}`}
                    >
                      العربية
                    </button>
                    <button 
                      onClick={() => setLang('en')}
                      className={`rounded-full border px-3 py-1.5 text-xs ${lang === 'en' ? 'border-copper-300 text-copper-300 font-bold' : 'border-white/25 text-white'}`}
                    >
                      English
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.header>
    </>
  )
}
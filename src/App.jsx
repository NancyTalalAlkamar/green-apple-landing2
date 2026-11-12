import { useEffect } from 'react'
import { MotionConfig } from 'framer-motion'
import Navbar from './sections/Navbar'
import Hero from './sections/Hero'
import Services from './sections/Services'
import Results from './sections/Results'
import Journey from './sections/Journey'
import Booking from './sections/Booking'
import Team from './sections/Team'
import FAQ from './sections/FAQ'
import CTA from './sections/CTA'
import Contact from './sections/Contact'
import Footer from './sections/Footer'
import TreatmentPage from './pages/TreatmentPage'
import ContactPage from './pages/ContactPage'
import AboutPage from './pages/AboutPage'
import TreatmentsPage from './pages/TreatmentsPage'
import OffersPage from './pages/OffersPage'
import MobileBar from './components/MobileBar'
import DemoTag from './components/DemoTag'
import { treatments } from './data/treatments'
import { moreTreatments } from './data/moreTreatments'

// صفحات العلاجات: /treatments/abdomen وغيرها (المحتوى بملف data/treatments.js)
function getTreatmentSlug() {
  const m = window.location.pathname.match(/^\/treatments\/([\w-]+)\/?$/)
  return m ? m[1] : null
}

// صفحة التواصل: /contact
const isContactPage = /^\/contact\/?$/.test(window.location.pathname)
// صفحة من نحن: /about
const isAboutPage = /^\/about\/?$/.test(window.location.pathname)
// صفحة كل العلاجات: /treatments
const isTreatmentsPage = /^\/treatments\/?$/.test(window.location.pathname)
// صفحة العروض: /offers
const isOffersPage = /^\/offers\/?$/.test(window.location.pathname)

// SEO: عنوان ووصف كل صفحة (اللي بيطلعوا بجوجل وبتبويب المتصفح)
const SITE = 'Green Apple'
const HOME_TITLE = `${SITE} · عيادة تنحيف ونحت جسم في سخنين`
const HOME_DESC =
  'Green Apple — عيادة تنحيف ونحت جسم غير جراحي في سخنين. برنامج شخصي يبدأ باستشارة، مع خطة جلسات ومتابعة وقياسات ثابتة.'

function getSeo(slug) {
  if (isOffersPage) {
    return {
      title: `العروض · ${SITE}`,
      desc: 'عروض Green Apple بسخنين على نحت الجسم والليزر والعناية بالبشرة. كل عرض بيبلّش باستشارة.',
    }
  }
  if (isTreatmentsPage) {
    return {
      title: `العلاجات · ${SITE}`,
      desc: 'كل علاجات Green Apple بسخنين: البطن والخصر، الفخذين والذراعين، السيلوليت، الليزر والبشرة. اختاري هدفك وشوفي العلاج المناسب.',
    }
  }
  if (isAboutPage) {
    return {
      title: `من نحن · ${SITE}`,
      desc: 'تعرّفي على Green Apple في سخنين: جولة بالعيادة، كيف بيكون موعدك، وكيف منقيس تقدّمك.',
    }
  }
  if (isContactPage) {
    return {
      title: `تواصل معنا · ${SITE}`,
      desc: 'تواصلي مع Green Apple في سخنين: WhatsApp، اتصال، أو ابعتي استفسار وفريقنا بيرجعلك.',
    }
  }
  const t = slug && (treatments[slug] || moreTreatments[slug])
  if (t) return { title: `${t.ar.title} · ${t.ar.accent} · ${SITE}`, desc: t.ar.lead }
  return { title: HOME_TITLE, desc: HOME_DESC }
}

function setMeta(selector, attr, value) {
  const el = document.head.querySelector(selector)
  if (el) el.setAttribute(attr, value)
}

export default function App() {
  const treatmentSlug = getTreatmentSlug()

  useEffect(() => {
    const { title, desc } = getSeo(treatmentSlug)
    document.title = title
    setMeta('meta[name="description"]', 'content', desc)
    setMeta('meta[property="og:title"]', 'content', title)
    setMeta('meta[property="og:description"]', 'content', desc)
    setMeta('meta[property="og:url"]', 'content', window.location.origin + window.location.pathname)
  }, [treatmentSlug])

  return (
    // reducedMotion="user" → respects the OS "reduce motion" setting automatically.
    <MotionConfig reducedMotion="user">
      <Navbar />
      <main className="overflow-x-clip">
        {isAboutPage ? (
          <AboutPage />
        ) : isTreatmentsPage ? (
          <TreatmentsPage />
        ) : isOffersPage ? (
          <OffersPage />
        ) : isContactPage ? (
          <ContactPage />
        ) : treatmentSlug ? (
          <>
            <TreatmentPage slug={treatmentSlug} />
            <CTA />
          </>
        ) : (
          <>
            <Hero />
            <Services />
            {/* محتوى تجريبي — بيتبدّل بحالات حقيقية بموافقة مكتوبة */}
            <DemoTag>
              <Results />
            </DemoTag>
            <Journey />
            <Booking />
            {/* محتوى تجريبي — بيتبدّل بأسماء وصور الفريق الحقيقي */}
            <DemoTag>
              <Team />
            </DemoTag>
            <FAQ />
            <CTA />
            <Contact />
          </>
        )}
      </main>
      <Footer />
      <MobileBar />
      {/* مساحة تحت الفوتر بالموبايل عشان الشريط الثابت ما يغطي آخر الصفحة */}
      <div className="h-20 lg:hidden" />
    </MotionConfig>
  )
}
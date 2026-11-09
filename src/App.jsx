import { MotionConfig } from 'framer-motion'
import Navbar from './sections/Navbar'
import Hero from './sections/Hero'
import Services from './sections/Services'
// import Results from './sections/Results'
import Journey from './sections/Journey'
import Booking from './sections/Booking'
// import Team from './sections/Team'
import FAQ from './sections/FAQ'
import CTA from './sections/CTA'
import Contact from './sections/Contact'
import Footer from './sections/Footer'
import TreatmentPage from './pages/TreatmentPage'
import ContactPage from './pages/ContactPage'
import MobileBar from './components/MobileBar'

// صفحات العلاجات: /treatments/abdomen وغيرها (المحتوى بملف data/treatments.js)
function getTreatmentSlug() {
  const m = window.location.pathname.match(/^\/treatments\/([\w-]+)\/?$/)
  return m ? m[1] : null
}

// صفحة التواصل: /contact
const isContactPage = /^\/contact\/?$/.test(window.location.pathname)

export default function App() {
  const treatmentSlug = getTreatmentSlug()

  return (
    // reducedMotion="user" → respects the OS "reduce motion" setting automatically.
    <MotionConfig reducedMotion="user">
      <Navbar />
      <main className="overflow-x-clip">
        {isContactPage ? (
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
            {/* مخفي لحد ما توصل حالات حقيقية بموافقة مكتوبة */}
            {/* <Results /> */}
            <Journey />
            <Booking />
            {/* مخفي لحد ما توصل قائمة الفريق الحقيقية من العيادة */}
            {/* <Team /> */}
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
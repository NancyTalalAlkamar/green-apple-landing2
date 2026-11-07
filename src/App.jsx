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

// صفحات العلاجات: /treatments/abdomen وغيرها (المحتوى بملف data/treatments.js)
function getTreatmentSlug() {
  const m = window.location.pathname.match(/^\/treatments\/([\w-]+)\/?$/)
  return m ? m[1] : null
}

export default function App() {
  const treatmentSlug = getTreatmentSlug()

  return (
    <MotionConfig reducedMotion="never">
      <Navbar />
      <main className="overflow-x-clip">
        {treatmentSlug ? (
          <>
            <TreatmentPage slug={treatmentSlug} />
            <CTA />
          </>
        ) : (
          <>
            <Hero />
            <Services />
            <Results />
            <Journey />
            <Booking />
            <Team />
            <FAQ />
            <CTA />
            <Contact />
          </>
        )}
      </main>
      <Footer />
    </MotionConfig>
  )
}
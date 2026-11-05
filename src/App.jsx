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

export default function App() {
  return (
    // reducedMotion="user" → respects the OS "reduce motion" setting automatically.
    <MotionConfig reducedMotion="user">
      <Navbar />
      <main className="overflow-x-clip">
        <Hero />
        <Services />
        <Results />
        <Journey />
        <Booking />
        <Team />
        <FAQ />
        <CTA />
        <Contact />
      </main>
      <Footer />
    </MotionConfig>
  )
}

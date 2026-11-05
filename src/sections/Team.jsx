import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { team as originalTeam } from '../data/content'
import { useLanguage } from '../context/LanguageContext'
import SectionHeading from '../components/ui/SectionHeading'
import { ChevronRight, ChevronLeft } from 'lucide-react'

// بيانات الفريق باللغة الإنجليزية مع روابط صور موثوقة ومضمونة 100%
const teamDataEn = {
  badge: 'The Team',
  title: 'Who Accompanies You',
  accent: 'At Every Step',
  text: 'Consultation with clinic management, clinical director oversight, and sessions with specialized practitioners.',
  members: [
    { name: 'Dr. Ahmed Omar', role: 'Clinical Director', tag: 'Treatment Plan', image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=800&auto=format&fit=crop' },
    { name: 'Dr. Alaa Ahmed', role: 'Specialized Practitioner', tag: 'Sessions', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop' },
    { name: 'Dr. Sarah Khaled', role: 'Nutrition & Sculpting Specialist', tag: 'Nutrition', image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=800&auto=format&fit=crop' },
    { name: 'Dr. Rami Hassan', role: 'Skin Aesthetics Consultant', tag: 'Skin', image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=800&auto=format&fit=crop' },
    { name: 'Dr. Yasmin Ali', role: 'Specialized Laser Therapist', tag: 'Laser', image: 'https://images.unsplash.com/photo-1594824813576-9c4767115147?q=80&w=800&auto=format&fit=crop' },
    { name: 'Dr. Tarek Mahmoud', role: 'Body Rehabilitation Specialist', tag: 'Body', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop' },
  ]
}

// بيانات الفريق باللغة العربية مع روابط صور موثوقة ومضمونة 100%
const teamDataAr = {
  badge: 'الفريق',
  title: 'مين رح يرافقك بكل خطوة',
  accent: '',
  text: 'الاستشارة مع إدارة العيادة، والخطة يضعها المدير السريري، والجلسات مع معالجات متخصصات.',
  members: [
    { name: 'د. أحمد عمر', role: 'المدير السريري', tag: 'خطة العلاج', image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=800&auto=format&fit=crop' },
    { name: 'د. الاء احمد', role: 'معالجة متخصصة', tag: 'الجلسات', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop' },
    { name: 'د. سارة خالد', role: 'أخصائية تغذية ونحت', tag: 'التغذية', image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=800&auto=format&fit=crop' },
    { name: 'د. رامي حسن', role: 'استشاري تجميل البشرة', tag: 'البشرة', image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=800&auto=format&fit=crop' },
    { name: 'د. ياسمين علي', role: 'معالجة ليزر متخصصة', tag: 'الليزر', image: 'https://images.unsplash.com/photo-1594824813576-9c4767115147?q=80&w=800&auto=format&fit=crop' },
    { name: 'د. طارق محمود', role: 'أخصائي تأهيل جسم', tag: 'الجسم', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop' },
  ]
}

export default function Team() {
  const { lang } = useLanguage()
  const isEn = lang === 'en'

  const teamData = isEn ? teamDataEn : teamDataAr
  const membersList = teamData.members

  const [currentIndex, setCurrentIndex] = useState(0)

  // حركة تلقائية سلسة تتغير كل 4 ثوانٍ مع إمكانية التحكم بالأسهم
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % membersList.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [membersList.length])

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % membersList.length)
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + membersList.length) % membersList.length)
  }

  const PrevIcon = isEn ? ChevronLeft : ChevronRight
  const NextIcon = isEn ? ChevronRight : ChevronLeft

  // جلب 4 بطاقات ظاهرة بشكل دائري مستمر داخل الكونتينر
  const getVisibleMembers = () => {
    const visible = []
    for (let i = 0; i < 4; i++) {
      const index = (currentIndex + i) % membersList.length
      visible.push(membersList[index])
    }
    return visible
  }

  return (
    <section id="team" className="pb-20 sm:pb-24" dir={isEn ? 'ltr' : 'rtl'}>
      <div className="container-page overflow-hidden">
        
        {/* رأس القسم مع الأسهم التفاعلية */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between mb-10">
          <SectionHeading badge={teamData.badge} title={teamData.title} accent={teamData.accent} />
          
          <div className="flex items-center justify-between lg:justify-end gap-6">
            <p className={`max-w-sm text-sm leading-7 text-ink/75 ${isEn ? 'text-left' : 'text-right'}`}>
              {teamData.text}
            </p>
            
            {/* أزرار الأسهم التفاعلية */}
            <div className="flex items-center gap-2">
              <button 
                onClick={handlePrev}
                className="size-10 rounded-full border border-forest-900/20 flex items-center justify-center hover:bg-forest-900 hover:text-white transition-colors cursor-pointer"
                aria-label="Previous"
              >
                <PrevIcon className="size-5" />
              </button>
              <button 
                onClick={handleNext}
                className="size-10 rounded-full border border-forest-900/20 flex items-center justify-center hover:bg-forest-900 hover:text-white transition-colors cursor-pointer"
                aria-label="Next"
              >
                <NextIcon className="size-5" />
              </button>
            </div>
          </div>
        </div>

        {/* منطقة السلايدر المتحركة والمنضبطة داخل الكونتينر */}
        <div className="relative overflow-hidden pt-2 pb-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <AnimatePresence mode="popLayout">
              {getVisibleMembers().map((m, i) => (
                <motion.div
                  key={`${m.name}-${currentIndex}-${i}`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className={`group relative aspect-[3/4] overflow-hidden rounded-4xl bg-sage-100 shadow-sm ${
                    isEn ? 'text-left' : 'text-right'
                  }`}
                >
                  <img
                    src={m.image}
                    alt={m.name}
                    loading="lazy"
                    className="absolute inset-0 size-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <span className={`absolute top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-ink shadow-sm ${
                    isEn ? 'left-4' : 'right-4'
                  }`}>
                    {m.tag}
                  </span>
                  <div className="absolute inset-x-3 bottom-3 rounded-2xl border border-white/60 bg-white/75 p-4 backdrop-blur-md transition-transform duration-300 group-hover:-translate-y-1">
                    <h3 className="text-base font-semibold text-forest-900">{m.name}</h3>
                    <p className="mt-0.5 text-xs text-ink/70">{m.role}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

      </div>
    </section>
  )
}
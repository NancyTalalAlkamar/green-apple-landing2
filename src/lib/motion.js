// Shared Framer Motion variants — Ultra smooth & professional section transition

export const EASE = [0.25, 1, 0.5, 1] // منحنى حركي أنعم وأسرع استجابة

export const fadeUp = {
  hidden: { opacity: 0, y: 50 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } },
}

export const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 1, ease: EASE } },
}

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  show: { 
    opacity: 1, 
    scale: 1, 
    transition: { type: "spring", stiffness: 100, damping: 15 } 
  },
}

export const slideFromStart = {
  hidden: { opacity: 0, x: 70 },
  show: { opacity: 1, x: 0, transition: { duration: 0.9, ease: EASE } },
}

export const slideFromEnd = {
  hidden: { opacity: 0, x: -70 },
  show: { opacity: 1, x: 0, transition: { duration: 0.9, ease: EASE } },
}

export const stagger = (staggerChildren = 0.15, delayChildren = 0.1) => ({
  hidden: {},
  show: { transition: { staggerChildren, delayChildren } },
})

export const viewport = { once: false, amount: 0.25 } // جعل الأنيميشن يتفاعل في كل مرة تمرين فيها على القسم
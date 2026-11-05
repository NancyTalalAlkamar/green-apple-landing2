# Green Apple — Landing Page

React 18 + Vite + Tailwind CSS v4 + Framer Motion. Arabic (RTL).

## Getting started
```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in /dist
```

## Structure
```
src/
├─ App.jsx                 # page composition + MotionConfig (respects reduced-motion)
├─ index.css               # Tailwind + design tokens (@theme): forest / copper / sage / sand
├─ data/content.js         # ALL copy & data — edit text here, not in components
├─ lib/motion.js           # shared animation variants (fadeUp, scaleIn, slide…, stagger)
├─ components/
│  ├─ ui/Reveal.jsx        # scroll-reveal wrapper (whileInView) + Reveal.Item for staggering
│  ├─ ui/Button.jsx, Badge.jsx, SectionHeading.jsx
│  └─ BeforeAfter.jsx      # draggable before/after comparison (mouse, touch, keyboard)
└─ sections/
   Navbar · Hero · Services · Results · Journey · Booking · Team · FAQ · CTA · Contact · Footer
```

## Animations
| Section  | Effect |
|----------|--------|
| Navbar   | slides in on load, darkens on scroll, top scroll-progress bar, animated mobile menu |
| Hero     | staggered blur-in text, parallax background, content fades out as you scroll |
| Services | staggered scale-in cards, image zoom on hover |
| Results  | animated tabs (layoutId), progress bars fill in view, case switching with AnimatePresence |
| Journey  | timeline line draws with scroll progress, numbered steps pop in sequence |
| Booking  | phone + notifications move at different parallax speeds |
| Team     | cards rise with a slight rotation, staggered |
| FAQ      | smooth height accordion |
| CTA      | clip-path "open" reveal, parallax background, animated form success state |
| Contact  | pin drops in with spring + pulse |

## To replace before launch
- `data/content.js`: results cases 2–3 figures and FAQ answers 2–7 are placeholders (not in the design).
- Contact map is a stylised placeholder — swap for a Google Maps iframe once the street address is final.
- `CTA.jsx → onSubmit`: connect the callback form to your backend/CRM.
- Before/after visual uses generated silhouettes; swap in real (consented) 3D-scan images.

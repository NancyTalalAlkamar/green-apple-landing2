import { useEffect, useState } from 'react'
import {
  Clock,
  CalendarDays,
  ScanLine,
  Sparkles,
  Info,
  Droplet,
  UtensilsCrossed,
  Shirt,
  Pill,
  Footprints,
} from 'lucide-react'

export const ICONS = {
  clock: Clock,
  calendar: CalendarDays,
  scan: ScanLine,
  sparkles: Sparkles,
  info: Info,
  droplet: Droplet,
  utensils: UtensilsCrossed,
  shirt: Shirt,
  pill: Pill,
  walk: Footprints,
}

// true على الشاشات الكبيرة — منستعمله للأقسام اللي إلها شكل مختلف بالموبايل
export function useMedia(query) {
  const [match, setMatch] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(query).matches : false,
  )
  useEffect(() => {
    const mq = window.matchMedia(query)
    const onChange = () => setMatch(mq.matches)
    onChange()
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [query])
  return match
}
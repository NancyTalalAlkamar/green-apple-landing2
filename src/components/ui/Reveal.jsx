import { motion } from 'framer-motion'
import { fadeUp, stagger, viewport } from '../../lib/motion'

/**
 * Wraps content and animates it into view on scroll.
 * <Reveal> … </Reveal>                 → single fade-up block
 * <Reveal stagger> <Reveal.Item/> … </Reveal> → children animate one after another
 */
export default function Reveal({
  as = 'div',
  variants = fadeUp,
  stagger: isStagger = false,
  gap = 0.12,
  delay = 0,
  amount,
  className,
  children,
  ...rest
}) {
  const Comp = motion[as]
  const resolved = isStagger ? stagger(gap, delay) : delay ? withDelay(variants, delay) : variants
  return (
    <Comp
      className={className}
      variants={resolved}
      initial="hidden"
      whileInView="show"
      viewport={amount ? { ...viewport, amount } : viewport}
      {...rest}
    >
      {children}
    </Comp>
  )
}

function withDelay(variants, delay) {
  const show = variants.show || {}
  return { ...variants, show: { ...show, transition: { ...(show.transition || {}), delay } } }
}

function RevealItem({ as = 'div', variants = fadeUp, className, children, ...rest }) {
  const Comp = motion[as]
  return (
    <Comp className={className} variants={variants} {...rest}>
      {children}
    </Comp>
  )
}

Reveal.Item = RevealItem

import { motion } from 'framer-motion'

const variants = {
  primary: 'bg-copper-600 text-white hover:bg-copper-700 shadow-lg shadow-copper-600/25',
  dark: 'bg-forest-800 text-white hover:bg-forest-700',
  light: 'bg-white text-ink hover:bg-sage-50 shadow-sm',
  outline: 'border border-sage-200 bg-white text-ink hover:border-forest-600',
  ghost: 'border border-white/25 text-white hover:bg-white/10',
}

const sizes = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-11 px-6 text-sm',
  lg: 'h-13 px-8 text-base',
}

export default function Button({
  as = 'a',
  variant = 'primary',
  size = 'md',
  icon: Icon,
  className = '',
  children,
  ...rest
}) {
  const Comp = motion[as]
  return (
    <Comp
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={`inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-full font-semibold transition-colors ${variants[variant]} ${sizes[size]} ${className}`}
      {...rest}
    >
      {children}
      {Icon && <Icon className="size-4" aria-hidden />}
    </Comp>
  )
}

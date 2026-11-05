// Small pill label that sits above each section title ("• خدماتنا").
export default function Badge({ children, tone = 'light', className = '' }) {
  const tones = {
    light: 'border-sage-200 bg-white text-ink',
    dark: 'border-white/15 bg-white/10 text-white',
  }
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium ${tones[tone]} ${className}`}
    >
      <span className="size-1.5 rounded-full bg-copper-600" />
      {children}
    </span>
  )
}

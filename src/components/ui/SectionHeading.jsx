import Reveal from './Reveal'
import Badge from './Badge'

/**
 * Section title in the design's two-tone style:
 * a dark line + an accent (copper) phrase.
 */
export default function SectionHeading({
  badge,
  title,
  accent,
  accentFirst = false,
  tone = 'light',
  breakLine = false,
  className = '',
  children,
}) {
  const titleColor = tone === 'dark' ? 'text-white' : 'text-ink'
  const accentColor = tone === 'dark' ? 'text-copper-300' : 'text-gold-600'
  const Accent = <span className={accentColor}>{accent}</span>

  return (
    <Reveal stagger className={className}>
      {badge && (
        <Reveal.Item>
          <Badge tone={tone}>{badge}</Badge>
        </Reveal.Item>
      )}
      <Reveal.Item
        as="h2"
        className={`mt-4 text-3xl leading-tight font-bold sm:text-4xl lg:text-[2.75rem] ${titleColor}`}
      >
        {accentFirst && Accent}
        {accentFirst && ' '}
        {title}
        {breakLine ? <br /> : ' '}
        {!accentFirst && Accent}
      </Reveal.Item>
      {children && <Reveal.Item>{children}</Reveal.Item>}
    </Reveal>
  )
}

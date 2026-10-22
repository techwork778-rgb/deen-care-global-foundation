import Image from 'next/image'

export function Logo({
  className,
  priority = false,
  variant = 'on-light',
}: {
  className?: string
  priority?: boolean
  /** `on-dark` is the white mark used on black surfaces. */
  variant?: 'on-light' | 'on-dark'
}) {
  return (
    <Image
      src={variant === 'on-dark' ? '/logo-white.png' : '/logo.png'}
      alt="DEEN Care Global Foundation"
      width={934}
      height={894}
      priority={priority}
      className={className}
    />
  )
}

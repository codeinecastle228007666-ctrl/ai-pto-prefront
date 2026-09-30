import type { ReactNode } from 'react'
import { cn } from '@/shared'
import { useReveal } from '../model/useParallax'

interface RevealProps {
  children: ReactNode
  className?: string
  delay?: number
}

/** Обёртка с плавным появлением при скролле (fade + slide-up). */
export function Reveal({ children, className, delay = 0 }: RevealProps) {
  const { ref, visible } = useReveal<HTMLDivElement>()

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={cn(
        'transition-all duration-700 ease-out will-change-transform',
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
        className
      )}
    >
      {children}
    </div>
  )
}

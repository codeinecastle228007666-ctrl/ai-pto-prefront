import type { Severity } from '@/entities/finding'

/** Цвета серьёзности: border/bg для карточек и RGBA для подсветки на странице PDF. */
export const SEVERITY_STYLES: Record<Severity, { card: string; dot: string; chip: string; highlight: string }> = {
  critical: {
    card: 'border-l-red-700',
    dot: 'bg-red-700',
    chip: 'bg-red-100 text-red-800 border-red-300',
    highlight: 'rgba(185, 28, 28, 0.25)',
  },
  error: {
    card: 'border-l-red-500',
    dot: 'bg-red-500',
    chip: 'bg-red-50 text-red-700 border-red-200',
    highlight: 'rgba(239, 68, 68, 0.25)',
  },
  warning: {
    card: 'border-l-amber-500',
    dot: 'bg-amber-500',
    chip: 'bg-amber-50 text-amber-800 border-amber-200',
    highlight: 'rgba(245, 158, 11, 0.3)',
  },
  info: {
    card: 'border-l-blue-500',
    dot: 'bg-blue-500',
    chip: 'bg-blue-50 text-blue-700 border-blue-200',
    highlight: 'rgba(59, 130, 246, 0.25)',
  },
}

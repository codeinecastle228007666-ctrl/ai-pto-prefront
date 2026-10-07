import { Check, Loader2 } from 'lucide-react'
import { cn } from '@/shared'

const STAGES = [
  { id: 'extract', label: 'Извлечение' },
  { id: 'rules', label: 'Проверка' },
  { id: 'report', label: 'Отчёт' },
] as const

interface DemoProgressProps {
  /** Индекс активной стадии 0..2; 3 = все завершены */
  activeIndex: number
}

export function DemoProgress({ activeIndex }: DemoProgressProps) {
  return (
    <ol className="grid gap-3 sm:grid-cols-3">
      {STAGES.map((stage, index) => {
        const done = index < activeIndex
        const current = index === activeIndex
        return (
          <li
            key={stage.id}
            className={cn(
              'flex items-center gap-3 rounded-lg border px-4 py-3',
              done && 'border-green-200 bg-green-50',
              current && 'border-primary-300 bg-primary-50',
              !done && !current && 'border-gray-200 bg-white'
            )}
          >
            <span
              className={cn(
                'flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold',
                done && 'bg-green-600 text-white',
                current && 'bg-primary-600 text-white',
                !done && !current && 'bg-gray-100 text-gray-500'
              )}
            >
              {done ? (
                <Check className="h-4 w-4" />
              ) : current ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                index + 1
              )}
            </span>
            <span className="text-sm font-medium text-gray-900">{stage.label}</span>
          </li>
        )
      })}
    </ol>
  )
}

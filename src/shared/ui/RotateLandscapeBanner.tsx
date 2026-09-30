import { Smartphone } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from './Alert'
import { useViewport } from '@/shared/lib/useViewport'
import { cn } from '@/shared/lib/utils'

interface RotateLandscapeBannerProps {
  className?: string
}

/**
 * Предупреждение для страниц с таблицами: на узком экране в portrait
 * предложить повернуть устройство горизонтально.
 * Не блокирует UI — таблица остаётся доступной со scroll.
 */
export function RotateLandscapeBanner({ className }: RotateLandscapeBannerProps) {
  const { isNarrowPortrait } = useViewport()

  if (!isNarrowPortrait) return null

  return (
    <Alert
      variant="warning"
      role="status"
      className={cn(
        'rotate-landscape-banner mb-4',
        // CSS-страховка: скрыть, если JS ещё не обновил состояние, а ориентация уже landscape
        '[@media(orientation:landscape)]:hidden',
        className
      )}
    >
      <Smartphone className="h-4 w-4" />
      <AlertTitle>Поверните устройство</AlertTitle>
      <AlertDescription>
        Для удобной работы с таблицей поверните телефон или планшет в горизонтальное положение.
      </AlertDescription>
    </Alert>
  )
}

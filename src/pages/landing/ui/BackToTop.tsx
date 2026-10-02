import { useEffect, useState } from 'react'
import { ArrowUp } from 'lucide-react'
import { cn } from '@/shared'

const SCROLL_THRESHOLD = 480

/**
 * Плавающая кнопка «Вверх»: появляется после прокрутки вниз и плавно
 * возвращает к началу страницы (используется глобальный scroll-behavior: smooth).
 */
export function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    let raf: number | null = null
    const onScroll = () => {
      if (raf !== null) return
      raf = requestAnimationFrame(() => {
        raf = null
        setVisible(window.scrollY > SCROLL_THRESHOLD)
      })
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (raf !== null) cancelAnimationFrame(raf)
    }
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Вернуться наверх"
      tabIndex={visible ? 0 : -1}
      className={cn(
        'fixed bottom-6 right-6 z-40 flex h-11 w-11 items-center justify-center rounded-full',
        'bg-primary-600 text-white shadow-lg shadow-primary-900/20 ring-1 ring-primary-500',
        'transition-all duration-300 hover:bg-primary-700 hover:-translate-y-0.5 hover:shadow-xl',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-300 focus-visible:ring-offset-2 focus-visible:ring-offset-primary-950',
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
      )}
    >
      <ArrowUp className="h-5 w-5" />
    </button>
  )
}

import { useEffect, useRef, useState } from 'react'

/**
 * Возвращает прогресс прокрутки hero-секции (0..1) через requestAnimationFrame.
 * Используется для параллакс-слоёв: каждый слой двигается со своей скоростью.
 */
export function useParallax(threshold = 800) {
  const [offset, setOffset] = useState(0)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const onScroll = () => {
      if (rafRef.current !== null) return
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null
        setOffset(Math.min(window.scrollY, threshold))
      })
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [threshold])

  return { offset, progress: Math.min(offset / threshold, 1) }
}

/**
 * Плавное появление секций при попадании во вьюпорт (IntersectionObserver).
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(rootMargin = '0px 0px -80px 0px') {
  const ref = useRef<T | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (typeof IntersectionObserver === 'undefined') {
      const raf = requestAnimationFrame(() => setVisible(true))
      return () => cancelAnimationFrame(raf)
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true)
            observer.disconnect()
          }
        })
      },
      { rootMargin }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [rootMargin])

  return { ref, visible }
}

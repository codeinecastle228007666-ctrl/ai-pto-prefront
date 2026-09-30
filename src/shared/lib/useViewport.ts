import { useEffect, useState } from 'react'
import { useMediaQuery } from './useMediaQuery'

export interface ViewportState {
  width: number
  height: number
  /** Ширина ниже Tailwind `lg` (1024px) */
  isNarrow: boolean
  isPortrait: boolean
  /** Узкий экран в портретной ориентации — нужна подсказка для таблиц */
  isNarrowPortrait: boolean
}

const NARROW_QUERY = '(max-width: 1023px)'
const PORTRAIT_QUERY = '(orientation: portrait)'

function readSize() {
  if (typeof window === 'undefined') {
    return { width: 0, height: 0 }
  }
  return { width: window.innerWidth, height: window.innerHeight }
}

/**
 * Размеры окна + флаги узкого/портретного viewport (для адаптивных таблиц).
 */
export function useViewport(): ViewportState {
  const isNarrow = useMediaQuery(NARROW_QUERY)
  const isPortrait = useMediaQuery(PORTRAIT_QUERY)
  const [{ width, height }, setSize] = useState(readSize)

  useEffect(() => {
    const onResize = () => setSize(readSize())
    onResize()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return {
    width,
    height,
    isNarrow,
    isPortrait,
    isNarrowPortrait: isNarrow && isPortrait,
  }
}

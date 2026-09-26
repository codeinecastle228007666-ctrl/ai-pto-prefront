import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Providers } from './app'

async function enableMocking() {
  // MSW Service Worker (только в dev с включенными моками)
  if (!import.meta.env.DEV || import.meta.env.VITE_USE_MOCKS !== 'true') return
  const { worker } = await import('./mocks/browser')
  // Ждём активации воркера, чтобы первые запросы (например, auth/me) не ушли мимо моков
  await worker.start({
    onUnhandledRequest: 'bypass',
    quiet: false,
  })
}

enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <Providers />
    </StrictMode>,
  )
})

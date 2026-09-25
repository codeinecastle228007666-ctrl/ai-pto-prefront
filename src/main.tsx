import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Providers } from './app/providers'

// MSW Service Worker (только в dev с включенными моками)
if (import.meta.env.DEV && import.meta.env.VITE_USE_MOCKS === 'true') {
  import('./mocks/browser').then(({ worker }) => {
    worker.start({
      onUnhandledRequest: 'bypass',
      quiet: false,
    })
  })
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Providers />
  </StrictMode>,
)
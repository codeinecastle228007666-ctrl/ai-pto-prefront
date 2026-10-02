import { Link } from 'react-router-dom'
import { ArrowRight, Bot } from 'lucide-react'
import { Button } from '@/shared'
import { useParallax } from '../model/useParallax'

/** Hero-секция с параллаксом: несколько слоёв двигаются с разной скоростью при скролле. */
export function LandingHero() {
  const { offset } = useParallax(900)

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary-950 via-primary-900 to-primary-800">
      {/* Параллакс-слои */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div
          className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-primary-500/20 blur-3xl"
          style={{ transform: `translateY(${offset * 0.45}px)` }}
        />
        <div
          className="absolute top-1/3 -right-24 h-[28rem] w-[28rem] rounded-full bg-primary-400/15 blur-3xl"
          style={{ transform: `translateY(${offset * 0.25}px)` }}
        />
        <div
          className="absolute bottom-0 left-1/4 h-80 w-80 rounded-full bg-primary-600/25 blur-3xl"
          style={{ transform: `translateY(${offset * 0.6}px)` }}
        />
        <svg
          className="absolute inset-x-0 bottom-0 text-primary-950/60"
          viewBox="0 0 1440 120"
          fill="none"
          preserveAspectRatio="none"
          style={{ transform: `translateY(${offset * 0.12}px)` }}
        >
          <path d="M0 120 L0 64 Q360 8 720 56 T1440 48 L1440 120 Z" fill="currentColor" />
        </svg>
      </div>

      <div className="container-main relative z-10 flex min-h-screen flex-col items-center justify-center py-32 text-center">
        <div
          className="flex items-center gap-2 rounded-full border border-primary-400/40 bg-primary-800/60 px-4 py-1.5 text-sm text-primary-100 backdrop-blur"
          style={{ transform: `translateY(${offset * 0.1}px)` }}
        >
          <Bot className="h-4 w-4" />
          AI-ассистент инженера ПТО
        </div>

        <h1
          className="mt-8 max-w-4xl text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl"
          style={{ transform: `translateY(${offset * 0.18}px)` }}
        >
          Исполнительная документация без{' '}
          <span className="relative inline-block">
            <span className="relative z-10 bg-gradient-to-r from-primary-300 to-primary-100 bg-clip-text text-transparent">
              бессонных ночей
            </span>
          </span>
        </h1>

        <p
          className="mt-6 max-w-2xl text-lg text-primary-100/90 sm:text-xl"
          style={{ transform: `translateY(${offset * 0.26}px)` }}
        >
          Загрузите пакет документов — AI распознает каждый файл, найдёт расхождения с нормами,
          оценит комплектность и подготовит отчёт для подрядчика. Пока вы занимаетесь объектом.
        </p>

        <div
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
          style={{ transform: `translateY(${offset * 0.34}px)` }}
        >
          <Button asChild size="lg" className="h-12 px-8 text-base">
            <Link to="/login">
              Войти в систему
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <a
            href="#how-it-works"
            className="rounded-md px-8 py-3 text-base font-medium text-white/90 ring-1 ring-inset ring-white/30 transition hover:bg-white/10 hover:text-white"
          >
            Как это работает
          </a>
        </div>
      </div>
    </section>
  )
}

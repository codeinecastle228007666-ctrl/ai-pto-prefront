import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/shared'
import { isPublicDemoEnabled } from '../model/demoFlags'
import { Reveal } from './Reveal'

/** Финальный призыв к действию. */
export function LandingCta() {
  const demoEnabled = isPublicDemoEnabled()

  return (
    <section className="bg-gradient-to-b from-white to-primary-50 py-24">
      <div className="container-main">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-700 to-primary-900 px-8 py-16 text-center shadow-2xl shadow-primary-200">
            <div
              aria-hidden
              className="pointer-events-none absolute -top-24 left-1/2 h-64 w-[36rem] -translate-x-1/2 rounded-full bg-primary-400/20 blur-3xl"
            />
            <h2 className="relative text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Проверьте первый пакет документов уже сегодня
            </h2>
            <p className="relative mx-auto mt-4 max-w-xl text-lg text-primary-100">
              {demoEnabled
                ? 'Один бесплатный прогон без регистрации — загрузите PDF и посмотрите замечания.'
                : 'Загрузите исполнительную документацию — и посмотрите, какие замечания найдёт AI, пока вы пьёте кофе.'}
            </p>
            <div className="relative mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              {demoEnabled ? (
                <>
                  <Button asChild size="lg" variant="secondary" className="h-12 px-8 text-base">
                    <Link to="/demo">
                      Проверить документы бесплатно
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="h-12 px-8 text-base border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white"
                  >
                    <Link to="/login">Войти в систему</Link>
                  </Button>
                </>
              ) : (
                <Button asChild size="lg" variant="secondary" className="h-12 px-8 text-base">
                  <Link to="/login">
                    Войти в систему
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

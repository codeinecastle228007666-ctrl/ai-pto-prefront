import { LANDING_STEPS } from '../model/content'
import { Reveal } from './Reveal'

/** Секция «Как это работает»: 4 шага от загрузки до отчёта. */
export function LandingHowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-16 bg-gradient-to-b from-primary-50 to-white py-24">
      <div className="container-main">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary-600">Как это работает</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Четыре шага до готового отчёта
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            От загрузки пакета до PDF для подрядчика — без ручной сверки таблиц и журналов.
          </p>
        </Reveal>

        <div className="relative mt-16">
          {/* Соединительная линия (desktop) */}
          <div aria-hidden className="absolute left-0 right-0 top-8 hidden h-0.5 bg-gradient-to-r from-primary-200 via-primary-400 to-primary-200 lg:block" />

          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {LANDING_STEPS.map((step, i) => {
              const Icon = step.icon
              return (
                <Reveal key={step.title} delay={i * 120}>
                  <div className="relative text-center">
                    <div className="relative z-10 mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-600 text-white shadow-lg shadow-primary-200">
                      <Icon className="h-7 w-7" />
                    </div>
                    <h3 className="mt-5 text-lg font-semibold text-gray-900">{step.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-gray-600">{step.description}</p>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

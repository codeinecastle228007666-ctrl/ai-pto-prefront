import { ArrowRight } from 'lucide-react'
import { LANDING_FEATURES } from '../model/content'
import { Reveal } from './Reveal'

/** Секция возможностей: 6 карточек по спецификации API. */
export function LandingFeatures() {
  return (
    <section id="features" className="scroll-mt-16 bg-white py-24">
      <div className="container-main">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary-600">Возможности</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Проверка, которая обычно занимает дни — за минуты
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Система берёт на себя рутину инженера ПТО: чтение документов, сверку данных и поиск несоответствий.
          </p>
        </Reveal>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {LANDING_FEATURES.map((feature, i) => {
            const Icon = feature.icon
            return (
              <Reveal key={feature.title} delay={(i % 3) * 100}>
                <div className="group h-full rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary-300 hover:shadow-lg hover:shadow-primary-100">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 text-primary-700 transition-colors group-hover:bg-primary-600 group-hover:text-white">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-gray-900">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600">{feature.description}</p>
                </div>
              </Reveal>
            )
          })}
        </div>

        <Reveal className="mt-12 flex justify-center">
          <a
            href="#contact"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary-700 hover:text-primary-800"
          >
            Обсудить внедрение
            <ArrowRight className="h-4 w-4" />
          </a>
        </Reveal>
      </div>
    </section>
  )
}

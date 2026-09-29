import { LANDING_DOCUMENTS, LANDING_STATS } from '../model/content'
import { Reveal } from './Reveal'

/** Секция поддерживаемых типов документов. */
export function LandingDocuments() {
  return (
    <section id="documents" className="scroll-mt-16 bg-white py-24">
      <div className="container-main">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary-600">Документы</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Понимает язык стройки
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Система обучена на реальных типах исполнительной документации — от АОСР до журнала авторского надзора.
          </p>
        </Reveal>

        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {LANDING_DOCUMENTS.map((doc, i) => {
            const Icon = doc.icon
            return (
              <Reveal key={doc.title} delay={(i % 4) * 80}>
                <div className="flex h-full items-start gap-4 rounded-xl border border-gray-200 bg-gray-50 p-5 transition-colors hover:border-primary-300 hover:bg-primary-50">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-primary-700 shadow-sm">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{doc.title}</h3>
                    <p className="mt-1 text-sm text-gray-600">{doc.description}</p>
                  </div>
                </div>
              </Reveal>
            )
          })}
        </div>

        {/* Цифры */}
        <Reveal className="mt-20">
          <div className="grid gap-8 rounded-3xl bg-primary-950 px-8 py-12 sm:grid-cols-2 lg:grid-cols-4">
            {LANDING_STATS.map((stat) => {
              const Icon = stat.icon
              return (
                <div key={stat.label} className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-800 text-primary-300">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-white">{stat.value}</p>
                    <p className="text-sm text-primary-200">{stat.label}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </Reveal>
      </div>
    </section>
  )
}

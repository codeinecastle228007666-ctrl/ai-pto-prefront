import { LandingHeader } from './LandingHeader'
import { LandingHero } from './LandingHero'
import { LandingFeatures } from './LandingFeatures'
import { LandingHowItWorks } from './LandingHowItWorks'
import { LandingDocuments } from './LandingDocuments'
import { LandingCta } from './LandingCta'
import { LandingFooter } from './LandingFooter'
import { BackToTop } from './BackToTop'

/** Публичный лендинг ПТО-Doc. */
export function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <LandingHeader />
      <main>
        <LandingHero />
        <LandingFeatures />
        <LandingHowItWorks />
        <LandingDocuments />
        <LandingCta />
      </main>
      <LandingFooter />
      <BackToTop />
    </div>
  )
}

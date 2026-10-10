import { Link, Navigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import logo from '@/assets/logo-pto-doc.jpg'
import { isPublicDemoEnabled } from '../model/demoFlags'
import { PublicDemoFlow } from './PublicDemoFlow'

/** Публичная страница демо-проверки (UX как кабинет: upload → package workspace). */
export function DemoPage() {
  if (!isPublicDemoEnabled()) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="border-b border-gray-200 bg-white">
        <div className="container-main flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2" aria-label="ПТО-Doc, на главную">
            <span className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg bg-white shadow-sm">
              <img src={logo} alt="" className="h-full w-full scale-125 object-cover" />
            </span>
            <span className="text-xl font-bold text-primary-600">ПТО-Doc</span>
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-primary-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Назад
          </Link>
        </div>
      </header>
      <main className="px-3 py-6 sm:px-6 lg:px-8 sm:py-8">
        <PublicDemoFlow />
      </main>
    </div>
  )
}

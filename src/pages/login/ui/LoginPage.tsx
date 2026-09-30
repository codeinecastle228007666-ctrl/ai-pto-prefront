import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { LoginForm } from '@/features/auth'

export function LoginPage() {
  return (
    <div className="relative min-h-screen">
      {/* Ссылка на лендинг */}
      <Link
        to="/"
        className="absolute left-4 top-4 z-10 inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-primary-700 sm:left-6 sm:top-6"
      >
        <ArrowLeft className="h-4 w-4" />
        На главную
      </Link>
      <LoginForm />
    </div>
  )
}

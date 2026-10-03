import { useEffect } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { LoginForm, authApi, useAuthStore } from '@/features/auth'

export function LoginPage() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const sessionChecked = useAuthStore((s) => s.sessionChecked)
  const setUser = useAuthStore((s) => s.setUser)
  const clearAuth = useAuthStore((s) => s.clearAuth)
  const setSessionChecked = useAuthStore((s) => s.setSessionChecked)

  useEffect(() => {
    let mounted = true
    async function check() {
      if (sessionChecked) return
      try {
        const user = await authApi.me()
        if (mounted) setUser(user)
      } catch {
        if (mounted) clearAuth()
      } finally {
        if (mounted) setSessionChecked(true)
      }
    }
    check()
    return () => {
      mounted = false
    }
  }, [sessionChecked, setUser, clearAuth, setSessionChecked])

  if (!sessionChecked) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    )
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="relative min-h-screen">
      <Link
        to="/welcome"
        className="absolute left-4 top-4 z-10 inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-primary-700 sm:left-6 sm:top-6"
      >
        <ArrowLeft className="h-4 w-4" />
        На главную
      </Link>
      <LoginForm />
    </div>
  )
}

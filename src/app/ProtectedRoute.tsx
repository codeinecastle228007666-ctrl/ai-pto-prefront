import { useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { authApi, useAuthStore } from '@/features/auth'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const accessToken = useAuthStore((state) => state.accessToken)
  const refreshToken = useAuthStore((state) => state.refreshToken)
  const setAuth = useAuthStore((state) => state.setAuth)
  const clearAuth = useAuthStore((state) => state.clearAuth)
  const location = useLocation()
  const queryClient = useQueryClient()

  const isRestoringSession = !!accessToken && !isAuthenticated

  // Восстанавливаем сессию при загрузке: токен есть в localStorage, но юзер не загружен
  useEffect(() => {
    let mounted = true

    async function checkAuth() {
      if (!accessToken || isAuthenticated) return

      try {
        const user = await authApi.me()
        if (mounted) {
          setAuth({
            user,
            accessToken,
            refreshToken: refreshToken || '',
          })
        }
      } catch (error) {
        console.warn('[ProtectedRoute] auth/me failed:', error)
        if (mounted) {
          clearAuth()
          queryClient.clear()
        }
      }
    }

    checkAuth()
    return () => { mounted = false }
  }, [accessToken, isAuthenticated, refreshToken, setAuth, clearAuth, queryClient])

  if (!isAuthenticated) {
    // Не выкидываем на /login, пока идёт восстановление сессии по сохранённому токену
    if (isRestoringSession) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
        </div>
      )
    }
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}

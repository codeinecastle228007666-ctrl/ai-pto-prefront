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
  const sessionChecked = useAuthStore((state) => state.sessionChecked)
  const setUser = useAuthStore((state) => state.setUser)
  const clearAuth = useAuthStore((state) => state.clearAuth)
  const setSessionChecked = useAuthStore((state) => state.setSessionChecked)
  const location = useLocation()
  const queryClient = useQueryClient()

  useEffect(() => {
    let mounted = true

    async function checkAuth() {
      if (isAuthenticated) {
        setSessionChecked(true)
        return
      }

      try {
        const user = await authApi.me()
        if (mounted) setUser(user)
      } catch {
        if (mounted) {
          clearAuth()
          queryClient.clear()
        }
      } finally {
        if (mounted) setSessionChecked(true)
      }
    }

    if (!sessionChecked) {
      checkAuth()
    }

    return () => {
      mounted = false
    }
  }, [isAuthenticated, sessionChecked, setUser, clearAuth, setSessionChecked, queryClient])

  if (!sessionChecked) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}

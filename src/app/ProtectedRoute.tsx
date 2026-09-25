import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/features/auth/model/authStore'
import { authApi } from '@/features/auth/api/authApi'
import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const accessToken = useAuthStore((state) => state.accessToken)
  const setAuth = useAuthStore((state) => state.setAuth)
  const clearAuth = useAuthStore((state) => state.clearAuth)
  const location = useLocation()
  const queryClient = useQueryClient()

  // Проверяем токен при загрузке (только если токен есть, но юзер не загружен)
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
            refreshToken: localStorage.getItem('refreshToken') || '',
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
  }, [accessToken, isAuthenticated, setAuth, clearAuth, queryClient])

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}
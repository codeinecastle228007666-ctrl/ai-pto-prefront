import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { useQueryClient } from '@tanstack/react-query'
import { authApi } from '../api/authApi'
import { useAuthStore } from '../model/authStore'

// Единая логика выхода: logout на сервере (best-effort) + очистка стора и кеша
export function useLogout() {
  const navigate = useNavigate()
  const clearAuth = useAuthStore((state) => state.clearAuth)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      try {
        await authApi.logout()
      } catch {
        // серверный logout best-effort — локально выходим в любом случае
      }
    },
    onSettled: () => {
      clearAuth()
      queryClient.clear()
      navigate('/login', { replace: true })
    },
  })
}

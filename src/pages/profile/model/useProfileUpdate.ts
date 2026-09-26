import { useMutation } from '@tanstack/react-query'
import type { ProfileFormData, PasswordFormData } from './profileSchemas'

// TODO: заменить на реальные вызовы API, когда появятся эндпоинты обновления профиля и смены пароля
export function useProfileUpdate() {
  return useMutation({
    mutationFn: async (_data: ProfileFormData) => {
      await new Promise((resolve) => setTimeout(resolve, 800))
      return true
    },
  })
}

export function usePasswordChange() {
  return useMutation({
    mutationFn: async (_data: PasswordFormData) => {
      await new Promise((resolve) => setTimeout(resolve, 800))
      return true
    },
  })
}

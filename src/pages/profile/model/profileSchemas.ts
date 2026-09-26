import { z } from 'zod'

export const profileSchema = z.object({
  name: z.string().min(2, 'Имя минимум 2 символа'),
  email: z.string().email('Неверный формат email'),
})

export const passwordSchema = z
  .object({
    currentPassword: z.string().min(6, 'Текущий пароль минимум 6 символов'),
    newPassword: z.string().min(6, 'Новый пароль минимум 6 символов'),
    confirmPassword: z.string().min(6, 'Подтверждение пароля минимум 6 символов'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Пароли не совпадают',
    path: ['confirmPassword'],
  })

export type ProfileFormData = z.infer<typeof profileSchema>
export type PasswordFormData = z.infer<typeof passwordSchema>

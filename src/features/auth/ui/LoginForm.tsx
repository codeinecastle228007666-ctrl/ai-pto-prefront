import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate, useLocation } from 'react-router-dom'
import { Button, Input, Label, Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Alert, AlertDescription } from '@/shared'
import { useAuthStore } from '../model/authStore'
import { authApi } from '../api/authApi'

const loginSchema = z.object({
  email: z.string().email('Неверный формат email'),
  password: z.string().min(6, 'Пароль минимум 6 символов'),
})

type LoginFormData = z.infer<typeof loginSchema>

export function LoginForm() {
  const navigate = useNavigate()
  const location = useLocation()
  const setAuth = useAuthStore((state) => state.setAuth)
  const [error, setError] = useState<string | null>(null)

  const from = (location.state as { from?: Location })?.from?.pathname || '/objects'

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (data: LoginFormData) => {
    setError(null)
    try {
      const response = await authApi.login(data)
      const { user, accessToken, refreshToken } = response

      // Сразу пишем в localStorage, чтобы axios interceptor увидел токен
      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('refreshToken', refreshToken)

      setAuth({ user, accessToken, refreshToken })
      navigate(from, { replace: true })
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } }
      setError(axiosError.response?.data?.message || 'Ошибка входа. Проверьте email и пароль.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8 sm:py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center px-4 sm:px-6">
          <CardTitle className="text-xl font-bold text-gray-900 sm:text-2xl">AI-ПТО</CardTitle>
          <CardDescription className="text-gray-500">Войдите в личный кабинет</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="ivan@example.com"
                error={errors.email?.message}
                {...register('email')}
                disabled={isSubmitting}
                autoComplete="email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Пароль</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                error={errors.password?.message}
                {...register('password')}
                disabled={isSubmitting}
                autoComplete="current-password"
              />
            </div>
            <Button type="submit" className="w-full" size="lg" loading={isSubmitting}>
              Войти
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center text-sm text-gray-500">
          <p>Нет доступа? Обратитесь к администратору</p>
        </CardFooter>
      </Card>
    </div>
  )
}

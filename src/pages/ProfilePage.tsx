'use client'

import { useState } from 'react'
import { User, Mail, Lock, Save, AlertCircle, CheckCircle, LogOut } from 'lucide-react'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import { Label } from '@/shared/ui/Label'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/shared/ui/Card'
import { Alert, AlertDescription } from '@/shared/ui/Alert'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/Avatar'
import { Badge } from '@/shared/ui/Badge'
import { useAuthStore } from '@/features/auth/model/authStore'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { cn } from '@/shared/lib/utils'

const profileSchema = z.object({
  name: z.string().min(2, 'Имя минимум 2 символа'),
  email: z.string().email('Неверный формат email'),
})

const passwordSchema = z.object({
  currentPassword: z.string().min(6, 'Текущий пароль минимум 6 символов'),
  newPassword: z.string().min(6, 'Новый пароль минимум 6 символов'),
  confirmPassword: z.string().min(6, 'Подтверждение пароля минимум 6 символов'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Пароли не совпадают',
  path: ['confirmPassword'],
})

type ProfileFormData = z.infer<typeof profileSchema>
type PasswordFormData = z.infer<typeof passwordSchema>

export function ProfilePage() {
  const user = useAuthStore((state) => state.user)
  const clearAuth = useAuthStore((state) => state.clearAuth)
  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile')
  const [profileMessage, setProfileMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
    },
  })

  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  })

  const handleProfileSubmit = async (data: ProfileFormData) => {
    setProfileMessage(null)
    try {
      // TODO: API call to update profile
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API
      setProfileMessage({ type: 'success', text: 'Профиль успешно обновлён' })
    } catch {
      setProfileMessage({ type: 'error', text: 'Ошибка при обновлении профиля' })
    }
  }

  const handlePasswordSubmit = async (data: PasswordFormData) => {
    setPasswordMessage(null)
    try {
      // TODO: API call to change password
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API
      setPasswordMessage({ type: 'success', text: 'Пароль успешно изменён' })
      passwordForm.reset()
    } catch {
      setPasswordMessage({ type: 'error', text: 'Ошибка при смене пароля' })
    }
  }

  const handleLogout = () => {
    clearAuth()
    navigate('/login')
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Профиль</h1>
        <p className="text-gray-500 mt-1">Управление настройками аккаунта</p>
      </div>

      {/* Avatar & Basic Info */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-6">
            <Avatar className="h-20 w-20">
              <AvatarImage
                src={user?.name ? `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=22c55e&color=fff&size=200` : ''}
                alt={user?.name || ''}
              />
              <AvatarFallback className="text-2xl">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{user?.name || 'Пользователь'}</h2>
              <p className="text-gray-500">{user?.email || ''}</p>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  {user?.organization?.name || 'Организация не указана'}
                </span>
                <span className="flex items-center gap-1">
                  <Badge variant="outline">{user?.membership?.role || 'engineer'}</Badge>
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-6" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('profile')}
            className={cn(
              'pb-4 text-sm font-medium border-b-2 transition-colors',
              activeTab === 'profile'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            )}
          >
            Профиль
          </button>
          <button
            onClick={() => setActiveTab('password')}
            className={cn(
              'pb-4 text-sm font-medium border-b-2 transition-colors',
              activeTab === 'password'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            )}
          >
            Безопасность
          </button>
        </nav>
      </div>

      {activeTab === 'profile' && (
        <Card>
          <CardHeader>
            <CardTitle>Личные данные</CardTitle>
          </CardHeader>
          <form onSubmit={profileForm.handleSubmit(handleProfileSubmit)} className="p-6 space-y-4">
            {profileMessage && (
              <Alert variant={profileMessage.type === 'success' ? 'success' : 'destructive'}>
                <AlertDescription>{profileMessage.text}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="name">Имя *</Label>
              <Input
                id="name"
                error={profileForm.formState.errors.name?.message}
                {...profileForm.register('name')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                error={profileForm.formState.errors.email?.message}
                {...profileForm.register('email')}
              />
            </div>

            <CardFooter className="flex justify-end">
              <Button type="submit" loading={profileForm.formState.isSubmitting}>
                <Save className="h-4 w-4 mr-2" />
                Сохранить изменения
              </Button>
            </CardFooter>
          </form>
        </Card>
      )}

      {activeTab === 'password' && (
        <Card>
          <CardHeader>
            <CardTitle>Смена пароля</CardTitle>
          </CardHeader>
          <form onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)} className="p-6 space-y-4">
            {passwordMessage && (
              <Alert variant={passwordMessage.type === 'success' ? 'success' : 'destructive'}>
                <AlertDescription>{passwordMessage.text}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="currentPassword">Текущий пароль *</Label>
              <Input
                id="currentPassword"
                type="password"
                error={passwordForm.formState.errors.currentPassword?.message}
                {...passwordForm.register('currentPassword')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">Новый пароль *</Label>
              <Input
                id="newPassword"
                type="password"
                error={passwordForm.formState.errors.newPassword?.message}
                {...passwordForm.register('newPassword')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Подтвердите новый пароль *</Label>
              <Input
                id="confirmPassword"
                type="password"
                error={passwordForm.formState.errors.confirmPassword?.message}
                {...passwordForm.register('confirmPassword')}
              />
            </div>

            <CardFooter className="flex justify-end">
              <Button type="submit" loading={passwordForm.formState.isSubmitting}>
                <Lock className="h-4 w-4 mr-2" />
                Изменить пароль
              </Button>
            </CardFooter>
          </form>
        </Card>
      )}

      {/* Danger Zone */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-600 flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Опасная зона
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 mb-4">Необратимые действия</p>
          <Button variant="destructive" onClick={handleLogout} className="w-full sm:w-auto">
            <LogOut className="h-4 w-4 mr-2" />
            Выйти из аккаунта
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
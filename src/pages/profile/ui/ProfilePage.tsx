import { useState } from 'react'
import { User, AlertCircle, LogOut } from 'lucide-react'
import { useAuthStore, useLogout } from '@/features/auth'
import { Avatar, AvatarFallback, Badge, Button, Card, CardHeader, CardTitle, CardContent, cn } from '@/shared'
import { ProfileForm } from './ProfileForm'
import { PasswordForm } from './PasswordForm'

export function ProfilePage() {
  const user = useAuthStore((state) => state.user)
  const logoutMutation = useLogout()
  const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile')

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Профиль</h1>
        <p className="text-gray-500 mt-1 text-sm sm:text-base">Управление настройками аккаунт</p>
      </div>

      {/* Avatar & Basic Info */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
            <Avatar className="h-16 w-16 sm:h-20 sm:w-20">
              <AvatarFallback className="text-xl sm:text-2xl bg-primary-600 text-white">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <h2 className="text-lg font-semibold text-gray-900 sm:text-xl truncate">{user?.name || 'Пользователь'}</h2>
              <p className="text-gray-500 truncate">{user?.email || ''}</p>
              <div className="flex flex-col gap-2 mt-2 text-sm text-gray-500 sm:flex-row sm:items-center sm:gap-4">
                <span className="flex items-center gap-1 min-w-0">
                  <User className="h-4 w-4 shrink-0" />
                  <span className="truncate">{user?.organization?.name || 'Организация не указана'}</span>
                </span>
                <Badge variant="outline">{user?.membership?.role || 'engineer'}</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <div className="border-b border-gray-200 overflow-x-auto">
        <nav className="flex gap-4 sm:gap-6 min-w-max" aria-label="Tabs">
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

      {activeTab === 'profile' && <ProfileForm />}
      {activeTab === 'password' && <PasswordForm />}

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
          <Button
            variant="destructive"
            onClick={() => logoutMutation.mutate()}
            loading={logoutMutation.isPending}
            className="w-full sm:w-auto"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Выйти из аккаунта
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

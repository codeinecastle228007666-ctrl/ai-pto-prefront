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
        <h1 className="text-3xl font-bold text-gray-900">Профиль</h1>
        <p className="text-gray-500 mt-1">Управление настройками аккаунт</p>
      </div>

      {/* Avatar & Basic Info */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-6">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="text-2xl bg-primary-600 text-white">
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
                <Badge variant="outline">{user?.membership?.role || 'engineer'}</Badge>
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

import { LogOut } from 'lucide-react'
import { useUser, useLogout, ROLE_LABELS } from '@/features/auth'
import { Avatar, AvatarFallback, Badge, Button, Card, CardContent, CardHeader, CardTitle } from '@/shared'

/** Профиль stage-1: только просмотр (email, имя, роль, организация). */
export function ProfilePage() {
  const user = useUser()
  const logoutMutation = useLogout()
  const role = user?.membership?.role
  const roleLabel = role ? ROLE_LABELS[role] ?? role : '—'

  const rows: { label: string; value: string }[] = [
    { label: 'Email', value: user?.email || '—' },
    { label: 'Имя', value: user?.name || '—' },
    { label: 'Роль', value: roleLabel },
    { label: 'Организация', value: user?.organization?.name || '—' },
  ]

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Профиль</h1>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-14 w-14 sm:h-16 sm:w-16">
              <AvatarFallback className="text-xl bg-primary-600 text-white">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <CardTitle className="truncate">{user?.name || 'Пользователь'}</CardTitle>
              <Badge variant="outline" className="mt-1">{roleLabel}</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <dl className="divide-y divide-gray-100">
            {rows.map((row) => (
              <div key={row.label} className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
                <dt className="text-sm text-gray-500">{row.label}</dt>
                <dd className="text-sm font-medium text-gray-900 break-words sm:col-span-2">{row.value}</dd>
              </div>
            ))}
          </dl>
        </CardContent>
      </Card>

      <Button
        variant="outline"
        onClick={() => logoutMutation.mutate()}
        loading={logoutMutation.isPending}
        className="w-full sm:w-auto"
      >
        <LogOut className="h-4 w-4 mr-2" />
        Выйти
      </Button>
    </div>
  )
}

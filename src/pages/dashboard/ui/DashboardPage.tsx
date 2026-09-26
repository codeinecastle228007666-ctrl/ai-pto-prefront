import { Link } from 'react-router-dom'
import { useObjects } from '@/features/objects'
import { StatusBadge } from '@/entities/object'
import { Card, CardHeader, CardTitle, CardContent } from '@/shared'
import { DashboardStats } from './DashboardStats'
import { DashboardRecentObjects } from './DashboardRecentObjects'

export function DashboardPage() {
  // Дашборд строится на реальных данных списка объектов
  const { data, isLoading } = useObjects({ page: 1, limit: 100, sortBy: 'updatedAt', sortOrder: 'desc' })
  const objects = data?.data ?? []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Обзор</h1>
        <p className="text-gray-500 mt-1">Сводка по вашим объектам и проверкам</p>
      </div>

      <DashboardStats objects={objects} total={data?.total ?? 0} isLoading={isLoading} />

      <div className="grid gap-6 lg:grid-cols-2">
        <DashboardRecentObjects objects={objects.slice(0, 5)} isLoading={isLoading} />

        <Card>
          <CardHeader>
            <CardTitle>Незавершённые проверки</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              <p>Пакеты проверок появятся после подключения модуля документов</p>
              <Link to="/objects" className="text-primary-600 hover:underline mt-2 inline-block">
                Перейти к объектам
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

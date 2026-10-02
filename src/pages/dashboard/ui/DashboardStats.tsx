import { FolderKanban, PauseCircle, CheckCircle, Flag } from 'lucide-react'
import type { ConstructionObject } from '@/entities/object'
import { Card, CardContent, Skeleton, cn } from '@/shared'

interface DashboardStatsProps {
  objects: ConstructionObject[]
  total: number
  isLoading?: boolean
}

export function DashboardStats({ objects, total, isLoading }: DashboardStatsProps) {
  const activeCount = objects.filter((o) => o.status === 'active').length
  const onHoldCount = objects.filter((o) => o.status === 'on_hold').length
  const completedCount = objects.filter((o) => o.status === 'completed').length

  const stats = [
    { name: 'Всего объектов', value: String(total), icon: FolderKanban, color: 'text-blue-600 bg-blue-100' },
    { name: 'В работе', value: String(activeCount), icon: CheckCircle, color: 'text-green-600 bg-green-100' },
    { name: 'На паузе', value: String(onHoldCount), icon: PauseCircle, color: 'text-amber-600 bg-amber-100' },
    { name: 'Завершено', value: String(completedCount), icon: Flag, color: 'text-gray-600 bg-gray-100' },
  ]

  return (
    <div className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.name} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                {isLoading ? (
                  <Skeleton className="h-8 w-12 mt-1" />
                ) : (
                  <p className="text-2xl font-bold text-gray-900 mt-1 sm:text-3xl">{stat.value}</p>
                )}
              </div>
              <div className={cn('p-2.5 sm:p-3 rounded-full shrink-0', stat.color)}>
                <stat.icon className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/Card'
import { Badge } from '@/shared/ui/Badge'
import { Button } from '@/shared/ui/Button'
import { ArrowUpRight, FolderKanban, AlertTriangle, Clock, CheckCircle } from 'lucide-react'
import { cn } from '@/shared/lib/utils'

const stats = [
  { name: 'Активных объектов', value: '12', icon: FolderKanban, color: 'text-blue-600 bg-blue-100', href: '/objects' },
  { name: 'Критичных замечаний', value: '3', icon: AlertTriangle, color: 'text-red-600 bg-red-100', href: '/findings' },
  { name: 'Обработка документов', value: '2', icon: Clock, color: 'text-amber-600 bg-amber-100', href: '/documents' },
  { name: 'Завершено проверок', value: '8', icon: CheckCircle, color: 'text-green-600 bg-green-100', href: '/reports' },
]

export function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Обзор</h1>
          <p className="text-gray-500 mt-1">Сводка по вашим объектам и проверкам</p>
        </div>
        <Button asChild>
          <a href="/objects">
            <span>Перейти к объектам</span>
            <ArrowUpRight className="ml-2 h-4 w-4" />
          </a>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={cn('p-3 rounded-full', stat.color)}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Последние объекты</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: 'ЖК Северный, корпус 3', type: 'Многоквартирный жилой дом', status: 'active', readiness: 65 },
                { name: 'ТЦ Галактика', type: 'Торговый центр', status: 'active', readiness: 40 },
                { name: 'Складской комплекс Юг', type: 'Склад', status: 'on_hold', readiness: 80 },
              ].map((obj, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div>
                    <p className="font-medium text-gray-900">{obj.name}</p>
                    <p className="text-sm text-gray-500">{obj.type}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant={obj.status === 'active' ? 'success' : obj.status === 'on_hold' ? 'warning' : 'default'}>
                      {obj.status === 'active' ? 'Активен' : obj.status === 'on_hold' ? 'На паузе' : obj.status}
                    </Badge>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{obj.readiness}%</p>
                      <p className="text-xs text-gray-500">готовность</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Незавершённые проверки</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { object: 'ЖК Северный, корпус 3', package: 'Пакет v3', stage: 'Парсинг', progress: 60 },
                { object: 'ТЦ Галактика', package: 'Пакет v1', stage: 'Классификация', progress: 25 },
              ].map((item, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-900">{item.object}</span>
                    <span className="text-gray-500">{item.package}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-primary-600 rounded-full transition-all" style={{ width: `${item.progress}%` }} />
                    </div>
                    <span className="text-sm text-gray-500 w-20 text-right">{item.progress}%</span>
                  </div>
                  <p className="text-xs text-gray-500">Этап: {item.stage}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
import { Link } from 'react-router-dom'
import type { ConstructionObject } from '@/entities/object'
import { StatusBadge } from '@/entities/object'
import { Card, CardHeader, CardTitle, CardContent, Skeleton } from '@/shared'

interface DashboardRecentObjectsProps {
  objects: ConstructionObject[]
  isLoading?: boolean
}

export function DashboardRecentObjects({ objects, isLoading }: DashboardRecentObjectsProps) {
  return (
    <Card className="min-w-0 w-full">
      <CardHeader>
        <CardTitle>Последние объекты</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-14 w-full" />
            ))}
          </div>
        ) : objects.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>Объектов пока нет</p>
            <Link to="/objects" className="text-primary-600 hover:underline mt-2 inline-block">
              Создать первый объект
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {objects.map((obj) => (
              <Link
                key={obj.id}
                to={`/objects/${obj.id}`}
                className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors min-w-0"
              >
                <div className="min-w-0 flex-1 basis-[12rem]">
                  <p className="font-medium text-gray-900 truncate">{obj.name}</p>
                  <p className="text-sm text-gray-500 truncate">{obj.objectType?.name || obj.code}</p>
                </div>
                <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
                  <StatusBadge status={obj.status} />
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{obj.readiness || 0}%</p>
                    <p className="text-xs text-gray-500">готовность</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

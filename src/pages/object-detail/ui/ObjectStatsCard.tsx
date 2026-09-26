import { Card, CardHeader, CardTitle, CardContent } from '@/shared'
import type { ConstructionObject } from '@/entities/object'
import { formatObjectDate } from '../model/formatObjectDate'

interface ObjectStatsCardProps {
  object: ConstructionObject
}

export function ObjectStatsCard({ object }: ObjectStatsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Статистика объекта</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatItem label="Пакетов загрузок" value={object._count?.packages || 0} />
          <StatItem label="Замечаний" value={object._count?.findings || 0} />
          <StatItem
            label="Последняя проверка"
            value={object.lastCheckedAt ? formatObjectDate(object.lastCheckedAt) : '—'}
          />
          <StatItem label="Готовность" value={`${object.readiness || 0}%`} />
        </div>

        {object.description && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Описание</h3>
            <p className="text-gray-900">{object.description}</p>
          </div>
        )}

        {object.workTypes && object.workTypes.length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Виды работ</h3>
            <div className="flex flex-wrap gap-2">
              {object.workTypes.map((wt) => (
                <span key={wt.id} className="inline-flex items-center rounded-full border border-gray-300 px-2.5 py-0.5 text-xs font-semibold text-gray-700">
                  {wt.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function StatItem({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="text-center p-4 bg-gray-50 rounded-lg">
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-xs text-gray-500 mt-1">{label}</p>
    </div>
  )
}

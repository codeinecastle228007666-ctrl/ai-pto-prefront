import { Card, CardHeader, CardTitle, CardContent } from '@/shared'
import type { ConstructionObject } from '@/entities/object'

interface ObjectStatsCardProps {
  object: ConstructionObject
}

/** Виды работ и описание объекта. */
export function ObjectStatsCard({ object }: ObjectStatsCardProps) {
  const hasWorkTypes = !!object.workTypes && object.workTypes.length > 0
  if (!hasWorkTypes && !object.description) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle>Об объекте</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {hasWorkTypes && (
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Виды работ</h3>
            <div className="flex flex-wrap gap-2">
              {object.workTypes!.map((wt) => (
                <span
                  key={wt.id}
                  className="inline-flex items-center rounded-full border border-gray-300 px-2.5 py-0.5 text-xs font-semibold text-gray-700"
                >
                  {wt.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {object.description && (
          <div className={hasWorkTypes ? 'pt-6 border-t border-gray-200' : undefined}>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Описание</h3>
            <p className="text-gray-900 whitespace-pre-line">{object.description}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

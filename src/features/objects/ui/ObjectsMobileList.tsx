import { Archive, Eye, Pencil } from 'lucide-react'
import type { ConstructionObject } from '@/entities/object'
import { StatusBadge } from '@/entities/object'
import { Badge, Button, Skeleton, Tooltip, TooltipContent, TooltipTrigger } from '@/shared'

interface ObjectsMobileListProps {
  data: ConstructionObject[]
  onOpenObject: (object: ConstructionObject) => void
  onEditObject: (object: ConstructionObject) => void
  onArchiveObject: (object: ConstructionObject) => void
  isLoading?: boolean
  emptyText?: string
}

export function ObjectsMobileList({
  data,
  onOpenObject,
  onEditObject,
  onArchiveObject,
  isLoading,
  emptyText = 'Объектов не найдено',
}: ObjectsMobileListProps) {
  if (isLoading) {
    return (
      <div className="space-y-3 p-4">
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} className="h-28 w-full rounded-lg" />
        ))}
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="px-4 py-12 text-center text-sm text-gray-500">{emptyText}</div>
    )
  }

  return (
    <ul className="divide-y divide-gray-200">
      {data.map((object) => (
        <li key={object.id}>
          <div
            role="button"
            tabIndex={0}
            className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-500"
            onClick={() => onOpenObject(object)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onOpenObject(object)
              }
            }}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="font-medium text-gray-900 truncate">{object.name}</p>
                <p className="text-sm text-gray-500 mt-0.5 truncate">{object.code}</p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <StatusBadge status={object.status} />
                  {object.objectType?.name && (
                    <Badge variant="outline" className="max-w-full truncate">
                      {object.objectType.name}
                    </Badge>
                  )}
                </div>
              </div>
              <div
                className="flex shrink-0 items-center gap-0.5"
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => e.stopPropagation()}
              >
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      aria-label="Открыть"
                      onClick={() => onOpenObject(object)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Открыть</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      aria-label="Редактировать"
                      onClick={() => onEditObject(object)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Редактировать</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                      aria-label="Архивировать"
                      onClick={() => onArchiveObject(object)}
                    >
                      <Archive className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Архивировать</TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}

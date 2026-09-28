import { createColumnHelper, type ColumnDef } from '@tanstack/react-table'
import { Archive, Eye, Pencil } from 'lucide-react'
import type { ConstructionObject } from '@/entities/object'
import { StatusBadge } from '@/entities/object'
import {
  Badge,
  Button,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/shared'
import type { ObjectsFiltersState } from './objectsStore'
import { ColumnFilterPopup } from '../ui/ColumnFilterPopup'

const columnHelper = createColumnHelper<ConstructionObject>()

export interface ObjectsColumnActions {
  onOpenObject: (object: ConstructionObject) => void
  onEditObject: (object: ConstructionObject) => void
  onArchiveObject: (object: ConstructionObject) => void
  filters: ObjectsFiltersState
  onFiltersChange: (filters: Partial<ObjectsFiltersState>) => void
  objectTypes: { id: string; name: string }[]
  organizations: { id: string; name: string }[]
}

const OBJECT_STATUS_OPTIONS = [
  { value: 'draft', label: 'Черновик' },
  { value: 'active', label: 'Активен' },
  { value: 'on_hold', label: 'На паузе' },
  { value: 'completed', label: 'Завершён' },
  { value: 'archived', label: 'В архиве' },
]

/**
 * Все колонки таблицы объектов. Собираются через columnHelper:
 * сортировка (enableSorting) у каждого столбца, фильтры — ColumnFilterPopup в заголовках.
 */
export function useObjectsColumns({
  onOpenObject,
  onEditObject,
  onArchiveObject,
  filters,
  onFiltersChange,
  objectTypes,
  organizations,
}: ObjectsColumnActions): ColumnDef<ConstructionObject, any>[] {
  return [
    columnHelper.accessor('name', {
      id: 'name',
      header: 'Название',
      enableSorting: true,
      cell: ({ row }) => (
        <div>
          <div className="font-medium text-gray-900">{row.original.name}</div>
          <div className="text-xs text-gray-500">{row.original.code}</div>
        </div>
      ),
    }),
    columnHelper.accessor(
      (row) => row.objectType?.name ?? '',
      {
        id: 'objectTypeId',
        header: () => (
          <ColumnFilterPopup
            label="Тип"
            active={!!filters.objectTypeId}
            options={objectTypes.map((t) => ({ value: t.id, label: t.name }))}
            value={filters.objectTypeId ? [filters.objectTypeId] : []}
            onApply={(values) => onFiltersChange({ objectTypeId: values[0] || undefined })}
          />
        ),
        cell: ({ row }) => (
          <Badge variant="outline">{row.original.objectType?.name || '—'}</Badge>
        ),
        enableSorting: true,
      }
    ),
    columnHelper.accessor('address', {
      id: 'address',
      header: 'Адрес',
      enableSorting: true,
      cell: ({ row }) => (
        <span className="text-gray-500 block max-w-[200px] truncate">{row.original.address}</span>
      ),
    }),
    columnHelper.accessor(
      (row) => row.customerOrganization?.name ?? '',
      {
        id: 'customerOrganizationId',
        header: () => (
          <ColumnFilterPopup
            label="Заказчик"
            active={!!filters.customerOrganizationId}
            options={organizations.map((o) => ({ value: o.id, label: o.name }))}
            value={filters.customerOrganizationId ? [filters.customerOrganizationId] : []}
            onApply={(values) => onFiltersChange({ customerOrganizationId: values[0] || undefined })}
          />
        ),
        cell: ({ row }) => (
          <span className="text-gray-500">{row.original.customerOrganization?.name || '—'}</span>
        ),
        enableSorting: true,
      }
    ),
    columnHelper.accessor(
      (row) => row.contractorOrganization?.name ?? '',
      {
        id: 'contractorOrganizationId',
        header: () => (
          <ColumnFilterPopup
            label="Подрядчик"
            active={!!filters.contractorOrganizationId}
            options={organizations.map((o) => ({ value: o.id, label: o.name }))}
            value={filters.contractorOrganizationId ? [filters.contractorOrganizationId] : []}
            onApply={(values) => onFiltersChange({ contractorOrganizationId: values[0] || undefined })}
          />
        ),
        cell: ({ row }) => (
          <span className="text-gray-500">{row.original.contractorOrganization?.name || '—'}</span>
        ),
        enableSorting: true,
      }
    ),
    columnHelper.accessor('status', {
      id: 'status',
      header: () => (
        <ColumnFilterPopup
          label="Статус"
          active={filters.status.length > 0}
          options={OBJECT_STATUS_OPTIONS}
          value={filters.status}
          multi
          onApply={(values) => onFiltersChange({ status: values as ObjectsFiltersState['status'] })}
        />
      ),
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
      enableSorting: true,
    }),
    columnHelper.accessor('readiness', {
      id: 'readiness',
      header: 'Готовность',
      enableSorting: true,
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-primary-600 rounded-full" style={{ width: `${row.original.readiness || 0}%` }} />
          </div>
          <span className="text-sm text-gray-500">{row.original.readiness || 0}%</span>
        </div>
      ),
    }),
    columnHelper.accessor('lastCheckedAt', {
      id: 'lastCheckedAt',
      header: 'Проверено',
      enableSorting: true,
      cell: ({ row }) => (
        <span className="text-sm text-gray-500">
          {row.original.lastCheckedAt ? new Date(row.original.lastCheckedAt).toLocaleDateString('ru-RU') : '—'}
        </span>
      ),
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Действия',
      cell: ({ row }) => (
        <div className="flex items-center gap-0.5" onClick={(e) => e.stopPropagation()}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                aria-label="Открыть"
                onClick={() => onOpenObject(row.original)}
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
                onClick={() => onEditObject(row.original)}
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
                onClick={() => onArchiveObject(row.original)}
              >
                <Archive className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Архивировать</TooltipContent>
          </Tooltip>
        </div>
      ),
    }),
  ]
}

import type { SortingState } from '@tanstack/react-table'
import type { ConstructionObject } from '@/entities/object'
import { DataTable } from '@/shared'
import type { ObjectsFiltersState } from '../model/objectsStore'
import { useObjectsColumns } from '../model/useColumns'

interface ObjectsTableProps {
  data: ConstructionObject[]
  sorting: SortingState
  onSortingChange: (sorting: SortingState) => void
  onOpenObject: (object: ConstructionObject) => void
  onEditObject: (object: ConstructionObject) => void
  onArchiveObject: (object: ConstructionObject) => void
  isLoading?: boolean
  filters: ObjectsFiltersState
  onFiltersChange: (filters: Partial<ObjectsFiltersState>) => void
  objectTypes: { id: string; name: string }[]
  organizations: { id: string; name: string }[]
}

/**
 * Таблица объектов: колонки собираются в хуке useObjectsColumns (columnHelper),
 * рендер — переиспользуемый DataTable из shared.
 */
export function ObjectsTable({
  data,
  sorting,
  onSortingChange,
  onOpenObject,
  onEditObject,
  onArchiveObject,
  isLoading,
  filters,
  onFiltersChange,
  objectTypes,
  organizations,
}: ObjectsTableProps) {
  const columns = useObjectsColumns({
    onOpenObject,
    onEditObject,
    onArchiveObject,
    filters,
    onFiltersChange,
    objectTypes,
    organizations,
  })

  return (
    <DataTable
      data={data}
      columns={columns}
      sorting={sorting}
      onSortingChange={onSortingChange}
      manualSorting
      headerOwnsInteractionColumnIds={[
        'objectTypeId',
        'customerOrganizationId',
        'contractorOrganizationId',
        'status',
      ]}
      getRowId={(row) => row.id}
      onRowClick={onOpenObject}
      isLoading={isLoading}
      emptyText="Объектов не найдено"
    />
  )
}

import { Search, X } from 'lucide-react'
import { Button, Input } from '@/shared'
import type { ObjectsFiltersState } from '../model/objectsStore'

interface ObjectsFiltersProps {
  filters: ObjectsFiltersState
  onChange: (filters: Partial<ObjectsFiltersState>) => void
  onReset: () => void
}

// Строка поиска по объектам (название/код/адрес).
// Остальные фильтры (статус/тип/заказчик/подрядчик) переехали в заголовки столбцов таблицы.
export function ObjectsFilters({ filters, onChange, onReset }: ObjectsFiltersProps) {
  const hasActiveFilters =
    filters.search !== '' ||
    filters.status.length > 0 ||
    !!filters.objectTypeId ||
    !!filters.customerOrganizationId ||
    !!filters.contractorOrganizationId

  return (
    <div className="flex items-center gap-3">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Поиск по названию, коду, адресу..."
          value={filters.search}
          onChange={(e) => onChange({ search: e.target.value })}
          className="pl-10"
        />
        {filters.search && (
          <button
            type="button"
            onClick={() => onChange({ search: '' })}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600"
            aria-label="Очистить поиск"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      {hasActiveFilters && (
        <Button variant="ghost" onClick={onReset} className="ml-auto">
          Сбросить
        </Button>
      )}
    </div>
  )
}

import { Search, Filter, ChevronDown, X } from 'lucide-react'
import { OBJECT_STATUS_CONFIG, OBJECT_STATUSES } from '@/entities/object'
import { Badge, Button, DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuCheckboxItem, DropdownMenuSeparator, DropdownMenuItem, Input, Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/shared'
import type { ObjectsFiltersState } from '../model/objectsStore'

interface ObjectsFiltersProps {
  filters: ObjectsFiltersState
  objectTypes: { id: string; name: string }[]
  organizations: { id: string; name: string }[]
  onChange: (filters: Partial<ObjectsFiltersState>) => void
  onReset: () => void
}

// Серверные фильтры списка объектов
export function ObjectsFilters({
  filters,
  objectTypes,
  organizations,
  onChange,
  onReset,
}: ObjectsFiltersProps) {
  const hasActiveFilters =
    filters.search !== '' ||
    filters.status.length > 0 ||
    !!filters.objectTypeId ||
    !!filters.customerOrganizationId ||
    !!filters.contractorOrganizationId

  return (
    <div className="flex flex-col lg:flex-row gap-3">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Поиск по названию, коду, адресу..."
          value={filters.search}
          onChange={(e) => onChange({ search: e.target.value })}
          className="pl-10"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {/* Статус — мульти-выбор */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Статус
              {filters.status.length > 0 && (
                <span className="inline-flex items-center justify-center h-5 min-w-5 rounded-full bg-primary-600 px-1 text-xs text-white">
                  {filters.status.length}
                </span>
              )}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {OBJECT_STATUSES.map((status) => (
              <DropdownMenuCheckboxItem
                key={status}
                checked={filters.status.includes(status)}
                onCheckedChange={(checked) => {
                  const next = checked
                    ? [...filters.status, status]
                    : filters.status.filter((s) => s !== status)
                  onChange({ status: next })
                }}
                className="cursor-pointer"
              >
                <Badge variant={OBJECT_STATUS_CONFIG[status].badge}>{OBJECT_STATUS_CONFIG[status].text}</Badge>
              </DropdownMenuCheckboxItem>
            ))}
            {filters.status.length > 0 && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onChange({ status: [] })} className="cursor-pointer">
                  <X className="h-4 w-4 mr-2" />
                  Очистить статусы
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Тип объекта */}
        <Select
          value={filters.objectTypeId ?? 'all'}
          onValueChange={(value) => onChange({ objectTypeId: value === 'all' ? undefined : value })}
        >
          <SelectTrigger className="w-[190px]">
            <SelectValue placeholder="Тип объекта" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все типы</SelectItem>
            {objectTypes.map((type) => (
              <SelectItem key={type.id} value={type.id}>{type.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Заказчик */}
        <Select
          value={filters.customerOrganizationId ?? 'all'}
          onValueChange={(value) => onChange({ customerOrganizationId: value === 'all' ? undefined : value })}
        >
          <SelectTrigger className="w-[190px]">
            <SelectValue placeholder="Заказчик" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все заказчики</SelectItem>
            {organizations.map((org) => (
              <SelectItem key={org.id} value={org.id}>{org.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Подрядчик */}
        <Select
          value={filters.contractorOrganizationId ?? 'all'}
          onValueChange={(value) => onChange({ contractorOrganizationId: value === 'all' ? undefined : value })}
        >
          <SelectTrigger className="w-[190px]">
            <SelectValue placeholder="Подрядчик" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все подрядчики</SelectItem>
            {organizations.map((org) => (
              <SelectItem key={org.id} value={org.id}>{org.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button variant="ghost" onClick={onReset}>
            Сбросить
          </Button>
        )}
      </div>
    </div>
  )
}

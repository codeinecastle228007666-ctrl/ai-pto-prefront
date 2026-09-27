import {
  useReactTable,
  getCoreRowModel,
  type ColumnDef,
  type SortingState,
  flexRender,
} from '@tanstack/react-table'
import { ArrowDown, ArrowUp, ArrowUpDown, Filter, MoreVertical } from 'lucide-react'
import type { ConstructionObject } from '@/entities/object'
import { StatusBadge, OBJECT_STATUS_CONFIG, OBJECT_STATUSES } from '@/entities/object'
import {
  Badge,
  Button,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  cn,
} from '@/shared'
import type { ObjectsFiltersState } from '../model/objectsStore'

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

type FiltersChange = (filters: Partial<ObjectsFiltersState>) => void

interface FilterHeaderProps {
  filters: ObjectsFiltersState
  onFiltersChange: FiltersChange
}

interface CatalogsProps extends FilterHeaderProps {
  objectTypes: { id: string; name: string }[]
  organizations: { id: string; name: string }[]
}

function ColumnFilterButton({ active, label, ...props }: { active: boolean; label: string } & React.ComponentPropsWithoutRef<'button'>) {
  return (
    <button
      type="button"
      className={cn(
        'inline-flex h-7 w-7 items-center justify-center rounded-md transition-colors',
        active ? 'text-primary-600 hover:bg-primary-50 hover:text-primary-700' : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'
      )}
      aria-label={`Фильтр: ${label}`}
      {...props}
    >
      <Filter className="h-3.5 w-3.5" />
    </button>
  )
}

// Кнопка-фильтр «Статус»: мульти-выбор чекбоксами
function StatusFilterDropdown({ filters, onFiltersChange }: FilterHeaderProps) {
  const active = filters.status.length > 0
  return (
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <ColumnFilterButton active={active} label="Статус" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-48">
          {OBJECT_STATUSES.map((status) => (
            <DropdownMenuCheckboxItem
              key={status}
              checked={filters.status.includes(status)}
              onCheckedChange={(checked) => {
                const next = checked
                  ? [...filters.status, status]
                  : filters.status.filter((s) => s !== status)
                onFiltersChange({ status: next })
              }}
              className="cursor-pointer"
            >
              <Badge variant={OBJECT_STATUS_CONFIG[status].badge}>{OBJECT_STATUS_CONFIG[status].text}</Badge>
            </DropdownMenuCheckboxItem>
          ))}
          {filters.status.length > 0 && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onFiltersChange({ status: [] })} className="cursor-pointer">
                Очистить статусы
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
  )
}

// Заголовок «Тип»: одиночный выбор из справочника типов
function TypeFilterHeader({ filters, onFiltersChange, objectTypes }: CatalogsProps) {
  const active = !!filters.objectTypeId
  return (
    <div className="flex items-center gap-1">
      <span>Тип</span>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <ColumnFilterButton active={active} label="Тип" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          <DropdownMenuRadioGroup
            value={filters.objectTypeId ?? 'all'}
            onValueChange={(value) => onFiltersChange({ objectTypeId: value === 'all' ? undefined : value })}
          >
            <DropdownMenuRadioItem value="all" className="cursor-pointer">
              Все типы
            </DropdownMenuRadioItem>
            {objectTypes.map((type) => (
              <DropdownMenuRadioItem key={type.id} value={type.id} className="cursor-pointer">
                {type.name}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

// Заголовок «Заказчик» / «Подрядчик»: одиночный выбор организации
function OrgFilterHeader({
  kind,
  filters,
  onFiltersChange,
  organizations,
}: {
  kind: 'customer' | 'contractor'
} & FilterHeaderProps & Pick<CatalogsProps, 'organizations'>) {
  const isCustomer = kind === 'customer'
  const value = isCustomer ? filters.customerOrganizationId : filters.contractorOrganizationId
  const active = !!value
  return (
    <div className="flex items-center gap-1">
      <span>{isCustomer ? 'Заказчик' : 'Подрядчик'}</span>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <ColumnFilterButton active={active} label={isCustomer ? 'Заказчик' : 'Подрядчик'} />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          <DropdownMenuRadioGroup
            value={value ?? 'all'}
            onValueChange={(selected) =>
              onFiltersChange(
                isCustomer
                  ? { customerOrganizationId: selected === 'all' ? undefined : selected }
                  : { contractorOrganizationId: selected === 'all' ? undefined : selected }
              )
            }
          >
            <DropdownMenuRadioItem value="all" className="cursor-pointer">
              {isCustomer ? 'Все заказчики' : 'Все подрядчики'}
            </DropdownMenuRadioItem>
            {organizations.map((org) => (
              <DropdownMenuRadioItem key={org.id} value={org.id} className="cursor-pointer">
                {org.name}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

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

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: (updater) => {
      const next = typeof updater === 'function' ? updater(sorting) : updater
      onSortingChange(next)
    },
    manualSorting: true,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.id,
  })

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const canSort = header.column.getCanSort()
                const sorted = header.column.getIsSorted()
                // Для колонки «Статус» фильтр и сортировка — отдельные элементы в ячейке заголовка
                const headerContent = header.isPlaceholder ? null : header.column.id === 'status' ? (
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      className={cn(
                        'flex items-center gap-1 hover:text-gray-900 transition-colors',
                        sorted && 'text-primary-600'
                      )}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      Статус
                      {sorted === 'asc' && <ArrowUp className="h-3.5 w-3.5" />}
                      {sorted === 'desc' && <ArrowDown className="h-3.5 w-3.5" />}
                      {!sorted && <ArrowUpDown className="h-3.5 w-3.5 opacity-40" />}
                    </button>
                    <StatusFilterDropdown
                      filters={filters}
                      onFiltersChange={onFiltersChange}
                    />
                  </div>
                ) : canSort ? (
                  <button
                    type="button"
                    className={cn(
                      'flex items-center gap-1 hover:text-gray-900 transition-colors',
                      sorted && 'text-primary-600'
                    )}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {sorted === 'asc' && <ArrowUp className="h-3.5 w-3.5" />}
                    {sorted === 'desc' && <ArrowDown className="h-3.5 w-3.5" />}
                    {!sorted && <ArrowUpDown className="h-3.5 w-3.5 opacity-40" />}
                  </button>
                ) : (
                  flexRender(header.column.columnDef.header, header.getContext())
                )
                return <TableHead key={header.id}>{headerContent}</TableHead>
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-32 text-center text-gray-500">
                Загрузка...
              </TableCell>
            </TableRow>
          ) : table.getRowModel().rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-32 text-center text-gray-500">
                Объектов не найдено
              </TableCell>
            </TableRow>
          ) : (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                className="cursor-pointer"
                onClick={() => onOpenObject(row.original)}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}

interface ColumnActions {
  onOpenObject: (object: ConstructionObject) => void
  onEditObject: (object: ConstructionObject) => void
  onArchiveObject: (object: ConstructionObject) => void
  filters: ObjectsFiltersState
  onFiltersChange: FiltersChange
  objectTypes: { id: string; name: string }[]
  organizations: { id: string; name: string }[]
}

function useObjectsColumns({
  onOpenObject,
  onEditObject,
  onArchiveObject,
  filters,
  onFiltersChange,
  objectTypes,
  organizations,
}: ColumnActions): ColumnDef<ConstructionObject>[] {
  return [
    {
      accessorKey: 'name',
      header: 'Название',
      cell: ({ row }) => (
        <div>
          <div className="font-medium text-gray-900">{row.original.name}</div>
          <div className="text-xs text-gray-500">{row.original.code}</div>
        </div>
      ),
    },
    {
      id: 'objectType',
      accessorFn: (row) => row.objectType?.name ?? '',
      header: () => (
        <TypeFilterHeader
          filters={filters}
          onFiltersChange={onFiltersChange}
          objectTypes={objectTypes}
          organizations={organizations}
        />
      ),
      cell: ({ row }) => <Badge variant="outline">{row.original.objectType?.name || '—'}</Badge>,
      enableSorting: false,
    },
    {
      accessorKey: 'address',
      header: 'Адрес',
      cell: ({ row }) => (
        <span className="text-gray-500 block max-w-[200px] truncate">{row.original.address}</span>
      ),
    },
    {
      id: 'customer',
      accessorFn: (row) => row.customerOrganization?.name ?? '',
      header: () => (
        <OrgFilterHeader
          kind="customer"
          filters={filters}
          onFiltersChange={onFiltersChange}
          organizations={organizations}
        />
      ),
      cell: ({ row }) => <span className="text-gray-500">{row.original.customerOrganization?.name || '—'}</span>,
      enableSorting: false,
    },
    {
      id: 'contractor',
      accessorFn: (row) => row.contractorOrganization?.name ?? '',
      header: () => (
        <OrgFilterHeader
          kind="contractor"
          filters={filters}
          onFiltersChange={onFiltersChange}
          organizations={organizations}
        />
      ),
      cell: ({ row }) => <span className="text-gray-500">{row.original.contractorOrganization?.name || '—'}</span>,
      enableSorting: false,
    },
    {
      accessorKey: 'status',
      header: 'Статус',
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      accessorKey: 'readiness',
      header: 'Готовность',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-primary-600 rounded-full" style={{ width: `${row.original.readiness || 0}%` }} />
          </div>
          <span className="text-sm text-gray-500">{row.original.readiness || 0}%</span>
        </div>
      ),
    },
    {
      accessorKey: 'lastCheckedAt',
      header: 'Проверено',
      cell: ({ row }) => (
        <span className="text-sm text-gray-500">
          {row.original.lastCheckedAt ? new Date(row.original.lastCheckedAt).toLocaleDateString('ru-RU') : '—'}
        </span>
      ),
    },
    {
      id: 'actions',
      header: 'Действия',
      enableSorting: false,
      cell: ({ row }) => (
        <div onClick={(e) => e.stopPropagation()}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onOpenObject(row.original)}>Открыть</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEditObject(row.original)}>Редактировать</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600 focus:text-red-600"
                onClick={() => onArchiveObject(row.original)}
              >
                Архивировать
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ]
}

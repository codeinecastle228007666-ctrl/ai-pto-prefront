import {
  useReactTable,
  getCoreRowModel,
  type ColumnDef,
  type SortingState,
  flexRender,
} from '@tanstack/react-table'
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronDown, MoreVertical } from 'lucide-react'
import type { ConstructionObject } from '@/entities/object'
import { StatusBadge } from '@/entities/object'
import { Badge, Button, DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, Table, TableHeader, TableBody, TableRow, TableHead, TableCell, cn } from '@/shared'

interface ObjectsTableProps {
  data: ConstructionObject[]
  sorting: SortingState
  onSortingChange: (sorting: SortingState) => void
  onOpenObject: (object: ConstructionObject) => void
  onEditObject: (object: ConstructionObject) => void
  onArchiveObject: (object: ConstructionObject) => void
  isLoading?: boolean
}

export function ObjectsTable({
  data,
  sorting,
  onSortingChange,
  onOpenObject,
  onEditObject,
  onArchiveObject,
  isLoading,
}: ObjectsTableProps) {
  const columns = useObjectsColumns({ onOpenObject, onEditObject, onArchiveObject })

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
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : canSort ? (
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
                    )}
                  </TableHead>
                )
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
}

function useObjectsColumns({ onOpenObject, onEditObject, onArchiveObject }: ColumnActions): ColumnDef<ConstructionObject>[] {
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
      header: 'Тип',
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
      header: 'Заказчик',
      cell: ({ row }) => <span className="text-gray-500">{row.original.customerOrganization?.name || '—'}</span>,
      enableSorting: false,
    },
    {
      id: 'contractor',
      accessorFn: (row) => row.contractorOrganization?.name ?? '',
      header: 'Подрядчик',
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

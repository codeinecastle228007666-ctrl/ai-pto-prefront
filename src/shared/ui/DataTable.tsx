import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type Row,
} from '@tanstack/react-table'
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/shared/ui/Table'
import { cn } from '@/shared/lib/utils'

interface DataTableProps<TData> {
  data: TData[]
  columns: ColumnDef<TData, any>[]
  /** Текущая серверная сортировка */
  sorting?: SortingState
  onSortingChange?: (sorting: SortingState) => void
  /** true — сортировкой управляет сервер (не сортируем на клиенте) */
  manualSorting?: boolean
  /** id колонок, у которых заголовок уже интерактивный (фильтр) — сортировка рендерится отдельной стрелкой рядом */
  headerOwnsInteractionColumnIds?: string[]
  getRowId?: (row: TData, index: number) => string
  onRowClick?: (row: TData) => void
  isLoading?: boolean
  isEmpty?: boolean
  loadingText?: string
  emptyText?: string
  className?: string
}

/**
 * Переиспользуемая таблица: данные и колонки прокидываются через пропсы,
 * логика колонок живёт снаружи (columnHelper в хуке useColumns).
 * Заголовки сортируемых столбцов — кнопки с индикатором направления.
 */
export function DataTable<TData>({
  data,
  columns,
  sorting,
  onSortingChange,
  manualSorting = true,
  headerOwnsInteractionColumnIds = [],
  getRowId,
  onRowClick,
  isLoading,
  isEmpty,
  loadingText = 'Загрузка...',
  emptyText = 'Ничего не найдено',
  className,
}: DataTableProps<TData>) {
  const table = useReactTable({
    data,
    columns,
    state: { sorting: sorting ?? [] },
    onSortingChange: (updater) => {
      if (!onSortingChange) return
      const next = typeof updater === 'function' ? updater(sorting ?? []) : updater
      onSortingChange(next)
    },
    manualSorting,
    getCoreRowModel: getCoreRowModel(),
    getRowId,
  })

  const rowCount = table.getRowModel().rows.length

  return (
    <div className={cn('overflow-x-auto', className)}>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const canSort = header.column.getCanSort() && !!onSortingChange
                const sorted = header.column.getIsSorted()
                // Колонки с собственным интерактивным заголовком (поповер-фильтр):
                // заголовок не оборачиваем в кнопку сортировки, стрелку сортировки рисуем отдельной кнопкой рядом
                const headerOwnsInteraction = headerOwnsInteractionColumnIds.includes(header.column.id)
                const sortArrow =
                  sorted === 'asc' ? <ArrowUp className="h-3.5 w-3.5" /> :
                  sorted === 'desc' ? <ArrowDown className="h-3.5 w-3.5" /> : null
                const idleArrow = <ArrowUpDown className="h-3.5 w-3.5 opacity-40" />

                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : headerOwnsInteraction ? (
                      <div className="flex items-center gap-1">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {canSort && (
                          <button
                            type="button"
                            className={cn(
                              'inline-flex h-6 w-6 items-center justify-center rounded transition-colors hover:bg-gray-100',
                              sorted ? 'text-primary-600' : 'text-gray-400 hover:text-gray-600'
                            )}
                            onClick={header.column.getToggleSortingHandler()}
                            aria-label={`Сортировка`}
                          >
                            {sortArrow ?? idleArrow}
                          </button>
                        )}
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
                        {sortArrow ?? idleArrow}
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
                {loadingText}
              </TableCell>
            </TableRow>
          ) : isEmpty || rowCount === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-32 text-center text-gray-500">
                {emptyText}
              </TableCell>
            </TableRow>
          ) : (
            table.getRowModel().rows.map((row: Row<TData>) => (
              <TableRow
                key={row.id}
                className={cn(onRowClick && 'cursor-pointer')}
                onClick={() => onRowClick?.(row.original)}
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

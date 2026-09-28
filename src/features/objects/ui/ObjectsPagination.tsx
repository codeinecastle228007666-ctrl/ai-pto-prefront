import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/shared'

interface ObjectsPaginationProps {
  page: number
  totalPages: number
  total: number
  onChange: (page: number) => void
}

export function ObjectsPagination({ page, totalPages, total, onChange }: ObjectsPaginationProps) {
  if (totalPages <= 1) return null

  return (
    <div className="px-4 py-3 border-t border-gray-200 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-gray-500 text-center sm:text-left">
        Страница {page} из {totalPages} — всего {total}
      </p>
      <div className="flex justify-center gap-2 sm:justify-end">
        <Button variant="outline" size="sm" disabled={page === 1} onClick={() => onChange(page - 1)}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => onChange(page + 1)}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

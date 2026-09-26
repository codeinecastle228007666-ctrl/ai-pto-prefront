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
    <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
      <p className="text-sm text-gray-500">
        Страница {page} из {totalPages} — всего {total}
      </p>
      <div className="flex gap-2">
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

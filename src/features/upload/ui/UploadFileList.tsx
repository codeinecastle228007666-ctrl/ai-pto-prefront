import { AlertCircle, CheckCircle2, Copy, FileText, Loader2, X } from 'lucide-react'
import { Button, Progress } from '@/shared'
import type { UploadItem } from '../model/useUploadQueue'

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} Б`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} КБ`
  return `${(bytes / 1024 / 1024).toFixed(1)} МБ`
}

interface UploadFileListProps {
  items: UploadItem[]
  onRemove?: (id: string) => void
}

export function UploadFileList({ items, onRemove }: UploadFileListProps) {
  return (
    <ul className="divide-y divide-gray-200 rounded-lg border border-gray-200 bg-white">
      {items.map((item) => (
        <li key={item.id} className="flex items-center gap-3 px-4 py-3">
          <FileText className="h-5 w-5 shrink-0 text-gray-400" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-gray-900">{item.file.name}</p>
            <p className="text-xs text-gray-500">
              {formatSize(item.file.size)}
              {item.status === 'duplicate' && ' · уже загружен ранее'}
              {item.status === 'error' && <span className="text-red-600"> · {item.error}</span>}
            </p>
            {item.status === 'uploading' && <Progress value={item.progress} className="mt-2 h-1.5" />}
          </div>
          {item.status === 'uploading' && <Loader2 className="h-4 w-4 animate-spin text-primary-600" />}
          {item.status === 'uploaded' && <CheckCircle2 className="h-4 w-4 text-green-600" />}
          {item.status === 'duplicate' && <Copy className="h-4 w-4 text-gray-400" />}
          {item.status === 'error' && <AlertCircle className="h-4 w-4 text-red-600" />}
          {item.status === 'queued' && onRemove && (
            <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Убрать файл" onClick={() => onRemove(item.id)}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </li>
      ))}
    </ul>
  )
}

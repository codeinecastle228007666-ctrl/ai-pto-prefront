import { lazy, Suspense } from 'react'
import { Download, FileQuestion, Loader2 } from 'lucide-react'
import { Alert, AlertDescription, Button } from '@/shared'
import { DocumentStatusBadge, type PackageDocument } from '@/entities/package'
import { useDocumentFile } from '../api/documentsApi'
import type { PdfHighlight } from './PdfViewer'

// pdf.js тяжёлый — грузим только при открытии PDF
const PdfViewer = lazy(() => import('./PdfViewer').then((m) => ({ default: m.PdfViewer })))

const Spinner = () => (
  <div className="flex h-full items-center justify-center">
    <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
  </div>
)

interface DocumentPreviewProps {
  document: PackageDocument
  page?: number
  highlights?: PdfHighlight[]
  activeHighlightId?: string
}

export function DocumentPreview({ document, page, highlights, activeHighlightId }: DocumentPreviewProps) {
  const { data: file, isLoading, error } = useDocumentFile(document.id)
  const isPdf = document.mimeType === 'application/pdf'

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex items-center gap-3 border-b border-gray-200 px-4 py-2">
        <h2 className="min-w-0 flex-1 truncate text-sm font-medium text-gray-900">{document.fileName}</h2>
        <DocumentStatusBadge status={document.status} />
        {file && (
          <Button asChild variant="outline" size="sm">
            <a href={file.url} download={document.fileName}>
              <Download className="h-4 w-4 mr-2" />
              Скачать
            </a>
          </Button>
        )}
      </div>

      <div className="min-h-0 flex-1 overflow-hidden bg-gray-100">
        {isLoading && <Spinner />}
        {error && (
          <div className="p-4">
            <Alert variant="destructive">
              <AlertDescription>Не удалось получить ссылку на файл.</AlertDescription>
            </Alert>
          </div>
        )}
        {file && isPdf && (
          <Suspense fallback={<Spinner />}>
            <PdfViewer fileUrl={file.url} page={page} highlights={highlights} activeHighlightId={activeHighlightId} />
          </Suspense>
        )}
        {file && !isPdf && (
          <div className="flex h-full flex-col items-center justify-center gap-2 p-6 text-center text-gray-500">
            <FileQuestion className="h-10 w-10" />
            <p className="text-sm">Предпросмотр доступен только для PDF. Скачайте файл, чтобы открыть его.</p>
          </div>
        )}
      </div>
    </div>
  )
}

import { Viewer, Worker } from '@react-pdf-viewer/core'
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.js?url'
import '@react-pdf-viewer/core/lib/styles/index.css'

interface PdfViewerProps {
  fileUrl: string
  /** Номер страницы с 1 (для перехода из замечаний, этап 3) */
  page?: number
}

export function PdfViewer({ fileUrl, page }: PdfViewerProps) {
  return (
    <Worker workerUrl={workerUrl}>
      <Viewer key={fileUrl} fileUrl={fileUrl} initialPage={page ? page - 1 : 0} />
    </Worker>
  )
}

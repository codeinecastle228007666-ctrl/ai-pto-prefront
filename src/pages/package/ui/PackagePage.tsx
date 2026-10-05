import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { ArrowLeft, Loader2, MousePointerClick, Upload } from 'lucide-react'
import { usePackage } from '@/features/upload'
import { DocumentPreview, DocumentTree, type PdfHighlight } from '@/features/review'
import { FindingsPanel, SEVERITY_STYLES, useFindings } from '@/features/findings'
import type { Finding } from '@/entities/finding'
import { Alert, AlertDescription, Button, Card, Progress } from '@/shared'

/** Рабочая область пакета: дерево документов, просмотр оригинала и панель замечаний с подсветкой на странице. */
export function PackagePage() {
  const { id = '', packageId = '' } = useParams<{ id: string; packageId: string }>()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { data: pkg, isLoading, error } = usePackage(packageId)
  const ready = pkg?.status === 'done' || pkg?.status === 'partial'
  const { data: findingsPage } = useFindings(id, packageId, ready)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    )
  }

  if (error || !pkg) {
    return (
      <Alert variant="destructive">
        <AlertDescription>Пакет не найден или недоступен.</AlertDescription>
      </Alert>
    )
  }

  const selected = pkg.documents.find((d) => d.id === searchParams.get('doc'))
  const selectedFinding = findingsPage?.items.find((f) => f.id === searchParams.get('finding'))
  const sourceOnPage = selectedFinding?.sources.find((s) => s.documentId === selected?.id && s.page)

  // Подсвечиваем открытые замечания текущего документа (и выбранное, даже если уже решено)
  const highlights: PdfHighlight[] = (findingsPage?.items ?? [])
    .filter((f) => f.documentId === selected?.id && (f.status === 'open' || f.id === selectedFinding?.id))
    .flatMap((f) =>
      f.sources
        .filter((s) => s.documentId === f.documentId && s.page && s.bbox)
        .map((s, i) => ({
          id: i === 0 ? f.id : `${f.id}:${i}`,
          page: s.page!,
          bbox: s.bbox!,
          color: SEVERITY_STYLES[f.severity].highlight,
        }))
    )

  const handleSelectFinding = (f: Finding) => {
    if (f.id === selectedFinding?.id) setSearchParams({ doc: f.documentId }, { replace: true })
    else setSearchParams({ doc: f.documentId, finding: f.id }, { replace: true })
  }
  const progress = pkg.progress !== undefined ? Math.round(pkg.progress * 100) : undefined
  const processing = ['queued', 'processing'].includes(pkg.status)

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="outline" size="sm" onClick={() => navigate(`/objects/${id}`)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          К объекту
        </Button>
        {processing && progress !== undefined && (
          <div className="flex min-w-48 flex-1 items-center gap-3 sm:max-w-sm">
            <Progress value={progress} />
            <span className="text-sm text-gray-500 tabular-nums">{progress}%</span>
          </div>
        )}
        <Button asChild size="sm" className="ml-auto">
          <Link to={`/objects/${id}/upload`}>
            <Upload className="h-4 w-4 mr-2" />
            Загрузить ещё
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-[16rem_minmax(0,1fr)] xl:grid-cols-[16rem_minmax(0,1fr)_22rem]">
        <Card className="max-h-64 overflow-y-auto p-2 lg:max-h-[calc(100vh-13rem)]">
          <DocumentTree
            pkg={pkg}
            selectedId={selected?.id}
            onSelect={(docId) => setSearchParams({ doc: docId }, { replace: true })}
          />
        </Card>

        <Card className="h-[70vh] overflow-hidden lg:h-[calc(100vh-13rem)]">
          {selected ? (
            <DocumentPreview
              document={selected}
              page={sourceOnPage?.page}
              highlights={highlights}
              activeHighlightId={selectedFinding?.id}
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-2 p-6 text-center text-gray-500">
              <MousePointerClick className="h-8 w-8" />
              <p className="text-sm">Выберите документ в дереве слева</p>
            </div>
          )}
        </Card>

        <Card className="h-[60vh] overflow-hidden lg:col-span-2 xl:col-span-1 xl:h-[calc(100vh-13rem)]">
          <FindingsPanel
            objectId={id}
            packageId={packageId}
            documents={pkg.documents}
            ready={!!ready}
            selectedDocumentId={selected?.id}
            selectedFindingId={selectedFinding?.id}
            onSelectFinding={handleSelectFinding}
          />
        </Card>
      </div>
    </div>
  )
}

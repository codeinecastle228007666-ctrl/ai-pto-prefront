import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { ArrowLeft, Loader2, MousePointerClick, Upload } from 'lucide-react'
import { usePackage } from '@/features/upload'
import { DocumentPreview, DocumentTree } from '@/features/review'
import { Alert, AlertDescription, Button, Card, Progress } from '@/shared'

/** Рабочая область пакета: слева дерево документов, справа просмотр. Панель замечаний — этап 3. */
export function PackagePage() {
  const { id = '', packageId = '' } = useParams<{ id: string; packageId: string }>()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { data: pkg, isLoading, error } = usePackage(packageId)

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

      <div className="grid gap-4 lg:grid-cols-[18rem_minmax(0,1fr)]">
        <Card className="max-h-64 overflow-y-auto p-2 lg:max-h-[calc(100vh-13rem)]">
          <DocumentTree
            pkg={pkg}
            selectedId={selected?.id}
            onSelect={(docId) => setSearchParams({ doc: docId }, { replace: true })}
          />
        </Card>

        <Card className="h-[70vh] overflow-hidden lg:h-[calc(100vh-13rem)]">
          {selected ? (
            <DocumentPreview document={selected} />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-2 p-6 text-center text-gray-500">
              <MousePointerClick className="h-8 w-8" />
              <p className="text-sm">Выберите документ в дереве слева</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}

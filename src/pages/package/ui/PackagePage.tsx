import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, FileText, Loader2 } from 'lucide-react'
import { usePackage } from '@/features/upload'
import { DocumentStatusBadge, DOCUMENT_TYPE_LABELS, PackageStatusBadge } from '@/entities/package'
import { Alert, AlertDescription, Button, Card, CardContent, CardHeader, Progress } from '@/shared'

/** Этап 1: статус обработки пакета. Дерево документов, просмотрщик и замечания добавим следующими этапами. */
export function PackagePage() {
  const { id = '', packageId = '' } = useParams<{ id: string; packageId: string }>()
  const navigate = useNavigate()
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

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Button variant="outline" size="sm" onClick={() => navigate(`/objects/${id}`)}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        К объекту
      </Button>

      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">Пакет v{pkg.version}</h1>
            <PackageStatusBadge status={pkg.status} />
          </div>
          {pkg.progress !== undefined && (
            <div className="mt-3 flex items-center gap-3">
              <Progress value={Math.round(pkg.progress * 100)} />
              <span className="text-sm text-gray-500 tabular-nums">{Math.round(pkg.progress * 100)}%</span>
            </div>
          )}
        </CardHeader>
        <CardContent>
          <ul className="divide-y divide-gray-200">
            {pkg.documents.map((doc) => (
              <li key={doc.id} className="flex items-center gap-3 py-3">
                <FileText className="h-5 w-5 shrink-0 text-gray-400" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-900">{doc.fileName}</p>
                  <p className="text-xs text-gray-500">{DOCUMENT_TYPE_LABELS[doc.type]}</p>
                </div>
                <DocumentStatusBadge status={doc.status} />
              </li>
            ))}
          </ul>
          <Button asChild variant="outline" size="sm" className="mt-4">
            <Link to={`/objects/${id}/upload`}>Загрузить ещё</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

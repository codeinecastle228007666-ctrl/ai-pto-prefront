import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Loader2, Upload } from 'lucide-react'
import { useObject } from '@/features/objects'
import { UploadDropzone, UploadFileList, useUploadQueue } from '@/features/upload'
import { Alert, AlertDescription, Button, Card, CardContent, CardHeader } from '@/shared'

const PHASE_LABEL = {
  idle: '',
  preparing: 'Подготовка пакета…',
  uploading: 'Загрузка файлов…',
  starting: 'Запуск обработки…',
} as const

export function UploadPage() {
  const { id = '' } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: object, isLoading } = useObject(id)
  const { items, phase, error, rejected, hasPackage, addFiles, removeItem, submit } = useUploadQueue(id)

  const busy = phase !== 'idle'
  const canSubmit = items.length > 0 && !busy

  const handleSubmit = async () => {
    const packageId = await submit()
    if (packageId) navigate(`/objects/${id}/packages/${packageId}`)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    )
  }

  if (!object || object.status === 'archived') {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Загрузка недоступна</h2>
        <p className="text-gray-500 mb-4">Объект не найден или находится в архиве</p>
        <Button onClick={() => navigate('/objects')}>К списку объектов</Button>
      </div>
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
          <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">Загрузка документов</h1>
          <p className="text-sm text-gray-500">
            {object.code} · {object.name}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {!hasPackage && <UploadDropzone onFiles={addFiles} disabled={busy} />}

          {rejected.length > 0 && (
            <Alert variant="destructive">
              <AlertDescription>
                <ul className="list-disc pl-4">
                  {rejected.map((r) => (
                    <li key={r}>{r}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {items.length > 0 && <UploadFileList items={items} onRemove={busy ? undefined : removeItem} />}

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-gray-500">{busy ? PHASE_LABEL[phase] : `Файлов: ${items.length}`}</p>
            <Button onClick={handleSubmit} disabled={!canSubmit} loading={busy}>
              <Upload className="h-4 w-4 mr-2" />
              {hasPackage ? 'Повторить и запустить' : 'Загрузить и проверить'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

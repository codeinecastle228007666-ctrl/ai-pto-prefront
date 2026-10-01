import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import type { AxiosError } from 'axios'
import { ArrowLeft, Edit, Archive, Loader2 } from 'lucide-react'
import {
  useObject,
  useArchiveObject,
  useChangeObjectStatus,
  STATUS_TRANSITIONS,
  type ObjectStatusTransition,
} from '@/features/objects'
import { useIsOwner } from '@/features/auth'
import { StatusBadge } from '@/entities/object'
import { Alert, AlertDescription, Badge, Button, Card, CardContent, CardHeader, ConfirmDialog } from '@/shared'
import { ObjectInfoGrid } from './ObjectInfoGrid'
import { ObjectStatsCard } from './ObjectStatsCard'

export function ObjectDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isOwner = useIsOwner()
  const archiveMutation = useArchiveObject()
  const statusMutation = useChangeObjectStatus()
  const [showArchiveDialog, setShowArchiveDialog] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)

  const { data: object, isLoading, error } = useObject(id || '', !!id)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    )
  }

  if (error || !object) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Объект не найден</h2>
        <p className="text-gray-500 mb-4">Объект не существует или недоступен</p>
        <Button onClick={() => navigate('/objects')}>Вернуться к списку</Button>
      </div>
    )
  }

  const isArchived = object.status === 'archived'
  const transitions = STATUS_TRANSITIONS[object.status] ?? []

  const handleStatus = async (to: ObjectStatusTransition) => {
    setActionError(null)
    try {
      await statusMutation.mutateAsync({ id: object.id, status: to })
    } catch (err) {
      const status = (err as AxiosError).response?.status
      setActionError(status === 409 ? 'Такой переход статуса недоступен.' : 'Не удалось сменить статус.')
    }
  }

  const handleArchive = async () => {
    setActionError(null)
    try {
      await archiveMutation.mutateAsync(object.id)
    } catch {
      setActionError('Не удалось архивировать объект.')
    } finally {
      setShowArchiveDialog(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <Button variant="outline" size="sm" className="w-full sm:w-auto" onClick={() => navigate('/objects')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Назад
        </Button>
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
          {transitions.map((t) => (
            <Button
              key={t.to}
              variant="outline"
              size="sm"
              className="w-full sm:w-auto"
              onClick={() => handleStatus(t.to)}
              disabled={statusMutation.isPending}
            >
              {t.label}
            </Button>
          ))}
          {isOwner && !isArchived && (
            <Button
              variant="outline"
              size="sm"
              className="w-full sm:w-auto text-red-600 hover:text-red-700"
              onClick={() => setShowArchiveDialog(true)}
            >
              <Archive className="h-4 w-4 mr-2" />
              Архивировать
            </Button>
          )}
          {!isArchived && (
            <Button size="sm" className="w-full sm:w-auto" onClick={() => navigate(`/objects/${object.id}/edit`)}>
              <Edit className="h-4 w-4 mr-2" />
              Изменить
            </Button>
          )}
        </div>
      </div>

      {actionError && (
        <Alert variant="destructive">
          <AlertDescription>{actionError}</AlertDescription>
        </Alert>
      )}

      {isArchived && (
        <Alert>
          <AlertDescription>Объект в архиве и доступен только для просмотра.</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <h1 className="text-xl font-bold text-gray-900 sm:text-2xl break-words">{object.name}</h1>
          <div className="flex flex-wrap items-center gap-2 mt-2 sm:gap-3">
            <Badge variant="outline">{object.code}</Badge>
            <StatusBadge status={object.status} />
          </div>
        </CardHeader>
        <CardContent>
          <ObjectInfoGrid object={object} />
        </CardContent>
      </Card>

      <ObjectStatsCard object={object} />

      <ConfirmDialog
        isOpen={showArchiveDialog}
        onClose={() => setShowArchiveDialog(false)}
        onConfirm={handleArchive}
        title="Архивировать объект?"
        description="Объект станет доступен только для просмотра. Это действие нельзя отменить."
        confirmText="Архивировать"
        variant="destructive"
        isLoading={archiveMutation.isPending}
      />
    </div>
  )
}

import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Edit, Archive, Loader2 } from 'lucide-react'
import { useObject, useArchiveObject } from '@/features/objects'
import { StatusBadge } from '@/entities/object'
import { Badge, Button, Card, CardContent, CardHeader, Tabs, TabsList, TabsTrigger, TabsContent, ConfirmDialog } from '@/shared'
import { ObjectInfoGrid } from './ObjectInfoGrid'
import { ObjectStatsCard } from './ObjectStatsCard'
import { formatObjectDate } from '../model/formatObjectDate'

export function ObjectDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const archiveMutation = useArchiveObject()
  const [showArchiveDialog, setShowArchiveDialog] = useState(false)

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
        <p className="text-gray-500 mb-4">Объект не существует или был удалён</p>
        <Button onClick={() => navigate('/objects')}>Вернуться к списку</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Button variant="outline" size="sm" onClick={() => navigate('/objects')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Назад
        </Button>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowArchiveDialog(true)}
            disabled={object.status === 'archived'}
          >
            <Archive className="h-4 w-4 mr-2" />
            Архивировать
          </Button>
          <Button size="sm" onClick={() => navigate(`/objects/${id}/edit`)}>
            <Edit className="h-4 w-4 mr-2" />
            Редактировать
          </Button>
        </div>
      </div>

      {/* Main Info */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{object.name}</h1>
              <div className="flex items-center gap-3 mt-2">
                <Badge variant="outline">{object.code}</Badge>
                <StatusBadge status={object.status} />
              </div>
            </div>
            {object.readiness !== undefined && (
              <div className="text-right">
                <p className="text-3xl font-bold text-primary-600">{object.readiness}%</p>
                <p className="text-sm text-gray-500">Готовность</p>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <ObjectInfoGrid object={object} />
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="overview">Обзор</TabsTrigger>
          <TabsTrigger value="documents" disabled>Документы</TabsTrigger>
          <TabsTrigger value="packages" disabled>Пакеты</TabsTrigger>
          <TabsTrigger value="findings" disabled>Замечания</TabsTrigger>
          <TabsTrigger value="checklist" disabled>Комплектность</TabsTrigger>
          <TabsTrigger value="reports" disabled>Отчёты</TabsTrigger>
          <TabsTrigger value="history" disabled>История</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6 space-y-6">
          <ObjectStatsCard object={object} />
        </TabsContent>

        <TabsContent value="documents" className="mt-6">
          <div className="text-center py-12 text-gray-500">Раздел в разработке</div>
        </TabsContent>
      </Tabs>

      {/* Archive Confirm Dialog */}
      <ConfirmDialog
        isOpen={showArchiveDialog}
        onClose={() => setShowArchiveDialog(false)}
        onConfirm={() => {
          if (id) archiveMutation.mutate(id)
          setShowArchiveDialog(false)
        }}
        title="Архивировать объект?"
        description="Объект будет перемещён в архив. Документы и отчёты сохранятся."
        confirmText="Архивировать"
        variant="destructive"
        isLoading={archiveMutation.isPending}
      />
    </div>
  )
}

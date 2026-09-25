'use client'

import { useParams } from 'react-router-dom'
import { ArrowLeft, Edit, Archive, Building2, MapPin, User, Calendar, Loader2 } from 'lucide-react'
import { Button } from '@/shared/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/Card'
import { Badge } from '@/shared/ui/Badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/Tabs'
import { Separator } from '@/shared/ui/Separator'
import { useObject } from '@/features/objects/api/objectsQueries'
import { useNavigate } from 'react-router-dom'
import { cn } from '@/shared/lib/utils'
import { useArchiveObject } from '@/features/objects/api/objectsQueries'
import { useState } from 'react'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/shared/ui/AlertDialog'
import type { ConstructionObject, ObjectStatus } from '@/entities/object/types'

const statusColors: Record<ObjectStatus, { badge: string; text: string }> = {
  draft: { badge: 'secondary', text: 'Черновик' },
  active: { badge: 'success', text: 'Активен' },
  on_hold: { badge: 'warning', text: 'На паузе' },
  completed: { badge: 'info', text: 'Завершён' },
  archived: { badge: 'default', text: 'В архиве' },
}

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

  const getStatusBadge = (status: ObjectStatus) => {
    const config = statusColors[status]
    return <Badge variant={config.badge as any}>{config.text}</Badge>
  }

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '—'
    return new Date(dateStr).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Button variant="outline" size="sm" onClick={() => navigate('/objects')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Назад
        </Button>
        <div className="flex items-center gap-4">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm" onClick={() => setShowArchiveDialog(true)}>
                <Archive className="h-4 w-4 mr-2" />
                Архивировать
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Архивировать объект?</AlertDialogTitle>
                <AlertDialogDescription>
                  Объект будет перемещён в архив. Документы и отчёты сохранятся. Это действие нельзя отменить.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Отмена</AlertDialogCancel>
                <AlertDialogAction onClick={() => { archiveMutation.mutate(id!); setShowArchiveDialog(false); }}>Архивировать</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Button variant="outline" size="sm" onClick={() => navigate(`/objects/${id}/edit`)}>
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
                {getStatusBadge(object.status)}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <InfoCard label="Тип объекта" value={object.objectType?.name || '—'} Icon={Building2} />
            <InfoCard label="Адрес" value={object.address} Icon={MapPin} />
            <InfoCard label="Заказчик" value={object.customerOrganization?.name || '—'} Icon={User} />
            <InfoCard label="Подрядчик" value={object.contractorOrganization?.name || '—'} Icon={User} />
            <InfoCard label="Дата начала" value={formatDate(object.startDate)} Icon={Calendar} />
            <InfoCard label="Плановый конец" value={formatDate(object.plannedEndDate)} Icon={Calendar} />
            <InfoCard label="Факт. конец" value={formatDate(object.actualEndDate)} Icon={Calendar} />
            <InfoCard label="Создан" value={formatDate(object.createdAt)} Icon={Calendar} />
          </div>

          {object.description && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Описание</h3>
              <p className="text-gray-900">{object.description}</p>
            </div>
          )}

          {object.workTypes && object.workTypes.length > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Виды работ</h3>
              <div className="flex flex-wrap gap-2">
                {object.workTypes.map((wt) => (
                  <Badge key={wt.id} variant="outline">{wt.name}</Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tabs - Overview only for MVP */}
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

        <TabsContent value="overview" className="mt-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Статистика объекта</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <StatItem label="Пакетов загрузок" value={object._count?.packages || 0} />
                  <StatItem label="Замечаний" value={object._count?.findings || 0} />
                  <StatItem label="Последняя проверка" value={object.lastCheckedAt ? formatDate(object.lastCheckedAt) : '—'} />
                  <StatItem label="Готовность" value={`${object.readiness || 0}%`} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Быстрые действия</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Button variant="outline" asChild className="h-auto py-4">
                    <a href={`/objects/${id}/documents`}>Загрузить документы</a>
                  </Button>
                  <Button variant="outline" asChild className="h-auto py-4">
                    <a href={`/objects/${id}/packages`}>Создать пакет проверки</a>
                  </Button>
                  <Button variant="outline" asChild className="h-auto py-4">
                    <a href={`/objects/${id}/findings`}>Посмотреть замечания</a>
                  </Button>
                  <Button variant="outline" asChild className="h-auto py-4">
                    <a href={`/objects/${id}/reports`}>Сформировать отчёт</a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="documents" className="mt-6">
          <div className="text-center py-12 text-gray-500">
            <p>Раздел в разработке</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function InfoCard({ label, value, Icon }: { label: string; value: string; Icon: React.ElementType }) {
  return (
    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
      <div className="p-2 bg-white rounded border border-gray-200">
        <Icon className="h-5 w-5 text-gray-500" />
      </div>
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="font-medium text-gray-900">{value}</p>
      </div>
    </div>
  )
}

function StatItem({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="text-center p-4 bg-gray-50 rounded-lg">
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-xs text-gray-500 mt-1">{label}</p>
    </div>
  )
}
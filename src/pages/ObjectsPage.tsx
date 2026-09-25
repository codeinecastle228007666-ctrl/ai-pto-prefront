'use client'

import { useState } from 'react'
import { Plus, Search, Filter, ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import { Card, CardContent, CardHeader } from '@/shared/ui/Card'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/shared/ui/Table'
import { Badge } from '@/shared/ui/Badge'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/shared/ui/DropdownMenu'
import { useObjects, useObjectTypes, useWorkTypes, useOrganizations } from '@/features/objects/api/objectsQueries'
import { useCreateObject, useUpdateObject, useArchiveObject } from '@/features/objects/api/objectsQueries'
import { useObjectsStore } from '@/features/objects/model/objectsStore'
import { ObjectForm } from '@/features/objects/ui/ObjectForm'
import { objectSchema, type ObjectFormData } from '@/features/objects/model/objectSchema'
import type { ConstructionObject, ObjectStatus } from '@/entities/object/types'

const statusColors: Record<ObjectStatus, { badge: string; text: string }> = {
  draft: { badge: 'secondary', text: 'Черновик' },
  active: { badge: 'success', text: 'Активен' },
  on_hold: { badge: 'warning', text: 'На паузе' },
  completed: { badge: 'info', text: 'Завершён' },
  archived: { badge: 'default', text: 'В архиве' },
}

export function ObjectsPage() {
  const { filters, setFilters, resetFilters, setSelectedObject } = useObjectsStore()
  const { data: objectsData, isLoading, refetch } = useObjects(filters)
  const { data: objectTypes } = useObjectTypes()
  const { data: workTypes } = useWorkTypes()
  const { data: organizations } = useOrganizations()

  const createMutation = useCreateObject()
  const updateMutation = useUpdateObject()
  const archiveMutation = useArchiveObject()

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingObject, setEditingObject] = useState<ConstructionObject | null>(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)

  const handleOpenCreate = () => {
    setEditingObject(null)
    setIsFormOpen(true)
  }

  const handleEdit = (object: ConstructionObject) => {
    setEditingObject(object)
    setIsFormOpen(true)
  }

  const handleSubmit = async (data: ObjectFormData) => {
    try {
      if (editingObject) {
        await updateMutation.mutateAsync({ id: editingObject.id, data })
      } else {
        await createMutation.mutateAsync(data)
      }
      setIsFormOpen(false)
      setEditingObject(null)
      refetch()
    } catch (error) {
      // Ошибка обрабатывается в форме
    }
  }

  const handleArchive = async (id: string) => {
    try {
      await archiveMutation.mutateAsync(id)
      setDeleteConfirmId(null)
      refetch()
    } catch (error) {
      console.error('Archive error:', error)
    }
  }

  const getStatusBadge = (status: ObjectStatus) => {
    const config = statusColors[status]
    return <Badge variant={config.badge as 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' | 'info'}>{config.text}</Badge>
  }

  const statusOptions = [
    { value: 'draft', label: 'Черновик' },
    { value: 'active', label: 'Активен' },
    { value: 'on_hold', label: 'На паузе' },
    { value: 'completed', label: 'Завершён' },
  ] as const

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Строительные объекты</h1>
          <p className="text-gray-500 mt-1">Управление объектами и пакетами проверки</p>
        </div>
        <Button onClick={handleOpenCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Создать объект
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Поиск по названию, коду, адресу..."
                value={filters.search}
                onChange={(e) => setFilters({ search: e.target.value })}
                className="pl-10"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Статус
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {statusOptions.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => {
                      const newStatus = filters.status.filter(s => s !== option.value)
                      if (!filters.status.includes(option.value as ObjectStatus)) {
                        newStatus.push(option.value as ObjectStatus)
                      }
                      setFilters({ status: newStatus })
                    }}
                  >
                    <Badge variant={statusColors[option.value as ObjectStatus].badge as 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' | 'info'} className="mr-2 flex-shrink-0">
                      {statusColors[option.value as ObjectStatus].text}
                    </Badge>
                    {option.label}
                    {filters.status.includes(option.value as ObjectStatus) && (
                      <span className="ml-auto text-primary-600">✓</span>
                    )}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => resetFilters()} className="text-red-600 focus:text-red-600">
                  Сбросить фильтры
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto" />
              <p className="mt-4 text-gray-500">Загрузка...</p>
            </div>
          ) : objectsData?.data.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-500 mb-4">Объектов не найдено</p>
              <Button variant="outline" onClick={handleOpenCreate}>
                Создать первый объект
              </Button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-8"><input type="checkbox" className="h-4 w-4 rounded border-gray-300" /></TableHead>
                      <TableHead>Название</TableHead>
                      <TableHead>Тип</TableHead>
                      <TableHead>Адрес</TableHead>
                      <TableHead>Заказчик</TableHead>
                      <TableHead>Подрядчик</TableHead>
                      <TableHead className="w-36">Статус</TableHead>
                      <TableHead className="w-40">Готовность</TableHead>
                      <TableHead className="w-40">Проверено</TableHead>
                      <TableHead className="w-40">Действия</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {objectsData?.data.map((object) => (
                      <TableRow key={object.id} onClick={() => setSelectedObject(object.id)}>
                        <TableCell><input type="checkbox" className="h-4 w-4 rounded border-gray-300" /></TableCell>
                        <TableCell className="font-medium text-gray-900">{object.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{object.objectType?.name || object.objectTypeId}</Badge>
                        </TableCell>
                        <TableCell className="text-gray-500 max-w-[200px] truncate">{object.address}</TableCell>
                        <TableCell className="text-gray-500">{object.customerOrganization?.name || '—'}</TableCell>
                        <TableCell className="text-gray-500">{object.contractorOrganization?.name || '—'}</TableCell>
                        <TableCell>{getStatusBadge(object.status)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div className="h-full bg-primary-600 rounded-full" style={{ width: `${object.readiness || 0}%` }} />
                            </div>
                            <span className="text-sm text-gray-500">{object.readiness || 0}%</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-gray-500">
                          {object.lastCheckedAt ? new Date(object.lastCheckedAt).toLocaleDateString('ru-RU') : '—'}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <ChevronDown className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEdit(object)}>Редактировать</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => window.location.href = `/objects/${object.id}`}>Открыть</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600 focus:text-red-600" onClick={() => setDeleteConfirmId(object.id)}>
                                Архивировать
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {objectsData && objectsData.totalPages > 1 && (
                <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
                  <p className="text-sm text-gray-500">
                    Страница {objectsData.page} из {objectsData.totalPages} — всего {objectsData.total}
                  </p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" disabled={objectsData.page === 1} onClick={() => setFilters({ page: objectsData.page - 1 })}>
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" disabled={objectsData.page === objectsData.totalPages} onClick={() => setFilters({ page: objectsData.page + 1 })}>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Modal */}
      <ObjectForm
        isOpen={isFormOpen}
        onClose={() => { setIsFormOpen(false); setEditingObject(null); }}
        onSubmit={handleSubmit}
        isLoading={createMutation.isPending || updateMutation.isPending}
        editingObject={editingObject}
        objectTypes={objectTypes || []}
        workTypes={workTypes || []}
        organizations={organizations || []}
      />

      {/* Archive Confirm Dialog */}
      {deleteConfirmId && (
        <ConfirmDialog
          isOpen
          onClose={() => setDeleteConfirmId(null)}
          onConfirm={() => handleArchive(deleteConfirmId!)}
          title="Архивировать объект?"
          description="Объект будет перемещён в архив. Документы и отчёты сохранятся. Это действие нельзя отменить."
          confirmText="Архивировать"
          variant="destructive"
          isLoading={archiveMutation.isPending}
        />
      )}
    </div>
  )
}

function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText,
  variant = 'default',
  isLoading,
}: {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: string
  confirmText: string
  variant?: 'default' | 'destructive'
  isLoading?: boolean
}) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-500 mb-6">{description}</p>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>Отмена</Button>
          <Button variant={variant} onClick={onConfirm} loading={isLoading}>{confirmText}</Button>
        </div>
      </div>
    </div>
  )
}
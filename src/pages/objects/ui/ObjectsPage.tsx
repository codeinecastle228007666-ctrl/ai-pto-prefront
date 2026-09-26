import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { SortingState } from '@tanstack/react-table'
import type { ConstructionObject, ObjectSortBy } from '@/entities/object'
import type { ObjectFormData } from '@/features/objects'
import {
  useObjects,
  useObjectTypes,
  useWorkTypes,
  useOrganizations,
  useCreateObject,
  useUpdateObject,
  useArchiveObject,
  useObjectsStore,
  ObjectForm,
  ObjectsTable,
  ObjectsFilters,
  ObjectsPagination,
} from '@/features/objects'
import { Card, CardContent, ConfirmDialog } from '@/shared'
import { ObjectsPageHeader } from './ObjectsPageHeader'
import { OBJECTS_PAGE_LIMIT } from '../model/constants'

export function ObjectsPage() {
  const navigate = useNavigate()
  const { filters, setFilters, resetFilters } = useObjectsStore()
  const { data: objectsData, isLoading, refetch } = useObjects({ ...filters, limit: OBJECTS_PAGE_LIMIT })
  const { data: objectTypes } = useObjectTypes()
  const { data: workTypes } = useWorkTypes()
  const { data: organizations } = useOrganizations()

  const createMutation = useCreateObject()
  const updateMutation = useUpdateObject()
  const archiveMutation = useArchiveObject()

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingObject, setEditingObject] = useState<ConstructionObject | null>(null)
  const [objectToArchive, setObjectToArchive] = useState<ConstructionObject | null>(null)

  // tanstack sorting state -> серверные sortBy/sortOrder
  const sorting: SortingState = filters.sortBy
    ? [{ id: filters.sortBy, desc: filters.sortOrder === 'desc' }]
    : []

  const handleSortingChange = (next: SortingState) => {
    if (next.length === 0) {
      setFilters({ sortBy: 'updatedAt', sortOrder: 'desc' })
      return
    }
    const first = next[0]
    if (!first) return
    setFilters({
      sortBy: first.id as ObjectSortBy,
      sortOrder: first.desc ? 'desc' : 'asc',
    })
  }

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
      // Ошибка обрабатывается в форме/мутации
    }
  }

  const handleArchive = async (id: string) => {
    try {
      await archiveMutation.mutateAsync(id)
      setObjectToArchive(null)
      refetch()
    } catch (error) {
      console.error('Archive error:', error)
    }
  }

  return (
    <div className="space-y-6">
      <ObjectsPageHeader onCreate={handleOpenCreate} />

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <ObjectsFilters
            filters={filters}
            objectTypes={objectTypes || []}
            organizations={organizations || []}
            onChange={setFilters}
            onReset={resetFilters}
          />
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <ObjectsTable
            data={objectsData?.data ?? []}
            sorting={sorting}
            onSortingChange={handleSortingChange}
            onOpenObject={(object) => navigate(`/objects/${object.id}`)}
            onEditObject={handleEdit}
            onArchiveObject={setObjectToArchive}
            isLoading={isLoading}
          />

          {/* Pagination */}
          {objectsData && (
            <ObjectsPagination
              page={objectsData.page}
              totalPages={objectsData.totalPages}
              total={objectsData.total}
              onChange={(page) => setFilters({ page })}
            />
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Modal */}
      <ObjectForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false)
          setEditingObject(null)
        }}
        onSubmit={handleSubmit}
        isLoading={createMutation.isPending || updateMutation.isPending}
        editingObject={editingObject}
        objectTypes={objectTypes || []}
        workTypes={workTypes || []}
        organizations={organizations || []}
      />

      {/* Archive Confirm Dialog */}
      <ConfirmDialog
        isOpen={!!objectToArchive}
        onClose={() => setObjectToArchive(null)}
        onConfirm={() => objectToArchive && handleArchive(objectToArchive.id)}
        title="Архивировать объект?"
        description="Объект будет перемещён в архив. Документы и отчёты сохранятся. Это действие нельзя отменить."
        confirmText="Архивировать"
        variant="destructive"
        isLoading={archiveMutation.isPending}
      />
    </div>
  )
}

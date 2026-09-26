import { useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Loader2 } from 'lucide-react'
import type { ObjectFormData } from '@/features/objects'
import { useObject, useObjectTypes, useWorkTypes, useOrganizations, useUpdateObject, toFormDefaults } from '@/features/objects'
import { Button, Card, CardContent, CardHeader, CardTitle, Alert, AlertDescription } from '@/shared'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { objectSchema } from '@/features/objects'
import { ObjectFormFields } from '@/features/objects'
import { useEffect } from 'react'

export function ObjectEditPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { data: object, isLoading, error } = useObject(id || '', !!id)
  const { data: objectTypes } = useObjectTypes()
  const { data: workTypes } = useWorkTypes()
  const { data: organizations } = useOrganizations()
  const updateMutation = useUpdateObject()

  const form = useForm<ObjectFormData>({
    resolver: zodResolver(objectSchema),
    defaultValues: toFormDefaults(null),
  })

  const { reset } = form

  // Префилл данных объекта, как только они загружены
  useEffect(() => {
    if (object) {
      reset(toFormDefaults(object))
    }
  }, [object, reset])

  const handleSubmit = useCallback(
    async (data: ObjectFormData) => {
      if (!id) return
      try {
        await updateMutation.mutateAsync({ id, data })
        navigate(`/objects/${id}`)
      } catch (error) {
        // Ошибка обрабатывается мутацией
      }
    },
    [id, updateMutation, navigate]
  )

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
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" size="sm" onClick={() => navigate(`/objects/${id}`)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Назад к объекту
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Редактировать объект</CardTitle>
        </CardHeader>
        <CardContent>
          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <ObjectFormFields
                objectTypes={objectTypes || []}
                workTypes={workTypes || []}
                organizations={organizations || []}
                isEditing
              />

              {updateMutation.isError && (
                <Alert variant="destructive">
                  <AlertDescription>
                    Не удалось сохранить изменения. Попробуйте ещё раз.
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex justify-end gap-3 border-t border-gray-200 pt-4">
                <Button type="button" variant="outline" onClick={() => navigate(`/objects/${id}`)} disabled={updateMutation.isPending}>
                  Отмена
                </Button>
                <Button type="submit" loading={updateMutation.isPending}>
                  Сохранить
                </Button>
              </div>
            </form>
          </FormProvider>
        </CardContent>
      </Card>
    </div>
  )
}

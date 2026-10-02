import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Loader2 } from 'lucide-react'
import {
  useObject,
  useObjectTypes,
  useWorkTypes,
  useCounterparties,
  useUpdateObject,
  toWriteBody,
  ObjectFormView,
  type ObjectFormData,
} from '@/features/objects'
import { Alert, AlertDescription, Button } from '@/shared'

export function ObjectEditPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { data: object, isLoading, error } = useObject(id || '', !!id)
  const { data: objectTypes } = useObjectTypes()
  const { data: workTypes } = useWorkTypes()
  const { data: counterparties } = useCounterparties()
  const updateMutation = useUpdateObject()

  const handleSubmit = async (data: ObjectFormData) => {
    if (!id) return
    await updateMutation.mutateAsync({ id, data: toWriteBody(data) })
    navigate(`/objects/${id}`)
  }

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

  const backButton = (
    <Button variant="outline" size="sm" className="w-full sm:w-auto" onClick={() => navigate(`/objects/${id}`)}>
      <ArrowLeft className="h-4 w-4 mr-2" />
      Назад к объекту
    </Button>
  )

  if (object.status === 'archived') {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        {backButton}
        <Alert>
          <AlertDescription>Объект в архиве и доступен только для просмотра.</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {backButton}
      <ObjectFormView
        title="Редактировать объект"
        submitLabel="Сохранить"
        object={object}
        objectTypes={objectTypes || []}
        workTypes={workTypes || []}
        counterparties={counterparties || []}
        isSubmitting={updateMutation.isPending}
        onSubmit={handleSubmit}
        onCancel={() => navigate(`/objects/${id}`)}
      />
    </div>
  )
}

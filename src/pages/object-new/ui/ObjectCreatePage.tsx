import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import {
  useObjectTypes,
  useWorkTypes,
  useCounterparties,
  useCreateObject,
  toWriteBody,
  ObjectFormView,
  type ObjectFormData,
} from '@/features/objects'
import { Button } from '@/shared'

export function ObjectCreatePage() {
  const navigate = useNavigate()
  const { data: objectTypes } = useObjectTypes()
  const { data: workTypes } = useWorkTypes()
  const { data: counterparties } = useCounterparties()
  const createMutation = useCreateObject()

  const handleSubmit = async (data: ObjectFormData) => {
    const created = await createMutation.mutateAsync(toWriteBody(data))
    navigate(`/objects/${created.id}`, { replace: true })
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Button variant="outline" size="sm" className="w-full sm:w-auto" onClick={() => navigate('/objects')}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        К списку объектов
      </Button>

      <ObjectFormView
        title="Новый объект"
        submitLabel="Создать"
        objectTypes={objectTypes || []}
        workTypes={workTypes || []}
        counterparties={counterparties || []}
        isSubmitting={createMutation.isPending}
        onSubmit={handleSubmit}
        onCancel={() => navigate('/objects')}
      />
    </div>
  )
}

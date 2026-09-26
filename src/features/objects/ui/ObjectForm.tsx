import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Sheet, SheetContent, SheetHeader, SheetTitle } from '@/shared'
import type { ObjectType, WorkType, OrganizationRef, ConstructionObject } from '@/entities/object'
import { objectSchema, type ObjectFormData } from '../model/objectSchema'
import { ObjectFormFields } from './ObjectFormFields'

interface ObjectFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: ObjectFormData) => void
  isLoading: boolean
  /** Объект для редактирования; null — режим создания */
  editingObject: ConstructionObject | null
  objectTypes: ObjectType[]
  workTypes: WorkType[]
  organizations: OrganizationRef[]
}

export function toFormDefaults(object?: ConstructionObject | null): ObjectFormData {
  const toDateInput = (iso?: string) => (iso ? iso.slice(0, 10) : '')
  return {
    code: object?.code ?? '',
    name: object?.name ?? '',
    address: object?.address ?? '',
    objectTypeId: object?.objectTypeId ?? '',
    customerOrganizationId: object?.customerOrganizationId ?? '',
    contractorOrganizationId: object?.contractorOrganizationId ?? '',
    status: object?.status ?? 'draft',
    description: object?.description ?? '',
    startDate: toDateInput(object?.startDate),
    plannedEndDate: toDateInput(object?.plannedEndDate),
    workTypeIds: object?.workTypes?.map((wt) => wt.id) ?? [],
  }
}

export function ObjectForm({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  editingObject,
  objectTypes,
  workTypes,
  organizations,
}: ObjectFormProps) {
  const form = useForm<ObjectFormData>({
    resolver: zodResolver(objectSchema),
    defaultValues: toFormDefaults(editingObject),
  })

  const { handleSubmit, formState: { errors } } = form

  return (
    <Sheet open={isOpen} onOpenChange={(open) => { if (!open) onClose() }}>
      <SheetContent side="right" className="w-full max-w-2xl sm:max-w-2xl p-0 overflow-y-auto flex flex-col">
        <SheetHeader className="p-6 border-b border-gray-200">
          <SheetTitle>{editingObject ? 'Редактировать объект' : 'Создать объект'}</SheetTitle>
        </SheetHeader>
        <FormProvider {...form}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col flex-1 min-h-0"
          >
            <div className="p-6 overflow-y-auto flex-1">
              <ObjectFormFields
                objectTypes={objectTypes}
                workTypes={workTypes}
                organizations={organizations}
                isEditing={!!editingObject}
              />
            </div>
            <div className="border-t border-gray-200 p-6">
              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
                  Отмена
                </Button>
                <Button type="submit" loading={isLoading}>
                  {editingObject ? 'Сохранить' : 'Создать'}
                </Button>
              </div>
            </div>
          </form>
        </FormProvider>
      </SheetContent>
    </Sheet>
  )
}

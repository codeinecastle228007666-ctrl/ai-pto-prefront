import { useFormContext, Controller } from 'react-hook-form'
import { Input, Label, Textarea, Select, SelectTrigger, SelectValue, SelectContent, SelectItem, Badge } from '@/shared'
import type { ObjectType, WorkType, OrganizationRef, ObjectStatus } from '@/entities/object'
import type { ObjectFormData } from '../model/objectSchema'

const statusOptions: { value: ObjectStatus; label: string }[] = [
  { value: 'draft', label: 'Черновик' },
  { value: 'active', label: 'Активен' },
  { value: 'on_hold', label: 'На паузе' },
  { value: 'completed', label: 'Завершён' },
  { value: 'archived', label: 'В архиве' },
]

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="text-sm text-red-600">{message}</p>
}

interface ObjectFormFieldsProps {
  objectTypes: ObjectType[]
  workTypes: WorkType[]
  organizations: OrganizationRef[]
  isEditing?: boolean
}

// Контролируемые поля формы объекта (используется в модалке и на странице редактирования)
export function ObjectFormFields({ objectTypes, workTypes, organizations, isEditing }: ObjectFormFieldsProps) {
  const { register, watch, control, formState: { errors } } = useFormContext<ObjectFormData>()
  const selectedWorkTypes = watch('workTypeIds') ?? []

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="code">Код *</Label>
          <Input id="code" error={errors.code?.message} {...register('code')} disabled={isEditing} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="name">Название *</Label>
          <Input id="name" error={errors.name?.message} {...register('name')} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Адрес *</Label>
        <Input id="address" error={errors.address?.message} {...register('address')} />
        <FieldError message={errors.address?.message} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="objectTypeId">Тип объекта *</Label>
          <Controller
            control={control}
            name="objectTypeId"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="objectTypeId">
                  <SelectValue placeholder="Выберите тип объекта" />
                </SelectTrigger>
                <SelectContent>
                  {objectTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>{type.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          <FieldError message={errors.objectTypeId?.message} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Статус</Label>
          <Controller
            control={control}
            name="status"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Выберите статус" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="customerOrganizationId">Заказчик *</Label>
          <Controller
            control={control}
            name="customerOrganizationId"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="customerOrganizationId">
                  <SelectValue placeholder="Выберите заказчика" />
                </SelectTrigger>
                <SelectContent>
                  {organizations.map((org) => (
                    <SelectItem key={org.id} value={org.id}>{org.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          <FieldError message={errors.customerOrganizationId?.message} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contractorOrganizationId">Подрядчик *</Label>
          <Controller
            control={control}
            name="contractorOrganizationId"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="contractorOrganizationId">
                  <SelectValue placeholder="Выберите подрядчика" />
                </SelectTrigger>
                <SelectContent>
                  {organizations.map((org) => (
                    <SelectItem key={org.id} value={org.id}>{org.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          <FieldError message={errors.contractorOrganizationId?.message} />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Виды работ *</Label>
        <Controller
          control={control}
          name="workTypeIds"
          render={({ field }) => (
            <div className="flex flex-wrap gap-2">
              {workTypes.map((wt) => {
                const selected = (field.value ?? []).includes(wt.id)
                return (
                  <Badge
                    key={wt.id}
                    variant={selected ? 'success' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => {
                      const newSelection = selected
                        ? (field.value ?? []).filter((id) => id !== wt.id)
                        : [...(field.value ?? []), wt.id]
                      field.onChange(newSelection)
                    }}
                  >
                    {wt.name}
                  </Badge>
                )
              })}
            </div>
          )}
        />
        <FieldError message={errors.workTypeIds?.message} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="startDate">Дата начала</Label>
          <Input id="startDate" type="date" {...register('startDate')} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="plannedEndDate">Плановая дата окончания</Label>
          <Input id="plannedEndDate" type="date" {...register('plannedEndDate')} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Описание</Label>
        <Textarea id="description" rows={3} {...register('description')} />
      </div>
    </div>
  )
}

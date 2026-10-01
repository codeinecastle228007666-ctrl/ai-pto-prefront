import { useFormContext, Controller } from 'react-hook-form'
import { Input, Label, Textarea, Select, SelectTrigger, SelectValue, SelectContent, SelectItem, Badge } from '@/shared'
import type { ObjectType, WorkType, OrganizationRef } from '@/entities/object'
import type { ObjectFormData } from '../model/objectSchema'

const NONE = '__none__'

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="text-sm text-red-600">{message}</p>
}

interface ObjectFormFieldsProps {
  objectTypes: ObjectType[]
  workTypes: WorkType[]
  counterparties: OrganizationRef[]
}

/** Поля формы объекта (создание и редактирование), stage-1. */
export function ObjectFormFields({ objectTypes, workTypes, counterparties }: ObjectFormFieldsProps) {
  const { register, control, formState: { errors } } = useFormContext<ObjectFormData>()

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Название *</Label>
          <Input id="name" error={errors.name?.message} {...register('name')} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="code">Код *</Label>
          <Input id="code" error={errors.code?.message} {...register('code')} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="objectTypeId">Тип объекта *</Label>
        <Controller
          control={control}
          name="objectTypeId"
          render={({ field }) => (
            <Select value={field.value || undefined} onValueChange={field.onChange}>
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
                      const next = selected
                        ? (field.value ?? []).filter((id) => id !== wt.id)
                        : [...(field.value ?? []), wt.id]
                      field.onChange(next)
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

      <div className="space-y-2">
        <Label htmlFor="address">Адрес</Label>
        <Input id="address" {...register('address')} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <CounterpartySelect
          name="customerOrganizationId"
          label="Заказчик"
          placeholder="Не выбран"
          counterparties={counterparties}
        />
        <CounterpartySelect
          name="contractorOrganizationId"
          label="Подрядчик"
          placeholder="Не выбран"
          counterparties={counterparties}
        />
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

function CounterpartySelect({
  name,
  label,
  placeholder,
  counterparties,
}: {
  name: 'customerOrganizationId' | 'contractorOrganizationId'
  label: string
  placeholder: string
  counterparties: OrganizationRef[]
}) {
  const { control } = useFormContext<ObjectFormData>()
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <Select
            value={field.value ? field.value : NONE}
            onValueChange={(v) => field.onChange(v === NONE ? '' : v)}
          >
            <SelectTrigger id={name}>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={NONE}>{placeholder}</SelectItem>
              {counterparties.map((org) => (
                <SelectItem key={org.id} value={org.id}>{org.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
    </div>
  )
}

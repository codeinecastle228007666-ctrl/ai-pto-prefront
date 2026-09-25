'use client'

import { useEffect } from 'react'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import { Label } from '@/shared/ui/Label'
import { Textarea } from '@/shared/ui/Textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/Select'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/shared/ui/Sheet'
import { Badge } from '@/shared/ui/Badge'
import { cn } from '@/shared/lib/utils'
import type { ObjectType, WorkType, OrganizationRef } from '@/entities/object/types'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { objectSchema, type ObjectFormData } from '../model/objectSchema'

interface ObjectFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: ObjectFormData) => void
  isLoading: boolean
  editingObject: { id: string } | null
  objectTypes: ObjectType[]
  workTypes: WorkType[]
  organizations: OrganizationRef[]
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
    defaultValues: {
      code: '',
      name: '',
      address: '',
      objectTypeId: '',
      customerOrganizationId: '',
      contractorOrganizationId: '',
      status: 'draft',
      description: '',
      startDate: '',
      plannedEndDate: '',
      workTypeIds: [],
    },
  })

  const { handleSubmit, watch, setValue, formState: { errors }, reset } = form
  const selectedWorkTypes = watch('workTypeIds')

  useEffect(() => {
    if (editingObject) {
      // Note: In a real app, you'd fetch the full object data here
      // For now, we'll just set the basic fields
      reset({
        code: '',
        name: '',
        address: '',
        objectTypeId: '',
        customerOrganizationId: '',
        contractorOrganizationId: '',
        status: 'draft',
        description: '',
        startDate: '',
        plannedEndDate: '',
        workTypeIds: [],
      })
    } else {
      reset({
        code: '',
        name: '',
        address: '',
        objectTypeId: '',
        customerOrganizationId: '',
        contractorOrganizationId: '',
        status: 'draft',
        description: '',
        startDate: '',
        plannedEndDate: '',
        workTypeIds: [],
      })
    }
  }, [editingObject, reset])

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full max-w-2xl p-0">
        <SheetHeader className="p-6 border-b border-gray-200">
          <SheetTitle>{editingObject ? 'Редактировать объект' : 'Создать объект'}</SheetTitle>
        </SheetHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="code">Код *</Label>
              <Input
                id="code"
                error={errors.code?.message}
                {...form.register('code')}
                disabled={!!editingObject}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Название *</Label>
              <Input
                id="name"
                error={errors.name?.message}
                {...form.register('name')}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Адрес *</Label>
            <Input
              id="address"
              error={errors.address?.message}
              {...form.register('address')}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="objectTypeId">Тип объекта *</Label>
              <Select
                onValueChange={(value) => form.setValue('objectTypeId', value, { shouldValidate: true })}
              >
                <SelectTrigger id="objectTypeId">
                  <SelectValue placeholder="Выберите тип объекта" />
                </SelectTrigger>
                <SelectContent>
                  {objectTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>{type.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.objectTypeId && <p className="text-sm text-red-600">{errors.objectTypeId.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Статус</Label>
              <Select
                onValueChange={(value) => form.setValue('status', value as any, { shouldValidate: true })}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Статус" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Черновик</SelectItem>
                  <SelectItem value="active">Активен</SelectItem>
                  <SelectItem value="on_hold">На паузе</SelectItem>
                  <SelectItem value="completed">Завершён</SelectItem>
                  <SelectItem value="archived">В архиве</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="customerOrganizationId">Заказчик *</Label>
              <Select
                onValueChange={(value) => form.setValue('customerOrganizationId', value, { shouldValidate: true })}
              >
                <SelectTrigger id="customerOrganizationId">
                  <SelectValue placeholder="Выберите заказчика" />
                </SelectTrigger>
                <SelectContent>
                  {organizations.map((org) => (
                    <SelectItem key={org.id} value={org.id}>{org.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.customerOrganizationId && <p className="text-sm text-red-600">{errors.customerOrganizationId.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="contractorOrganizationId">Подрядчик *</Label>
              <Select
                onValueChange={(value) => form.setValue('contractorOrganizationId', value, { shouldValidate: true })}
              >
                <SelectTrigger id="contractorOrganizationId">
                  <SelectValue placeholder="Выберите подрядчика" />
                </SelectTrigger>
                <SelectContent>
                  {organizations.map((org) => (
                    <SelectItem key={org.id} value={org.id}>{org.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.contractorOrganizationId && <p className="text-sm text-red-600">{errors.contractorOrganizationId.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Виды работ *</Label>
            <div className="flex flex-wrap gap-2">
              {workTypes.map((wt) => (
                <Badge
                  key={wt.id}
                  variant={selectedWorkTypes.includes(wt.id) ? 'success' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => {
                    const newSelection = selectedWorkTypes.includes(wt.id)
                      ? selectedWorkTypes.filter((id) => id !== wt.id)
                      : [...selectedWorkTypes, wt.id]
                    setValue('workTypeIds', newSelection, { shouldValidate: true })
                  }}
                >
                  {wt.name}
                </Badge>
              ))}
            </div>
            {errors.workTypeIds && <p className="text-sm text-red-600">{errors.workTypeIds.message}</p>}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="startDate">Дата начала</Label>
              <Input
                id="startDate"
                type="date"
                {...form.register('startDate')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="plannedEndDate">Плановая дата окончания</Label>
              <Input
                id="plannedEndDate"
                type="date"
                {...form.register('plannedEndDate')}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Описание</Label>
            <Textarea
              id="description"
              rows={3}
              {...form.register('description')}
            />
          </div>

          <SheetFooter className="border-t border-gray-200 p-6">
            <div className="flex justify-end gap-3 w-full">
              <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
                Отмена
              </Button>
              <Button type="submit" loading={isLoading}>
                {editingObject ? 'Сохранить' : 'Создать'}
              </Button>
            </div>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
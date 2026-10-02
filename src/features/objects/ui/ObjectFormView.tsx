import { useEffect } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { AxiosError } from 'axios'
import { Alert, AlertDescription, Button, Card, CardContent, CardHeader, CardTitle } from '@/shared'
import type { ConstructionObject, ObjectType, OrganizationRef, WorkType } from '@/entities/object'
import { objectSchema, type ObjectFormData } from '../model/objectSchema'
import { toFormDefaults } from '../model/toFormDefaults'
import { ObjectFormFields } from './ObjectFormFields'

interface ObjectFormViewProps {
  title: string
  submitLabel: string
  object?: ConstructionObject | null
  objectTypes: ObjectType[]
  workTypes: WorkType[]
  counterparties: OrganizationRef[]
  isSubmitting: boolean
  onSubmit: (data: ObjectFormData) => Promise<void>
  onCancel: () => void
}

/** Одна форма для /objects/new и /objects/:id/edit (RHF + Zod). */
export function ObjectFormView({
  title,
  submitLabel,
  object,
  objectTypes,
  workTypes,
  counterparties,
  isSubmitting,
  onSubmit,
  onCancel,
}: ObjectFormViewProps) {
  const form = useForm<ObjectFormData>({
    resolver: zodResolver(objectSchema),
    defaultValues: toFormDefaults(object),
  })

  useEffect(() => {
    if (object) form.reset(toFormDefaults(object))
  }, [object, form])

  const submit = async (data: ObjectFormData) => {
    try {
      await onSubmit(data)
    } catch (err) {
      const status = (err as AxiosError).response?.status
      if (status === 409) {
        form.setError('code', { type: 'server', message: 'Объект с таким кодом уже существует' })
        return
      }
      form.setError('root', { type: 'server', message: 'Не удалось сохранить. Попробуйте ещё раз.' })
    }
  }

  const rootError = form.formState.errors.root?.message

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl sm:text-2xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(submit)} className="space-y-6">
            <ObjectFormFields objectTypes={objectTypes} workTypes={workTypes} counterparties={counterparties} />

            {rootError && (
              <Alert variant="destructive">
                <AlertDescription>{rootError}</AlertDescription>
              </Alert>
            )}

            <div className="flex flex-col-reverse gap-3 border-t border-gray-200 pt-4 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                className="w-full sm:w-auto"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Отмена
              </Button>
              <Button type="submit" className="w-full sm:w-auto" loading={isSubmitting}>
                {submitLabel}
              </Button>
            </div>
          </form>
        </FormProvider>
      </CardContent>
    </Card>
  )
}

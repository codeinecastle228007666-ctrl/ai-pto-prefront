import { useForm } from 'react-hook-form'
import { Save } from 'lucide-react'
import { useAuthStore } from '@/features/auth'
import { Alert, AlertDescription, Button, Card, CardHeader, CardTitle, CardContent, Input, Label } from '@/shared'
import { useProfileUpdate } from '../model/useProfileUpdate'
import { profileSchema, type ProfileFormData } from '../model/profileSchemas'
import { zodResolver } from '@hookform/resolvers/zod'

export function ProfileForm() {
  const user = useAuthStore((state) => state.user)

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
    },
  })

  const profileMutation = useProfileUpdate()
  const { register, handleSubmit, formState: { errors } } = form

  const onSubmit = async (data: ProfileFormData) => {
    profileMutation.mutate(data)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Личные данные</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {profileMutation.isSuccess && (
            <Alert variant="success">
              <AlertDescription>Профиль успешно обновлён</AlertDescription>
            </Alert>
          )}
          {profileMutation.isError && (
            <Alert variant="destructive">
              <AlertDescription>Ошибка при обновлении профиля</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Имя *</Label>
            <Input id="name" error={errors.name?.message} {...register('name')} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input id="email" type="email" error={errors.email?.message} {...register('email')} />
          </div>

          <div className="flex justify-end">
            <Button type="submit" loading={profileMutation.isPending}>
              <Save className="h-4 w-4 mr-2" />
              Сохранить изменения
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

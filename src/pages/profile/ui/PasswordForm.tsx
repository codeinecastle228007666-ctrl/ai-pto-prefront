import { useForm } from 'react-hook-form'
import { Lock } from 'lucide-react'
import { Alert, AlertDescription, Button, Card, CardHeader, CardTitle, CardContent, Input, Label } from '@/shared'
import { usePasswordChange } from '../model/useProfileUpdate'
import { passwordSchema, type PasswordFormData } from '../model/profileSchemas'
import { zodResolver } from '@hookform/resolvers/zod'

export function PasswordForm() {
  const form = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  })

  const passwordMutation = usePasswordChange()
  const { register, handleSubmit, reset, formState: { errors } } = form

  const onSubmit = async (data: PasswordFormData) => {
    passwordMutation.mutate(data, {
      onSuccess: () => reset(),
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Смена пароля</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {passwordMutation.isSuccess && (
            <Alert variant="success">
              <AlertDescription>Пароль успешно изменён</AlertDescription>
            </Alert>
          )}
          {passwordMutation.isError && (
            <Alert variant="destructive">
              <AlertDescription>Ошибка при смене пароля</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="currentPassword">Текущий пароль *</Label>
            <Input id="currentPassword" type="password" error={errors.currentPassword?.message} {...register('currentPassword')} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword">Новый пароль *</Label>
            <Input id="newPassword" type="password" error={errors.newPassword?.message} {...register('newPassword')} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Подтвердите новый пароль *</Label>
            <Input id="confirmPassword" type="password" error={errors.confirmPassword?.message} {...register('confirmPassword')} />
          </div>

          <div className="flex justify-end">
            <Button type="submit" loading={passwordMutation.isPending}>
              <Lock className="h-4 w-4 mr-2" />
              Изменить пароль
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

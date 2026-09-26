import { z } from 'zod'

export const objectSchema = z.object({
  code: z.string().min(1, 'Код обязателен'),
  name: z.string().min(1, 'Название обязательно'),
  address: z.string().min(1, 'Адрес обязателен'),
  objectTypeId: z.string().min(1, 'Выберите тип объекта'),
  customerOrganizationId: z.string().min(1, 'Выберите заказчика'),
  contractorOrganizationId: z.string().min(1, 'Выберите подрядчика'),
  status: z.enum(['draft', 'active', 'on_hold', 'completed', 'archived']),
  description: z.string().optional(),
  startDate: z.string().optional(),
  plannedEndDate: z.string().optional(),
  workTypeIds: z.array(z.string().min(1)).min(1, 'Выберите минимум 1 вид работ'),
})

export type ObjectFormData = z.infer<typeof objectSchema>

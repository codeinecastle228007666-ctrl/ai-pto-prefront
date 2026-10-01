import { z } from 'zod'

export const objectSchema = z.object({
  code: z.string().min(1, 'Код обязателен'),
  name: z.string().min(1, 'Название обязательно'),
  objectTypeId: z.string().min(1, 'Выберите тип объекта'),
  workTypeIds: z.array(z.string().min(1)).min(1, 'Выберите минимум 1 вид работ'),
  address: z.string().optional(),
  description: z.string().optional(),
  customerOrganizationId: z.string().optional(),
  contractorOrganizationId: z.string().optional(),
  startDate: z.string().optional(),
  plannedEndDate: z.string().optional(),
})

export type ObjectFormData = z.infer<typeof objectSchema>

import type { ObjectStatus } from '@/entities/object'
import type { ObjectStatusTransition } from '../api/objectsApi'

/** Разрешённые переходы статуса (stage-1). completed/archived — без кнопок. */
export const STATUS_TRANSITIONS: Record<ObjectStatus, { to: ObjectStatusTransition; label: string }[]> = {
  draft: [{ to: 'active', label: 'В работу' }],
  active: [
    { to: 'on_hold', label: 'Пауза' },
    { to: 'completed', label: 'Завершить' },
  ],
  on_hold: [
    { to: 'active', label: 'В работу' },
    { to: 'completed', label: 'Завершить' },
  ],
  completed: [],
  archived: [],
}

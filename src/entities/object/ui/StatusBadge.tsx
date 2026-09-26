import { Badge } from '@/shared'
import type { ObjectStatus } from '../types'

export const OBJECT_STATUS_CONFIG: Record<ObjectStatus, { badge: BadgeVariant; text: string }> = {
  draft: { badge: 'secondary', text: 'Черновик' },
  active: { badge: 'success', text: 'Активен' },
  on_hold: { badge: 'warning', text: 'На паузе' },
  completed: { badge: 'info', text: 'Завершён' },
  archived: { badge: 'destructive', text: 'В архиве' },
}

export const OBJECT_STATUSES = Object.keys(OBJECT_STATUS_CONFIG) as ObjectStatus[]

type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' | 'info'

export function StatusBadge({ status }: { status: ObjectStatus }) {
  const config = OBJECT_STATUS_CONFIG[status]
  return <Badge variant={config.badge}>{config.text}</Badge>
}

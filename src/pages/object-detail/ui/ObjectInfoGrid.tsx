import { Building2, MapPin, User, Calendar } from 'lucide-react'
import type { ConstructionObject } from '@/entities/object'
import { formatObjectDate } from '../model/formatObjectDate'

interface ObjectInfoGridProps {
  object: ConstructionObject
}

export function ObjectInfoGrid({ object }: ObjectInfoGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <InfoCard label="Тип объекта" value={object.objectType?.name || '—'} Icon={Building2} />
      <InfoCard label="Адрес" value={object.address || '—'} Icon={MapPin} />
      <InfoCard label="Заказчик" value={object.customerOrganization?.name || '—'} Icon={User} />
      <InfoCard label="Подрядчик" value={object.contractorOrganization?.name || '—'} Icon={User} />
      <InfoCard label="Дата начала" value={formatObjectDate(object.startDate)} Icon={Calendar} />
      <InfoCard label="Плановый конец" value={formatObjectDate(object.plannedEndDate)} Icon={Calendar} />
      <InfoCard label="Факт. конец" value={formatObjectDate(object.actualEndDate)} Icon={Calendar} />
      <InfoCard label="Создан" value={formatObjectDate(object.createdAt)} Icon={Calendar} />
    </div>
  )
}

function InfoCard({ label, value, Icon }: { label: string; value: string; Icon: React.ElementType }) {
  return (
    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
      <div className="p-2 bg-white rounded border border-gray-200">
        <Icon className="h-5 w-5 text-gray-500" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-gray-500">{label}</p>
        <p className="font-medium text-gray-900 break-words">{value}</p>
      </div>
    </div>
  )
}

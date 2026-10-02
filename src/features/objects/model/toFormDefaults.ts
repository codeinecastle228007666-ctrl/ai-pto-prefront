import type { ConstructionObject } from '@/entities/object'
import type { ObjectFormData } from './objectSchema'
import type { ObjectWriteBody } from '../api/objectsApi'

const toDateInput = (iso?: string) => (iso ? iso.slice(0, 10) : '')

export function toFormDefaults(object?: ConstructionObject | null): ObjectFormData {
  return {
    code: object?.code ?? '',
    name: object?.name ?? '',
    objectTypeId: object?.objectTypeId ?? '',
    workTypeIds: object?.workTypes?.map((wt) => wt.id) ?? [],
    address: object?.address ?? '',
    description: object?.description ?? '',
    customerOrganizationId: object?.customerOrganizationId ?? '',
    contractorOrganizationId: object?.contractorOrganizationId ?? '',
    startDate: toDateInput(object?.startDate),
    plannedEndDate: toDateInput(object?.plannedEndDate),
  }
}

export function toWriteBody(data: ObjectFormData): ObjectWriteBody {
  return {
    code: data.code,
    name: data.name,
    objectTypeId: data.objectTypeId,
    workTypeIds: data.workTypeIds,
    address: data.address,
    description: data.description,
    customerOrganizationId: data.customerOrganizationId,
    contractorOrganizationId: data.contractorOrganizationId,
    startDate: data.startDate,
    plannedEndDate: data.plannedEndDate,
  }
}

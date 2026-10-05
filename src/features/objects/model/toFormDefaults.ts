import type { ConstructionObject } from '@/entities/object'
import type { ObjectFormData } from './objectSchema'
import type { ObjectWriteBody } from '../api/objectsApi'

export function toFormDefaults(object?: ConstructionObject | null): ObjectFormData {
  return {
    code: object?.code ?? '',
    name: object?.name ?? '',
    objectTypeId: object?.objectType.id ?? '',
    workTypeIds: object?.workTypes?.map((wt) => wt.id) ?? [],
    address: object?.address ?? '',
    description: object?.description ?? '',
    customerOrganizationId: object?.customer?.id ?? '',
    contractorOrganizationId: object?.contractor?.id ?? '',
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
  }
}

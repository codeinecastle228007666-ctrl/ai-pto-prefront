import type {
  ConstructionObject,
  ObjectListParams,
  ObjectListResponse,
} from '@/entities/object'

function sortValue(o: ConstructionObject, sortBy: string): string | null | undefined {
  switch (sortBy) {
    case 'objectTypeId':
      return o.objectType.name
    case 'customerOrganizationId':
      return o.customer?.name
    case 'contractorOrganizationId':
      return o.contractor?.name
    default:
      return o[sortBy as keyof ConstructionObject] as string | null | undefined
  }
}

// GET /objects отдаёт весь список без пагинации — фильтры/сортировка/страницы на клиенте.
export function applyListParams(
  items: ConstructionObject[],
  params: ObjectListParams
): ObjectListResponse {
  let filtered = items

  if (params.search) {
    const q = params.search.toLowerCase()
    filtered = filtered.filter(
      (o) =>
        o.name.toLowerCase().includes(q) ||
        o.code.toLowerCase().includes(q) ||
        (o.address ?? '').toLowerCase().includes(q)
    )
  }
  if (params.status?.length) {
    filtered = filtered.filter((o) => params.status!.includes(o.status))
  }
  if (params.objectTypeId) {
    filtered = filtered.filter((o) => o.objectType.id === params.objectTypeId)
  }
  if (params.customerOrganizationId) {
    filtered = filtered.filter((o) => o.customer?.id === params.customerOrganizationId)
  }
  if (params.contractorOrganizationId) {
    filtered = filtered.filter((o) => o.contractor?.id === params.contractorOrganizationId)
  }

  const sortBy = params.sortBy ?? 'updatedAt'
  const dir = (params.sortOrder ?? 'desc') === 'asc' ? 1 : -1
  filtered = [...filtered].sort((a, b) => {
    const av = sortValue(a, sortBy)
    const bv = sortValue(b, sortBy)
    if (av == null && bv == null) return 0
    if (av == null) return 1
    if (bv == null) return -1
    return av < bv ? -dir : av > bv ? dir : 0
  })

  const page = params.page ?? 1
  const limit = params.limit ?? 20
  const start = (page - 1) * limit
  return {
    data: filtered.slice(start, start + limit),
    total: filtered.length,
    page,
    limit,
    totalPages: Math.ceil(filtered.length / limit),
  }
}

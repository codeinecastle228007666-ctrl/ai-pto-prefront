import { http, HttpResponse, delay } from 'msw'
import type { ConstructionObject, ObjectType, WorkType, OrganizationRef, ObjectStatus } from '@/entities/object/types'
import {
  mockUserWithOrg,
  mockCredentials,
  generateTokens,
} from './data/auth'
import {
  mockObjects,
  mockObjectTypes,
  mockWorkTypes,
  mockOrganizations,
  resetMockObjects,
} from './data/objects'

interface CreateObjectInput {
  code: string
  name: string
  address: string
  objectTypeId: string
  customerOrganizationId: string
  contractorOrganizationId: string
  status?: ObjectStatus
  description?: string
  startDate?: string
  plannedEndDate?: string
  workTypeIds: string[]
}

interface UpdateObjectInput extends Partial<CreateObjectInput> {}

const DELAY = 300

async function withDelay<T>(fn: () => T): Promise<T> {
  await delay(DELAY)
  return fn()
}

function requireAuth(request: Request) {
  const auth = request.headers.get('Authorization')
  if (!auth?.startsWith('Bearer ')) {
    throw HttpResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }
  return true
}

function parseQuery(url: string) {
  const { searchParams } = new URL(url)
  const params: Record<string, string | string[]> = {}
  searchParams.forEach((value, key) => {
    if (params[key]) {
      params[key] = Array.isArray(params[key]) ? [...params[key], value] : [params[key], value]
    } else {
      params[key] = value
    }
  })
  return params
}

export const handlers = [
  // === AUTH ===
  http.post('/api/auth/login', async ({ request }) => {
    return withDelay(async () => {
      const body = (await request.json()) as { email?: string; password?: string }
      if (body.email === mockCredentials.email && body.password === mockCredentials.password) {
        const tokens = generateTokens()
        return HttpResponse.json({
          user: mockUserWithOrg,
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        })
      }
      return HttpResponse.json({ message: 'Неверный email или пароль' }, { status: 401 })
    })
  }),

  http.post('/api/auth/logout', async ({ request }) => {
    requireAuth(request)
    return withDelay(() => new HttpResponse(null, { status: 204 }))
  }),

  http.get('/api/auth/me', async ({ request }) => {
    requireAuth(request)
    return withDelay(() => HttpResponse.json(mockUserWithOrg))
  }),

  http.post('/api/auth/refresh', async ({ request }) => {
    return withDelay(async () => {
      const body = (await request.json()) as { refreshToken?: string }
      if (body.refreshToken?.startsWith('mock-refresh-token-')) {
        const tokens = generateTokens()
        return HttpResponse.json(tokens)
      }
      return HttpResponse.json({ message: 'Invalid refresh token' }, { status: 401 })
    })
  }),

  // === OBJECTS ===
  http.get('/api/objects', async ({ request }) => {
    requireAuth(request)
    return withDelay(() => {
      const params = parseQuery(request.url)
      let filtered = [...mockObjects]

      if (params.search) {
        const search = String(params.search).toLowerCase()
        filtered = filtered.filter(o =>
          o.name.toLowerCase().includes(search) ||
          o.code.toLowerCase().includes(search) ||
          o.address.toLowerCase().includes(search)
        )
      }

      if (params.status) {
        const statuses = Array.isArray(params.status) ? params.status : [params.status]
        filtered = filtered.filter(o => statuses.includes(o.status as ObjectStatus))
      }

      if (params.objectTypeId) {
        filtered = filtered.filter(o => o.objectTypeId === params.objectTypeId)
      }

      const sortBy = String(params.sortBy || 'updatedAt')
      const sortOrder = String(params.sortOrder || 'desc')
      filtered.sort((a, b) => {
        const aVal = a[sortBy as keyof ConstructionObject]
        const bVal = b[sortBy as keyof ConstructionObject]
        if (aVal == null || bVal == null) return 0
        if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1
        if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1
        return 0
      })

      const page = parseInt(String(params.page || '1'))
      const limit = parseInt(String(params.limit || '20'))
      const start = (page - 1) * limit
      const end = start + limit
      const paginated = filtered.slice(start, end)

      return HttpResponse.json({
        data: paginated,
        total: filtered.length,
        page,
        limit,
        totalPages: Math.ceil(filtered.length / limit),
      })
    })
  }),

  http.post('/api/objects', async ({ request }) => {
    requireAuth(request)
    return withDelay(async () => {
      const body = (await request.json()) as CreateObjectInput
      const newObject: ConstructionObject = {
        id: `obj-${Date.now()}`,
        organizationId: 'org-1',
        code: body.code,
        name: body.name,
        address: body.address,
        objectTypeId: body.objectTypeId,
        customerOrganizationId: body.customerOrganizationId,
        contractorOrganizationId: body.contractorOrganizationId,
        status: body.status ?? 'draft',
        description: body.description,
        startDate: body.startDate,
        plannedEndDate: body.plannedEndDate,
        actualEndDate: undefined,
        createdById: 'user-1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        archivedAt: undefined,
        workTypes: mockWorkTypes.filter(wt => body.workTypeIds.includes(wt.id)),
        objectType: mockObjectTypes.find(ot => ot.id === body.objectTypeId)!,
        customerOrganization: mockOrganizations.find(o => o.id === body.customerOrganizationId)!,
        contractorOrganization: mockOrganizations.find(o => o.id === body.contractorOrganizationId)!,
        _count: { packages: 0, findings: 0 },
        readiness: 0,
        lastCheckedAt: undefined,
      }
      mockObjects.unshift(newObject)
      return HttpResponse.json(newObject, { status: 201 })
    })
  }),

  http.get('/api/objects/:id', async ({ params }) => {
    return withDelay(() => {
      const object = mockObjects.find(o => o.id === params.id)
      if (!object) {
        return HttpResponse.json({ message: 'Object not found' }, { status: 404 })
      }
      return HttpResponse.json(object)
    })
  }),

  http.patch('/api/objects/:id', async ({ params, request }) => {
    requireAuth(request)
    return withDelay(async () => {
      const body = (await request.json()) as UpdateObjectInput
      const index = mockObjects.findIndex(o => o.id === params.id)
      if (index === -1) {
        return HttpResponse.json({ message: 'Object not found' }, { status: 404 })
      }
      const existing = mockObjects[index]!
      const updated: ConstructionObject = {
        id: existing.id,
        organizationId: existing.organizationId,
        code: body.code ?? existing.code,
        name: body.name ?? existing.name,
        address: body.address ?? existing.address,
        objectTypeId: body.objectTypeId ?? existing.objectTypeId,
        customerOrganizationId: body.customerOrganizationId ?? existing.customerOrganizationId,
        contractorOrganizationId: body.contractorOrganizationId ?? existing.contractorOrganizationId,
        status: body.status ?? existing.status,
        description: body.description ?? existing.description,
        startDate: body.startDate ?? existing.startDate,
        plannedEndDate: body.plannedEndDate ?? existing.plannedEndDate,
        actualEndDate: existing.actualEndDate,
        createdById: existing.createdById,
        createdAt: existing.createdAt,
        updatedAt: new Date().toISOString(),
        archivedAt: existing.archivedAt,
        workTypes: body.workTypeIds
          ? mockWorkTypes.filter(wt => body.workTypeIds!.includes(wt.id))
          : existing.workTypes,
        objectType: body.objectTypeId
          ? mockObjectTypes.find(ot => ot.id === body.objectTypeId)!
          : existing.objectType,
        customerOrganization: body.customerOrganizationId
          ? mockOrganizations.find(o => o.id === body.customerOrganizationId)!
          : existing.customerOrganization,
        contractorOrganization: body.contractorOrganizationId
          ? mockOrganizations.find(o => o.id === body.contractorOrganizationId)!
          : existing.contractorOrganization,
        _count: existing._count,
        readiness: existing.readiness,
        lastCheckedAt: existing.lastCheckedAt,
      }
      mockObjects[index] = updated
      return HttpResponse.json(updated)
    })
  }),

  http.delete('/api/objects/:id', async ({ params, request }) => {
    requireAuth(request)
    return withDelay(() => {
      const index = mockObjects.findIndex(o => o.id === params.id)
      if (index === -1) {
        return HttpResponse.json({ message: 'Object not found' }, { status: 404 })
      }
      const existing = mockObjects[index]!
      mockObjects[index] = {
        ...existing,
        status: 'archived',
        archivedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      return new HttpResponse(null, { status: 204 })
    })
  }),

  // === CATALOGS ===
  http.get('/api/object-types', async () => {
    return withDelay(() => HttpResponse.json(mockObjectTypes))
  }),

  http.get('/api/work-types', async () => {
    return withDelay(() => HttpResponse.json(mockWorkTypes))
  }),

  http.get('/api/organizations', async () => {
    return withDelay(() => HttpResponse.json(mockOrganizations))
  }),

  // === RESET (для тестов) ===
  http.post('/api/__mocks__/reset', async () => {
    return withDelay(() => {
      resetMockObjects()
      return HttpResponse.json({ ok: true })
    })
  }),
]
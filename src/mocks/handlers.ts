import { http, HttpResponse, delay } from 'msw'
import type { ConstructionObject, ObjectStatus } from '@/entities/object'

import {
  SESSION_COOKIE,
  MOCK_PASSWORD,
  findMockUserByEmail,
  findMockUserById,
} from './data/auth'
import {
  mockObjects,
  mockObjectTypes,
  mockWorkTypes,
  mockCounterparties,
  resetMockObjects,
} from './data/objects'

interface ObjectWriteInput {
  code: string
  name: string
  objectTypeId: string
  workTypeIds: string[]
  address?: string
  customerOrganizationId?: string
  contractorOrganizationId?: string
  description?: string
  startDate?: string
  plannedEndDate?: string
}

type StatusTransition = Exclude<ObjectStatus, 'archived'>

const ALLOWED_TRANSITIONS: Record<ObjectStatus, StatusTransition[]> = {
  draft: ['active'],
  active: ['on_hold', 'completed'],
  on_hold: ['active', 'completed'],
  completed: [],
  archived: [],
}

const DELAY = 300

async function withDelay<T>(fn: () => T): Promise<T> {
  await delay(DELAY)
  return fn()
}

// Мок cookie-сессии: браузер игнорирует Set-Cookie из Service Worker.
// Клиент шлёт X-Mock-Session из sessionStorage; плюс module-level fallback в рамках SW.
let mockSessionUserId: string | null = null
const MOCK_SESSION_HEADER = 'X-Mock-Session'

function sessionUser(request: Request, cookies: Record<string, string>) {
  const fromHeader = request.headers.get(MOCK_SESSION_HEADER)
  const fromCookie = cookies[SESSION_COOKIE]
  return findMockUserById(fromHeader || fromCookie || mockSessionUserId || undefined)
}

const unauthorized = () => HttpResponse.json({ message: 'Unauthorized' }, { status: 401 })
const notFound = () => HttpResponse.json({ message: 'Object not found' }, { status: 404 })

function parseQuery(url: string) {
  const { searchParams } = new URL(url)
  const params: Record<string, string | string[]> = {}
  searchParams.forEach((value, key) => {
    const prev = params[key]
    if (prev !== undefined) {
      params[key] = Array.isArray(prev) ? [...prev, value] : [prev, value]
    } else {
      params[key] = value
    }
  })
  return params
}

const codeTaken = (code: string, exceptId?: string) =>
  mockObjects.some((o) => o.code.toLowerCase() === code.toLowerCase() && o.id !== exceptId)

export const handlers = [
  // === AUTH (cookie-сессия) ===
  http.post('/api/auth/login', async ({ request }) => {
    return withDelay(async () => {
      const body = (await request.json()) as { email?: string; password?: string }
      const user = findMockUserByEmail(body.email)
      if (user && body.password === MOCK_PASSWORD) {
        mockSessionUserId = user.id
        return new HttpResponse(null, {
          status: 204,
          headers: { 'Set-Cookie': `${SESSION_COOKIE}=${user.id}; Path=/; SameSite=Lax` },
        })
      }
      return HttpResponse.json({ message: 'Неверный email или пароль' }, { status: 401 })
    })
  }),

  http.post('/api/auth/logout', async () => {
    mockSessionUserId = null
    return withDelay(
      () =>
        new HttpResponse(null, {
          status: 204,
          headers: { 'Set-Cookie': `${SESSION_COOKIE}=; Path=/; Max-Age=0` },
        })
    )
  }),

  http.get('/api/auth/me', async ({ request, cookies }) => {
    const user = sessionUser(request, cookies)
    if (!user) return unauthorized()
    return withDelay(() => HttpResponse.json(user))
  }),

  // === OBJECTS ===
  http.get('/api/objects', async ({ request, cookies }) => {
    if (!sessionUser(request, cookies)) return unauthorized()

    return withDelay(() => {
      const params = parseQuery(request.url)
      let filtered = [...mockObjects]

      if (params.includeArchived !== 'true') {
        filtered = filtered.filter((o) => o.status !== 'archived')
      }

      if (params.search) {
        const search = String(params.search).toLowerCase()
        filtered = filtered.filter(
          (o) =>
            o.name.toLowerCase().includes(search) ||
            o.code.toLowerCase().includes(search) ||
            (o.address ?? '').toLowerCase().includes(search)
        )
      }

      if (params.status) {
        const statuses = Array.isArray(params.status) ? params.status : [params.status]
        filtered = filtered.filter((o) => statuses.includes(o.status))
      }

      if (params.objectTypeId) {
        filtered = filtered.filter((o) => o.objectTypeId === params.objectTypeId)
      }

      if (params.customerOrganizationId) {
        filtered = filtered.filter((o) => o.customerOrganizationId === params.customerOrganizationId)
      }

      if (params.contractorOrganizationId) {
        filtered = filtered.filter((o) => o.contractorOrganizationId === params.contractorOrganizationId)
      }

      const sortBy = String(params.sortBy || 'updatedAt')
      const sortOrder = String(params.sortOrder || 'desc')
      // Для сортировки по связям (тип/заказчик/подрядчик) используем имя связанной сущности
      const sortValue = (o: ConstructionObject): string | number | undefined => {
        switch (sortBy) {
          case 'objectTypeId': return o.objectType?.name
          case 'customerOrganizationId': return o.customerOrganization?.name
          case 'contractorOrganizationId': return o.contractorOrganization?.name
          default: return o[sortBy as keyof ConstructionObject] as string | number | undefined
        }
      }
      filtered.sort((a, b) => {
        const aVal = sortValue(a)
        const bVal = sortValue(b)
        if (aVal == null || bVal == null) return 0
        if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1
        if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1
        return 0
      })

      const page = parseInt(String(params.page || '1'))
      const limit = parseInt(String(params.limit || '20'))
      const start = (page - 1) * limit
      const paginated = filtered.slice(start, start + limit)

      return HttpResponse.json({
        data: paginated,
        total: filtered.length,
        page,
        limit,
        totalPages: Math.ceil(filtered.length / limit),
      })
    })
  }),

  http.post('/api/objects', async ({ request, cookies }) => {
    const user = sessionUser(request, cookies)
    if (!user) return unauthorized()

    return withDelay(async () => {
      const body = (await request.json()) as ObjectWriteInput
      if (codeTaken(body.code)) {
        return HttpResponse.json({ message: 'Object code already exists' }, { status: 409 })
      }
      const now = new Date().toISOString()
      const newObject: ConstructionObject = {
        id: `obj-${Date.now()}`,
        organizationId: user.membership.organizationId,
        code: body.code,
        name: body.name,
        address: body.address,
        objectTypeId: body.objectTypeId,
        customerOrganizationId: body.customerOrganizationId,
        contractorOrganizationId: body.contractorOrganizationId,
        status: 'draft',
        description: body.description,
        startDate: body.startDate,
        plannedEndDate: body.plannedEndDate,
        createdById: user.id,
        createdAt: now,
        updatedAt: now,
        workTypes: mockWorkTypes.filter((wt) => body.workTypeIds?.includes(wt.id)),
        objectType: mockObjectTypes.find((ot) => ot.id === body.objectTypeId),
        customerOrganization: mockCounterparties.find((o) => o.id === body.customerOrganizationId),
        contractorOrganization: mockCounterparties.find((o) => o.id === body.contractorOrganizationId),
      }
      mockObjects.unshift(newObject)
      return HttpResponse.json(newObject, { status: 201 })
    })
  }),

  http.get('/api/objects/:id', async ({ request, params, cookies }) => {
    if (!sessionUser(request, cookies)) return unauthorized()

    return withDelay(() => {
      const object = mockObjects.find((o) => o.id === params.id)
      return object ? HttpResponse.json(object) : notFound()
    })
  }),

  http.patch('/api/objects/:id', async ({ request, params, cookies }) => {
    if (!sessionUser(request, cookies)) return unauthorized()

    return withDelay(async () => {
      const body = (await request.json()) as Partial<ObjectWriteInput>
      const index = mockObjects.findIndex((o) => o.id === params.id)
      if (index === -1) return notFound()
      const existing = mockObjects[index]!
      if (existing.status === 'archived') {
        return HttpResponse.json({ message: 'Archived object is read-only' }, { status: 409 })
      }
      if (body.code && codeTaken(body.code, existing.id)) {
        return HttpResponse.json({ message: 'Object code already exists' }, { status: 409 })
      }
      const customerId = 'customerOrganizationId' in body ? body.customerOrganizationId : existing.customerOrganizationId
      const contractorId = 'contractorOrganizationId' in body ? body.contractorOrganizationId : existing.contractorOrganizationId
      const objectTypeId = body.objectTypeId ?? existing.objectTypeId
      const updated: ConstructionObject = {
        ...existing,
        code: body.code ?? existing.code,
        name: body.name ?? existing.name,
        address: 'address' in body ? body.address : existing.address,
        objectTypeId,
        customerOrganizationId: customerId,
        contractorOrganizationId: contractorId,
        description: 'description' in body ? body.description : existing.description,
        startDate: 'startDate' in body ? body.startDate : existing.startDate,
        plannedEndDate: 'plannedEndDate' in body ? body.plannedEndDate : existing.plannedEndDate,
        updatedAt: new Date().toISOString(),
        workTypes: body.workTypeIds
          ? mockWorkTypes.filter((wt) => body.workTypeIds!.includes(wt.id))
          : existing.workTypes,
        objectType: mockObjectTypes.find((ot) => ot.id === objectTypeId),
        customerOrganization: mockCounterparties.find((o) => o.id === customerId),
        contractorOrganization: mockCounterparties.find((o) => o.id === contractorId),
      }
      mockObjects[index] = updated
      return HttpResponse.json(updated)
    })
  }),

  http.post('/api/objects/:id/status', async ({ request, params, cookies }) => {
    if (!sessionUser(request, cookies)) return unauthorized()

    return withDelay(async () => {
      const { status } = (await request.json()) as { status: StatusTransition }
      const index = mockObjects.findIndex((o) => o.id === params.id)
      if (index === -1) return notFound()
      const existing = mockObjects[index]!
      if (!ALLOWED_TRANSITIONS[existing.status].includes(status)) {
        return HttpResponse.json({ message: 'Status transition not allowed' }, { status: 409 })
      }
      const now = new Date().toISOString()
      const updated: ConstructionObject = {
        ...existing,
        status,
        actualEndDate: status === 'completed' ? now : existing.actualEndDate,
        updatedAt: now,
      }
      mockObjects[index] = updated
      return HttpResponse.json(updated)
    })
  }),

  http.post('/api/objects/:id/archive', async ({ request, params, cookies }) => {
    const user = sessionUser(request, cookies)
    if (!user) return unauthorized()
    if (user.membership.role !== 'owner') {
      return HttpResponse.json({ message: 'Only owner can archive objects' }, { status: 403 })
    }

    return withDelay(() => {
      const index = mockObjects.findIndex((o) => o.id === params.id)
      if (index === -1) return notFound()
      const existing = mockObjects[index]!
      if (existing.status === 'archived') {
        return HttpResponse.json({ message: 'Object already archived' }, { status: 409 })
      }
      const now = new Date().toISOString()
      const updated: ConstructionObject = { ...existing, status: 'archived', archivedAt: now, updatedAt: now }
      mockObjects[index] = updated
      return HttpResponse.json(updated)
    })
  }),

  // === CATALOGS ===
  http.get('/api/object-types', async ({ request, cookies }) => {
    if (!sessionUser(request, cookies)) return unauthorized()
    return withDelay(() => HttpResponse.json(mockObjectTypes))
  }),

  http.get('/api/work-types', async ({ request, cookies }) => {
    if (!sessionUser(request, cookies)) return unauthorized()
    return withDelay(() => HttpResponse.json(mockWorkTypes))
  }),

  http.get('/api/counterparties', async ({ request, cookies }) => {
    if (!sessionUser(request, cookies)) return unauthorized()
    return withDelay(() => HttpResponse.json(mockCounterparties))
  }),

  // === RESET (для тестов) ===
  http.post('/api/__mocks__/reset', async () => {
    return withDelay(() => {
      resetMockObjects()
      return HttpResponse.json({ ok: true })
    })
  }),
]

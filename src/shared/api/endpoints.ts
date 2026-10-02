export const ENDPOINTS = {
  auth: {
    login: '/auth/login',
    logout: '/auth/logout',
    me: '/auth/me',
  },
  objects: {
    list: '/objects',
    create: '/objects',
    detail: (id: string) => `/objects/${id}`,
    update: (id: string) => `/objects/${id}`,
    status: (id: string) => `/objects/${id}/status`,
    archive: (id: string) => `/objects/${id}/archive`,
  },
  catalogs: {
    objectTypes: '/object-types',
    workTypes: '/work-types',
    counterparties: '/counterparties',
  },
} as const

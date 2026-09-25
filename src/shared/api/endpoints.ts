export const ENDPOINTS = {
  auth: {
    login: '/auth/login',
    logout: '/auth/logout',
    me: '/auth/me',
    refresh: '/auth/refresh',
  },
  objects: {
    list: '/objects',
    create: '/objects',
    detail: (id: string) => `/objects/${id}`,
    update: (id: string) => `/objects/${id}`,
    delete: (id: string) => `/objects/${id}`,
  },
  catalogs: {
    objectTypes: '/object-types',
    workTypes: '/work-types',
    organizations: '/organizations',
  },
} as const
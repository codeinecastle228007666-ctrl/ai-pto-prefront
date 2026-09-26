import { create } from 'zustand'
import type { ObjectListParams, ObjectStatus } from '@/entities/object'

export interface ObjectsFiltersState extends ObjectListParams {
  search: string
  status: ObjectStatus[]
}

interface ObjectsState {
  filters: ObjectsFiltersState
  setFilters: (filters: Partial<ObjectsFiltersState>) => void
  resetFilters: () => void
}

export const DEFAULT_OBJECT_FILTERS: ObjectsFiltersState = {
  search: '',
  status: [],
  page: 1,
  limit: 20,
  sortBy: 'updatedAt',
  sortOrder: 'desc',
}

export const useObjectsStore = create<ObjectsState>((set) => ({
  filters: DEFAULT_OBJECT_FILTERS,

  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters, ...(newFilters.page ? {} : { page: 1 }) }, // сброс страницы при изменении фильтров
    })),

  resetFilters: () => set({ filters: DEFAULT_OBJECT_FILTERS }),
}))

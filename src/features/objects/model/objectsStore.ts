import { create } from 'zustand'
import type { ObjectListParams, ObjectStatus } from '@/entities/object/types'

interface ObjectsFilters extends ObjectListParams {
  search: string
  status: ObjectStatus[]
}

interface ObjectsState {
  filters: ObjectsFilters
  selectedObjectId: string | null
  viewMode: 'table' | 'cards'
  setFilters: (filters: Partial<ObjectsFilters>) => void
  resetFilters: () => void
  setSelectedObject: (id: string | null) => void
  setViewMode: (mode: 'table' | 'cards') => void
}

const defaultFilters: ObjectsFilters = {
  search: '',
  status: [],
  page: 1,
  limit: 20,
  sortBy: 'updatedAt',
  sortOrder: 'desc',
}

export const useObjectsStore = create<ObjectsState>((set) => ({
  filters: defaultFilters,
  selectedObjectId: null,
  viewMode: 'table',

  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters, page: 1 }, // сброс страницы при изменении фильтров
    })),

  resetFilters: () => set({ filters: defaultFilters }),

  setSelectedObject: (id) => set({ selectedObjectId: id }),

  setViewMode: (mode) => set({ viewMode: mode }),
}))
import { useQuery, useMutation, useQueryClient, type UseQueryOptions, type UseMutationOptions } from '@tanstack/react-query'
import api from './client'
import { AxiosError } from 'axios'
import { ENDPOINTS } from './endpoints'

type ApiError = AxiosError<{ message: string }>

// Обёртка для useQuery с типизацией ошибки
export function useApiQuery<T>(
  key: readonly unknown[],
  fetcher: () => Promise<T>,
  options?: Omit<UseQueryOptions<T, ApiError>, 'queryKey' | 'queryFn'>
) {
  return useQuery<T, ApiError>({
    queryKey: key,
    queryFn: fetcher,
    ...options,
  })
}

// Обёртка для useMutation
export function useApiMutation<TData, TVariables>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: Omit<UseMutationOptions<TData, ApiError, TVariables>, 'mutationFn'>
) {
  const queryClient = useQueryClient()
  return useMutation<TData, ApiError, TVariables>({
    mutationFn,
    onSuccess: (...args) => options?.onSuccess?.(...args),
    onError: (...args) => options?.onError?.(...args),
    onSettled: (...args) => {
      options?.onSettled?.(...args)
      // По умолчанию инвалидируем связанные запросы
    },
  })
}

// Хелперы для инвалидации
export const queryKeys = {
  auth: {
    me: ['auth', 'me'] as const,
  },
  objects: {
    all: ['objects'] as const,
    list: (filters?: unknown) => ['objects', 'list', filters] as const,
    detail: (id: string) => ['objects', 'detail', id] as const,
  },
  catalogs: {
    objectTypes: ['catalogs', 'objectTypes'] as const,
    workTypes: ['catalogs', 'workTypes'] as const,
    organizations: ['catalogs', 'organizations'] as const,
  },
}

export function invalidateObjects(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: queryKeys.objects.all })
}
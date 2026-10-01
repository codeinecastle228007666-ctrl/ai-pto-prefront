import axios, { type AxiosRequestConfig } from 'axios'

/**
 * Мутатор для кода, сгенерированного orval.
 * Cookie-сессия через withCredentials, без Bearer в localStorage.
 */
const orvalApi = axios.create({
  baseURL: '/api',
  withCredentials: true,
})

export const orvalInstance = <T>(config: AxiosRequestConfig): Promise<T> =>
  orvalApi.request<T>(config).then(({ data }) => data)

export default orvalInstance

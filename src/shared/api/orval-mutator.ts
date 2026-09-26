import axios, { type AxiosRequestConfig, type InternalAxiosRequestConfig } from 'axios'

/**
 * Мутатор для кода, сгенерированного orval.
 *
 * Самодостаточный axios-инстанс (orval бандлит этот файл через esbuild,
 * поэтому импорт `./client` с `import.meta.env` здесь невозможен):
 * baseURL `/api`, Bearer-токен из localStorage, withCredentials.
 * Возвращает только `data` ответа — так ожидает orval.
 */
const orvalApi = axios.create({
  baseURL: '/api',
  withCredentials: true,
})

orvalApi.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = localStorage.getItem('accessToken')
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

export const orvalInstance = <T>(config: AxiosRequestConfig): Promise<T> =>
  orvalApi.request<T>(config).then(({ data }) => data)

export default orvalInstance

import axios, { type AxiosRequestConfig, type InternalAxiosRequestConfig } from 'axios'

/**
 * Мутатор для кода, сгенерированного orval (см. orval.config.ts).
 *
 * Самодостаточный axios-инстанс: orval бандлит этот файл через esbuild,
 * поэтому здесь нельзя импортировать `./client` (он использует
 * `import.meta.env`, недоступный при бандлинге конфига).
 *
 * Повторяет поведение основного клиента:
 * - baseURL `/api` (совпадает с путями openapi.yaml и MSW-моками `/api/...`);
 * - Bearer-токен из localStorage;
 * - withCredentials для HttpOnly cookies.
 *
 * Refresh токена при 401 пока обрабатывает основной клиент (client.ts);
 * при переносе flows на генерированный слой сюда добавляется тот же
 * response-интерсептор.
 *
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
  (error) => Promise.reject(error)
)

export const orvalInstance = <T>(config: AxiosRequestConfig): Promise<T> =>
  orvalApi.request<T>(config).then(({ data }) => data)

export default orvalInstance

/** Mirror mock-сессии: браузер игнорирует Set-Cookie из Service Worker. */
export const MOCK_SESSION_STORAGE_KEY = 'pto_mock_session'
export const MOCK_SESSION_HEADER = 'X-Mock-Session'

export function isMockMode(): boolean {
  return import.meta.env.VITE_USE_MOCKS === 'true'
}

export function getMockSessionId(): string | null {
  if (!isMockMode() || typeof sessionStorage === 'undefined') return null
  return sessionStorage.getItem(MOCK_SESSION_STORAGE_KEY)
}

export function setMockSessionId(userId: string): void {
  if (!isMockMode() || typeof sessionStorage === 'undefined') return
  sessionStorage.setItem(MOCK_SESSION_STORAGE_KEY, userId)
}

export function clearMockSessionId(): void {
  if (!isMockMode() || typeof sessionStorage === 'undefined') return
  sessionStorage.removeItem(MOCK_SESSION_STORAGE_KEY)
}

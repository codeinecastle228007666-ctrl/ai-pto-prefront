/** Публичное демо включается только при явном VITE_PUBLIC_DEMO_ENABLED=true (build-time). */
export function isPublicDemoEnabled(): boolean {
  return import.meta.env.VITE_PUBLIC_DEMO_ENABLED === 'true'
}

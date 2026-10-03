import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { TooltipProvider } from '@/shared'
import { Layout } from '@/widgets'
import { useAuthStore } from '@/features/auth'
import { ProtectedRoute } from './ProtectedRoute'
import { LoginPage } from '@/pages/login'
import { DashboardPage } from '@/pages/dashboard'
import { ObjectsPage } from '@/pages/objects'
import { ObjectDetailPage } from '@/pages/object-detail'
import { ObjectEditPage } from '@/pages/object-edit'
import { ObjectCreatePage } from '@/pages/object-new'
import { ProfilePage } from '@/pages/profile'
import { LandingPage } from '@/pages/landing'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 минут
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

/** Публичный лендинг; с живой сессией — в кабинет на `/`. */
function WelcomeRoute() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  if (isAuthenticated) return <Navigate to="/" replace />
  return <LandingPage />
}

export function AppRouter() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/welcome" element={<WelcomeRoute />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/dashboard" element={<Navigate to="/" replace />} />
            <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/objects" element={<ObjectsPage />} />
              <Route path="/objects/new" element={<ObjectCreatePage />} />
              <Route path="/objects/:id" element={<ObjectDetailPage />} />
              <Route path="/objects/:id/edit" element={<ObjectEditPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
        <ReactQueryDevtools initialIsOpen={false} />
      </TooltipProvider>
    </QueryClientProvider>
  )
}

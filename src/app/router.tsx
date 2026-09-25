import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { TooltipProvider } from '@/shared/ui/Tooltip'
import { Layout } from '@/widgets'
import { ProtectedRoute } from './ProtectedRoute'
import { LoginPage } from '@/pages/LoginPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { ObjectsPage } from '@/pages/ObjectsPage'
import { ObjectDetailPage } from '@/pages/ObjectDetailPage'
import { ProfilePage } from '@/pages/ProfilePage'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 минут
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

export function AppRouter() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/objects" element={<ObjectsPage />} />
              <Route path="/objects/:id" element={<ObjectDetailPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route index element={<Navigate to="/dashboard" replace />} />
            </Route>
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
        <ReactQueryDevtools initialIsOpen={false} />
      </TooltipProvider>
    </QueryClientProvider>
  )
}

import { Navigate } from 'react-router-dom'
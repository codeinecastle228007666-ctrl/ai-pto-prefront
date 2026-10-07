import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { TooltipProvider } from '@/shared'
import { Layout } from '@/widgets'
import { ProtectedRoute } from './ProtectedRoute'
import { LoginPage } from '@/pages/login'
import { DashboardPage } from '@/pages/dashboard'
import { ObjectsPage } from '@/pages/objects'
import { ObjectDetailPage } from '@/pages/object-detail'
import { ObjectEditPage } from '@/pages/object-edit'
import { ObjectCreatePage } from '@/pages/object-new'
import { UploadPage } from '@/pages/upload'
import { PackagePage } from '@/pages/package'

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
            <Route path="/" element={<Navigate to="/objects" replace />} />
            <Route path="/login" element={<LoginPage />} />
            <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/objects" element={<ObjectsPage />} />
              <Route path="/objects/new" element={<ObjectCreatePage />} />
              <Route path="/objects/:id" element={<ObjectDetailPage />} />
              <Route path="/objects/:id/edit" element={<ObjectEditPage />} />
              <Route path="/objects/:id/upload" element={<UploadPage />} />
              <Route path="/objects/:id/packages/:packageId" element={<PackagePage />} />
            </Route>
            <Route path="*" element={<Navigate to="/objects" replace />} />
          </Routes>
        </BrowserRouter>
        <ReactQueryDevtools initialIsOpen={false} />
      </TooltipProvider>
    </QueryClientProvider>
  )
}

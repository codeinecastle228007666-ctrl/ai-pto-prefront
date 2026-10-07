import { Outlet } from 'react-router-dom'
import { Header } from '@/widgets/header'

export function Layout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex flex-col min-h-screen min-w-0">
        <Header />
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

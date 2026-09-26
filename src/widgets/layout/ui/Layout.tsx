import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { X } from 'lucide-react'
import { Sheet, SheetContent, cn } from '@/shared'
import { Sidebar } from '@/widgets/sidebar'
import { Header } from '@/widgets/header'

export function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="lg:pl-64 flex flex-col min-h-screen">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>

      {/* Mobile sidebar sheet */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
            <span className="text-xl font-bold text-primary-600">AI-ПТО</span>
            <button onClick={() => setSidebarOpen(false)} className="p-1 rounded hover:bg-gray-100" aria-label="Закрыть меню">
              <X className="h-5 w-5" />
            </button>
          </div>
          <Sidebar />
        </SheetContent>
      </Sheet>
    </div>
  )
}

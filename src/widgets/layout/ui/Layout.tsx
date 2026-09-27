import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { X } from 'lucide-react'
import { Sheet, SheetContent, Button } from '@/shared'
import { Sidebar } from '@/widgets/sidebar'
import { Header } from '@/widgets/header'

export function Layout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar collapsed={sidebarCollapsed} />
      <div
        className={
          sidebarCollapsed
            ? 'lg:pl-16 flex flex-col min-h-screen transition-[padding] duration-300'
            : 'lg:pl-64 flex flex-col min-h-screen transition-[padding] duration-300'
        }
      >
        <Header
          onMenuClick={() => setMobileOpen(true)}
          onToggleSidebar={() => setSidebarCollapsed((prev) => !prev)}
          sidebarCollapsed={sidebarCollapsed}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>

      {/* Мобильный сайдбар (оверлей, только < lg) */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
            <span className="text-xl font-bold text-primary-600">AI-ПТО</span>
            <Button variant="ghost" size="icon" onClick={() => setMobileOpen(false)} aria-label="Закрыть меню">
              <X className="h-5 w-5" />
            </Button>
          </div>
          <div className="h-[calc(100%-4rem)]">
            <Sidebar embedded collapsed={false} />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}

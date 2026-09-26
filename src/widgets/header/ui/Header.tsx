import { Bell, Search, Menu } from 'lucide-react'
import { Button, Input } from '@/shared'
import { useAuthStore } from '@/features/auth'

interface HeaderProps {
  onMenuClick?: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  const user = useAuthStore((state) => state.user)

  return (
    <header className="sticky top-0 z-40 h-16 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 border-b border-gray-200">
      <div className="flex h-full items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenuClick} aria-label="Открыть меню">
            <Menu className="h-5 w-5" />
          </Button>
          <div className="hidden sm:block relative w-72 max-w-[300px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" aria-hidden="true" />
            <Input placeholder="Поиск..." className="pl-10 h-9 text-sm" aria-label="Поиск" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          {user && <span className="hidden md:block text-sm text-gray-500">{user.name}</span>}
          <Button variant="ghost" size="icon" className="relative" aria-label="Уведомления">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
              3
            </span>
          </Button>
        </div>
      </div>
    </header>
  )
}

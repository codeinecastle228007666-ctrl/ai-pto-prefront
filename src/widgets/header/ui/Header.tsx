import { Bell, Menu } from 'lucide-react'
import { Button } from '@/shared'
import { useAuthStore } from '@/features/auth'

interface HeaderProps {
  onMenuClick?: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  const user = useAuthStore((state) => state.user)

  return (
    <header className="sticky top-0 z-40 h-14 sm:h-16 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 border-b border-gray-200">
      <div className="flex h-full items-center justify-between px-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-1 min-w-0">
          <Button variant="ghost" size="icon" className="lg:hidden shrink-0" onClick={onMenuClick} aria-label="Открыть меню">
            <Menu className="h-5 w-5" />
          </Button>
          <span className="lg:hidden text-base font-bold text-primary-600 truncate">AI-ПТО</span>
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          {user && <span className="hidden md:block text-sm text-gray-500 truncate max-w-[12rem]">{user.name}</span>}
          <Button variant="ghost" size="icon" className="relative shrink-0" aria-label="Уведомления">
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

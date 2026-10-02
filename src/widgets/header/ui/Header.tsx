import { LogOut, Menu } from 'lucide-react'
import { Button } from '@/shared'
import { useUser, useLogout } from '@/features/auth'

interface HeaderProps {
  onMenuClick?: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  const user = useUser()
  const logoutMutation = useLogout()

  return (
    <header className="sticky top-0 z-40 h-14 sm:h-16 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 border-b border-gray-200">
      <div className="flex h-full items-center justify-between px-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-1 min-w-0">
          <Button variant="ghost" size="icon" className="lg:hidden shrink-0" onClick={onMenuClick} aria-label="Открыть меню">
            <Menu className="h-5 w-5" />
          </Button>
          <span className="lg:hidden text-base font-bold text-primary-600 truncate">ПТО-Doc</span>
        </div>
        <div className="flex items-center gap-1 sm:gap-2 min-w-0">
          {user && <span className="hidden md:block text-sm text-gray-500 truncate max-w-[16rem]">{user.email}</span>}
          <Button
            variant="ghost"
            size="sm"
            className="shrink-0"
            onClick={() => logoutMutation.mutate()}
            disabled={logoutMutation.isPending}
            aria-label="Выйти"
          >
            <LogOut className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Выйти</span>
          </Button>
        </div>
      </div>
    </header>
  )
}

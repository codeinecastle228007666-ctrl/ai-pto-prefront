import { cn } from '@/shared/lib/utils'
import { LayoutDashboard, FolderKanban, FileText, AlertTriangle, ClipboardCheck, FileBarChart, Settings, LogOut, User, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/shared/ui/Button'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/Avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/shared/ui/DropdownMenu'
import { useAuthStore } from '@/features/auth/model/authStore'
import { useNavigate, useLocation } from 'react-router-dom'

const navigation = [
  { name: 'Обзор', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Объекты', href: '/objects', icon: FolderKanban },
  { name: 'Документы', href: '/documents', icon: FileText, disabled: true },
  { name: 'Замечания', href: '/findings', icon: AlertTriangle, disabled: true },
  { name: 'Комплектность', href: '/checklist', icon: ClipboardCheck, disabled: true },
  { name: 'Отчёты', href: '/reports', icon: FileBarChart, disabled: true },
]

export function Sidebar() {
  const user = useAuthStore((state) => state.user)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const clearAuth = useAuthStore((state) => state.clearAuth)
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    clearAuth()
    navigate('/login')
  }

  if (!isAuthenticated) return null

  return (
    <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 flex flex-col transition-all duration-200">
      <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200">
        <span className="text-xl font-bold text-primary-600">AI-ПТО</span>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href || (item.href !== '/dashboard' && location.pathname.startsWith(item.href))
          return (
            <Button
              key={item.name}
              variant={isActive ? 'default' : 'ghost'}
              className={cn('w-full justify-start gap-3', isActive && 'bg-primary-50 text-primary-700')}
              onClick={() => !item.disabled && navigate(item.href)}
              disabled={item.disabled}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
              <span>{item.name}</span>
              {item.disabled && <span className="ml-auto text-xs text-gray-400">Скоро</span>}
            </Button>
          )
        })}
      </nav>
      <div className="p-4 border-t border-gray-200">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-start gap-3 h-auto py-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.name ? `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=22c55e&color=fff` : ''} alt={user?.name || ''} />
                <AvatarFallback>{user?.name?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
              </Avatar>
              <div className="text-left flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{user?.name || 'Пользователь'}</p>
                <p className="text-xs text-gray-500 truncate">{user?.organization?.name || 'Организация'}</p>
              </div>
              <ChevronRight className="h-4 w-4 flex-shrink-0 text-gray-400" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem className="px-3 py-1.5 text-sm" inset>
              <User className="h-4 w-4 mr-2" />
              Профиль
            </DropdownMenuItem>
            <DropdownMenuItem className="px-3 py-1.5 text-sm" inset>
              <Settings className="h-4 w-4 mr-2" />
              Настройки
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="px-3 py-1.5 text-sm text-red-600 focus:text-red-600" inset onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Выйти
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  )
}
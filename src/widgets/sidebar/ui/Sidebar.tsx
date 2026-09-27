import { LayoutDashboard, FolderKanban, FileText, AlertTriangle, ClipboardCheck, FileBarChart, Settings, LogOut, User, ChevronsUpDown, PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore, useLogout } from '@/features/auth'
import { Avatar, AvatarFallback, Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, Tooltip, TooltipContent, TooltipTrigger, cn } from '@/shared'

const navigation = [
  { name: 'Обзор', href: '/dashboard', icon: LayoutDashboard, disabled: false },
  { name: 'Объекты', href: '/objects', icon: FolderKanban, disabled: false },
  { name: 'Документы', href: '/documents', icon: FileText, disabled: true },
  { name: 'Замечания', href: '/findings', icon: AlertTriangle, disabled: true },
  { name: 'Комплектность', href: '/checklist', icon: ClipboardCheck, disabled: true },
  { name: 'Отчёты', href: '/reports', icon: FileBarChart, disabled: true },
]

interface SidebarProps {
  collapsed?: boolean
  /** true — рендер внутри мобильного Sheet (относительное позиционирование вместо fixed) */
  embedded?: boolean
  /** Колбэк переключения сворачивания (кнопка рядом с логотипом) */
  onToggle?: () => void
}

export function Sidebar({ collapsed = false, embedded = false, onToggle }: SidebarProps) {
  const user = useAuthStore((state) => state.user)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const navigate = useNavigate()
  const location = useLocation()
  const logoutMutation = useLogout()

  if (!isAuthenticated) return null

  const ToggleIcon = collapsed ? PanelLeftOpen : PanelLeftClose

  return (
    <aside
      className={cn(
        'inset-y-0 left-0 z-50 flex flex-col bg-white border-r border-gray-200 transition-[width] duration-300 overflow-hidden',
        embedded ? 'relative h-full flex' : 'fixed hidden lg:flex',
        collapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* Шапка: логотип + кнопка сворачивания рядом. Одинаковая структура в обоих состояниях — без прыжков */}
      <div className="flex h-16 flex-shrink-0 items-center gap-2 border-b border-gray-200 px-3">
        <Link
          to="/dashboard"
          aria-label="На главную"
          className="shrink-0 whitespace-nowrap font-bold text-xl leading-none text-primary-600"
        >
          <span className={cn('inline-block', collapsed ? 'w-6 overflow-hidden' : 'w-auto')}>
            {collapsed ? 'AI' : 'AI-ПТО'}
          </span>
        </Link>
        {!collapsed && <div className="flex-1" />}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0 text-gray-500 hover:text-gray-900"
          onClick={onToggle}
          aria-label={collapsed ? 'Развернуть сайдбар' : 'Свернуть сайдбар'}
        >
          <ToggleIcon className="h-5 w-5" />
        </Button>
      </div>
      <nav className={cn('flex-1 py-4 space-y-1 overflow-y-auto scrollbar-thin', collapsed ? 'px-2.5' : 'px-3')}>
        {navigation.map((item) => {
          const isActive = location.pathname === item.href || (item.href !== '/dashboard' && location.pathname.startsWith(item.href))
          const button = (
            <Button
              key={item.name}
              variant="ghost"
              aria-label={item.name}
              className={cn(
                'w-full justify-start gap-3',
                collapsed && 'justify-center px-0',
                isActive
                  ? 'bg-primary-50 text-primary-700 hover:bg-primary-100 hover:text-primary-800'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              )}
              onClick={() => !item.disabled && navigate(item.href)}
              disabled={item.disabled}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
              {!collapsed && <span>{item.name}</span>}
              {!collapsed && item.disabled && <span className="ml-auto text-xs text-gray-400">Скоро</span>}
            </Button>
          )

          if (!collapsed) return button

          return (
            <Tooltip key={item.name}>
              <TooltipTrigger asChild>{button}</TooltipTrigger>
              <TooltipContent side="right">{item.name}{item.disabled ? ' (скоро)' : ''}</TooltipContent>
            </Tooltip>
          )
        })}
      </nav>
      <div className={cn('border-t border-gray-200', collapsed ? 'p-2' : 'p-4')}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            {collapsed ? (
              <Button variant="ghost" className="w-full justify-center p-0 h-10" aria-label="Меню пользователя">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary-600 text-white">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            ) : (
              <Button variant="ghost" className="w-full justify-start gap-3 h-auto py-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary-600 text-white">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="text-left flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{user?.name || 'Пользователь'}</p>
                  <p className="text-xs text-gray-500 truncate">{user?.organization?.name || user?.membership?.organizationId || 'Организация'}</p>
                </div>
                <ChevronsUpDown className="h-4 w-4 flex-shrink-0 text-gray-400" />
              </Button>
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side={collapsed ? 'right' : 'bottom'}
            align={collapsed ? 'start' : 'end'}
            className="w-56"
          >
            <DropdownMenuItem className="px-3 py-1.5 text-sm cursor-pointer" onClick={() => navigate('/profile')}>
              <User className="h-4 w-4 mr-2" />
              Профиль
            </DropdownMenuItem>
            <DropdownMenuItem className="px-3 py-1.5 text-sm cursor-pointer" onClick={() => navigate('/profile')}>
              <Settings className="h-4 w-4 mr-2" />
              Настройки
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="px-3 py-1.5 text-sm text-red-600 focus:text-red-600 cursor-pointer"
              onClick={() => logoutMutation.mutate()}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Выйти
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  )
}

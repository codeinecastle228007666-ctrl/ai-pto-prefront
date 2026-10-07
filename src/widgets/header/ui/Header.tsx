import { Link, NavLink } from 'react-router-dom'
import { cn } from '@/shared'
import logo from '@/assets/logo-pto-doc.jpg'

export function Header() {
  return (
    <header className="sticky top-0 z-40 h-14 sm:h-16 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 border-b border-gray-200">
      <div className="flex h-full items-center gap-4 sm:gap-6 px-3 sm:px-6 lg:px-8">
        <Link to="/objects" aria-label="ПТО-Doc — объекты" className="flex items-center gap-2 shrink-0 min-w-0">
          <span className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center overflow-hidden rounded-lg bg-white shadow-sm">
            <img src={logo} alt="" className="h-full w-full scale-125 object-cover" />
          </span>
          <span className="text-base sm:text-xl font-bold text-primary-600 truncate">ПТО-Doc</span>
        </Link>
        <nav className="flex items-center gap-1 min-w-0">
          <NavLink
            to="/objects"
            className={({ isActive }) =>
              cn(
                'rounded-md px-2.5 py-1.5 text-sm font-medium transition-colors',
                isActive ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              )
            }
          >
            Объекты
          </NavLink>
        </nav>
      </div>
    </header>
  )
}

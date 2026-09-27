import { useState } from 'react'
import { Search } from 'lucide-react'
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Button,
  Input,
  cn,
} from '@/shared'

export interface ColumnFilterOption {
  value: string
  label: string
}

interface ColumnFilterPopupProps {
  /** Метка фильтра (текст заголовка) */
  label: string
  /** Активен ли фильтр сейчас (подсветка заголовка) */
  active: boolean
  options: ColumnFilterOption[]
  /** Текущее применённое значение(я) */
  value: string[]
  /** Множественный выбор (чекбоксы) вместо радио */
  multi?: boolean
  /** Колбэк применения: получает выбранные значения */
  onApply: (values: string[]) => void
  /** Контент под строкой поиска (опционально, напр. чекбоксы) */
  children?: (filteredOptions: ColumnFilterOption[]) => React.ReactNode
}

/**
 * Маленькое окно фильтра в заголовке столбца:
 * поле поиска + список опций + кнопки «Применить» и «Сбросить».
 * Позиция окна — под кнопкой фильтра, кнопка фильтра остаётся на месте.
 */
export function ColumnFilterPopup({
  label,
  active,
  options,
  value,
  multi = false,
  onApply,
  children,
}: ColumnFilterPopupProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<string[]>(value)

  // При открытии окна — синхронизируем черновик с применённым значением (на событии, без эффекта)
  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      setSelected(value)
      setSearch('')
    }
    setOpen(nextOpen)
  }

  const filtered = options.filter((o) =>
    o.label.toLowerCase().includes(search.toLowerCase())
  )

  const toggle = (val: string) => {
    if (multi) {
      setSelected((prev) =>
        prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val]
      )
    } else {
      setSelected([val])
    }
  }

  const handleApply = () => {
    onApply(selected)
    setOpen(false)
  }

  const handleReset = () => {
    setSelected([])
    onApply([])
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            'flex items-center gap-1.5 rounded-md px-1 py-0.5 -mx-1 transition-colors hover:text-gray-900',
            active ? 'text-primary-600' : ''
          )}
          aria-label={`Фильтр: ${label}`}
        >
          <span>{label}</span>
          <Search className="h-3.5 w-3.5 opacity-60" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-60 p-3">
        <div className="relative mb-2">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск..."
            className="h-8 pl-8 text-sm"
          />
        </div>

        <div className="max-h-48 overflow-y-auto scrollbar-thin -mx-1 px-1">
          {filtered.length === 0 ? (
            <p className="py-4 text-center text-sm text-gray-400">Ничего не найдено</p>
          ) : children ? (
            children(filtered)
          ) : (
            filtered.map((option) => {
              const checked = selected.includes(option.value)
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => toggle(option.value)}
                  className={cn(
                    'flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-left transition-colors hover:bg-gray-100',
                    checked && 'bg-primary-50 text-primary-700'
                  )}
                >
                  <span
                    className={cn(
                      'flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border',
                      checked ? 'border-primary-600' : 'border-gray-300'
                    )}
                  >
                    {checked && <span className="h-2 w-2 rounded-full bg-primary-600" />}
                  </span>
                  <span className="truncate">{option.label}</span>
                </button>
              )
            })
          )}
        </div>

        <div className="mt-3 flex items-center justify-between gap-2 border-t border-gray-100 pt-2.5">
          <Button variant="ghost" size="sm" className="h-8 px-2.5 text-sm" onClick={handleReset}>
            Сбросить
          </Button>
          <Button size="sm" className="h-8 px-3 text-sm" onClick={handleApply}>
            Применить
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

import { Plus } from 'lucide-react'
import { Button } from '@/shared'

export function ObjectsPageHeader({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Строительные объекты</h1>
        <p className="text-gray-500 mt-1">Управление объектами и пакетами проверки</p>
      </div>
      <Button onClick={onCreate}>
        <Plus className="h-4 w-4 mr-2" />
        Создать объект
      </Button>
    </div>
  )
}

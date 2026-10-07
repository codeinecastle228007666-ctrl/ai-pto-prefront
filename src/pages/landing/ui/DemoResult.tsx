import { AlertTriangle, Download, Info } from 'lucide-react'
import { Alert, AlertDescription, Button } from '@/shared'
import type { DemoCheckResult } from '../model/demoApi'

interface DemoResultProps {
  result: DemoCheckResult
  onAgain: () => void
  onSave: () => void
}

export function DemoResult({ result, onAgain, onSave }: DemoResultProps) {
  return (
    <div className="space-y-6">
      {result.mock && (
        <Alert>
          <AlertDescription>
            Показан демо-результат интерфейса: API <code className="text-xs">/public/demo/check</code>{' '}
            ещё не ответил. Когда бэкенд будет готов, здесь появятся живые замечания.
          </AlertDescription>
        </Alert>
      )}

      <div className="rounded-lg border border-gray-200 bg-white">
        <div className="border-b border-gray-100 px-5 py-4">
          <h3 className="text-lg font-semibold text-gray-900">Замечания</h3>
          <p className="text-sm text-gray-500">Найдено: {result.findings.length}</p>
        </div>
        <ul className="divide-y divide-gray-100">
          {result.findings.length === 0 ? (
            <li className="px-5 py-8 text-center text-sm text-gray-500">Замечаний нет</li>
          ) : (
            result.findings.map((f) => (
              <li key={f.id} className="flex gap-3 px-5 py-4">
                <AlertTriangle
                  className={
                    f.severity === 'error'
                      ? 'mt-0.5 h-5 w-5 shrink-0 text-red-500'
                      : 'mt-0.5 h-5 w-5 shrink-0 text-amber-500'
                  }
                />
                <div className="min-w-0">
                  <p className="font-medium text-gray-900">{f.title}</p>
                  {(f.page != null || f.quote) && (
                    <p className="mt-1 text-sm text-gray-500">
                      {f.page != null ? `стр. ${f.page}` : null}
                      {f.page != null && f.quote ? ' · ' : null}
                      {f.quote}
                    </p>
                  )}
                </div>
              </li>
            ))
          )}
        </ul>
      </div>

      <div className="flex gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
        <Info className="mt-0.5 h-4 w-4 shrink-0" />
        <p>{result.disclaimer}</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        {result.reportUrl ? (
          <Button type="button" variant="outline" asChild>
            <a href={result.reportUrl} target="_blank" rel="noreferrer">
              <Download className="mr-2 h-4 w-4" />
              Скачать отчёт
            </a>
          </Button>
        ) : (
          <Button type="button" variant="outline" disabled>
            <Download className="mr-2 h-4 w-4" />
            Скачать отчёт
          </Button>
        )}
        <Button type="button" variant="outline" onClick={onAgain}>
          Проверить ещё раз
        </Button>
        <Button type="button" onClick={onSave}>
          Сохранить / проверить весь объект
        </Button>
      </div>
    </div>
  )
}

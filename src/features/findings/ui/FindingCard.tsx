import { BookOpen, Check, CheckCheck, RotateCcw, X } from 'lucide-react'
import { Badge, Button, cn } from '@/shared'
import { FINDING_STATUS_LABELS, SEVERITY_LABELS, type Finding, type FindingStatus } from '@/entities/finding'
import { SEVERITY_STYLES } from '../model/severityStyles'

interface FindingCardProps {
  finding: Finding
  selected: boolean
  /** Подпись документа — показываем, когда в списке замечания всего пакета */
  documentName?: string
  pending?: boolean
  onSelect: () => void
  onDecide: (status: FindingStatus) => void
  onDismiss: () => void
}

export function FindingCard({ finding, selected, documentName, pending, onSelect, onDecide, onDismiss }: FindingCardProps) {
  const styles = SEVERITY_STYLES[finding.severity]
  const quote = finding.sources.find((s) => s.quote)?.quote
  const decided = finding.status !== 'open'

  return (
    <li
      className={cn(
        'rounded-md border border-l-4 bg-white',
        styles.card,
        selected ? 'border-gray-300 shadow-sm ring-1 ring-primary-200' : 'border-gray-200',
        decided && 'opacity-75'
      )}
    >
      <button
        type="button"
        onClick={onSelect}
        aria-expanded={selected}
        className="block w-full px-3 py-2 text-left"
      >
        <div className="mb-1 flex flex-wrap items-center gap-2 text-xs">
          <span className={cn('rounded border px-1.5 py-0.5 font-medium', styles.chip)}>
            {SEVERITY_LABELS[finding.severity]}
          </span>
          {decided && <Badge variant="secondary">{FINDING_STATUS_LABELS[finding.status]}</Badge>}
          {documentName && <span className="truncate text-gray-500">{documentName}</span>}
        </div>
        <p className="text-sm text-gray-900">{finding.message}</p>
      </button>

      {selected && (
        <div className="space-y-3 border-t border-gray-100 px-3 py-3 text-sm">
          {finding.explanation && <p className="text-gray-700">{finding.explanation}</p>}

          {(finding.expected || finding.actual) && (
            <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1">
              {finding.expected && (
                <>
                  <dt className="text-gray-500">Ожидалось</dt>
                  <dd className="text-gray-900">{finding.expected}</dd>
                </>
              )}
              {finding.actual && (
                <>
                  <dt className="text-gray-500">Найдено</dt>
                  <dd className="text-gray-900">{finding.actual}</dd>
                </>
              )}
            </dl>
          )}

          {quote && <blockquote className="border-l-2 border-gray-300 pl-3 text-gray-600 italic">«{quote}»</blockquote>}

          {finding.normRef && (
            <p className="flex items-start gap-2 text-gray-600">
              <BookOpen className="mt-0.5 h-4 w-4 shrink-0" />
              {finding.normRef.url ? (
                <a href={finding.normRef.url} target="_blank" rel="noreferrer" className="text-primary-600 hover:underline">
                  {finding.normRef.doc}, {finding.normRef.clause}
                </a>
              ) : (
                <span>
                  {finding.normRef.doc}, {finding.normRef.clause}
                </span>
              )}
            </p>
          )}

          {finding.comment && (
            <p className="rounded bg-gray-50 px-2 py-1.5 text-gray-700">
              <span className="text-gray-500">Комментарий: </span>
              {finding.comment}
            </p>
          )}

          <div className="flex flex-wrap gap-2">
            {finding.status === 'open' ? (
              <>
                <Button size="sm" disabled={pending} onClick={() => onDecide('accepted')}>
                  <Check className="h-4 w-4 mr-1.5" />
                  Принять
                </Button>
                <Button size="sm" variant="outline" disabled={pending} onClick={() => onDecide('fixed')}>
                  <CheckCheck className="h-4 w-4 mr-1.5" />
                  Исправлено
                </Button>
                <Button size="sm" variant="outline" disabled={pending} onClick={onDismiss}>
                  <X className="h-4 w-4 mr-1.5" />
                  Отклонить
                </Button>
              </>
            ) : (
              <Button size="sm" variant="outline" disabled={pending} onClick={() => onDecide('open')}>
                <RotateCcw className="h-4 w-4 mr-1.5" />
                Вернуть в открытые
              </Button>
            )}
          </div>
        </div>
      )}
    </li>
  )
}

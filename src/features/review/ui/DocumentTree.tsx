import { useState } from 'react'
import { ChevronDown, ChevronRight, FileText, Folder, Package as PackageIcon } from 'lucide-react'
import { cn } from '@/shared'
import { DOCUMENT_STATUS_CONFIG, PackageStatusBadge, type PackageDetail } from '@/entities/package'
import { groupDocumentsByType } from '../model/groupDocuments'

interface DocumentTreeProps {
  pkg: PackageDetail
  selectedId?: string
  onSelect: (documentId: string) => void
}

/** Дерево: пакет → группы по типу документа → файлы. */
export function DocumentTree({ pkg, selectedId, onSelect }: DocumentTreeProps) {
  const groups = groupDocumentsByType(pkg.documents)
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})

  return (
    <nav aria-label="Документы пакета" className="text-sm">
      <div className="flex items-center gap-2 px-2 py-2 font-medium text-gray-900">
        <PackageIcon className="h-4 w-4 text-gray-500" />
        <span className="flex-1 truncate">Пакет v{pkg.version}</span>
        <PackageStatusBadge status={pkg.status} />
      </div>

      <ul className="space-y-1">
        {groups.map((group) => {
          const isCollapsed = collapsed[group.type]
          return (
            <li key={group.type}>
              <button
                type="button"
                className="flex w-full items-center gap-1.5 rounded px-2 py-1.5 text-left text-gray-700 hover:bg-gray-100"
                aria-expanded={!isCollapsed}
                onClick={() => setCollapsed((prev) => ({ ...prev, [group.type]: !isCollapsed }))}
              >
                {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                <Folder className="h-4 w-4 text-gray-400" />
                <span className="flex-1 truncate">{group.label}</span>
                <span className="text-xs text-gray-400">{group.documents.length}</span>
              </button>

              {!isCollapsed && (
                <ul className="ml-4 border-l border-gray-200 pl-2">
                  {group.documents.map((doc) => {
                    const status = DOCUMENT_STATUS_CONFIG[doc.status]
                    const issues = doc.findings.error + doc.findings.critical + doc.findings.warning
                    return (
                      <li key={doc.id}>
                        <button
                          type="button"
                          onClick={() => onSelect(doc.id)}
                          aria-current={doc.id === selectedId ? 'true' : undefined}
                          className={cn(
                            'flex w-full items-center gap-2 rounded px-2 py-1.5 text-left hover:bg-gray-100',
                            doc.id === selectedId && 'bg-primary-50 text-primary-700 hover:bg-primary-50'
                          )}
                        >
                          <FileText className="h-4 w-4 shrink-0 text-gray-400" />
                          <span className="min-w-0 flex-1 truncate" title={doc.fileName}>
                            {doc.fileName}
                          </span>
                          {issues > 0 && (
                            <span className="rounded-full bg-red-100 px-1.5 text-xs font-medium text-red-700">{issues}</span>
                          )}
                          <span className="sr-only">{status.text}</span>
                          <span
                            aria-hidden
                            className={cn(
                              'h-2 w-2 shrink-0 rounded-full',
                              doc.status === 'done' && 'bg-green-500',
                              (doc.status === 'processing' || doc.status === 'queued') && 'bg-blue-500 animate-pulse',
                              doc.status === 'failed' && 'bg-red-500',
                              doc.status === 'needs_ocr' && 'bg-amber-500',
                              (doc.status === 'uploaded' || doc.status === 'awaiting_upload') && 'bg-gray-300'
                            )}
                          />
                        </button>
                      </li>
                    )
                  })}
                </ul>
              )}
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

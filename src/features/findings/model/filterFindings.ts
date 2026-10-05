import { SEVERITY_ORDER, type Finding, type FindingStatus, type Severity } from '@/entities/finding'

export interface FindingsFilter {
  documentId?: string
  severities: Severity[]
  /** пусто = любые статусы */
  statuses: FindingStatus[]
}

export function filterFindings(items: Finding[], filter: FindingsFilter): Finding[] {
  return items
    .filter((f) => !filter.documentId || f.documentId === filter.documentId)
    .filter((f) => filter.severities.length === 0 || filter.severities.includes(f.severity))
    .filter((f) => filter.statuses.length === 0 || filter.statuses.includes(f.status))
    .sort((a, b) => SEVERITY_ORDER.indexOf(a.severity) - SEVERITY_ORDER.indexOf(b.severity))
}

/** Счётчики по серьёзности для текущего документа и статусов (для чипов-переключателей). */
export function countBySeverity(items: Finding[], filter: Omit<FindingsFilter, 'severities'>) {
  const counts: Record<Severity, number> = { critical: 0, error: 0, warning: 0, info: 0 }
  for (const f of filterFindings(items, { ...filter, severities: [] })) counts[f.severity]++
  return counts
}

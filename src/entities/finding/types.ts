export type Severity = 'critical' | 'error' | 'warning' | 'info'
export type FindingStatus = 'open' | 'accepted' | 'dismissed' | 'fixed'

/** Место в файле. Для PDF — page и bbox в долях страницы [x0, y0, x1, y1] от левого верхнего угла. */
export interface SourceRef {
  documentId: string
  page?: number
  bbox?: [number, number, number, number]
  sheet?: string
  cell?: string
  paragraph?: number
  quote?: string
}

export interface NormRef {
  doc: string
  clause: string
  url?: string
}

export interface Finding {
  id: string
  objectId: string
  documentId: string
  packageId: string
  ruleId: string
  ruleVersion: string
  severity: Severity
  /** Строгий результат правила */
  message: string
  /** Пояснение простым языком от LLM, может отсутствовать */
  explanation?: string | null
  expected?: string | null
  actual?: string | null
  normRef?: NormRef
  sources: SourceRef[]
  confidence: number
  status: FindingStatus
  comment?: string | null
  decidedBy?: string | null
  decidedAt?: string | null
  createdAt: string
  updatedAt: string
}

export interface FindingUpdate {
  status?: FindingStatus
  comment?: string
}

export interface FindingsPage {
  items: Finding[]
  meta: { page: number; pageSize: number; total: number }
  counts: {
    bySeverity: Record<Severity, number>
    byStatus: Record<string, number>
  }
}

export const SEVERITY_ORDER: Severity[] = ['critical', 'error', 'warning', 'info']

export const SEVERITY_LABELS: Record<Severity, string> = {
  critical: 'Критично',
  error: 'Ошибка',
  warning: 'Замечание',
  info: 'Сведения',
}

export const FINDING_STATUS_LABELS: Record<FindingStatus, string> = {
  open: 'Открыто',
  accepted: 'Принято',
  dismissed: 'Отклонено',
  fixed: 'Исправлено',
}

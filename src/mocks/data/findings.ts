import type { Finding, FindingsPage, FindingUpdate, Severity } from '@/entities/finding'
import type { SeverityCounts } from '@/entities/package'

const store = new Map<string, Finding[]>() // documentId → замечания

interface DocRef {
  id: string
  objectId: string
  packageId: string
}

// bbox подобраны под layout public/mock-docs/sample.pdf (A4, доли страницы)
function seed(doc: DocRef): Finding[] {
  const now = new Date().toISOString()
  const base = {
    objectId: doc.objectId,
    packageId: doc.packageId,
    documentId: doc.id,
    ruleVersion: '1.0.0',
    status: 'open' as const,
    createdAt: now,
    updatedAt: now,
  }
  return [
    {
      ...base,
      id: `${doc.id}-f1`,
      ruleId: 'aosr.date-after-journal',
      severity: 'error',
      message: 'Дата акта раньше даты начала работ в общем журнале',
      explanation: 'Акт освидетельствования не может быть подписан раньше, чем работы были начаты по журналу.',
      expected: 'не ранее 01.03.2025',
      actual: '01.02.2025',
      normRef: { doc: 'СП 70.13330.2012', clause: 'п. 5.2.3' },
      sources: [{ documentId: doc.id, page: 1, bbox: [0.1, 0.09, 0.75, 0.115], quote: 'Act of hidden works No. 12 dated 01.03.2025' }],
      confidence: 0.94,
    },
    {
      ...base,
      id: `${doc.id}-f2`,
      ruleId: 'aosr.material-certificate',
      severity: 'warning',
      message: 'Не указан номер сертификата на применённый материал',
      explanation: 'В разделе материалов нет ссылки на документ о качестве. Проверьте вручную, возможно номер указан в приложении.',
      expected: 'номер и дата сертификата',
      actual: null,
      sources: [{ documentId: doc.id, page: 2, bbox: [0.1, 0.192, 0.9, 0.335] }],
      confidence: 0.71,
    },
    {
      ...base,
      id: `${doc.id}-f3`,
      ruleId: 'aosr.signature-customer',
      severity: 'info',
      message: 'Подпись представителя заказчика не распознана автоматически',
      sources: [{ documentId: doc.id, page: 3, bbox: [0.1, 0.09, 0.6, 0.115] }],
      confidence: 0.55,
    },
  ]
}

export function ensureFindings(doc: DocRef): void {
  if (!store.has(doc.id)) store.set(doc.id, seed(doc))
}

export function openCounts(documentId: string): SeverityCounts {
  const counts: SeverityCounts = { critical: 0, error: 0, warning: 0, info: 0 }
  for (const f of store.get(documentId) ?? []) if (f.status === 'open') counts[f.severity]++
  return counts
}

const csv = (v: string | null) => (v ? v.split(',') : [])

export function listFindings(documentIds: string[], query: URLSearchParams): FindingsPage {
  const all = documentIds.flatMap((id) => store.get(id) ?? [])
  const severities = csv(query.get('severity'))
  const statuses = csv(query.get('status'))
  const documentId = query.get('documentId')

  const filtered = all
    .filter((f) => !documentId || f.documentId === documentId)
    .filter((f) => severities.length === 0 || severities.includes(f.severity))
    .filter((f) => statuses.length === 0 || statuses.includes(f.status))

  const page = Number(query.get('page') ?? 1)
  const pageSize = Number(query.get('pageSize') ?? 50)

  // Счётчики — по всем замечаниям пакета, кроме фильтров серьёзности и статуса
  const scope = all.filter((f) => !documentId || f.documentId === documentId)
  const bySeverity: Record<Severity, number> = { critical: 0, error: 0, warning: 0, info: 0 }
  const byStatus: Record<string, number> = {}
  for (const f of scope) {
    bySeverity[f.severity]++
    byStatus[f.status] = (byStatus[f.status] ?? 0) + 1
  }

  return {
    items: filtered.slice((page - 1) * pageSize, page * pageSize),
    meta: { page, pageSize, total: filtered.length },
    counts: { bySeverity, byStatus },
  }
}

export type UpdateResult = Finding | 'not_found' | 'comment_required'

export function updateFinding(id: string, body: FindingUpdate, userId: string): UpdateResult {
  for (const list of store.values()) {
    const f = list.find((x) => x.id === id)
    if (!f) continue
    const status = body.status ?? f.status
    const comment = body.comment ?? f.comment
    if (status === 'dismissed' && !comment?.trim()) return 'comment_required'
    const now = new Date().toISOString()
    Object.assign(f, {
      status,
      comment: comment ?? null,
      decidedBy: status === 'open' ? null : userId,
      decidedAt: status === 'open' ? null : now,
      updatedAt: now,
    })
    return f
  }
  return 'not_found'
}

export function resetMockFindings() {
  store.clear()
}

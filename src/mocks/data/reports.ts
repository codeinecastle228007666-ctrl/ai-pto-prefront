import type { Report, ReportCreate } from '@/entities/report'

interface MockReport {
  report: Report
  createdAt: number
}

const reports = new Map<string, MockReport>()
const GENERATE_MS = 2000

let counter = 0

export function createMockReport(objectId: string, packageId: string, body: ReportCreate, userId: string): Report {
  const version = [...reports.values()].filter((r) => r.report.packageId === packageId).length + 1
  const now = Date.now()
  const report: Report = {
    id: `rep-${now.toString(36)}-${++counter}`,
    objectId,
    packageId,
    status: 'queued',
    version,
    scope: body.scope ?? 'accepted',
    recipient: body.recipient ?? null,
    createdBy: userId,
    createdAt: new Date(now).toISOString(),
    readyAt: null,
  }
  reports.set(report.id, { report, createdAt: now })
  return report
}

/** Статус зависит от прошедшего времени: queued → generating → ready. */
export function getMockReport(reportId: string): Report | null {
  const entry = reports.get(reportId)
  if (!entry) return null
  const elapsed = Date.now() - entry.createdAt
  const { report } = entry
  if (elapsed < GENERATE_MS / 2) report.status = 'queued'
  else if (elapsed < GENERATE_MS) report.status = 'generating'
  else {
    report.status = 'ready'
    report.findingsCount = report.scope === 'errors' ? 1 : 3
    report.readyAt ??= new Date().toISOString()
  }
  return report
}

export function resetMockReports() {
  reports.clear()
}

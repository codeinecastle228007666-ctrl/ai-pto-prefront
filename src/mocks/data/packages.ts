import type {
  DocumentType,
  Package,
  PackageCreate,
  PackageCreated,
  PackageDetail,
  PackageDocument,
  Stage,
  StageState,
} from '@/entities/package'

interface MockPackage {
  pkg: Package
  documents: PackageDocument[]
  startedAt?: number
}

const packages = new Map<string, MockPackage>()
const knownHashes = new Map<string, string>() // sha256 → documentId
const uploaded = new Set<string>()

const STAGES: Stage[] = ['extract', 'classify', 'parse', 'rules', 'explain']
const PROCESS_MS = 6000

let counter = 0
const uid = (prefix: string) => `${prefix}-${Date.now().toString(36)}-${++counter}`

function guessType(fileName: string): DocumentType {
  const n = fileName.toLowerCase()
  if (n.includes('аоср') || n.includes('aosr')) return 'aosr'
  if (n.includes('журнал')) return 'general_work_log'
  if (n.includes('паспорт')) return 'material_passport'
  if (n.includes('схем')) return 'as_built_scheme'
  return 'unknown'
}

export function createMockPackage(objectId: string, body: PackageCreate): PackageCreated {
  const version = [...packages.values()].filter((p) => p.pkg.objectId === objectId).length + 1
  const pkg: Package = {
    id: uid('pkg'),
    objectId,
    version,
    status: 'uploading',
    progress: 0,
    createdAt: new Date().toISOString(),
  }
  const documents: PackageDocument[] = []
  const uploads: PackageCreated['uploads'] = []

  for (const f of body.files) {
    const duplicateOf = f.sha256 ? knownHashes.get(f.sha256) ?? null : null
    const documentId = uid('doc')
    documents.push({
      id: documentId,
      objectId,
      packageId: pkg.id,
      fileName: f.fileName,
      mimeType: f.mimeType,
      sizeBytes: f.sizeBytes,
      pageCount: f.mimeType === 'application/pdf' ? 3 : null,
      type: 'unknown',
      status: duplicateOf ? 'uploaded' : 'awaiting_upload',
      stages: {},
      findings: { error: 0, warning: 0, info: 0, critical: 0 },
      createdAt: pkg.createdAt,
    })
    if (duplicateOf) {
      uploaded.add(documentId)
    } else if (f.sha256) {
      knownHashes.set(f.sha256, documentId)
    }
    uploads.push({
      documentId,
      fileName: f.fileName,
      uploadUrl: duplicateOf ? null : `/api/__mocks__/upload/${documentId}`,
      expiresAt: new Date(Date.now() + 15 * 60_000).toISOString(),
      duplicateOf,
    })
  }

  packages.set(pkg.id, { pkg, documents })
  return { package: pkg, uploads }
}

export function markMockUploaded(documentId: string): boolean {
  for (const p of packages.values()) {
    const doc = p.documents.find((d) => d.id === documentId)
    if (doc) {
      doc.status = 'uploaded'
      uploaded.add(documentId)
      return true
    }
  }
  return false
}

/** null — пакет не найден; 'not_uploaded' — не все файлы загружены (409). */
export function startMockPackage(packageId: string): Package | 'not_found' | 'not_uploaded' {
  const p = packages.get(packageId)
  if (!p) return 'not_found'
  if (!p.startedAt) {
    if (p.documents.some((d) => !uploaded.has(d.id))) return 'not_uploaded'
    p.startedAt = Date.now()
  }
  return computeMockPackage(p)
}

function computeMockPackage(p: MockPackage): PackageDetail {
  if (!p.startedAt) return { ...p.pkg, documents: p.documents }

  const elapsed = Date.now() - p.startedAt
  const progress = Math.min(1, elapsed / PROCESS_MS)
  const finished = progress >= 1

  const documents = p.documents.map((doc, i): PackageDocument => {
    // Сканы/нераспознаваемые форматы в моках не обрабатываем: CSV → needs_ocr для демонстрации статуса
    if (doc.mimeType === 'text/csv') {
      return { ...doc, status: 'needs_ocr' }
    }
    const docProgress = Math.min(1, Math.max(0, progress * 1.3 - i * 0.05))
    const doneStages = Math.floor(docProgress * STAGES.length)
    const stages: Partial<Record<Stage, StageState>> = {}
    STAGES.forEach((stage, idx) => {
      stages[stage] = {
        status: idx < doneStages ? 'succeeded' : idx === doneStages && docProgress < 1 ? 'running' : 'pending',
      }
    })
    const done = docProgress >= 1
    return {
      ...doc,
      type: doneStages > 1 ? guessType(doc.fileName) : 'unknown',
      status: done ? 'done' : 'processing',
      stages,
    }
  })

  const status = finished ? 'done' : progress < 0.1 ? 'queued' : 'processing'
  p.pkg.status = status
  p.pkg.progress = progress
  return { ...p.pkg, documents }
}

export function getMockPackage(packageId: string): PackageDetail | null {
  const p = packages.get(packageId)
  return p ? computeMockPackage(p) : null
}

export function resetMockPackages() {
  packages.clear()
  knownHashes.clear()
  uploaded.clear()
}

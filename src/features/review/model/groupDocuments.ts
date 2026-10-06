import { DOCUMENT_TYPE_LABELS, type DocumentType, type PackageDocument } from '@/entities/package'

export interface DocumentGroup {
  type: DocumentType
  label: string
  documents: PackageDocument[]
}

// Порядок групп: распознанные типы по алфавиту подписи, «прочее» и «не определён» в конце.
const LAST: DocumentType[] = ['other', 'unknown']

export function groupDocumentsByType(documents: PackageDocument[]): DocumentGroup[] {
  const byType = new Map<DocumentType, PackageDocument[]>()
  for (const doc of documents) {
    byType.set(doc.type, [...(byType.get(doc.type) ?? []), doc])
  }
  return [...byType.entries()]
    .map(([type, docs]) => ({
      type,
      label: DOCUMENT_TYPE_LABELS[type],
      documents: [...docs].sort((a, b) => a.fileName.localeCompare(b.fileName, 'ru')),
    }))
    .sort((a, b) => {
      const la = LAST.indexOf(a.type)
      const lb = LAST.indexOf(b.type)
      if (la !== lb) return (la === -1 ? -1 : la) - (lb === -1 ? -1 : lb)
      return a.label.localeCompare(b.label, 'ru')
    })
}

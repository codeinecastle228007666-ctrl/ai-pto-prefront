import type { ExtractedField } from '@/entities/package'

const store = new Map<string, ExtractedField[]>() // documentId → поля

// bbox подобраны под layout public/mock-docs/sample.pdf (A4, доли страницы)
function seed(documentId: string): ExtractedField[] {
  const at = (page: number, bbox: [number, number, number, number], quote?: string) => ({ documentId, page, bbox, quote })
  return [
    {
      key: 'actNumber',
      label: 'Номер акта',
      value: '12',
      confidence: 0.62,
      source: at(1, [0.1, 0.09, 0.75, 0.115], 'Act of hidden works No. 12'),
      editedManually: false,
    },
    {
      key: 'actDate',
      label: 'Дата акта',
      value: '01.03.2025',
      confidence: 0.95,
      source: at(1, [0.1, 0.09, 0.75, 0.115], 'dated 01.03.2025'),
      editedManually: false,
    },
    {
      key: 'workName',
      label: 'Наименование работ',
      value: 'Устройство монолитных фундаментов',
      confidence: 0.9,
      source: at(1, [0.1, 0.125, 0.9, 0.15]),
      editedManually: false,
    },
    {
      key: 'materialCertificate',
      label: 'Сертификат на материал',
      value: null,
      confidence: 0.4,
      source: at(2, [0.1, 0.192, 0.9, 0.335]),
      editedManually: false,
    },
  ]
}

export function getMockFields(documentId: string): ExtractedField[] {
  if (!store.has(documentId)) store.set(documentId, seed(documentId))
  return store.get(documentId)!
}

export type FieldsUpdateResult = ExtractedField[] | 'unknown_key'

export function updateMockFields(
  documentId: string,
  changes: { key: string; value: string | null }[]
): FieldsUpdateResult {
  const fields = getMockFields(documentId)
  if (changes.some((c) => !fields.some((f) => f.key === c.key))) return 'unknown_key'
  for (const { key, value } of changes) {
    const field = fields.find((f) => f.key === key)!
    if (!field.editedManually) field.originalValue = field.value // исходное значение сохраняем один раз
    field.value = value
    field.editedManually = true
    field.confidence = 1
  }
  return fields
}

export function resetMockFields() {
  store.clear()
}

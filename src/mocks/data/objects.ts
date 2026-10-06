import type { ConstructionObject, ObjectType, WorkType, Counterparty } from '@/entities/object/types'

export const mockObjectTypes: ObjectType[] = [
  { id: 'ot-1', group: { id: 'og-1', code: 'RES', name: 'Жилые и коммерческие' }, code: 'MKD', name: 'Многоквартирный жилой дом', description: '' },
  { id: 'ot-2', group: { id: 'og-1', code: 'RES', name: 'Жилые и коммерческие' }, code: 'TC', name: 'Торговый центр', description: '' },
  { id: 'ot-3', group: { id: 'og-2', code: 'IND', name: 'Производственные и складские' }, code: 'SKLAD', name: 'Склад', description: '' },
  { id: 'ot-4', group: { id: 'og-2', code: 'IND', name: 'Производственные и складские' }, code: 'PROD', name: 'Производственный корпус', description: '' },
  { id: 'ot-5', group: { id: 'og-3', code: 'SOC', name: 'Социальные' }, code: 'SOC', name: 'Социальный объект', description: '' },
]

export const mockWorkTypes: WorkType[] = [
  { id: 'wt-1', code: 'CONCRETE', name: 'Монолитные работы' },
  { id: 'wt-2', code: 'WELDING', name: 'Сварочные работы' },
  { id: 'wt-3', code: 'ELECTRICAL', name: 'Электромонтажные работы' },
  { id: 'wt-4', code: 'HVAC', name: 'Вентиляция и кондиционирование' },
  { id: 'wt-5', code: 'PLUMBING', name: 'Водоснабжение и канализация' },
  { id: 'wt-6', code: 'FINISHING', name: 'Отделочные работы' },
  { id: 'wt-7', code: 'PILING', name: 'Сваивание' },
  { id: 'wt-8', code: 'WATERPROOFING', name: 'Гидроизоляция' },
]

export const mockCounterparties: Counterparty[] = [
  { id: 'org-1', slug: 'stroymaster', name: 'ООО «СтройМастер»' },
  { id: 'org-2', slug: 'zastroyshchik', name: 'АО «Застройщик-Девелопер»' },
  { id: 'org-3', slug: 'techzakazchik', name: 'ООО «ТехЗаказчик-Проект»' },
  { id: 'org-4', slug: 'ip-ivanov', name: 'ИП Иванов И.И.' },
  { id: 'org-5', slug: 'stroypodryadchik', name: 'ООО «СтройПодрядчик»' },
]

interface ObjectSeed extends Omit<ConstructionObject, 'id' | 'workTypes' | 'objectType' | 'customer' | 'contractor'> {
  objectTypeId: string
  customerOrganizationId: string
  contractorOrganizationId: string
}

const baseObjects: ObjectSeed[] = [
  {
    code: 'OBJ-001',
    name: 'ЖК «Северный», корпус 3',
    address: 'г. Москва, Северное чертаново, ул. Чипилына, 15',
    objectTypeId: 'ot-1',
    customerOrganizationId: 'org-2',
    contractorOrganizationId: 'org-5',
    status: 'active',
    description: '17-этажный монолитный дом, 120 квартир',
    startDate: '2024-03-01T00:00:00Z',
    plannedEndDate: '2025-06-30T00:00:00Z',
    actualEndDate: null,
    createdAt: '2024-02-15T10:00:00Z',
    updatedAt: '2024-08-20T14:30:00Z',
    archivedAt: null,
  },
  {
    code: 'OBJ-002',
    name: 'ТЦ «Галактика»',
    address: 'г. Москва, Ленinskiй пр-т, 120',
    objectTypeId: 'ot-2',
    customerOrganizationId: 'org-2',
    contractorOrganizationId: 'org-5',
    status: 'active',
    description: 'Торговый центр 3 этажа, паркинг на 200 машиномест',
    startDate: '2024-01-10T00:00:00Z',
    plannedEndDate: '2024-12-31T00:00:00Z',
    actualEndDate: null,
    createdAt: '2023-12-01T10:00:00Z',
    updatedAt: '2024-09-10T09:15:00Z',
    archivedAt: null,
  },
  {
    code: 'OBJ-003',
    name: 'Складской комплекс «Юг»',
    address: 'Московская обл., г. Подольск, Промзона, 5',
    objectTypeId: 'ot-3',
    customerOrganizationId: 'org-3',
    contractorOrganizationId: 'org-4',
    status: 'on_hold',
    description: 'Класс А, 15 000 кв.м, 12 доков',
    startDate: '2024-05-01T00:00:00Z',
    plannedEndDate: '2025-03-01T00:00:00Z',
    actualEndDate: null,
    createdAt: '2024-04-15T10:00:00Z',
    updatedAt: '2024-08-01T12:00:00Z',
    archivedAt: null,
  },
  {
    code: 'OBJ-004',
    name: 'Производственный корпус Завод №7',
    address: 'г. Тула, ул. Промышленная, 42',
    objectTypeId: 'ot-4',
    customerOrganizationId: 'org-2',
    contractorOrganizationId: 'org-5',
    status: 'completed',
    description: 'Цех литья, 2 крана по 50т',
    startDate: '2023-09-01T00:00:00Z',
    plannedEndDate: '2024-06-30T00:00:00Z',
    actualEndDate: '2024-06-25T00:00:00Z',
    createdAt: '2023-08-15T10:00:00Z',
    updatedAt: '2024-06-25T16:00:00Z',
    archivedAt: null,
  },
  {
    code: 'OBJ-005',
    name: 'Детский сад №15 «Солнышко»',
    address: 'г. Москва, район Кунцево, ул. Рубинштейна, 8',
    objectTypeId: 'ot-5',
    customerOrganizationId: 'org-3',
    contractorOrganizationId: 'org-4',
    status: 'draft',
    description: 'На 140 мест, 2 корпуса, бассейн',
    startDate: '2025-02-01T00:00:00Z',
    plannedEndDate: '2025-11-30T00:00:00Z',
    actualEndDate: null,
    createdAt: '2024-10-01T10:00:00Z',
    updatedAt: '2024-10-01T10:00:00Z',
    archivedAt: null,
  },
]

function buildObjects(): ConstructionObject[] {
  return baseObjects.map(({ objectTypeId, customerOrganizationId, contractorOrganizationId, ...obj }, i) => {
    const toRef = (id: string) => {
      const org = mockCounterparties.find((o) => o.id === id)
      return org ? { id: org.id, name: org.name } : null
    }
    return {
      ...obj,
      id: `obj-${i + 1}`,
      workTypes: mockWorkTypes.slice(0, 3 + (i % 3)),
      objectType: mockObjectTypes.find((ot) => ot.id === objectTypeId)!,
      customer: toRef(customerOrganizationId),
      contractor: toRef(contractorOrganizationId),
    }
  })
}

export let mockObjects: ConstructionObject[] = buildObjects()

export function resetMockObjects() {
  mockObjects = buildObjects()
}

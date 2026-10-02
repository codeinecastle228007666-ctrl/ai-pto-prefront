import {
  BarChart3,
  BookOpenCheck,
  Bot,
  FileSearch,
  FileText,
  Gauge,
  Layers,
  MessageSquareShare,
  Radar,
  ScrollText,
  ShieldCheck,
  UploadCloud,
} from 'lucide-react'

/** Анкорные ссылки шапки лендинга. */
export const LANDING_NAV_LINKS = [
  { label: 'Возможности', href: '#features' },
  { label: 'Как это работает', href: '#how-it-works' },
  { label: 'Документы', href: '#documents' },
  { label: 'Связаться', href: '#contact' },
]

/** Карточки возможностей — по спецификации API (openapi.yaml). */
export const LANDING_FEATURES = [
  {
    icon: Radar,
    title: 'Автоклассификация документов',
    description:
      'AI распознаёт тип каждого файла: АОСР, общие и специальные журналы работ, исполнительные схемы, паспорта и протоколы — без ручной разметки.',
  },
  {
    icon: ShieldCheck,
    title: 'Проверка правилами',
    description:
      'Каждый документ проходит конвейер правил: даты, подписи, соответствие данных между документами и требования норм.',
  },
  {
    icon: FileSearch,
    title: 'Замечания трёх уровней',
    description:
      'Ошибки, замечания и сведения — с приоритизацией по серьёзности и уверенностью распознавания, чтобы инженер видел главное.',
  },
  {
    icon: BookOpenCheck,
    title: 'Контроль комплектности',
    description:
      'Чек-лист по виду работ: система показывает, какие обязательные документы найдены в пакете, а каких не хватает.',
  },
  {
    icon: MessageSquareShare,
    title: 'Обоснование каждого вывода',
    description:
      'Каждое замечание подкреплено ссылкой на источник в документе — решение инженера принимается по фактам, а не на доверие.',
  },
  {
    icon: ScrollText,
    title: 'PDF-отчёт подрядчику',
    description:
      'Сводный отчёт по пакету с замечаниями и комплектностью — скачивается и отправляется подрядчику в один клик.',
  },
] as const

/** Шаги работы. */
export const LANDING_STEPS = [
  {
    icon: UploadCloud,
    title: '1. Загрузите пакет',
    description:
      'Перетащите PDF, DOCX или XLSX — до 200 файлов в пакете. Дубликаты система распознает сама.',
  },
  {
    icon: Layers,
    title: '2. AI обрабатывает',
    description:
      'AI распознаёт тип каждого документа, извлекает данные и проверяет их по правилам — прогресс виден в реальном времени.',
  },
  {
    icon: FileSearch,
    title: '3. Примите решения',
    description:
      'Просмотрите замечания: принять, отклонить как ложное срабатывание или пометить исправленным — с историей изменений.',
  },
  {
    icon: ScrollText,
    title: '4. Получите отчёт',
    description:
      'Сформируйте PDF-отчёт по пакету и отправьте подрядчику на доработку — прямо из системы.',
  },
] as const

/** Поддерживаемые типы документов (DocumentType из openapi.yaml). */
export const LANDING_DOCUMENTS = [
  {
    icon: FileText,
    title: 'АОСР',
    description: 'Акты освидетельствования скрытых работ',
  },
  {
    icon: BookOpenCheck,
    title: 'Общий журнал работ',
    description: 'Журнал по форме СК-6',
  },
  {
    icon: Layers,
    title: 'Исполнительные схемы',
    description: 'Монтажные и геодезические схемы',
  },
  {
    icon: Gauge,
    title: 'Журнал бетонных работ',
    description: 'Укладка и уход за бетоном',
  },
  {
    icon: FileText,
    title: 'Журнал сварочных работ',
    description: 'Сварка и контроль швов',
  },
  {
    icon: ShieldCheck,
    title: 'Паспорта материалов',
    description: 'Сертификаты и паспорта качества',
  },
  {
    icon: FileSearch,
    title: 'Входной контроль',
    description: 'Журнал входного контроля материалов',
  },
  {
    icon: BarChart3,
    title: 'Протоколы испытаний',
    description: 'Испытания и экспертизы',
  },
] as const

/** Цифры для блока статистики — из спецификации, без выдумок. */
export const LANDING_STATS = [
  { icon: FileText, value: '10+', label: 'типов документов' },
  { icon: Layers, value: '6', label: 'этапов проверки' },
  { icon: ShieldCheck, value: '3', label: 'уровня критичности замечаний' },
  { icon: Bot, value: '1', label: 'PDF-отчёт по пакету' },
] as const

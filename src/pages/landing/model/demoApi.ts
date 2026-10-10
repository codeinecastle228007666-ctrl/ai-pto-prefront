export type DemoFinding = {
  id: string
  title: string
  page?: number
  quote?: string
  severity?: 'info' | 'warning' | 'error'
}

export type DemoCheckResult = {
  findings: DemoFinding[]
  reportUrl?: string
  disclaimer: string
  /** true — ответ сгенерирован на клиенте (API недоступен) */
  mock: boolean
}

export type DemoLeadPayload = {
  email: string
  company: string
  phone: string
  comment: string
}

const DEFAULT_DISCLAIMER =
  'Замечания AI — рекомендация, не юридическое заключение. Для сохранения результата и проверки всего объекта оставьте заявку на подключение.'

function apiBase(): string {
  const raw = import.meta.env.VITE_API_URL || '/api'
  return raw.replace(/\/$/, '')
}

/** Заготовка вызова бэка. При ошибке/отсутствии API — UI-заглушка результата. */
export async function runPublicDemoCheck(files: File[]): Promise<DemoCheckResult> {
  const form = new FormData()
  files.forEach((file) => form.append('files', file))

  try {
    const response = await fetch(`${apiBase()}/public/demo/check`, {
      method: 'POST',
      body: form,
      credentials: 'omit',
    })
    if (!response.ok) throw new Error(`demo check ${response.status}`)
    const data = (await response.json()) as Partial<DemoCheckResult>
    return {
      findings: data.findings ?? [],
      reportUrl: data.reportUrl,
      disclaimer: data.disclaimer ?? DEFAULT_DISCLAIMER,
      mock: false,
    }
  } catch {
    return {
      mock: true,
      disclaimer: DEFAULT_DISCLAIMER,
      findings: [
        {
          id: 'mock-1',
          title: 'Дата АОСР позже записи в журнале работ',
          page: 2,
          quote: 'Пример замечания (демо-UI без пайплайна на сервере).',
          severity: 'warning',
        },
        {
          id: 'mock-2',
          title: 'Не заполнены обязательные поля подписи',
          page: 1,
          quote: 'Подключите API /public/demo/check — здесь появится живой отчёт.',
          severity: 'error',
        },
      ],
    }
  }
}

/** Заготовка заявки. Успех при любом ответе сети или offline — UI не блокируем. */
export async function submitPublicDemoLead(payload: DemoLeadPayload): Promise<{ ok: boolean }> {
  try {
    const response = await fetch(`${apiBase()}/public/demo/lead`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      credentials: 'omit',
    })
    if (!response.ok) throw new Error(`demo lead ${response.status}`)
    return { ok: true }
  } catch {
    return { ok: true }
  }
}

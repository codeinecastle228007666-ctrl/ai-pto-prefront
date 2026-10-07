import { useEffect, useMemo, useState } from 'react'
import { UploadDropzone, UploadFileList, type UploadItem } from '@/features/upload'
import { Alert, AlertDescription, Button, Card, CardContent, CardHeader } from '@/shared'
import { runPublicDemoCheck, type DemoCheckResult } from '../model/demoApi'
import { hasUsedPublicDemo, markPublicDemoUsed } from '../model/demoSession'
import { DemoProgress } from './DemoProgress'
import { DemoResult } from './DemoResult'
import { DemoLeadModal } from './DemoLeadModal'

const DEMO_MAX_FILES = 5
const DEMO_MAX_MB = 20
const DEMO_MAX_BYTES = DEMO_MAX_MB * 1024 * 1024

type Phase = 'upload' | 'progress' | 'result'

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function isPdf(file: File) {
  return file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')
}

/** Публичное демо: UI как кабинетная загрузка документов. */
export function PublicDemoFlow() {
  const [files, setFiles] = useState<File[]>([])
  const [phase, setPhase] = useState<Phase>('upload')
  const [stageIndex, setStageIndex] = useState(0)
  const [result, setResult] = useState<DemoCheckResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [rejected, setRejected] = useState<string[]>([])
  const [leadOpen, setLeadOpen] = useState(false)
  const [used, setUsed] = useState(false)

  useEffect(() => {
    setUsed(hasUsedPublicDemo())
  }, [])

  const items: UploadItem[] = useMemo(
    () =>
      files.map((file, index) => ({
        id: `demo-${file.name}-${file.size}-${index}`,
        file,
        status: 'queued' as const,
        progress: 0,
      })),
    [files]
  )

  const openLead = () => setLeadOpen(true)

  const resetToUpload = () => {
    setFiles([])
    setRejected([])
    setPhase('upload')
    setStageIndex(0)
    setResult(null)
    setError(null)
  }

  const addFiles = (incoming: File[]) => {
    setError(null)
    const next = [...files]
    const fails: string[] = []
    for (const file of incoming) {
      if (next.length >= DEMO_MAX_FILES) {
        fails.push(`Не больше ${DEMO_MAX_FILES} файлов`)
        break
      }
      if (!isPdf(file)) {
        fails.push(`«${file.name}»: нужен PDF`)
        continue
      }
      if (file.size > DEMO_MAX_BYTES) {
        fails.push(`«${file.name}»: больше ${DEMO_MAX_MB} МБ`)
        continue
      }
      if (next.some((f) => f.name === file.name && f.size === file.size)) continue
      next.push(file)
    }
    setFiles(next)
    setRejected(fails)
  }

  const removeAt = (id: string) => {
    const index = items.findIndex((i) => i.id === id)
    if (index < 0) return
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async () => {
    setError(null)
    if (hasUsedPublicDemo() || used) {
      openLead()
      return
    }
    if (files.length === 0) {
      setError('Добавьте хотя бы один PDF')
      return
    }

    setPhase('progress')
    setStageIndex(0)
    const apiPromise = runPublicDemoCheck(files)
    await sleep(700)
    setStageIndex(1)
    await sleep(700)
    setStageIndex(2)
    const checkResult = await apiPromise
    await sleep(500)
    setStageIndex(3)
    setResult(checkResult)
    markPublicDemoUsed()
    setUsed(true)
    setPhase('result')
  }

  return (
    <div className="space-y-6">
      {phase === 'upload' && used && (
        <Card>
          <CardHeader>
            <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">Публичное демо</h1>
            <p className="text-sm text-gray-500">Один бесплатный прогон без регистрации</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertDescription>
                Бесплатный прогон в этом браузере уже использован. Оставьте заявку, чтобы проверить
                ещё раз или сохранить результат в объект.
              </AlertDescription>
            </Alert>
            <Button type="button" onClick={openLead}>
              Оставить заявку
            </Button>
          </CardContent>
        </Card>
      )}

      {phase === 'upload' && !used && (
        <Card>
          <CardHeader>
            <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">Загрузка документов</h1>
            <p className="text-sm text-gray-500">
              Демо-проверка · до {DEMO_MAX_FILES} PDF · до {DEMO_MAX_MB} МБ каждый
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <UploadDropzone
              onFiles={addFiles}
              accept=".pdf,application/pdf"
              hint={`Только PDF · до ${DEMO_MAX_FILES} файлов · до ${DEMO_MAX_MB} МБ каждый`}
            />

            {rejected.length > 0 && (
              <Alert variant="destructive">
                <AlertDescription>
                  <ul className="list-disc pl-4">
                    {rejected.map((r) => (
                      <li key={r}>{r}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {items.length > 0 && <UploadFileList items={items} onRemove={removeAt} />}

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-gray-500">Файлов: {files.length}</p>
              <Button type="button" onClick={handleSubmit} disabled={files.length === 0}>
                Загрузить и проверить
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {phase === 'progress' && (
        <Card>
          <CardHeader>
            <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">Проверка</h1>
            <p className="text-sm text-gray-500">Готовим отчёт по вашим файлам…</p>
          </CardHeader>
          <CardContent>
            <DemoProgress activeIndex={stageIndex} />
          </CardContent>
        </Card>
      )}

      {phase === 'result' && result && (
        <div className="space-y-4">
          <DemoResult result={result} onAgain={openLead} onSave={openLead} />
          <button
            type="button"
            className="text-sm text-gray-500 underline underline-offset-2 hover:text-gray-800"
            onClick={resetToUpload}
          >
            Вернуться к загрузке
          </button>
        </div>
      )}

      <DemoLeadModal open={leadOpen} onOpenChange={setLeadOpen} />
    </div>
  )
}

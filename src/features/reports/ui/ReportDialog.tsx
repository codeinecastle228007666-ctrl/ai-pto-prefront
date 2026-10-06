import { useState } from 'react'
import { CheckCircle2, Download, Loader2 } from 'lucide-react'
import {
  Alert,
  AlertDescription,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
} from '@/shared'
import { REPORT_SCOPE_LABELS, type ReportScope } from '@/entities/report'
import { downloadReportFile, useCreateReport, useReport } from '../api/reportsApi'

interface ReportDialogProps {
  packageId: string
  open: boolean
  onClose: () => void
}

const SCOPES = Object.keys(REPORT_SCOPE_LABELS) as ReportScope[]

export function ReportDialog({ packageId, open, onClose }: ReportDialogProps) {
  const [scope, setScope] = useState<ReportScope>('accepted')
  const [recipient, setRecipient] = useState('')
  const [reportId, setReportId] = useState<string>()
  const [downloadError, setDownloadError] = useState<string | null>(null)

  const create = useCreateReport(packageId)
  const { data: report } = useReport(reportId)

  const generating = create.isPending || report?.status === 'queued' || report?.status === 'generating'
  const ready = report?.status === 'ready'

  const handleCreate = async () => {
    try {
      const created = await create.mutateAsync({ scope, ...(recipient.trim() ? { recipient: recipient.trim() } : {}) })
      setReportId(created.id)
    } catch {
      // ошибка показывается из create.error
    }
  }

  const handleDownload = async () => {
    if (!report) return
    setDownloadError(null)
    try {
      await downloadReportFile(report)
    } catch {
      setDownloadError('Не удалось скачать отчёт. Попробуйте ещё раз.')
    }
  }

  const reset = () => {
    setReportId(undefined)
    create.reset()
    setDownloadError(null)
  }

  const errorMessage =
    create.error?.response?.status === 409
      ? 'Обработка пакета ещё не завершена.'
      : create.error
        ? (create.error.response?.data?.message ?? 'Не удалось запустить формирование отчёта.')
        : report?.status === 'failed'
          ? (report.error?.message ?? 'Не удалось сформировать отчёт.')
          : downloadError

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>PDF-отчёт для подрядчика</DialogTitle>
          <DialogDescription>Выберите, какие замечания включить в отчёт.</DialogDescription>
        </DialogHeader>

        <fieldset className="space-y-2" disabled={generating || ready}>
          <legend className="sr-only">Состав отчёта</legend>
          {SCOPES.map((s) => (
            <label key={s} className="flex items-center gap-2 text-sm text-gray-900">
              <input type="radio" name="report-scope" checked={scope === s} onChange={() => setScope(s)} />
              {REPORT_SCOPE_LABELS[s]}
            </label>
          ))}
          <div className="space-y-1.5 pt-2">
            <Label htmlFor="report-recipient">Адресат (необязательно)</Label>
            <Input
              id="report-recipient"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="ООО «СтройПодрядчик»"
            />
          </div>
        </fieldset>

        {errorMessage && (
          <Alert variant="destructive">
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}
        {generating && (
          <p className="flex items-center gap-2 text-sm text-gray-600">
            <Loader2 className="h-4 w-4 animate-spin" />
            Формируем отчёт…
          </p>
        )}
        {ready && (
          <p className="flex items-center gap-2 text-sm text-green-700">
            <CheckCircle2 className="h-4 w-4" />
            Отчёт готов{report?.findingsCount !== undefined && ` · замечаний: ${report.findingsCount}`}
          </p>
        )}

        <DialogFooter>
          {ready ? (
            <>
              <Button variant="outline" onClick={reset}>
                Новый отчёт
              </Button>
              <Button onClick={handleDownload}>
                <Download className="h-4 w-4 mr-2" />
                Скачать PDF
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={onClose}>
                Закрыть
              </Button>
              <Button onClick={report?.status === 'failed' ? reset : handleCreate} loading={generating}>
                {report?.status === 'failed' ? 'Повторить' : 'Сформировать'}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

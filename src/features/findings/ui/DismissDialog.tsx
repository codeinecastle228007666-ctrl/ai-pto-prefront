import { useState } from 'react'
import { Button, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, Textarea } from '@/shared'

interface DismissDialogProps {
  open: boolean
  pending?: boolean
  onClose: () => void
  onConfirm: (comment: string) => void
}

/** При отклонении замечания комментарий обязателен (правило бэка, иначе 422). */
export function DismissDialog({ open, pending, onClose, onConfirm }: DismissDialogProps) {
  const [comment, setComment] = useState('')
  const trimmed = comment.trim()

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Отклонить замечание</DialogTitle>
          <DialogDescription>Укажите причину — например, почему это ложное срабатывание.</DialogDescription>
        </DialogHeader>
        <Textarea
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Комментарий"
          aria-label="Комментарий"
        />
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={pending}>
            Отмена
          </Button>
          <Button onClick={() => onConfirm(trimmed)} disabled={!trimmed} loading={pending}>
            Отклонить
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

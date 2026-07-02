import type { ReactNode } from 'react'
import { Button } from './Button'
import { Modal } from './Modal'

type ConfirmVariant = 'primary' | 'destructive'

interface ConfirmDialogProps {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  title: string
  description?: ReactNode
  confirmLabel?: string
  cancelLabel?: string
  confirmVariant?: ConfirmVariant
  isPending?: boolean
  onConfirm: () => void
}

export const ConfirmDialog = ({
  isOpen,
  onOpenChange,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  confirmVariant = 'primary',
  isPending = false,
  onConfirm,
}: ConfirmDialogProps) => (
  <Modal title={title} isOpen={isOpen} onOpenChange={onOpenChange}>
    <div className="flex flex-col gap-4">
      {description && <p className="text-sm text-slate-600 dark:text-slate-300">{description}</p>}
      <div className="flex justify-end gap-2">
        <Button variant="secondary" type="button" onPress={() => onOpenChange(false)}>
          {cancelLabel}
        </Button>
        <Button variant={confirmVariant} type="button" onPress={onConfirm} isPending={isPending}>
          {confirmLabel}
        </Button>
      </div>
    </div>
  </Modal>
)

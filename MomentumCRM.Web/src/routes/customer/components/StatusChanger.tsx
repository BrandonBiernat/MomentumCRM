import { useState } from 'react'
import { Button as AriaButton, Menu, MenuItem, MenuTrigger, Popover } from 'react-aria-components'
import { Badge, Button, Message, Modal, toast } from '../../../components'
import { useChangeCustomerStatusMutation } from '../../../services'
import {
  allowedStatusTransitions,
  statusReasonRequired,
  type Customer,
  type CustomerStatus,
} from '../../../types/customer'
import { getFormErrorMessage } from './customerFormShared'

const statusColor: Record<CustomerStatus, 'amber' | 'violet' | 'green' | 'gray'> = {
  Lead: 'amber',
  Prospect: 'violet',
  Active: 'green',
  Inactive: 'gray',
}

export const StatusChanger = ({
  customer,
  readOnly = false,
}: {
  customer: Customer
  readOnly?: boolean
}) => {
  const [changeStatus, { isLoading }] = useChangeCustomerStatusMutation()
  const [pending, setPending] = useState<CustomerStatus | null>(null)
  const [reason, setReason] = useState('')
  const [error, setError] = useState<string>()

  if (readOnly) {
    return <Badge color={statusColor[customer.status]}>{customer.status}</Badge>
  }

  const options = allowedStatusTransitions[customer.status]
  const reasonRequired = pending != null && statusReasonRequired(pending)

  const open = (target: CustomerStatus) => {
    setPending(target)
    setReason('')
    setError(undefined)
  }

  const confirm = async () => {
    if (!pending) return
    if (reasonRequired && !reason.trim()) {
      setError('A reason is required to mark a customer inactive.')
      return
    }
    try {
      await changeStatus({
        id: customer.id,
        body: { status: pending, reason: reason.trim() || undefined },
      }).unwrap()
      toast.success(`Status changed to ${pending}.`)
      setPending(null)
    } catch (err) {
      setError(getFormErrorMessage(err))
    }
  }

  return (
    <>
      <MenuTrigger>
        <AriaButton
          aria-label="Change status"
          className="inline-flex items-center gap-1.5 rounded-full outline-none hover:cursor-pointer focus-visible:ring-2 focus-visible:ring-brand-500/40"
        >
          <Badge color={statusColor[customer.status]}>{customer.status}</Badge>
          <i className="fa-solid fa-chevron-down text-xs text-slate-400" aria-hidden />
        </AriaButton>
        <Popover className="min-w-44 rounded-lg border border-slate-200 bg-white p-1 shadow-lg outline-none dark:border-slate-700 dark:bg-slate-900">
          <Menu className="outline-none" onAction={(key) => open(key as CustomerStatus)}>
            {options.map((status) => (
              <MenuItem
                key={status}
                id={status}
                className="flex cursor-pointer items-center gap-2 rounded-md px-3 py-1.5 text-sm text-slate-700 outline-none focus:bg-slate-100 dark:text-slate-200 dark:focus:bg-slate-800"
              >
                Move to {status}
              </MenuItem>
            ))}
          </Menu>
        </Popover>
      </MenuTrigger>

      <Modal
        title="Change status"
        isOpen={pending != null}
        onOpenChange={(isOpen) => {
          if (!isOpen) setPending(null)
        }}
      >
        <div className="flex flex-col gap-4">
          {error && <Message variant="error">{error}</Message>}
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Move <span className="font-medium text-slate-900 dark:text-slate-100">{customer.name}</span>{' '}
            from <span className="font-medium">{customer.status}</span> to{' '}
            <span className="font-medium">{pending}</span>?
          </p>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
              Reason {reasonRequired ? '' : '(optional)'}
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              placeholder="Add context for this change"
              className="w-full resize-none rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" type="button" onPress={() => setPending(null)}>
              Cancel
            </Button>
            <Button type="button" onPress={confirm} isPending={isLoading}>
              Confirm
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}

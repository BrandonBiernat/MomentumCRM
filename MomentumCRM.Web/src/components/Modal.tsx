import type { ReactNode } from 'react'
import {
  ModalOverlay,
  Modal as AriaModal,
  Dialog,
  Heading,
  type ModalOverlayProps,
} from 'react-aria-components'
import { Button } from './Button'

interface ModalProps extends Omit<ModalOverlayProps, 'children'> {
  title?: string
  children?: ReactNode | ((opts: { close: () => void }) => ReactNode)
}

export const Modal = ({ title, children, ...props }: ModalProps) => (
  <ModalOverlay
    isDismissable
    {...props}
    className="fixed inset-0 z-50 flex min-h-full items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm transition-opacity duration-200 data-[entering]:opacity-0 data-[exiting]:opacity-0"
  >
    <AriaModal className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl transition duration-200 data-[entering]:scale-95 data-[entering]:opacity-0 data-[exiting]:scale-95 data-[exiting]:opacity-0">
      <Dialog className="outline-none">
        {({ close }) => (
          <>
            <div className="flex items-start justify-between">
              {title && (
                <Heading slot="title" className="text-lg font-semibold text-slate-900">
                  {title}
                </Heading>
              )}
              <Button
                variant="ghost"
                size="sm"
                onPress={close}
                aria-label="Close"
                className="-mr-2 -mt-1 px-2"
              >
                <svg viewBox="0 0 20 20" aria-hidden className="h-4 w-4">
                  <path
                    d="M6 6l8 8M14 6l-8 8"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </Button>
            </div>
            <div className="mt-3">
              {typeof children === 'function' ? children({ close }) : children}
            </div>
          </>
        )}
      </Dialog>
    </AriaModal>
  </ModalOverlay>
)

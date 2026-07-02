import { useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import {
  UNSTABLE_Toast as AriaToast,
  UNSTABLE_ToastContent as AriaToastContent,
  UNSTABLE_ToastQueue as ToastQueue,
  UNSTABLE_ToastRegion as AriaToastRegion,
  UNSTABLE_ToastStateContext as ToastStateContext,
  Button,
  Text,
} from 'react-aria-components'
import type { QueuedToast } from 'react-stately'
import { messageVariants, type MessageVariant } from './Message'

interface ToastContent {
  variant: MessageVariant
  message: ReactNode
  duration: number | null
}

// Module-level singleton so `toast.*` can be called from anywhere, not just
// inside React. <Toaster /> (mounted once at the app root) renders this queue.
const queue = new ToastQueue<ToastContent>({ maxVisibleToasts: 5 })

interface ToastOptions {
  // Milliseconds before auto-dismiss. Pass null to keep the toast until the
  // user closes it. Defaults to 5s.
  timeout?: number | null
}

const DEFAULT_TIMEOUT = 5000

// We manage timing/animation ourselves (React Aria's toast has no built-in
// enter/exit animation), so we don't hand a timeout to the queue.
const add = (message: ReactNode, variant: MessageVariant, options?: ToastOptions) =>
  queue.add({
    message,
    variant,
    duration: options?.timeout === undefined ? DEFAULT_TIMEOUT : options.timeout,
  })

export const toast = {
  show: (message: ReactNode, options?: ToastOptions) => add(message, 'default', options),
  info: (message: ReactNode, options?: ToastOptions) => add(message, 'info', options),
  success: (message: ReactNode, options?: ToastOptions) => add(message, 'success', options),
  warning: (message: ReactNode, options?: ToastOptions) => add(message, 'warning', options),
  error: (message: ReactNode, options?: ToastOptions) => add(message, 'error', options),
}

// Slides in from off the right edge on mount; on dismiss, flips to the exit
// animation and removes itself from the queue once it finishes playing.
const ENTER_ANIMATION = '[animation:toast-in_200ms_ease-out]'
const EXIT_ANIMATION = '[animation:toast-out_200ms_ease-in_forwards]'

const ToastItem = ({ toast }: { toast: QueuedToast<ToastContent> }) => {
  const state = useContext(ToastStateContext)
  const [exiting, setExiting] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined)
  const styles = messageVariants[toast.content.variant]

  useEffect(() => {
    const { duration } = toast.content
    if (duration != null) timerRef.current = setTimeout(() => setExiting(true), duration)
    return () => clearTimeout(timerRef.current)
  }, [toast.content])

  const dismiss = () => {
    clearTimeout(timerRef.current)
    setExiting(true)
  }

  const onAnimationEnd = () => {
    if (exiting) state?.close(toast.key)
  }

  return (
    <AriaToast
      toast={toast}
      onAnimationEnd={onAnimationEnd}
      className={`flex w-80 max-w-full items-start gap-2 rounded-lg border px-3 py-2 text-sm shadow-lg outline-none ${styles.box} ${exiting ? EXIT_ANIMATION : ENTER_ANIMATION}`}
    >
      <AriaToastContent className="flex min-w-0 flex-1 items-start gap-2">
        <i className={`fa-solid ${styles.icon} mt-0.5 shrink-0`} aria-hidden />
        <Text slot="title" className="min-w-0 break-words">
          {toast.content.message}
        </Text>
      </AriaToastContent>
      <Button
        aria-label="Dismiss"
        onPress={dismiss}
        className="-mr-1 -mt-0.5 flex size-6 shrink-0 items-center justify-center rounded outline-none transition hover:cursor-pointer hover:bg-black/5 focus-visible:ring-2 focus-visible:ring-current/40 dark:hover:bg-white/10"
      >
        <i className="fa-solid fa-xmark text-xs" aria-hidden />
      </Button>
    </AriaToast>
  )
}

export const Toaster = () => (
  <AriaToastRegion
    queue={queue}
    className="fixed bottom-4 right-4 z-50 flex max-w-[calc(100vw-2rem)] flex-col gap-2 outline-none"
  >
    {({ toast }) => <ToastItem toast={toast} />}
  </AriaToastRegion>
)

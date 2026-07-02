import type { ReactNode } from 'react'
import {
  Tooltip as AriaTooltip,
  TooltipTrigger,
  type Placement,
} from 'react-aria-components'

interface TooltipProps {
  content: ReactNode
  placement?: Placement
  children: ReactNode
}

// Wrap a focusable trigger (e.g. a Button). React Aria shows the tooltip on
// hover and on keyboard focus, and handles positioning/dismissal.
export const Tooltip = ({ content, placement = 'top', children }: TooltipProps) => (
  <TooltipTrigger delay={300} closeDelay={0}>
    {children}
    <AriaTooltip
      placement={placement}
      offset={6}
      className="rounded-md bg-slate-900 px-2 py-1 text-xs font-medium text-white shadow-lg outline-none data-[entering]:animate-[fade-in_120ms_ease-out] dark:bg-slate-700"
    >
      {content}
    </AriaTooltip>
  </TooltipTrigger>
)

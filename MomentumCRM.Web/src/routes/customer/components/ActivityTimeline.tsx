import { type ReactNode } from 'react'
import dayjs from 'dayjs'
import { Spinner } from '../../../components'
import { useGetCustomerActivityQuery } from '../../../services'
import type { CustomerActivity } from '../../../types/customer'

const DATETIME_FORMAT = 'MMM D, YYYY h:mm A'

const describe = (activity: CustomerActivity): { icon: string; text: ReactNode } => {
  const data = activity.data ?? {}
  switch (activity.type) {
    case 'StatusChanged':
      return {
        icon: 'fa-arrow-right-arrow-left',
        text: (
          <>
            Status changed from <b>{String(data.from)}</b> to <b>{String(data.to)}</b>
            {data.reason ? <span className="text-slate-500 dark:text-slate-400"> — “{String(data.reason)}”</span> : null}
          </>
        ),
      }
    case 'Created':
      return {
        icon: 'fa-circle-plus',
        text: (
          <>
            Created as <b>{String(data.status ?? 'Lead')}</b>
          </>
        ),
      }
    case 'NoteAdded':
      return {
        icon: 'fa-note-sticky',
        text: (
          <>
            Note added{data.preview ? <span className="text-slate-500 dark:text-slate-400"> — “{String(data.preview)}”</span> : null}
          </>
        ),
      }
    case 'NoteRemoved':
      return {
        icon: 'fa-trash',
        text: (
          <>
            Note removed{data.preview ? <span className="text-slate-500 dark:text-slate-400"> — “{String(data.preview)}”</span> : null}
          </>
        ),
      }
    default:
      return { icon: 'fa-circle', text: activity.type }
  }
}

export const ActivityTimeline = ({ customerId }: { customerId: string }) => {
  const { data: activities, isLoading } = useGetCustomerActivityQuery(customerId)

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <h2 className="mb-4 text-sm font-semibold text-slate-900 dark:text-slate-100">Activity</h2>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Spinner />
        </div>
      ) : !activities || activities.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-slate-200 py-10 text-center dark:border-slate-700">
          <i className="fa-solid fa-wave-square text-xl text-slate-300 dark:text-slate-600" aria-hidden />
          <p className="text-sm text-slate-400 dark:text-slate-500">No activity yet.</p>
        </div>
      ) : (
        <ol className="flex max-h-96 flex-col gap-4 overflow-y-auto pr-1">
          {activities.map((activity) => {
            const { icon, text } = describe(activity)
            return (
              <li key={activity.id} className="flex gap-3">
                <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                  <i className={`fa-solid ${icon} text-xs`} aria-hidden />
                </span>
                <div className="min-w-0">
                  <p className="text-sm text-slate-800 dark:text-slate-200">{text}</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">
                    {dayjs(activity.occurredAtUtc).format(DATETIME_FORMAT)}
                  </p>
                </div>
              </li>
            )
          })}
        </ol>
      )}
    </section>
  )
}

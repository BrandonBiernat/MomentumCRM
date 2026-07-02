import { Fragment } from 'react'
import { Link } from 'react-router-dom'

export type Crumb = {
  label: string
  to?: string
}

export const Breadcrumbs = ({ items }: { items: Crumb[] }) => (
  <nav aria-label="Breadcrumb">
    <ol className="flex flex-wrap items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
      {items.map((item, index) => {
        const isLast = index === items.length - 1
        return (
          <Fragment key={index}>
            <li className="min-w-0">
              {item.to && !isLast ? (
                <Link
                  to={item.to}
                  className="transition hover:text-slate-700 dark:hover:text-slate-200"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  aria-current={isLast ? 'page' : undefined}
                  className={
                    isLast ? 'truncate font-medium text-slate-900 dark:text-slate-100' : undefined
                  }
                >
                  {item.label}
                </span>
              )}
            </li>
            {!isLast && (
              <li aria-hidden className="text-slate-300 dark:text-slate-600">
                <i className="fa-solid fa-chevron-right text-[10px]" />
              </li>
            )}
          </Fragment>
        )
      })}
    </ol>
  </nav>
)

import { NavLink } from 'react-router-dom'

interface NavItem {
  to: string
  label: string
  icon: string
}

const navItems: NavItem[] = [
  // { to: '/', label: 'Components', icon: 'fa-shapes' },
  { to: '/customers', label: 'Customers', icon: 'fa-users' },
  { to: '/settings', label: 'Settings', icon: 'fa-gear' },
]

export const Sidebar = ({ open }: { open: boolean }) => (
  <aside className="overflow-hidden bg-white dark:bg-slate-900">
    <nav className="flex h-full w-full flex-col gap-1 overflow-y-auto border-r border-slate-200 p-2 dark:border-slate-800">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === '/'}
          title={open ? undefined : item.label}
          className={({ isActive }) =>
            `flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium transition ${
              isActive
                ? 'bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300'
                : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
            }`
          }
        >
          <span className="flex w-8 shrink-0 items-center justify-center">
            <i className={`fa-solid ${item.icon}`} aria-hidden />
          </span>
          {open && <span className="truncate">{item.label}</span>}
        </NavLink>
      ))}
    </nav>
  </aside>
)

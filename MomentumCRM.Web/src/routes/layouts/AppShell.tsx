import { useState } from 'react'
import {
  Button as AriaButton,
  Menu,
  MenuItem,
  MenuTrigger,
  Popover,
} from 'react-aria-components'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import logoUrl from '../../assets/momentum horizontal text purple logo.png'
import { Avatar, SearchInput } from '../../components'
import { useLogoutMutation } from '../../services'
import { useAppSelector } from '../../store'
import { selectAuthUser } from '../../store/slices'
import { Sidebar } from './Sidebar'

export const AppShell = () => {
  const user = useAppSelector(selectAuthUser)
  const [logout] = useLogoutMutation()
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const onLogout = async () => {
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <div
      className={`grid h-screen grid-rows-[auto_minmax(0,1fr)] overflow-hidden bg-slate-50 transition-[grid-template-columns] duration-200 dark:bg-slate-950 ${
        sidebarOpen ? 'grid-cols-[15rem_minmax(0,1fr)]' : 'grid-cols-[4rem_minmax(0,1fr)]'
      }`}
    >
      <header className="col-span-2 flex h-14 items-center gap-4 border-b border-slate-200 bg-white px-4 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSidebarOpen((open) => !open)}
            aria-label="Toggle sidebar"
            aria-expanded={sidebarOpen}
            className="flex size-9 items-center justify-center rounded-lg text-slate-600 transition hover:cursor-pointer hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <i
              className={`fa-solid fa-angles-left text-base transition-transform duration-300 ${sidebarOpen ? '' : 'rotate-180'}`}
              aria-hidden
            />
          </button>
          <img src={logoUrl} alt="Momentum" className="h-8" />
        </div>

        <div className="flex flex-1 justify-center">
          <SearchInput className="w-full max-w-md" />
        </div>

        <MenuTrigger>
          <AriaButton className="flex items-center gap-3 rounded-full py-1 pl-3 pr-1 outline-none transition hover:cursor-pointer hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-brand-600 dark:hover:bg-slate-800">
            {user && (
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                {user.displayName}
              </span>
            )}
            <Avatar name={user?.displayName} src={user?.avatarUrl} size="sm" />
          </AriaButton>
          <Popover className="min-w-56 origin-top-right rounded-lg border border-slate-200 bg-white p-1 shadow-lg dark:border-slate-700 dark:bg-slate-900">
            <div className="border-b border-slate-100 px-3 py-2 dark:border-slate-800">
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{user?.displayName}</p>
              <p className="truncate text-xs text-slate-500 dark:text-slate-400">{user?.email}</p>
            </div>
            <Menu
              className="py-1 outline-none"
              onAction={(key) => {
                if (key === 'logout') void onLogout()
              }}
            >
              <MenuItem
                id="logout"
                className="flex cursor-pointer items-center gap-2 rounded-md px-3 py-1.5 text-sm text-slate-700 outline-none focus:bg-slate-100 dark:text-slate-200 dark:focus:bg-slate-800"
              >
                <i className="fa-solid fa-arrow-right-from-bracket w-4 text-center" aria-hidden />
                Log out
              </MenuItem>
            </Menu>
          </Popover>
        </MenuTrigger>
      </header>

      <Sidebar open={sidebarOpen} />
      <main className="min-w-0 overflow-y-auto">
        <div key={location.pathname} className="page-enter h-full">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

import { Outlet, useNavigate } from 'react-router-dom'
import logoUrl from '../../assets/momentum horizontal text purple logo.png'
import { Button } from '../../components'
import { useLogoutMutation } from '../../services'
import { selectAuthUser, useAppSelector } from '../../store'

export const AppShell = () => {
  const user = useAppSelector(selectAuthUser)
  const [logout, { isLoading }] = useLogoutMutation()
  const navigate = useNavigate()

  const onLogout = async () => {
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-3">
        <img src={logoUrl} alt="Momentum" className="h-8" />
        <div className="flex items-center gap-3">
          {user && <span className="text-sm text-slate-600">{user.displayName}</span>}
          <Button variant="secondary" size="sm" onPress={onLogout} isPending={isLoading}>
            Log out
          </Button>
        </div>
      </header>
      <Outlet />
    </div>
  )
}

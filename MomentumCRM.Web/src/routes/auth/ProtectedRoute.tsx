import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAppSelector } from '../../store'
import { selectIsAuthenticated } from '../../store/slices'

export const ProtectedRoute = () => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated)
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <Outlet />
}

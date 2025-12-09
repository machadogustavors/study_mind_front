import { Navigate, Outlet } from 'react-router-dom'

import { ROUTES } from '@/constants/routes'
import { useAuthStore } from '@/store/auth-store'

export function ProtectedRoute() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const token = useAuthStore((state) => state.token)

  if (!isAuthenticated || !token) {
    return <Navigate to={ROUTES.signin} replace />
  }

  return <Outlet />
}

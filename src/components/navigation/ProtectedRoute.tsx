import { Navigate, Outlet } from 'react-router-dom'

import { ROUTES } from '@/constants/routes'
import { useAuthStore } from '@/store/auth-store'

export function ProtectedRoute() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const token = useAuthStore((state) => state.token)
  const hydrated = useAuthStore((state) => state.hydrated)

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-sand text-midnight dark:bg-midnight dark:text-white">
        <p className="text-sm font-semibold">Carregando ambiente seguro...</p>
      </div>
    )
  }

  if (!isAuthenticated || !token) {
    return <Navigate to={ROUTES.signin} replace />
  }

  return <Outlet />
}

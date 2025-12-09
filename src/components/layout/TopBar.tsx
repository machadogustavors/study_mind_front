import { Bell, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { ROUTES } from '@/constants/routes'
import { useAuthStore } from '@/store/auth-store'

export function TopBar() {
  const user = useAuthStore((state) => state.user)
  const signOut = useAuthStore((state) => state.signOut)
  const navigate = useNavigate()

  const handleLogout = () => {
    signOut()
    navigate(ROUTES.signin)
  }

  return (
    <header className="flex items-center justify-between border-b border-white/10 bg-white/5 px-6 py-4 text-white">
      <div>
        <p className="text-sm text-white/60">Bem-vindo de volta</p>
        <p className="text-lg font-semibold">{user?.email ?? 'Estudante'}</p>
      </div>
      <div className="flex items-center gap-4">
        <button className="rounded-full border border-white/20 bg-white/10 p-2" aria-label="Notificações">
          <Bell className="h-5 w-5" />
        </button>
        <button
          onClick={handleLogout}
          className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold transition hover:bg-white/25"
        >
          <LogOut className="h-4 w-4" />
          Sair
        </button>
      </div>
    </header>
  )
}

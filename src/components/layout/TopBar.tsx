import { Bell, LogOut, Moon, Sun } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { useTheme } from '@/app/theme-provider'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/constants/routes'
import { useAuthStore } from '@/store/auth-store'

export function TopBar() {
  const user = useAuthStore((state) => state.user)
  const signOut = useAuthStore((state) => state.signOut)
  const navigate = useNavigate()

  const { theme, toggleTheme } = useTheme()

  const handleLogout = () => {
    signOut()
    navigate(ROUTES.signin)
  }

  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white/80 px-6 py-4 text-midnight shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5 dark:text-white">
      <div>
        <p className="text-sm text-slate-500 dark:text-white/60">Bem-vindo de volta</p>
        <p className="text-lg font-semibold">{user?.email ?? 'Estudante'}</p>
      </div>
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro'}
        >
          {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
        <button className="rounded-full border border-slate-200 bg-white/60 p-2 text-slate-600 transition hover:bg-white dark:border-white/20 dark:bg-white/10 dark:text-white" aria-label="Notificações">
          <Bell className="h-5 w-5" />
        </button>
        <Button onClick={handleLogout} variant="secondary" size="sm" className="rounded-full px-5">
          <LogOut className="h-4 w-4" />
          Sair
        </Button>
      </div>
    </header>
  )
}

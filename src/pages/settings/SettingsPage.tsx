import { useTheme } from '@/app/theme-provider'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { useAuthStore } from '@/store/auth-store'
import { usePreferencesStore } from '@/store/preferences-store'

export function SettingsPage() {
  const user = useAuthStore((state) => state.user)
  const { theme, setTheme } = useTheme()
  const { preferences, updatePreferences } = usePreferencesStore()

  return (
    <section className="space-y-8">
      <header>
        <p className="text-sm uppercase tracking-widest text-slate-500 dark:text-white/60">Configurações</p>
        <h1 className="text-3xl font-semibold text-midnight dark:text-white">Preferências da conta</h1>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Conta</CardTitle>
            <CardDescription>Dados sincronizados com o backend</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <label className="block text-sm font-semibold text-slate-600 dark:text-white/80">
              E-mail
              <Input value={user?.email ?? 'desconhecido'} readOnly />
            </label>
            <label className="block text-sm font-semibold text-slate-600 dark:text-white/80">
              Plano
              <Input value={user?.plan ?? 'free'} readOnly />
            </label>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tema</CardTitle>
            <CardDescription>Alterne entre claro e escuro</CardDescription>
          </CardHeader>
          <CardContent className="flex gap-3">
            <Button variant={theme === 'light' ? 'primary' : 'outline'} onClick={() => setTheme('light')}>
              Claro
            </Button>
            <Button variant={theme === 'dark' ? 'primary' : 'outline'} onClick={() => setTheme('dark')}>
              Escuro
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Preferências de estudo</CardTitle>
          <CardDescription>Essas configurações são armazenadas localmente até o backend suportar edição.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <label className="block text-sm font-semibold text-slate-600 dark:text-white/80">
            Matéria de foco
            <Input
              value={preferences.focusSubject}
              onChange={(event) => updatePreferences({ focusSubject: event.target.value })}
            />
          </label>
          <label className="block text-sm font-semibold text-slate-600 dark:text-white/80">
            Notificações
            <Select
              value={preferences.notifications ? 'on' : 'off'}
              onChange={(event) => updatePreferences({ notifications: event.target.value === 'on' })}
            >
              <option value="on">Ativadas</option>
              <option value="off">Desativadas</option>
            </Select>
          </label>
          <label className="block text-sm font-semibold text-slate-600 dark:text-white/80">
            Tom das respostas da IA
            <Select
              value={preferences.aiTone}
              onChange={(event) => updatePreferences({ aiTone: event.target.value as 'objetivo' | 'motivacional' })}
            >
              <option value="motivacional">Motivacional</option>
              <option value="objetivo">Objetivo</option>
            </Select>
          </label>
        </CardContent>
      </Card>
    </section>
  )
}

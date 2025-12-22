import { NavLink } from 'react-router-dom'
import { BookOpenCheck, CreditCard, Gauge, Layers, MessageSquare, Settings, Sparkles, UploadCloud, Zap } from 'lucide-react'

import { ROUTES } from '@/constants/routes'

const links = [
  { to: ROUTES.dashboard, label: 'Painel', icon: Gauge },
  { to: ROUTES.upload, label: 'Upload Center', icon: UploadCloud },
  { to: ROUTES.studyPlan, label: 'Plano de estudos', icon: Layers },
  { to: ROUTES.flashcards, label: 'Flashcards', icon: Sparkles },
  { to: ROUTES.questions, label: 'Perguntas', icon: MessageSquare },
  { to: ROUTES.progress, label: 'Progresso', icon: Zap },
  { to: ROUTES.plans, label: 'Ver Planos', icon: CreditCard },
  { to: ROUTES.settings, label: 'Configurações', icon: Settings },
]

export function SidebarNav() {
  return (
    <aside className="hidden w-128 flex-col justify-between border-r border-black/5 bg-white p-6 text-midnight dark:border-white/10 dark:bg-white/5 dark:text-white lg:flex">
      <div>
        <div className="mb-10 flex items-center gap-2 text-lg font-semibold">
          <BookOpenCheck className="h-6 w-6 text-brand-500" />
          StudyMind
        </div>
        <nav className="space-y-2">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? 'bg-brand-500/10 text-brand-600 dark:bg-white/15 dark:text-white'
                    : 'text-slate-500 hover:bg-slate-100 dark:text-white/70 dark:hover:bg-white/10'
                }`
              }
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>
      <div className="rounded-xl bg-slate-50 p-4 text-xs text-slate-600 dark:bg-white/5 dark:text-white/70">
        <p className="font-semibold text-slate-900 dark:text-white">Precisa de ajuda?</p>
        <p>Envie um e-mail para suporte@studymind.ai</p>
      </div>
    </aside>
  )
}

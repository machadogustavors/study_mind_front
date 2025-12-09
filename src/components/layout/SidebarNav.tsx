import { NavLink } from 'react-router-dom'
import { BookOpenCheck, FolderOpen, Gauge, UploadCloud } from 'lucide-react'

import { ROUTES } from '@/constants/routes'

const links = [
  { to: ROUTES.dashboard, label: 'Painel', icon: Gauge },
  { to: ROUTES.upload, label: 'Upload', icon: UploadCloud },
]

export function SidebarNav() {
  return (
    <aside className="hidden w-64 flex-col justify-between border-r border-white/10 bg-white/5 p-6 text-white lg:flex">
      <div>
        <div className="mb-10 flex items-center gap-2 text-lg font-semibold">
          <BookOpenCheck className="h-6 w-6 text-brand-400" />
          StudyMind
        </div>
        <nav className="space-y-2">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition hover:bg-white/10 ${
                  isActive ? 'bg-white/15 text-white' : 'text-white/70'
                }`
              }
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>
      <div className="rounded-xl bg-white/5 p-4 text-xs text-white/70">
        <p className="font-semibold text-white">Precisa de ajuda?</p>
        <p>Envie um e-mail para suporte@studymind.ai</p>
      </div>
    </aside>
  )
}

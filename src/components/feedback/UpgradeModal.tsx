import { AlertCircle, Crown } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ROUTES } from '@/constants/routes'

interface UpgradeModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  resourceType?: string
  currentPlan?: string
}

export function UpgradeModal({ open, onOpenChange, resourceType = 'recurso', currentPlan = 'FREE' }: UpgradeModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/20">
            <AlertCircle className="h-6 w-6 text-orange-600 dark:text-orange-500" />
          </div>
          <DialogTitle className="text-xl">Limite atingido</DialogTitle>
          <DialogDescription className="text-base">
            Você atingiu o limite de <span className="font-semibold">{resourceType}</span> do plano {currentPlan}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="rounded-lg bg-gradient-to-br from-brand-500 to-brand-600 p-6 text-white dark:from-brand-600 dark:to-brand-700">
            <div className="mb-2 flex items-center gap-2">
              <Crown className="h-5 w-5" />
              <h3 className="font-semibold">Faça upgrade agora!</h3>
            </div>
            <p className="text-sm text-white/90">
              Desbloqueie recursos ilimitados e continue seus estudos sem interrupções.
            </p>
          </div>

          <ul className="space-y-2 text-sm text-slate-600 dark:text-white/70">
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-brand-500 dark:text-brand-400">✓</span>
              <span>Documentos ilimitados</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-brand-500 dark:text-brand-400">✓</span>
              <span>Flashcards e perguntas sem limite</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-brand-500 dark:text-brand-400">✓</span>
              <span>Acesso a modelos de IA avançados</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-brand-500 dark:text-brand-400">✓</span>
              <span>Suporte prioritário</span>
            </li>
          </ul>
        </div>

        <DialogFooter className="sm:justify-between">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Agora não
          </Button>
          <Button asChild>
            <Link to={ROUTES.plans}>Ver Planos</Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

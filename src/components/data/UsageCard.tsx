import { useQuery } from '@tanstack/react-query'
import { AlertCircle, CheckCircle, FileText, HelpCircle, Sparkles, Zap } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'

import { ROUTES } from '@/constants/routes'
import { fetchUserSubscription } from '@/services/subscriptions'
import { useAuthStore } from '@/store/auth-store'
import { Button } from '../ui/button'

export function UsageCard() {
  const user = useAuthStore((s) => s.user)
  const { data: subscription, isLoading, isError, error } = useQuery({
    queryKey: ['user-subscription'],
    queryFn: fetchUserSubscription,
    enabled: !!user,
  })


  React.useEffect(() => {
    console.log('🔍 UsageCard Debug:', {
      user: user?.email,
      isLoading,
      isError,
      error: error?.message,
      subscription,
      usage: subscription?.usage,
    })
  }, [user, isLoading, isError, error, subscription])

  if (isLoading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-slate-900">
        <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">Uso do Plano</h3>
        <p className="text-sm text-slate-500 dark:text-white/60">Carregando uso...</p>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-slate-900">
        <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">Uso do Plano</h3>
        <p className="text-sm text-red-600">Erro ao obter uso: {(error as any)?.message ?? 'unknown'}</p>
      </div>
    )
  }

  if (!subscription || !subscription.usage) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-slate-900">
        <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">Uso do Plano</h3>
        <p className="text-sm text-slate-500 dark:text-white/60">Nenhum dado de uso disponível.</p>
      </div>
    )
  }

  const usage = subscription.usage

  const resources = [
    {
      icon: FileText,
      label: 'Documentos',
      current: usage.documents_uploaded || 0,
      limit: usage.documents_limit,
      color: 'blue',
    },
    {
      icon: HelpCircle,
      label: 'Perguntas à IA',
      current: usage.questions_asked || 0,
      limit: usage.questions_limit,
      color: 'purple',
    },
    {
      icon: Zap,
      label: 'Flashcards',
      current: usage.flashcards_generated || 0,
      limit: usage.flashcards_limit,
      color: 'yellow',
    },
    {
      icon: Sparkles,
      label: 'Resumos com IA',
      current: usage.ai_explanations_used || 0,
      limit: usage.ai_explanations_limit,
      color: 'green',
    },
  ]

  const hasReachedLimit = resources.some((r) => r.limit && r.current >= r.limit)

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-slate-900">
      <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
        Uso do Plano {subscription.plan_name}
      </h3>

      <div className="space-y-4">
        {resources.map((resource) => {
          const percentage = resource.limit ? (resource.current / resource.limit) * 100 : 0
          const isNearLimit = percentage >= 80
          const isAtLimit = resource.limit ? resource.current >= resource.limit : false
          const isUnlimited = resource.limit === null

          const Icon = resource.icon
          const statusIcon = isAtLimit ? AlertCircle : isNearLimit ? AlertCircle : CheckCircle
          const statusColor = isAtLimit ? 'text-red-500' : isNearLimit ? 'text-orange-500' : 'text-green-500'

          const colorMap: Record<string, { text: string; bg: string }> = {
            blue: { text: 'text-blue-500', bg: 'bg-blue-500' },
            purple: { text: 'text-purple-500', bg: 'bg-purple-500' },
            yellow: { text: 'text-yellow-500', bg: 'bg-yellow-500' },
            green: { text: 'text-green-500', bg: 'bg-green-500' },
          }
          const colorClasses = colorMap[resource.color] ?? colorMap.blue

          return (
            <div key={resource.label}>
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className={`h-4 w-4 ${colorClasses.text}`} />
                  <span className="text-sm font-medium text-slate-700 dark:text-white/70">
                    {resource.label}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">
                    {isUnlimited ? `${resource.current}/∞` : `${resource.current}/${resource.limit}`}
                  </span>
                  {!isUnlimited && React.createElement(statusIcon, {
                    className: `h-4 w-4 ${statusColor}`,
                  })}
                </div>
              </div>
              {!isUnlimited && (
                <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
                  <div
                    className={`h-full rounded-full transition-all ${isAtLimit ? 'bg-red-500' : isNearLimit ? 'bg-orange-500' : colorClasses.bg}`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>

      {hasReachedLimit && (
        <div className="mt-4 rounded-lg bg-red-50 p-3 dark:bg-red-900/20">
          <p className="mb-2 text-xs font-medium text-red-700 dark:text-red-400">
            Você atingiu o limite do seu plano. Faça upgrade para continuar!
          </p>
          <Button asChild size="sm" className="w-full">
            <Link to={ROUTES.plans}>Ver Planos</Link>
          </Button>
        </div>
      )}
    </div>
  )
}

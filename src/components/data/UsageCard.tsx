import { useQuery } from '@tanstack/react-query'
import { AlertCircle, CheckCircle, FileText, HelpCircle, Sparkles, Zap } from 'lucide-react'
import React from 'react'

import { fetchUsageStats } from '@/services/subscriptions'
import { useAuthStore } from '@/store/auth-store'

export function UsageCard() {
  const user = useAuthStore((s) => s.user)
  const { data: usage } = useQuery({
    queryKey: ['usage-stats'],
    queryFn: fetchUsageStats,
    enabled: !!user,
  })

  if (!usage) return null

  const resources = [
    {
      icon: FileText,
      label: 'Documentos',
      current: usage.documents_uploaded,
      limit: 1, // TODO: pegar do plano ativo
      color: 'blue',
    },
    {
      icon: HelpCircle,
      label: 'Perguntas',
      current: usage.questions_asked,
      limit: 5,
      color: 'purple',
    },
    {
      icon: Zap,
      label: 'Flashcards',
      current: usage.flashcards_generated,
      limit: 10,
      color: 'yellow',
    },
    {
      icon: Sparkles,
      label: 'Explicações IA',
      current: usage.ai_explanations_used,
      limit: 2,
      color: 'green',
    },
  ]

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold text-slate-900">
        Uso do Plano FREE
      </h3>

      <div className="space-y-4">
        {resources.map((resource) => {
          const percentage = resource.limit
            ? (resource.current / resource.limit) * 100
            : 0
          const isNearLimit = percentage >= 80
          const isAtLimit = percentage >= 100

          const Icon = resource.icon
          const statusIcon = isAtLimit ? AlertCircle : isNearLimit ? AlertCircle : CheckCircle
          const statusColor = isAtLimit
            ? 'text-red-500'
            : isNearLimit
              ? 'text-orange-500'
              : 'text-green-500'

          return (
            <div key={resource.label}>
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className={`h-4 w-4 text-${resource.color}-500`} />
                  <span className="text-sm font-medium text-slate-700">
                    {resource.label}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-semibold text-slate-900">
                    {resource.current}/{resource.limit}
                  </span>
                  {React.createElement(statusIcon, {
                    className: `h-4 w-4 ${statusColor}`,
                  })}
                </div>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className={`h-full rounded-full transition-all ${
                    isAtLimit
                      ? 'bg-red-500'
                      : isNearLimit
                        ? 'bg-orange-500'
                        : `bg-${resource.color}-500`
                  }`}
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>

      {resources.some((r) => r.limit && r.current >= r.limit) && (
        <div className="mt-4 rounded-lg bg-red-50 p-3">
          <p className="text-xs font-medium text-red-700">
            Você atingiu o limite do plano FREE. Faça upgrade para continuar!
          </p>
        </div>
      )}
    </div>
  )
}

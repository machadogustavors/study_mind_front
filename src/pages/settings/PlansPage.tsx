import { useQuery } from '@tanstack/react-query'
import { Check, Loader2, Sparkles } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { fetchPlans } from '@/services/plans'

export function PlansPage() {
  const { data: plans, isLoading } = useQuery({
    queryKey: ['plans'],
    queryFn: fetchPlans,
  })

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="mb-3 text-4xl font-bold text-slate-900">
          Escolha o plano ideal para você
        </h1>
        <p className="text-lg text-slate-600">
          Comece grátis e faça upgrade quando precisar
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {plans?.map((plan) => {
          const isFree = plan.tier === 'free'
          const isPopular = plan.tier === 'pro'

          return (
            <div
              key={plan.id}
              className={`relative rounded-2xl border-2 bg-white p-6 shadow-sm transition-all hover:shadow-lg ${
                isPopular
                  ? 'border-indigo-500 shadow-indigo-100'
                  : 'border-slate-200'
              }`}
            >
              {isPopular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="flex items-center gap-1 rounded-full bg-indigo-500 px-3 py-1 text-xs font-semibold text-white">
                    <Sparkles className="h-3 w-3" />
                    Mais Popular
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="mb-2 text-xl font-bold text-slate-900">
                  {plan.name}
                </h3>
                <p className="text-sm text-slate-600">{plan.description}</p>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-slate-900">
                    R$ {plan.price_monthly_brl.toFixed(2)}
                  </span>
                  <span className="text-slate-600">/mês</span>
                </div>
                {plan.price_yearly_brl && (
                  <p className="mt-1 text-xs text-slate-500">
                    ou R$ {plan.price_yearly_brl.toFixed(2)}/ano
                  </p>
                )}
              </div>

              <Button
                className={`mb-6 w-full ${
                  isPopular
                    ? 'bg-indigo-600 hover:bg-indigo-700'
                    : isFree
                      ? 'bg-slate-600 hover:bg-slate-700'
                      : 'bg-slate-800 hover:bg-slate-900'
                }`}
                disabled={isFree}
              >
                {isFree ? 'Plano Atual' : 'Assinar'}
              </Button>

              <ul className="space-y-3">
                {plan.documents_per_month !== null && (
                  <li className="flex items-start gap-2 text-sm text-slate-700">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                    {plan.documents_per_month === null
                      ? 'Documentos ilimitados'
                      : `${plan.documents_per_month} documentos/mês`}
                  </li>
                )}
                {plan.questions_per_month !== null && (
                  <li className="flex items-start gap-2 text-sm text-slate-700">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                    {plan.questions_per_month === null
                      ? 'Perguntas ilimitadas'
                      : `${plan.questions_per_month} perguntas/mês`}
                  </li>
                )}
                {plan.ai_explanations_per_day !== null && (
                  <li className="flex items-start gap-2 text-sm text-slate-700">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                    {plan.ai_explanations_per_day === null
                      ? 'Explicações IA ilimitadas'
                      : `${plan.ai_explanations_per_day} explicações/dia`}
                  </li>
                )}
                <li className="flex items-start gap-2 text-sm text-slate-700">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                  {plan.storage_mb / 1024 >= 1
                    ? `${(plan.storage_mb / 1024).toFixed(0)}GB`
                    : `${plan.storage_mb}MB`}{' '}
                  de armazenamento
                </li>
                {plan.advanced_ai_models && (
                  <li className="flex items-start gap-2 text-sm text-slate-700">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                    Modelos avançados (GPT-4, Claude)
                  </li>
                )}
                {plan.priority_support && (
                  <li className="flex items-start gap-2 text-sm text-slate-700">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                    Suporte prioritário
                  </li>
                )}
                {plan.custom_branding && (
                  <li className="flex items-start gap-2 text-sm text-slate-700">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                    Branding personalizado
                  </li>
                )}
              </ul>
            </div>
          )
        })}
      </div>
    </div>
  )
}

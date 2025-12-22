import { useMutation, useQuery } from '@tanstack/react-query'
import { Check, Loader2, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { PageTransition } from '@/components/navigation/PageTransition'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { fetchPlans } from '@/services/plans'
import { createCheckoutSession, fetchUserSubscription } from '@/services/subscriptions'
import { useAuthStore } from '@/store/auth-store'

export function PlansPage() {
  const user = useAuthStore((s) => s.user)
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null)

  const { data: plans, isLoading } = useQuery({
    queryKey: ['plans'],
    queryFn: fetchPlans,
  })

  const { data: subscription } = useQuery({
    queryKey: ['user-subscription'],
    queryFn: fetchUserSubscription,
    enabled: !!user,
  })

  const checkoutMutation = useMutation({
    mutationFn: async (planTier: string) => {
      const baseUrl = window.location.origin
      return createCheckoutSession(
        planTier,
        `${baseUrl}/app/dashboard?payment=success`,
        `${baseUrl}/app/plans?payment=canceled`
      )
    },
    onSuccess: (data) => {
      window.location.href = data.url
    },
    onError: (error) => {
      toast.error('Erro ao iniciar pagamento. Tente novamente.')
      console.error(error)
      setLoadingPlan(null)
    },
  })

  const handleSubscribe = async (planTier: string) => {
    if (!user) {
      toast.error('Você precisa estar logado')
      return
    }

    setLoadingPlan(planTier)
    checkoutMutation.mutate(planTier)
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    )
  }

  const currentPlanTier = subscription?.plan_tier || 'free'

  return (
    <PageTransition>
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="mb-12 text-center">
          <h1 className="mb-3 text-4xl font-bold text-slate-900 dark:text-white">
            Escolha o plano ideal para você
          </h1>
          <p className="text-lg text-slate-600 dark:text-white/70">
            Comece grátis e faça upgrade quando precisar
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {plans?.map((plan) => {
            const isFree = plan.tier === 'free'
            const isPopular = plan.tier === 'pro'
            const isCurrentPlan = plan.tier === currentPlanTier
            const isPlanLoading = loadingPlan === plan.tier

            return (
              <Card
                key={plan.id}
                className={`relative rounded-2xl border-2 bg-white p-6 shadow-sm transition-all hover:shadow-lg dark:bg-midnight-800 ${
                  isPopular
                    ? 'border-brand-500 shadow-brand-100'
                    : isCurrentPlan
                      ? 'border-green-500'
                      : 'border-slate-200 dark:border-white/10'
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="flex items-center gap-1 rounded-full bg-brand-500 px-3 py-1 text-xs font-semibold text-white">
                      <Sparkles className="h-3 w-3" />
                      Mais Popular
                    </span>
                  </div>
                )}

                {isCurrentPlan && (
                  <div className="absolute -top-4 right-4">
                    <span className="rounded-full bg-green-500 px-3 py-1 text-xs font-semibold text-white">
                      Plano Atual
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="mb-2 text-xl font-bold text-slate-900 dark:text-white">
                    {plan.name}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-white/70">{plan.description}</p>
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-slate-900 dark:text-white">
                      R$ {plan.price_monthly_brl.toFixed(2)}
                    </span>
                    <span className="text-slate-600 dark:text-white/70">/mês</span>
                  </div>
                  {plan.price_yearly_brl && (
                    <p className="mt-1 text-xs text-slate-500 dark:text-white/60">
                      ou R$ {plan.price_yearly_brl.toFixed(2)}/ano (economize 17%)
                    </p>
                  )}
                </div>

                <Button
                  className={`mb-6 w-full ${
                    isPopular
                      ? 'bg-brand-600 hover:bg-brand-700'
                      : isFree
                        ? 'bg-slate-600 hover:bg-slate-700'
                        : 'bg-slate-800 hover:bg-slate-900'
                  }`}
                  disabled={isCurrentPlan || isPlanLoading}
                  onClick={() => handleSubscribe(plan.tier)}
                >
                  {isPlanLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processando...
                    </>
                  ) : isCurrentPlan ? (
                    'Plano Atual'
                  ) : isFree ? (
                    'Gratuito'
                  ) : (
                    'Assinar'
                  )}
                </Button>

                <ul className="space-y-3">
                  {(plan.documents_per_month !== null || plan.tier === 'pro' || plan.tier === 'premium') && (
                    <li className="flex items-start gap-2 text-sm text-slate-700 dark:text-white/80">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                      {plan.documents_per_month === null
                        ? 'Documentos ilimitados'
                        : `${plan.documents_per_month} documentos/mês`}
                    </li>
                  )}
                  {(plan.questions_per_month !== null || plan.tier === 'pro' || plan.tier === 'premium') && (
                    <li className="flex items-start gap-2 text-sm text-slate-700 dark:text-white/80">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                      {plan.questions_per_month === null
                        ? 'Perguntas ilimitadas'
                        : `${plan.questions_per_month} perguntas/mês`}
                    </li>
                  )}
                  {(plan.ai_explanations_per_day !== null || plan.tier === 'pro' || plan.tier === 'premium') && (
                    <li className="flex items-start gap-2 text-sm text-slate-700 dark:text-white/80">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                      {plan.ai_explanations_per_day === null
                        ? 'Explicações IA ilimitadas'
                        : `${plan.ai_explanations_per_day} explicações/dia`}
                    </li>
                  )}
                  <li className="flex items-start gap-2 text-sm text-slate-700 dark:text-white/80">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                    {plan.storage_mb / 1024 >= 1
                      ? `${(plan.storage_mb / 1024).toFixed(0)}GB`
                      : `${plan.storage_mb}MB`}{' '}
                    de armazenamento
                  </li>
                  {plan.advanced_ai_models && (
                    <li className="flex items-start gap-2 text-sm text-slate-700 dark:text-white/80">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                      Modelos avançados (GPT-4, Claude)
                    </li>
                  )}
                  {plan.priority_support && (
                    <li className="flex items-start gap-2 text-sm text-slate-700 dark:text-white/80">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                      Suporte prioritário
                    </li>
                  )}
                  {plan.custom_branding && (
                    <li className="flex items-start gap-2 text-sm text-slate-700 dark:text-white/80">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                      Branding personalizado
                    </li>
                  )}
                </ul>
              </Card>
            )
          })}
        </div>
      </div>
    </PageTransition>
  )
}

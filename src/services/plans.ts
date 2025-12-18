import { api } from '@/lib/api-client'
import type { Plan } from '@/types/api'

export async function fetchPlans() {
  const { data } = await api.get<Plan[]>('/plans')
  return data
}

export async function fetchPlanByTier(tier: string) {
  const plans = await fetchPlans()
  return plans.find((p) => p.tier === tier)
}

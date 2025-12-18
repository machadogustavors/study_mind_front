import { api } from '@/lib/api-client'
import type { Subscription, UsageStats } from '@/types/api'

export async function fetchUserSubscription() {
  const { data } = await api.get<Subscription>('/subscriptions/me')
  return data
}

export async function fetchUsageStats() {
  const { data } = await api.get<UsageStats>('/subscriptions/usage')
  return data
}

export async function cancelSubscription(subscriptionId: number) {
  const { data } = await api.post(`/subscriptions/${subscriptionId}/cancel`)
  return data
}

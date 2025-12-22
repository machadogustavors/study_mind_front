import { api } from '@/lib/api-client'
import type { Subscription, UsageStats } from '@/types/api'

export async function fetchUserSubscription() {
  const { data } = await api.get<Subscription>('/subscriptions/current')
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

export async function upgradeSubscription(planTier: string) {
  const { data } = await api.post<Subscription>('/subscriptions/upgrade', { plan_tier: planTier })
  return data
}

export async function checkQuota(resource: string) {
  const { data } = await api.get(`/subscriptions/quota/${resource}`)
  return data
}

export async function createCheckoutSession(planTier: string, successUrl: string, cancelUrl: string) {
  const { data } = await api.post<{ session_id: string; url: string }>('/payments/create-checkout-session', {
    plan_tier: planTier,
    success_url: successUrl,
    cancel_url: cancelUrl,
  })
  return data
}

export async function createCustomerPortalSession(returnUrl: string) {
  const { data } = await api.post<{ url: string }>('/payments/customer-portal', {
    return_url: returnUrl,
  })
  return data
}

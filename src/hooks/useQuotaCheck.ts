import { useState, useCallback } from 'react'

import { checkQuota } from '@/services/subscriptions'
import { useAuthStore } from '@/store/auth-store'

export function useQuotaCheck() {
  const user = useAuthStore((s) => s.user)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [quotaResource, setQuotaResource] = useState<string>('recurso')

  const checkResourceQuota = useCallback(
    async (resource: string) => {
      if (!user) return { allowed: false, reason: 'User not logged in' }

      try {
        const result = await checkQuota(resource)
        
        if (!result.allowed && result.upgrade_required) {
          setQuotaResource(resource)
          setShowUpgradeModal(true)
        }
        
        return result
      } catch (error) {
        console.error('Error checking quota:', error)
        return { allowed: false, reason: 'Error checking quota' }
      }
    },
    [user]
  )

  return {
    checkResourceQuota,
    showUpgradeModal,
    setShowUpgradeModal,
    quotaResource,
  }
}

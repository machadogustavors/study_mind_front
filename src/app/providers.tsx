import { QueryClientProvider } from '@tanstack/react-query'
import { type ReactNode, useEffect } from 'react'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { queryClient } from '@/lib/query-client'
import { useAuthStore } from '@/store/auth-store'

export function AppProviders({ children }: { children: ReactNode }) {
  const initialize = useAuthStore((state) => state.initialize)

  useEffect(() => {
    initialize()
  }, [initialize])

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} position="bottom-right" buttonPosition="bottom-right" />
    </QueryClientProvider>
  )
}

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'

import { fetchProfile, signIn, signUp } from '@/services/auth'
import { ROUTES } from '@/constants/routes'
import { useAuthStore } from '@/store/auth-store'

const credentialsSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Mínimo de 6 caracteres'),
})

export function useAuthActions() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { setToken, setUser } = useAuthStore.getState()

  const handleSuccess = async (accessToken: string) => {
    setToken(accessToken)
    const profile = await fetchProfile()
    setUser(profile)
    await queryClient.invalidateQueries({ queryKey: ['documents'] })
    navigate(ROUTES.dashboard)
  }

  const signupMutation = useMutation({
    mutationFn: (values: z.infer<typeof credentialsSchema>) => signUp(values),
    onSuccess: async (token) => {
      await handleSuccess(token.access_token)
    },
  })

  const signinMutation = useMutation({
    mutationFn: (values: z.infer<typeof credentialsSchema>) => signIn(values),
    onSuccess: async (token) => {
      await handleSuccess(token.access_token)
    },
  })

  return { signinMutation, signupMutation, credentialsSchema }
}

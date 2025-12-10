import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { isAxiosError } from 'axios'
import type { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ROUTES } from '@/constants/routes'
import { useAuthActions } from '@/hooks/useAuthActions'

import { AuthLayout } from './AuthLayout'

export function SignUpPage() {
  const { signupMutation, credentialsSchema } = useAuthActions()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof credentialsSchema>>({
    resolver: zodResolver(credentialsSchema),
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = handleSubmit(async (values) => {
    try {
      await signupMutation.mutateAsync(values)
    } catch (error) {
      console.error('signup failed', error)
    }
  })

  const serverError = isAxiosError(signupMutation.error)
    ? signupMutation.error.response?.data?.detail ?? 'Não foi possível criar a conta.'
    : signupMutation.error instanceof Error
      ? signupMutation.error.message
      : null

  return (
    <AuthLayout
      title="Crie uma conta StudyMind"
      subtitle="Planos personalizados, mapas mentais e revisão inteligente."
      footerHint="Já possui conta?"
      footerCta="Entrar"
      footerHref={ROUTES.signin}
    >
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="space-y-4">
          <label className="block text-sm font-semibold text-slate-600">
            E-mail
            <Input type="email" placeholder="você@exemplo.com" {...register('email')} />
            {errors.email ? <span className="mt-1 block text-xs text-red-500">{errors.email.message}</span> : null}
          </label>
          <label className="block text-sm font-semibold text-slate-600">
            Senha
            <Input type="password" placeholder="Mínimo 6 caracteres" {...register('password')} />
            {errors.password ? (
              <span className="mt-1 block text-xs text-red-500">{errors.password.message}</span>
            ) : null}
          </label>
        </div>
        {serverError ? <p className="rounded-xl bg-red-50 px-3 py-2 text-xs font-medium text-red-600">{serverError}</p> : null}
        <Button type="submit" className="w-full" disabled={signupMutation.isPending}>
          {signupMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Criando conta...
            </>
          ) : (
            'Criar conta'
          )}
        </Button>
      </form>
    </AuthLayout>
  )
}

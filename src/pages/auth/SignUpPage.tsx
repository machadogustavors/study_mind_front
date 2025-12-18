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
  const { signupMutation, signUpSchema } = useAuthActions()
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { 
      email: '', 
      password: '',
      full_name: '',
      cpf: '',
      phone: '',
      street: '',
      city: '',
      state: '',
      postal_code: '',
      country: 'BR',
    },
  })

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 11) {
      return numbers
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
    }
    return value
  }

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 11) {
      return numbers
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2')
    }
    return value
  }

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value)
    setValue('cpf', formatted)
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value)
    setValue('phone', formatted)
  }

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
      subtitle="Comece grátis com 1 documento e 5 perguntas."
      footerHint="Já possui conta?"
      footerCta="Entrar"
      footerHref={ROUTES.signin}
    >
      <form onSubmit={onSubmit} className="space-y-6 overflow-y-auto max-h-[510px]">
        <div className="space-y-4">
          <label className="block text-sm font-semibold text-slate-600">
            Nome completo
            <Input type="text" placeholder="Seu nome completo" {...register('full_name')} />
            {errors.full_name ? <span className="mt-1 block text-xs text-red-500">{errors.full_name.message}</span> : null}
          </label>
          
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

          <div className="grid grid-cols-2 gap-3">
            <label className="block text-sm font-semibold text-slate-600">
              CPF
              <Input 
                type="text" 
                placeholder="000.000.000-00" 
                {...register('cpf')}
                onChange={handleCPFChange}
                maxLength={14}
              />
              {errors.cpf ? <span className="mt-1 block text-xs text-red-500">{errors.cpf.message}</span> : null}
            </label>
            
            <label className="block text-sm font-semibold text-slate-600">
              Telefone
              <Input 
                type="text" 
                placeholder="(00) 00000-0000" 
                {...register('phone')}
                onChange={handlePhoneChange}
                maxLength={15}
              />
              {errors.phone ? <span className="mt-1 block text-xs text-red-500">{errors.phone.message}</span> : null}
            </label>
          </div>

          <details className="group">
            <summary className="cursor-pointer text-sm font-medium text-slate-500 hover:text-slate-700">
              + Adicionar endereço (opcional)
            </summary>
            <div className="mt-3 space-y-3">
              <label className="block text-sm font-semibold text-slate-600">
                Endereço
                <Input type="text" placeholder="Rua, número" {...register('street')} />
              </label>
              
              <div className="grid grid-cols-3 gap-3">
                <label className="col-span-2 block text-sm font-semibold text-slate-600">
                  Cidade
                  <Input type="text" placeholder="Cidade" {...register('city')} />
                </label>
                
                <label className="block text-sm font-semibold text-slate-600">
                  UF
                  <Input type="text" placeholder="SP" maxLength={2} {...register('state')} />
                </label>
              </div>
              
              <label className="block text-sm font-semibold text-slate-600">
                CEP
                <Input type="text" placeholder="00000-000" {...register('postal_code')} />
              </label>
            </div>
          </details>
        </div>
        
        {serverError ? <p className="rounded-xl bg-red-50 px-3 py-2 text-xs font-medium text-red-600">{serverError}</p> : null}
        
        <Button type="submit" className="w-full" disabled={signupMutation.isPending}>
          {signupMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Criando conta...
            </>
          ) : (
            'Criar conta grátis'
          )}
        </Button>
      </form>
    </AuthLayout>
  )
}

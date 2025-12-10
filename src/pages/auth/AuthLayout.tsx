import type { ReactNode } from 'react'
import { ArrowRight, BookOpenCheck, Sparkles, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

import { ROUTES } from '@/constants/routes'
import { PageTransition } from '@/components/navigation/PageTransition'

export type AuthLayoutProps = {
  title: string
  subtitle: string
  footerHint: string
  footerCta: string
  footerHref: string
  children: ReactNode
}

export function AuthLayout({ title, subtitle, children, footerHint, footerCta, footerHref }: AuthLayoutProps) {
  return (
    <PageTransition>
      <div className="flex min-h-screen flex-col text-white lg:flex-row p-10">
        <div className="flex flex-1 flex-col justify-between px-10 py-12">
          <div className='flex flex-col items-center'>
            <Link to={ROUTES.landing} className="self-start mb-6 flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors">
              <ArrowLeft className="h-4 w-4" />
              Voltar para início
            </Link>
            <div className="flex items-center gap-3 text-xl font-semibold">
              <BookOpenCheck className="h-8 w-8 text-brand-400" />
              StudyMind AI
            </div>
            <p className="mt-6 max-w-lg text-lg text-white/70">
              Domine seus estudos com IA: envie PDFs, receba resumos inteligentes, flashcards SRS e planos diários acionáveis.
            </p>
          </div>
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 text-center">
              <div className="relative flex flex-col items-center gap-1 pt-2">
                <Sparkles
                  className="pointer-events-none absolute left-0 top-1/2 h-10 w-10 -translate-y-1/2 text-brand-400"
                  aria-hidden="true"
                />
                <p className="text-sm uppercase tracking-wide text-white/60">Novidade</p>
                <p className="text-lg font-semibold">Mapa mental automático</p>
              </div>
              <p className="mt-4 text-white/70">Converta o resumo em um mapa navegável pronto para revisão visual.</p>
            </div>
            <Link to={ROUTES.signup} className="inline-flex items-center text-sm font-semibold text-white/80">
              Conheça todos os recursos
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
        <main className="flex flex-1 items-center justify-center bg-white px-6 py-12 text-midnight shadow-2xl rounded-3xl">
          <div className="w-full max-w-md space-y-8">
            <header className="space-y-2 text-center">
              <h1 className="text-3xl font-semibold text-midnight">{title}</h1>
              <p className="text-sm text-slate-600">{subtitle}</p>
            </header>
            <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-card">
              {children}
            </section>
            <footer className="text-center text-sm text-slate-500">
              {footerHint}{' '}
              <Link to={footerHref} className="font-semibold text-brand-600">
                {footerCta}
              </Link>
            </footer>
          </div>
        </main>
      </div>
    </PageTransition>
  )
}

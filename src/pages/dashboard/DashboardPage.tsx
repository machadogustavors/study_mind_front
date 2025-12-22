import { Loader2, UploadCloud } from 'lucide-react'
import { Link } from 'react-router-dom'

import { UsageCard } from '@/components/data/UsageCard'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { ROUTES } from '@/constants/routes'
import { useDocumentsQuery } from '@/hooks/useDocumentsQuery'
import { formatDate } from '@/utils/format'
import { PageTransition } from '@/components/navigation/PageTransition'

export function DashboardPage() {
  const { data: documents, isLoading } = useDocumentsQuery()

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-400" />
      </div>
    )
  }

  const items = documents ?? []
  const today = new Date().toDateString()
  const todaysTasks = items.filter((doc) => new Date(doc.created_at).toDateString() === today).slice(0, 3)
  const recentStudies = [...items]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 4)
  const weeklyDocuments = items.filter((doc) => Date.now() - new Date(doc.created_at).getTime() <= 7 * 24 * 60 * 60 * 1000)
  const weeklyProgress = items.length ? Math.round((weeklyDocuments.length / items.length) * 100) : 0

  return (
    <PageTransition>
      <section className="space-y-8">
        <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-wider text-slate-500 dark:text-white/60">Visão geral</p>
          <h1 className="text-3xl font-semibold text-midnight dark:text-white">Painel inteligente</h1>
          <p className="text-slate-500 dark:text-white/70">Acompanhe uploads recentes e transforme-os em planos de estudo.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link to={ROUTES.upload} className="inline-flex items-center gap-2">
              <UploadCloud className="h-4 w-4" />
              Novo upload
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to={ROUTES.studyPlan}>Gerar plano</Link>
          </Button>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        <UsageCard />
        
        <Card>
          <CardHeader>
            <CardTitle>Tarefas do dia</CardTitle>
            <CardDescription>Baseado nos documentos enviados hoje</CardDescription>
          </CardHeader>
          <CardContent>
            {todaysTasks.length === 0 ? (
              <p className="text-sm text-slate-500 dark:text-white/70">Nenhum documento novo hoje. Faça um upload para começar.</p>
            ) : (
              <ul className="space-y-3">
                {todaysTasks.map((doc) => (
                  <li key={doc.id} className="rounded-2xl border border-slate-100 px-4 py-3 dark:border-white/10">
                    <p className="text-sm font-semibold text-midnight dark:text-white">{doc.filename}</p>
                    <p className="text-xs text-slate-500 dark:text-white/60">{formatDate(doc.created_at)}</p>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Progresso semanal</CardTitle>
            <CardDescription>{weeklyDocuments.length} documentos processados nos últimos 7 dias</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Progress value={weeklyProgress} />
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-semibold text-midnight dark:text-white">{weeklyProgress}%</span>
              <span className="text-xs uppercase tracking-wide text-slate-500 dark:text-white/60">do total</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Últimos estudos</CardTitle>
            <CardDescription>Continue de onde parou</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {recentStudies.map((doc) => (
                <li key={doc.id} className="flex items-center justify-between rounded-2xl border border-slate-100 px-4 py-3 text-sm dark:border-white/10">
                  <div>
                    <p className="font-semibold text-midnight dark:text-white">{doc.filename}</p>
                    <p className="text-xs text-slate-500 dark:text-white/60">{formatDate(doc.created_at)}</p>
                  </div>
                  <Button asChild size="sm" variant="ghost">
                    <Link to={ROUTES.document(doc.id)}>Abrir</Link>
                  </Button>
                </li>
              ))}
              {recentStudies.length === 0 ? (
                <p className="text-sm text-slate-500 dark:text-white/70">Nenhum documento encontrado.</p>
              ) : null}
            </ul>
          </CardContent>
        </Card>
      </div>
    </section>
    </PageTransition>
  )
}

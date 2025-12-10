import { useMemo, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useDocumentsQuery } from '@/hooks/useDocumentsQuery'
import { useStudyPlanStore } from '@/store/study-plan-store'
import { useFlashcardStudyStore } from '@/store/flashcard-study-store'

const periods = [
  { key: '7d', label: '7 dias' },
  { key: '30d', label: '30 dias' },
  { key: 'all', label: 'Tudo' },
] as const

export function ProgressPage() {
  const documentsQuery = useDocumentsQuery()
  const { currentPlan } = useStudyPlanStore()
  const flashcardProgress = useFlashcardStudyStore((state) => state.progress)
  const [period, setPeriod] = useState<(typeof periods)[number]['key']>('7d')

  const documents = documentsQuery.data ?? []

  const filteredDocuments = useMemo(() => {
    if (period === 'all') return documents
    const limit = period === '7d' ? 7 : 30
    return documents.filter((doc) => Date.now() - new Date(doc.created_at).getTime() <= limit * 24 * 60 * 60 * 1000)
  }, [documents, period])

  const completedTasks = currentPlan?.tasks.filter((task) => task.completed) ?? []
  const completionRate = currentPlan?.tasks.length
    ? Math.round((completedTasks.length / currentPlan.tasks.length) * 100)
    : 0
  const studyHours = completedTasks.reduce((total, task) => total + task.hours, 0)
  const flashcardSessions = Object.keys(flashcardProgress).length

  return (
    <section className="space-y-8">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-widest text-slate-500 dark:text-white/60">Progresso</p>
          <h1 className="text-3xl font-semibold text-midnight dark:text-white">Painel de desempenho</h1>
        </div>
        <div className="flex gap-2">
          {periods.map((item) => (
            <Button
              key={item.key}
              variant={period === item.key ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setPeriod(item.key)}
            >
              {item.label}
            </Button>
          ))}
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Tempo estudado</CardTitle>
            <CardDescription>Tarefas concluídas do plano</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-semibold text-brand-600 dark:text-brand-300">{studyHours}h</div>
            <p className="text-xs text-slate-500 dark:text-white/60">Somente tarefas marcadas como concluídas</p>
            <div className="mt-4 h-3 rounded-full bg-slate-200 dark:bg-white/10">
              <div className="h-full rounded-full bg-brand-500" style={{ width: `${Math.min(100, studyHours * 5)}%` }} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Concluído</CardTitle>
            <CardDescription>Status do plano atual</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-semibold text-midnight dark:text-white">{completionRate}%</div>
            <p className="text-xs text-slate-500 dark:text-white/60">{completedTasks.length} de {currentPlan?.tasks.length ?? 0} tarefas</p>
            <div className="mt-4 grid grid-cols-5 gap-1">
              {(currentPlan?.tasks ?? []).slice(0, 15).map((task) => (
                <span
                  key={task.id}
                  className={`h-3 rounded-full ${task.completed ? 'bg-emerald-400' : 'bg-slate-200 dark:bg-white/10'}`}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revisões SRS</CardTitle>
            <CardDescription>Cartões agendados no algoritmo</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-semibold text-midnight dark:text-white">{flashcardSessions}</div>
            <p className="text-xs text-slate-500 dark:text-white/60">Flashcards com próxima revisão definida</p>
            <div className="mt-4 space-y-2 text-xs text-slate-500 dark:text-white/60">
              {Object.values(flashcardProgress).slice(0, 4).map((item) => (
                <div key={item.cardId} className="flex justify-between">
                  <span>Card #{item.cardId}</span>
                  <span>{new Date(item.dueDate).toLocaleDateString('pt-BR')}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Documentos estudados</CardTitle>
          <CardDescription>Filtro: {period === 'all' ? 'Todos os envios' : periods.find((p) => p.key === period)?.label}</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredDocuments.length ? (
            <div className="grid gap-4 md:grid-cols-3">
              {filteredDocuments.map((doc) => (
                <div key={doc.id} className="rounded-2xl border border-slate-100 bg-white/70 p-4 text-sm text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-white">
                  <p className="font-semibold">{doc.filename}</p>
                  <p className="text-xs text-slate-500 dark:text-white/60">{new Date(doc.created_at).toLocaleDateString('pt-BR')}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500 dark:text-white/70">Nenhum documento neste período.</p>
          )}
        </CardContent>
      </Card>
    </section>
  )
}

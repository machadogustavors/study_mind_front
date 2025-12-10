import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useDocumentsQuery } from '@/hooks/useDocumentsQuery'
import { useStudyPlanStore } from '@/store/study-plan-store'
import type { StudyPlanInput } from '@/lib/study-plan-generator'
import { formatDate } from '@/utils/format'
import { PageTransition } from '@/components/navigation/PageTransition'

const planSchema = z.object({
  userProfile: z.string().min(3),
  objective: z.string().min(3),
  weeks: z.number().min(1).max(12),
  hoursPerDay: z.number().min(1).max(8),
})

type PlanForm = StudyPlanInput

export function StudyPlanPage() {
  const documentsQuery = useDocumentsQuery()
  const { currentPlan, generatePlan, toggleTask, resetPlan } = useStudyPlanStore()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PlanForm>({
    resolver: zodResolver(planSchema),
    defaultValues: { userProfile: 'Estudante', objective: 'Dominar a disciplina', weeks: 4, hoursPerDay: 2 },
  })

  const onSubmit = handleSubmit(async (values) => {
    const docs = documentsQuery.data ?? []
    generatePlan(values, docs)
  })

  return (
    <PageTransition>
      <section className="space-y-8">
      <header>
        <p className="text-sm uppercase tracking-widest text-slate-500 dark:text-white/60">Plano de estudos</p>
        <h1 className="text-3xl font-semibold text-midnight dark:text-white">Cronograma personalizado</h1>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Gerar plano</CardTitle>
            <CardDescription>Defina objetivos e horas disponíveis por dia</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-4">
              <label className="block text-sm font-semibold text-slate-600 dark:text-white/80">
                Perfil do estudante
                <Input {...register('userProfile')} placeholder="Ex: Vestibular medicina" />
                {errors.userProfile ? <span className="text-xs text-red-500">{errors.userProfile.message}</span> : null}
              </label>
              <label className="block text-sm font-semibold text-slate-600 dark:text-white/80">
                Objetivo principal
                <Input {...register('objective')} placeholder="Ex: Revisar biologia em 4 semanas" />
                {errors.objective ? <span className="text-xs text-red-500">{errors.objective.message}</span> : null}
              </label>
              <div className="grid grid-cols-2 gap-4">
                <label className="text-sm font-semibold text-slate-600 dark:text-white/80">
                  Semanas
                  <Input type="number" min={1} max={12} {...register('weeks', { valueAsNumber: true })} />
                  {errors.weeks ? <span className="text-xs text-red-500">{errors.weeks.message}</span> : null}
                </label>
                <label className="text-sm font-semibold text-slate-600 dark:text-white/80">
                  Horas/dia
                  <Input type="number" step={0.5} min={1} max={8} {...register('hoursPerDay', { valueAsNumber: true })} />
                  {errors.hoursPerDay ? <span className="text-xs text-red-500">{errors.hoursPerDay.message}</span> : null}
                </label>
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Gerar plano
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cronograma diário</CardTitle>
            <CardDescription>Marque as tarefas concluídas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {currentPlan ? (
              <>
                <div className="flex items-center justify-between rounded-2xl border border-slate-100 px-4 py-3 text-sm dark:border-white/10">
                  <div>
                    <p className="font-semibold text-midnight dark:text-white">{currentPlan.input.objective}</p>
                    <p className="text-xs text-slate-500 dark:text-white/60">{currentPlan.input.weeks} semanas · {currentPlan.input.hoursPerDay}h/dia</p>
                  </div>
                  <Button variant="ghost" onClick={resetPlan}>
                    Resetar
                  </Button>
                </div>
                <div className="max-h-[320px] space-y-2 overflow-y-auto pr-1">
                  {currentPlan.tasks.map((task) => (
                    <button
                      key={task.id}
                      onClick={() => toggleTask(task.id)}
                      className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left text-sm transition ${
                        task.completed
                          ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-300/40 dark:bg-emerald-300/10 dark:text-emerald-200'
                          : 'border-slate-100 bg-white text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-white'
                      }`}
                    >
                      <div>
                        <p className="font-semibold">{task.title}</p>
                        <p className="text-xs text-slate-500 dark:text-white/60">{formatDate(task.date)}</p>
                      </div>
                      <span className="text-xs uppercase tracking-wide">{task.hours}h</span>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-sm text-slate-500 dark:text-white/70">Gere um plano para ver as tarefas diárias.</p>
            )}
          </CardContent>
        </Card>
      </div>

      {currentPlan ? (
        <Card>
          <CardHeader>
            <CardTitle>Visão semanal</CardTitle>
            <CardDescription>Recalcule caso esteja atrasado</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {currentPlan.schedule.map((week) => (
                <div key={week.week} className="rounded-2xl border border-slate-100 bg-white/70 p-4 text-sm dark:border-white/10 dark:bg-white/5 dark:text-white">
                  <p className="text-xs uppercase tracking-wide text-slate-400 dark:text-white/50">Semana {week.week}</p>
                  <p className="text-base font-semibold">{week.milestone}</p>
                  <ul className="mt-2 space-y-1 text-xs text-slate-500 dark:text-white/70">
                    {week.focusTopics.map((topic) => (
                      <li key={topic}>• {topic}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <Button variant="outline" onClick={() => generatePlan(currentPlan.input, documentsQuery.data ?? [])}>
              Recalcular agora
            </Button>
          </CardContent>
        </Card>
      ) : null}
    </section>
    </PageTransition>
  )
}

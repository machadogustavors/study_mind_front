import { useEffect, useMemo, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { Loader2, RefreshCw, Sparkles, Wand2 } from 'lucide-react'
import { useParams } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useFlashcardsQuery, useDocumentQuery, useSummariesQuery } from '@/hooks/useDocumentsQuery'
import { useStudyPlanStore } from '@/store/study-plan-store'
import { createSummary } from '@/services/summaries'
import { generateFlashcards } from '@/services/flashcards'
import type { CreateSummaryPayload } from '@/services/summaries'
import { extractSummaryInsights, buildMindMapNodes } from '@/utils/summary'
import { formatDate } from '@/utils/format'

export function GeneratedContentPage() {
  const params = useParams<{ documentId: string }>()
  const documentId = Number(params.documentId)

  const documentQuery = useDocumentQuery(Number.isNaN(documentId) ? undefined : documentId)
  const summariesQuery = useSummariesQuery(documentId)
  const flashcardsQuery = useFlashcardsQuery(documentId)

  const [selectedSummaryId, setSelectedSummaryId] = useState<number | null>(null)
  const [summaryLevel, setSummaryLevel] = useState<CreateSummaryPayload['level']>('medium')
  const [activeTab, setActiveTab] = useState('resumo')

  const { currentPlan, addTasksFromSummary, generatePlan } = useStudyPlanStore()

  useEffect(() => {
    if (!selectedSummaryId && summariesQuery.data?.length) {
      setSelectedSummaryId(summariesQuery.data[0].id)
    }
  }, [summariesQuery.data, selectedSummaryId])

  const selectedSummary = useMemo(() => {
    if (!summariesQuery.data?.length) return null
    return summariesQuery.data.find((summary) => summary.id === selectedSummaryId) ?? summariesQuery.data[0]
  }, [summariesQuery.data, selectedSummaryId])

  const insights = useMemo(() => extractSummaryInsights(selectedSummary ?? undefined), [selectedSummary])
  const mindMapNodes = useMemo(() => buildMindMapNodes(insights.bullets), [insights.bullets])

  const summaryMutation = useMutation({
    mutationFn: () => createSummary(documentId, { level: summaryLevel }),
    onSuccess: async (summary) => {
      await summariesQuery.refetch()
      setSelectedSummaryId(summary.id)
    },
  })

  const flashcardsMutation = useMutation({
    mutationFn: () => generateFlashcards(selectedSummary?.id ?? 0, 8),
    onSuccess: async () => {
      await flashcardsQuery.refetch()
      setActiveTab('flashcards')
    },
  })

  const handleAddToPlan = () => {
    if (!selectedSummary) return
    if (!currentPlan) {
      generatePlan({
        userProfile: 'Estudante avançado',
        objective: documentQuery.data?.filename ?? 'Revisão personalizada',
        weeks: 4,
        hoursPerDay: 2,
      })
    }
    addTasksFromSummary(documentQuery.data?.filename ?? 'Conteúdo', insights.bullets, documentId)
  }

  if (documentQuery.isLoading || summariesQuery.isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-400" />
      </div>
    )
  }

  if (!documentQuery.data) {
    return <p className="text-sm text-red-500">Documento não encontrado.</p>
  }

  const document = documentQuery.data

  return (
    <section className="space-y-8">
      <header className="space-y-3">
        <p className="text-xs uppercase tracking-widest text-slate-500 dark:text-white/60">Conteúdo gerado</p>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-midnight dark:text-white">{document.filename}</h1>
            <p className="text-sm text-slate-500 dark:text-white/60">Enviado em {formatDate(document.created_at)}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Select value={summaryLevel} onChange={(event) => setSummaryLevel(event.target.value as CreateSummaryPayload['level'])}>
              <option value="basic">Nível básico</option>
              <option value="medium">Nível intermediário</option>
              <option value="advanced">Nível avançado</option>
            </Select>
            <Button onClick={() => summaryMutation.mutate()} disabled={summaryMutation.isPending || !documentId} className="min-w-40">
              {summaryMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
              Gerar resumo
            </Button>
            <Button variant="outline" onClick={handleAddToPlan} disabled={!insights.bullets.length}>
              <Sparkles className="mr-2 h-4 w-4" />
              Adicionar ao plano
            </Button>
          </div>
        </div>
      </header>

      <Card>
        <CardHeader className="gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <CardTitle>Versões de resumo</CardTitle>
            <CardDescription>Selecione a versão desejada para navegar pelos conteúdos</CardDescription>
          </div>
          {summariesQuery.data?.length ? (
            <Select value={String(selectedSummary?.id ?? '')} onChange={(event) => setSelectedSummaryId(Number(event.target.value))}>
              {summariesQuery.data.map((summary) => (
                <option key={summary.id} value={summary.id}>
                  {summary.level.toUpperCase()} · {formatDate(summary.created_at)}
                </option>
              ))}
            </Select>
          ) : null}
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} defaultValue="resumo" onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="resumo">Resumo</TabsTrigger>
              <TabsTrigger value="flashcards">Flashcards</TabsTrigger>
              <TabsTrigger value="questoes">Questões</TabsTrigger>
              <TabsTrigger value="mapa">Mapa mental</TabsTrigger>
            </TabsList>

            <TabsContent value="resumo">
              {selectedSummary ? (
                <div className="space-y-4 rounded-3xl border border-slate-100 bg-white/70 p-6 text-sm text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-white/80">
                  {insights.bullets.length ? (
                    <ul className="list-disc space-y-2 pl-5">
                      {insights.bullets.map((bullet, index) => (
                        <li key={index}>{bullet}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="whitespace-pre-line">{selectedSummary.summary_text}</p>
                  )}
                  <p className="text-xs uppercase tracking-wide text-slate-400 dark:text-white/50">Nível {selectedSummary.level}</p>
                </div>
              ) : (
                <p className="text-sm text-slate-500 dark:text-white/70">Gere um resumo para visualizar aqui.</p>
              )}
            </TabsContent>

            <TabsContent value="flashcards">
              <div className="mb-4 flex flex-wrap gap-3">
                <Button variant="secondary" onClick={() => flashcardsMutation.mutate()} disabled={!selectedSummary || flashcardsMutation.isPending}>
                  {flashcardsMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
                  Regenerar flashcards
                </Button>
                <Button variant="outline" onClick={() => setActiveTab('questoes')}>
                  Ver questões
                </Button>
              </div>
              {flashcardsQuery.data?.length ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {flashcardsQuery.data.map((card) => (
                    <div key={card.id} className="rounded-2xl border border-slate-100 bg-white/80 p-4 text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-white">
                      <p className="font-semibold">{card.question}</p>
                      <p className="mt-2 text-sm text-slate-500 dark:text-white/70">{card.answer}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500 dark:text-white/70">Nenhum flashcard gerado ainda.</p>
              )}
            </TabsContent>

            <TabsContent value="questoes">
              {insights.questions.length ? (
                <ol className="space-y-3 text-sm text-slate-700 dark:text-white/80">
                  {insights.questions.map((question, index) => (
                    <li key={question} className="rounded-2xl border border-slate-100 bg-white/70 px-4 py-3 dark:border-white/10 dark:bg-white/5">
                      <span className="font-semibold">{index + 1}.</span> {question}
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="text-sm text-slate-500 dark:text-white/70">Nenhuma questão disponível. Gere um novo resumo para receber sugestões.</p>
              )}
            </TabsContent>

            <TabsContent value="mapa">
              {mindMapNodes.length ? (
                <div className="relative mx-auto h-[360px] w-full max-w-xl rounded-full border border-dashed border-slate-200 dark:border-white/15">
                  <div className="absolute left-1/2 top-1/2 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-brand-500 text-center text-sm font-semibold text-white shadow-lg">
                    Tema principal
                  </div>
                  {mindMapNodes.map((node) => (
                    <div
                      key={node.id}
                      className="absolute flex h-20 w-20 items-center justify-center rounded-2xl border border-brand-200 bg-white/80 p-3 text-center text-xs font-semibold text-brand-800 shadow-sm dark:border-white/20 dark:bg-white/5 dark:text-white"
                      style={{
                        left: `${50 + 38 * Math.cos((node.angle * Math.PI) / 180)}%`,
                        top: `${50 + 38 * Math.sin((node.angle * Math.PI) / 180)}%`,
                        transform: 'translate(-50%, -50%)',
                      }}
                    >
                      {node.label}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500 dark:text-white/70">Gere um resumo para construir o mapa mental automaticamente.</p>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </section>
  )
}

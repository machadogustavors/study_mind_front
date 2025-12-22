import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Loader2, MessageSquare, Send, History, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PageTransition } from '@/components/navigation/PageTransition'
import { UpgradeModal } from '@/components/feedback/UpgradeModal'
import { useDocumentsQuery } from '@/hooks/useDocumentsQuery'
import { askQuestion, getQuestionsByDocument, getRecentQuestions } from '@/services/questions'
import { formatDate } from '@/utils/format'
import type { QuestionDto } from '@/types/api'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { useQuotaCheck } from '@/hooks/useQuotaCheck'

function parseAnswerText(text: string): string {
  try {
    if (text.trim().startsWith('{') || text.trim().startsWith('```json')) {
      const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      const parsed = JSON.parse(cleanText)
      return parsed.resposta || parsed.answer || text
    }
  } catch {
    // sem tratametno
  }
  return text
}

export function QuestionsPage() {
  const [selectedDocumentId, setSelectedDocumentId] = useState<number | null>(null)
  const [questionText, setQuestionText] = useState('')
  const [selectedQuestion, setSelectedQuestion] = useState<QuestionDto | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  
  const documentsQuery = useDocumentsQuery()
  const queryClient = useQueryClient()
  const { checkResourceQuota, showUpgradeModal, setShowUpgradeModal, quotaResource } = useQuotaCheck()

  const questionsQuery = useQuery({
    queryKey: ['questions', selectedDocumentId],
    queryFn: selectedDocumentId ? () => getQuestionsByDocument(selectedDocumentId) : () => getRecentQuestions(),
    enabled: true,
  })

  const askMutation = useMutation({
    mutationFn: askQuestion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] })
      queryClient.invalidateQueries({ queryKey: ['usage'] })
      setQuestionText('')
      setSelectedQuestion(null)
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!questionText.trim() || !selectedDocumentId) return

    const result = await checkResourceQuota('questions_asked')
    if (!result.allowed) return

    askMutation.mutate({
      document_id: selectedDocumentId,
      question_text: questionText.trim(),
    })
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (questionText.trim() && selectedDocumentId) {
        handleSubmit(e as any)
      }
    }
  }

  const documents = documentsQuery.data ?? []
  const questions = questionsQuery.data ?? []
  const latestQuestion = questions[0] || null
  const historyQuestions = questions

  const displayQuestion = selectedQuestion || latestQuestion

  return (
    <PageTransition>
      <div className="relative flex gap-6">

        <section className="flex-1 space-y-6">
          <header>
            <p className="text-sm uppercase tracking-widest text-slate-500 dark:text-white/60">
              Perguntas à IA
            </p>
            <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
              Tire suas dúvidas
            </h1>
            <p className="mt-2 text-slate-600 dark:text-slate-400">
              Faça perguntas sobre seus documentos e obtenha respostas baseadas no conteúdo
            </p>
          </header>


          <Card>
            <CardHeader>
              <CardTitle className="text-slate-900 dark:text-white">Fazer Pergunta</CardTitle>
              <CardDescription className="dark:text-slate-400">
                Selecione um documento e faça sua pergunta
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Documento
                  </label>
                  <Select
                    value={selectedDocumentId?.toString() ?? ''}
                    onChange={(e) => setSelectedDocumentId(Number(e.target.value))}
                    className="mt-1.5"
                  >
                    <option value="">Selecione um documento...</option>
                    {documents.map((doc) => (
                      <option key={doc.id} value={doc.id}>
                        {doc.filename}
                      </option>
                    ))}
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Sua Pergunta
                  </label>
                  <Textarea
                    value={questionText}
                    onChange={(e) => setQuestionText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Digite sua pergunta aqui... (Enter para enviar, Shift+Enter para nova linha)"
                    className="mt-1.5 min-h-[100px] dark:bg-slate-800 dark:text-white dark:border-slate-700 dark:placeholder:text-slate-500"
                    disabled={askMutation.isPending}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={!questionText.trim() || !selectedDocumentId || askMutation.isPending}
                  className="w-full"
                >
                  {askMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Enviar Pergunta
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>


          {questionsQuery.isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
            </div>
          ) : displayQuestion ? (
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg text-slate-900 dark:text-white">
                      {displayQuestion.question_text}
                    </CardTitle>
                    <CardDescription className="mt-1 dark:text-slate-400">
                      {formatDate(displayQuestion.created_at)}
                    </CardDescription>
                  </div>
                  <MessageSquare className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg bg-slate-50 dark:bg-slate-800/50 p-4">
                  <p className="whitespace-pre-wrap text-slate-700 dark:text-slate-300">
                    {parseAnswerText(displayQuestion.answer_text)}
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <MessageSquare className="h-12 w-12 text-slate-300 dark:text-slate-600" />
                <p className="mt-4 text-slate-500 dark:text-slate-400">
                  Nenhuma pergunta ainda. Faça sua primeira pergunta!
                </p>
              </CardContent>
            </Card>
          )}
        </section>


        {historyQuestions.length > 0 && (
          <Button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="fixed right-6 top-24 z-40"
            size="sm"
            variant="outline"
          >
            <History className="h-4 w-4 mr-2" />
            Histórico ({historyQuestions.length})
          </Button>
        )}


        {isSidebarOpen && (
          <div className="fixed inset-0 z-50 bg-black/50" onClick={() => setIsSidebarOpen(false)}>
            <div
              className="absolute right-0 top-0 h-full w-96 bg-white dark:bg-slate-900 shadow-xl overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 z-10 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                    Histórico de Perguntas
                  </h2>
                  <Button
                    onClick={() => setIsSidebarOpen(false)}
                    size="sm"
                    variant="ghost"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="p-4 space-y-3">
                {historyQuestions.map((question) => (
                  <button
                    key={question.id}
                    onClick={() => {
                      setSelectedQuestion(question)
                      setIsSidebarOpen(false)
                    }}
                    className="w-full text-left p-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <p className="text-sm font-medium text-slate-900 dark:text-white line-clamp-2">
                      {question.question_text}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {formatDate(question.created_at)}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <UpgradeModal
        open={showUpgradeModal}
        onOpenChange={setShowUpgradeModal}
        resourceType={quotaResource}
      />
    </PageTransition>
  )
}

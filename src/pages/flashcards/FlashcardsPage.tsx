import { useEffect, useMemo, useState } from 'react'
import { Loader2, Shuffle } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ROUTES } from '@/constants/routes'
import { useDocumentsQuery, useFlashcardsQuery } from '@/hooks/useDocumentsQuery'
import { useFlashcardStudyStore } from '@/store/flashcard-study-store'
import { formatDate } from '@/utils/format'
import { PageTransition } from '@/components/navigation/PageTransition'

export function FlashcardsPage() {
  const documentsQuery = useDocumentsQuery()
  const [selectedDeck, setSelectedDeck] = useState<number | null>(null)
  const { data: flashcards, isLoading } = useFlashcardsQuery(selectedDeck ?? undefined)
  const [isFlipped, setIsFlipped] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  const reviewCard = useFlashcardStudyStore((state) => state.reviewCard)
  const progress = useFlashcardStudyStore((state) => state.progress)

  const decks = documentsQuery.data ?? []

  useEffect(() => {
    if (!selectedDeck && decks.length) {
      setSelectedDeck(decks[0].id)
    }
  }, [decks, selectedDeck])

  const activeCard = flashcards?.[currentIndex]

  const handleDifficulty = (level: 'easy' | 'medium' | 'hard') => {
    if (!activeCard) return
    reviewCard(activeCard.id, level)
    setIsFlipped(false)
    setCurrentIndex((prev) => (flashcards && flashcards.length ? (prev + 1) % flashcards.length : 0))
  }

  const nextReview = useMemo(() => {
    if (!activeCard) return null
    const info = progress[activeCard.id]
    return info ? formatDate(info.dueDate) : null
  }, [activeCard, progress])

  return (
    <PageTransition>
      <section className="space-y-6">
      <header>
        <p className="text-sm uppercase tracking-widest text-slate-500 dark:text-white/60">Flashcards</p>
        <h1 className="text-3xl font-semibold text-midnight dark:text-white">Modo de estudo inteligente</h1>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Decks disponíveis</CardTitle>
            <CardDescription>Gerados a partir dos seus documentos</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {decks.map((doc) => (
                <li key={doc.id}>
                  <button
                    onClick={() => {
                      setSelectedDeck(doc.id)
                      setCurrentIndex(0)
                      setIsFlipped(false)
                    }}
                    className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
                      selectedDeck === doc.id
                        ? 'border-brand-400 bg-brand-50 text-brand-700 dark:border-brand-300 dark:bg-white/10 dark:text-white'
                        : 'border-slate-100 bg-white text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-white'
                    }`}
                  >
                    <p className="text-sm font-semibold">{doc.filename}</p>
                    <p className="text-xs text-slate-500 dark:text-white/60">Criado em {formatDate(doc.created_at)}</p>
                  </button>
                </li>
              ))}
              {decks.length === 0 ? <p className="text-sm text-slate-500 dark:text-white/60">Nenhum documento disponível.</p> : null}
            </ul>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Modo de estudo</CardTitle>
                <CardDescription>Vire o card para ver a resposta e escolha a dificuldade</CardDescription>
              </div>
              <Button variant="ghost" onClick={() => setIsFlipped((prev) => !prev)} disabled={!activeCard}>
                <Shuffle className="mr-2 h-4 w-4" />
                Virar
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {!selectedDeck ? (
              <p className="text-sm text-slate-500 dark:text-white/70">Selecione um deck para começar a estudar.</p>
            ) : isLoading ? (
              <div className="flex min-h-[200px] items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-brand-400" />
              </div>
            ) : activeCard ? (
              <>
                <div
                  className="relative min-h-[220px] cursor-pointer rounded-3xl border border-slate-200 bg-white/80 p-6 text-center text-lg font-semibold text-midnight transition dark:border-white/10 dark:bg-white/5 dark:text-white"
                  onClick={() => setIsFlipped((prev) => !prev)}
                >
                  {isFlipped ? activeCard.answer : activeCard.question}
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button variant="outline" onClick={() => handleDifficulty('hard')}>
                    Difícil
                  </Button>
                  <Button variant="secondary" onClick={() => handleDifficulty('medium')}>
                    Médio
                  </Button>
                  <Button onClick={() => handleDifficulty('easy')}>
                    Fácil
                  </Button>
                </div>
                <p className="text-xs uppercase tracking-wide text-slate-400 dark:text-white/60">
                  Próxima revisão {nextReview ?? 'definir após responder'}
                </p>
              </>
            ) : (
              <p className="text-sm text-slate-500 dark:text-white/70">Nenhum flashcard encontrado para este documento.</p>
            )}
            <Button variant="outline" asChild>
              <Link to={selectedDeck ? ROUTES.document(selectedDeck) : ROUTES.upload}>Criar novos flashcards</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
    </PageTransition>
  )
}

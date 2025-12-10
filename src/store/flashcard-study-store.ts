import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Difficulty = 'easy' | 'medium' | 'hard'

type FlashcardProgress = {
  cardId: number
  ease: number
  interval: number
  dueDate: string
  lastReviewedAt: string
}

type FlashcardStudyState = {
  progress: Record<number, FlashcardProgress>
  reviewCard: (cardId: number, difficulty: Difficulty) => void
}

const difficultyMultiplier: Record<Difficulty, number> = {
  easy: 2.5,
  medium: 1.5,
  hard: 1,
}

export const useFlashcardStudyStore = create<FlashcardStudyState>()(
  persist(
    (set) => ({
      progress: {},
      reviewCard: (cardId, difficulty) => {
        set((state) => {
          const existing = state.progress[cardId]
          const now = Date.now()
          const baseInterval = existing ? existing.interval : 1
          const interval = Math.min(21, baseInterval * difficultyMultiplier[difficulty])
          const dueDate = new Date(now + interval * 24 * 60 * 60 * 1000).toISOString()
          return {
            progress: {
              ...state.progress,
              [cardId]: {
                cardId,
                ease: difficultyMultiplier[difficulty],
                interval,
                dueDate,
                lastReviewedAt: new Date(now).toISOString(),
              },
            },
          }
        })
      },
    }),
    { name: 'studymind-flashcard-progress' },
  ),
)

import { api } from '@/lib/api-client'
import type { FlashcardDto } from '@/types/api'

export async function listFlashcards(documentId: number) {
  const { data } = await api.get<FlashcardDto[]>(`/flashcards/${documentId}`)
  return data
}

export async function generateFlashcards(summaryId: number, limit: number) {
  const { data } = await api.post<FlashcardDto[]>(`/flashcards/generate/${summaryId}`, { limit })
  return data
}

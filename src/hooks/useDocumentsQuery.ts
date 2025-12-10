import { useQuery, useQueryClient } from '@tanstack/react-query'

import { getDocument, listDocuments } from '@/services/documents'
import { listFlashcards } from '@/services/flashcards'
import { listSummaries } from '@/services/summaries'

export function useDocumentsQuery() {
  return useQuery({ queryKey: ['documents'], queryFn: listDocuments })
}

export function useDocumentQuery(documentId: number | undefined) {
  return useQuery({
    queryKey: ['document', documentId],
    queryFn: () => getDocument(documentId as number),
    enabled: typeof documentId === 'number' && documentId > 0,
  })
}

export function useSummariesQuery(documentId: number | undefined) {
  return useQuery({
    queryKey: ['summaries', documentId],
    queryFn: () => listSummaries(documentId as number),
    enabled: typeof documentId === 'number' && documentId > 0,
  })
}

export function useFlashcardsQuery(documentId: number | undefined) {
  return useQuery({
    queryKey: ['flashcards', documentId],
    queryFn: () => listFlashcards(documentId as number),
    enabled: typeof documentId === 'number' && documentId > 0,
  })
}

export function useInvalidateDocuments() {
  const queryClient = useQueryClient()
  return () => queryClient.invalidateQueries({ queryKey: ['documents'] })
}

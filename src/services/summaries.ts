import { api } from '@/lib/api-client'
import type { SummaryDto } from '@/types/api'

export type CreateSummaryPayload = {
  level: 'basic' | 'medium' | 'advanced'
}

export async function listSummaries(documentId: number) {
  const { data } = await api.get<SummaryDto[]>(`/summaries/by-document/${documentId}`)
  return data
}

export async function createSummary(documentId: number, payload: CreateSummaryPayload) {
  const { data } = await api.post<SummaryDto>(`/summaries/from-document/${documentId}`, payload)
  return data
}

export async function getSummary(summaryId: number) {
  const { data } = await api.get<SummaryDto>(`/summaries/${summaryId}`)
  return data
}

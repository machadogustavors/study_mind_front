import { api } from '@/lib/api-client'
import type { AskQuestionPayload, QuestionDto } from '@/types/api'

export async function askQuestion(payload: AskQuestionPayload) {
  const { data } = await api.post<QuestionDto>('/questions/ask', payload)
  return data
}

export async function getQuestionsByDocument(documentId: number) {
  const { data } = await api.get<QuestionDto[]>(`/questions/document/${documentId}`)
  return data
}

export async function getRecentQuestions() {
  const { data } = await api.get<QuestionDto[]>('/questions/recent')
  return data
}

export async function getQuestion(questionId: number) {
  const { data } = await api.get<QuestionDto>(`/questions/${questionId}`)
  return data
}

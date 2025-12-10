export type AuthToken = {
  access_token: string
  token_type: 'bearer'
}

export type UserProfile = {
  id: number
  email: string
  plan: string
  created_at: string
}

export type DocumentDto = {
  id: number
  user_id: number
  filename: string
  text_content?: string | null
  storage_url?: string | null
  created_at: string
}

export type SummaryDto = {
  id: number
  document_id: number
  user_id: number
  summary_text: string
  level: string
  created_at: string
  metadata?: SummaryMetadata | null
}

export type FlashcardDto = {
  id: number
  document_id: number
  question: string
  answer: string
  created_at: string
}

export type UploadResponse = DocumentDto & { text_preview?: string | null }

export type SummaryMetadata = {
  bullets?: string[]
  questions?: string[]
  flashcards?: Array<{ question: string; answer: string }>
}

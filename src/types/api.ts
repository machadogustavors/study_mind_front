export type AuthToken = {
  access_token: string
  token_type: 'bearer'
}

export type UserProfile = {
  id: number
  email: string
  full_name: string
  cpf?: string | null
  phone?: string | null
  street?: string | null
  city?: string | null
  state?: string | null
  postal_code?: string | null
  country: string
  stripe_customer_id?: string | null
  created_at: string
  updated_at: string
}

export type Plan = {
  id: number
  tier: 'free' | 'basic' | 'pro' | 'premium'
  name: string
  description: string
  price_monthly_brl: number
  price_yearly_brl: number | null
  documents_per_month: number | null
  questions_per_month: number | null
  flashcards_per_document: number | null
  ai_explanations_per_day: number | null
  study_plans: number | null
  storage_mb: number
  advanced_ai_models: boolean
  priority_support: boolean
  custom_branding: boolean
  is_active: boolean
  created_at: string
}

export type Subscription = {
  id: number
  user_id: number
  plan_id: number
  plan_name: string
  plan_tier: 'free' | 'basic' | 'pro' | 'premium'
  status: 'active' | 'canceled' | 'past_due' | 'trialing'
  billing_cycle: 'monthly' | 'yearly'
  current_period_start: string
  current_period_end: string
  cancel_at_period_end: boolean
  stripe_subscription_id: string | null
  stripe_customer_id: string | null
  created_at: string
  updated_at: string
  usage?: UsageStats
}

export type UsageStats = {
  documents_uploaded: number
  documents_limit: number | null
  questions_asked: number
  questions_limit: number | null
  flashcards_generated: number
  flashcards_limit: number | null
  ai_explanations_used: number
  ai_explanations_limit: number | null
}

export type QuotaCheck = {
  allowed: boolean
  reason?: string | null
  current_usage: number
  limit: number | null
  upgrade_required?: boolean
  suggested_plan?: string | null
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
  summary_metadata?: SummaryMetadata | null
}

export type FlashcardDto = {
  id: number
  document_id: number
  question: string
  answer: string
  created_at: string
}

export type QuestionDto = {
  id: number
  user_id: number
  document_id: number
  question_text: string
  answer_text: string
  created_at: string
}

export type AskQuestionPayload = {
  document_id: number
  question_text: string
}

export type UploadResponse = DocumentDto & { text_preview?: string | null }

export type SummaryMetadata = {
  bullets?: string[]
  questions?: string[]
  flashcards?: Array<{ question: string; answer: string }>
}

import type { SummaryDto, SummaryMetadata } from '@/types/api'

export type SummaryInsights = {
  bullets: string[]
  questions: string[]
  flashcards: Array<{ question: string; answer: string }>
}

const defaultInsights: SummaryInsights = {
  bullets: [],
  questions: [],
  flashcards: [],
}

function fromMetadata(metadata?: SummaryMetadata | null): SummaryInsights | null {
  if (!metadata) return null
  const bullets = Array.isArray(metadata.bullets) ? metadata.bullets.filter(Boolean) : []
  const questions = Array.isArray(metadata.questions) ? metadata.questions.filter(Boolean) : []
  const flashcards = Array.isArray(metadata.flashcards)
    ? metadata.flashcards.filter((card) => card?.question && card?.answer)
    : []
  if (!bullets.length && !questions.length && !flashcards.length) {
    return null
  }
  return { bullets, questions, flashcards }
}

export function extractSummaryInsights(summary?: SummaryDto | null): SummaryInsights {
  if (!summary) return defaultInsights
  
  const fromMeta = fromMetadata(summary.summary_metadata)
  if (fromMeta) {
    return fromMeta
  }

  const bullets: string[] = []
  const questions: string[] = []

  const lines = summary.summary_text.split('\n').map((line) => line.trim())
  
  let inQuestionsSection = false

  for (const line of lines) {
    if (!line) continue
    
    if (line.includes('## ❓') || line.includes('Perguntas de Revisão')) {
      inQuestionsSection = true
      continue
    }
    
    if (line.startsWith('##')) {
      inQuestionsSection = false
      continue
    }
    
    if (line.startsWith('- ')) {
      bullets.push(line.slice(2).trim())
    }
    
    if (inQuestionsSection) {
      const questionMatch = line.match(/^\d+\.\s*(.+)$/)
      if (questionMatch) {
        questions.push(questionMatch[1].trim())
      } else if (line.startsWith('- ')) {
        questions.push(line.slice(2).trim())
      }
    }
  }

  return {
    bullets,
    questions,
    flashcards: [],
  }
}

export function buildMindMapNodes(bullets: string[]) {
  return bullets.map((bullet, index) => ({
    id: `node-${index}`,
    label: bullet,
    angle: (index / Math.max(1, bullets.length)) * 360,
  }))
}

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
  const fromMeta = fromMetadata(summary.metadata)
  if (fromMeta) return fromMeta

  const bullets: string[] = []
  const questions: string[] = []
  const flashcards: Array<{ question: string; answer: string }> = []

  const lines = summary.summary_text.split('\n').map((line) => line.trim())
  let section: 'none' | 'bullets' | 'questions' | 'flashcards' = 'none'

  for (const rawLine of lines) {
    const line = rawLine.trim()
    if (!line) continue
    const normalized = line.toLowerCase()
    if (normalized.startsWith('## principais') || normalized.startsWith('## pontos')) {
      section = 'bullets'
      continue
    }
    if (normalized.includes('perguntas de revisão')) {
      section = 'questions'
      continue
    }
    if (normalized.includes('flashcards')) {
      section = 'flashcards'
      continue
    }

    if (section === 'bullets' && line.startsWith('- ')) {
      bullets.push(line.slice(2).trim())
      continue
    }

    if (section === 'questions') {
      const questionText = line.replace(/^\d+\.?\s*/, '').trim()
      if (questionText) {
        questions.push(questionText)
      }
      continue
    }

    if (section === 'flashcards') {
      if (line.startsWith('- **Q:**')) {
        const question = line.replace('- **Q:**', '').split('**A:**')[0]?.trim()
        const answerMatch = line.split('**A:**')[1]?.trim()
        if (question && answerMatch) {
          flashcards.push({ question, answer: answerMatch })
        }
      } else if (line.startsWith('**Q:**')) {
        const [questionPart, answerPart] = line.split('**A:**').map((part) => part.replace('**Q:**', '').trim())
        if (questionPart && answerPart) {
          flashcards.push({ question: questionPart, answer: answerPart })
        }
      }
    }
  }

  return {
    bullets,
    questions,
    flashcards,
  }
}

export function buildMindMapNodes(bullets: string[]) {
  return bullets.map((bullet, index) => ({
    id: `node-${index}`,
    label: bullet,
    angle: (index / Math.max(1, bullets.length)) * 360,
  }))
}

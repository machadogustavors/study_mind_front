import type { DocumentDto } from '@/types/api'

export type StudyPlanInput = {
  userProfile: string
  objective: string
  weeks: number
  hoursPerDay: number
}

export type StudyTask = {
  id: string
  date: string
  title: string
  focus: string
  hours: number
  completed: boolean
  documentId?: number
}

export type StudyScheduleEntry = {
  week: number
  milestone: string
  focusTopics: string[]
}

export type GeneratedPlan = {
  tasks: StudyTask[]
  schedule: StudyScheduleEntry[]
}

const subjectsFallback = ['Revisão', 'Memorização', 'Prática', 'Simulado']

function createId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return Math.random().toString(36).slice(2)
}

export function generateStudyPlan(input: StudyPlanInput, documents: DocumentDto[] = []): GeneratedPlan {
  const totalDays = Math.max(7, input.weeks * 7)
  const today = new Date()
  const sources = documents.length ? documents : undefined

  const tasks: StudyTask[] = Array.from({ length: totalDays }).map((_, index) => {
    const date = new Date(today)
    date.setDate(today.getDate() + index)
    const topic = sources
      ? sources[index % sources.length]
      : { filename: subjectsFallback[index % subjectsFallback.length], id: undefined }

    const focus = sources ? topic.filename.replace(/\.[^/.]+$/, '') : subjectsFallback[index % subjectsFallback.length]
    return {
      id: createId(),
      date: date.toISOString(),
      title: `Estudar ${focus}`,
      focus,
      hours: input.hoursPerDay,
      completed: false,
      documentId: sources ? topic.id : undefined,
    }
  })

  const schedule: StudyScheduleEntry[] = []
  for (let week = 0; week < input.weeks; week++) {
    const weekTasks = tasks.slice(week * 7, week * 7 + 7)
    if (!weekTasks.length) break
    schedule.push({
      week: week + 1,
      milestone: `Fechar capítulo de ${weekTasks[0]?.focus ?? input.objective}`,
      focusTopics: weekTasks.map((task) => task.focus).slice(0, 3),
    })
  }

  return { tasks, schedule }
}

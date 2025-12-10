import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import type { DocumentDto } from '@/types/api'
import { generateStudyPlan, type StudyPlanInput, type StudyTask } from '@/lib/study-plan-generator'

type StudyPlan = {
  id: string
  createdAt: string
  input: StudyPlanInput
  tasks: StudyTask[]
  schedule: ReturnType<typeof generateStudyPlan>['schedule']
}

type StudyPlanState = {
  currentPlan: StudyPlan | null
  history: StudyPlan[]
  generatePlan: (input: StudyPlanInput, documents?: DocumentDto[]) => void
  toggleTask: (taskId: string) => void
  addTasksFromSummary: (summaryTitle: string, bullets: string[], documentId?: number) => void
  resetPlan: () => void
}

function createId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return Math.random().toString(36).slice(2)
}

export const useStudyPlanStore = create<StudyPlanState>()(
  persist(
    (set, get) => ({
      currentPlan: null,
      history: [],
      generatePlan: (input: StudyPlanInput, documents: DocumentDto[] = []) => {
        const generated = generateStudyPlan(input, documents)
        const plan: StudyPlan = {
          id: createId(),
          createdAt: new Date().toISOString(),
          input,
          tasks: generated.tasks,
          schedule: generated.schedule,
        }
        set({ currentPlan: plan, history: [plan, ...get().history].slice(0, 5) })
      },
      toggleTask: (taskId: string) => {
        const plan = get().currentPlan
        if (!plan) return
        const tasks = plan.tasks.map((task: StudyTask) =>
          task.id === taskId ? { ...task, completed: !task.completed } : task,
        )
        set({ currentPlan: { ...plan, tasks } })
      },
      addTasksFromSummary: (summaryTitle: string, bullets: string[], documentId?: number) => {
        const plan = get().currentPlan
        if (!plan) return
        const additions = bullets.slice(0, 4).map((bullet) => ({
          id: createId(),
          date: new Date().toISOString(),
          title: `${summaryTitle}: ${bullet}`,
          focus: summaryTitle,
          hours: plan.input.hoursPerDay,
          completed: false,
          documentId,
        }))
        set({ currentPlan: { ...plan, tasks: [...additions, ...plan.tasks] } })
      },
      resetPlan: () => set({ currentPlan: null }),
    }),
    { name: 'studymind-study-plan' },
  ),
)
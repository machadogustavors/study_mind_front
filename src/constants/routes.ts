export const ROUTES = {
  landing: '/',
  signin: '/signin',
  signup: '/signup',
  app: '/app',
  dashboard: '/app/dashboard',
  upload: '/app/upload',
  document: (id: number | string) => `/app/documents/${id}`,
  studyPlan: '/app/study-plan',
  flashcards: '/app/flashcards',
  progress: '/app/progress',
  settings: '/app/settings',
}

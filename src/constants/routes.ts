export const ROUTES = {
  landing: '/',
  signin: '/signin',
  signup: '/signup',
  app: '/app',
  dashboard: '/app/dashboard',
  upload: '/app/upload',
  document: (id: number | string) => `/app/documents/${id}`,
  summaries: (id: number | string) => `/app/documents/${id}/summaries`,
  flashcards: (id: number | string) => `/app/documents/${id}/flashcards`,
}

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api/v1'

export const env = {
  API_BASE_URL: API_URL.replace(/\/$/, ''),
}

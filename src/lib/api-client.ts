import axios from 'axios'

import { env } from '@/config/env'
import { useAuthStore } from '@/store/auth-store'

export const api = axios.create({
  baseURL: env.API_BASE_URL,
  timeout: 30_000,
})

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    }
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().signOut()
    }
    return Promise.reject(error)
  },
)

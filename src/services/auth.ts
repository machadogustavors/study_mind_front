import { api } from '@/lib/api-client'
import type { AuthToken, UserProfile } from '@/types/api'

export type Credentials = {
  email: string
  password: string
}

export async function signUp(payload: Credentials) {
  const { data } = await api.post<AuthToken>('/auth/signup', payload)
  return data
}

export async function signIn(payload: Credentials) {
  const { data } = await api.post<AuthToken>('/auth/login', payload)
  return data
}

export async function fetchProfile() {
  const { data } = await api.get<UserProfile>('/users/me')
  return data
}

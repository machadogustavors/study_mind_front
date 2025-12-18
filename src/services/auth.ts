import { api } from '@/lib/api-client'
import type { AuthToken, UserProfile } from '@/types/api'

export type Credentials = {
  email: string
  password: string
}

export type SignUpPayload = {
  email: string
  password: string
  full_name: string
  cpf?: string
  phone?: string
  street?: string
  city?: string
  state?: string
  postal_code?: string
  country?: string
}

export async function signUp(payload: SignUpPayload) {
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

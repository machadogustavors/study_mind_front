import { api } from '@/lib/api-client'
import type { DocumentDto, UploadResponse } from '@/types/api'

export async function listDocuments() {
  const { data } = await api.get<DocumentDto[]>('/documents/')
  return data
}

export async function getDocument(documentId: number) {
  const { data } = await api.get<DocumentDto>(`/documents/${documentId}`)
  return data
}

export async function uploadDocument(file: File) {
  const formData = new FormData()
  formData.append('file', file)
  const { data } = await api.post<UploadResponse>('/documents/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

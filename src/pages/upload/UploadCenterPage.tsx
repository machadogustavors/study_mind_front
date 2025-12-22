import { useEffect, useMemo, useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { CheckCircle2, Clipboard, ClipboardCheck, FileText, LinkIcon, Loader2, UploadCloud } from 'lucide-react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'

import { UpgradeModal } from '@/components/feedback/UpgradeModal'
import { PageTransition } from '@/components/navigation/PageTransition'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ROUTES } from '@/constants/routes'
import { useInvalidateDocuments } from '@/hooks/useDocumentsQuery'
import { useQuotaCheck } from '@/hooks/useQuotaCheck'
import { getDocument, uploadDocument } from '@/services/documents'
import type { DocumentDto, UploadResponse } from '@/types/api'
import { formatDate } from '@/utils/format'

type UploadStatus = 'idle' | 'uploading' | 'processing' | 'completed' | 'error'

export function UploadCenterPage() {
  const [textInput, setTextInput] = useState('')
  const [linkInput, setLinkInput] = useState('')
  const [status, setStatus] = useState<UploadStatus>('idle')
  const [uploadedDoc, setUploadedDoc] = useState<UploadResponse | DocumentDto | null>(null)
  const [copied, setCopied] = useState(false)

  const invalidateDocuments = useInvalidateDocuments()
  const { checkResourceQuota, showUpgradeModal, setShowUpgradeModal, quotaResource } = useQuotaCheck()

  const uploadMutation = useMutation({
    mutationFn: uploadDocument,
    onMutate: () => setStatus('uploading'),
    onSuccess: (data) => {
      setUploadedDoc(data)
      setStatus(data.text_content ? 'completed' : 'processing')
    },
    onError: (error: any) => {
      setStatus('error')
      toast.error(error.response?.data?.detail || 'Erro ao fazer upload')
    },
  })

  const pollingQuery = useQuery({
    queryKey: ['document-poll', uploadedDoc?.id],
    queryFn: () => getDocument(uploadedDoc!.id),
    enabled: status === 'processing' && Boolean(uploadedDoc?.id),
    refetchInterval: (query) => (query.state.data?.text_content ? false : 2000),
  })

  useEffect(() => {
    if (pollingQuery.data?.text_content) {
      setUploadedDoc(pollingQuery.data)
      setStatus('completed')
      invalidateDocuments()
    }
  }, [pollingQuery.data, invalidateDocuments])

  const steps = useMemo(
    () => [
      { key: 'uploading', label: 'Upload recebido', active: status !== 'idle' },
      { key: 'processing', label: 'Processando com IA', active: status === 'processing' || status === 'completed' },
      { key: 'completed', label: 'Texto pronto', active: status === 'completed' },
    ],
    [status],
  )

  const handleFileUpload = async (files: FileList | null) => {
    if (!files?.length) return
    
    const quotaCheck = await checkResourceQuota('document')
    if (!quotaCheck.allowed) {
      return
    }
    
    uploadMutation.mutate(files[0])
  }

  const handleTextSubmit = async () => {
    if (!textInput.trim()) return
    
    const quotaCheck = await checkResourceQuota('document')
    if (!quotaCheck.allowed) {
      return
    }
    
    const blob = new Blob([textInput], { type: 'text/plain' })
    const file = new File([blob], `texto-${Date.now()}.txt`, { type: 'text/plain' })
    uploadMutation.mutate(file)
    setTextInput('')
  }

  const handleLinkSubmit = async () => {
    if (!linkInput.trim()) return
    
    const quotaCheck = await checkResourceQuota('document')
    if (!quotaCheck.allowed) {
      return
    }
    
    const content = `Link indicado pelo aluno: ${linkInput}`
    const blob = new Blob([content], { type: 'text/plain' })
    const file = new File([blob], `referencia-${Date.now()}.txt`, { type: 'text/plain' })
    uploadMutation.mutate(file)
    setLinkInput('')
  }

  const isUploading = uploadMutation.isPending || status === 'uploading'
  const processingDoc = status === 'processing'

  return (
    <PageTransition>
      <section className="space-y-4">
      <header className="space-y-2">
        <p className="text-sm uppercase tracking-widest text-slate-500 dark:text-white/60">Upload Center</p>
        <h1 className="text-3xl font-semibold text-midnight dark:text-white">Envie PDFs, imagens ou texto</h1>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>1. Arraste e solte</CardTitle>
            <CardDescription>PDF, imagens ou texto puro são aceitos</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <label className="flex h-48 cursor-pointer flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-slate-50 text-center text-slate-500 transition hover:border-brand-400 dark:border-white/20 dark:bg-white/5 dark:text-white/70">
              <UploadCloud className="mb-2 h-10 w-10 text-brand-400" />
              <span className="font-semibold">Solte o arquivo aqui</span>
              <span className="text-xs text-slate-400 dark:text-white/50">ou clique para selecionar</span>
              <input
                type="file"
                className="hidden"
                accept=".pdf,.png,.jpg,.jpeg,.txt"
                onChange={(event) => handleFileUpload(event.target.files)}
              />
            </label>
            <p className="text-xs text-slate-400 dark:text-white/50">Máximo 20MB por arquivo. PDFs com texto são processados mais rápido.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>2. Texto ou link</CardTitle>
            <CardDescription>Copie e cole trechos importantes ou referências</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-600 dark:text-white/80">Texto</label>
              <Textarea value={textInput} onChange={(event) => setTextInput(event.target.value)} placeholder="Cole trechos, resumos ou anotações" />
              <Button onClick={handleTextSubmit} disabled={!textInput.trim() || isUploading} className="w-full">
                {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Enviar texto
              </Button>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-600 dark:text-white/80">Link</label>
              <div className="flex gap-2">
                <Input value={linkInput} onChange={(event) => setLinkInput(event.target.value)} placeholder="https://artigo..." />
                <Button onClick={handleLinkSubmit} disabled={!linkInput.trim() || isUploading}>
                  <LinkIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>3. Progresso</CardTitle>
            <CardDescription>Acompanhamento em tempo real</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ol className="space-y-3">
              {steps.map((step) => (
                <li key={step.key} className="flex items-center gap-3">
                  {step.active ? <CheckCircle2 className="h-5 w-5 text-brand-400" /> : <span className="h-5 w-5 rounded-full border border-slate-200 dark:border-white/20" />}
                  <span className="text-sm text-slate-600 dark:text-white/70">{step.label}</span>
                </li>
              ))}
            </ol>
            {processingDoc ? (
              <div className="flex items-center gap-2 rounded-2xl border border-dashed border-brand-400 px-4 py-3 text-sm text-brand-600 dark:text-brand-300">
                <Loader2 className="h-4 w-4 animate-spin" />
                Extraindo texto do documento...
              </div>
            ) : null}
            {status === 'error' ? <p className="text-sm text-red-500">Não foi possível processar o arquivo. Tente novamente.</p> : null}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>4. Prévia</CardTitle>
            <CardDescription>Assim que o texto estiver pronto, visualize e gere resumos</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {uploadedDoc ? (
              <div className="space-y-3">
                <div className="rounded-2xl border border-slate-100 px-4 py-3 dark:border-white/10">
                  <p className="text-sm font-semibold text-midnight dark:text-white">{uploadedDoc.filename}</p>
                  <p className="text-xs text-slate-500 dark:text-white/60">{formatDate(uploadedDoc.created_at)}</p>
                </div>
                {uploadedDoc.text_content || 'text_preview' in uploadedDoc ? (
                  <div className="rounded-2xl border border-slate-100 bg-white/70 p-4 text-sm text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-white/80">
                    <div className="mb-2 flex items-center justify-between text-xs uppercase tracking-wide text-slate-400 dark:text-white/60">
                      Prévia extraída
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={async () => {
                          if (!uploadedDoc.text_content && !('text_preview' in uploadedDoc)) return
                          try {
                            await navigator.clipboard.writeText(
                              uploadedDoc.text_content ?? (uploadedDoc as UploadResponse).text_preview ?? '',
                            )
                            setCopied(true)
                            setTimeout(() => setCopied(false), 2000)
                          } catch (error) {
                            console.error('Clipboard copy failed', error)
                          }
                        }}
                      >
                        {copied ? <ClipboardCheck className="h-4 w-4" /> : <Clipboard className="h-4 w-4" />}
                      </Button>
                    </div>
                    <p className="line-clamp-5 whitespace-pre-wrap">
                      {uploadedDoc.text_content ?? (uploadedDoc as UploadResponse).text_preview ?? 'Processando...'}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-slate-500 dark:text-white/70">Aguardando extração...</p>
                )}
                {status === 'completed' ? (
                  <Button variant="primary" asChild className="w-full">
                    <Link to={ROUTES.document(uploadedDoc.id)}>Ir para conteúdo gerado</Link>
                  </Button>
                ) : null}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-200 p-6 text-center text-sm text-slate-500 dark:border-white/10 dark:text-white/70">
                <FileText className="mx-auto mb-2 h-8 w-8 text-slate-300" />
                Envie um arquivo ou texto para ver a prévia aqui.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <UpgradeModal
        open={showUpgradeModal}
        onOpenChange={setShowUpgradeModal}
        resourceType={quotaResource}
      />
    </section>
    </PageTransition>
  )
}

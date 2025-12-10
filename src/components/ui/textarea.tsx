import type { TextareaHTMLAttributes } from 'react'

import { cn } from '@/lib/cn'

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>

export function Textarea({ className, ...props }: TextareaProps) {
  return (
    <textarea
      className={cn(
        'w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-midnight placeholder:text-slate-400 focus:border-brand-400 focus:outline-none dark:border-white/20 dark:bg-white/5 dark:text-white',
        'min-h-[120px] resize-none',
        className,
      )}
      {...props}
    />
  )
}

import type { HTMLAttributes } from 'react'

import { cn } from '@/lib/cn'

export type ProgressProps = HTMLAttributes<HTMLDivElement> & {
  value: number
}

export function Progress({ value, className, ...props }: ProgressProps) {
  const clamped = Math.min(100, Math.max(0, value))
  return (
    <div className={cn('h-2 rounded-full bg-slate-200 dark:bg-white/10', className)} {...props}>
      <div className="h-full rounded-full bg-brand-500" style={{ width: `${clamped}%` }} />
    </div>
  )
}

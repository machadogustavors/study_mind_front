import type { HTMLAttributes } from 'react'

import { cn } from '@/lib/cn'

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: 'default' | 'outline'
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide',
        variant === 'default' && 'bg-brand-500 text-white',
        variant === 'outline' && 'border border-slate-200 text-slate-600 dark:border-white/30 dark:text-white/80',
        className,
      )}
      {...props}
    />
  )
}

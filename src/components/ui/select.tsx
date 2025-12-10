import type { SelectHTMLAttributes } from 'react'

import { cn } from '@/lib/cn'

export type SelectProps = SelectHTMLAttributes<HTMLSelectElement>

export function Select({ className, children, ...props }: SelectProps) {
  return (
    <select
      className={cn(
        'w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-midnight focus:border-brand-400 focus:outline-none dark:border-white/20 dark:bg-white/5 dark:text-white',
        className,
      )}
      {...props}
    >
      {children}
    </select>
  )
}

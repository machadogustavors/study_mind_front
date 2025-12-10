import type { InputHTMLAttributes } from 'react'

import { cn } from '@/lib/cn'

export type SwitchProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>

export function Switch({ className, checked, ...props }: SwitchProps) {
  return (
    <label className={cn('inline-flex cursor-pointer items-center gap-3', className)}>
      <span className="relative inline-flex h-6 w-11 items-center rounded-full bg-white/20">
        <input type="checkbox" className="sr-only" checked={checked} {...props} />
        <span
          className={cn(
            'inline-block h-5 w-5 rounded-full bg-white shadow transition-transform',
            checked ? 'translate-x-5 bg-brand-400' : 'translate-x-1',
          )}
        />
      </span>
    </label>
  )
}

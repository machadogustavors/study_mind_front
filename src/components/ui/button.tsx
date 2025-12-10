import { cloneElement, isValidElement } from 'react'
import type { ButtonHTMLAttributes, DetailedHTMLProps, ReactElement } from 'react'

import { cn } from '@/lib/cn'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline'
type ButtonSize = 'sm' | 'md' | 'lg' | 'icon'

export type ButtonProps = DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> & {
  variant?: ButtonVariant
  size?: ButtonSize
  asChild?: boolean
}

const baseClasses = 'inline-flex items-center justify-center rounded-xl font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2'

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-brand-500 text-white hover:bg-brand-400 focus-visible:outline-brand-400',
  secondary:
    'bg-white text-midnight hover:bg-slate-100 focus-visible:outline-brand-200 dark:bg-white/10 dark:text-white dark:hover:bg-white/20',
  ghost: 'bg-transparent text-midnight hover:bg-slate-100 dark:text-white dark:hover:bg-white/10 focus-visible:outline-brand-200',
  outline:
    'border border-slate-200 text-midnight hover:bg-slate-100 dark:border-white/20 dark:text-white dark:hover:bg-white/10',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'text-xs px-3 py-2 gap-1',
  md: 'text-sm px-4 py-2.5 gap-2',
  lg: 'text-base px-6 py-3 gap-2.5',
  icon: 'h-10 w-10',
}

export function Button({ variant = 'primary', size = 'md', className, asChild = false, children, ...props }: ButtonProps) {
  const merged = cn(baseClasses, variantClasses[variant], sizeClasses[size], className)

  if (asChild && isValidElement(children)) {
    return cloneElement(children as ReactElement, {
      className: cn(merged, (children as ReactElement).props.className),
      ...props,
    })
  }

  return (
    <button className={merged} {...props}>
      {children}
    </button>
  )
}

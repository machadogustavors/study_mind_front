import type { FieldError, UseFormRegisterReturn } from 'react-hook-form'
import { clsx } from 'clsx'

export type TextFieldProps = {
  label: string
  name: string
  type?: string
  placeholder?: string
  error?: FieldError
  registration: UseFormRegisterReturn
}

export function TextField({ label, name, type = 'text', placeholder, error, registration }: TextFieldProps) {
  return (
    <label className="block text-sm font-medium text-white/80">
      <span>{label}</span>
      <input
        {...registration}
        type={type}
        placeholder={placeholder}
        className={clsx(
          'mt-2 w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-white/40 focus:border-brand-400 focus:outline-none',
          error && 'border-red-400 focus:border-red-500',
        )}
      />
      {error ? <span className="mt-1 block text-xs text-red-400">{error.message}</span> : null}
    </label>
  )
}

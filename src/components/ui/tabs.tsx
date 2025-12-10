import { createContext, type HTMLAttributes, type ReactNode, useContext, useMemo, useState } from 'react'

import { cn } from '@/lib/cn'

type TabsContextValue = {
  value: string
  setValue: (value: string) => void
}

const TabsContext = createContext<TabsContextValue | undefined>(undefined)

export type TabsProps = {
  defaultValue: string
  value?: string
  onValueChange?: (value: string) => void
  children: ReactNode
}

export function Tabs({ defaultValue, value, onValueChange, children }: TabsProps) {
  const [internalValue, setInternalValue] = useState(defaultValue)
  const activeValue = value ?? internalValue

  const context = useMemo<TabsContextValue>(
    () => ({
      value: activeValue,
      setValue: (next) => {
        setInternalValue(next)
        onValueChange?.(next)
      },
    }),
    [activeValue, onValueChange],
  )

  return <TabsContext.Provider value={context}>{children}</TabsContext.Provider>
}

function useTabsContext() {
  const context = useContext(TabsContext)
  if (!context) {
    throw new Error('Tabs components must be used inside <Tabs>')
  }
  return context
}

export function TabsList({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('inline-flex rounded-2xl bg-slate-100 p-1 text-sm text-slate-500 dark:bg-white/5 dark:text-white', className)} {...props} />
  )
}

export type TabsTriggerProps = HTMLAttributes<HTMLButtonElement> & { value: string }

export function TabsTrigger({ value, className, ...props }: TabsTriggerProps) {
  const { value: active, setValue } = useTabsContext()
  const isActive = active === value
  return (
    <button
      type="button"
      onClick={() => setValue(value)}
      className={cn(
        'rounded-xl px-4 py-2 font-semibold transition',
        isActive ? 'bg-white text-midnight shadow-sm dark:bg-white dark:text-midnight' : 'text-slate-500 hover:text-slate-900 dark:text-white/70 dark:hover:text-white',
        className,
      )}
      {...props}
    />
  )
}

export type TabsContentProps = HTMLAttributes<HTMLDivElement> & { value: string }

export function TabsContent({ value, className, ...props }: TabsContentProps) {
  const { value: active } = useTabsContext()
  if (active !== value) return null
  return <div className={cn('mt-4', className)} {...props} />
}

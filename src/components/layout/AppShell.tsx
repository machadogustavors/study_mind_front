import { AnimatedOutlet } from '@/components/navigation/AnimatedOutlet'

import { SidebarNav } from './SidebarNav'
import { TopBar } from './TopBar'

export function AppShell() {
  return (
    <div className="flex min-h-screen bg-sand text-midnight dark:bg-gradient-to-br dark:from-[#040712] dark:via-[#061326] dark:to-[#0d1f33] dark:text-white">
      <SidebarNav />
      <div className="flex w-full flex-col">
        <TopBar />
        <main className="flex-1 overflow-y-auto bg-white/30 px-4 py-6 backdrop-blur-sm dark:bg-gradient-to-b dark:from-white/5 dark:via-transparent dark:to-transparent sm:px-8">
          <AnimatedOutlet />
        </main>
      </div>
    </div>
  )
}

import { AnimatedOutlet } from '@/components/navigation/AnimatedOutlet'

import { SidebarNav } from './SidebarNav'
import { TopBar } from './TopBar'

export function AppShell() {
  return (
    <div className="w-full flex min-h-screen bg-sand text-midnight dark:bg-[#020202] dark:text-white">
      <SidebarNav />
      <div className="flex w-full flex-col">
        <TopBar />
        <main className="flex-1 overflow-y-auto bg-white/30 px-4 py-6 backdrop-blur-sm dark:bg-transparent sm:px-8">
          <AnimatedOutlet />
        </main>
      </div>
    </div>
  )
}

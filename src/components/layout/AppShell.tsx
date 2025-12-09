import { Outlet } from 'react-router-dom'

import { SidebarNav } from './SidebarNav'
import { TopBar } from './TopBar'

export function AppShell() {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#040712] via-[#061326] to-[#0d1f33] text-white">
      <SidebarNav />
      <div className="flex w-full flex-col">
        <TopBar />
        <main className="flex-1 overflow-y-auto bg-gradient-to-b from-white/5 via-transparent to-transparent px-4 py-6 sm:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

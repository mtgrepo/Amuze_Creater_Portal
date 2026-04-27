import { Outlet, useMatches } from "react-router-dom"

import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar"

import { Separator } from "./components/ui/separator"
import { ModeToggle } from "./components/common/Themes/mode-toggle"
import BreadCrumbLayout from "./components/common/Layouts/bread_crumb_layout"
import { LanguageToggle } from "./components/common/Language/language-toggle"
import CreatorNotificationToggle from "./components/common/Notification/notification-toggle"

type MatchType = {
  pathname: string
  data?: any
  handle?: {
    crumb: string | string[] | ((data: any) => string | string[])
  }
}
function App() {
  const rawMatches = useMatches()
  const matches = rawMatches as MatchType[]

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">

        <AppSidebar className="h-auto min-h-full" />

        <SidebarInset>
          {/* HEADER */}
          <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center justify-between border-b bg-background px-4">
            <div className="flex items-center gap-3">
              <SidebarTrigger />

              <Separator
                orientation="vertical"
                className="h-5 shrink-0"
              />
              {/* Dynamic Breadcrumb */}
              <BreadCrumbLayout matches={matches} />
            </div>
            <div className="flex items-center gap-2">
              <CreatorNotificationToggle />
              <LanguageToggle />
              <ModeToggle />
            </div>
          </header>

          {/* PAGE CONTENT */}
          <div className="flex flex-1 flex-col gap-4 px-4 py-6">
            <Outlet />
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}

export default App

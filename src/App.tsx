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
import { MoreHorizontal, X } from "lucide-react"
import { useState } from "react"

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
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">

        <AppSidebar className="h-auto min-h-full" />

        <SidebarInset>
          {/* HEADER */}
          <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center justify-between border-b bg-background px-4">
            <div className="flex items-center gap-3">
              <SidebarTrigger />

              <div className="hidden md:flex items-center gap-3 min-w-0">
                <Separator
                  orientation="vertical"
                  className="h-5 shrink-0"
                />
                <BreadCrumbLayout matches={matches} />
              </div>
            </div>
          <div className="flex gap-3">
            <CreatorNotificationToggle />
            <div className="hidden lg:flex items-center gap-2">
              <LanguageToggle />
              <ModeToggle />
            </div>

            <div className="flex lg:hidden items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 hover:bg-accent rounded-md transition-colors focus:outline-none"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? (
                  <X className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <MoreHorizontal className="h-5 w-5 text-muted-foreground" />
                )}
              </button>
            </div>
            </div>
          </header>
  
            <div
              className={`lg:hidden transition-all duration-300 ease-in-out border-t shadow-sm bg-muted/40 ${isMenuOpen ? "max-h-16 opacity-100 overflow-visible py-2" : "max-h-0 opacity-0 overflow-hidden pointer-events-none"
                }`}
            >
              <div className="flex h-full items-center justify-center gap-6 px-4">
                <LanguageToggle />
                <ModeToggle />
              </div>
            </div>

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

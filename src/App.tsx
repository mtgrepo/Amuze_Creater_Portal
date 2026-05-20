import { useState } from "react";
import { Outlet, useMatches } from "react-router-dom";
import { MoreHorizontal, X } from "lucide-react";

import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import { Separator } from "./components/ui/separator";
import { ModeToggle } from "./components/common/Themes/mode-toggle";
import BreadCrumbLayout from "./components/common/Layouts/bread_crumb_layout";
import { LanguageToggle } from "./components/common/Language/language-toggle";
import CreatorNotificationToggle from "./components/common/Notification/notification-toggle";

type MatchType = {
  pathname: string;
  data?: any;
  handle?: {
    crumb: string | string[] | ((data: any) => string | string[]);
  };
};

function App() {
  const rawMatches = useMatches();
  const matches = rawMatches as MatchType[];
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <SidebarProvider>
      {/* Sidebar is handled cleanly by standard shadcn contexts layout */}
      <AppSidebar />

      <SidebarInset className="relative flex flex-col min-h-screen min-w-0">
        {/* HEADER CONTAINER */}
        <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between gap-3 border-b bg-background px-4">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <SidebarTrigger className="shrink-0" />
            
            {/* Unified visibility breakpoint (sm:flex) allows breadcrumbs to show safely on small viewports */}
            <div className="hidden sm:flex items-center gap-3 min-w-0 flex-1">
              <Separator orientation="vertical" className="h-5 shrink-0" />
              <BreadCrumbLayout matches={matches} />
            </div>
          </div>

          {/* UTILITY BAR SYSTEM */}
          <div className="flex items-center gap-1 shrink-0">
            <CreatorNotificationToggle />
            
            {/* Desktop Controls */}
            <div className="hidden lg:flex items-center gap-2">
              <LanguageToggle />
              <ModeToggle />
            </div>

            {/* Tablet & Mobile Dropdown Action Trigger */}
            <div className="flex lg:hidden items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 hover:bg-accent rounded-md transition-colors focus:outline-none"
                aria-label="Toggle context utilities"
                aria-expanded={isMenuOpen}
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

        {/* RESPONSIVE FLOATING DRAWER */}
        {isMenuOpen && (
          <div className="absolute top-14 left-0 right-0 z-20 border-b bg-background/95 backdrop-blur-sm p-4 shadow-md lg:hidden animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center justify-center gap-8">
              <div className="flex flex-col items-center gap-1">
                <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Language</span>
                <LanguageToggle />
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Interface Theme</span>
                <ModeToggle />
              </div>
            </div>
          </div>
        )}

        {/* ROOT MAIN SCENE DISPLAY */}
        <main className="flex flex-1 flex-col gap-4 px-4 py-6 min-w-0">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default App;
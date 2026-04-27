import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { StatCard } from "./status_card";
import { BookOpen, DollarSign, Eye, ThumbsUp } from "lucide-react";
import WelcomeBanner from "../common/welcome_banner";


export default function DashboardComponent() {
 
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <SidebarInset>
        <div className="flex flex-1 flex-col">
          <div className="flex flex-1 flex-col gap-6 @container/main">

            {/* HERO / BANNER */}
            <div className="px-4 lg:px-6">
              <WelcomeBanner />
            </div>

            {/* CONTENT */}
            <div className="flex flex-col gap-6 pb-6">

              {/* STATS GRID */}
              <div className="px-4 lg:px-6">
                <div className="grid grid-cols-1 gap-4 @xl/main:grid-cols-2 @2xl/main:grid-cols-4">
                  
                  <StatCard
                    title="Total Entertainment"
                    value="200"
                    sub="Current Month"
                    icon={BookOpen}
                    accent="bg-primary text-primary-foreground"
                  />

                  <StatCard
                    title="Total Revenue"
                    value="200"
                    sub="Current Month"
                    icon={DollarSign}
                    accent="bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300"
                  />

                  <StatCard
                    title="Total Views"
                    value="200"
                    sub="Current Month"
                    icon={Eye}
                    accent="bg-secondary text-secondary-foreground"
                  />

                  <StatCard
                    title="Total Likes"
                    value="200"
                    sub="Current Month"
                    icon={ThumbsUp}
                    accent="bg-primary/10 text-primary"
                  />
                </div>
              </div>

              {/* LOWER SECTION (TABLE AREA) */}
              <div className="px-4 lg:px-6">
                <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
                  {/* <DataTable data={data} /> */}
                  <div className="text-sm text-muted-foreground">
                    Data table coming soon...
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
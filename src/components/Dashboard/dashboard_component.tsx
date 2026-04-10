import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { StatCard } from "./status_card";
import { BookOpen, DollarSign, Eye, ThumbsUp } from "lucide-react";

export default function DashboardComponent() {
  //   useEffect(() => {
  //   const raw = decryptAuthData(localStorage.getItem('creator')!);
  //   console.log("localStorage raw →", raw?.creator);
  //   console.log("permission", raw?.creator?.permissions)
  // }, []);


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
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              {/* <SectionCards /> */}
              <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-3 @2xl/main:grid-cols-4">
                <StatCard
                  title="Total Entertainment"
                  value="200"
                  sub="Current Month"
                  icon={BookOpen}
                  accent="bg-primary text-white"
                />
                <StatCard
                  title="Total Revenue"
                  value="200"
                  sub="Current Month"
                  icon={DollarSign}
                  accent="bg-yellow-100 text-yellow-600 dark:bg-yellow-950 dark:text-yellow-400"
                />
                <StatCard
                  title="Total Views"
                  value="200"
                  sub="Current Month"
                  icon={Eye}
                  accent="bg-secondary "
                />
                <StatCard
                  title="Total Likes"
                  value="200"
                  sub="Current Month"
                  icon={ThumbsUp}
                  accent="bg-primary/50"
                />
              </div>
              <div className="px-4 lg:px-6">
              {/* <DataTable data={data} /> */}
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

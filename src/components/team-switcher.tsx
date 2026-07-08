import * as React from "react";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import amuze1 from "../assets/amuze2.png";

export function TeamSwitcher({
  teams,
}: {
  teams: {
    name: string;
    logo: React.ElementType;
    plan: string;
  }[];
}) {
  const activeTeam = teams[0];

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="relative h-12 w-full overflow-hidden rounded-lg p-0 focus-visible:ring-2 focus-visible:ring-primary border border-primary/10 hover:bg-transparent data-[state=open]:bg-transparent"
        >
          {/* The animated gradient border track */}
          <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,oklch(0.75_0.15_264.376)_0%,oklch(0.488_0.243_264.376)_50%,oklch(0.75_0.15_264.376)_100%)]" />

          {/* Masking container (simulates the 1px padding border) */}
          <span className="absolute inset-[2px] rounded-[7px] bg-sidebar flex items-center justify-start px-3 py-1 text-sm font-medium text-sidebar-foreground z-10 transition-colors hover:bg-sidebar-accent/50">
            
            {/* Logo */}
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg overflow-hidden shrink-0">
              <img src={amuze1} className="object-cover size-full" alt="Team Logo" />
            </div>
            
            {/* Metadata */}
            <div className="grid flex-1 text-left text-sm leading-tight ml-2">
              <span className="truncate font-medium">{activeTeam.name}</span>
              <span className="truncate text-xs text-muted-foreground">{activeTeam.plan}</span>
            </div>
          </span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
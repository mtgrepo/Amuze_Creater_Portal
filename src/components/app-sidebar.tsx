"use client"

import * as React from "react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import {  Layers, BriefcaseBusiness, Wallet, Newspaper, ChartNoAxesCombinedIcon, BellRing, UserCog, Settings } from "lucide-react"

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Amuze",
      logo: Layers,
      plan: "Creator Portal",
    },
  ],
  navMain: [
    {
      title: "Advertisers",
      url: "#",
      icon: BriefcaseBusiness,
      isActive: true,
      items: [
        {
          title: "Advertisers",
          url: "/advertisers",
        },
        {
          title: "Advertiser Profiles",
          url: "/advertiser-profiles",
        }
      ],
    },
    {
        title: "Financial",
        url: "#",
        icon: Wallet,
        items: [
            {
                title: "Transactions",
                url: "/transactions",
            }
        ]
    },
    {
      title: "Content",
      url: "#",
      icon: Newspaper,
      items: [
        {
          title: "Posts",
          url: "/content/posts",
        },
        {
          title: "Campaigns",
          url: "/campaigns",
        },
        {
          title: "Ads",
          url: "/ads",
        },        
      ],
    },
    {
      title: "Performance",
      url: "#",
      icon: ChartNoAxesCombinedIcon,
      items: [
        {
          title: "Daily ads status",
          url: "/daily-ads-status",
        },
      ],
    },
    {
        title: "Notifications",
        url: "#",
        icon: BellRing,
        items: [
            {
                title: "Notifications",
                url: "/notifications",
            }
        ]
    }
  ],
  projects: [
    {
      name: "Admin Users",
      url: "/admin-users",
      icon: UserCog,
    },
    {
      name: "System Configs",
      url: "/system-configs",
      icon: Settings,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

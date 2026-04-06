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
import {  Layers,  Newspaper, BellRing, Settings, FileChartColumnIncreasing, CreditCard, Eye, ThumbsUp, BookOpen, BookText, BookImage, BookHeadphones, Image, TvMinimalPlay, GraduationCap, Landmark, SquareParking, LayoutList, ListTree } from "lucide-react"
import { useSelector } from "react-redux"
import type { RootState } from "../redux/store/store"


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
      title: "Reports",
      url: "/report/purchase",
      icon: FileChartColumnIncreasing,
      isActive: true,
      items: [
        {
          title: "Author Report",
          url: "/report/author",
          icon: FileChartColumnIncreasing,
        },
        {
          title: "Purchase",
          url: "/report/purchase",
          icon: CreditCard,
        },
        {
          title: "View",
          url: "/report/view",
          icon: Eye,
        }, 
        {
          title: "Likes",
          url: "/report/likes",
          icon: ThumbsUp
        }
      ],
    },
    {
        title: "Entertainment",
        url: "#",
        icon: BookOpen,
        items: [
            {
                title: "Novel",
                url: "/entertainment/novel",
                icon: BookText
            }, 
            {
              title: "Comics",
              url: "/entertainment/comics",
              icon: BookImage
            },
            {
              title: "Story Telling",
              url: "/entertainment/storytelling",
              icon: BookHeadphones
            },
            {
              title: "Journal",
              url: "/entertainment/journal",
              icon: Newspaper
            },
            {
              title: "Gallary",
              url: "/entertainment/gallary",
              icon: Image
            },
            {
              title: "Muze Box",
              url: "/entertainment/muze-box",
              icon: TvMinimalPlay
            }, 
            {
              title: "Education",
              url: "/entertainment/education",
              icon: GraduationCap
            },
            {
              title: "Museum",
              url: "/entertainment/museum",
              icon: Landmark
            },
            {
              title: "Posts",
              url: "/entertainment/posts",
              icon: SquareParking
            }
        ]
    },
    {
      title: "Features & Genres",
      url: "/features/genres",
      icon: Settings,
      items: [
        {
          title: "Genres",
          url: "/features/genres",
          icon: Newspaper,
        },
        {
          title: "Main Category",
          url: "/features/main-category",
          icon: LayoutList,
        },
        {
          title: "Sub Category",
          url: "/features/sub-category",
          icon: ListTree,
        }
      ],
    }
  ],
  projects: [
    {
      name: "Notifications",
      url: "/notifications",
      icon: BellRing,
    },
    {
      name: "Setting",
      url: "/setting",
      icon: Settings,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const creator = useSelector((state: RootState) => state.auth.creator);

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
        { creator && <NavUser creator={creator} /> }
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

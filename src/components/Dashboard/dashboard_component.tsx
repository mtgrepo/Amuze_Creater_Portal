"use client";

import React, { useState } from "react";
import { useSelector } from "react-redux";
import { TrendingUp } from "lucide-react";

// Layout Wrappers
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// Custom Page Components
import WelcomeBanner from "./welcome_banner";
import { Carousel } from "../ui/apple-card-carousel";

// State Management
import type { RootState } from "@/redux/store/store";
import { useLoginCreatorQuery } from "@/composable/Query/Auth/useLoginCreatorQuery";
import { usePopularContentQuery } from "@/composable/Query/PopularContent/usePopularContentQuery";
import { Separator } from "../ui/separator";
import StatsReportCard from "../common/stats_report_card";
import { useWeeklyTopContentQuery } from "@/composable/Query/Report/useWeeklyTopQuery";


export const categories = [
  { key: "novel", value: "Novel" },
  { key: "comic", value: "Comic" },
  { key: "gallery", value: "Gallery" },
  { key: "storytelling", value: "StoryTelling" },
  { key: "muze-box", value: "Muze-Box" },
  // { key: "posts", value: "Posts" },
];

export default function DashboardComponent() {
  const creator = useSelector((state: RootState) => state.auth.creator);
  const { creatorData } = useLoginCreatorQuery(creator?.id!);
  const [activeTab, setActiveTab] = useState(categories[0].value);

  const { popularContents, isLoading } = usePopularContentQuery(
    activeTab.toLowerCase(),
  );

  const { weeklyTopContents, isLoading: weeklyLoading } = useWeeklyTopContentQuery();
  // console.log("weekly", weeklyTopContents)

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
        <div className="flex flex-1 flex-col bg-background">
          <div className="flex flex-1 flex-col gap-8 py-4 @container/main">
            {/* HERO BANNER SECTION */}
            <div className="px-4 lg:px-6">
              {creator && <WelcomeBanner creator={creatorData || creator} />}
            </div>

            {/*  STATS COUNT GRID */}
            <div className="px-4 lg:px-6">
              <StatsReportCard />
            </div>

            {/*  WEEKLY HOT CAROUSEL SECTION */}
            <div className="border border-border/50 rounded-2xl p-4 mx-4">
              {weeklyLoading ? (
                <div className="p-12 text-center text-sm text-muted-foreground w-full">
                  Loading weekly top contents...
                </div>
              ) : (
              <Carousel
                key={`weekly-${weeklyTopContents.length}`}
                items={weeklyTopContents}
                header="Weekly HOT"
                layoutScope="weekly-hot"
              />
              )}
            </div>

            {/*  POPULAR BY CATEGORY SECTION */}
            <div className="flex flex-col gap-4 border border-border/50  mx-4 p-4 rounded-2xl">
              {/* Refactored Section Header Layout */}
              <div className="flex items-center justify-between px-4 lg:px-6">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-orange-500 fill-orange-500" />
                  <h2 className="text-xl md:text-2xl font-bold tracking-tight">
                    Popular {activeTab}{" "}
                    {popularContents?.length
                      ? `(${popularContents.length})`
                      : ""}
                  </h2>
                </div>

                <Select
                  defaultValue={activeTab}
                  onValueChange={(value) => setActiveTab(value)}
                >
                  <SelectTrigger className="w-40 bg-card">
                    <SelectValue placeholder={activeTab} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {categories?.map((c) => (
                        <SelectItem key={c.key} value={c.value}>
                          {c.value}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <Separator />
              {/* Carousel Content Container */}
              {isLoading ? (
                <div className="p-12 text-center text-sm text-muted-foreground w-full">
                  Loading contents...
                </div>
              ) : (
                <Carousel
                  key={`popular-${activeTab}-${popularContents?.length || 0}`}
                  header={``}
                  layoutScope="popular-category"
                  items={(popularContents || []).map(
                    (item: any, idx: number) => ({
                      ...item,
                      thumbnail:
                        item.thumbnail ||
                        item.image ||
                        item.src ||
                        item.img ||
                        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3",
                      title:
                        item.title ||
                        item.name ||
                        `Untitled Content ${idx + 1}`,
                      category: item.category || activeTab,
                      content: item.content || (
                        <p>
                          {item.description || "No content preview available."}
                        </p>
                      ),
                      id: item.id || `popular-item-${idx}`,
                      createdBy: item?.createdByUser?.name,
                    }),
                  )}
                />
              )}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

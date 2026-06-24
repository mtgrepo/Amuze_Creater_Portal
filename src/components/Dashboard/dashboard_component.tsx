"use client";

import React, { useState } from "react";
import { useSelector } from "react-redux";

// Layout Wrappers
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
// Custom Page Components
import WelcomeBanner from "./welcome_banner";
import { Carousel } from "../ui/apple-card-carousel";

// State Management
import type { RootState } from "@/redux/store/store";
import { useLoginCreatorQuery } from "@/composable/Query/Auth/useLoginCreatorQuery";
import { usePopularContentQuery } from "@/composable/Query/PopularContent/usePopularContentQuery";
import StatsReportCard from "../common/stats_report_card";
import { useWeeklyTopContentQuery } from "@/composable/Query/Report/useWeeklyTopQuery";
import BentoGridSecondDemo from "../bento-grid-demo-2";

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

  const { weeklyTopContents, isLoading: weeklyLoading } =
    useWeeklyTopContentQuery();
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
            <div className="px-4 lg:px-6">
            {/* <BentoGridSecondDemo /> */}
            {weeklyLoading ? (
                <div className="p-12 text-center text-sm text-muted-foreground w-full">
                  Loading weekly top contents...
                </div>
              ) : (
                <BentoGridSecondDemo items={weeklyTopContents ?? []}/>
              )}
            </div>

            {/*  POPULAR BY CATEGORY SECTION */}
            <div className="flex flex-col gap-4 px-4 lg:px-6 rounded-2xl">
              {/* Carousel Content Container */}
              {isLoading ? (
                <div className="p-12 text-center text-sm text-muted-foreground w-full">
                  Loading contents...
                </div>
              ) : (
                <Carousel
                  key={`popular-${activeTab}-${popularContents?.length || 0}`}
                  header={`Popular Contents`}
                  layoutScope="popular-category"
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  type="popular"
                  filters={categories}
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

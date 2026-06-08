"use client";

import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  TrendingUp,
  BookOpen,
  DollarSign,
  Users,
  Eye,
  ThumbsUp,
  MessageCircle,
} from "lucide-react";

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
import { StatCard } from "./status_card";
import WelcomeBanner from "./welcome_banner";
import { Card as AppleCard, Carousel } from "../ui/apple-card-carousel";

// State Management
import type { RootState } from "@/redux/store/store";
import { useLoginCreatorQuery } from "@/composable/Query/Auth/useLoginCreatorQuery";

type CardType = {
  src: string;
  title: string;
  category: string;
  likes?: number;
  views?: number;
  content: React.ReactNode;
};

export const dummyCards: CardType[] = [
  {
    src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
    title: "Exploring the Coastline",
    category: "Novel",
    likes: 1240,
    views: 5430,
    content: (
      <p>
        Discover the hidden beaches and breathtaking cliffs along the Pacific
        Coast Highway.
      </p>
    ),
  },
  {
    src: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3",
    title: "The Future of Web Development",
    category: "Muze Box",
    likes: 890,
    views: 3120,
    content: (
      <div className="flex flex-col gap-2">
        <p>
          AI-driven code generation and edge computing are changing the
          landscape fast.
        </p>
        <button className="mt-2 w-fit bg-black text-white dark:bg-white dark:text-black px-4 py-2 rounded-xl text-sm font-medium">
          Read Article
        </button>
      </div>
    ),
  },
  {
    src: "https://images.unsplash.com/photo-1498837167922-ddd27525d352",
    title: "10-Minute Morning Meditation",
    category: "Comics",
    likes: 954,
    views: 2110,
    content: (
      <p>
        A quick guide to grounding yourself before starting a busy, fast-paced
        workday.
      </p>
    ),
  },
  {
    src: "https://images.unsplash.com/photo-1541701494587-cb58502866ab",
    title: "Chasing Abstract Realities",
    category: "Novel",
    likes: 430,
    views: 1290,
    content: (
      <p>
        Dive deep into modern digital expressionism and blending AI with
        brushstrokes.
      </p>
    ),
  },
  {
    src: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
    title: "The Cyberpunk Syntax Guide",
    category: "Muze Box",
    likes: 2140,
    views: 8750,
    content: (
      <p>
        Mastering modern frameworks while optimizing low-level hardware
        performance layouts.
      </p>
    ),
  },
  {
    src: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
    title: "Echoes of Yosemite Valley",
    category: "Comics",
    likes: 1850,
    views: 4320,
    content: (
      <p>
        Photographic captures detailing the rugged trails and natural giants of
        California.
      </p>
    ),
  },
  {
    src: "https://images.unsplash.com/photo-1490730141103-6cac27aaab94",
    title: "The Architecture of Serendipity",
    category: "Novel",
    likes: 620,
    views: 1980,
    content: (
      <p>
        How unexpected design alignments in urban spaces subconsciously impact
        creative output.
      </p>
    ),
  },
  {
    src: "https://images.unsplash.com/photo-1550745165-9bc0b252726f",
    title: "Retro Retrofitted Hardware",
    category: "Muze Box",
    likes: 3110,
    views: 9450,
    content: (
      <p>
        Modding obsolete 8-bit sound chipboards into modern synth MIDI
        controllers.
      </p>
    ),
  },
];

export const chartData = [
  { category: "novel", visitors: 275, fill: "var(--color-chrome)" },
  { category: "comics", visitors: 200, fill: "var(--color-safari)" },
  { category: "gallery", visitors: 187, fill: "var(--color-firefox)" },
  { category: "storytelling", visitors: 173, fill: "var(--color-edge)" },
  { category: "muzebox", visitors: 90, fill: "var(--color-other)" },
  { category: "posts", visitors: 30, fill: "var(--color-primary)" },
];

export const categories = [
  { key: "novel", value: "Novel" },
  { key: "comics", value: "Comics" },
  { key: "gallery", value: "Gallery" },
  { key: "storytelling", value: "Story Telling" },
  { key: "muzebox", value: "Muze Box" },
  { key: "post", value: "Post" },
];

export default function DashboardComponent() {
  const creator = useSelector((state: RootState) => state.auth.creator);
  const { creatorData } = useLoginCreatorQuery(creator?.id!);
  const [activeTab, setActiveTab] = useState(categories[0].value);

  const cardElements = dummyCards.map((card, index) => (
    <AppleCard key={card.title} card={card} index={index} layout={true} />
  ));

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
            {/* HERO BANNER SECTION */}
            <div className="px-4 lg:px-6">
              {creator && <WelcomeBanner creator={creatorData || creator} />}
            </div>

            {/* DASHBOARD BODY */}
            <div className="flex flex-col gap-6 pb-6">
              {/* STATS COUNT GRID */}
              <div className="px-4 lg:px-6">
                <div className="grid grid-cols-1 gap-4 @xl/main:grid-cols-2 @2xl/main:grid-cols-3">
                  <StatCard
                    title="Total Published Contents"
                    value="200"
                    previousValue="213"
                    sub="Current Month"
                    icon={BookOpen}
                    accent="bg-primary text-primary-foreground"
                  />
                  <StatCard
                    title="Total Revenue"
                    value="200"
                    previousValue="143"
                    sub="Current Month"
                    icon={DollarSign}
                    accent="bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300"
                  />
                  <StatCard
                    title="Total Followers"
                    value="200"
                    previousValue="147"
                    sub="Current Month"
                    icon={Users}
                    accent="bg-secondary"
                  />
                  <StatCard
                    title="Total Views"
                    value="46"
                    previousValue="100"
                    sub="Current Month"
                    icon={Eye}
                    accent="bg-secondary"
                  />
                  <StatCard
                    title="Total Likes"
                    value="200"
                    previousValue="135"
                    sub="Current Month"
                    icon={ThumbsUp}
                    accent="bg-primary text-primary-foreground"
                  />
                  <StatCard
                    title="Total Comments"
                    value="100"
                    previousValue="100"
                    sub="Current Month"
                    icon={MessageCircle}
                    accent="bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300"
                  />
                </div>
              </div>

              {/* WEEKLY HOT APPLE CAROUSEL */}
              <div>
                <Carousel items={cardElements} header="Weekly HOT" />
              </div>

              {/* CHARTS METRICS DISPLAY */}
              <div className="grid grid-cols-1 gap-6 px-4 lg:px-6 bg-card rounded-2xl m-4 p-4">
                <div className="flex flex-col xl:flex-row justify-between border-b border-border pb-3">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-6 w-6 text-orange-500 fill-orange-500 animate-pulse" />
                    <h2 className="text-xl md:text-2xl font-bold">
                      Popular by Category
                    </h2>
                  </div>
                  <Select defaultValue={activeTab} onValueChange={(value) => setActiveTab(value)}>
                    <SelectTrigger className="w-45">
                      <SelectValue placeholder={activeTab} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {categories?.map((c) => (
                          <SelectItem
                          key={c.key}
                            value={c.value}
                          >
                            {c.value}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <h1 className="text-xl font-semibold">{activeTab} Performance Analytics</h1>
              </div>

              {/* TABLE BOUNDARY */}
              {/* <div className="px-4 lg:px-6">
                <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
                  <div className="text-sm text-muted-foreground">
                    Data table coming soon...
                  </div>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

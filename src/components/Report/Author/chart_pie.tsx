"use client";

import { Pie, PieChart } from "recharts";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { useState } from "react";

export const description = "A pie chart with a legend";

const chartData = [
  { browser: "novel", visitors: 275, fill: "var(--color-novel)" },
  { browser: "comic", visitors: 200, fill: "var(--color-comic)" },
  { browser: "gallery", visitors: 187, fill: "var(--color-gallery)" },
  { browser: "storyTelling", visitors: 173, fill: "var(--color-storyTelling)" },
  { browser: "muzebox", visitors: 90, fill: "var(--color-muzebox)" },
];

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  novel: {
    label: "Novel",
    color: "var(--chart-1)",
  },
  comic: {
    label: "Comic",
    color: "var(--chart-2)",
  },
  gallery: {
    label: "Gallery",
    color: "var(--chart-3)",
  },
  storyTelling: {
    label: "Story Telling",
    color: "var(--chart-4)",
  },
  muzebox: {
    label: "Muze Box",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig;

export const filterTypes = [
  { key: "Views", value: "views" },
  { key: "Likes", value: "likes" },
  { key: "Comments", value: "comments" },
];

export function ChartPieLegend() {
  const [activeTab, setActiveTab] = useState(filterTypes[0].value);

  return (
    <Card className="flex flex-col bg-background shadow-xl">
      <CardHeader className="items-center pb-0">
        <CardTitle>Entertainment - Overview</CardTitle>
        <CardDescription className="flex flex-row justify-between">
          January - June 2024
          <Select
            defaultValue={activeTab}
            onValueChange={(value) => setActiveTab(value)}
          >
            <SelectTrigger className="">
              <SelectValue placeholder={activeTab} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {filterTypes?.map((c) => (
                  <SelectItem key={c.key} value={c.value}>
                    {c.key}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="w-full  h-full min-h-87.5"
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent />} />
            <Pie data={chartData} dataKey="visitors" innerRadius={70}/>
            <ChartLegend
              content={<ChartLegendContent nameKey="browser" />}
              className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

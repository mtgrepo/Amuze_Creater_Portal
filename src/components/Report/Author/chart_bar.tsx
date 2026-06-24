"use client";

import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { format, isValid, parseISO, startOfMonth, endOfMonth, isAfter, isBefore } from "date-fns";

import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
// import { useIncomeChartQuery } from "@/composable/Query/Report/useIncomeChartQuery";

export const description = "A multiple line chart with a date range filter";

const chartData = [
  { date: "2026-06-01", novel: 100, comic: 120, gallery: 250, storytelling: 100, muzebox: 550, post: 750, subscription: 700, free: 120 },
  { date: "2026-06-02", novel: 105, comic: 122, gallery: 248, storytelling: 102, muzebox: 552, post: 745, subscription: 702, free: 122 },
  { date: "2026-06-03", novel: 110, comic: 125, gallery: 252, storytelling: 105, muzebox: 555, post: 740, subscription: 705, free: 125 },
  { date: "2026-06-04", novel: 115, comic: 128, gallery: 245, storytelling: 108, muzebox: 558, post: 735, subscription: 708, free: 128 },
  { date: "2026-06-05", novel: 120, comic: 130, gallery: 240, storytelling: 110, muzebox: 560, post: 730, subscription: 710, free: 130 },
  { date: "2026-06-06", novel: 124, comic: 126, gallery: 246, storytelling: 107, muzebox: 556, post: 740, subscription: 716, free: 132 },
  { date: "2026-06-07", novel: 128, comic: 122, gallery: 252, storytelling: 104, muzebox: 552, post: 750, subscription: 722, free: 134 },
  { date: "2026-06-08", novel: 132, comic: 118, gallery: 258, storytelling: 101, muzebox: 548, post: 760, subscription: 728, free: 136 },
  { date: "2026-06-09", novel: 136, comic: 114, gallery: 264, storytelling: 98,  muzebox: 544, post: 770, subscription: 734, free: 138 },
  { date: "2026-06-10", novel: 140, comic: 110, gallery: 270, storytelling: 95,  muzebox: 540, post: 780, subscription: 740, free: 140 },
  { date: "2026-06-11", novel: 138, comic: 118, gallery: 268, storytelling: 97,  muzebox: 548, post: 772, subscription: 736, free: 137 },
  { date: "2026-06-12", novel: 136, comic: 126, gallery: 266, storytelling: 99,  muzebox: 556, post: 764, subscription: 732, free: 134 },
  { date: "2026-06-13", novel: 134, comic: 134, gallery: 264, storytelling: 101, muzebox: 564, post: 756, subscription: 728, free: 131 },
  { date: "2026-06-14", novel: 132, comic: 142, gallery: 262, storytelling: 103, muzebox: 572, post: 748, subscription: 724, free: 128 },
  { date: "2026-06-15", novel: 130, comic: 150, gallery: 260, storytelling: 105, muzebox: 580, post: 740, subscription: 720, free: 125 },
  { date: "2026-06-16", novel: 136, comic: 154, gallery: 266, storytelling: 110, muzebox: 584, post: 754, subscription: 728, free: 130 },
  { date: "2026-06-17", novel: 142, comic: 158, gallery: 272, storytelling: 115, muzebox: 588, post: 768, subscription: 736, free: 135 },
  { date: "2026-06-18", novel: 148, comic: 162, gallery: 278, storytelling: 120, muzebox: 592, post: 782, subscription: 744, free: 140 },
  { date: "2026-06-19", novel: 154, comic: 166, gallery: 284, storytelling: 125, muzebox: 596, post: 796, subscription: 752, free: 145 },
  { date: "2026-06-20", novel: 160, comic: 170, gallery: 290, storytelling: 130, muzebox: 600, post: 810, subscription: 760, free: 150 },
  { date: "2026-06-21", novel: 164, comic: 168, gallery: 288, storytelling: 128, muzebox: 604, post: 806, subscription: 764, free: 152 },
  { date: "2026-06-22", novel: 168, comic: 166, gallery: 286, storytelling: 126, muzebox: 608, post: 802, subscription: 768, free: 154 },
  { date: "2026-06-23", novel: 172, comic: 164, gallery: 284, storytelling: 124, muzebox: 612, post: 798, subscription: 772, free: 156 },
  { date: "2026-06-24", novel: 176, comic: 162, gallery: 282, storytelling: 122, muzebox: 616, post: 794, subscription: 776, free: 158 },
  { date: "2026-06-25", novel: 180, comic: 160, gallery: 280, storytelling: 120, muzebox: 620, post: 790, subscription: 780, free: 160 },
  { date: "2026-06-26", novel: 184, comic: 166, gallery: 286, storytelling: 124, muzebox: 626, post: 800, subscription: 786, free: 163 },
  { date: "2026-06-27", novel: 188, comic: 172, gallery: 292, storytelling: 128, muzebox: 632, post: 810, subscription: 792, free: 166 },
  { date: "2026-06-28", novel: 192, comic: 178, gallery: 298, storytelling: 132, muzebox: 638, post: 820, subscription: 798, free: 169 },
  { date: "2026-06-29", novel: 196, comic: 184, gallery: 304, storytelling: 136, muzebox: 644, post: 830, subscription: 804, free: 172 },
  { date: "2026-06-30", novel: 200, comic: 190, gallery: 310, storytelling: 140, muzebox: 650, post: 840, subscription: 810, free: 175 },
  { date: "2026-07-01", novel: 250, comic: 360, gallery: 355, storytelling: 120, muzebox: 1160, post: 600, subscription: 600, free: 700 }
];

const chartConfig = {
  novel: { label: "Novel", color: "var(--chart-1)" },
  comic: { label: "Comic", color: "var(--chart-2)" },
  gallery: { label: "Gallery", color: "var(--chart-3)" },
  storytelling: { label: "Storytelling", color: "var(--chart-4)" },
  muzebox: { label: "Muzebox", color: "var(--chart-5)" },
  post: { label: "Post", color: "#ec4899" },
  // subscription: { label: "Subscription", color: "#8b5cf6" },
  // free: { label: "Free", color: "#f59e0b" },
} satisfies ChartConfig;

// Derived list of line data strictly keys off chartConfig for complete type-safety
const metrics = Object.keys(chartConfig) as Array<keyof typeof chartConfig>;

// Helper moved outside the component context to save recreation overhead on renders
const getSafeDate = (dateStr: string): Date | undefined => {
  if (!dateStr) return undefined;
  const d = parseISO(dateStr);
  return isValid(d) ? d : undefined;
};

export function ChartLineMultiple() {
  // const { incomeChartData } = useIncomeChartQuery();
  const now = React.useMemo(() => new Date(), []);
  
  const [startDate, setStartDate] = React.useState<string>(() => 
    format(startOfMonth(now), "yyyy-MM-dd")
  );
  const [endDate, setEndDate] = React.useState<string>(() => 
    format(endOfMonth(now), "yyyy-MM-dd")
  );

  // Reactive filtering using optimized early returns
  const filteredChartData = React.useMemo(() => {
    const startParsed = getSafeDate(startDate);
    const endParsed = getSafeDate(endDate);

    return chartData.filter((item) => {
      if (!item.date) return false;
      const itemDate = parseISO(item.date);
      
      if (startParsed && isBefore(itemDate, startParsed)) return false;
      if (endParsed && isAfter(itemDate, endParsed)) return false;
      
      return true;
    });
  }, [startDate, endDate]);
  

  const parsedStart = getSafeDate(startDate);
  const parsedEnd = getSafeDate(endDate);

  return (
    <Card className="bg-background shadow-xl">
      <CardHeader>
        <CardTitle className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <span className="text-xl font-bold">Performance - Analytics</span>
          {/* Date Filters */}
          <div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Start Date Picker */}
              <div className="relative">
                <label className="absolute -top-2 left-3 px-1 bg-card text-xs font-medium text-muted-foreground">
                  Start Date
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full sm:w-45 justify-start border-2 rounded-lg mt-1",
                        !startDate && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {parsedStart ? format(parsedStart, "PPP") : "Select start date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={parsedStart}
                      onSelect={(d) => setStartDate(d ? format(d, "yyyy-MM-dd") : "")}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* End Date Picker */}
              <div className="relative">
                <label className="absolute -top-2 left-3 px-1 bg-card text-xs font-medium text-muted-foreground">
                  End Date
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full sm:w-45 justify-start border-2 rounded-lg mt-1",
                        !endDate && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {parsedEnd ? format(parsedEnd, "PPP") : "Select end date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={parsedEnd}
                      onSelect={(d) => setEndDate(d ? format(d, "yyyy-MM-dd") : "")}
                      disabled={parsedStart ? { before: parsedStart } : undefined}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
        </CardTitle>
        <CardDescription>
          {parsedStart && parsedEnd
            ? `${format(parsedStart, "LLL yyyy")} - ${format(parsedEnd, "LLL yyyy")}`
            : "Multi-line date performance analytics"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="aspect-auto h-full min-h-[350px] w-full">
          <LineChart
            accessibilityLayer
            data={filteredChartData}
            margin={{ left: 12, right: 12, top: 12, bottom: 12 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
              
            />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            {metrics.map((key) => (
              <Line
                key={key}
                dataKey={key}
                type="monotone"
                stroke={chartConfig[key].color}
                strokeWidth={2}
                dot={false}
              />
            ))}
          </LineChart>
          
        </ChartContainer>
      </CardContent>

    </Card>
  );
}
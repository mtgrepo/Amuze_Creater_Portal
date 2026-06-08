"use client"

import { TrendingUp } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

export const description = "A line chart showing visitors and incomes over 12 months"

// 1. Updated data to include all 12 months with "desktop" (visitors) and "income"
const chartData = [
  { month: "January", desktop: 186, income: 2500 },
  { month: "February", desktop: 305, income: 3100 },
  { month: "March", desktop: 237, income: 2800 },
  { month: "April", desktop: 73, income: 1500 },
  { month: "May", desktop: 209, income: 2900 },
  { month: "June", desktop: 214, income: 3200 },
  { month: "July", desktop: 245, income: 3600 },
  { month: "August", desktop: 270, income: 3900 },
  { month: "September", desktop: 310, income: 4300 },
  { month: "October", desktop: 280, income: 3800 },
  { month: "November", desktop: 340, income: 4600 },
  { month: "December", desktop: 410, income: 5500 },
]

// 2. Updated configuration to define labels and theme colors for both metrics
const chartConfig = {
  desktop: {
    label: "Visitors",
    color: "var(--chart-1)",
  },
  income: {
    label: "Income ($)",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

export function ChartLineLabel() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Income Overview</CardTitle>
        <CardDescription>January - December 2026</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Adjusted to a fixed height class (h-[240px]) to keep the Y-axis compact */}
        <ChartContainer config={chartConfig} className="w-full max-h-60">
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 24,
              left: 16,
              right: 16,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              interval="preserveStartEnd" // Prevents 12 months of text from overlapping
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            
            {/* Line 1: Visitors (Desktop) */}
            {/* <Line
              dataKey="desktop"
              type="natural"
              stroke="var(--color-desktop)"
              strokeWidth={2}
              dot={{
                fill: "var(--color-desktop)",
              }}
              activeDot={{
                r: 6,
              }}
            >
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={11}
              />
            </Line> */}

            {/* : Incomes */}
            <Line
              dataKey="income"
              type="natural"
              stroke="var(--color-income)"
              strokeWidth={2}
              dot={{
                fill: "var(--color-income)",
              }}
              activeDot={{
                r: 6,
              }}
            >
            </Line>
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors and income metrics for the past year
        </div>
      </CardFooter>
    </Card>
  )
}
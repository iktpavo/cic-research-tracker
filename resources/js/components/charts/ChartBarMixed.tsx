"use client"
import { Bar, BarChart as RechartsBarChart, XAxis, YAxis, CartesianGrid } from "recharts"
import { BarChart as BarChartIcon } from "lucide-react"


import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export const description = "A mixed bar chart"

export interface MonthData {
  month: string
  research: number
  researchMember: number // users linked to research
  publications: number
  utilizations: number
  user: number // normal users
}

interface ChartBarMixedProps {
  data: MonthData[]
  maxValue?: number
}

export function ChartBarMixed({ data, maxValue = 100 }: ChartBarMixedProps) {
  // Sum totals for each metric
  const totals = {
    Research: data.reduce((acc, d) => acc + d.research, 0),
    ResearchMember: data.reduce((acc, d) => acc + d.researchMember, 0),
    Publications: data.reduce((acc, d) => acc + d.publications, 0),
    Utilizations: data.reduce((acc, d) => acc + d.utilizations, 0),
    User: data.reduce((acc, d) => acc + d.user, 0),
  }

  const chartData = [
    { name: 'Research', value: Math.min(totals.Research, maxValue), rawValue: totals.Research, fill: 'var(--chart-1)' },
    { name: 'Members', value: Math.min(totals.ResearchMember, maxValue), rawValue: totals.ResearchMember, fill: 'var(--chart-2)' },
    { name: 'Publications', value: Math.min(totals.Publications, maxValue), rawValue: totals.Publications, fill: 'var(--chart-3)' },
    { name: 'Utilizations', value: Math.min(totals.Utilizations, maxValue), rawValue: totals.Utilizations, fill: 'var(--chart-4)' },
    { name: 'Users', value: Math.min(totals.User, maxValue), rawValue: totals.User, fill: 'var(--chart-5)' },
  ]

  const chartConfig = Object.fromEntries(
    chartData.map((d) => [
      d.name,
      { label: `${d.name} (${d.rawValue})`, color: d.fill },
    ])
  ) satisfies ChartConfig

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-md font-medium text-primary">
          System and Research Metrics
        </CardTitle>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
          <BarChartIcon className="h-4 w-4 text-sidebar-accent-foreground dark:text-blue-400" />
        </div>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig}>
          <RechartsBarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{ left: -33, right: 0 }}
          >
            <CartesianGrid vertical={true} horizontal={true} stroke="#e4d8d8ff" strokeDasharray={3} />
            <YAxis
              dataKey="name"
              type="category"
              tickLine={false}
              tickMargin={0}
              axisLine={false}
              width={134}
              tickFormatter={(value) =>
                chartConfig[value as keyof typeof chartConfig]?.label
              }
            />
            <XAxis dataKey="value" type="number" hide domain={[0, maxValue]} />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="value" layout="vertical" radius={5} />
          </RechartsBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">

        <div className="text-muted-foreground leading-none">
          Showing total counts (capped at {maxValue})
        </div>
      </CardFooter>
    </Card>
  )
}

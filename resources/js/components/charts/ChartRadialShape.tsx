"use client"

import * as React from "react"
import { Label, Pie, PieChart, Sector } from "recharts"
import { PieSectorDataItem } from "recharts/types/polar/Pie"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  ChartConfig,
  ChartContainer,
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
interface ChartPieInteractiveProps {
  data: {
    month: string
    count: number
    fill?: string
  }[]
  activeMonth: string
  setActiveMonth: (month: string) => void
}


export function ChartPieInteractive({ data, activeMonth, setActiveMonth }: ChartPieInteractiveProps) {
  const id = "pie-interactive"

  const activeIndex = React.useMemo(
    () => data.findIndex((item) => item.month === activeMonth),
    [activeMonth, data]
  )

  const months = React.useMemo(() => data.map((item) => item.month), [data])

  // Dynamic chart config for colors and labels
  const chartConfig = React.useMemo(() => {
    const cfg: ChartConfig = { visitors: { label: "Visitors" } }
    months.forEach((month, i) => {
      cfg[month] = {
        label: month[0].toUpperCase() + month.slice(1),
        color: data[i]?.fill || `var(--color-${month})`,
      }
    })
    return cfg
  }, [months, data])

  return (
    <Card data-chart={id} >
      <ChartStyle id={id} config={chartConfig} />
      <CardHeader className="flex-row items-start space-y-0 pb-0">
        <div className="grid gap-1">
          <CardTitle>Monthly Logins</CardTitle>
          <CardDescription>Last 6 Months</CardDescription>
        </div>
        <Select value={activeMonth} onValueChange={setActiveMonth}>
          <SelectTrigger className="ml-auto h-7 w-[130px] rounded-lg pl-2.5">
            <SelectValue placeholder="Select month" />
          </SelectTrigger>
          <SelectContent align="end" className="rounded-xl">
            {months.map((month) => (
              <SelectItem key={month} value={month} className="rounded-lg [&_span]:flex">
                <div className="flex items-center gap-2 text-xs">
                  <span
                    className="flex h-3 w-3 shrink-0 rounded-xs"
                    style={{ backgroundColor: chartConfig[month].color }}
                  />
                  {chartConfig[month].label}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="flex flex-1 justify-center pb-0 items-center -mt-4">
        <ChartContainer id={id} config={chartConfig} className="mx-auto aspect-square w-full max-w-[300px]">
          <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={data}
              dataKey="count"
              nameKey="month"
              innerRadius={60}
              strokeWidth={5}
              activeIndex={activeIndex}
              activeShape={(props: PieSectorDataItem) => (
                <g>
                  <Sector {...props} outerRadius={(props.outerRadius || 0) + 10} />
                  <Sector
                    {...props}
                    outerRadius={(props.outerRadius || 0) + 25}
                    innerRadius={(props.outerRadius || 0) + 12}
                  />
                </g>
              )}
            >
              <Label
                content={({ viewBox }) => {
                  if (!viewBox || !("cx" in viewBox && "cy" in viewBox)) return null
                  return (
                    <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                      <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-3xl font-bold">
                        {data[activeIndex]?.count.toLocaleString()}
                      </tspan>
                      <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className="fill-muted-foreground">
                        Visitors
                      </tspan>
                    </text>
                  )
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

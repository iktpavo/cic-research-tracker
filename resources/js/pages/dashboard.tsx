import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Activity, ChartNoAxesCombined, CheckCircle, Newspaper } from "lucide-react";
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage, router } from '@inertiajs/react';
import {
    LineChart,
    Line,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import { CustomTooltip } from "@/components/dashboard/CustomTooltip";

// props
interface DashboardProps {
    counts: { ongoing: number; completed: number; publications: number; };
    filters: { program: string };
    programOptions: string[];
    yearlyTrends: { year: number; publications: number; completed: number }[];
    [key: string]: unknown;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

export default function Dashboard() {
    const { props } = usePage<DashboardProps>();
    const { counts, filters, programOptions, yearlyTrends } = props;

    const handleProgramChange = (value: string) => {
        router.get('/dashboard', { program: value }, { preserveScroll: true, preserveState: true });
    };

    const chart1Color = "var(--chart-1)";
    const chart2Color = "var(--chart-2)";

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 p-6 md:py-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="space-y-1">
                        <div className="flex ">
                            <ChartNoAxesCombined className="w-6 h-6 mr-2" />
                            <h1 className="text-2xl font-bold tracking-tight text-foreground">
                                Research Overview
                            </h1>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Key performance indicators and research trends.
                        </p>
                    </div>
                    <div className="flex gap-4 items-center">
                        <div className="w-48">
                            <Select value={filters.program} onValueChange={handleProgramChange}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Program" />
                                </SelectTrigger>

                                <SelectContent>
                                    {programOptions.map((p) => (
                                        <SelectItem key={p} value={p}>
                                            {p === "all" ? "All Programs" : p}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    <Card className="relative overflow-hidden shadow-sm transition-all hover:shadow-md hover:bg-accent/5">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-md font-medium text-primary">
                                Ongoing Researches
                            </CardTitle>
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                                <Activity className="h-4 w-4 text-sidebar-accent-foreground dark:text-blue-400" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold tracking-tighter">{counts.ongoing}</div>
                            <p className="text-xs text-muted-foreground  mt-1">
                                Active researches in progress
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="relative overflow-hidden shadow-sm transition-all hover:shadow-md hover:bg-accent/5">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-md font-medium text-primary">
                                Completed Researches
                            </CardTitle>
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold tracking-tighter">{counts.completed}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Successfully finished researches
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="relative overflow-hidden shadow-sm transition-all hover:shadow-md hover:bg-accent/5">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-md font-medium text-primary">
                                Published Researches
                            </CardTitle>
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30">
                                <Newspaper className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold tracking-tighter">{counts.publications}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Researches published in journals
                            </p>
                        </CardContent>
                    </Card>
                </div>
                <Card className="border-none shadow-md ring-1 ring-border/50 ">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold">Performance Trends</CardTitle>
                        <CardDescription>
                            Comparative view of publications versus completed research over the years.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pl-0">
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={yearlyTrends} margin={{ top: 20, right: 30, left: 10, bottom: 0 }}>
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        vertical={false}
                                        stroke="hsl(var(--border))"
                                        opacity={0.4}
                                    />
                                    <XAxis
                                        dataKey="year"
                                        stroke="hsl(var(--muted-foreground))"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        tickMargin={12}
                                    />
                                    <YAxis
                                        allowDecimals={false}
                                        stroke="hsl(var(--muted-foreground))"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(value) => `${value}`}
                                    />
                                    <Tooltip
                                        content={<CustomTooltip />}
                                        cursor={{ stroke: 'hsl(var(--muted-foreground))', strokeWidth: 1, strokeDasharray: '4 4' }}
                                    />
                                    <Legend
                                        verticalAlign="top"
                                        height={36}
                                        iconType="circle"
                                        wrapperStyle={{ paddingBottom: '20px', fontSize: '14px' }}
                                    />

                                    <Line
                                        type="monotone"
                                        dataKey="publications"
                                        stroke={chart1Color}
                                        strokeWidth={2.5}
                                        dot={{ r: 1, fill: chart1Color, strokeWidth: 2, stroke: 'hsl(var(--background))' }}
                                        activeDot={{ r: 4, strokeWidth: 0 }}
                                        name="Publications"
                                        animationDuration={1500}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="completed"
                                        stroke={chart2Color}
                                        strokeWidth={2}
                                        dot={{ r: 1, fill: chart2Color, strokeWidth: 2, stroke: 'hsl(var(--background))' }}
                                        activeDot={{ r: 4, strokeWidth: 0 }}
                                        name="Completed"
                                        animationDuration={1500}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

            </div>
        </AppLayout>
    );
}
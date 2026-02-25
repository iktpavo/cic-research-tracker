"use client";

import React, { useState, useMemo } from "react";
import { Head, useForm, router } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { route } from "ziggy-js";
import { Trash2, Users, Search, ChartNoAxesCombined } from "lucide-react";
import Pagination from "@/components/ui/Pagination";
import UserFilters from "@/components/usermanagementdashboard/UserFilters";
import { UserFiltersData } from "@/types/filters";
import { DeleteDialog } from "@/components/ui/DeleteDialog";
import {
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { SectionCards } from "@/components/charts/AnalyticsCard";
import { ChartPieInteractive } from "@/components/charts/ChartRadialShape";
import { ChartBarMixed } from "@/components/charts/ChartBarMixed";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at: string;
  last_login_at: string | null;
  last_logout_at: string | null;
}

interface LoginTraffic {
  date: string;
  count: number;
}

interface PaginatedUsers {
  data: User[];
  current_page: number;
  last_page: number;
  links: Array<{ url: string | null; label: string; active: boolean }>;
}

interface Props {
  users: PaginatedUsers;
  loginTraffic: LoginTraffic[];
  newThisWeek: number;
  past7daysCount: number;
  activeToday: number;
  halfYearStats: HalfYearStatsItem[];
  allUsers: User[];
}

interface HalfYearStatsItem {
  month: string;
  research: number;
  researchMember: number;
  publications: number;
  utilizations: number;
  user: number;
}

export default function UserDashboard({
  users,
  loginTraffic,
  newThisWeek,
  activeToday,
  halfYearStats,
  allUsers
}: Props) {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const prevMonthDate = new Date(currentYear, currentMonth - 1, 1);
  const prevMonth = prevMonthDate.getMonth();
  const prevYear = prevMonthDate.getFullYear();


  // Users created last month
  const newUsersLastMonth = allUsers.filter(u => {
    const created = new Date(u.created_at);
    return created.getMonth() === prevMonth && created.getFullYear() === prevYear;
  }).length;


  // Total logins this month
  const totalLoginsThisMonth = allUsers.filter(u => {
    if (!u.last_login_at) return false;
    const login = new Date(u.last_login_at);
    return login.getMonth() === currentMonth && login.getFullYear() === currentYear;
  }).length;

  // Total logins last month
  const totalLoginsLastMonth = allUsers.filter(u => {
    if (!u.last_login_at) return false;
    const login = new Date(u.last_login_at);
    return login.getMonth() === prevMonth && login.getFullYear() === prevYear;
  }).length;

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const { delete: destroy } = useForm();
  const [filters, setFilters] = useState<UserFiltersData>({
    search: "",
    role: "any",
    sort: undefined,
  });
  const [timeRange, setTimeRange] = useState<"7d" | "30d">("7d");


  const filteredTraffic = useMemo(() => {
    const now = new Date();
    const days = timeRange === "7d" ? 7 : 30;
    const startDate = new Date(now);
    startDate.setDate(now.getDate() - days);
    return loginTraffic.filter((item) => new Date(item.date) >= startDate);
  }, [loginTraffic, timeRange]);



  const last6MonthsData = useMemo(() => {
    const monthColors = ["#1E3A8A", "#1E40AF", "#1D4ED8", "#2563EB", "#3B82F6", "#60A5FA"];
    const now = new Date();
    const months: { month: string; count: number; fill: string }[] = [];

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = d.toLocaleString("default", { month: "short" });
      const count = loginTraffic
        .filter((item) => {
          const date = new Date(item.date);
          return date.getMonth() === d.getMonth() && date.getFullYear() === d.getFullYear();
        })
        .reduce((sum, item) => sum + item.count, 0);
      months.push({ month: monthName, count, fill: monthColors[5 - i] });
    }

    return months;
  }, [loginTraffic]);

  const [activeMonth, setActiveMonth] = React.useState<string>("");

  const handleFilterChange = (newFilters: UserFiltersData) => {
    setFilters(newFilters);
    router.get(
      route("admin.users.dashboard"),
      {
        search: newFilters.search || undefined,
        role: newFilters.role !== "any" ? newFilters.role : undefined,
        sort:
          newFilters.sort === "asc" || newFilters.sort === "desc"
            ? newFilters.sort
            : undefined,
        timeRange: timeRange,
        activeMonth: activeMonth,
      },
      { preserveState: true, preserveScroll: true }
    );
  };

  const handleDeleteClick = (user: User) => {
    setUserToDelete(user);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!userToDelete) return;
    destroy(route("admin.users.destroy", userToDelete.id), {
      onSuccess: () => {
        setIsDeleteDialogOpen(false);
        setUserToDelete(null);
      },
    });
  };

  return (
    <AppLayout breadcrumbs={[{ title: "User Management", href: "/admin/users" }]}>
      <Head title="Admin User Dashboard" />
      <div className="py-6 px-8 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center gap-2 mb-2">
          <div className="space-y-1">
            <div className="flex">
              <ChartNoAxesCombined className="w-6 h-6 mr-2" />
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                User Overview
              </h1>
            </div>

            <p className="text-sm text-muted-foreground mb-2">
              Key performance indicators and research trends.
            </p>
          </div>

        </div>
        <SectionCards
          newThisWeek={newThisWeek}
          totalLogins={totalLoginsThisMonth}
          totalLoginsPrev={totalLoginsLastMonth}
          activeToday={activeToday}
          newThisWeekPrev={newUsersLastMonth}
        />

        {/* Area Chart */}
        <div className="mt-6">
          <div className="bg-transparent dark:bg-transparent border ring-border/50 dark:border-white/20 rounded-lg p-6 h-96 flex flex-col">
            <div className="flex justify-between items-center mb-2">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Users Login Activity
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Showing login activity for the last {timeRange === "7d" ? "7 days" : "30 days"}.
                </p>
              </div>
              <Select
                value={timeRange}
                onValueChange={(value) => setTimeRange(value as "7d" | "30d")}
              >
                <SelectTrigger className="w-40 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
                  <SelectValue placeholder="Select Range" />
                </SelectTrigger>
                <SelectContent className="rounded-lg shadow-lg">
                  <SelectItem value="7d" className="hover:bg-blue-100 dark:hover:bg-blue-900">
                    Last 7 Days
                  </SelectItem>
                  <SelectItem value="30d" className="hover:bg-blue-100 dark:hover:bg-blue-900">
                    Last 30 Days
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={filteredTraffic}>
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(value) =>
                      new Date(value).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })
                    }
                  />
                  <Tooltip
                    formatter={(value) => [value, "Logins"]}
                    labelFormatter={(label) =>
                      new Date(label).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })
                    }
                  />
                  <Area type="monotone" dataKey="count" stroke="#2563eb" fill="url(#colorCount)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Pie Charts + Mixed Bar Chart Grid */}
        <div className="grid sm:grid-cols-2 gap-6 pr-0 mt-6">
          {/* Pie Chart */}
          <ChartPieInteractive
            data={last6MonthsData}
            activeMonth={activeMonth}
            setActiveMonth={setActiveMonth}
          />

          {/* Mixed Bar Chart */}
          <div className="w-full">
            <ChartBarMixed data={halfYearStats} />
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white dark:bg-gray-900 border ring-border/50 dark:border-white/20 rounded-lg shadow p-6 mt-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <Users className="w-5 h-5" />  Users List
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              List of users with their roles, login info, and account details.
            </p>
          </div>

          {/* Search & Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <div className="relative flex-1 min-w-[300px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 transform -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                placeholder="Search users..."
                className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:ring-2 focus:ring-gray-300 focus:outline-none transition"
                value={filters.search}
                onChange={(e) =>
                  handleFilterChange({ ...filters, search: e.target.value })
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleFilterChange(filters);
                }}
              />
            </div>

            <UserFilters
              filters={filters}
              setFilters={setFilters}
              onFilter={handleFilterChange}
            />
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-md border border-gray-200 dark:border-gray-700 shadow-sm">
            <Table className="min-w-full">
              <TableHeader className="bg-gray-100 dark:bg-gray-800 h-15">
                <TableRow>
                  <TableHead className="text-left">ID</TableHead>
                  <TableHead className="text-left">Name</TableHead>
                  <TableHead className="text-left">Email</TableHead>
                  <TableHead className="text-left">Role</TableHead>
                  <TableHead className="text-left">Created At</TableHead>
                  <TableHead className="text-left">Last Login</TableHead>
                  <TableHead className="text-left">Last Logout</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.data.map((user) => (
                  <TableRow
                    key={user.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <TableCell>{user.id}</TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>{new Date(user.created_at).toLocaleString()}</TableCell>
                    <TableCell>
                      {user.last_login_at
                        ? new Date(user.last_login_at).toLocaleString()
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      {user.last_logout_at
                        ? new Date(user.last_logout_at).toLocaleString()
                        : "N/A"}
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteClick(user)}
                        className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="pt-4">
            <Pagination links={users.links} />
          </div>

          {/* Delete Dialog */}
          <DeleteDialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
            onConfirm={handleConfirmDelete}
            title="Delete User"
            message={`Are you sure you want to delete "${userToDelete?.name}"? This action cannot be undone.`}
            loading={false}
          />
        </div>
      </div>
    </AppLayout>
  );
}

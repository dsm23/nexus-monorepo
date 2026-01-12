import { useState } from "react";
import type { FunctionComponent } from "react";
import {
  ArrowLeft,
  Calendar,
  Download,
  FolderOpen,
  Heart,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Header } from "~/components/Header";
import { PageSection, PageWrapper } from "~/components/PageWrapper";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import {
  activityData,
  analyticsMetrics,
  departmentData,
  engagementData,
  productivityData,
  projectStatusData,
} from "~/data/mockData";
import type { AnalyticsMetric } from "~/data/mockData";

// Chart color schemes
const chartColors = {
  primary: "#3b82f6",
  secondary: "#10b981",
  tertiary: "#f59e0b",
  danger: "#ef4444",
  purple: "#8b5cf6",
  pink: "#ec4899",
};

const pieColors = [
  chartColors.primary,
  chartColors.secondary,
  chartColors.tertiary,
  chartColors.danger,
];

const getMetricIcon = (iconName: string) => {
  switch (iconName) {
    case "FolderOpen":
      return <FolderOpen className="h-5 w-5" />;
    case "Users":
      return <Users className="h-5 w-5" />;
    case "Heart":
      return <Heart className="h-5 w-5" />;
    case "TrendingUp":
      return <TrendingUp className="h-5 w-5" />;
    default:
      return <TrendingUp className="h-5 w-5" />;
  }
};

const MetricCard: FunctionComponent<{ metric: AnalyticsMetric }> = ({
  metric,
}) => (
  <Card>
    <CardContent className="p-4 sm:p-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-muted-foreground text-xs font-medium sm:text-sm">
            {metric.name}
          </p>
          <p className="text-lg font-bold sm:text-2xl">
            {metric.value}
            {metric.unit === "%" ? "%" : ""}
            {metric.unit !== "%" &&
              metric.unit !== "projects" &&
              metric.unit !== "members" &&
              metric.unit !== "kudos" && (
                <span className="text-muted-foreground ml-1 text-xs sm:text-sm">
                  {metric.unit}
                </span>
              )}
          </p>
          <div className="flex items-center gap-1 text-xs sm:text-sm">
            {metric.changeType === "increase" ? (
              <TrendingUp className="h-3 w-3 text-green-600 sm:h-4 sm:w-4" />
            ) : (
              <TrendingDown className="h-3 w-3 text-red-600 sm:h-4 sm:w-4" />
            )}
            <span
              className={
                metric.changeType === "increase"
                  ? "text-green-600"
                  : "text-red-600"
              }
            >
              {metric.change}%
            </span>
            <span className="text-muted-foreground">vs last period</span>
          </div>
        </div>
        <div
          className={`rounded-full p-2 sm:p-3 ${
            metric.changeType === "increase"
              ? "bg-green-100 text-green-600"
              : "bg-red-100 text-red-600"
          }`}
        >
          {getMetricIcon(metric.icon)}
        </div>
      </div>
    </CardContent>
  </Card>
);

export const AnalyticsPage: FunctionComponent = () => {
  const [dateRange, setDateRange] = useState("7d");

  return (
    <div className="bg-background min-h-screen">
      <Header />

      <PageWrapper className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Header Section */}
        <PageSection index={0} className="mb-6">
          <div className="mb-4 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <Link to="/">
              <Button variant="ghost" size="sm" className="gap-2 self-start">
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>

            <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-full sm:w-40">
                  <Calendar className="h-4 w-4" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 3 months</SelectItem>
                  <SelectItem value="1y">Last year</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" className="w-full gap-2 sm:w-auto">
                <Download className="h-4 w-4" />
                <span className="sm:hidden">Export</span>
                <span className="hidden sm:inline">Export Report</span>
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
              Analytics & Reports
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              Comprehensive insights into team performance, engagement, and
              productivity
            </p>
          </div>
        </PageSection>

        {/* Key Metrics */}
        <PageSection
          index={1}
          className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4"
        >
          {analyticsMetrics.map((metric, index) => (
            <div
              key={metric.id}
              className="animate-in fade-in slide-in-from-bottom-4 duration-300"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <MetricCard metric={metric} />
            </div>
          ))}
        </PageSection>

        {/* Analytics Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <PageSection index={2}>
            <div className="w-full overflow-x-auto">
              <TabsList className="grid w-full grid-cols-4 lg:inline-flex lg:w-auto">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="engagement">Engagement</TabsTrigger>
                <TabsTrigger value="productivity">Productivity</TabsTrigger>
                <TabsTrigger value="departments">Departments</TabsTrigger>
              </TabsList>
            </div>
          </PageSection>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <PageSection
              index={3}
              className="grid grid-cols-1 gap-6 lg:grid-cols-2"
            >
              {/* Activity Trends */}
              <Card
                className="animate-in fade-in slide-in-from-left-4 duration-500"
                style={{ animationDelay: "100ms" }}
              >
                <CardHeader>
                  <CardTitle className="text-lg">Activity Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={activityData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="date"
                        tickFormatter={(value) =>
                          new Date(value).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })
                        }
                        fontSize={12}
                      />
                      <YAxis fontSize={12} />
                      <Tooltip
                        labelFormatter={(value) =>
                          new Date(value).toLocaleDateString()
                        }
                        contentStyle={{ fontSize: "12px" }}
                      />
                      <Legend wrapperStyle={{ fontSize: "12px" }} />
                      <Line
                        type="monotone"
                        dataKey="projects"
                        stroke={chartColors.primary}
                        strokeWidth={2}
                        name="Projects"
                      />
                      <Line
                        type="monotone"
                        dataKey="kudos"
                        stroke={chartColors.secondary}
                        strokeWidth={2}
                        name="Kudos"
                      />
                      <Line
                        type="monotone"
                        dataKey="announcements"
                        stroke={chartColors.tertiary}
                        strokeWidth={2}
                        name="Announcements"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Project Status Distribution */}
              <Card
                className="animate-in fade-in slide-in-from-right-4 duration-500"
                style={{ animationDelay: "200ms" }}
              >
                <CardHeader>
                  <CardTitle className="text-lg">
                    Project Status Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={projectStatusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} (${percent}%)`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                      >
                        {projectStatusData.map((_, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={pieColors[index % pieColors.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ fontSize: "12px" }} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </PageSection>
          </TabsContent>

          {/* Engagement Tab */}
          <TabsContent value="engagement" className="space-y-6">
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
              <div className="xl:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Employee Engagement Metrics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={400}>
                      <AreaChart data={engagementData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" fontSize={12} />
                        <YAxis fontSize={12} />
                        <Tooltip contentStyle={{ fontSize: "12px" }} />
                        <Legend wrapperStyle={{ fontSize: "12px" }} />
                        <Area
                          type="monotone"
                          dataKey="kudosGiven"
                          stackId="1"
                          stroke={chartColors.primary}
                          fill={chartColors.primary}
                          name="Kudos Given"
                          opacity={0.7}
                        />
                        <Area
                          type="monotone"
                          dataKey="kudosReceived"
                          stackId="2"
                          stroke={chartColors.secondary}
                          fill={chartColors.secondary}
                          name="Kudos Received"
                          opacity={0.7}
                        />
                        <Area
                          type="monotone"
                          dataKey="announcements"
                          stackId="3"
                          stroke={chartColors.tertiary}
                          fill={chartColors.tertiary}
                          name="Announcements"
                          opacity={0.7}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">
                      Engagement Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <p className="text-primary text-2xl font-bold">
                        {engagementData[engagementData.length - 1]
                          ?.kudosGiven || 0}
                      </p>
                      <p className="text-muted-foreground text-sm">
                        Kudos Given This Month
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-secondary text-2xl font-bold">
                        {engagementData[engagementData.length - 1]
                          ?.kudosReceived || 0}
                      </p>
                      <p className="text-muted-foreground text-sm">
                        Kudos Received
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-yellow-600">
                        {engagementData[engagementData.length - 1]
                          ?.announcements || 0}
                      </p>
                      <p className="text-muted-foreground text-sm">
                        Announcements
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Trends</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Kudos Activity</span>
                      <div className="flex items-center text-green-600">
                        <TrendingUp className="mr-1 h-4 w-4" />
                        <span className="text-sm">+12%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Communication</span>
                      <div className="flex items-center text-green-600">
                        <TrendingUp className="mr-1 h-4 w-4" />
                        <span className="text-sm">+8%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Team Interaction</span>
                      <div className="flex items-center text-green-600">
                        <TrendingUp className="mr-1 h-4 w-4" />
                        <span className="text-sm">+15%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Productivity Tab */}
          <TabsContent value="productivity" className="space-y-6">
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
              <div className="xl:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Team Productivity Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={400}>
                      <BarChart data={productivityData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="week" fontSize={12} />
                        <YAxis fontSize={12} />
                        <Tooltip contentStyle={{ fontSize: "12px" }} />
                        <Legend wrapperStyle={{ fontSize: "12px" }} />
                        <Bar
                          dataKey="tasksCompleted"
                          fill={chartColors.primary}
                          name="Tasks Completed"
                        />
                        <Bar
                          dataKey="projectsDelivered"
                          fill={chartColors.secondary}
                          name="Projects Delivered"
                        />
                        <Bar
                          dataKey="teamEfficiency"
                          fill={chartColors.tertiary}
                          name="Team Efficiency %"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">This Week</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <p className="text-primary text-2xl font-bold">
                        {productivityData[productivityData.length - 1]
                          ?.tasksCompleted || 0}
                      </p>
                      <p className="text-muted-foreground text-sm">
                        Tasks Completed
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-secondary text-2xl font-bold">
                        {productivityData[productivityData.length - 1]
                          ?.projectsDelivered || 0}
                      </p>
                      <p className="text-muted-foreground text-sm">
                        Projects Delivered
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-yellow-600">
                        {productivityData[productivityData.length - 1]
                          ?.teamEfficiency || 0}
                        %
                      </p>
                      <p className="text-muted-foreground text-sm">
                        Team Efficiency
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Performance</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Task Completion</span>
                      <div className="flex items-center text-green-600">
                        <TrendingUp className="mr-1 h-4 w-4" />
                        <span className="text-sm">+18%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Project Delivery</span>
                      <div className="flex items-center text-green-600">
                        <TrendingUp className="mr-1 h-4 w-4" />
                        <span className="text-sm">+25%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Team Efficiency</span>
                      <div className="flex items-center text-green-600">
                        <TrendingUp className="mr-1 h-4 w-4" />
                        <span className="text-sm">+7%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Departments Tab */}
          <TabsContent value="departments" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Department Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart
                      data={departmentData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="department"
                        fontSize={10}
                        angle={-45}
                        textAnchor="end"
                        height={80}
                      />
                      <YAxis fontSize={12} />
                      <Tooltip
                        contentStyle={{ fontSize: "12px" }}
                        formatter={(value, name) => [
                          value,
                          name === "employees"
                            ? "Employees"
                            : "Active Projects",
                        ]}
                      />
                      <Legend wrapperStyle={{ fontSize: "12px" }} />
                      <Bar
                        dataKey="employees"
                        fill={chartColors.primary}
                        name="Employees"
                      />
                      <Bar
                        dataKey="projects"
                        fill={chartColors.secondary}
                        name="Active Projects"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Department Satisfaction
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart
                      data={departmentData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="department"
                        fontSize={10}
                        angle={-45}
                        textAnchor="end"
                        height={80}
                      />
                      <YAxis domain={[3.8, 5]} fontSize={12} />
                      <Tooltip
                        contentStyle={{ fontSize: "12px" }}
                        formatter={(value) => [
                          `${value}/5`,
                          "Satisfaction Score",
                        ]}
                      />
                      <Bar
                        dataKey="satisfaction"
                        fill={chartColors.tertiary}
                        name="Satisfaction Score"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Department Summary Table */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Department Overview</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Mobile Card View */}
                <div className="block space-y-4 md:hidden">
                  {departmentData.map((dept) => (
                    <Card key={dept.department} className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className="text-base font-semibold">
                            {dept.department}
                          </h3>
                          <span
                            className={`rounded-full px-2 py-1 text-sm ${
                              dept.satisfaction >= 4.3
                                ? "bg-green-100 text-green-700"
                                : dept.satisfaction >= 4.0
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-red-100 text-red-700"
                            }`}
                          >
                            {dept.satisfaction.toFixed(1)}/5
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Employees</p>
                            <p className="font-medium">{dept.employees}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Projects</p>
                            <p className="font-medium">{dept.projects}</p>
                          </div>
                        </div>

                        <div className="border-t pt-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">
                              Projects per Employee
                            </span>
                            <span className="font-medium">
                              {(dept.projects / dept.employees).toFixed(1)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                {/* Desktop Table View */}
                <div className="hidden overflow-x-auto md:block">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="px-2 py-3 text-left">Department</th>
                        <th className="px-2 py-3 text-right">Employees</th>
                        <th className="px-2 py-3 text-right">
                          Active Projects
                        </th>
                        <th className="px-2 py-3 text-right">Satisfaction</th>
                        <th className="px-2 py-3 text-right">
                          Projects per Employee
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {departmentData.map((dept) => (
                        <tr
                          key={dept.department}
                          className="hover:bg-muted/50 border-b transition-colors"
                        >
                          <td className="px-2 py-3 font-medium">
                            {dept.department}
                          </td>
                          <td className="px-2 py-3 text-right">
                            {dept.employees}
                          </td>
                          <td className="px-2 py-3 text-right">
                            {dept.projects}
                          </td>
                          <td className="px-2 py-3 text-right">
                            <span
                              className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                                dept.satisfaction >= 4.3
                                  ? "bg-green-100 text-green-700"
                                  : dept.satisfaction >= 4.0
                                    ? "bg-yellow-100 text-yellow-700"
                                    : "bg-red-100 text-red-700"
                              }`}
                            >
                              {dept.satisfaction.toFixed(1)}/5
                            </span>
                          </td>
                          <td className="px-2 py-3 text-right font-medium">
                            {(dept.projects / dept.employees).toFixed(1)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </PageWrapper>
    </div>
  );
};

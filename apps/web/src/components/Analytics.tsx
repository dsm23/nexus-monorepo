import type { FunctionComponent } from "react";
import { ArrowRight, TrendingDown, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { activityData, analyticsMetrics } from "~/data/mockData";
import { useWaveAnimation } from "~/hooks/useWaveAnimation";

export const Analytics: FunctionComponent = () => {
  const { containerRef, getItemStyle, getItemClassName } = useWaveAnimation();

  const chartColors = {
    primary: "#3b82f6",
    secondary: "#10b981",
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg font-semibold">
          Analytics Overview
        </CardTitle>
        <Link to="/analytics">
          <Button variant="outline" size="sm" className="h-8 gap-2">
            View All
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent ref={containerRef} className="space-y-6">
        {/* Key Metrics Grid - Expanded for main layout */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:gap-6">
          {analyticsMetrics.slice(0, 4).map((metric, index) => (
            <div
              key={metric.id}
              className={getItemClassName(
                "bg-muted/30 space-y-3 rounded-lg border p-4",
              )}
              style={getItemStyle(index)}
            >
              <div className="flex items-center justify-between">
                <p className="text-muted-foreground text-sm font-medium">
                  {metric.name}
                </p>
                {metric.changeType === "increase" ? (
                  <TrendingUp className="h-4 w-4 text-green-600" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600" />
                )}
              </div>
              <p className="text-2xl font-bold">
                {metric.value}
                {metric.unit === "%" ? "%" : ""}
              </p>
              <p
                className={`text-sm ${
                  metric.changeType === "increase"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {metric.changeType === "increase" ? "+" : "-"}
                {metric.change}% from last week
              </p>
            </div>
          ))}
        </div>

        {/* Mini Activity Chart - Enhanced for main layout */}
        <div
          className={getItemClassName("grid grid-cols-1 gap-6 lg:grid-cols-2")}
          style={getItemStyle(4)}
        >
          <div className="space-y-4">
            <h4 className="flex items-center gap-2 text-base font-semibold">
              <TrendingUp className="text-primary h-5 w-5" />
              Activity Trends (7 days)
            </h4>
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={activityData.slice(-7)}>
                  <XAxis
                    dataKey="date"
                    tickFormatter={(value) =>
                      new Date(value).toLocaleDateString("en-US", {
                        day: "numeric",
                      })
                    }
                    tick={{ fontSize: 12 }}
                    axisLine={false}
                  />
                  <YAxis hide />
                  <Line
                    type="monotone"
                    dataKey="projects"
                    stroke={chartColors.primary}
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="kudos"
                    stroke={chartColors.secondary}
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-center gap-6">
              <div className="flex items-center gap-2">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: chartColors.primary }}
                ></div>
                <span className="text-muted-foreground text-sm">Projects</span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: chartColors.secondary }}
                ></div>
                <span className="text-muted-foreground text-sm">Kudos</span>
              </div>
            </div>
          </div>

          {/* Quick Insights - Enhanced */}
          <div className="space-y-4">
            <h4 className="text-base font-semibold">Quick Insights</h4>
            <div className="space-y-3">
              <div
                className={getItemClassName(
                  "rounded-lg border border-green-200 bg-green-50 p-3",
                )}
                style={getItemStyle(5)}
              >
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <p className="text-sm font-medium text-green-800">
                    Project completion rate increased by 6.3% this week
                  </p>
                </div>
              </div>
              <div
                className={getItemClassName(
                  "rounded-lg border border-blue-200 bg-blue-50 p-3",
                )}
                style={getItemStyle(6)}
              >
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                  <p className="text-sm font-medium text-blue-800">
                    Team kudos activity up 34.7% from last period
                  </p>
                </div>
              </div>
              <div
                className={getItemClassName(
                  "rounded-lg border border-purple-200 bg-purple-50 p-3",
                )}
                style={getItemStyle(7)}
              >
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-purple-600" />
                  <p className="text-sm font-medium text-purple-800">
                    Engineering department leading in productivity
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

import type { FunctionComponent } from "react";
import { ArrowRight, Award, Cake, Calendar, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { calendarEvents } from "~/data/mockData";
import { useWaveAnimation } from "~/hooks/useWaveAnimation";
import { formatEventDate } from "~/lib/utils";
import type { CalendarEvent } from "~/data/mockData";

const getEventIcon = (type: CalendarEvent["type"]) => {
  switch (type) {
    case "event":
      return <Calendar className="h-4 w-4" />;
    case "birthday":
      return <Cake className="h-4 w-4" />;
    case "anniversary":
      return <Award className="h-4 w-4" />;
    default:
      return <Calendar className="h-4 w-4" />;
  }
};

const getEventColor = (type: CalendarEvent["type"]) => {
  switch (type) {
    case "event":
      return "text-blue-600";
    case "birthday":
      return "text-rose-600";
    case "anniversary":
      return "text-violet-600";
    default:
      return "text-muted-foreground";
  }
};

const getEventBgColor = (type: CalendarEvent["type"]) => {
  switch (type) {
    case "event":
      return "bg-blue-500/5 dark:bg-blue-500/10 border-blue-500/10 dark:border-blue-500/30";
    case "birthday":
      return "bg-rose-500/5 dark:bg-rose-500/10 border-rose-500/10 dark:border-rose-500/30";
    case "anniversary":
      return "bg-violet-500/5 dark:bg-violet-500/10 border-violet-500/10 dark:border-violet-500/30";
    default:
      return "bg-muted/50 border-border";
  }
};

export const TeamCalendar: FunctionComponent = () => {
  const { containerRef, getItemStyle, getItemClassName } = useWaveAnimation();

  // Sort events by date and limit to first 3 for dashboard
  const sortedEvents = [...calendarEvents].sort(
    (a, b) => a.date.getTime() - b.date.getTime(),
  );
  const displayEvents = sortedEvents.slice(0, 3);

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col space-y-2 pb-2 sm:flex-row sm:items-start sm:justify-between sm:space-y-0">
        <div>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Users className="h-5 w-5" />
            Team Calendar
          </CardTitle>
          <CardDescription>
            Upcoming events, birthdays, and anniversaries
          </CardDescription>
        </div>
        <Link to="/calendar" className="w-full sm:w-auto">
          <Button
            variant="outline"
            size="sm"
            className="w-full gap-2 sm:w-auto"
          >
            View All
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent ref={containerRef}>
        <div className="space-y-3">
          {displayEvents.map((event, index) => (
            <div
              key={event.id}
              className={getItemClassName(
                `rounded-lg border p-3 ${getEventBgColor(event.type)}`,
              )}
              style={getItemStyle(index)}
            >
              <div className="flex items-start gap-3">
                <div className={`mt-1 ${getEventColor(event.type)}`}>
                  {getEventIcon(event.type)}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-start justify-between">
                    <h4 className="text-sm leading-none font-medium">
                      {event.title}
                    </h4>
                    <span className="text-muted-foreground ml-2 text-xs whitespace-nowrap">
                      {formatEventDate(event.date)}
                    </span>
                  </div>
                  {event.description && (
                    <p className="text-muted-foreground text-xs">
                      {event.description}
                    </p>
                  )}
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={
                        event.type === "event"
                          ? "border-blue-600 bg-blue-50 text-blue-700 dark:border-blue-300 dark:bg-blue-100 dark:text-blue-800"
                          : event.type === "birthday"
                            ? "border-pink-600 bg-pink-50 text-pink-700 dark:border-pink-300 dark:bg-pink-100 dark:text-pink-800"
                            : "border-purple-600 bg-purple-50 text-purple-700 dark:border-purple-300 dark:bg-purple-100 dark:text-purple-800"
                      }
                    >
                      {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="mt-6 border-t pt-4">
          <p className="text-muted-foreground text-center text-xs">
            Showing {displayEvents.length} of {sortedEvents.length} upcoming
            events
          </p>

          {/* Show remaining count if there are more events */}
          {sortedEvents.length > 3 && (
            <div className="mt-2">
              <Link to="/calendar">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground w-full gap-2"
                >
                  <span>
                    View {sortedEvents.length - 3} more{" "}
                    {sortedEvents.length === 4 ? "event" : "events"}
                  </span>
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

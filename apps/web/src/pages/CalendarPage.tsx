import { useState } from "react";
import type { FunctionComponent } from "react";
import {
  ArrowLeft,
  Award,
  Cake,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Filter,
  Search,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Header } from "~/components/Header";
import { PageSection, PageWrapper } from "~/components/PageWrapper";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { calendarEvents } from "~/data/mockData";
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

export const CalendarPage: FunctionComponent = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [currentDate, setCurrentDate] = useState(new Date());

  // Get unique event types for filter
  const eventTypes = Array.from(
    new Set(calendarEvents.map((event) => event.type)),
  ).sort();

  // Filter events based on search and type
  const filteredEvents = calendarEvents.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (event.description &&
        event.description.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesType = filterType === "all" || event.type === filterType;

    return matchesSearch && matchesType;
  });

  // Calendar helper functions
  const getMonthName = (date: Date) => {
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      if (direction === "prev") {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const getEventsForDate = (day: number) => {
    const targetDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day,
    );
    return filteredEvents.filter((event) => {
      const eventDate = new Date(event.date);
      return (
        eventDate.getFullYear() === targetDate.getFullYear() &&
        eventDate.getMonth() === targetDate.getMonth() &&
        eventDate.getDate() === targetDate.getDate()
      );
    });
  };

  const isToday = (day: number) => {
    const today = new Date();
    const targetDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day,
    );
    return (
      today.getFullYear() === targetDate.getFullYear() &&
      today.getMonth() === targetDate.getMonth() &&
      today.getDate() === targetDate.getDate()
    );
  };

  const renderCalendarGrid = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDayOfMonth = getFirstDayOfMonth(currentDate);
    const days = [];
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    // Day headers
    for (let i = 0; i < 7; i++) {
      days.push(
        <div
          key={`header-${i}`}
          className="text-muted-foreground border-r border-b p-2 text-center text-sm font-medium"
        >
          {dayNames[i]}
        </div>,
      );
    }

    // Empty cells for days before month starts
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(
        <div
          key={`empty-${i}`}
          className="bg-muted/20 border-r border-b p-2"
        ></div>,
      );
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dayEvents = getEventsForDate(day);
      const isCurrentDay = isToday(day);

      days.push(
        <div
          key={day}
          className="bg-background hover:bg-muted/30 min-h-[120px] border-r border-b p-2 transition-colors"
        >
          <div
            className={`mb-1 text-sm font-medium ${isCurrentDay ? "bg-primary text-primary-foreground flex h-6 w-6 items-center justify-center rounded-full" : ""}`}
          >
            {day}
          </div>
          <div className="space-y-1">
            {dayEvents.slice(0, 3).map((event) => (
              <div
                key={event.id}
                className={`truncate rounded p-1 text-xs ${getEventBgColor(event.type)} border`}
                title={`${event.title}${event.description ? ` - ${event.description}` : ""}`}
              >
                <div className="flex items-center gap-1">
                  <div className={`${getEventColor(event.type)}`}>
                    {getEventIcon(event.type)}
                  </div>
                  <span className="truncate">{event.title}</span>
                </div>
              </div>
            ))}
            {dayEvents.length > 3 && (
              <div className="text-muted-foreground text-xs">
                +{dayEvents.length - 3} more
              </div>
            )}
          </div>
        </div>,
      );
    }

    return days;
  };

  return (
    <div className="bg-background min-h-screen">
      <Header />

      <PageWrapper className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Header Section */}
        <PageSection index={0} className="mb-6">
          <div className="mb-4 flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight">Team Calendar</h1>
            <p className="text-muted-foreground">
              Stay updated with upcoming events, birthdays, and anniversaries
            </p>
          </div>
        </PageSection>

        {/* Combined Calendar Card */}
        <PageSection index={1}>
          <Card className="mb-6">
            <CardContent className="p-6">
              {/* Search and Filters */}
              <div className="mb-6 flex flex-col gap-4 sm:flex-row">
                <div className="relative flex-1">
                  <Search className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
                  <Input
                    placeholder="Search events..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="text-muted-foreground h-4 w-4" />
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      {eventTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Calendar Navigation */}
              <div className="mb-6 flex items-center justify-between border-b pb-4">
                <h2 className="text-2xl font-bold">
                  {getMonthName(currentDate)}
                </h2>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigateMonth("prev")}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentDate(new Date())}
                  >
                    Today
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigateMonth("next")}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 border-t border-l">
                {renderCalendarGrid()}
              </div>
            </CardContent>
          </Card>
        </PageSection>

        {/* Legend */}
        <PageSection index={2}>
          <Card className="mt-6">
            <CardContent>
              <h3 className="mb-4 text-lg font-semibold">Event Types</h3>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <div className="text-blue-600">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <span className="text-sm">Events</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-rose-600">
                    <Cake className="h-4 w-4" />
                  </div>
                  <span className="text-sm">Birthdays</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-violet-600">
                    <Award className="h-4 w-4" />
                  </div>
                  <span className="text-sm">Anniversaries</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </PageSection>

        {/* Summary */}
        {filteredEvents.length !== calendarEvents.length && (
          <PageSection index={3}>
            <div className="mt-6 border-t pt-4 text-center">
              <p className="text-muted-foreground text-xs">
                Showing {filteredEvents.length} of {calendarEvents.length}{" "}
                events
                {searchQuery && ` matching "${searchQuery}"`}
                {filterType !== "all" && ` in ${filterType} category`}
              </p>
            </div>
          </PageSection>
        )}
      </PageWrapper>
    </div>
  );
};

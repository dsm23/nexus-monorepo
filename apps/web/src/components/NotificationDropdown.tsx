import type { FunctionComponent } from "react";
import { ArrowRight, Bell, CheckSquare, FileText, Info } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { forYouFeed } from "~/data/mockData";
import { formatRelativeTime } from "~/lib/utils";
import type { FeedItem } from "~/data/mockData";

const getTypeIcon = (type: FeedItem["type"]) => {
  switch (type) {
    case "document":
      return <FileText className="h-4 w-4" />;
    case "news":
      return <Info className="h-4 w-4" />;
    case "task":
      return <CheckSquare className="h-4 w-4" />;
    case "update":
      return <Bell className="h-4 w-4" />;
    default:
      return <Info className="h-4 w-4" />;
  }
};

const getTypeColor = (type: FeedItem["type"]) => {
  switch (type) {
    case "document":
      return "text-primary";
    case "news":
      return "text-green-800 dark:text-green-300";
    case "task":
      return "text-orange-800 dark:text-orange-300";
    case "update":
      return "text-purple-800 dark:text-purple-300";
    default:
      return "text-muted-foreground";
  }
};

export const NotificationDropdown: FunctionComponent = () => {
  // Show only first 5 items in dropdown
  const displayItems = forYouFeed.slice(0, 5);
  // For demo purposes, assume first 3 items are unread
  const unreadCount = 3;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative h-10 w-10">
          <Bell className="h-[1.2rem] w-[1.2rem]" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center p-0 text-xs"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
          <span className="sr-only">View notifications</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-96 border p-0 shadow-lg">
        <div className="bg-muted/30 border-b p-4">
          <div className="flex items-center justify-between">
            <h4 className="text-base font-semibold">Notifications</h4>
            <Link to="/for-you">
              <Button
                variant="ghost"
                size="sm"
                className="hover:bg-background h-7 px-3 text-xs"
              >
                View All
              </Button>
            </Link>
          </div>
        </div>

        <div className="max-h-80 overflow-y-auto">
          {displayItems.length === 0 ? (
            <div className="text-muted-foreground py-12 text-center">
              <Bell className="mx-auto mb-3 h-12 w-12 opacity-30" />
              <p className="text-sm font-medium">No notifications</p>
              <p className="mt-1 text-xs opacity-75">You're all caught up!</p>
            </div>
          ) : (
            <div className="py-2">
              {displayItems.map((item, index) => (
                <div
                  key={item.id}
                  className="hover:bg-muted/200 bg-primary/3 flex cursor-pointer gap-3 p-4 transition-colors"
                >
                  <div
                    className={`mt-1 flex-shrink-0 ${getTypeColor(item.type)}`}
                  >
                    {getTypeIcon(item.type)}
                  </div>
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <h5
                        className={`text-sm leading-5 ${index < 3 ? "text-foreground font-semibold" : "text-foreground/90 font-medium"}`}
                      >
                        {item.title}
                      </h5>
                      <span className="text-muted-foreground mt-0.5 text-xs whitespace-nowrap">
                        {formatRelativeTime(item.timestamp)}
                      </span>
                    </div>
                    <p className="text-muted-foreground text-xs leading-relaxed">
                      {item.description}
                    </p>
                    {item.author && (
                      <Badge
                        variant="secondary"
                        className="h-6 px-2 text-xs font-normal"
                      >
                        {item.author}
                      </Badge>
                    )}
                  </div>
                  {index < 3 && (
                    <div className="flex-shrink-0">
                      <div className="bg-primary h-2 w-2 rounded-full"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {forYouFeed.length > 5 && (
          <div className="bg-muted/20 border-t p-3">
            <Link to="/for-you" className="block">
              <Button
                variant="outline"
                size="sm"
                className="h-9 w-full justify-center gap-2 text-sm font-medium"
              >
                <span>View All {forYouFeed.length} Notifications</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

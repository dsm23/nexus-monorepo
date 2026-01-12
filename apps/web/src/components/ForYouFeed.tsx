import type { FunctionComponent } from "react";
import {
  ArrowRight,
  Bell,
  CheckSquare,
  FileText,
  Info,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { forYouFeed } from "~/data/mockData";
import { useWaveAnimation } from "~/hooks/useWaveAnimation";
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

export const ForYouFeed: FunctionComponent = () => {
  const { containerRef, getItemStyle, getItemClassName } = useWaveAnimation();

  // Show only first 3 items on dashboard
  const displayItems = forYouFeed.slice(0, 3);

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col space-y-2 pb-2 sm:flex-row sm:items-start sm:justify-between sm:space-y-0">
        <div>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Sparkles className="h-5 w-5" />
            For You
          </CardTitle>
          <CardDescription>
            Personalized updates and information relevant to your work
          </CardDescription>
        </div>
        <Link to="/for-you" className="w-full sm:w-auto">
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
        <div className="space-y-4">
          {displayItems.map((item, index) => (
            <div
              key={item.id}
              className={getItemClassName(
                "hover:bg-muted/50 flex gap-3 rounded-lg border p-3",
              )}
              style={getItemStyle(index)}
            >
              <div className={`mt-1 ${getTypeColor(item.type)}`}>
                {getTypeIcon(item.type)}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-start justify-between">
                  <h4 className="text-sm leading-none font-medium">
                    {item.title}
                  </h4>
                  <span className="text-muted-foreground ml-2 text-xs whitespace-nowrap">
                    {formatRelativeTime(item.timestamp)}
                  </span>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {item.description}
                </p>
                {item.author && (
                  <p className="text-muted-foreground text-xs">
                    by {item.author}
                  </p>
                )}
              </div>
            </div>
          ))}

          {/* Show remaining count if there are more items */}
          {forYouFeed.length > 3 && (
            <div
              className={getItemClassName("border-t pt-2")}
              style={getItemStyle(displayItems.length)}
            >
              <Link to="/for-you">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground w-full gap-2"
                >
                  <span>View {forYouFeed.length - 3} more items</span>
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

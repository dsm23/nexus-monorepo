import type { FunctionComponent } from "react";
import { ArrowRight, Download, FileText, Star, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { resourcesData } from "~/data/mockData";
import { useWaveAnimation } from "~/hooks/useWaveAnimation";

export const Resources: FunctionComponent = () => {
  const { containerRef, getItemStyle, getItemClassName } = useWaveAnimation();

  // Get recent and popular resources
  const recentResources = resourcesData
    .sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime())
    .slice(0, 2);

  const popularResources = resourcesData
    .sort((a, b) => b.downloadCount - a.downloadCount)
    .slice(0, 2);

  const favoriteResources = resourcesData.filter((r) => r.isFavorite).length;
  const totalDownloads = resourcesData.reduce(
    (sum, r) => sum + r.downloadCount,
    0,
  );

  const getFileIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return "📄";
      case "doc":
        return "📝";
      case "video":
        return "🎥";
      case "xls":
        return "📊";
      case "link":
        return "🔗";
      default:
        return "📄";
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-lg font-semibold">
          Company Resources
        </CardTitle>
        <Link to="/resources">
          <Button variant="outline" size="sm" className="h-8 gap-2">
            View All
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent ref={containerRef} className="space-y-6">
        {/* Stats - Enhanced for main layout */}
        <div className="grid grid-cols-3 gap-4 lg:gap-6">
          <div
            className={getItemClassName(
              "rounded-lg border border-blue-200 bg-blue-50 p-4 text-center",
            )}
            style={getItemStyle(0)}
          >
            <p className="text-2xl font-bold text-blue-600">
              {resourcesData.length}
            </p>
            <p className="text-sm font-medium text-blue-800">Total Resources</p>
          </div>
          <div
            className={getItemClassName(
              "rounded-lg border border-green-200 bg-green-50 p-4 text-center",
            )}
            style={getItemStyle(1)}
          >
            <p className="text-2xl font-bold text-green-600">
              {totalDownloads}
            </p>
            <p className="text-sm font-medium text-green-800">Downloads</p>
          </div>
          <div
            className={getItemClassName(
              "rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-center",
            )}
            style={getItemStyle(2)}
          >
            <p className="text-2xl font-bold text-yellow-600">
              {favoriteResources}
            </p>
            <p className="text-sm font-medium text-yellow-800">Favorites</p>
          </div>
        </div>

        {/* Recent and Popular Resources - Side by side for main layout */}
        <div
          className={getItemClassName("grid grid-cols-1 gap-6 lg:grid-cols-2")}
          style={getItemStyle(3)}
        >
          {/* Recent Resources */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <FileText className="text-primary h-5 w-5" />
              <h4 className="text-base font-semibold">Recent Uploads</h4>
            </div>
            <div className="space-y-3">
              {recentResources.map((resource, index) => (
                <div
                  key={resource.id}
                  className={getItemClassName(
                    "hover:bg-muted/50 flex items-center gap-3 rounded-lg border p-3 transition-colors",
                  )}
                  style={getItemStyle(4 + index)}
                >
                  <span className="text-lg">{getFileIcon(resource.type)}</span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {resource.title}
                    </p>
                    <div className="text-muted-foreground mt-1 flex items-center gap-2 text-sm">
                      <span>{resource.uploadedBy}</span>
                      {resource.isFavorite && (
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      )}
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {resource.category}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Popular This Week */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <h4 className="text-base font-semibold">Popular This Week</h4>
            </div>
            <div className="space-y-3">
              {popularResources.map((resource, index) => (
                <div
                  key={resource.id}
                  className={getItemClassName(
                    "hover:bg-muted/50 flex items-center gap-3 rounded-lg border p-3 transition-colors",
                  )}
                  style={getItemStyle(6 + index)}
                >
                  <span className="text-lg">{getFileIcon(resource.type)}</span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {resource.title}
                    </p>
                    <div className="text-muted-foreground mt-1 flex items-center gap-2 text-sm">
                      <Download className="h-3 w-3" />
                      <span>{resource.downloadCount} downloads</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div
          className={getItemClassName("border-t pt-3")}
          style={getItemStyle(8)}
        >
          <div className="grid grid-cols-2 gap-2">
            <Link to="/resources?category=template" className="block">
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-full justify-start gap-2"
              >
                <FileText className="h-3 w-3" />
                <span className="text-xs">Templates</span>
              </Button>
            </Link>
            <Link to="/resources?category=policy" className="block">
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-full justify-start gap-2"
              >
                <FileText className="h-3 w-3" />
                <span className="text-xs">Policies</span>
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

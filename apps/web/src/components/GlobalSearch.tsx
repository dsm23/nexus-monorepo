import { useCallback, useEffect, useMemo, useState } from "react";
import type { FormEventHandler, FunctionComponent } from "react";
import { Command, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { search } from "~/lib/searchService";
import type { SearchResult } from "~/lib/searchService";

const typeLabels = {
  employee: "Employee",
  announcement: "Announcement",
  kudo: "Kudo",
  event: "Event",
  feed: "Feed Item",
  "quick-link": "Quick Link",
};

const typeIcons = {
  employee: "👤",
  announcement: "📢",
  kudo: "❤️",
  event: "📅",
  feed: "📰",
  "quick-link": "🔗",
};

export const GlobalSearch: FunctionComponent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();

  // Handle keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        setIsOpen(true);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const results = useMemo(() => {
    return search(searchQuery);
  }, [searchQuery]);

  const handleResultClick = useCallback(
    (result: SearchResult) => {
      // Navigate to the specific route with search parameters for highlighting
      const searchParams = new URLSearchParams();
      if (result.searchParams) {
        Object.entries(result.searchParams).forEach(([key, value]) => {
          searchParams.set(key, value);
        });
      }

      const routeWithParams = result.searchParams
        ? `${result.route}?${searchParams.toString()}`
        : result.route;

      navigate(routeWithParams);
      setIsOpen(false);
      setSearchQuery("");
    },
    [navigate],
  );

  const handleQuickAction = useCallback(
    (type: string) => {
      switch (type) {
        case "employees":
          navigate("/employees");
          break;
        case "announcements":
          navigate("/announcements");
          break;
        case "events":
          navigate("/calendar");
          break;
        case "kudos":
          navigate("/kudos");
          break;
      }
      setIsOpen(false);
    },
    [navigate],
  );

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [results]);

  // Handle keyboard navigation within dialog
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) => Math.max(prev - 1, 0));
          break;
        case "Enter":
          e.preventDefault();
          if (results[selectedIndex] && searchQuery.trim()) {
            handleResultClick(results[selectedIndex]);
          }
          break;
        case "Escape":
          e.preventDefault();
          setIsOpen(false);
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, results, selectedIndex, handleResultClick, searchQuery]);

  // Reset search when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setSearchQuery("");
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (searchQuery.trim() && results[selectedIndex]) {
      handleResultClick(results[selectedIndex]);
    }
  };

  return (
    <>
      {/* Search Trigger Button */}
      <Button
        variant="outline"
        onClick={() => setIsOpen(true)}
        className="text-muted-foreground hover:text-foreground h-10 w-48 justify-between"
      >
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4" />
          <span className="text-sm">Search...</span>
        </div>
        <div className="bg-muted flex items-center gap-1 rounded px-1.5 py-0.5 text-xs">
          <Command className="h-3 w-3" />
          <span>K</span>
        </div>
      </Button>

      {/* Search Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="overflow-hidden p-0 sm:max-w-2xl">
          <DialogHeader className="px-6 pt-6 pb-0">
            <DialogTitle>Search Nexus</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col">
            {/* Search Input */}
            <form onSubmit={handleSubmit} className="px-6 pb-4">
              <div className="relative">
                <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
                <Input
                  placeholder="Search employees, announcements, events, and more..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                  autoFocus
                />
              </div>
            </form>

            {/* Results */}
            <div className="max-h-96 overflow-y-auto border-t">
              {searchQuery.trim() === "" ? (
                <div className="space-y-4 p-6">
                  <div>
                    <h4 className="mb-3 text-sm font-medium">Quick Actions</h4>
                    <div className="space-y-1">
                      <div
                        className="hover:bg-accent flex cursor-pointer items-center gap-3 rounded-lg p-3"
                        onClick={() => handleQuickAction("employees")}
                      >
                        <span className="text-lg">👤</span>
                        <span className="text-sm">Search employees</span>
                      </div>
                      <div
                        className="hover:bg-accent flex cursor-pointer items-center gap-3 rounded-lg p-3"
                        onClick={() => handleQuickAction("announcements")}
                      >
                        <span className="text-lg">📢</span>
                        <span className="text-sm">Search announcements</span>
                      </div>
                      <div
                        className="hover:bg-accent flex cursor-pointer items-center gap-3 rounded-lg p-3"
                        onClick={() => handleQuickAction("events")}
                      >
                        <span className="text-lg">📅</span>
                        <span className="text-sm">Search calendar events</span>
                      </div>
                      <div
                        className="hover:bg-accent flex cursor-pointer items-center gap-3 rounded-lg p-3"
                        onClick={() => handleQuickAction("kudos")}
                      >
                        <span className="text-lg">❤️</span>
                        <span className="text-sm">Search kudos</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="mb-2 text-sm font-medium">
                      Recent Searches
                    </h4>
                    <div className="text-muted-foreground text-sm">
                      No recent searches
                    </div>
                  </div>
                </div>
              ) : results.length === 0 ? (
                <div className="text-muted-foreground p-6 text-center">
                  <Search className="mx-auto mb-3 h-8 w-8 opacity-50" />
                  <p>No results found for "{searchQuery}"</p>
                  <p className="mt-1 text-xs">
                    Try searching for employees, announcements, events, or kudos
                  </p>
                </div>
              ) : (
                <div className="py-2">
                  {results.map((result, index) => (
                    <div
                      key={`${result.type}-${result.id}`}
                      className={`hover:bg-accent flex cursor-pointer items-start px-6 py-3 ${
                        index === selectedIndex ? "bg-accent" : ""
                      }`}
                      onClick={() => handleResultClick(result)}
                    >
                      <div className="mt-0.5 mr-3 text-lg">
                        {typeIcons[result.type]}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="mb-1 flex items-center gap-2">
                          <span className="truncate font-medium">
                            {result.title}
                          </span>
                          <span className="bg-muted text-muted-foreground flex-shrink-0 rounded-full px-2 py-0.5 text-xs">
                            {typeLabels[result.type]}
                          </span>
                        </div>
                        <div className="text-muted-foreground line-clamp-2 text-sm">
                          {result.description}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {(searchQuery.trim() || results.length > 0) && (
              <div className="text-muted-foreground bg-muted/30 flex justify-between border-t px-6 py-3 text-xs">
                <span>
                  {results.length > 0
                    ? "Use ↑↓ to navigate • Enter to select"
                    : "Type to search"}
                </span>
                <span>Esc to close</span>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

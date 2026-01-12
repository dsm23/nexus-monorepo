import type { FunctionComponent } from "react";
import {
  BarChart3,
  Building2,
  Calendar,
  ChevronDown,
  Clock,
  Eye,
  FileText,
  Focus,
  FolderOpen,
  Headphones,
  Heart,
  HelpCircle,
  Home,
  Megaphone,
  Settings,
  Users,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { useFocusMode } from "~/contexts/FocusModeContext";
import { currentUser } from "~/data/mockData";
import { getTimeBasedGreeting } from "~/lib/utils";
import { GlobalSearch } from "./GlobalSearch";
import { NotificationDropdown } from "./NotificationDropdown";
import { Profile } from "./Profile";
import { ThemeToggle } from "./ThemeToggle";

export const Header: FunctionComponent = () => {
  const { isFocusMode, toggleFocusMode } = useFocusMode();
  const location = useLocation();
  const greeting = getTimeBasedGreeting();

  // Core navigation items (most important - always visible)
  const coreNavItems = [
    { path: "/", label: "Dashboard", icon: Home },
    { path: "/projects", label: "Projects", icon: FolderOpen },
  ];

  // People & Communication group
  const peopleNavItems = [
    { path: "/employees", label: "Employees", icon: Users },
    { path: "/kudos", label: "Kudos", icon: Heart },
    { path: "/announcements", label: "Announcements", icon: Megaphone },
  ];

  // Workspace & Tools group
  const workspaceNavItems = [
    { path: "/calendar", label: "Calendar", icon: Calendar },
    { path: "/analytics", label: "Analytics", icon: BarChart3 },
    { path: "/resources", label: "Resources", icon: FileText },
  ];

  // Support & Settings group
  const supportNavItems = [
    { path: "/time-off", label: "Time Off", icon: Clock },
    { path: "/help-desk", label: "Help Desk", icon: Headphones },
  ];

  return (
    <>
      <header className="bg-background/80 supports-[backdrop-filter]:bg-background/70 sticky top-0 z-50 w-full border-b backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Left side - Logo */}
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold">
                N
              </div>
              <span className="text-lg font-semibold">Nexus</span>
            </Link>
            <div className="hidden sm:block">
              <span className="text-muted-foreground text-lg font-medium">
                {greeting}, {currentUser.name}! 👋
              </span>
            </div>
          </div>
          {/* Right side - Controls */}
          <div className="flex items-center gap-3">
            <div className="hidden lg:block">
              <GlobalSearch />
            </div>
            {/* Focus Mode Button - Only visible on Dashboard */}
            {location.pathname === "/" && (
              <Button
                variant={isFocusMode ? "default" : "outline"}
                size="sm"
                onClick={toggleFocusMode}
                className="h-10 gap-2"
              >
                {isFocusMode ? (
                  <Eye className="h-4 w-4" />
                ) : (
                  <Focus className="h-4 w-4" />
                )}
                <span className="hidden sm:inline">
                  {isFocusMode ? "Exit Focus" : "Focus Mode"}
                </span>
              </Button>
            )}
            <NotificationDropdown />
            <ThemeToggle />
            <Profile />
          </div>
        </div>
      </header>

      {/* Navigation Bar */}
      {/* Navigation Bar */}
      <div className="bg-background/80 supports-[backdrop-filter]:bg-background/70 sticky top-16 z-40 w-full border-b backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-2">
            {/* Main Navigation - Cleaner with dropdowns */}
            <nav className="flex items-center gap-3">
              {/* Core Items - Always visible */}
              {coreNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-primary/10 text-primary shadow-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{item.label}</span>
                  </Link>
                );
              })}

              {/* People & Communication Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                      peopleNavItems.some(
                        (item) => location.pathname === item.path,
                      )
                        ? "bg-primary/10 text-primary shadow-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                    }`}
                  >
                    <Building2 className="h-4 w-4" />
                    <span className="hidden sm:inline">People</span>
                    <ChevronDown className="h-3 w-3 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center" className="w-48">
                  {peopleNavItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <DropdownMenuItem key={item.path} asChild>
                        <Link
                          to={item.path}
                          className="flex w-full items-center gap-2"
                        >
                          <Icon className="h-4 w-4" />
                          {item.label}
                        </Link>
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Workspace & Tools Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                      workspaceNavItems.some(
                        (item) => location.pathname === item.path,
                      )
                        ? "bg-primary/10 text-primary shadow-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                    }`}
                  >
                    <Settings className="h-4 w-4" />
                    <span className="hidden sm:inline">Tools</span>
                    <ChevronDown className="h-3 w-3 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center" className="w-48">
                  {workspaceNavItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <DropdownMenuItem key={item.path} asChild>
                        <Link
                          to={item.path}
                          className="flex w-full items-center gap-2"
                        >
                          <Icon className="h-4 w-4" />
                          {item.label}
                        </Link>
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Support & Settings Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                      supportNavItems.some(
                        (item) => location.pathname === item.path,
                      )
                        ? "bg-primary/10 text-primary shadow-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                    }`}
                  >
                    <HelpCircle className="h-4 w-4" />
                    <span className="hidden sm:inline">Support</span>
                    <ChevronDown className="h-3 w-3 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center" className="w-48">
                  {supportNavItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <DropdownMenuItem key={item.path} asChild>
                        <Link
                          to={item.path}
                          className="flex w-full items-center gap-2"
                        >
                          <Icon className="h-4 w-4" />
                          {item.label}
                        </Link>
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            </nav>
          </div>
        </div>
      </div>

      {/* Mobile greeting */}
      <div className="bg-background/80 supports-[backdrop-filter]:bg-background/70 mx-auto max-w-7xl border-b px-4 pt-3 pb-3 backdrop-blur sm:hidden sm:px-6 lg:px-8">
        <p className="text-muted-foreground text-sm">
          {greeting}, {currentUser.name}! 👋
        </p>
      </div>
    </>
  );
};

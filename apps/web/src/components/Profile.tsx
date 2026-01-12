import type { FunctionComponent } from "react";
import {
  Bell,
  FileText,
  Heart,
  HelpCircle,
  LogOut,
  MessageSquare,
  Settings,
  Shield,
  User,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { currentUser } from "~/data/mockData";

export const Profile: FunctionComponent = () => {
  const handleProfileAction = (action: string) => {
    switch (action) {
      case "profile":
        console.info("Navigate to profile");
        // TODO: Implement navigation to profile page
        break;
      case "settings":
        console.info("Navigate to settings");
        // TODO: Implement navigation to settings page
        break;
      case "notifications":
        console.info("Navigate to notifications");
        // TODO: Implement navigation to notifications page
        break;
      case "privacy":
        console.info("Navigate to privacy settings");
        // TODO: Implement navigation to privacy page
        break;
      case "help":
        console.info("Navigate to help center");
        // TODO: Implement navigation to help page
        break;
      case "feedback":
        console.info("Navigate to feedback");
        // TODO: Implement feedback form
        break;
      case "docs":
        console.info("Navigate to documentation");
        // TODO: Implement navigation to docs
        break;
      case "support":
        console.info("Navigate to support");
        // TODO: Implement navigation to support
        break;
      case "logout":
        console.info("Logout user");
        // TODO: Implement logout functionality
        break;
      default:
        break;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="hover:bg-accent relative h-10 w-10 rounded-full p-0"
          aria-label="Profile menu"
        >
          <img
            className="border-border hover:border-primary h-10 w-10 rounded-full border-2 object-cover transition-colors"
            src={currentUser.avatar}
            alt={`${currentUser.name}'s avatar`}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm leading-none font-medium">
              {currentUser.name}
            </p>
            <p className="text-muted-foreground text-xs leading-none">
              {currentUser.role}
            </p>
            <p className="text-muted-foreground text-xs leading-none">
              {currentUser.department}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {/* Account Section */}
        <DropdownMenuItem
          onClick={() => handleProfileAction("profile")}
          className="cursor-pointer"
        >
          <User className="mr-2 h-4 w-4" />
          <span>View Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleProfileAction("settings")}
          className="cursor-pointer"
        >
          <Settings className="mr-2 h-4 w-4" />
          <span>Account Settings</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleProfileAction("notifications")}
          className="cursor-pointer"
        >
          <Bell className="mr-2 h-4 w-4" />
          <span>Notifications</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleProfileAction("privacy")}
          className="cursor-pointer"
        >
          <Shield className="mr-2 h-4 w-4" />
          <span>Privacy & Security</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Support Section */}
        <DropdownMenuItem
          onClick={() => handleProfileAction("help")}
          className="cursor-pointer"
        >
          <HelpCircle className="mr-2 h-4 w-4" />
          <span>Help Center</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleProfileAction("docs")}
          className="cursor-pointer"
        >
          <FileText className="mr-2 h-4 w-4" />
          <span>Documentation</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleProfileAction("feedback")}
          className="cursor-pointer"
        >
          <Heart className="mr-2 h-4 w-4" />
          <span>Send Feedback</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleProfileAction("support")}
          className="cursor-pointer"
        >
          <MessageSquare className="mr-2 h-4 w-4" />
          <span>Contact Support</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Logout */}
        <DropdownMenuItem
          onClick={() => handleProfileAction("logout")}
          className="cursor-pointer text-red-600 focus:text-red-600 dark:text-red-400 dark:focus:text-red-400"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

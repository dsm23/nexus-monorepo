import { useEffect, useState } from "react";
import type { FunctionComponent } from "react";
import { Sparkles, X } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Checkbox } from "~/components/ui/checkbox";
import { storage } from "~/lib/utils";

interface ChecklistItem {
  id: string;
  label: string;
  description: string;
  completed: boolean;
}

interface WelcomeChecklistProps {
  onDismiss: () => void;
}

export const WelcomeChecklist: FunctionComponent<WelcomeChecklistProps> = ({
  onDismiss,
}) => {
  const [items, setItems] = useState<ChecklistItem[]>([
    {
      id: "quick-links",
      label: "Add a Quick Link",
      description: "Customize your quick links in the sidebar for easy access",
      completed: false,
    },
    {
      id: "team-calendar",
      label: "Check the Team Calendar",
      description:
        "View upcoming events, birthdays, and anniversaries in the calendar",
      completed: false,
    },
    {
      id: "focus-mode",
      label: "Try Focus Mode",
      description:
        "Click the Focus Mode button in the header to hide distractions",
      completed: false,
    },
    {
      id: "kudos",
      label: "Give someone kudos",
      description: "Recognize a colleague in the Kudos section",
      completed: false,
    },
    {
      id: "directory",
      label: "Explore the Employee Directory",
      description: "Find and filter colleagues by department",
      completed: false,
    },
  ]);

  const completedCount = items.filter((item) => item.completed).length;
  const totalCount = items.length;

  const handleCheckItem = (itemId: string, checked: boolean) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, completed: checked } : item,
      ),
    );
  };

  const handleDismiss = () => {
    storage.setOnboarded();
    onDismiss();
  };

  useEffect(() => {
    // Removed automatic checking logic - users must manually check all items
  }, []);

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col space-y-2 pb-2 sm:flex-row sm:items-start sm:justify-between sm:space-y-0">
        <div>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Sparkles className="h-5 w-5" />
            Welcome to Nexus! 🎉
          </CardTitle>
          <CardDescription>
            Get started with these quick tasks ({completedCount}/{totalCount}{" "}
            completed)
          </CardDescription>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDismiss}
          className="h-8 w-8 self-start p-0 sm:self-auto"
        >
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="flex items-start space-x-3">
              <Checkbox
                id={item.id}
                checked={item.completed}
                onCheckedChange={(checked) =>
                  handleCheckItem(item.id, checked as boolean)
                }
                className="mt-1"
              />
              <div className="flex-1 space-y-1">
                <label
                  htmlFor={item.id}
                  className={`cursor-pointer text-sm leading-none font-medium ${
                    item.completed ? "text-muted-foreground line-through" : ""
                  }`}
                >
                  {item.label}
                </label>
                <p className="text-muted-foreground text-xs">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {completedCount === totalCount && (
          <div className="mt-4 rounded-lg border border-green-500/20 bg-green-500/10 p-3">
            <p className="text-sm font-medium text-green-800 dark:text-green-300">
              🎉 Congratulations! You've completed the welcome checklist.
            </p>
            <Button size="sm" onClick={handleDismiss} className="mt-2">
              Finish Setup
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

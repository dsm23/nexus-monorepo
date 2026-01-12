import type { FunctionComponent } from "react";
import {
  AlertCircle,
  ArrowRight,
  Calendar,
  CheckCircle2,
  Clock,
  FolderOpen,
  Users,
} from "lucide-react";
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
import { projects } from "~/data/mockData";
import { useWaveAnimation } from "~/hooks/useWaveAnimation";
import type { Project } from "~/data/mockData";

const getStatusColor = (status: Project["status"]) => {
  switch (status) {
    case "active":
      return "border-blue-600 bg-blue-50 text-blue-700 dark:border-blue-300 dark:bg-blue-100 dark:text-blue-800";
    case "completed":
      return "border-green-600 bg-green-50 text-green-700 dark:border-green-300 dark:bg-green-100 dark:text-green-800";
    case "on-hold":
      return "border-yellow-600 bg-yellow-50 text-yellow-700 dark:border-yellow-300 dark:bg-yellow-100 dark:text-yellow-800";
    case "cancelled":
      return "border-red-600 bg-red-50 text-red-700 dark:border-red-300 dark:bg-red-100 dark:text-red-800";
    default:
      return "border-muted-foreground/20 bg-muted text-muted-foreground";
  }
};

const getPriorityIcon = (priority: Project["priority"]) => {
  switch (priority) {
    case "high":
      return <AlertCircle className="h-3 w-3" />;
    case "medium":
      return <Clock className="h-3 w-3" />;
    case "low":
      return <CheckCircle2 className="h-3 w-3" />;
    default:
      return <Clock className="h-3 w-3" />;
  }
};

const getProgressColor = (progress: number) => {
  if (progress >= 80) return "bg-green-500";
  if (progress >= 50) return "bg-blue-500";
  if (progress >= 25) return "bg-yellow-500";
  return "bg-gray-500";
};

export const Projects: FunctionComponent = () => {
  const { containerRef, getItemStyle, getItemClassName } = useWaveAnimation();

  // Show only first 3 projects on dashboard
  const displayProjects = projects.slice(0, 3);

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col space-y-2 pb-2 sm:flex-row sm:items-start sm:justify-between sm:space-y-0">
        <div>
          <CardTitle className="flex items-center gap-2 text-lg">
            <FolderOpen className="h-5 w-5" />
            Projects & Tasks
          </CardTitle>
          <CardDescription>
            Track project progress and manage tasks
          </CardDescription>
        </div>
        <Link to="/projects" className="w-full sm:w-auto">
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
        {displayProjects.length === 0 ? (
          <div className="text-muted-foreground py-8 text-center">
            <FolderOpen className="mx-auto mb-2 h-8 w-8 opacity-50" />
            <p className="text-sm">No active projects.</p>
            <p className="mt-1 text-xs">
              Create your first project to get started!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {displayProjects.map((project, index) => (
              <div
                key={project.id}
                className={getItemClassName(
                  "hover:bg-muted/50 rounded-lg border p-4",
                )}
                style={getItemStyle(index)}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    {getPriorityIcon(project.priority)}
                  </div>
                  <div className="flex-1 space-y-3">
                    {/* Project Header */}
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h4 className="text-sm leading-none font-medium">
                          {project.name}
                        </h4>
                        <p className="text-muted-foreground line-clamp-2 text-xs">
                          {project.description}
                        </p>
                      </div>
                      <div className="ml-2 flex items-center gap-1">
                        <Badge
                          variant="outline"
                          className={
                            getStatusColor(project.status) + " text-xs"
                          }
                        >
                          {project.status.replace("-", " ").toUpperCase()}
                        </Badge>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{project.progress}%</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                        <div
                          className={`h-1.5 rounded-full transition-all duration-300 ${getProgressColor(project.progress)}`}
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Project Meta Info */}
                    <div className="text-muted-foreground flex flex-wrap items-center gap-3 text-xs">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>Due: {project.endDate.toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        <span>{project.teamMembers.length} members</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        <span>{project.tasks.length} tasks</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Show remaining count if there are more projects */}
            {projects.length > 3 && (
              <div className="border-t pt-2">
                <Link to="/projects">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-foreground w-full gap-2"
                  >
                    <span>View {projects.length - 3} more projects</span>
                    <ArrowRight className="h-3 w-3" />
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

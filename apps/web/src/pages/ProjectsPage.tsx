import { useState } from "react";
import type { FunctionComponent } from "react";
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  Filter,
  FolderOpen,
  MoreVertical,
  Plus,
  Search,
  Target,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Header } from "~/components/Header";
import { PageSection, PageWrapper } from "~/components/PageWrapper";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Textarea } from "~/components/ui/textarea";
import { projects } from "~/data/mockData";
import { generateId } from "~/lib/utils";
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

const getPriorityColor = (priority: Project["priority"]) => {
  switch (priority) {
    case "high":
      return "text-red-600";
    case "medium":
      return "text-yellow-600";
    case "low":
      return "text-green-600";
    default:
      return "text-muted-foreground";
  }
};

const getPriorityIcon = (priority: Project["priority"]) => {
  switch (priority) {
    case "high":
      return <AlertCircle className="h-4 w-4" />;
    case "medium":
      return <Clock className="h-4 w-4" />;
    case "low":
      return <CheckCircle2 className="h-4 w-4" />;
    default:
      return <Clock className="h-4 w-4" />;
  }
};

export const ProjectsPage: FunctionComponent = () => {
  const [projectsList, setProjectsList] = useState<Project[]>(projects);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDescription, setNewProjectDescription] = useState("");
  const [newProjectPriority, setNewProjectPriority] =
    useState<Project["priority"]>("medium");

  // Filter projects based on search query, status, and priority
  const filteredProjects = projectsList.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || project.status === filterStatus;
    const matchesPriority =
      filterPriority === "all" || project.priority === filterPriority;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const addProject = () => {
    if (!newProjectName.trim() || !newProjectDescription.trim()) return;

    const newProject: Project = {
      id: generateId(),
      name: newProjectName.trim(),
      description: newProjectDescription.trim(),
      status: "active",
      priority: newProjectPriority,
      progress: 0,
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      teamMembers: ["You"],
      tasks: [],
    };

    setProjectsList((prev) => [newProject, ...prev]);

    // Reset form
    setNewProjectName("");
    setNewProjectDescription("");
    setNewProjectPriority("medium");
    setIsAddDialogOpen(false);
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "bg-green-500";
    if (progress >= 50) return "bg-blue-500";
    if (progress >= 25) return "bg-yellow-500";
    return "bg-gray-500";
  };

  return (
    <div className="bg-background min-h-screen">
      <Header />

      <PageWrapper className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
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
            <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
              Projects & Tasks
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              Manage your projects, track progress, and collaborate with your
              team
            </p>
          </div>
        </PageSection>

        {/* Actions & Filters Section */}
        <PageSection index={1}>
          <Card className="mb-6">
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="text-base sm:text-lg">
                Manage Projects
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
              {/* First Row - Search and Create */}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
                    <Input
                      placeholder="Search projects..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Create Project Button */}
                <Dialog
                  open={isAddDialogOpen}
                  onOpenChange={setIsAddDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button className="w-full gap-2 whitespace-nowrap sm:w-auto">
                      <Plus className="h-4 w-4" />
                      <span className="sm:hidden">Create Project</span>
                      <span className="hidden sm:inline">New Project</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="mx-4 sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>Create New Project</DialogTitle>
                      <DialogDescription>
                        Start a new project and begin tracking progress with
                        your team.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-1 items-center gap-4 sm:grid-cols-4">
                        <Label htmlFor="name" className="sm:text-right">
                          Name
                        </Label>
                        <Input
                          id="name"
                          value={newProjectName}
                          onChange={(e) => setNewProjectName(e.target.value)}
                          placeholder="Enter project name"
                          className="sm:col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-1 items-start gap-4 sm:grid-cols-4">
                        <Label
                          htmlFor="description"
                          className="sm:mt-2 sm:text-right"
                        >
                          Description
                        </Label>
                        <Textarea
                          id="description"
                          value={newProjectDescription}
                          onChange={(e) =>
                            setNewProjectDescription(e.target.value)
                          }
                          placeholder="Describe the project goals and scope"
                          className="sm:col-span-3"
                          rows={3}
                        />
                      </div>
                      <div className="grid grid-cols-1 items-center gap-4 sm:grid-cols-4">
                        <Label htmlFor="priority" className="sm:text-right">
                          Priority
                        </Label>
                        <Select
                          value={newProjectPriority}
                          onValueChange={(value: Project["priority"]) =>
                            setNewProjectPriority(value)
                          }
                        >
                          <SelectTrigger className="sm:col-span-3">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        onClick={addProject}
                        disabled={
                          !newProjectName.trim() ||
                          !newProjectDescription.trim()
                        }
                      >
                        Create Project
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Second Row - Filters */}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                {/* Status Filter */}
                <div className="w-full sm:w-56">
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="h-10 w-full gap-2">
                      <Filter className="h-4 w-4" />
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="on-hold">On Hold</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Priority Filter */}
                <div className="w-full sm:w-56">
                  <Select
                    value={filterPriority}
                    onValueChange={setFilterPriority}
                  >
                    <SelectTrigger className="h-10 w-full gap-2">
                      <Target className="h-4 w-4" />
                      <SelectValue placeholder="Filter by priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priorities</SelectItem>
                      <SelectItem value="high">High Priority</SelectItem>
                      <SelectItem value="medium">Medium Priority</SelectItem>
                      <SelectItem value="low">Low Priority</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Spacer for alignment */}
                <div className="hidden flex-1 sm:block" />
              </div>

              {/* Results Count */}
              <div className="text-muted-foreground text-xs sm:text-sm">
                Showing {filteredProjects.length} of {projectsList.length}{" "}
                projects
              </div>
            </CardContent>
          </Card>
        </PageSection>

        {/* Projects Grid */}
        <div className="space-y-4">
          {filteredProjects.length === 0 ? (
            <PageSection index={2}>
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-8 sm:py-12">
                  <div className="mx-auto max-w-sm space-y-3 px-4 text-center">
                    <div className="bg-muted mx-auto flex h-10 w-10 items-center justify-center rounded-full sm:h-12 sm:w-12">
                      <FolderOpen className="text-muted-foreground h-5 w-5 sm:h-6 sm:w-6" />
                    </div>
                    <h3 className="text-sm font-medium sm:text-base">
                      {searchQuery ? "No projects found" : "No projects yet"}
                    </h3>
                    <p className="text-muted-foreground text-xs sm:text-sm">
                      {searchQuery
                        ? "Try adjusting your search or filter criteria"
                        : "Create your first project to get started"}
                    </p>
                    {!searchQuery && (
                      <Dialog
                        open={isAddDialogOpen}
                        onOpenChange={setIsAddDialogOpen}
                      >
                        <DialogTrigger asChild>
                          <Button className="mt-3 w-full gap-2 sm:mt-4 sm:w-auto">
                            <Plus className="h-4 w-4" />
                            Create First Project
                          </Button>
                        </DialogTrigger>
                      </Dialog>
                    )}
                  </div>
                </CardContent>
              </Card>
            </PageSection>
          ) : (
            filteredProjects.map((project, index) => (
              <PageSection key={project.id} index={index + 3}>
                <Card className="transition-shadow hover:shadow-md">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div
                        className={`mt-1 flex-shrink-0 ${getPriorityColor(project.priority)}`}
                      >
                        {getPriorityIcon(project.priority)}
                      </div>

                      <div className="min-w-0 flex-1 space-y-3 sm:space-y-4">
                        {/* Project Header */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1 space-y-2">
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                              <h3 className="truncate text-base font-semibold sm:text-lg">
                                {project.name}
                              </h3>
                              <div className="flex flex-wrap gap-2">
                                <Badge
                                  variant="outline"
                                  className={`text-xs ${getStatusColor(project.status)}`}
                                >
                                  {project.status
                                    .replace("-", " ")
                                    .toUpperCase()}
                                </Badge>
                                <Badge
                                  variant="outline"
                                  className={`text-xs ${getPriorityColor(project.priority).replace("text-", "border-").replace("600", "200")} ${getPriorityColor(project.priority).replace("text-", "bg-").replace("600", "50")} ${getPriorityColor(project.priority)}`}
                                >
                                  {project.priority.toUpperCase()}
                                </Badge>
                              </div>
                            </div>
                            <p className="text-muted-foreground text-xs leading-relaxed sm:text-sm">
                              {project.description}
                            </p>
                          </div>

                          <Button
                            variant="ghost"
                            size="sm"
                            className="flex-shrink-0"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </div>

                        {/* Progress Bar */}
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs sm:text-sm">
                            <span>Progress</span>
                            <span className="font-medium">
                              {project.progress}%
                            </span>
                          </div>
                          <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                            <div
                              className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(project.progress)}`}
                              style={{ width: `${project.progress}%` }}
                            ></div>
                          </div>
                        </div>

                        {/* Project Meta Info */}
                        <div className="text-muted-foreground flex flex-wrap items-center gap-2 text-xs sm:gap-4">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3 flex-shrink-0" />
                            <span className="truncate">
                              Due: {project.endDate.toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3 flex-shrink-0" />
                            <span>{project.teamMembers.length} members</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3 flex-shrink-0" />
                            <span>{project.tasks.length} tasks</span>
                          </div>
                        </div>

                        {/* Team Members Preview */}
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                          <span className="text-muted-foreground flex-shrink-0 text-xs sm:text-sm">
                            Team:
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {project.teamMembers
                              .slice(0, 3)
                              .map((member: string, idx: number) => (
                                <Badge
                                  key={idx}
                                  variant="secondary"
                                  className="text-xs"
                                >
                                  {member}
                                </Badge>
                              ))}
                            {project.teamMembers.length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{project.teamMembers.length - 3}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </PageSection>
            ))
          )}
        </div>

        {/* Load More Button (for future pagination) */}
        {filteredProjects.length > 0 && (
          <div className="mt-6 px-4 text-center sm:mt-8">
            <Button variant="outline" disabled className="w-full sm:w-auto">
              Load More Projects
            </Button>
            <p className="text-muted-foreground mt-2 text-xs">
              All projects loaded
            </p>
          </div>
        )}
      </PageWrapper>
    </div>
  );
};

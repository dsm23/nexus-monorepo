import { useMemo, useState } from "react";
import type { CSSProperties, FunctionComponent } from "react";
import {
  ArrowLeft,
  BookOpen,
  Download,
  ExternalLink,
  Eye,
  File,
  FileText,
  Filter,
  GraduationCap,
  Heart,
  Library,
  Search,
  Settings,
  Star,
  User,
  Video,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Header } from "~/components/Header";
import { PageSection, PageWrapper } from "~/components/PageWrapper";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { resourceCategories, resourcesData } from "~/data/mockData";
import type { Resource } from "~/data/mockData";

const getFileIcon = (type: string) => {
  switch (type) {
    case "pdf":
      return <File className="h-4 w-4 text-red-600" />;
    case "doc":
      return <FileText className="h-4 w-4 text-blue-600" />;
    case "ppt":
      return <File className="h-4 w-4 text-orange-600" />;
    case "xls":
      return <File className="h-4 w-4 text-green-600" />;
    case "video":
      return <Video className="h-4 w-4 text-purple-600" />;
    case "link":
      return <ExternalLink className="h-4 w-4 text-blue-500" />;
    default:
      return <FileText className="h-4 w-4 text-gray-600" />;
  }
};

const getCategoryIcon = (iconName: string) => {
  switch (iconName) {
    case "BookOpen":
      return <BookOpen className="h-5 w-5" />;
    case "FileText":
      return <FileText className="h-5 w-5" />;
    case "GraduationCap":
      return <GraduationCap className="h-5 w-5" />;
    case "Settings":
      return <Settings className="h-5 w-5" />;
    case "Library":
      return <Library className="h-5 w-5" />;
    default:
      return <FileText className="h-5 w-5" />;
  }
};

const ResourceCard: FunctionComponent<{
  resource: Resource;
  onToggleFavorite: (id: string) => void;
  className?: string;
  style?: CSSProperties;
}> = ({ resource, onToggleFavorite, className = "", style }) => (
  <Card
    className={`transition-shadow hover:shadow-md ${className}`}
    style={style}
  >
    <CardContent className="p-4">
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex min-w-0 flex-1 items-center gap-2">
            {getFileIcon(resource.type)}
            <h3 className="truncate text-sm font-medium">{resource.title}</h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 flex-shrink-0 p-0"
            onClick={() => onToggleFavorite(resource.id)}
          >
            <Heart
              className={`h-4 w-4 ${resource.isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"}`}
            />
          </Button>
        </div>

        <p className="text-muted-foreground line-clamp-2 text-xs">
          {resource.description}
        </p>

        <div className="flex flex-wrap gap-1">
          {resource.tags.slice(0, 2).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
          {resource.tags.length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{resource.tags.length - 2}
            </Badge>
          )}
        </div>

        <div className="text-muted-foreground flex items-center justify-between text-xs">
          <div className="flex items-center gap-1">
            <User className="h-3 w-3" />
            <span>{resource.uploadedBy}</span>
          </div>
          {resource.size && <span>{resource.size}</span>}
        </div>

        <div className="flex items-center justify-between">
          <div className="text-muted-foreground flex items-center gap-1 text-xs">
            <Eye className="h-3 w-3" />
            <span>{resource.downloadCount} views</span>
          </div>
          <Button size="sm" className="h-7 text-xs">
            <Download className="mr-1 h-3 w-3" />
            {resource.type === "link" ? "Open" : "Download"}
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
);

export const ResourcesPage: FunctionComponent = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [resources, setResources] = useState(resourcesData);

  const departments = Array.from(
    new Set(resourcesData.map((r) => r.department).filter(Boolean)),
  );

  const filteredResources = useMemo(() => {
    return resources.filter((resource) => {
      const matchesSearch =
        resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.description
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        resource.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase()),
        );

      const matchesCategory =
        selectedCategory === "all" || resource.category === selectedCategory;
      const matchesDepartment =
        selectedDepartment === "all" ||
        resource.department === selectedDepartment;
      const matchesFavorites = !showFavoritesOnly || resource.isFavorite;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesDepartment &&
        matchesFavorites
      );
    });
  }, [
    resources,
    searchQuery,
    selectedCategory,
    selectedDepartment,
    showFavoritesOnly,
  ]);

  const handleToggleFavorite = (resourceId: string) => {
    setResources((prev) =>
      prev.map((resource) =>
        resource.id === resourceId
          ? { ...resource, isFavorite: !resource.isFavorite }
          : resource,
      ),
    );
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
            <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
              Company Resources & Documents
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              Access company policies, documents, templates, and resources
            </p>
          </div>
        </PageSection>

        <Tabs defaultValue="browse" className="space-y-6">
          <PageSection index={1}>
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="browse" className="gap-2">
                <Search className="hidden h-4 w-4 sm:inline" />
                Browse Resources
              </TabsTrigger>
              <TabsTrigger value="categories" className="gap-2">
                <BookOpen className="hidden h-4 w-4 sm:inline" />
                Categories
              </TabsTrigger>
            </TabsList>
          </PageSection>

          {/* Browse Tab */}
          <TabsContent value="browse" className="space-y-6">
            {/* Search and Filters */}
            <PageSection index={2}>
              <Card>
                <CardContent className="p-4">
                  <div className="space-y-4">
                    <div className="flex flex-col gap-4 sm:flex-row">
                      <div className="relative flex-1">
                        <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
                        <Input
                          placeholder="Search resources, documents, and files..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                      <Button
                        variant={showFavoritesOnly ? "default" : "outline"}
                        onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                        className="gap-2"
                      >
                        <Star className="h-4 w-4" />
                        Favorites
                      </Button>
                    </div>

                    <div className="flex flex-col gap-4 sm:flex-row">
                      <Select
                        value={selectedCategory}
                        onValueChange={setSelectedCategory}
                      >
                        <SelectTrigger className="w-full sm:w-48">
                          <Filter className="mr-2 h-4 w-4" />
                          <SelectValue placeholder="All Categories" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Categories</SelectItem>
                          {resourceCategories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Select
                        value={selectedDepartment}
                        onValueChange={setSelectedDepartment}
                      >
                        <SelectTrigger className="w-full sm:w-48">
                          <SelectValue placeholder="All Departments" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Departments</SelectItem>
                          {departments.map((dept) => (
                            <SelectItem key={dept} value={dept as string}>
                              {dept}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </PageSection>

            {/* Results */}
            <PageSection index={3} className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">
                  {filteredResources.length} Resources Found
                </h2>
                <div className="text-muted-foreground text-sm">
                  Total: {resources.length} resources
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredResources.map((resource, index) => (
                  <ResourceCard
                    key={resource.id}
                    resource={resource}
                    onToggleFavorite={handleToggleFavorite}
                    style={{ animationDelay: `${index * 50}ms` }}
                    className="animate-in fade-in slide-in-from-bottom-4 duration-300"
                  />
                ))}
              </div>

              {filteredResources.length === 0 && (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Search className="text-muted-foreground mb-4 h-12 w-12" />
                    <h3 className="mb-2 text-lg font-medium">
                      No resources found
                    </h3>
                    <p className="text-muted-foreground text-center">
                      Try adjusting your search criteria or browse by category
                    </p>
                  </CardContent>
                </Card>
              )}
            </PageSection>
          </TabsContent>

          {/* Categories Tab */}
          <TabsContent value="categories" className="space-y-6">
            <PageSection index={4}>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {resourceCategories.map((category, index) => (
                  <Card
                    key={category.id}
                    className="animate-in fade-in slide-in-from-bottom-4 cursor-pointer transition-shadow duration-300 hover:shadow-md"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`rounded-lg p-2 bg-${category.color}-100 text-${category.color}-600`}
                        >
                          {getCategoryIcon(category.icon)}
                        </div>
                        <div>
                          <CardTitle className="text-base">
                            {category.name}
                          </CardTitle>
                          <p className="text-muted-foreground text-sm">
                            {category.count} resources
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-muted-foreground text-sm">
                        {category.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </PageSection>
          </TabsContent>
        </Tabs>
      </PageWrapper>
    </div>
  );
};

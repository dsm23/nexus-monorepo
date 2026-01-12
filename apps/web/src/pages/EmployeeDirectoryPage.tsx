import { useState } from "react";
import type { FunctionComponent } from "react";
import {
  ArrowLeft,
  Filter,
  Mail,
  MapPin,
  Network,
  Phone,
  Search,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Header } from "~/components/Header";
import { OrganizationChart } from "~/components/OrganizationChart";
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
import { employees } from "~/data/mockData";

const getDepartmentBadgeColor = (department: string) => {
  switch (department) {
    case "Executive":
      return "border-yellow-600 bg-yellow-50 text-yellow-700 dark:border-yellow-300 dark:bg-yellow-100 dark:text-yellow-800";
    case "Engineering":
      return "border-blue-600 bg-blue-50 text-blue-700 dark:border-blue-300 dark:bg-blue-100 dark:text-blue-800";
    case "Design":
      return "border-purple-600 bg-purple-50 text-purple-700 dark:border-purple-300 dark:bg-purple-100 dark:text-purple-800";
    case "Product":
      return "border-green-600 bg-green-50 text-green-700 dark:border-green-300 dark:bg-green-100 dark:text-green-800";
    case "Marketing":
      return "border-orange-600 bg-orange-50 text-orange-700 dark:border-orange-300 dark:bg-orange-100 dark:text-orange-800";
    case "Sales":
      return "border-pink-600 bg-pink-50 text-pink-700 dark:border-pink-300 dark:bg-pink-100 dark:text-pink-800";
    case "HR":
      return "border-indigo-600 bg-indigo-50 text-indigo-700 dark:border-indigo-300 dark:bg-indigo-100 dark:text-indigo-800";
    default:
      return "border-muted-foreground/20 bg-muted text-muted-foreground";
  }
};

export const EmployeeDirectoryPage: FunctionComponent = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDepartment, setFilterDepartment] = useState<string>("all");

  // Get unique departments for filter
  const departments = Array.from(
    new Set(employees.map((emp) => emp.department)),
  ).sort();

  // Filter employees based on search and department
  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch =
      employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (employee.email &&
        employee.email.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesDepartment =
      filterDepartment === "all" || employee.department === filterDepartment;

    return matchesSearch && matchesDepartment;
  });

  return (
    <div className="bg-background min-h-screen">
      <Header />

      <PageWrapper className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Header Section */}
        <PageSection index={0}>
          <div className="mb-6">
            <div className="mb-4 flex items-center gap-4">
              <Link to="/">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Dashboard
                </Button>
              </Link>
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-bold tracking-tight">
                Employee Directory
              </h1>
              <p className="text-muted-foreground">
                Find and connect with your colleagues across the organization
              </p>
            </div>
          </div>
        </PageSection>

        {/* Tabs for Directory and Org Chart */}
        <PageSection index={1}>
          <Tabs defaultValue="directory" className="space-y-6">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="directory" className="gap-2">
                <Users className="hidden h-4 w-4 sm:inline" />
                Directory
              </TabsTrigger>
              <TabsTrigger value="orgchart" className="gap-2">
                <Network className="hidden h-4 w-4 sm:inline" />
                Org Chart
              </TabsTrigger>
            </TabsList>

            {/* Employee Directory Tab */}
            <TabsContent value="directory" className="space-y-6">
              {/* Filters Section */}
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">Search & Filter</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-4 sm:flex-row">
                    {/* Search Input */}
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
                        <Input
                          placeholder="Search by name, role, department, or email..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    {/* Department Filter */}
                    <div className="sm:w-48">
                      <Select
                        value={filterDepartment}
                        onValueChange={setFilterDepartment}
                      >
                        <SelectTrigger className="gap-2">
                          <Filter className="h-4 w-4" />
                          <SelectValue placeholder="Filter by department" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Departments</SelectItem>
                          {departments.map((dept) => (
                            <SelectItem key={dept} value={dept}>
                              {dept}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Results Count */}
                  <div className="text-muted-foreground mt-4 text-sm">
                    Showing {filteredEmployees.length} of {employees.length}{" "}
                    employees
                  </div>
                </CardContent>
              </Card>

              {/* Employee Cards */}
              <div className="space-y-4">
                {filteredEmployees.length === 0 ? (
                  <PageSection index={2}>
                    <Card>
                      <CardContent className="flex flex-col items-center justify-center py-12">
                        <div className="space-y-2 text-center">
                          <div className="bg-muted mx-auto flex h-12 w-12 items-center justify-center rounded-full">
                            <Search className="text-muted-foreground h-6 w-6" />
                          </div>
                          <h3 className="font-medium">No employees found</h3>
                          <p className="text-muted-foreground text-sm">
                            Try adjusting your search or filter criteria
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </PageSection>
                ) : (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {filteredEmployees.map((employee, index) => (
                      <PageSection key={employee.id} index={index + 2}>
                        <Card className="transition-shadow hover:shadow-md">
                          <CardContent className="p-6">
                            <div className="flex items-start gap-4">
                              <div className="flex-shrink-0">
                                <img
                                  src={employee.avatar}
                                  alt={employee.name}
                                  className="bg-muted h-12 w-12 rounded-full"
                                />
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="space-y-3">
                                  <div>
                                    <h3 className="truncate font-medium">
                                      {employee.name}
                                    </h3>
                                    <p className="text-muted-foreground truncate text-sm">
                                      {employee.role}
                                    </p>
                                  </div>

                                  <div>
                                    <Badge
                                      variant="outline"
                                      className={getDepartmentBadgeColor(
                                        employee.department,
                                      )}
                                    >
                                      {employee.department}
                                    </Badge>
                                  </div>

                                  {/* Contact Information */}
                                  <div className="space-y-2">
                                    {employee.email && (
                                      <div className="text-muted-foreground flex items-center gap-2 text-xs">
                                        <Mail className="h-3 w-3" />
                                        <span className="truncate">
                                          {employee.email}
                                        </span>
                                      </div>
                                    )}
                                    {employee.phone && (
                                      <div className="text-muted-foreground flex items-center gap-2 text-xs">
                                        <Phone className="h-3 w-3" />
                                        <span>{employee.phone}</span>
                                      </div>
                                    )}
                                    {employee.location && (
                                      <div className="text-muted-foreground flex items-center gap-2 text-xs">
                                        <MapPin className="h-3 w-3" />
                                        <span>{employee.location}</span>
                                      </div>
                                    )}
                                  </div>

                                  {/* Action Buttons */}
                                  <div className="flex gap-2 pt-2">
                                    {employee.email && (
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex-1 gap-2 text-xs"
                                        onClick={() =>
                                          window.open(
                                            `mailto:${employee.email}`,
                                            "_blank",
                                          )
                                        }
                                      >
                                        <Mail className="h-3 w-3" />
                                        Email
                                      </Button>
                                    )}
                                    {employee.phone && (
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex-1 gap-2 text-xs"
                                        onClick={() =>
                                          window.open(
                                            `tel:${employee.phone}`,
                                            "_blank",
                                          )
                                        }
                                      >
                                        <Phone className="h-3 w-3" />
                                        Call
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </PageSection>
                    ))}
                  </div>
                )}
              </div>

              {/* Department Statistics */}
              {filteredEmployees.length > 0 && (
                <Card className="mt-8">
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Department Breakdown
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
                      {departments.map((dept) => {
                        const count = filteredEmployees.filter(
                          (emp) => emp.department === dept,
                        ).length;
                        const total = employees.filter(
                          (emp) => emp.department === dept,
                        ).length;
                        return (
                          <div key={dept} className="space-y-1 text-center">
                            <Badge
                              variant="outline"
                              className={getDepartmentBadgeColor(dept)}
                            >
                              {dept}
                            </Badge>
                            <p className="text-muted-foreground text-xs">
                              {count} / {total}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Load More Button (for future pagination) */}
              {filteredEmployees.length > 0 && (
                <div className="mt-8 text-center">
                  <Button variant="outline" disabled>
                    Load More Employees
                  </Button>
                  <p className="text-muted-foreground mt-2 text-xs">
                    All employees loaded
                  </p>
                </div>
              )}
            </TabsContent>

            {/* Organization Chart Tab */}
            <TabsContent value="orgchart">
              <OrganizationChart />
            </TabsContent>
          </Tabs>
        </PageSection>
      </PageWrapper>
    </div>
  );
};

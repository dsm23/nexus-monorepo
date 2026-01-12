import { useState } from "react";
import type { FunctionComponent } from "react";
import { ArrowRight, Users } from "lucide-react";
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
import { employees } from "~/data/mockData";
import { useWaveAnimation } from "~/hooks/useWaveAnimation";

const departments = ["All", "Engineering", "Design", "Product", "Marketing"];

export const EmployeeDirectory: FunctionComponent = () => {
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const { containerRef, getItemStyle, getItemClassName } = useWaveAnimation();

  const filteredEmployees =
    selectedDepartment === "All"
      ? employees.slice(0, 6) // Show only first 6 employees on dashboard
      : employees
          .filter((employee) => employee.department === selectedDepartment)
          .slice(0, 6);

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col space-y-2 pb-2 sm:flex-row sm:items-start sm:justify-between sm:space-y-0">
        <div>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Users className="h-5 w-5" />
            Employee Directory
          </CardTitle>
          <CardDescription>
            Find and connect with your colleagues
          </CardDescription>
        </div>
        <Link to="/employees" className="w-full sm:w-auto">
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
        {/* Department Filter */}
        <div className="mb-6 flex flex-wrap gap-2">
          {departments.map((dept) => (
            <Button
              key={dept}
              variant={selectedDepartment === dept ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedDepartment(dept)}
              className="text-xs"
            >
              {dept}
              {dept !== "All" && (
                <span className="ml-1 text-xs opacity-70">
                  ({employees.filter((emp) => emp.department === dept).length})
                </span>
              )}
            </Button>
          ))}
        </div>

        {/* Employee Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {filteredEmployees.map((employee, index) => (
            <div
              key={employee.id}
              className={getItemClassName(
                "hover:bg-muted/50 rounded-lg border p-4",
              )}
              style={getItemStyle(index)}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <img
                    src={employee.avatar}
                    alt={employee.name}
                    className="bg-muted h-10 w-10 rounded-full"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="truncate text-sm font-medium">
                    {employee.name}
                  </h4>
                  <p className="text-muted-foreground truncate text-sm">
                    {employee.role}
                  </p>
                  <div className="mt-1">
                    <Badge
                      variant="outline"
                      className={
                        employee.department === "Engineering"
                          ? "border-blue-600 bg-blue-50 text-blue-700 dark:border-blue-300 dark:bg-blue-100 dark:text-blue-800"
                          : employee.department === "Design"
                            ? "border-purple-600 bg-purple-50 text-purple-700 dark:border-purple-300 dark:bg-purple-100 dark:text-purple-800"
                            : employee.department === "Product"
                              ? "border-green-600 bg-green-50 text-green-700 dark:border-green-300 dark:bg-green-100 dark:text-green-800"
                              : employee.department === "Marketing"
                                ? "border-orange-600 bg-orange-50 text-orange-700 dark:border-orange-300 dark:bg-orange-100 dark:text-orange-800"
                                : "border-muted-foreground/20 bg-muted text-muted-foreground"
                      }
                    >
                      {employee.department}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredEmployees.length === 0 && (
          <div className="text-muted-foreground py-8 text-center">
            <Users className="mx-auto mb-2 h-8 w-8 opacity-50" />
            <p className="text-sm">
              No employees found in {selectedDepartment} department.
            </p>
          </div>
        )}

        {/* Summary */}
        <div className="mt-6 border-t pt-4">
          <p className="text-muted-foreground text-center text-xs">
            Showing {filteredEmployees.length} of {employees.length} employees
            {selectedDepartment !== "All" && ` in ${selectedDepartment}`}
          </p>

          {/* Show remaining count if there are more employees */}
          {employees.length > 6 && (
            <div className="mt-2">
              <Link to="/employees">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground w-full gap-2"
                >
                  <span>View {employees.length - 6} more employees</span>
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

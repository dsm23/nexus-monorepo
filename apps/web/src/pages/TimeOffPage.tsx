import { useState } from "react";
import type { CSSProperties, FormEventHandler, FunctionComponent } from "react";
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  CalendarDays,
  CheckCircle,
  Clock,
  FileText,
  MapPin,
  Plane,
  Plus,
  TrendingUp,
  User,
  XCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Header } from "~/components/Header";
import { PageSection, PageWrapper } from "~/components/PageWrapper";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  Dialog,
  DialogContent,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Textarea } from "~/components/ui/textarea";
import {
  timeOffPolicies,
  timeOffRequests,
  userTimeOffBalance,
} from "~/data/mockData";
import type {
  TimeOffBalance,
  TimeOffPolicy,
  TimeOffRequest,
} from "~/data/mockData";

const getStatusColor = (status: string) => {
  switch (status) {
    case "approved":
      return "bg-green-100 text-green-700 border-green-200";
    case "pending":
      return "bg-yellow-100 text-yellow-700 border-yellow-200";
    case "denied":
      return "bg-red-100 text-red-700 border-red-200";
    case "cancelled":
      return "bg-gray-100 text-gray-700 border-gray-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "approved":
      return <CheckCircle className="h-4 w-4" />;
    case "pending":
      return <Clock className="h-4 w-4" />;
    case "denied":
      return <XCircle className="h-4 w-4" />;
    case "cancelled":
      return <XCircle className="h-4 w-4" />;
    default:
      return <Clock className="h-4 w-4" />;
  }
};

const getTypeIcon = (type: string) => {
  switch (type) {
    case "vacation":
      return <Plane className="h-4 w-4 text-blue-600" />;
    case "sick":
      return <AlertCircle className="h-4 w-4 text-red-600" />;
    case "personal":
      return <User className="h-4 w-4 text-purple-600" />;
    case "holiday":
      return <Calendar className="h-4 w-4 text-green-600" />;
    default:
      return <Calendar className="h-4 w-4 text-gray-600" />;
  }
};

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
};

const BalanceCard: FunctionComponent<{
  balance: TimeOffBalance;
  policy: TimeOffPolicy | undefined;
  className?: string;
  style?: CSSProperties;
}> = ({ balance, policy, className = "", style }) => (
  <Card className={className} style={style}>
    <CardContent className="p-4">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getTypeIcon(balance.type)}
            <h3 className="font-medium">{policy?.name || balance.type}</h3>
          </div>
          <Badge variant="outline" className="text-xs">
            {balance.remaining} left
          </Badge>
        </div>

        <div className="space-y-2">
          <div className="h-2 w-full rounded-full bg-gray-200">
            <div
              className="h-2 rounded-full bg-blue-600"
              style={{ width: `${(balance.used / balance.total) * 100}%` }}
            />
          </div>

          <div className="text-muted-foreground flex justify-between text-xs">
            <span>{balance.used} used</span>
            <span>{balance.total} total</span>
          </div>
        </div>

        {balance.carryOver > 0 && (
          <div className="flex items-center gap-1 text-xs text-green-600">
            <TrendingUp className="h-3 w-3" />
            <span>{balance.carryOver} carried over</span>
          </div>
        )}
      </div>
    </CardContent>
  </Card>
);

const RequestCard: FunctionComponent<{
  request: TimeOffRequest;
  className?: string;
  style?: CSSProperties;
}> = ({ request, className = "", style }) => (
  <Card
    className={`transition-shadow hover:shadow-md ${className}`}
    style={style}
  >
    <CardContent className="p-4">
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              {getTypeIcon(request.type)}
              <h3 className="font-medium capitalize">{request.type} Request</h3>
            </div>
            <p className="text-muted-foreground text-sm">
              {formatDate(request.startDate)} - {formatDate(request.endDate)}
            </p>
          </div>
          <Badge className={`${getStatusColor(request.status)} border`}>
            <div className="flex items-center gap-1">
              {getStatusIcon(request.status)}
              <span className="capitalize">{request.status}</span>
            </div>
          </Badge>
        </div>

        <p className="text-sm">{request.reason}</p>

        <div className="text-muted-foreground flex items-center justify-between text-xs">
          <span>
            {request.totalDays} day{request.totalDays !== 1 ? "s" : ""}
          </span>
          <span>Submitted {formatDate(request.submittedAt)}</span>
        </div>

        {request.comments && (
          <div className="bg-muted rounded p-2 text-xs">
            <strong>Manager:</strong> {request.comments}
          </div>
        )}
      </div>
    </CardContent>
  </Card>
);

const NewRequestDialog: FunctionComponent = () => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    type: "",
    startDate: "",
    endDate: "",
    reason: "",
    isHalfDay: false,
  });

  // Get today's date in YYYY-MM-DD format for min date
  const today = new Date().toISOString().split("T")[0];

  const handleStartDateChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      startDate: value,
      // Clear end date if it's before the new start date
      endDate: prev.endDate && prev.endDate < value ? "" : prev.endDate,
    }));
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    // Basic validation
    if (
      !formData.type ||
      !formData.startDate ||
      !formData.endDate ||
      !formData.reason.trim()
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (formData.endDate < formData.startDate) {
      toast.error("End date cannot be before start date");
      return;
    }

    // Handle form submission
    console.info("New request:", formData);
    toast.success("Time off request submitted successfully!");
    setOpen(false);
    // Reset form
    setFormData({
      type: "",
      startDate: "",
      endDate: "",
      reason: "",
      isHalfDay: false,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Request
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Request Time Off</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="type">Type of Leave *</Label>
            <Select
              value={formData.type}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, type: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select leave type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vacation">Vacation</SelectItem>
                <SelectItem value="sick">Sick Leave</SelectItem>
                <SelectItem value="personal">Personal Day</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date *</Label>
              <div
                className="relative cursor-pointer"
                onClick={() => {
                  const input = document.getElementById(
                    "startDate",
                  ) as HTMLInputElement;
                  if (input) {
                    input.focus();
                    input.click();
                    if (input.showPicker) {
                      input.showPicker();
                    }
                  }
                }}
              >
                <Input
                  id="startDate"
                  type="date"
                  min={today}
                  value={formData.startDate}
                  onChange={(e) => handleStartDateChange(e.target.value)}
                  className="w-full cursor-pointer"
                  onKeyDown={(e) => e.preventDefault()}
                  onFocus={(e) => {
                    if (e.target.showPicker) {
                      e.target.showPicker();
                    }
                  }}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date *</Label>
              <div
                className="relative cursor-pointer"
                onClick={() => {
                  const input = document.getElementById(
                    "endDate",
                  ) as HTMLInputElement;
                  if (input) {
                    input.focus();
                    input.click();
                    if (input.showPicker) {
                      input.showPicker();
                    }
                  }
                }}
              >
                <Input
                  id="endDate"
                  type="date"
                  min={formData.startDate || today}
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      endDate: e.target.value,
                    }))
                  }
                  className="w-full cursor-pointer"
                  onKeyDown={(e) => e.preventDefault()}
                  onFocus={(e) => {
                    if (e.target.showPicker) {
                      e.target.showPicker();
                    }
                  }}
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Reason *</Label>
            <Textarea
              id="reason"
              placeholder="Brief description of your time off..."
              value={formData.reason}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, reason: e.target.value }))
              }
              rows={3}
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Submit Request</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export const TimeOffPage: FunctionComponent = () => {
  const [filter, setFilter] = useState<string>("all");

  const filteredRequests = timeOffRequests.filter((request) => {
    if (filter === "all") return true;
    return request.status === filter;
  });

  const totalDaysUsed = userTimeOffBalance.reduce(
    (sum, balance) => sum + balance.used,
    0,
  );
  const totalDaysRemaining = userTimeOffBalance.reduce(
    (sum, balance) => sum + balance.remaining,
    0,
  );

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

          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div className="space-y-2">
              <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
                Time Off Management
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base">
                Submit vacation requests, check your balance, and manage time
                off
              </p>
            </div>
            <NewRequestDialog />
          </div>
        </PageSection>

        {/* Summary Stats */}
        <PageSection
          index={1}
          className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3"
        >
          <Card
            className="animate-in fade-in slide-in-from-bottom-4 duration-300"
            style={{ animationDelay: "100ms" }}
          >
            <CardContent className="p-4 text-center">
              <div className="text-primary text-2xl font-bold">
                {totalDaysRemaining}
              </div>
              <p className="text-muted-foreground text-sm">Days Remaining</p>
            </CardContent>
          </Card>
          <Card
            className="animate-in fade-in slide-in-from-bottom-4 duration-300"
            style={{ animationDelay: "200ms" }}
          >
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">
                {totalDaysUsed}
              </div>
              <p className="text-muted-foreground text-sm">Days Used</p>
            </CardContent>
          </Card>
          <Card
            className="animate-in fade-in slide-in-from-bottom-4 duration-300"
            style={{ animationDelay: "300ms" }}
          >
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {timeOffRequests.filter((r) => r.status === "pending").length}
              </div>
              <p className="text-muted-foreground text-sm">Pending Requests</p>
            </CardContent>
          </Card>
        </PageSection>

        <Tabs defaultValue="balance" className="space-y-6">
          <PageSection index={2}>
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="balance" className="gap-2">
                <CalendarDays className="hidden h-4 w-4 sm:inline" />
                Balance
              </TabsTrigger>
              <TabsTrigger value="requests" className="gap-2">
                <FileText className="hidden h-4 w-4 sm:inline" />
                Requests
              </TabsTrigger>
              <TabsTrigger value="policies" className="gap-2">
                <MapPin className="hidden h-4 w-4 sm:inline" />
                Policies
              </TabsTrigger>
            </TabsList>
          </PageSection>

          {/* Balance Tab */}
          <TabsContent value="balance" className="space-y-6">
            <PageSection index={3}>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                {userTimeOffBalance.map((balance, index) => {
                  const policy = timeOffPolicies.find(
                    (p) => p.type === balance.type,
                  );
                  return (
                    <BalanceCard
                      key={balance.type}
                      balance={balance}
                      policy={policy}
                      className="animate-in fade-in slide-in-from-bottom-4 duration-300"
                      style={{ animationDelay: `${(index + 1) * 100}ms` }}
                    />
                  );
                })}
              </div>
            </PageSection>
          </TabsContent>

          {/* Requests Tab */}
          <TabsContent value="requests" className="space-y-6">
            <PageSection index={4}>
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <h2 className="text-lg font-semibold">Your Requests</h2>
                <Select value={filter} onValueChange={setFilter}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Requests</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="denied">Denied</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {filteredRequests.map((request, index) => (
                  <RequestCard
                    key={request.id}
                    request={request}
                    className="animate-in fade-in slide-in-from-bottom-4 duration-300"
                    style={{ animationDelay: `${(index + 1) * 100}ms` }}
                  />
                ))}
              </div>
            </PageSection>

            {filteredRequests.length === 0 && (
              <PageSection index={5}>
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Calendar className="text-muted-foreground mb-4 h-12 w-12" />
                    <h3 className="mb-2 text-lg font-medium">
                      No requests found
                    </h3>
                    <p className="text-muted-foreground text-center">
                      {filter === "all"
                        ? "You haven't submitted any time off requests yet."
                        : `No ${filter} requests found.`}
                    </p>
                  </CardContent>
                </Card>
              </PageSection>
            )}
          </TabsContent>

          {/* Policies Tab */}
          <TabsContent value="policies" className="space-y-6">
            <PageSection index={6}>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {timeOffPolicies.map((policy, index) => (
                  <Card
                    key={policy.type}
                    className="animate-in fade-in slide-in-from-bottom-4 duration-300"
                    style={{ animationDelay: `${(index + 1) * 100}ms` }}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-3">
                        {getTypeIcon(policy.type)}
                        <CardTitle className="text-base">
                          {policy.name}
                        </CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-muted-foreground text-sm">
                        {policy.description}
                      </p>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="font-medium">Annual Allocation</p>
                          <p className="text-muted-foreground">
                            {policy.annualAllocation} days
                          </p>
                        </div>
                        <div>
                          <p className="font-medium">Carry Over</p>
                          <p className="text-muted-foreground">
                            {policy.carryOverLimit} days
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="font-medium">Requires Approval</p>
                          <p className="text-muted-foreground">
                            {policy.requiresApproval ? "Yes" : "No"}
                          </p>
                        </div>
                        <div>
                          <p className="font-medium">Notice Required</p>
                          <p className="text-muted-foreground">
                            {policy.advanceNoticeRequired > 0
                              ? `${policy.advanceNoticeRequired} days`
                              : "None"}
                          </p>
                        </div>
                      </div>
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

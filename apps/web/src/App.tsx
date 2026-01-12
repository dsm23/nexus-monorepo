import type { FunctionComponent } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import { TooltipProvider } from "~/components/ui/tooltip";
import { FloatingHelpButton } from "./components/FloatingHelpButton";
import { ScrollToTop } from "./components/ScrollToTop";
import { ThemeProvider } from "./components/ThemeProvider";
import { FocusModeProvider } from "./contexts/FocusModeContext";
import { AnalyticsPage } from "./pages/AnalyticsPage";
import { CalendarPage } from "./pages/CalendarPage";
import { CompanyAnnouncementsPage } from "./pages/CompanyAnnouncementsPage";
import { Dashboard } from "./pages/Dashboard";
import { EmployeeDirectoryPage } from "./pages/EmployeeDirectoryPage";
import { ForYouPage } from "./pages/ForYouPage";
import { HelpDeskPage } from "./pages/HelpDeskPage";
import { KudosFeedPage } from "./pages/KudosFeedPage";
import { ProjectsPage } from "./pages/ProjectsPage";
import { ResourcesPage } from "./pages/ResourcesPage";
import { TimeOffPage } from "./pages/TimeOffPage";

const AppRoutes: FunctionComponent = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/for-you" element={<ForYouPage />} />
      <Route path="/announcements" element={<CompanyAnnouncementsPage />} />
      <Route path="/kudos" element={<KudosFeedPage />} />
      <Route path="/employees" element={<EmployeeDirectoryPage />} />
      <Route path="/calendar" element={<CalendarPage />} />
      <Route path="/projects" element={<ProjectsPage />} />
      <Route path="/analytics" element={<AnalyticsPage />} />
      <Route path="/resources" element={<ResourcesPage />} />
      <Route path="/help-desk" element={<HelpDeskPage />} />
      <Route path="/time-off" element={<TimeOffPage />} />
    </Routes>
  );
};

const App: FunctionComponent = () => {
  return (
    <ThemeProvider defaultTheme="system" storageKey="nexus-ui-theme">
      <FocusModeProvider>
        <TooltipProvider>
          <BrowserRouter>
            <ScrollToTop />
            <AppRoutes />
            <FloatingHelpButton />
            <Toaster />
          </BrowserRouter>
        </TooltipProvider>
      </FocusModeProvider>
    </ThemeProvider>
  );
};

export default App;

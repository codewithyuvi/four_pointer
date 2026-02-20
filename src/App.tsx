import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "@/components/Navbar";
import LandingPage from "@/pages/LandingPage";
import OnboardingPage from "@/pages/OnboardingPage";
import InstructorDashboard from "@/pages/InstructorDashboard";
import StudentCheckIn from "@/pages/StudentCheckIn";
import StudentDashboard from "@/pages/StudentDashboard";
import AboutPage from "@/pages/AboutPage";
import ExplorerPage from "@/pages/ExplorerPage";
import SettingsPage from "@/pages/SettingsPage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="dark">
          <Navbar />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/onboarding" element={<OnboardingPage />} />
            <Route path="/instructor" element={<InstructorDashboard />} />
            <Route path="/check-in" element={<StudentCheckIn />} />
            <Route path="/student" element={<StudentDashboard />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/explorer" element={<ExplorerPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

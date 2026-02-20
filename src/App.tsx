import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import AllCategories from "./pages/AllCategories";
import CreateTask from "./pages/CreateTask";
import FindTasks from "./pages/FindTasks";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import StaticPage from "./pages/StaticPage";
import BlogIndex from "./pages/BlogIndex";
import BlogPost from "./pages/BlogPost";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/categories" element={<AllCategories />} />
              <Route path="/create-task" element={<CreateTask />} />
              <Route path="/tasks" element={<FindTasks />} />
              <Route path="/faq" element={<StaticPage titleKey="faq" />} />
              <Route path="/contact" element={<StaticPage titleKey="contact" />} />
              <Route path="/terms" element={<StaticPage titleKey="terms" />} />
              <Route path="/privacy" element={<StaticPage titleKey="privacy" />} />
              <Route path="/about" element={<StaticPage titleKey="about" />} />
              <Route path="/blog" element={<BlogIndex />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;

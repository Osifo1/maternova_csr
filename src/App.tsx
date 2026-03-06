import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "@/components/Layout";
import { AuthProvider } from "@/components/AuthDialog";
import Index from "./pages/Index";
import Articles from "./pages/Articles";
import ArticleDetail from "./pages/ArticleDetail";
import SymptomChecker from "./pages/SymptomChecker";
import Quiz from "./pages/Quiz";
import Community from "./pages/Community";
import Team from "./pages/Team";
import FAQ from "./pages/FAQ";
import PregnancyTracker from "./pages/PregnancyTracker";
import MaternalPreparation from "./pages/MaternalPreparation";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/articles" element={<Articles />} />
              <Route path="/articles/:id" element={<ArticleDetail />} />
              <Route path="/symptom-checker" element={<SymptomChecker />} />
              <Route path="/community" element={<Community />} />
              <Route path="/team" element={<Team />} />
              <Route path="/quiz" element={<Quiz />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/pregnancy-tracker" element={<PregnancyTracker />} />
              <Route path="/maternal-preparation" element={<MaternalPreparation />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

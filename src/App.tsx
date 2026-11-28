import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { LanguageProvider } from "@/i18n/LanguageContext";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { ChallengesProvider } from "./hooks/useChallenges";
import Header from "@/components/layout/Header";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import CanvasEditor from "./pages/CanvasEditor";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import Manual from "./pages/Manual";
import ProblemStatementGuide from "./pages/ProblemStatementGuide";
import Admin from './pages/Admin';
import Subscription from './pages/Subscription';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Refund from './pages/Refund';
import { PaymentTestModeBanner } from '@/components/PaymentTestModeBanner';
import { SupportWidget } from '@/components/support/SupportWidget';

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/auth" replace />;
  return <>{children}</>;
};

const AUTHENTICATED_PREFIXES = ['/dashboard', '/canvas/', '/subscription', '/manual', '/admin'];
const AuthenticatedSupport = () => {
  const { user, loading } = useAuth();
  const { pathname } = useLocation();
  if (loading || !user) return null;
  if (!AUTHENTICATED_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(prefix))) return null;
  return <SupportWidget />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <AuthProvider>
        <ChallengesProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Header />
              <PaymentTestModeBanner />
              <main>
                <Routes>
                  <Route path="/" element={<Landing />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                  <Route path="/subscription" element={<ProtectedRoute><Subscription /></ProtectedRoute>} />
                  <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
                  <Route path="/canvas/:id" element={<ProtectedRoute><CanvasEditor /></ProtectedRoute>} />
                  <Route path="/manual" element={<ProtectedRoute><Manual /></ProtectedRoute>} />
                  <Route path="/guides/problem-statement-template" element={<ProblemStatementGuide />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/privacy" element={<Privacy />} />
                  <Route path="/refund" element={<Refund />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <AuthenticatedSupport />
            </BrowserRouter>
          </TooltipProvider>
        </ChallengesProvider>
      </AuthProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;

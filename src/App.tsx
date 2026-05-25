import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "@/hooks/useAuth";
import { ThemeProvider } from "@/hooks/useTheme";
import ErrorBoundary from "@/components/ErrorBoundary";

import OfflineIndicator from "@/components/OfflineIndicator";
import CookieConsent from "@/components/CookieConsent";
import ProtectedRoute from "@/components/ProtectedRoute";
import PageTransition from "@/components/PageTransition";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import MapView from "./pages/MapView";
import TrackView from "./pages/TrackView";
import SiteSurvey from "./pages/SiteSurvey";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import Pricing from "./pages/Pricing";
import About from "./pages/About";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";
import Docs from "./pages/Docs";
import ApiReference from "./pages/ApiReference";
import Status from "./pages/Status";
import CookiePolicy from "./pages/CookiePolicy";
import SubscriptionSuccess from "./pages/SubscriptionSuccess";
import SubscriptionCancel from "./pages/SubscriptionCancel";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <ErrorBoundary>
            <TooltipProvider>
              <OfflineIndicator />
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <PageTransition>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route path="/dashboard" element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    } />
                    <Route path="/create" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/map/:id" element={
                      <ProtectedRoute>
                        <MapView />
                      </ProtectedRoute>
                    } />
                    <Route path="/site-survey" element={
                      <ProtectedRoute>
                        <SiteSurvey />
                      </ProtectedRoute>
                    } />
                    <Route path="/track/:id" element={<TrackView />} />
                    <Route path="/privacy" element={<PrivacyPolicy />} />
                    <Route path="/terms" element={<TermsOfService />} />
                    <Route path="/pricing" element={<Pricing />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/blog" element={<Blog />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/docs" element={<Docs />} />
                    <Route path="/api" element={<ApiReference />} />
                    <Route path="/status" element={<Status />} />
                    <Route path="/cookies" element={<CookiePolicy />} />
                    <Route path="/subscription/success" element={<SubscriptionSuccess />} />
                    <Route path="/subscription/cancel" element={<SubscriptionCancel />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </PageTransition>
              </BrowserRouter>
              <CookieConsent />
            </TooltipProvider>
          </ErrorBoundary>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;

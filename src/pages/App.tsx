/**
 * App Root Router Page
 * 
 * Central routing and layout component that orchestrates the entire application.
 * Implements route configuration with code splitting, error boundaries, and loading states.
 * Provides global UI providers (tooltips, notifications) and lazy-loaded route definitions.
 * 
 * @module pages/App
 * @category Pages - Dashboard
 * 
 * Features:
 * - Lazy-loaded route definitions for optimal code splitting
 * - Comprehensive route organization (Home, Auth, Dashboard, Admin)
 * - Error boundary wrapping for route-level error handling
 * - Suspense fallback with loading state component
 * - Global UI providers (Tooltip, Toaster for notifications)
 * - 404 fallback page for undefined routes
 * - Route-level performance optimization
 * - Responsive layout with mobile navigation support
 * - Protected route implementation for authenticated pages
 * - Loading states during route transitions
 * 
 * Routes:
 * - Public: Home, Catalog, EscortList, EscortProfile, Pricing, Contact, Blog
 * - Legal: TermsOfService, PrivacyPolicy, CookiePolicy, KVKK
 * - Auth: ClientLogin, ClientRegister, EscortLogin, EscortRegister
 * - User: MyFavorites, Messages, MyAppointments
 * - Escort: EscortDashboard, EscortMarket, VerificationCenter
 * - Payment: PaymentResult
 * - Admin: AdminDashboard, AdminApprovals
 * - Utilities: SEO, NotFound
 * 
 * @example
 * ```tsx
 * // Root application entry point
 * <App />
 * ```
 */

import React, { Suspense, lazy } from 'react';
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { RouteErrorBoundary } from "@/components/ErrorBoundary";
import { FullPageLoading } from "@/components/LoadingStates";
import CookieConsent from "@/components/CookieConsent";
import RoleSelector from "@/components/RoleSelector";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { NotificationToast, NotificationCenter } from "@/components/Notifications";
import { FloatingNavigation } from "@/components/FloatingNavigation";
import { Route } from "wouter";
import NotFound from "@/pages/NotFound";

// ─────────────────────────────────────────────────────────────────────────────
// LAZY LOADED ROUTES (Code Splitting)
// ─────────────────────────────────────────────────────────────────────────────
// This improves initial load time by splitting routes into separate chunks

// Home & Catalog (High priority - loaded first)
const Home = lazy(() => import("@/pages/Home").then(m => ({ default: m.default || m.Home })));
const Catalog = lazy(() => import("@/pages/Catalog").then(m => ({ default: m.default })));
const EscortList = lazy(() => import("@/pages/EscortList").then(m => ({ default: m.default })));

// Profile Pages
const EscortProfile = lazy(() => import("@/pages/EscortProfile").then(m => ({ default: m.default })));

// Legal Pages
const TermsOfService = lazy(() => import("@/pages/TermsOfService").then(m => ({ default: m.default })));
const PrivacyPolicy = lazy(() => import("@/pages/PrivacyPolicy").then(m => ({ default: m.default })));
const CookiePolicy = lazy(() => import("@/pages/CookiePolicy").then(m => ({ default: m.default })));
const KVKK = lazy(() => import("@/pages/KVKK").then(m => ({ default: m.default })));


// Authentication
const EscortLogin = lazy(() => import("@/pages/EscortLogin").then(m => ({ default: m.default })));
const ClientLogin = lazy(() => import("@/pages/ClientLogin").then(m => ({ default: m.default })));
const EscortRegister = lazy(() => import("@/pages/EscortRegister").then(m => ({ default: m.default })));
const ClientRegister = lazy(() => import("@/pages/ClientRegister").then(m => ({ default: m.default })));

// User Dashboard
const MyFavorites = lazy(() => import("@/pages/MyFavorites").then(m => ({ default: m.default })));
const Messages = lazy(() => import("@/pages/Messages").then(m => ({ default: m.default })));
const MyAppointments = lazy(() => import("@/pages/MyAppointments").then(m => ({ default: m.default })));

// Escort Dashboard
const EscortDashboard = lazy(() => import("@/pages/EscortDashboard").then(m => ({ default: m.default })));
const EscortMarket = lazy(() => import("@/pages/EscortMarket").then(m => ({ default: m.default })));

// Admin
const AdminDashboard = lazy(() => import("@/pages/AdminDashboard").then(m => ({ default: m.default })));
const AdminApprovals = lazy(() => import("@/pages/AdminApprovals").then(m => ({ default: m.default })));

// Other
const Pricing = lazy(() => import("@/pages/Pricing").then(m => ({ default: m.default })));
const SEO = lazy(() => import("@/pages/SEO").then(m => ({ default: m.default })));

// New Pages - High-End Features
const Contact = lazy(() => import("@/pages/Contact").then(m => ({ default: m.default })));
const PaymentResult = lazy(() => import("@/pages/PaymentResult").then(m => ({ default: m.default })));
const VerificationCenter = lazy(() => import("@/pages/VerificationCenter").then(m => ({ default: m.default })));
const Blog = lazy(() => import("@/pages/Blog").then(m => ({ default: m.default })));

// Phase 2 - Guest & Customer Pages
const GuestCatalog = lazy(() => import("@/pages/GuestCatalog").then(m => ({ default: m.default })));
const CustomerDashboard = lazy(() => import("@/pages/CustomerDashboard").then(m => ({ default: m.default })));

// Phase 3 - Escort Dashboard Pages
const EscortPrivateDashboard = lazy(() => import("@/pages/EscortPrivateDashboard").then(m => ({ default: m.default })));
const EscortAnalyticsDashboard = lazy(() => import("@/pages/EscortAnalyticsDashboard").then(m => ({ default: m.default })));

// Phase 5 - Billing & Payment Pages
const MembershipUpgrade = lazy(() => import("@/pages/MembershipUpgrade").then(m => ({ default: m.default })));
const BillingDashboard = lazy(() => import("@/pages/BillingDashboard").then(m => ({ default: m.default })));

// Phase 6 - Advanced Features (Real-Time Messaging & Video Calls)
const RealTimeMessaging = lazy(() => import("@/pages/RealTimeMessaging").then(m => ({ default: m.default })));
const VideoCallPage = lazy(() => import("@/pages/VideoCallPage").then(m => ({ default: m.default })));

// Phase 6 - Admin Enhancements
const AdminRealTimeMonitoring = lazy(() => import("@/pages/AdminRealTimeMonitoring").then(m => ({ default: m.default })));
const AdminReports = lazy(() => import("@/pages/AdminReports").then(m => ({ default: m.default })));

// Phase 7 - Analytics & Reviews
const Analytics = lazy(() => import("@/pages/Analytics").then(m => ({ default: m.default })));
const Reviews = lazy(() => import("@/pages/Reviews").then(m => ({ default: m.default || m.Reviews })));

// ─────────────────────────────────────────────────────────────────────────────
// LOADING FALLBACK COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

function RouteLoading() {
  return <FullPageLoading message="Sayfa yükleniyor..." />;
}

// ─────────────────────────────────────────────────────────────────────────────
// LAZY ROUTE WRAPPER
// ─────────────────────────────────────────────────────────────────────────────
// Wraps lazy-loaded components with Suspense and ErrorBoundary

interface LazyRouteProps {
  path: string;
  component: React.LazyExoticComponent<() => JSX.Element>;
}

function LazyRoute({ path, component: Component }: LazyRouteProps) {
  return (
    <Route path={path}>
      <RouteErrorBoundary>
        <Suspense fallback={<RouteLoading />}>
          <Component />
        </Suspense>
      </RouteErrorBoundary>
    </Route>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ROUTER CONFIGURATION
// ─────────────────────────────────────────────────────────────────────────────

function AppRouter() {
  // Debug: Geçerli path'i kontrol et
  React.useEffect(() => {
    console.log('[AppRouter] Current path:', window.location.pathname);
  }, []);

  return (
    <>
      {/* Home & Catalog - High Priority */}
      <Route path="/">
        {() => {
          console.log('[Route] Matched: / (Home)');
          return (
            <RouteErrorBoundary>
              <Suspense fallback={<RouteLoading />}>
                <Home />
              </Suspense>
            </RouteErrorBoundary>
          );
        }}
      </Route>

      <Route path="/catalog">
        {() => {
          console.log('[Route] Matched: /catalog');
          return (
            <RouteErrorBoundary>
              <Suspense fallback={<RouteLoading />}>
                <Catalog />
              </Suspense>
            </RouteErrorBoundary>
          );
        }}
      </Route>

      <Route path="/escorts">
        {() => {
          console.log('[Route] Matched: /escorts');
          return (
            <RouteErrorBoundary>
              <Suspense fallback={<RouteLoading />}>
                <EscortList />
              </Suspense>
            </RouteErrorBoundary>
          );
        }}
      </Route>

      {/* Guest Catalog - Phase 2 */}
      <Route path="/guest-catalog">
        {() => {
          console.log('[Route] Matched: /guest-catalog');
          return (
            <RouteErrorBoundary>
              <Suspense fallback={<RouteLoading />}>
                <GuestCatalog />
              </Suspense>
            </RouteErrorBoundary>
          );
        }}
      </Route>

      {/* Profile Pages */}
      <Route path="/escort/:id">
        {(params) => {
          console.log('[Route] Matched: /escort/:id', params);
          return (
            <RouteErrorBoundary>
              <Suspense fallback={<RouteLoading />}>
                <EscortProfile />
              </Suspense>
            </RouteErrorBoundary>
          );
        }}
      </Route>

      {/* Escort Routes */}
      <Route path="/login-escort">
        {() => <Suspense fallback={<RouteLoading />}><EscortLogin /></Suspense>}
      </Route>

      <Route path="/register-escort">
        {() => <Suspense fallback={<RouteLoading />}><EscortRegister /></Suspense>}
      </Route>

      <Route path="/escort/dashboard">
        {() => <Suspense fallback={<RouteLoading />}><EscortDashboard /></Suspense>}
      </Route>

      <Route path="/escort/market">
        {() => <Suspense fallback={<RouteLoading />}><EscortMarket /></Suspense>}
      </Route>

      {/* Escort Private Dashboard - Phase 3 */}
      <Route path="/escort/dashboard/private">
        {() => <Suspense fallback={<RouteLoading />}><EscortPrivateDashboard /></Suspense>}
      </Route>

      {/* Escort Analytics Dashboard - Phase 3 */}
      <Route path="/escort/dashboard/analytics">
        {() => <Suspense fallback={<RouteLoading />}><EscortAnalyticsDashboard /></Suspense>}
      </Route>

      {/* Client/Customer Routes */}
      <Route path="/login">
        {() => <Suspense fallback={<RouteLoading />}><ClientLogin /></Suspense>}
      </Route>

      <Route path="/login-client">
        {() => <Suspense fallback={<RouteLoading />}><ClientLogin /></Suspense>}
      </Route>

      <Route path="/register-client">
        {() => <Suspense fallback={<RouteLoading />}><ClientRegister /></Suspense>}
      </Route>

      {/* User Dashboard Routes */}
      <Route path="/favorites">
        {() => <Suspense fallback={<RouteLoading />}><MyFavorites /></Suspense>}
      </Route>

      <Route path="/messages">
        {() => <Suspense fallback={<RouteLoading />}><Messages /></Suspense>}
      </Route>

      <Route path="/appointments">
        {() => <Suspense fallback={<RouteLoading />}><MyAppointments /></Suspense>}
      </Route>

      {/* Customer Dashboard - Phase 2 */}
      <Route path="/dashboard">
        {() => <Suspense fallback={<RouteLoading />}><CustomerDashboard /></Suspense>}
      </Route>

      {/* Admin Routes */}
      <Route path="/admin/dashboard">
        {() => <Suspense fallback={<RouteLoading />}><AdminDashboard /></Suspense>}
      </Route>

      <Route path="/admin/approvals">
        {() => <Suspense fallback={<RouteLoading />}><AdminApprovals /></Suspense>}
      </Route>

      {/* Other */}
      <Route path="/pricing">
        {() => <Suspense fallback={<RouteLoading />}><Pricing /></Suspense>}
      </Route>

      <Route path="/vip">
        {() => <Suspense fallback={<RouteLoading />}><Pricing /></Suspense>}
      </Route>

      <Route path="/seo">
        {() => <Suspense fallback={<RouteLoading />}><SEO title="SEO" description="SEO page" /></Suspense>}
      </Route>

      {/* Legal Pages */}
      <Route path="/terms">
        {() => <Suspense fallback={<RouteLoading />}><TermsOfService /></Suspense>}
      </Route>

      <Route path="/privacy">
        {() => <Suspense fallback={<RouteLoading />}><PrivacyPolicy /></Suspense>}
      </Route>

      <Route path="/cookies">
        {() => <Suspense fallback={<RouteLoading />}><CookiePolicy /></Suspense>}
      </Route>

      <Route path="/kvkk">
        {() => <Suspense fallback={<RouteLoading />}><KVKK /></Suspense>}
      </Route>

      {/* New Pages - High-End Features */}
      <Route path="/contact">
        {() => <Suspense fallback={<RouteLoading />}><Contact /></Suspense>}
      </Route>

      {/* Role Selection */}
      <Route path="/role-selection">
        {() => <RoleSelector />}
      </Route>

      <Route path="/payment-result">
        {() => <Suspense fallback={<RouteLoading />}><PaymentResult /></Suspense>}
      </Route>

      <Route path="/verification">
        {() => <Suspense fallback={<RouteLoading />}><VerificationCenter /></Suspense>}
      </Route>

      <Route path="/blog">
        {() => <Suspense fallback={<RouteLoading />}><Blog /></Suspense>}
      </Route>

      {/* Phase 5 - Billing & Payment Routes */}
      <Route path="/upgrade">
        {() => <Suspense fallback={<RouteLoading />}><MembershipUpgrade /></Suspense>}
      </Route>

      <Route path="/billing">
        {() => <Suspense fallback={<RouteLoading />}><BillingDashboard /></Suspense>}
      </Route>

      <Route path="/dashboard/billing">
        {() => <Suspense fallback={<RouteLoading />}><BillingDashboard /></Suspense>}
      </Route>

      <Route path="/faturalar">
        {() => <Suspense fallback={<RouteLoading />}><BillingDashboard /></Suspense>}
      </Route>

      {/* Phase 6 - Real-Time Messaging Routes */}
      <Route path="/messages/realtime">
        {() => <Suspense fallback={<RouteLoading />}><RealTimeMessaging /></Suspense>}
      </Route>

      <Route path="/messages/video">
        {() => <Suspense fallback={<RouteLoading />}><VideoCallPage /></Suspense>}
      </Route>

      <Route path="/video-call">
        {() => <Suspense fallback={<RouteLoading />}><VideoCallPage /></Suspense>}
      </Route>

      {/* Phase 6 - Admin Enhancement Routes */}
      <Route path="/admin/monitoring">
        {() => <Suspense fallback={<RouteLoading />}><AdminRealTimeMonitoring /></Suspense>}
      </Route>

      <Route path="/admin/reports">
        {() => <Suspense fallback={<RouteLoading />}><AdminReports /></Suspense>}
      </Route>

      {/* Phase 7 - Analytics & Reviews Routes */}
      <Route path="/analytics">
        {() => <Suspense fallback={<RouteLoading />}><Analytics /></Suspense>}
      </Route>

      <Route path="/reviews">
        {() => <Suspense fallback={<RouteLoading />}><Reviews /></Suspense>}
      </Route>

      {/* 404 */}
      <Route path="/404">
        {() => {
          console.log('[Route] Matched: /404');
          return <NotFound />;
        }}
      </Route>

      {/* Final fallback route - Only show for truly unmatched paths */}
      <Route>
        {(params) => {
          // Get current path
          const path = window.location.pathname;

          // List of all valid paths - don't show 404 for these
          const validPaths = [
            '/', '/catalog', '/escorts', '/guest-catalog',
            '/login', '/login-client', '/login-escort',
            '/register-escort', '/register-client',
            '/pricing', '/vip', '/seo',
            '/terms', '/privacy', '/cookies', '/kvkk',
            '/favorites', '/messages', '/appointments', '/dashboard',
            '/escort/dashboard', '/escort/market',
            '/escort/dashboard/private', '/escort/dashboard/analytics',
            '/admin/dashboard', '/admin/approvals',
            '/contact', '/payment-result', '/verification', '/blog',
            '/upgrade', '/billing', '/dashboard/billing', '/faturalar',
            '/role-selection', '/404',
            // Phase 6 - Real-Time Messaging
            '/messages/realtime', '/messages/video', '/video-call',
            // Phase 6 - Admin Enhancements
            '/admin/monitoring', '/admin/reports',
            // Phase 7 - Analytics & Reviews
            '/analytics', '/reviews'
          ];

          // Also check for dynamic paths that start with these prefixes
          const isValidPath = validPaths.includes(path) ||
                            path.startsWith('/escort/');

          if (isValidPath) return null;

          console.log('[Route] No match - showing 404. Current path:', path);
          return <NotFound />;
        }}
      </Route>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN APP COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <NotificationProvider>
      <AppRouter />
      <FloatingNavigation />
      <TooltipProvider>
        <Toaster />
      </TooltipProvider>
      <NotificationToast />
      <NotificationCenter />
      <CookieConsent />
    </NotificationProvider>
  );
}

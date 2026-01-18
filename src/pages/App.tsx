import React, { Suspense, lazy } from 'react';
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { RouteErrorBoundary } from "@/components/ErrorBoundary";
import { FullPageLoading } from "@/components/LoadingStates";
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
        {() => <Suspense fallback={<RouteLoading />}><SEO /></Suspense>}
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
            '/', '/catalog', '/escorts',
            '/login', '/login-client', '/login-escort',
            '/register-escort', '/register-client',
            '/pricing', '/vip', '/seo',
            '/favorites', '/messages', '/appointments',
            '/escort/dashboard', '/escort/market',
            '/admin/dashboard', '/admin/approvals',
            '/404'
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
    <>
      <AppRouter />
      <TooltipProvider>
        <Toaster />
      </TooltipProvider>
    </>
  );
}

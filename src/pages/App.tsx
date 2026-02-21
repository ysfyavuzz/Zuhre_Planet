/**
 * App Root Router Page
 */

import React, { Suspense, lazy } from 'react';
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { FullPageLoading } from "@/components/LoadingStates";
import CookieConsent from "@/components/CookieConsent";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { NotificationToast, NotificationCenter } from "@/components/Notifications";
import { FloatingNavigation } from "@/components/FloatingNavigation";
import { Route, Switch, useLocation } from "wouter";
import NotFound from "@/pages/NotFound";
import { StarryBackground } from "@/components/StarryBackground";
import { SpaceBackground } from "@/components/SpaceBackground";

// LAZY LOADED ROUTES
const Home = lazy(() => import("@/pages/Home"));
const Catalog = lazy(() => import("@/pages/Catalog"));
const EscortList = lazy(() => import("@/pages/EscortList"));
const EscortProfile = lazy(() => import("@/pages/EscortProfile"));
const Login = lazy(() => import("@/pages/Login"));
const CustomerDashboard = lazy(() => import("@/pages/customer/CustomerDashboard"));
const EscortDashboard = lazy(() => import("@/pages/dashboard/EscortDashboard"));
const AdminDashboard = lazy(() => import("@/pages/AdminDashboard"));

function RouteLoading() {
  return <FullPageLoading message="Sayfa yükleniyor..." />;
}

function AppRouter() {
  return (
    <Suspense fallback={<RouteLoading />}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/catalog" component={Catalog} />
        <Route path="/escorts" component={EscortList} />
        <Route path="/escort/:id" component={EscortProfile} />
        <Route path="/login" component={Login} />
        <Route path="/dashboard" component={CustomerDashboard} />
        <Route path="/escort/dashboard" component={EscortDashboard} />
        <Route path="/admin/dashboard" component={AdminDashboard} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

export default function App() {
  const [location] = useLocation();
  const isHomePage = location === "/";

  return (
    <NotificationProvider>
      <TooltipProvider>
        <div className="min-h-screen bg-[#010103] font-sans antialiased relative selection:bg-primary/30 text-foreground transition-colors duration-500 overflow-x-hidden">

          {/* 1. KATMAN: 3D EVREN (En Arka) */}
          <div className="fixed inset-0 z-0 pointer-events-none">
            {isHomePage ? <SpaceBackground /> : <StarryBackground />}
          </div>

          {/* 2. KATMAN: UI (Ön Plan) */}
          <div className="relative z-10 min-h-screen flex flex-col pointer-events-none">
            <main className={`flex-grow ${isHomePage ? 'pointer-events-none' : 'pointer-events-auto'}`}>
              <AppRouter />
            </main>

            {/* Çerez Barı - En Üstte ve Tıklanabilir */}
            <div className="fixed bottom-0 left-0 right-0 z-[9999] pointer-events-none">
              <div className="pointer-events-auto">
                <CookieConsent />
              </div>
            </div>

            {/* Navigasyon ve Bildirimler */}
            <div className={`relative z-50 ${isHomePage ? 'pointer-events-none' : 'pointer-events-auto'}`}>
              {!isHomePage && <FloatingNavigation />}
              <NotificationCenter />
              <NotificationToast />
              <Toaster position="top-right" />
            </div>
          </div>

        </div>
      </TooltipProvider>
    </NotificationProvider>
  );
}

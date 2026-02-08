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
import { Header } from "@/components/Header";
import { Route, Switch } from "wouter";
import NotFound from "@/pages/NotFound";
import { SpaceBackground } from "@/components/SpaceBackground";

// LAZY LOADED ROUTES
const Home = lazy(() => import("@/pages/Home"));
const Catalog = lazy(() => import("@/pages/Catalog"));
const EscortList = lazy(() => import("@/pages/EscortList"));
const EscortProfile = lazy(() => import("@/pages/EscortProfile"));
const TermsOfService = lazy(() => import("@/pages/TermsOfService"));
const PrivacyPolicy = lazy(() => import("@/pages/PrivacyPolicy"));
const CookiePolicy = lazy(() => import("@/pages/CookiePolicy"));
const KVKK = lazy(() => import("@/pages/KVKK"));
const Safety = lazy(() => import("@/pages/Safety"));
const EscortLogin = lazy(() => import("@/pages/EscortLogin"));
const ClientLogin = lazy(() => import("@/pages/ClientLogin"));
const EscortRegister = lazy(() => import("@/pages/EscortRegister"));
const ClientRegister = lazy(() => import("@/pages/ClientRegister"));
const MyFavorites = lazy(() => import("@/pages/MyFavorites"));
const Messages = lazy(() => import("@/pages/Messages"));
const MyAppointments = lazy(() => import("@/pages/MyAppointments"));
const EscortDashboard = lazy(() => import("@/pages/EscortDashboard"));
const EscortMarket = lazy(() => import("@/pages/EscortMarket"));
const AdminDashboard = lazy(() => import("@/pages/AdminDashboard"));
const AdminApprovals = lazy(() => import("@/pages/AdminApprovals"));
const AdminListings = lazy(() => import("@/pages/AdminListings"));
const AdminMedia = lazy(() => import("@/pages/AdminMedia"));
const AdminFinancial = lazy(() => import("@/pages/AdminFinancial"));
const AdminMessages = lazy(() => import("@/pages/AdminMessages"));
const AdminAnalytics = lazy(() => import("@/pages/AdminAnalytics"));
const AdminSecurity = lazy(() => import("@/pages/AdminSecurity"));
const AdminNotifications = lazy(() => import("@/pages/AdminNotifications"));
const AdminSettings = lazy(() => import("@/pages/AdminSettings"));
const AdminUsers = lazy(() => import("@/pages/AdminUsers"));
const Pricing = lazy(() => import("@/pages/Pricing"));
const Contact = lazy(() => import("@/pages/Contact"));
const PaymentResult = lazy(() => import("@/pages/PaymentResult"));
const VerificationCenter = lazy(() => import("@/pages/VerificationCenter"));
const Blog = lazy(() => import("@/pages/Blog"));
const GuestCatalog = lazy(() => import("@/pages/GuestCatalog"));
const CustomerDashboard = lazy(() => import("@/pages/CustomerDashboard"));
const EscortPrivateDashboard = lazy(() => import("@/pages/EscortPrivateDashboard"));
const EscortAnalyticsDashboard = lazy(() => import("@/pages/EscortAnalyticsDashboard"));
const MembershipUpgrade = lazy(() => import("@/pages/MembershipUpgrade"));
const BillingDashboard = lazy(() => import("@/pages/BillingDashboard"));
const RealTimeMessaging = lazy(() => import("@/pages/RealTimeMessaging"));
const VideoCallPage = lazy(() => import("@/pages/VideoCallPage"));
const AdminRealTimeMonitoring = lazy(() => import("@/pages/AdminRealTimeMonitoring"));
const AdminReports = lazy(() => import("@/pages/AdminReports"));
const Analytics = lazy(() => import("@/pages/Analytics"));
const Reviews = lazy(() => import("@/pages/Reviews"));
const Login = lazy(() => import("@/pages/Login"));
const AdminPanel = lazy(() => import("@/pages/AdminPanel"));
const AdminComplaints = lazy(() => import("@/pages/AdminComplaints"));
const CustomerSettings = lazy(() => import("@/pages/customer/CustomerSettings"));
const About = lazy(() => import("@/pages/general/About"));
const FAQ = lazy(() => import("@/pages/general/FAQ"));
const HowItWorks = lazy(() => import("@/pages/general/HowItWorks"));
const SupportPage = lazy(() => import("@/pages/general/Support"));
const EscortProfileEdit = lazy(() => import("@/pages/escort/ProfileEdit"));
const EscortPhotos = lazy(() => import("@/pages/escort/PhotoManager"));
const EscortCalendar = lazy(() => import("@/pages/escort/CalendarManager"));
const EscortEarnings = lazy(() => import("@/pages/escort/EarningsReport"));
const CustomerNotifications = lazy(() => import("@/pages/customer/Notifications"));
const CustomerHistory = lazy(() => import("@/pages/customer/History"));
const CustomerWallet = lazy(() => import("@/pages/customer/Wallet"));
const ReportPage = lazy(() => import("@/pages/Report"));

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
        <Route path="/guest-catalog" component={GuestCatalog} />
        <Route path="/escort/:id" component={EscortProfile} />
        
        {/* Auth */}
        <Route path="/login" component={Login} />
        <Route path="/login-escort" component={EscortLogin} />
        <Route path="/login-customer" component={ClientLogin} />
        <Route path="/register-escort" component={EscortRegister} />
        <Route path="/register-client" component={ClientRegister} />
        <Route path="/register" component={ClientRegister} />
        <Route path="/signup" component={ClientRegister} />

        {/* Dashboards */}
        <Route path="/dashboard" component={CustomerDashboard} />
        <Route path="/favorites" component={MyFavorites} />
        <Route path="/messages" component={Messages} />
        <Route path="/appointments" component={MyAppointments} />
        
        {/* Escort Panel */}
        <Route path="/escort/dashboard" component={EscortDashboard} />
        <Route path="/escort/market" component={EscortMarket} />
        <Route path="/escort/dashboard/private" component={EscortPrivateDashboard} />
        <Route path="/escort/dashboard/analytics" component={EscortAnalyticsDashboard} />
        <Route path="/escort/profile/edit" component={EscortProfileEdit} />
        <Route path="/escort/photos" component={EscortPhotos} />
        <Route path="/escort/calendar" component={EscortCalendar} />
        <Route path="/escort/earnings" component={EscortEarnings} />

        {/* Admin Panel */}
        <Route path="/admin/dashboard" component={AdminDashboard} />
        <Route path="/admin/approvals" component={AdminApprovals} />
        <Route path="/admin/panel" component={AdminPanel} />
        <Route path="/admin/listings" component={AdminListings} />
        <Route path="/admin/media" component={AdminMedia} />
        <Route path="/admin/financial" component={AdminFinancial} />
        <Route path="/admin/messages" component={AdminMessages} />
        <Route path="/admin/analytics" component={AdminAnalytics} />
        <Route path="/admin/security" component={AdminSecurity} />
        <Route path="/admin/notifications" component={AdminNotifications} />
        <Route path="/admin/settings" component={AdminSettings} />
        <Route path="/admin/users" component={AdminUsers} />
        <Route path="/admin/complaints" component={AdminComplaints} />
        <Route path="/admin/real-time" component={AdminRealTimeMonitoring} />
        <Route path="/admin/reports" component={AdminReports} />

        {/* Customer Panel */}
        <Route path="/customer/settings" component={CustomerSettings} />
        <Route path="/customer/notifications" component={CustomerNotifications} />
        <Route path="/customer/history" component={CustomerHistory} />
        <Route path="/customer/wallet" component={CustomerWallet} />

        {/* General */}
        <Route path="/terms" component={TermsOfService} />
        <Route path="/privacy" component={PrivacyPolicy} />
        <Route path="/cookies" component={CookiePolicy} />
        <Route path="/kvkk" component={KVKK} />
        <Route path="/safety" component={Safety} />
        <Route path="/pricing" component={Pricing} />
        <Route path="/contact" component={Contact} />
        <Route path="/blog" component={Blog} />
        <Route path="/about" component={About} />
        <Route path="/faq" component={FAQ} />
        <Route path="/how-it-works" component={HowItWorks} />
        <Route path="/support" component={SupportPage} />
        <Route path="/report" component={ReportPage} />
        <Route path="/verification" component={VerificationCenter} />

        {/* Payment */}
        <Route path="/payment/result" component={PaymentResult} />
        <Route path="/membership/upgrade" component={MembershipUpgrade} />
        <Route path="/billing" component={BillingDashboard} />

        {/* Advanced */}
        <Route path="/real-time-messaging" component={RealTimeMessaging} />
        <Route path="/video-call" component={VideoCallPage} />
        <Route path="/analytics-page" component={Analytics} />
        <Route path="/reviews" component={Reviews} />

        {/* 404 */}
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

import { AdSpace } from "@/components/AdSpace";

export default function App() {
  return (
    <NotificationProvider>
      <TooltipProvider>
        <div className="min-h-screen bg-background font-sans antialiased relative selection:bg-primary/30">
          <SpaceBackground />
          <AdSpace position="left" />
          <AdSpace position="right" />
          <Header />
          <main className="pb-20 md:pb-0">
            <AppRouter />
          </main>
          <FloatingNavigation />
          <NotificationCenter />
          <NotificationToast />
          <CookieConsent />
          <Toaster position="top-right" />
        </div>
      </TooltipProvider>
    </NotificationProvider>
  );
}

"use client";

import React, { useState, useEffect, useCallback } from "react";
import LoginScreen from "@/components/screens/LoginScreen";
import AdminSidebar from "@/components/layout/AdminSidebar";
import DashboardOverview from "@/components/screens/DashboardOverview";
import VerificationRequests from "@/components/screens/VerificationRequests";
import DocumentVerificationDetail from "@/components/screens/DocumentVerificationDetail";
import ReportsAndFlags from "@/components/screens/ReportsAndFlags";
import UserManagement from "@/components/screens/UserManagement";
import AnalyticsScreen from "@/components/screens/AnalyticsScreen";
import AdminManagement from "@/components/screens/AdminManagement";
import AuditLogsScreen from "@/components/screens/AuditLogsScreen";
import CategoryManagement from "@/components/screens/CategoryManagement";
import SkillManagement from "@/components/screens/SkillManagement";
import {
  Menu,
  Bell,
  Search,
  CheckCircle,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
  RotateCw,
} from "lucide-react";
import NirbhorLogo from "@/components/branding/NirbhorLogo";
import { adminService } from "@/lib/adminService";
import { getAccessToken, getCurrentUserData, clearAuthSession } from "@/lib/auth";

export default function App() {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);

  // Active view tab state: "dashboard", "verifications", "review_document", "reports", "users", "analytics"
  const [activeTab, setActiveTab] = useState("dashboard");

  // Mobile sidebar drawer state
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Application Data States (Purely loaded from Live API)
  const [stats, setStats] = useState({
    pendingVerifications: 0,
    flaggedProfiles: 0,
    totalProviders: "0",
    totalBookings: "0",
    totalUsers: "0",
    totalSeekers: "0",
    activeToday: 0,
  });
  const [verifications, setVerifications] = useState([]);
  const [reports, setReports] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("all");
  const [toastNotification, setToastNotification] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const userRole = (currentUser?.role || "").toLowerCase().replace(/[\s_-]/g, "");
  const isSuperAdmin = userRole === "superadmin";

  // Protect Super Admin views from unauthorized regular admin access
  useEffect(() => {
    if (
      isAuthenticated &&
      !isSuperAdmin &&
      (activeTab === "admin_management" || activeTab === "audit_logs")
    ) {
      setActiveTab("dashboard");
    }
  }, [isAuthenticated, isSuperAdmin, activeTab]);

  const showToast = (message) => {
    setToastNotification(message);
    setTimeout(() => {
      setToastNotification(null);
    }, 3500);
  };

  // Restore authenticated session on initial mount
  useEffect(() => {
    const token = getAccessToken();
    if (token) {
      const savedUser = getCurrentUserData();
      if (savedUser) {
        setCurrentUser({
          name: savedUser.name || savedUser.name_en || "Administrator",
          role: savedUser.role?.toUpperCase() || "ADMIN",
          phone: savedUser.phone || "",
          user_id: savedUser.user_id,
        });
        setIsAuthenticated(true);
      }

      // Verify token freshness with /users/me
      adminService
        .getCurrentUser()
        .then((profile) => {
          setCurrentUser({
            name: profile.name || profile.name_en || "Administrator",
            role: profile.role?.toUpperCase() || "ADMIN",
            phone: profile.phone || "",
            user_id: profile.user_id,
          });
          setIsAuthenticated(true);
        })
        .catch(() => {
          // Token expired or invalid
          clearAuthSession();
          setIsAuthenticated(false);
          setCurrentUser(null);
        })
        .finally(() => {
          setIsInitializing(false);
        });
    } else {
      setIsInitializing(false);
    }
  }, []);

  // Centralized live data fetcher (always fresh, no cache, purely API)
  const fetchDashboardData = useCallback(async () => {
    if (!isAuthenticated) return;
    setIsRefreshing(true);

    try {
      // 1. Dashboard summary counts
      const dashPromise = adminService.getDashboard().catch(() => null);
      // 2. Pending verifications
      const verifPromise = adminService.getPendingVerifications(1, 20).catch(() => null);
      // 3. Reports
      const reportsPromise = adminService.getReports(null, 1, 20).catch(() => null);

      const [dashData, verifData, reportsData] = await Promise.all([
        dashPromise,
        verifPromise,
        reportsPromise,
      ]);

      if (dashData) {
        setStats({
          pendingVerifications: dashData.pending_verifications ?? 0,
          flaggedProfiles: dashData.pending_reports ?? 0,
          totalProviders: dashData.total_providers != null ? dashData.total_providers.toLocaleString() : "0",
          totalBookings: dashData.total_bookings != null ? dashData.total_bookings.toLocaleString() : "0",
          totalUsers: dashData.total_users != null ? dashData.total_users.toLocaleString() : "0",
          totalSeekers: dashData.total_seekers != null ? dashData.total_seekers.toLocaleString() : "0",
          activeToday: dashData.active_providers_today ?? 0,
        });
      }

      if (verifData) {
        setVerifications(Array.isArray(verifData.items) ? verifData.items : []);
      }

      if (reportsData) {
        setReports(Array.isArray(reportsData.items) ? reportsData.items : []);
      }
    } finally {
      setIsRefreshing(false);
    }
  }, [isAuthenticated]);

  // Fetch fresh data when authenticated or activeTab changes
  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboardData();
    }
  }, [isAuthenticated, activeTab, fetchDashboardData]);

  // Login handler
  const handleLoginSuccess = (userData) => {
    setCurrentUser(userData);
    setIsAuthenticated(true);
    setActiveTab("dashboard");
    showToast(`Welcome back, ${userData.name}!`);
  };

  // Logout handler
  const handleLogout = async () => {
    await adminService.logout();
    setIsAuthenticated(false);
    setCurrentUser(null);
    showToast("Signed out successfully.");
  };

  // Review worker document handler (navigates to Document Verification screen)
  const handleReviewWorker = (worker) => {
    setSelectedWorker(worker);
    setActiveTab("review_document");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Approve worker
  const handleApproveWorker = async (workerId) => {
    try {
      if (typeof workerId === "string" && workerId.includes("-") && workerId.length > 20) {
        await adminService.handleVerification(workerId, "approved");
      }
      setVerifications((prev) =>
        prev.map((item) =>
          (item.user_id || item.id) === workerId ? { ...item, status: "APPROVED", verification_status: "approved" } : item
        )
      );
      setStats((prev) => ({
        ...prev,
        approvedToday: (prev.approvedToday || 0) + 1,
        pendingVerifications: Math.max(0, (prev.pendingVerifications || 1) - 1)
      }));
      showToast("Provider credentials approved and verified successfully!");
      fetchDashboardData();
      setActiveTab("verifications");
    } catch (e) {
      showToast(e.message || "Failed to approve provider verification.");
    }
  };

  // Reject worker
  const handleRejectWorker = async (workerId, reason) => {
    try {
      if (typeof workerId === "string" && workerId.includes("-") && workerId.length > 20) {
        await adminService.handleVerification(workerId, "rejected", reason);
      }
      setVerifications((prev) =>
        prev.map((item) =>
          (item.user_id || item.id) === workerId
            ? { ...item, status: "REJECTED", verification_status: "rejected", rejectionReason: reason }
            : item
        )
      );
      setStats((prev) => ({
        ...prev,
        pendingVerifications: Math.max(0, (prev.pendingVerifications || 1) - 1)
      }));
      showToast(`Application rejected. Reason recorded: "${reason}"`);
      fetchDashboardData();
      setActiveTab("verifications");
    } catch (e) {
      showToast(e.message || "Failed to reject provider verification.");
    }
  };

  // 1. Initial State: While checking session
  if (isInitializing) {
    return (
      <div className="min-h-screen bg-[#f4f7f5] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-[#16654e]/30 border-t-[#16654e] rounded-full animate-spin" />
          <span className="text-xs font-semibold text-gray-500">Checking credentials...</span>
        </div>
      </div>
    );
  }

  // 2. Not logged in: render Login Screen
  if (!isAuthenticated) {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  }

  // 3. Authenticated Admin Dashboard Layout
  return (
    <div className="min-h-screen bg-[#f8faf9] flex flex-col antialiased">
      {/* Toast Notification */}
      {toastNotification && (
        <div className="fixed bottom-6 right-6 z-50 bg-gray-900 text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-2xl border border-gray-700 flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastNotification}</span>
        </div>
      )}

      {/* Sidebar (Desktop fixed left, Mobile drawer) */}
      <AdminSidebar
        activeTab={activeTab === "review_document" ? "verifications" : activeTab}
        setActiveTab={setActiveTab}
        stats={stats}
        currentUser={currentUser}
        onLogout={handleLogout}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* Main Content Area */}
      <div className="lg:pl-64 flex-1 flex flex-col">
        {/* Top Navigation Bar */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-200/80 px-4 sm:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setIsMobileOpen(true)}
              className="p-2 -ml-2 rounded-xl text-gray-600 hover:bg-gray-100 lg:hidden cursor-pointer"
              aria-label="Open Navigation Menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Breadcrumb / Screen Title */}
            <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
              <span className="font-semibold text-gray-800">Nirbhor Admin</span>
              <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
              <span className="capitalize text-[#16654e] font-semibold">
                {activeTab === "review_document"
                  ? "Document Verification"
                  : activeTab === "admin_management"
                  ? "Admin Management"
                  : activeTab === "audit_logs"
                  ? "Audit Logs"
                  : activeTab === "categories"
                  ? "Category Management"
                  : activeTab === "skills"
                  ? "Skill Management"
                  : activeTab.replace("_", " ")}
              </span>
            </div>
          </div>

          {/* Right Header: Notification Icon & Live Sync */}
          <div className="flex items-center gap-3">
            <button
              onClick={fetchDashboardData}
              disabled={isRefreshing}
              className="p-2 text-gray-500 hover:text-[#16654e] hover:bg-emerald-50 rounded-xl transition cursor-pointer disabled:opacity-40"
              title="Sync Live Data (No-Cache)"
              aria-label="Sync Live Data"
            >
              <RotateCw className={`w-4 h-4 ${isRefreshing ? "animate-spin text-[#16654e]" : ""}`} />
            </button>

            <button
              onClick={() => showToast("All system queues operating normally.")}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl relative transition cursor-pointer"
              title="Notifications"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full"></span>
            </button>
          </div>
        </header>

        {/* View Routing / Screen Rendering */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          {activeTab === "dashboard" && (
            <DashboardOverview
              stats={stats}
              verifications={verifications}
              reports={reports}
              onReviewWorker={handleReviewWorker}
              onNavigateTab={(tab) => setActiveTab(tab)}
              onRefresh={fetchDashboardData}
              isLoading={isRefreshing}
            />
          )}

          {activeTab === "verifications" && (
            <VerificationRequests
              verifications={verifications}
              stats={stats}
              onReviewDocuments={handleReviewWorker}
              onRefresh={fetchDashboardData}
            />
          )}

          {activeTab === "review_document" && (
            <DocumentVerificationDetail
              worker={selectedWorker}
              onBack={() => setActiveTab("verifications")}
              onApprove={handleApproveWorker}
              onReject={handleRejectWorker}
            />
          )}

          {activeTab === "categories" && (
            <CategoryManagement
              onNavigateToSkills={(catId) => {
                setSelectedCategoryFilter(catId);
                setActiveTab("skills");
              }}
            />
          )}

          {activeTab === "skills" && (
            <SkillManagement initialCategoryFilter={selectedCategoryFilter} />
          )}

          {activeTab === "reports" && (
            <ReportsAndFlags
              reports={reports}
              setReports={setReports}
              onRefresh={fetchDashboardData}
              isLoading={isRefreshing}
            />
          )}

          {activeTab === "users" && <UserManagement />}

          {activeTab === "analytics" && <AnalyticsScreen />}

          {isSuperAdmin && activeTab === "admin_management" && (
            <AdminManagement admins={admins} setAdmins={setAdmins} />
          )}

          {isSuperAdmin && activeTab === "audit_logs" && <AuditLogsScreen />}
        </main>
      </div>
    </div>
  );
}

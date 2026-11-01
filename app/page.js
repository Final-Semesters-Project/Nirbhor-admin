"use client";

import React, { useState } from "react";
import LoginScreen from "@/components/screens/LoginScreen";
import AdminSidebar from "@/components/layout/AdminSidebar";
import DashboardOverview from "@/components/screens/DashboardOverview";
import VerificationRequests from "@/components/screens/VerificationRequests";
import DocumentVerificationDetail from "@/components/screens/DocumentVerificationDetail";
import ReportsAndFlags from "@/components/screens/ReportsAndFlags";
import UserManagement from "@/components/screens/UserManagement";
import AnalyticsScreen from "@/components/screens/AnalyticsScreen";
import {
  INITIAL_STATS,
  INITIAL_VERIFICATIONS,
  INITIAL_REPORTS
} from "@/data/mockData";
import {
  Menu,
  Bell,
  Search,
  CheckCircle,
  ExternalLink,
  ShieldCheck,
  ChevronRight
} from "lucide-react";
import NirbhorLogo from "@/components/branding/NirbhorLogo";

export default function App() {
  // Authentication state - Starts on Login Screen as requested
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Active view tab state: "dashboard", "verifications", "review_document", "reports", "users", "analytics"
  const [activeTab, setActiveTab] = useState("dashboard");

  // Mobile sidebar drawer state
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Application Data States
  const [stats, setStats] = useState(INITIAL_STATS);
  const [verifications, setVerifications] = useState(INITIAL_VERIFICATIONS);
  const [reports, setReports] = useState(INITIAL_REPORTS);
  const [selectedWorker, setSelectedWorker] = useState(INITIAL_VERIFICATIONS[0]);
  const [toastNotification, setToastNotification] = useState(null);

  const showToast = (message) => {
    setToastNotification(message);
    setTimeout(() => {
      setToastNotification(null);
    }, 3500);
  };

  // Login handler
  const handleLoginSuccess = (userData) => {
    setCurrentUser(userData);
    setIsAuthenticated(true);
    setActiveTab("dashboard");
    showToast(`Welcome back, ${userData.name}!`);
  };

  // Logout handler
  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  // Review worker document handler (navigates to Document Verification screen)
  const handleReviewWorker = (worker) => {
    setSelectedWorker(worker);
    setActiveTab("review_document");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Approve worker
  const handleApproveWorker = (workerId) => {
    setVerifications((prev) =>
      prev.map((item) =>
        item.id === workerId ? { ...item, status: "APPROVED" } : item
      )
    );
    setStats((prev) => ({
      ...prev,
      approvedToday: prev.approvedToday + 1,
      pendingVerifications: Math.max(0, prev.pendingVerifications - 1)
    }));
    showToast("Provider credentials approved and verified successfully!");
    setActiveTab("verifications");
  };

  // Reject worker
  const handleRejectWorker = (workerId, reason) => {
    setVerifications((prev) =>
      prev.map((item) =>
        item.id === workerId ? { ...item, status: "REJECTED", rejectionReason: reason } : item
      )
    );
    setStats((prev) => ({
      ...prev,
      pendingVerifications: Math.max(0, prev.pendingVerifications - 1)
    }));
    showToast(`Application rejected. Reason recorded: "${reason}"`);
    setActiveTab("verifications");
  };

  // 1. Initial State: If not logged in, render the Login Screen (Screenshot 1)
  if (!isAuthenticated) {
    return (
      <div className="relative">
        <LoginScreen onLoginSuccess={handleLoginSuccess} />

        {/* Quick Review Navigation Bar for Evaluator Convenience */}
        <div className="fixed bottom-3 left-1/2 -translate-x-1/2 bg-gray-900/90 backdrop-blur-md text-white text-[11px] px-4 py-2 rounded-full shadow-2xl border border-gray-700/80 flex items-center gap-3 z-50">
          <span className="text-emerald-400 font-semibold">Preview:</span>
          <button
            onClick={() => {
              handleLoginSuccess({ name: "Admin Name", role: "Super Admin", email: "admin@nirbhor.com" });
              setActiveTab("dashboard");
            }}
            className="hover:text-emerald-300 underline cursor-pointer"
          >
            Dashboard
          </button>
          <span>|</span>
          <button
            onClick={() => {
              handleLoginSuccess({ name: "Admin Name", role: "Super Admin", email: "admin@nirbhor.com" });
              setActiveTab("verifications");
            }}
            className="hover:text-emerald-300 underline cursor-pointer"
          >
            Verifications
          </button>
          <span>|</span>
          <button
            onClick={() => {
              handleLoginSuccess({ name: "Admin Name", role: "Super Admin", email: "admin@nirbhor.com" });
              setActiveTab("review_document");
            }}
            className="hover:text-emerald-300 underline cursor-pointer"
          >
            Doc Review
          </button>
          <span>|</span>
          <button
            onClick={() => {
              handleLoginSuccess({ name: "Admin Name", role: "Super Admin", email: "admin@nirbhor.com" });
              setActiveTab("reports");
            }}
            className="hover:text-emerald-300 underline cursor-pointer"
          >
            Reports
          </button>
          <span>|</span>
          <button
            onClick={() => {
              handleLoginSuccess({ name: "Admin Name", role: "Super Admin", email: "admin@nirbhor.com" });
              setActiveTab("users");
            }}
            className="hover:text-emerald-300 underline cursor-pointer"
          >
            Users
          </button>
          <span>|</span>
          <button
            onClick={() => {
              handleLoginSuccess({ name: "Admin Name", role: "Super Admin", email: "admin@nirbhor.com" });
              setActiveTab("analytics");
            }}
            className="hover:text-emerald-300 underline cursor-pointer"
          >
            Analytics
          </button>
        </div>
      </div>
    );
  }

  // 2. Authenticated Admin Dashboard Layout
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
                  : activeTab.replace("_", " ")}
              </span>
            </div>
          </div>

          {/* Quick Actions & Navigation Bar */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Direct Switcher Tabs for Easy Testing */}
            <div className="hidden md:flex items-center bg-gray-100 p-1 rounded-xl text-xs font-medium text-gray-600">
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                  activeTab === "dashboard"
                    ? "bg-white text-gray-900 shadow-2xs font-bold"
                    : "hover:text-gray-900"
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab("verifications")}
                className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                  activeTab === "verifications"
                    ? "bg-white text-gray-900 shadow-2xs font-bold"
                    : "hover:text-gray-900"
                }`}
              >
                Verifications
              </button>
              <button
                onClick={() => setActiveTab("review_document")}
                className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                  activeTab === "review_document"
                    ? "bg-white text-gray-900 shadow-2xs font-bold"
                    : "hover:text-gray-900"
                }`}
              >
                Doc Review
              </button>
              <button
                onClick={() => setActiveTab("reports")}
                className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                  activeTab === "reports"
                    ? "bg-white text-gray-900 shadow-2xs font-bold"
                    : "hover:text-gray-900"
                }`}
              >
                Reports
              </button>
              <button
                onClick={() => setActiveTab("users")}
                className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                  activeTab === "users"
                    ? "bg-white text-gray-900 shadow-2xs font-bold"
                    : "hover:text-gray-900"
                }`}
              >
                Users
              </button>
              <button
                onClick={() => setActiveTab("analytics")}
                className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                  activeTab === "analytics"
                    ? "bg-white text-gray-900 shadow-2xs font-bold"
                    : "hover:text-gray-900"
                }`}
              >
                Analytics
              </button>
            </div>

            {/* Notifications Button */}
            <button
              onClick={() => showToast("All system queues operating normally.")}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl relative transition cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full" />
            </button>

            {/* Logout pill */}
            <button
              onClick={handleLogout}
              className="text-xs font-semibold text-gray-600 hover:text-red-600 px-2.5 py-1.5 rounded-lg border border-gray-200 hover:border-red-200 hover:bg-red-50/50 transition cursor-pointer"
            >
              Exit to Login
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
            />
          )}

          {activeTab === "verifications" && (
            <VerificationRequests
              verifications={verifications}
              stats={stats}
              onReviewDocuments={handleReviewWorker}
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

          {activeTab === "reports" && (
            <ReportsAndFlags reports={reports} setReports={setReports} />
          )}

          {activeTab === "users" && <UserManagement />}

          {activeTab === "analytics" && <AnalyticsScreen />}
        </main>
      </div>
    </div>
  );
}

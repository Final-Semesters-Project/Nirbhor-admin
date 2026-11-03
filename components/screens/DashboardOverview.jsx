"use client";

import React, { useState } from "react";
import {
  Clock,
  Flag,
  Wrench,
  Calendar,
  AlertTriangle,
  UserX,
  CreditCard,
  CheckCircle,
  ExternalLink,
  ChevronRight,
  RotateCw,
  RotateCcw,
  AlertCircle,
} from "lucide-react";

// Helper to format timestamps into relative time in English
const formatTimeAgo = (dateStr) => {
  if (!dateStr) return "Submitted recently";
  try {
    const diffMs = Date.now() - new Date(dateStr).getTime();
    if (isNaN(diffMs) || diffMs < 0) return "Submitted recently";
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) {
      const m = Math.max(1, diffMins);
      return `Submitted ${m}m ago`;
    }
    if (diffHours < 24) {
      return `Submitted ${diffHours}h ago`;
    }
    return `Submitted ${diffDays}d ago`;
  } catch {
    return "Submitted recently";
  }
};

// Helper to map report reasons into clean English
const formatReportReason = (reason) => {
  if (!reason) return "Safety concern";
  const r = reason.toLowerCase();
  if (r.includes("incomplete")) return "Incomplete work";
  if (r.includes("late")) return "Late arrival";
  if (r.includes("fake") || r.includes("identity")) return "Fake identity";
  if (r.includes("payment") || r.includes("money") || r.includes("dispute")) return "Payment dispute";
  if (r.includes("harass")) return "Harassment";
  if (r.includes("fraud")) return "Fraud";
  return reason;
};

export default function DashboardOverview({
  stats,
  verifications,
  reports,
  currentUser,
  isSuperAdmin,
  onReviewWorker,
  onNavigateTab,
  onRefresh,
  isLoading
}) {
  // Purely dynamic Verification items from live API (no static mock data)
  const displayVerifications = Array.isArray(verifications)
    ? verifications.slice(0, 5).map((v) => {
      const id = v.user_id || v.id;
      const name = v.name || "Provider";
      const initials =
        name
          .replace(/[^a-zA-Z\s]/g, "")
          .trim()
          .split(/\s+/)
          .map((n) => n[0])
          .join("")
          .slice(0, 2)
          .toUpperCase() || "PR";

      const time = v.submitted_at
        ? formatTimeAgo(v.submitted_at)
        : (v.submittedTime || "Recently");

      return {
        id,
        initials,
        name,
        time,
        level: v.verification_level
          ? `Level ${v.verification_level === "verified" ? "2" : "1"}`
          : (v.level || "Level 2"),
        category: v.category || v.phone || "Service Provider",
        raw: v,
      };
    })
    : [];

  // Purely dynamic Reports items from live API (no static mock data)
  const displayReports = Array.isArray(reports)
    ? reports.slice(0, 5).map((r) => {
      const id = r.report_id || r.id;
      const name = r.reported_user_name || r.reportedUser || "Reported User";
      const issue = formatReportReason(r.reason);
      const reasonLower = (r.reason || "").toLowerCase();

      let icon = AlertTriangle;
      let color = "text-amber-600 bg-amber-50";

      if (reasonLower.includes("late")) {
        icon = Clock;
        color = "text-rose-600 bg-rose-50";
      } else if (reasonLower.includes("fake") || reasonLower.includes("identity")) {
        icon = UserX;
        color = "text-rose-600 bg-rose-50";
      } else if (reasonLower.includes("payment") || reasonLower.includes("money")) {
        icon = CreditCard;
        color = "text-rose-600 bg-rose-50";
      }

      return {
        id,
        type: "warning",
        icon,
        color,
        name,
        issue,
        raw: r,
      };
    })
    : [];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            System status and real-time administrative metrics
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="inline-flex items-center gap-2 px-3.5 py-2 border border-emerald-200 rounded-xl bg-emerald-50/70 hover:bg-emerald-100/70 text-xs font-semibold text-[#16654e] shadow-2xs transition cursor-pointer disabled:opacity-50"
              title="Refresh Live Data"
            >
              <RotateCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
              <span>{isLoading ? "Refreshing..." : "Refresh"}</span>
            </button>
          )}
        </div>
      </div>

      {/* Role-Specific Executive Welcome Banner */}
      {isSuperAdmin ? (
        <div className="bg-gradient-to-r from-[#146356] via-[#11574b] to-[#0c4339] rounded-2xl p-5 text-white shadow-md border border-emerald-600/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-emerald-100 text-[10px] font-extrabold uppercase tracking-wider border border-white/20">
                Super Administrator
              </span>
              <span className="text-xs text-emerald-100/90 font-medium">Welcome, {currentUser?.name || "Super Admin"}</span>
            </div>
            <h2 className="text-lg font-bold mt-1 text-white">Platform Governance & Security Center</h2>
            <p className="text-xs text-emerald-100/80 mt-0.5 max-w-2xl">
              Oversee the administrative staff, audit system logs, and inspect platform verification and moderation pipelines.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => onNavigateTab("admin_management")}
              className="px-3.5 py-2 rounded-xl bg-white text-[#146356] font-bold text-xs hover:bg-emerald-50 transition shadow-sm cursor-pointer"
            >
              Manage Admin Team
            </button>
            <button
              onClick={() => onNavigateTab("audit_logs")}
              className="px-3.5 py-2 rounded-xl bg-white/20 text-white font-bold text-xs hover:bg-white/30 transition border border-white/20 cursor-pointer"
            >
              Audit Logs
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-[#146356] via-[#10564a] to-[#0c473c] rounded-2xl p-5 text-white shadow-md border border-emerald-700/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-emerald-100 text-[10px] font-extrabold uppercase tracking-wider border border-white/20">
                Operations Admin
              </span>
              <span className="text-xs text-emerald-100 font-medium">Welcome, {currentUser?.name || "Admin"}</span>
            </div>
            <h2 className="text-lg font-bold mt-1 text-white">Operations & Service Catalog Center</h2>
            <p className="text-xs text-emerald-100/90 mt-0.5 max-w-2xl">
              Verify provider credentials, resolve community reports, and manage categories and skills available on Nirbhor.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => onNavigateTab("verifications")}
              className="px-3.5 py-2 rounded-xl bg-white text-[#146356] font-bold text-xs hover:bg-emerald-50 transition shadow-sm cursor-pointer"
            >
              Verifications
            </button>
            <button
              onClick={() => onNavigateTab("categories")}
              className="px-3.5 py-2 rounded-xl bg-white/20 text-white font-bold text-xs hover:bg-white/30 transition border border-white/20 cursor-pointer"
            >
              Categories
            </button>
            <button
              onClick={() => onNavigateTab("skills")}
              className="px-3.5 py-2 rounded-xl bg-white/20 text-white font-bold text-xs hover:bg-white/30 transition border border-white/20 cursor-pointer"
            >
              Skills
            </button>
          </div>
        </div>
      )}

      {/* KPI 4-Card Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Pending Verifications */}
        <div
          onClick={() => onNavigateTab("verifications")}
          className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-1.5 text-amber-600">
              <Clock className="w-5 h-5" />
              <span className="text-xs font-semibold uppercase tracking-wider">
                pending_actions
              </span>
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200/60">
              PENDING
            </span>
          </div>
          <div className="text-3xl font-extrabold text-gray-900 mb-1 tracking-tight">
            {stats.pendingVerifications}
          </div>
          <p className="text-xs font-medium text-gray-500">
            Pending Verifications
          </p>
        </div>

        {/* Card 2: Flagged Profiles */}
        <div
          onClick={() => onNavigateTab("reports")}
          className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-1.5 text-rose-600">
              <Flag className="w-5 h-5" />
              <span className="text-xs font-semibold uppercase tracking-wider">
                flag
              </span>
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200/60">
              URGENT
            </span>
          </div>
          <div className="text-3xl font-extrabold text-gray-900 mb-1 tracking-tight">
            {stats.flaggedProfiles}
          </div>
          <p className="text-xs font-medium text-gray-500">
            Flagged Profiles
          </p>
        </div>

        {/* Card 3: Total Providers */}
        <div
          onClick={() => onNavigateTab("users")}
          className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-1.5 text-teal-600">
              <Wrench className="w-5 h-5" />
              <span className="text-xs font-semibold uppercase tracking-wider">
                engineering
              </span>
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200/60">
              GROWTH
            </span>
          </div>
          <div className="text-3xl font-extrabold text-gray-900 mb-1 tracking-tight">
            {stats.totalProviders}
          </div>
          <p className="text-xs font-medium text-gray-500">
            Total Providers
          </p>
        </div>

        {/* Card 4: Total Bookings */}
        <div
          onClick={() => onNavigateTab("analytics")}
          className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-1.5 text-slate-600">
              <Calendar className="w-5 h-5" />
              <span className="text-xs font-semibold uppercase tracking-wider">
                calendar_month
              </span>
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
              ACTIVITY
            </span>
          </div>
          <div className="text-3xl font-extrabold text-gray-900 mb-1 tracking-tight">
            {stats.totalBookings}
          </div>
          <p className="text-xs font-medium text-gray-500">
            Total Bookings
          </p>
        </div>
      </div>

      {/* Middle Row: Recent Verification Requests & Recent Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Recent Verification Requests */}
        <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <h2 className="text-base font-bold text-gray-900">
                Recent Verification Requests
              </h2>
              <button
                onClick={() => onNavigateTab("verifications")}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg transition cursor-pointer"
                title="View full queue"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {displayVerifications.length === 0 ? (
              <div className="py-10 flex flex-col items-center justify-center text-center px-4">
                <div className="w-10 h-10 rounded-full bg-emerald-50 text-[#16654e] flex items-center justify-center mb-2">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-semibold text-gray-800">
                  No Pending Verifications
                </h3>
                <p className="text-xs text-gray-500 mt-0.5 max-w-xs">
                  All provider verification submissions have been reviewed.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100 mt-2">
                {displayVerifications.map((item) => (
                  <div
                    key={item.id}
                    className="py-3.5 flex items-center justify-between gap-3 hover:bg-gray-50/70 px-2 rounded-xl transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gray-100 text-gray-700 font-bold text-xs flex items-center justify-center border border-gray-200 shrink-0">
                        {item.initials}
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 leading-tight">
                          {item.name}
                        </h4>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {item.time}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        const worker = item.raw || verifications.find((v) => (v.user_id || v.id) === item.id) || item;
                        onReviewWorker(worker);
                      }}
                      className="px-3.5 py-1.5 text-xs font-medium border border-gray-300 rounded-lg hover:border-[#16654e] hover:text-[#16654e] hover:bg-emerald-50/40 text-gray-700 transition cursor-pointer shrink-0"
                    >
                      Review
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-gray-100 text-right">
            <button
              onClick={() => onNavigateTab("verifications")}
              className="text-xs font-semibold text-[#16654e] hover:underline inline-flex items-center gap-1 cursor-pointer"
            >
              <span>View full verification queue</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Column: Recent Reports */}
        <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <h2 className="text-base font-bold text-gray-900">
                Recent Reports
              </h2>
              <div className="text-rose-500 p-1">
                <AlertCircle className="w-4 h-4" />
              </div>
            </div>

            {displayReports.length === 0 ? (
              <div className="py-10 flex flex-col items-center justify-center text-center px-4">
                <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-semibold text-gray-800">
                  No Active Reports
                </h3>
                <p className="text-xs text-gray-500 mt-0.5 max-w-xs">
                  There are currently no open user reports or safety flags.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100 mt-2">
                {displayReports.map((report) => {
                  const Icon = report.icon || AlertTriangle;
                  return (
                    <div
                      key={report.id}
                      className="py-3.5 flex items-center justify-between gap-3 hover:bg-gray-50/70 px-2 rounded-xl transition"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${report.color || "text-rose-600 bg-rose-50"}`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-gray-900 leading-tight">
                            {report.name}
                          </h4>
                          <p className="text-xs text-rose-500 mt-0.5 font-medium">
                            {report.issue}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => onNavigateTab("reports")}
                        className="px-3.5 py-1.5 text-xs font-medium border border-gray-300 rounded-lg hover:border-gray-400 hover:bg-gray-100 text-gray-700 transition cursor-pointer shrink-0"
                      >
                        View
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-gray-100 text-right">
            <button
              onClick={() => onNavigateTab("reports")}
              className="text-xs font-semibold text-[#16654e] hover:underline inline-flex items-center gap-1 cursor-pointer"
            >
              <span>Manage safety & reports</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


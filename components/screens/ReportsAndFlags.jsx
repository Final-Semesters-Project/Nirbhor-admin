"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  RotateCw,
  AlertTriangle,
  Clock,
  User,
  CheckCircle,
  FileSearch,
  Slash,
  Search,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
} from "lucide-react";
import { adminService } from "@/lib/adminService";

// Helper to format timestamps into relative time in English
const formatReportTime = (dateStr) => {
  if (!dateStr) return "Recently";
  try {
    const diffMs = Date.now() - new Date(dateStr).getTime();
    if (isNaN(diffMs) || diffMs < 0) return "Recently";
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${Math.max(1, diffMins)}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "Recently";
  }
};

export default function ReportsAndFlags({
  reports: initialReports,
  setReports,
  onRefresh,
}) {
  const [items, setItems] = useState(initialReports || []);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [activeModalData, setActiveModalData] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const pageSize = 10;

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Fetch reports directly from API (/api/v1/admin/reports)
  const fetchReports = useCallback(async (page = 1) => {
    setIsLoading(true);
    try {
      const data = await adminService.getReports(null, page, pageSize);
      const list = Array.isArray(data)
        ? data
        : Array.isArray(data?.items)
        ? data.items
        : [];

      setItems(list);
      if (setReports) {
        setReports(list);
      }

      const total =
        typeof data?.total === "number" ? data.total : list.length;
      setTotalCount(total);
      setTotalPages(
        typeof data?.total_pages === "number" && data.total_pages > 0
          ? data.total_pages
          : Math.max(1, Math.ceil(total / pageSize))
      );
    } catch (err) {
      console.warn("Could not fetch live reports:", err);
    } finally {
      setIsLoading(false);
    }
  }, [pageSize, setReports]);

  // Initial fetch and fetch on page change
  useEffect(() => {
    fetchReports(currentPage);
  }, [currentPage, fetchReports]);

  // Sync if prop updates from parent
  useEffect(() => {
    if (Array.isArray(initialReports) && initialReports.length > 0) {
      setItems(initialReports);
    }
  }, [initialReports]);

  // Handle dismiss report
  const handleDismiss = async (id) => {
    setIsProcessing(true);
    try {
      if (id && id.includes("-") && id.length > 20) {
        await adminService.handleReport(id, "reviewed", "Dismissed by admin.");
      }
      setItems((prev) =>
        prev.map((r) =>
          (r.report_id || r.id) === id ? { ...r, status: "reviewed" } : r
        )
      );
      if (setReports) {
        setReports((prev) =>
          prev.map((r) =>
            (r.report_id || r.id) === id ? { ...r, status: "reviewed" } : r
          )
        );
      }
      showToast("Report marked as reviewed and dismissed.");
      if (onRefresh) onRefresh();
    } catch (e) {
      showToast(e.message || "Failed to dismiss report.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle suspend account
  const handleSuspend = async (report) => {
    const userName = report.reported_user_name || report.reportedUser || "User";
    const reportId = report.report_id || report.id;
    if (confirm(`Are you sure you want to suspend account for ${userName}?`)) {
      setIsProcessing(true);
      try {
        if (reportId && reportId.includes("-") && reportId.length > 20) {
          await adminService.handleReport(
            reportId,
            "action_taken",
            "Suspended by admin."
          );
        }
        setItems((prev) =>
          prev.map((r) =>
            (r.report_id || r.id) === reportId
              ? { ...r, status: "action_taken", suspended: true }
              : r
          )
        );
        if (setReports) {
          setReports((prev) =>
            prev.map((r) =>
              (r.report_id || r.id) === reportId
                ? { ...r, status: "action_taken", suspended: true }
                : r
            )
          );
        }
        showToast(`Account for ${userName} has been suspended.`);
        if (onRefresh) onRefresh();
      } catch (e) {
        showToast(e.message || "Failed to suspend user.");
      } finally {
        setIsProcessing(false);
      }
    }
  };

  // Normalize reports from API schema
  const normalizedReports = (items || []).map((r) => {
    const id = r.report_id || r.id;
    const reportedUser =
      r.reported_user_name || r.reportedUser || "Reported Member";
    const userRole = (r.reported_user_role || r.userRole || "USER").toUpperCase();
    const reason = r.reason || "Policy violation";
    const description =
      r.description || `Report filed regarding issue: ${reason}`;
    const reportedBy = r.reporter_name || r.reportedBy || "Platform Member";
    const bookingId = r.booking_id || r.bookingId || "N/A";
    const status = (r.status || "PENDING").toLowerCase();
    const timeAgo = formatReportTime(r.created_at || r.submitted_at);

    const isHigh =
      r.riskType === "high" ||
      reason.toLowerCase().includes("fraud") ||
      reason.toLowerCase().includes("danger") ||
      reason.toLowerCase().includes("threat") ||
      reason.toLowerCase().includes("harass") ||
      reason.toLowerCase().includes("fake");

    const riskType = isHigh ? "high" : "medium";
    const avatar =
      r.avatar ||
      r.photo_url ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(
        reportedUser
      )}&background=16654e&color=fff&size=128`;

    return {
      ...r,
      id,
      report_id: id,
      reportedUser,
      userRole,
      reason,
      description,
      reportedBy,
      bookingId,
      status,
      timeAgo,
      riskType,
      avatar,
      suspended: status === "action_taken" || Boolean(r.suspended),
    };
  });

  // Client-side search query filtering
  const filteredReports = normalizedReports.filter((item) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.reportedUser.toLowerCase().includes(q) ||
      item.reportedBy.toLowerCase().includes(q) ||
      item.reason.toLowerCase().includes(q) ||
      item.bookingId.toLowerCase().includes(q) ||
      item.userRole.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-gray-900 text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-xl border border-gray-700 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Reports & Flags
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Review and manage reported issues to maintain community safety.
          </p>
        </div>

        {/* Action Controls: Search & Refresh */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search reports, users, booking..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#16654e]"
            />
          </div>

          <button
            onClick={() => {
              fetchReports(currentPage);
              if (onRefresh) onRefresh();
            }}
            disabled={isLoading || isProcessing}
            className="p-2 border border-gray-200 rounded-xl bg-white hover:bg-gray-50 text-gray-600 transition cursor-pointer shadow-2xs disabled:opacity-50"
            title="Refresh reports"
          >
            <RotateCw
              className={`w-4 h-4 ${isLoading ? "animate-spin text-[#16654e]" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* Reports Feed List */}
      <div className="space-y-4">
        {filteredReports.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200/80 p-12 text-center flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
              <CheckCircle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-gray-800">
              No Reports Found
            </h3>
            <p className="text-xs text-gray-500 mt-1 max-w-sm">
              There are currently no reported members or safety flags.
            </p>
          </div>
        ) : (
          filteredReports.map((report) => (
            <div
              key={report.id}
              className={`bg-white rounded-2xl border p-6 shadow-xs transition-all relative ${
                report.suspended
                  ? "opacity-60 border-gray-300 bg-gray-50/50"
                  : report.riskType === "high"
                  ? "border-gray-200/90 hover:border-red-300"
                  : "border-gray-200/90 hover:border-gray-300"
              }`}
            >
              {/* Top row with user info and risk badge */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <img
                    src={report.avatar}
                    alt={report.reportedUser}
                    className="w-12 h-12 rounded-xl object-cover border border-gray-200"
                  />
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base font-bold text-gray-900">
                        {report.reportedUser}
                      </h3>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-gray-200 text-gray-700">
                        {report.userRole}
                      </span>
                      <span className="text-xs text-gray-400">
                        • {report.timeAgo}
                      </span>
                    </div>

                    {/* Reason Line */}
                    <div className="flex items-center gap-1.5 mt-1 text-xs font-semibold text-gray-700">
                      <span className="text-red-500">⚠</span>
                      <span>Reason: {report.reason}</span>
                      {report.suspended && (
                        <span className="ml-2 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-red-100 text-red-700">
                          Account Suspended
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* High Risk Badge */}
                {report.riskType === "high" && !report.suspended && (
                  <div className="self-start">
                    <span className="inline-block text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded bg-[#b91c1c] text-white shadow-xs">
                      HIGH RISK
                    </span>
                  </div>
                )}
              </div>

              {/* Description Box */}
              <div className="bg-[#fcfdfd] border border-gray-200/90 rounded-xl p-4 my-3 text-sm text-gray-700 italic font-normal leading-relaxed">
                &quot;{report.description}&quot;
              </div>

              {/* Metadata Line */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 mb-4">
                <span>
                  Reported by:{" "}
                  <span className="font-semibold text-gray-700">
                    {report.reportedBy}
                  </span>
                </span>
                <span>•</span>
                <span className="font-mono">
                  Booking ID:{" "}
                  <span className="font-bold text-gray-700">
                    #{report.bookingId}
                  </span>
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                {/* View Context Button */}
                <button
                  onClick={() =>
                    setActiveModalData({
                      title: "Report & Booking Details",
                      bookingId: report.bookingId,
                      reportedUser: report.reportedUser,
                      reportedBy: report.reportedBy,
                      userRole: report.userRole,
                      reason: report.reason,
                      description: report.description,
                      status: report.status,
                      timeAgo: report.timeAgo,
                    })
                  }
                  className="px-4 py-2 border border-gray-300 hover:border-gray-400 bg-white hover:bg-gray-50 rounded-xl text-xs font-semibold text-gray-800 transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <FileSearch className="w-3.5 h-3.5 text-gray-600" />
                  <span>View Details</span>
                </button>

                {/* Suspend Account Button */}
                {!report.suspended && (
                  <button
                    onClick={() => handleSuspend(report)}
                    disabled={isProcessing}
                    className="px-4 py-2 bg-[#b91c1c] hover:bg-[#991b1b] text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs disabled:opacity-50"
                  >
                    <Slash className="w-3.5 h-3.5" />
                    <span>Suspend Account</span>
                  </button>
                )}

                {/* Dismiss Button */}
                {report.status !== "reviewed" &&
                  report.status !== "action_taken" && (
                    <button
                      onClick={() =>
                        handleDismiss(report.id || report.report_id)
                      }
                      disabled={isProcessing}
                      className="px-3.5 py-2 text-xs font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition cursor-pointer disabled:opacity-50"
                    >
                      Dismiss
                    </button>
                  )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination Footer */}
      {filteredReports.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200/80 py-3.5 px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-gray-500 shadow-xs">
          <div>
            Showing {filteredReports.length} of {totalCount || filteredReports.length}{" "}
            reports
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage <= 1 || isLoading}
              className="p-1.5 rounded-md hover:bg-gray-100 text-gray-600 disabled:opacity-30 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from(
              { length: Math.min(5, totalPages || 1) },
              (_, i) => i + 1
            ).map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                disabled={isLoading}
                className={`w-7 h-7 rounded-md font-semibold flex items-center justify-center cursor-pointer ${
                  currentPage === pageNum
                    ? "bg-[#16654e] text-white"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
              >
                {pageNum}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages || isLoading}
              className="p-1.5 rounded-md hover:bg-gray-100 text-gray-600 disabled:opacity-30 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Report Detail Modal */}
      {activeModalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-bold text-base text-gray-900">
                {activeModalData.title}
              </h3>
              <button
                onClick={() => setActiveModalData(null)}
                className="text-gray-400 hover:text-gray-600 text-lg p-1"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs">
              <div className="bg-gray-50 rounded-xl p-3.5 space-y-2 border border-gray-100">
                <div className="flex justify-between">
                  <span className="text-gray-500">Reported Member:</span>
                  <span className="font-semibold text-gray-900">
                    {activeModalData.reportedUser} ({activeModalData.userRole})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Reported By:</span>
                  <span className="font-semibold text-gray-900">
                    {activeModalData.reportedBy}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Reason:</span>
                  <span className="font-semibold text-rose-600">
                    {activeModalData.reason}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Booking ID:</span>
                  <span className="font-mono font-semibold text-gray-900">
                    #{activeModalData.bookingId}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Status:</span>
                  <span className="font-semibold text-gray-900 uppercase">
                    {activeModalData.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Reported:</span>
                  <span className="font-semibold text-gray-900">
                    {activeModalData.timeAgo}
                  </span>
                </div>
              </div>

              <div>
                <p className="text-gray-500 font-medium mb-1">
                  Report Description:
                </p>
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 text-gray-700 italic">
                  &quot;{activeModalData.description}&quot;
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setActiveModalData(null)}
                className="px-4 py-2 text-xs font-semibold bg-[#16654e] text-white rounded-xl cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

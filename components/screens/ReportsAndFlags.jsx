"use client";

import React, { useState } from "react";
import {
  RotateCcw,
  AlertTriangle,
  Flag,
  Clock,
  User,
  ShieldAlert,
  MessageSquare,
  History,
  FileSearch,
  CheckCircle,
  XCircle,
  Slash,
} from "lucide-react";
import { adminService } from "@/lib/adminService";

export default function ReportsAndFlags({ reports, setReports, onRefresh, isLoading }) {
  const [activeFilter, setActiveFilter] = useState("all"); // "all", "high", "pending", "resolved"
  const [activeModalData, setActiveModalData] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleDismiss = async (id) => {
    setIsProcessing(true);
    try {
      if (id && id.includes("-") && id.length > 20) {
        await adminService.handleReport(id, "reviewed", "Dismissed by admin.");
      }
      setReports((prev) =>
        prev.map((r) => ((r.report_id || r.id) === id ? { ...r, status: "reviewed" } : r))
      );
      showToast("Report marked as reviewed and dismissed.");
      if (onRefresh) onRefresh();
    } catch (e) {
      showToast(e.message || "Failed to dismiss report.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSuspend = async (report) => {
    const userName = report.reported_user_name || report.reportedUser || "User";
    const reportId = report.report_id || report.id;
    if (confirm(`Are you sure you want to suspend account for ${userName}?`)) {
      setIsProcessing(true);
      try {
        if (reportId && reportId.includes("-") && reportId.length > 20) {
          await adminService.handleReport(reportId, "action_taken", "Suspended by admin.");
        }
        setReports((prev) =>
          prev.map((r) =>
            (r.report_id || r.id) === reportId
              ? { ...r, status: "action_taken", suspended: true }
              : r
          )
        );
        showToast(`Account for ${userName} has been suspended.`);
        if (onRefresh) onRefresh();
      } catch (e) {
        showToast(e.message || "Failed to suspend user.");
      } finally {
        setIsProcessing(false);
      }
    }
  };

  // Normalize reports from API or mock
  const normalizedReports = (reports || []).map((r) => {
    const id = r.report_id || r.id;
    const reportedUser = r.reported_user_name || r.reportedUser || "Reported Member";
    const userRole = (r.reported_user_role || r.userRole || "USER").toUpperCase();
    const reason = r.reason || "Policy violation";
    const description = r.description || `Report filed regarding issue: ${reason}`;
    const reportedBy = r.reporter_name || r.reportedBy || "Platform Member";
    const bookingId = r.booking_id || r.bookingId || "N/A";
    const status = (r.status || "PENDING").toLowerCase();
    const timeAgo = r.created_at
      ? new Date(r.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })
      : r.timeAgo || "Recently";
    const isHigh =
      r.riskType === "high" ||
      reason.toLowerCase().includes("fraud") ||
      reason.toLowerCase().includes("danger") ||
      reason.toLowerCase().includes("threat");
    const riskType = isHigh ? "high" : "medium";
    const avatar =
      r.avatar ||
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80";

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
      suspended: status === "action_taken" || r.suspended,
    };
  });

  const filteredReports = normalizedReports.filter((item) => {
    if (activeFilter === "high") return item.riskType === "high";
    if (activeFilter === "pending") return item.status === "pending";
    if (activeFilter === "resolved")
      return item.status === "reviewed" || item.status === "action_taken" || item.status === "resolved";
    return true;
  });

  const highRiskCount = normalizedReports.filter(
    (r) => r.riskType === "high" && r.status === "pending"
  ).length;

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

        <button
          onClick={onRefresh || (() => showToast("Reports synced with live safety feeds."))}
          disabled={isLoading || isProcessing}
          className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-xl bg-white hover:bg-gray-50 text-sm font-medium text-gray-700 shadow-xs transition cursor-pointer self-start sm:self-auto disabled:opacity-50"
        >
          <RotateCcw className={`w-4 h-4 text-gray-600 ${isLoading ? "animate-spin" : ""}`} />
          <span>{isLoading ? "Refreshing..." : "Refresh"}</span>
        </button>
      </div>

      {/* Filter Tabs matching Screenshot 5 */}
      <div className="flex border-b border-gray-200 gap-8 text-sm">
        <button
          onClick={() => setActiveFilter("all")}
          className={`pb-3 font-semibold transition cursor-pointer relative ${
            activeFilter === "all"
              ? "text-[#16654e] border-b-2 border-[#16654e]"
              : "text-gray-500 hover:text-gray-800"
          }`}
        >
          All ({normalizedReports.length})
        </button>

        <button
          onClick={() => setActiveFilter("high")}
          className={`pb-3 font-semibold transition cursor-pointer relative ${
            activeFilter === "high"
              ? "text-[#16654e] border-b-2 border-[#16654e]"
              : "text-gray-500 hover:text-gray-800"
          }`}
        >
          High Risk ({highRiskCount})
        </button>

        <button
          onClick={() => setActiveFilter("pending")}
          className={`pb-3 font-semibold transition cursor-pointer relative ${
            activeFilter === "pending"
              ? "text-[#16654e] border-b-2 border-[#16654e]"
              : "text-gray-500 hover:text-gray-800"
          }`}
        >
          Pending
        </button>

        <button
          onClick={() => setActiveFilter("resolved")}
          className={`pb-3 font-semibold transition cursor-pointer relative ${
            activeFilter === "resolved"
              ? "text-[#16654e] border-b-2 border-[#16654e]"
              : "text-gray-500 hover:text-gray-800"
          }`}
        >
          Resolved
        </button>
      </div>

      {/* Reports Feed List */}
      <div className="space-y-4">
        {filteredReports.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200/80 p-12 text-center flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
              <CheckCircle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-gray-800">No Reports Found</h3>
            <p className="text-xs text-gray-500 mt-1 max-w-sm">
              There are currently no reported members or safety flags under this category.
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

              {/* High Risk Badge matching Screenshot 5 */}
              {report.riskType === "high" && !report.suspended && (
                <div className="self-start">
                  <span className="inline-block text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded bg-[#b91c1c] text-white shadow-xs">
                    HIGH RISK
                  </span>
                </div>
              )}
            </div>

            {/* Quote / Description Box */}
            <div className="bg-[#fcfdfd] border border-gray-200/90 rounded-xl p-4 my-3 text-sm text-gray-700 italic font-normal leading-relaxed">
              &quot;{report.description}&quot;
            </div>

            {/* Metadata Line */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 mb-4">
              <span>Reported by: <span className="font-semibold text-gray-700">{report.reportedBy}</span></span>
              <span>•</span>
              <span className="font-mono">Booking ID: <span className="font-bold text-gray-700">#{report.bookingId}</span></span>
            </div>

            {/* Action Buttons as in Screenshot 5 */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {/* Context Actions */}
              {report.userRole === "PROVIDER" && report.reason === "Fraud suspected" && (
                <button
                  onClick={() =>
                    setActiveModalData({
                      title: "Booking Context",
                      bookingId: report.bookingId,
                      content: `Inspection for Booking #${report.bookingId}: Provider requested off-platform bKash transaction during chat dialogue. Transaction amount was BDT 2,400 for Deep Cleaning service.`
                    })
                  }
                  className="px-4 py-2 border border-gray-300 hover:border-gray-400 bg-white hover:bg-gray-50 rounded-xl text-xs font-semibold text-gray-800 transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <FileSearch className="w-3.5 h-3.5 text-gray-600" />
                  <span>View Booking Context</span>
                </button>
              )}

              {report.reason === "Rude behavior" && (
                <button
                  onClick={() =>
                    setActiveModalData({
                      title: "Booking Chat Transcript",
                      bookingId: report.bookingId,
                      content: `Chat Log #${report.bookingId}:\n[10:14 AM] Provider: Hello sir, could you specify which rooms need heavy scrubbing?\n[10:18 AM] Seeker: You come now and do your job or I cancel! Do not ask silly questions.\n[10:20 AM] Provider: Sir, we need to bring specialized detergents accordingly.`
                    })
                  }
                  className="px-4 py-2 border border-gray-300 hover:border-gray-400 bg-white hover:bg-gray-50 rounded-xl text-xs font-semibold text-gray-800 transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-gray-600" />
                  <span>View Chat Log</span>
                </button>
              )}

              {report.reason === "No-show" && (
                <button
                  onClick={() =>
                    setActiveModalData({
                      title: "Provider Historical Reliability",
                      bookingId: report.bookingId,
                      content: `Historical Attendance Record for ${report.reportedUser}:\n- Completed Orders: 42\n- On-Time Rating: 88%\n- Previous Late/No-Show Incidents: 1 (Warning issued on Sept 14)`
                    })
                  }
                  className="px-4 py-2 border border-gray-300 hover:border-gray-400 bg-white hover:bg-gray-50 rounded-xl text-xs font-semibold text-gray-800 transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <History className="w-3.5 h-3.5 text-gray-600" />
                  <span>View Provider History</span>
                </button>
              )}

              {/* Suspend Account Button for severe violations */}
              {report.riskType === "high" && !report.suspended && (
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
              {report.status !== "reviewed" && report.status !== "action_taken" && (
                <button
                  onClick={() => handleDismiss(report.id || report.report_id)}
                  disabled={isProcessing}
                  className="px-3.5 py-2 text-xs font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition cursor-pointer disabled:opacity-50"
                >
                  Dismiss
                </button>
              )}
            </div>
          </div>
        )))}
      </div>

      {/* Context Inspection Modal */}
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

            <div className="py-4">
              <pre className="whitespace-pre-wrap font-sans text-xs text-gray-700 bg-gray-50 p-4 rounded-xl border border-gray-200 leading-relaxed">
                {activeModalData.content}
              </pre>
            </div>

            <div className="pt-3 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setActiveModalData(null)}
                className="px-4 py-2 text-xs font-semibold bg-[#16654e] text-white rounded-xl cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


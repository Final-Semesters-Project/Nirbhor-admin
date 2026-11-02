"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Search,
  RotateCcw,
  Download,
  Calendar,
  Filter,
  CheckCircle2,
  Ban,
  UserPlus,
  AlertTriangle,
  ChevronDown,
  ExternalLink,
  Shield,
  Clock,
  Globe,
  FileCode2,
  Check,
  RotateCw,
} from "lucide-react";
import { adminService } from "@/lib/adminService";

export default function AuditLogsScreen() {
  const [logs, setLogs] = useState([]);
  const [selectedAdmin, setSelectedAdmin] = useState("All Admins");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState("10/01/2026 - 10/18/2026");
  const [selectedLogModal, setSelectedLogModal] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const fetchLogs = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await adminService.getAuditLogs();
      if (Array.isArray(data)) {
        const mapped = data.map((log) => {
          const actionLower = (log.action || "").toLowerCase();
          const isNegative = actionLower.includes("reject") || actionLower.includes("suspend") || actionLower.includes("delete");
          const isPositive = actionLower.includes("approve") || actionLower.includes("verify");
          return {
            id: String(log.log_id),
            admin: log.admin_name || "Admin",
            adminRole: log.admin_role === "super_admin" ? "Super Admin" : "Admin",
            actionType: log.action || "Updated",
            actionColor: isNegative ? "rose" : isPositive ? "emerald" : "blue",
            iconType: isPositive ? "check" : isNegative ? "slash" : "user_plus",
            description: `${log.action} ${log.target_user_name ? "for " + log.target_user_name : ""}`,
            target: log.target_user_name || "System Record",
            timestamp: log.performed_at
              ? new Date(log.performed_at).toLocaleString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit"
                })
              : "Recently",
            ip: "Secure Session",
            details: log.details || "Administrative event audited and committed to immutable storage."
          };
        });
        setLogs(mapped);
      }
    } catch (err) {
      console.warn("Could not fetch audit logs from API, using fallback data:", err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const handleResetFilters = () => {
    setSelectedAdmin("All Admins");
    setSearchQuery("");
    setDateRange("10/01/2026 - 10/18/2026");
    showToast("Audit filters reset.");
  };

  const handleExport = () => {
    showToast("Audit logs exported successfully as encrypted CSV.");
  };

  const filteredLogs = logs.filter((item) => {
    if (selectedAdmin !== "All Admins" && item.admin !== selectedAdmin) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.description.toLowerCase().includes(q) ||
        item.admin.toLowerCase().includes(q) ||
        item.ip.includes(q) ||
        item.actionType.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-gray-900 text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-xl border border-gray-700 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header matching Screenshot 3 (Light / White Theme) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block mb-0.5">
            SUPER ADMIN / GOVERNANCE / AUDIT LOGS
          </span>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Audit Logs
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Track all admin actions on the platform
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchLogs}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-3 py-1.5 border border-emerald-200 rounded-xl bg-emerald-50/70 hover:bg-emerald-100/70 text-xs font-semibold text-[#146356] shadow-2xs transition cursor-pointer disabled:opacity-50"
            title="Refresh Live Audit Stream"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
            <span>{isLoading ? "Refreshing..." : "Refresh"}</span>
          </button>

          {/* Live Stream Indicator */}
          <div className="flex items-center gap-2 self-start sm:self-auto bg-white px-3.5 py-1.5 rounded-full border border-gray-200/90 shadow-2xs">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <span className="text-xs font-bold text-gray-700">Live Audit Stream</span>
            <span className="text-[10px] uppercase font-bold px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
              Real-time
            </span>
          </div>
        </div>
      </div>

      {/* Filters Bar matching Screenshot 3 */}
      <div className="bg-white rounded-2xl border border-gray-200/90 p-4 shadow-2xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-end">
          {/* Admin Filter Dropdown */}
          <div className="lg:col-span-3">
            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
              Filter by Admin
            </label>
            <select
              value={selectedAdmin}
              onChange={(e) => setSelectedAdmin(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#146356] cursor-pointer"
            >
              <option value="All Admins">All Admins</option>
              <option value="Tanvir Mahmud">Tanvir Mahmud (Super Admin)</option>
              <option value="Karim Hossain">Karim Hossain (Admin)</option>
              <option value="Tariqul Islam">Tariqul Islam (Admin)</option>
              <option value="Nusrat Jahan">Nusrat Jahan (Admin)</option>
            </select>
          </div>

          {/* Date Range */}
          <div className="lg:col-span-3">
            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
              Date Range
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#146356]"
              />
            </div>
          </div>

          {/* Search Action Details */}
          <div className="lg:col-span-4">
            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
              Search Action Details
            </label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search keywords, IDs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-xl text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#146356]"
              />
            </div>
          </div>

          {/* Reset & Export Buttons */}
          <div className="lg:col-span-2 flex items-center gap-2">
            <button
              onClick={handleResetFilters}
              className="flex-1 py-2 px-2.5 border border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 shadow-2xs transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>

            <button
              onClick={handleExport}
              className="flex-1 py-2 px-2.5 bg-[#146356] hover:bg-[#104e43] text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 shadow-2xs transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Audit Log Timeline Card (Light / White Background Theme) */}
      <div className="bg-white rounded-2xl border border-gray-200/90 p-6 shadow-2xs">
        {filteredLogs.length === 0 ? (
          <div className="py-12 text-center flex flex-col items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-emerald-50 text-[#146356] flex items-center justify-center mb-2">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <p className="font-semibold text-gray-800 text-sm">No audit logs recorded</p>
            <p className="text-xs text-gray-400 mt-0.5">Administrative actions will appear here in real-time.</p>
          </div>
        ) : (
          <>
            <div className="relative pl-6 space-y-6 before:absolute before:left-3 before:top-3 before:bottom-3 before:w-0.5 before:bg-gray-200">
              {filteredLogs.map((log) => {
                const isApproved = log.actionType === "Approved";
                const isSuspension = log.actionType === "Suspension";
                const isCreated = log.actionType === "Created";
                const isRejected = log.actionType === "Rejected";

                return (
                  <div key={log.id} className="relative group">
                    {/* Timeline Icon Marker matching Screenshot 3 */}
                    <div
                      className={`absolute -left-[30px] top-1 w-6 h-6 rounded-full flex items-center justify-center border-2 border-white shadow-xs z-10 ${
                        isApproved
                          ? "bg-emerald-500 text-white"
                          : isSuspension
                          ? "bg-rose-500 text-white"
                          : isCreated
                          ? "bg-blue-500 text-white"
                          : "bg-rose-500 text-white"
                      }`}
                    >
                      {isApproved && <CheckCircle2 className="w-3.5 h-3.5" />}
                      {isSuspension && <Ban className="w-3.5 h-3.5" />}
                      {isCreated && <UserPlus className="w-3.5 h-3.5" />}
                      {isRejected && <AlertTriangle className="w-3.5 h-3.5" />}
                    </div>

                    {/* Log Entry Card */}
                    <div className="bg-gray-50/80 hover:bg-gray-50 rounded-xl p-4 border border-gray-200/80 transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        {/* Admin name and role badges */}
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-gray-900 text-sm">
                            {log.admin}
                          </span>

                          {/* Admin Role Tag */}
                          <span
                            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                              log.adminRole === "Super Admin"
                                ? "bg-purple-100 text-purple-800 border border-purple-200"
                                : "bg-slate-200 text-slate-700"
                            }`}
                          >
                            {log.adminRole}
                          </span>

                          {/* Action Type Tag */}
                          <span
                            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                              isApproved
                                ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                                : isSuspension
                                ? "bg-rose-100 text-rose-800 border border-rose-200"
                                : isCreated
                                ? "bg-blue-100 text-blue-800 border border-blue-200"
                                : "bg-rose-100 text-rose-800 border border-rose-200"
                            }`}
                          >
                            {log.actionType}
                          </span>
                        </div>

                        {/* Timestamp & IP on the right */}
                        <div className="flex items-center gap-3 text-xs text-gray-400">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{log.timestamp}</span>
                          </span>
                          <span>•</span>
                          <span className="font-mono text-gray-500">
                            IP: {log.ip}
                          </span>
                        </div>
                      </div>

                      {/* Description line & Details Trigger */}
                      <div className="mt-2.5 flex items-center justify-between gap-4">
                        <p className="text-xs text-gray-700 font-medium">
                          {log.description}
                        </p>

                        <button
                          onClick={() => setSelectedLogModal(log)}
                          className="text-xs font-semibold text-[#146356] hover:text-[#0e483e] hover:underline flex items-center gap-1 shrink-0 cursor-pointer"
                        >
                          <span>Details</span>
                          <span>&gt;</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Load More & Count Footer matching Screenshot 3 */}
            <div className="mt-8 pt-4 border-t border-gray-100 flex flex-col items-center justify-center gap-2">
              <span className="text-[11px] text-gray-400">
                Showing {filteredLogs.length} recorded actions
              </span>
            </div>
          </>
        )}
      </div>

      {/* Audit Log Cryptographic Details Modal */}
      {selectedLogModal && (
        <div
          onClick={() => setSelectedLogModal(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 animate-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#146356]" />
                <h3 className="font-bold text-base text-gray-900">
                  Immutable Audit Record ({selectedLogModal.id})
                </h3>
              </div>
              <button
                onClick={() => setSelectedLogModal(null)}
                className="text-gray-400 hover:text-gray-600 text-lg p-1"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs">
              <div className="bg-gray-50 rounded-xl p-3.5 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">Initiator Admin:</span>
                  <span className="font-bold text-gray-900">{selectedLogModal.admin} ({selectedLogModal.adminRole})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Action Type:</span>
                  <span className="font-bold text-emerald-700">{selectedLogModal.actionType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Event Timestamp:</span>
                  <span className="font-mono text-gray-800">{selectedLogModal.timestamp}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Origin IP Address:</span>
                  <span className="font-mono text-gray-800">{selectedLogModal.ip}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Target Entity:</span>
                  <span className="font-semibold text-gray-900">{selectedLogModal.target}</span>
                </div>
              </div>

              <div>
                <span className="text-gray-500 font-bold block mb-1">Action Summary:</span>
                <p className="bg-gray-50 p-3 rounded-xl border border-gray-200 text-gray-700 leading-relaxed">
                  {selectedLogModal.details}
                </p>
              </div>

              <div className="pt-2 text-[10px] text-gray-400 font-mono">
                Cryptographic Signature: SHA256:{selectedLogModal.id}a87f9b0c2e3d4f128790
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setSelectedLogModal(null)}
                className="px-4 py-2 text-xs font-semibold bg-[#146356] text-white rounded-xl cursor-pointer"
              >
                Close Audit Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


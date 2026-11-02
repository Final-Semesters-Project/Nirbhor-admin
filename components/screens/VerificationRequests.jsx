"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  CheckCircle,
  Eye,
  ChevronLeft,
  ChevronRight,
  Search,
  RotateCw,
} from "lucide-react";
import { adminService } from "@/lib/adminService";

export default function VerificationRequests({
  verifications: initialVerifications,
  stats,
  onReviewDocuments,
  onRefresh,
}) {
  const [items, setItems] = useState(initialVerifications || []);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);

  const pageSize = 10;

  // Fetch pending verifications directly from API (no cache)
  const fetchVerifications = useCallback(async (page = 1) => {
    setIsLoading(true);
    try {
      const data = await adminService.getPendingVerifications(page, pageSize);
      if (data && Array.isArray(data.items)) {
        setItems(data.items);
        const total = data.total ?? data.items.length;
        setTotalCount(total);
        setTotalPages(data.total_pages ?? Math.max(1, Math.ceil(total / pageSize)));
      }
    } catch (err) {
      console.warn("Could not fetch live pending verifications:", err);
    } finally {
      setIsLoading(false);
    }
  }, [pageSize]);

  // Initial fetch and fetch on page change
  useEffect(() => {
    fetchVerifications(currentPage);
  }, [currentPage, fetchVerifications]);

  // Sync if prop updates from parent
  useEffect(() => {
    if (Array.isArray(initialVerifications) && initialVerifications.length > 0) {
      setItems(initialVerifications);
    }
  }, [initialVerifications]);

  // Normalize items from API
  const normalizedList = (items || []).map((item) => {
    const id = item.user_id || item.id;
    const name = item.name || "Provider";
    const phone = item.phone || "N/A";
    const avatar =
      item.photo_url ||
      item.avatar ||
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80";
    const category = item.category || "Professional Service";
    const regDate = item.submitted_at
      ? new Date(item.submitted_at).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : item.regDate || "Recent";
    const isLevel2 =
      item.verification_level === "verified" ||
      item.levelType === "level2" ||
      Boolean(item.nid_url_front);
    const level = isLevel2 ? "Level 2 (Document)" : "Level 1 (Basic)";
    const levelType = isLevel2 ? "level2" : "level1";
    const status = (
      item.verification_status ||
      item.status ||
      "PENDING"
    ).toUpperCase();

    return {
      ...item,
      id,
      user_id: id,
      name,
      phone,
      avatar,
      selfieImage: item.selfieImage || item.photo_url || avatar,
      category,
      regDate,
      level,
      levelType,
      status,
      nid_url_front: item.nid_url_front,
      nid_url_back: item.nid_url_back,
    };
  });

  // Client-side search filtering over normalized list
  const filteredList = normalizedList.filter((item) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.name.toLowerCase().includes(q) ||
        item.phone.includes(q) ||
        item.category?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Verification Requests
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Review and manage professional skill verification status across the ecosystem.
          </p>
        </div>

        {/* Action controls: Search & Refresh */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search provider name or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#16654e]"
            />
          </div>

          <button
            onClick={() => {
              fetchVerifications(currentPage);
              if (onRefresh) onRefresh();
            }}
            disabled={isLoading}
            className="p-2 border border-gray-200 rounded-xl bg-white hover:bg-gray-50 text-gray-600 transition cursor-pointer shadow-2xs disabled:opacity-50"
            title="Refresh verification requests"
          >
            <RotateCw
              className={`w-4 h-4 ${isLoading ? "animate-spin text-[#16654e]" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/60 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                <th className="py-3.5 px-4 sm:px-6">PHOTO</th>
                <th className="py-3.5 px-4">NAME</th>
                <th className="py-3.5 px-4">PHONE</th>
                <th className="py-3.5 px-4">REG. DATE</th>
                <th className="py-3.5 px-4">LEVEL</th>
                <th className="py-3.5 px-4">STATUS</th>
                <th className="py-3.5 px-4 sm:px-6 text-center">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-emerald-50 text-[#16654e] flex items-center justify-center mb-2">
                        <CheckCircle className="w-5 h-5" />
                      </div>
                      <p className="font-semibold text-gray-800 text-sm">
                        No verification requests
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        All provider accounts and documents are up to date.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredList.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50/70 transition-colors group"
                  >
                    {/* Photo */}
                    <td className="py-3.5 px-4 sm:px-6">
                      <img
                        src={item.avatar}
                        alt={item.name}
                        className="w-10 h-10 rounded-xl object-cover border border-gray-200 shadow-2xs"
                      />
                    </td>

                    {/* Name */}
                    <td className="py-3.5 px-4 font-semibold text-gray-900">
                      <div>{item.name}</div>
                      <div className="text-[11px] text-gray-400 font-normal">
                        {item.category}
                      </div>
                    </td>

                    {/* Phone */}
                    <td className="py-3.5 px-4 text-gray-600 font-mono text-xs">
                      {item.phone}
                    </td>

                    {/* Reg Date */}
                    <td className="py-3.5 px-4 text-gray-600 text-xs">
                      {item.regDate}
                    </td>

                    {/* Level Badge */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block text-xs font-medium px-2.5 py-1 rounded-md ${
                          item.levelType === "level1"
                            ? "bg-teal-50 text-teal-700 border border-teal-200/60"
                            : "bg-gray-100 text-gray-700 border border-gray-200"
                        }`}
                      >
                        {item.level}
                      </span>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4">
                      {item.status === "PENDING" ? (
                        <span className="inline-block text-[11px] font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                          PENDING
                        </span>
                      ) : item.status === "APPROVED" ? (
                        <span className="inline-block text-[11px] font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                          APPROVED
                        </span>
                      ) : (
                        <span className="inline-block text-[11px] font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200">
                          REJECTED
                        </span>
                      )}
                    </td>

                    {/* Action Button */}
                    <td className="py-3.5 px-4 sm:px-6 text-center">
                      {item.status === "PENDING" ? (
                        <button
                          onClick={() => onReviewDocuments(item)}
                          className="px-4 py-1.5 border border-[#16654e] text-[#16654e] hover:bg-[#16654e] hover:text-white rounded-lg text-xs font-semibold transition cursor-pointer"
                        >
                          Review Documents
                        </button>
                      ) : (
                        <button
                          onClick={() => setSelectedProfile(item)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-gray-600 hover:text-gray-900 text-xs font-medium transition cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Profile</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer & Pagination */}
        <div className="py-3.5 px-6 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-gray-500">
          <div>
            Showing {filteredList.length === 0 ? 0 : filteredList.length} of{" "}
            {totalCount || filteredList.length} requests
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage <= 1 || isLoading}
              className="p-1.5 rounded-md hover:bg-gray-100 text-gray-600 disabled:opacity-30 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: Math.min(5, totalPages || 1) }, (_, i) => i + 1).map(
              (pageNum) => (
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
              )
            )}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages || isLoading}
              className="p-1.5 rounded-md hover:bg-gray-100 text-gray-600 disabled:opacity-30 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Summary Card */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Left Sub-card: Approved Today */}
        <div className="md:col-span-3 bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-400">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              Today
            </span>
          </div>

          <div className="mt-4">
            <div className="text-3xl font-extrabold text-gray-900 tracking-tight">
              {stats?.approvedToday ?? 0}
            </div>
            <p className="text-xs font-medium text-gray-500 mt-1">
              Approved Today
            </p>
          </div>
        </div>

        {/* Right Sub-card: Pending Verification Queue */}
        <div className="md:col-span-9 bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-gray-900">
              Pending Verification Queue
            </h3>
            <p className="text-xs text-gray-500 mt-1 max-w-xl">
              Average review time: {stats?.avgReviewTimeHours || 4.2} hours. Keep the ecosystem trusted and professional.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 mt-4 pt-3 border-t border-gray-100 text-xs font-semibold">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span className="text-gray-700">
                {totalCount || stats?.pendingVerifications || 0} Pending Docs
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#16654e]" />
              <span className="text-gray-700">
                {stats?.activeToday
                  ? `${stats.activeToday} Active Providers`
                  : "Real-time Verification Status"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* View Profile Modal */}
      {selectedProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-bold text-base text-gray-900">
                Verified Provider Profile
              </h3>
              <button
                onClick={() => setSelectedProfile(null)}
                className="text-gray-400 hover:text-gray-600 text-lg p-1"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-4 text-sm">
              <div className="flex items-center gap-4">
                <img
                  src={selectedProfile.avatar}
                  alt={selectedProfile.name}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500"
                />
                <div>
                  <h4 className="font-bold text-gray-900 text-base">
                    {selectedProfile.name}
                  </h4>
                  <p className="text-xs text-emerald-700 font-semibold">
                    {selectedProfile.category}
                  </p>
                  <p className="text-xs text-gray-500 font-mono mt-0.5">
                    {selectedProfile.phone}
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-3.5 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-500">Verification Level:</span>
                  <span className="font-semibold text-gray-900">
                    {selectedProfile.level}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Registration Date:</span>
                  <span className="font-semibold text-gray-900">
                    {selectedProfile.regDate}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">National ID:</span>
                  <span className="font-mono text-gray-900 font-semibold">
                    {selectedProfile.nidNumber || "Verified"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Service Coverage:</span>
                  <span className="font-semibold text-gray-900">
                    {selectedProfile.address || "Dhaka Division"}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setSelectedProfile(null)}
                className="px-4 py-2 text-xs font-semibold bg-[#16654e] text-white rounded-xl"
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

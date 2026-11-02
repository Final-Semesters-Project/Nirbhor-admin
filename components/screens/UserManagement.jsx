"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Search,
  Eye,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  CheckCircle,
  XCircle,
  ShieldCheck,
  User,
  Phone,
  Calendar,
  AlertTriangle,
  RotateCw,
  ExternalLink,
  MapPin,
  Smartphone,
  Star,
  Sparkles,
  FileText,
} from "lucide-react";
import { adminService } from "@/lib/adminService";

// Helpers to format dates and relative time in English
const formatDate = (dateStr) => {
  if (!dateStr) return "N/A";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "N/A";
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "N/A";
  }
};

const formatTimeAgo = (dateStr) => {
  if (!dateStr) return "Never";
  try {
    const diffMs = Date.now() - new Date(dateStr).getTime();
    if (isNaN(diffMs) || diffMs < 0) return "Just now";
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${Math.max(1, diffMins)}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return formatDate(dateStr);
  } catch {
    return "Never";
  }
};

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedUserModal, setSelectedUserModal] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [isTogglingId, setIsTogglingId] = useState(null);

  const pageSize = 10;

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Fetch users from API (GET /api/v1/admin/users)
  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const roleParam = roleFilter === "All" ? null : roleFilter.toLowerCase();
      const statusParam =
        statusFilter === "All Status" ? null : statusFilter === "Active";

      const data = await adminService.getUsers(
        roleParam,
        statusParam,
        currentPage,
        pageSize
      );

      const itemsList = Array.isArray(data)
        ? data
        : Array.isArray(data?.items)
        ? data.items
        : [];

      const mapped = itemsList.map((u) => {
        const id = String(u.user_id || u.id);
        const name = u.name_en || u.name_bn || "User";
        const roleLabel =
          typeof u.role === "string"
            ? u.role.charAt(0).toUpperCase() + u.role.slice(1).toLowerCase()
            : "User";

        return {
          id,
          user_id: id,
          name,
          name_en: u.name_en,
          name_bn: u.name_bn,
          phone: u.phone || "N/A",
          role: roleLabel,
          roleRaw: u.role || "user",
          joinedDate: formatDate(u.created_at),
          created_at: u.created_at,
          last_active_at: u.last_active_at,
          lastActive: formatTimeAgo(u.last_active_at),
          status: u.is_active ? "Active" : "Suspended",
          is_active: Boolean(u.is_active),
          avatar:
            u.photo_url ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(
              name
            )}&background=16654e&color=fff&size=128`,
        };
      });

      setUsers(mapped);
      const total =
        typeof data?.total === "number" ? data.total : mapped.length;
      setTotalCount(total);
      setTotalPages(
        typeof data?.total_pages === "number" && data.total_pages > 0
          ? data.total_pages
          : Math.max(1, Math.ceil(total / pageSize))
      );
    } catch (err) {
      console.warn("Could not fetch users from API:", err);
    } finally {
      setIsLoading(false);
    }
  }, [roleFilter, statusFilter, currentPage, pageSize]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Toggle user status (Active <-> Suspended)
  const handleToggleStatus = async (userId) => {
    const targetUser = users.find((u) => u.id === userId || u.user_id === userId);
    if (!targetUser) return;

    setIsTogglingId(userId);
    try {
      if (userId && userId.includes("-") && userId.length > 20) {
        await adminService.toggleUserActive(userId);
      }
      const newActive = !targetUser.is_active;
      const newStatus = newActive ? "Active" : "Suspended";

      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId || u.user_id === userId
            ? { ...u, is_active: newActive, status: newStatus }
            : u
        )
      );

      if (
        selectedUserModal &&
        (selectedUserModal.id === userId || selectedUserModal.user_id === userId)
      ) {
        setSelectedUserModal((prev) => ({
          ...prev,
          is_active: newActive,
          status: newStatus,
        }));
      }

      showToast(`User ${targetUser.name} is now ${newStatus}.`);
    } catch (e) {
      showToast(e.message || "Failed to update user status.");
    } finally {
      setIsTogglingId(null);
    }
  };

  // View user details (GET /api/v1/admin/users/{user_id})
  const handleViewUserDetail = async (user) => {
    const userId = user.user_id || user.id;
    // Set initial preview immediately so UI opens with no delay
    setSelectedUserModal(user);
    setIsLoadingDetail(true);

    try {
      const detail = await adminService.getUserDetail(userId);
      if (detail && typeof detail === "object") {
        setSelectedUserModal((prev) => ({
          ...prev,
          ...detail,
          name: detail.name_en || detail.name_bn || prev.name || "User",
          name_en: detail.name_en,
          name_bn: detail.name_bn,
          phone: detail.phone || prev.phone,
          role:
            typeof detail.role === "string"
              ? detail.role.charAt(0).toUpperCase() + detail.role.slice(1).toLowerCase()
              : prev.role,
          roleRaw: detail.role || prev.roleRaw,
          is_active: detail.is_active !== undefined ? Boolean(detail.is_active) : prev.is_active,
          status:
            (detail.is_active !== undefined ? detail.is_active : prev.is_active)
              ? "Active"
              : "Suspended",
          joinedDate: formatDate(detail.created_at || prev.created_at),
          created_at: detail.created_at || prev.created_at,
          last_active_at: detail.last_active_at || prev.last_active_at,
          lastActive: formatTimeAgo(detail.last_active_at || prev.last_active_at),
          total_bookings: detail.total_bookings ?? 0,
          average_rating: detail.average_rating ?? 0,
          verification_level: detail.verification_level || "Basic",
          verification_status: (detail.verification_status || "Pending").toUpperCase(),
          photo_url: detail.photo_url || prev.avatar,
          nid_url_front: detail.nid_url_front,
          nid_url_back: detail.nid_url_back,
          base_location: detail.base_location || "Not specified",
          working_radius_km: detail.working_radius_km,
          has_smartphone: Boolean(detail.has_smartphone),
          warning_status: Boolean(detail.warning_status),
          ai_review_summary_en: detail.ai_review_summary_en,
          ai_review_summary_bn: detail.ai_review_summary_bn,
        }));
      }
    } catch (err) {
      console.warn("Could not fetch user details from API:", err);
    } finally {
      setIsLoadingDetail(false);
    }
  };

  // Client-side search filtering
  const filteredUsers = users.filter((user) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      user.name.toLowerCase().includes(q) ||
      user.phone.includes(q) ||
      user.id.toLowerCase().includes(q) ||
      user.role.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-gray-900 text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-xl border border-gray-700 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            User Management
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Manage roles, verify status, and handle administrative actions for all Nirbhor members.
          </p>
        </div>

        <button
          onClick={fetchUsers}
          disabled={isLoading}
          className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl bg-white hover:bg-gray-50 text-sm font-semibold text-gray-700 shadow-2xs transition cursor-pointer self-start sm:self-auto disabled:opacity-50"
        >
          <RotateCw className={`w-4 h-4 text-gray-600 ${isLoading ? "animate-spin text-[#16654e]" : ""}`} />
          <span>{isLoading ? "Refreshing..." : "Refresh"}</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-2xl border border-gray-200/90 p-4 shadow-2xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-end">
          {/* Search Input */}
          <div className="lg:col-span-6">
            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
              Search Users
            </label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, phone, or user ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-xl text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#16654e]"
              />
            </div>
          </div>

          {/* Role Dropdown */}
          <div className="lg:col-span-3">
            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
              Role
            </label>
            <select
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#16654e] cursor-pointer"
            >
              <option value="All">All Roles</option>
              <option value="Provider">Provider</option>
              <option value="Seeker">Seeker</option>
            </select>
          </div>

          {/* Status Dropdown */}
          <div className="lg:col-span-3">
            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#16654e] cursor-pointer"
            >
              <option value="All Status">All Status</option>
              <option value="Active">Active</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-2xl border border-gray-200/90 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/70 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                <th className="py-3.5 px-6">USER</th>
                <th className="py-3.5 px-4">PHONE</th>
                <th className="py-3.5 px-4">ROLE</th>
                <th className="py-3.5 px-4">LAST ACTIVE</th>
                <th className="py-3.5 px-4">JOINED</th>
                <th className="py-3.5 px-4">STATUS</th>
                <th className="py-3.5 px-6 text-center">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-emerald-50 text-[#16654e] flex items-center justify-center mb-2">
                        <CheckCircle className="w-5 h-5" />
                      </div>
                      <p className="font-semibold text-gray-800 text-sm">
                        No users found
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        No registered user profiles matched your current filters.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const isActive = user.is_active;

                  return (
                    <tr
                      key={user.id}
                      className="hover:bg-gray-50/70 transition-colors group"
                    >
                      {/* User Column */}
                      <td className="py-3.5 px-6">
                        <div className="flex items-center gap-3">
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-10 h-10 rounded-xl object-cover border border-gray-200 shrink-0"
                          />
                          <div>
                            <div className="font-semibold text-gray-900 leading-tight">
                              {user.name}
                            </div>
                            <div className="text-[11px] text-gray-400 font-mono mt-0.5">
                              ID: {user.id.slice(0, 13)}...
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Phone Column */}
                      <td className="py-3.5 px-4 text-xs font-mono text-gray-700">
                        {user.phone}
                      </td>

                      {/* Role Column */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block text-xs font-medium px-2.5 py-0.5 rounded-md ${
                            user.role.toLowerCase() === "provider"
                              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                              : "bg-blue-50 text-blue-800 border border-blue-200"
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>

                      {/* Last Active */}
                      <td className="py-3.5 px-4 text-xs text-gray-600">
                        {user.lastActive}
                      </td>

                      {/* Joined Column */}
                      <td className="py-3.5 px-4 text-xs text-gray-600">
                        {user.joinedDate}
                      </td>

                      {/* Status Column */}
                      <td className="py-3.5 px-4">
                        {isActive ? (
                          <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                            <span>Active</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200/80">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
                            <span>Suspended</span>
                          </span>
                        )}
                      </td>

                      {/* Actions Column (View Detail + Toggle Active Switch) */}
                      <td className="py-3.5 px-6">
                        <div className="flex items-center justify-center gap-3">
                          {/* Eye details button */}
                          <button
                            onClick={() => handleViewUserDetail(user)}
                            className="p-1.5 text-gray-500 hover:text-[#16654e] hover:bg-emerald-50 rounded-lg transition cursor-pointer"
                            title="View User Record Details"
                            aria-label={`View details for ${user.name}`}
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Toggle Switch */}
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(user.id)}
                            disabled={isTogglingId === user.id}
                            aria-label={`Toggle active state for ${user.name}`}
                            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                              isActive ? "bg-[#16654e]" : "bg-gray-300"
                            } ${isTogglingId === user.id ? "opacity-50 cursor-wait" : ""}`}
                          >
                            <span
                              className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                                isActive ? "translate-x-4" : "translate-x-0"
                              }`}
                            />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="py-3.5 px-6 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-gray-500">
          <div>
            Showing {filteredUsers.length} of {totalCount} users
          </div>

          <div className="flex items-center gap-1 font-medium">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage <= 1 || isLoading}
              className="p-1.5 rounded-md hover:bg-gray-100 text-gray-600 disabled:opacity-30 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map(
              (pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  disabled={isLoading}
                  className={`w-7 h-7 rounded-md flex items-center justify-center cursor-pointer ${
                    currentPage === pageNum
                      ? "bg-[#16654e] text-white font-bold"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  {pageNum}
                </button>
              )
            )}

            {totalPages > 5 && (
              <>
                <span className="px-1 text-gray-400">...</span>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={isLoading}
                  className={`w-7 h-7 rounded-md flex items-center justify-center cursor-pointer ${
                    currentPage === totalPages
                      ? "bg-[#16654e] text-white font-bold"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  {totalPages}
                </button>
              </>
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

      {/* Comprehensive User Details Modal (GET /api/v1/admin/users/{user_id}) */}
      {selectedUserModal && (
        <div
          onClick={() => setSelectedUserModal(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-gray-200 animate-in fade-in zoom-in-95 duration-150 my-8"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-gray-900">
                  User Record Details
                </h3>
                {isLoadingDetail && (
                  <RotateCw className="w-3.5 h-3.5 animate-spin text-[#16654e]" />
                )}
              </div>
              <button
                onClick={() => setSelectedUserModal(null)}
                className="text-gray-400 hover:text-gray-600 text-lg p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="py-4 space-y-4 text-xs">
              {/* Profile Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
                <div className="flex items-center gap-3.5">
                  <img
                    src={
                      selectedUserModal.photo_url ||
                      selectedUserModal.avatar ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        selectedUserModal.name
                      )}&background=16654e&color=fff&size=128`
                    }
                    alt={selectedUserModal.name}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-[#16654e] shadow-2xs"
                  />
                  <div>
                    <h4 className="font-bold text-gray-900 text-base flex items-center gap-2">
                      <span>{selectedUserModal.name}</span>
                      {selectedUserModal.warning_status && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                          <AlertTriangle className="w-3 h-3" />
                          <span>Flagged</span>
                        </span>
                      )}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {selectedUserModal.role}
                      </span>
                      <span className="text-gray-400 font-mono">
                        {selectedUserModal.phone}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status Switch inside Modal */}
                <div className="flex sm:flex-col items-end justify-between sm:justify-center gap-1">
                  <span
                    className={`text-xs font-bold ${
                      selectedUserModal.is_active
                        ? "text-emerald-700"
                        : "text-rose-700"
                    }`}
                  >
                    {selectedUserModal.is_active ? "Active Account" : "Suspended"}
                  </span>
                  <button
                    onClick={() => handleToggleStatus(selectedUserModal.id)}
                    className="text-[11px] text-[#16654e] hover:underline font-semibold cursor-pointer"
                  >
                    {selectedUserModal.is_active ? "Suspend User" : "Activate User"}
                  </button>
                </div>
              </div>

              {/* Key Metrics Statistics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-2xs text-center">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Total Bookings
                  </p>
                  <p className="text-lg font-extrabold text-gray-900 mt-1">
                    {selectedUserModal.total_bookings ?? 0}
                  </p>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-2xs text-center">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Rating
                  </p>
                  <p className="text-lg font-extrabold text-amber-600 mt-1 flex items-center justify-center gap-1">
                    <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                    <span>{selectedUserModal.average_rating || 0}</span>
                  </p>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-2xs text-center">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Verification
                  </p>
                  <p className="text-xs font-bold text-emerald-800 mt-1.5 uppercase">
                    {selectedUserModal.verification_status || "PENDING"}
                  </p>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-2xs text-center">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Level
                  </p>
                  <p className="text-xs font-bold text-gray-800 mt-1.5">
                    {selectedUserModal.verification_level || "Basic"}
                  </p>
                </div>
              </div>

              {/* Detailed Specs Grid */}
              <div className="bg-gray-50 rounded-xl p-4 space-y-2.5 border border-gray-100">
                <div className="flex justify-between">
                  <span className="text-gray-500 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-gray-400" />
                    <span>Base Location:</span>
                  </span>
                  <span className="font-semibold text-gray-900">
                    {selectedUserModal.base_location || "Not specified"}
                    {selectedUserModal.working_radius_km
                      ? ` (${selectedUserModal.working_radius_km} km radius)`
                      : ""}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500 flex items-center gap-1.5">
                    <Smartphone className="w-3.5 h-3.5 text-gray-400" />
                    <span>Smartphone Access:</span>
                  </span>
                  <span className="font-semibold text-gray-900">
                    {selectedUserModal.has_smartphone ? "Yes" : "No"}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                    <span>Member Since:</span>
                  </span>
                  <span className="font-semibold text-gray-900">
                    {selectedUserModal.joinedDate || formatDate(selectedUserModal.created_at)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-gray-400" />
                    <span>Last Active:</span>
                  </span>
                  <span className="font-semibold text-gray-900">
                    {formatTimeAgo(selectedUserModal.last_active_at)}
                  </span>
                </div>

                <div className="flex justify-between pt-1 border-t border-gray-200/60">
                  <span className="text-gray-500">System User ID:</span>
                  <span className="font-mono font-semibold text-gray-800">
                    {selectedUserModal.user_id || selectedUserModal.id}
                  </span>
                </div>
              </div>

              {/* AI Review Summary (if provided by API) */}
              {selectedUserModal.ai_review_summary_en && (
                <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-900 text-xs mb-1">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                    <span>AI Profile Assessment</span>
                  </div>
                  <p className="text-xs text-emerald-800 leading-relaxed">
                    {selectedUserModal.ai_review_summary_en}
                  </p>
                </div>
              )}

              {/* National ID Documents Preview */}
              {(selectedUserModal.nid_url_front || selectedUserModal.nid_url_back) && (
                <div className="space-y-2 pt-1">
                  <div className="flex items-center gap-1.5 font-bold text-gray-800 text-xs">
                    <FileText className="w-3.5 h-3.5 text-gray-500" />
                    <span>Identity Documents (NID)</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedUserModal.nid_url_front && (
                      <div className="border border-gray-200 rounded-xl p-2 bg-gray-50">
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
                          NID Front
                        </span>
                        <div
                          onClick={() => setPreviewImage(selectedUserModal.nid_url_front)}
                          className="relative h-28 rounded-lg overflow-hidden border border-gray-200 cursor-pointer group bg-white"
                        >
                          <img
                            src={selectedUserModal.nid_url_front}
                            alt="NID Front"
                            className="w-full h-full object-cover group-hover:scale-105 transition"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[11px] font-semibold transition">
                            Click to Enlarge
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedUserModal.nid_url_back && (
                      <div className="border border-gray-200 rounded-xl p-2 bg-gray-50">
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
                          NID Back
                        </span>
                        <div
                          onClick={() => setPreviewImage(selectedUserModal.nid_url_back)}
                          className="relative h-28 rounded-lg overflow-hidden border border-gray-200 cursor-pointer group bg-white"
                        >
                          <img
                            src={selectedUserModal.nid_url_back}
                            alt="NID Back"
                            className="w-full h-full object-cover group-hover:scale-105 transition"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[11px] font-semibold transition">
                            Click to Enlarge
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="pt-3 border-t border-gray-100 flex justify-end gap-2">
              <button
                onClick={() => setSelectedUserModal(null)}
                className="px-4 py-2 text-xs font-semibold bg-[#16654e] text-white rounded-xl cursor-pointer hover:bg-[#125340] transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen Image Lightbox Modal */}
      {previewImage && (
        <div
          onClick={() => setPreviewImage(null)}
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        >
          <div className="relative max-w-3xl w-full p-2 bg-white rounded-2xl shadow-2xl">
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-gray-900/80 text-white flex items-center justify-center text-sm font-bold hover:bg-gray-900 cursor-pointer"
            >
              ✕
            </button>
            <img
              src={previewImage}
              alt="Document Preview"
              className="w-full max-h-[80vh] object-contain rounded-xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}

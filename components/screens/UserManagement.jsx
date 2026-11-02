"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Search,
  Filter,
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
  AlertCircle,
  RotateCw,
} from "lucide-react";
import { adminService } from "@/lib/adminService";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedUserModal, setSelectedUserModal] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Fetch users from API (always fresh, no cache)
  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await adminService.getUsers(
        roleFilter === "All" ? null : roleFilter,
        statusFilter === "All Status" ? null : statusFilter === "Active",
        currentPage,
        10
      );

      if (data && Array.isArray(data.items)) {
        const mapped = data.items.map((u) => {
          const roleLabel =
            typeof u.role === "string"
              ? u.role.charAt(0).toUpperCase() + u.role.slice(1).toLowerCase()
              : "User";
          return {
            id: String(u.user_id),
            user_id: String(u.user_id),
            name: u.name_en || u.name_bn || "User",
            name_en: u.name_en,
            name_bn: u.name_bn,
            phone: u.phone,
            role: roleLabel,
            joinedDate: u.created_at
              ? new Date(u.created_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric"
                })
              : "N/A",
            status: u.is_active ? "Active" : "Suspended",
            is_active: u.is_active,
            avatar:
              u.photo_url ||
              "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
          };
        });
        setUsers(mapped);
        setTotalCount(data.total || mapped.length);
        setTotalPages(data.total_pages || Math.ceil((data.total || mapped.length) / 10) || 1);
      }
    } catch (err) {
      console.warn("Falling back to local users:", err.message);
    } finally {
      setIsLoading(false);
    }
  }, [roleFilter, statusFilter, currentPage]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Toggle user status (Active <-> Suspended)
  const handleToggleStatus = async (id) => {
    const targetUser = users.find((user) => user.id === id);
    if (!targetUser) return;

    try {
      if (id.includes("-") && id.length > 20) {
        await adminService.toggleUserActive(id);
      }
      const newStatus = targetUser.status === "Active" ? "Suspended" : "Active";
      setUsers((prev) =>
        prev.map((user) =>
          user.id === id
            ? { ...user, status: newStatus, is_active: newStatus === "Active" }
            : user
        )
      );
      showToast(`User ${targetUser.name} status updated to ${newStatus}.`);
      fetchUsers();
    } catch (e) {
      showToast(e.message || "Failed to update user status.");
    }
  };

  // View user details
  const handleViewUserDetail = async (user) => {
    setSelectedUserModal(user);
    if (user.id && user.id.includes("-") && user.id.length > 20) {
      setIsLoadingDetail(true);
      try {
        const detail = await adminService.getUserDetail(user.id);
        setSelectedUserModal((prev) => ({
          ...prev,
          ...detail,
          total_bookings: detail.total_bookings,
          average_rating: detail.average_rating,
          verification_level: detail.verification_level,
          verification_status: detail.verification_status,
          base_location: detail.base_location,
        }));
      } catch (err) {
        console.warn("Could not fetch user details from API:", err);
      } finally {
        setIsLoadingDetail(false);
      }
    }
  };

  // Local search filter
  const filteredUsers = users.filter((user) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        user.name.toLowerCase().includes(q) ||
        user.phone.includes(q) ||
        user.id.toLowerCase().includes(q)
      );
    }
    return true;
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

      {/* Header matching Screenshot 1 */}
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
          className="inline-flex items-center gap-2 px-3.5 py-2 border border-emerald-200 rounded-xl bg-emerald-50/70 hover:bg-emerald-100/70 text-xs font-semibold text-[#146356] shadow-2xs transition cursor-pointer self-start sm:self-auto disabled:opacity-50"
        >
          <RotateCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
          <span>{isLoading ? "Refreshing..." : "Refresh"}</span>
        </button>
      </div>

      {/* Filters Bar matching Screenshot 1 */}
      <div className="bg-white rounded-2xl border border-gray-200/90 p-4 shadow-2xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-end">
          {/* Search Input */}
          <div className="lg:col-span-4">
            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
              Search Users
            </label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Name, Phone or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-xl text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#146356]"
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
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#146356] cursor-pointer"
            >
              <option value="All">All</option>
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
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#146356] cursor-pointer"
            >
              <option value="All Status">All Status</option>
              <option value="Active">Active</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>

          {/* Apply Filters Button */}
          <div className="lg:col-span-2">
            <button
              onClick={() => showToast("Filters updated successfully.")}
              className="w-full py-2 px-3 bg-[#146356] hover:bg-[#104e43] text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 shadow-2xs transition cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Apply Filters</span>
            </button>
          </div>
        </div>
      </div>

      {/* Data Table matching Screenshot 1 */}
      <div className="bg-white rounded-2xl border border-gray-200/90 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/70 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                <th className="py-3.5 px-6">USER</th>
                <th className="py-3.5 px-4">PHONE</th>
                <th className="py-3.5 px-4">ROLE</th>
                <th className="py-3.5 px-4">JOINED</th>
                <th className="py-3.5 px-4">STATUS</th>
                <th className="py-3.5 px-6 text-center">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-emerald-50 text-[#146356] flex items-center justify-center mb-2">
                        <CheckCircle className="w-5 h-5" />
                      </div>
                      <p className="font-semibold text-gray-800 text-sm">No users found</p>
                      <p className="text-xs text-gray-400 mt-0.5">No registered user profiles matched your current filters.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                const isActive = user.status === "Active";

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
                            ID: {user.id}
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
                      <span className="inline-block text-xs font-medium px-2.5 py-0.5 rounded-md bg-gray-100 text-gray-700 border border-gray-200/80">
                        {user.role}
                      </span>
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

                    {/* Actions Column (Eye View + Toggle Switch) */}
                    <td className="py-3.5 px-6">
                      <div className="flex items-center justify-center gap-3">
                        {/* Eye details button */}
                        <button
                          onClick={() => handleViewUserDetail(user)}
                          className="p-1 text-gray-400 hover:text-gray-700 transition cursor-pointer"
                          title="View User Details"
                          aria-label={`View details for ${user.name}`}
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Toggle Switch matching screenshot */}
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(user.id)}
                          aria-label={`Toggle status for ${user.name}`}
                          className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                            isActive ? "bg-[#146356]" : "bg-gray-300"
                          }`}
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
              }))}
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
              disabled={currentPage === 1 || isLoading}
              className="p-1.5 rounded-md hover:bg-gray-100 text-gray-600 disabled:opacity-30 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`w-7 h-7 rounded-md flex items-center justify-center cursor-pointer ${
                  currentPage === pageNum
                    ? "bg-[#146356] text-white font-bold"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
              >
                {pageNum}
              </button>
            ))}

            {totalPages > 5 && (
              <>
                <span className="px-1 text-gray-400">...</span>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  className={`w-7 h-7 rounded-md flex items-center justify-center cursor-pointer ${
                    currentPage === totalPages
                      ? "bg-[#146356] text-white font-bold"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  {totalPages}
                </button>
              </>
            )}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || isLoading}
              className="p-1.5 rounded-md hover:bg-gray-100 text-gray-600 disabled:opacity-30 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* User Inspection Modal */}
      {selectedUserModal && (
        <div
          onClick={() => setSelectedUserModal(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-200 animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-bold text-base text-gray-900">
                User Record Details
              </h3>
              <button
                onClick={() => setSelectedUserModal(null)}
                className="text-gray-400 hover:text-gray-600 text-lg p-1"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-4">
              <div className="flex items-center gap-4">
                <img
                  src={selectedUserModal.avatar}
                  alt={selectedUserModal.name}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-[#146356]"
                />
                <div>
                  <h4 className="font-bold text-gray-900 text-base">
                    {selectedUserModal.name}
                  </h4>
                  <p className="text-xs text-[#146356] font-semibold">
                    {selectedUserModal.role}
                  </p>
                  <p className="text-xs text-gray-500 font-mono mt-0.5">
                    ID: {selectedUserModal.id}
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-3.5 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-500">Contact Phone:</span>
                  <span className="font-mono text-gray-900 font-semibold">{selectedUserModal.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Account Status:</span>
                  <span className={`font-semibold ${selectedUserModal.status === "Active" ? "text-emerald-700" : "text-rose-700"}`}>
                    {selectedUserModal.status}
                  </span>
                </div>
                {selectedUserModal.total_bookings !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Total Bookings:</span>
                    <span className="font-semibold text-gray-900">{selectedUserModal.total_bookings}</span>
                  </div>
                )}
                {selectedUserModal.average_rating !== undefined && selectedUserModal.average_rating !== null && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Average Rating:</span>
                    <span className="font-semibold text-amber-600">★ {selectedUserModal.average_rating}</span>
                  </div>
                )}
                {selectedUserModal.verification_status && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Verification:</span>
                    <span className="font-semibold uppercase text-emerald-800">{selectedUserModal.verification_status}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-500">Registration Date:</span>
                  <span className="font-semibold text-gray-900">{selectedUserModal.joinedDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Platform Affiliation:</span>
                  <span className="font-semibold text-gray-900">Nirbhor Verified Community</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex justify-end gap-2">
              <button
                onClick={() => setSelectedUserModal(null)}
                className="px-4 py-2 text-xs font-semibold bg-[#146356] text-white rounded-xl"
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

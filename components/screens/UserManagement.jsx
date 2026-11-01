"use client";

import React, { useState } from "react";
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
  AlertCircle
} from "lucide-react";
import { INITIAL_USER_MANAGEMENT } from "@/data/mockData";

export default function UserManagement() {
  const [users, setUsers] = useState(INITIAL_USER_MANAGEMENT);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUserModal, setSelectedUserModal] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Toggle user status (Active <-> Suspended)
  const handleToggleStatus = (id) => {
    setUsers((prev) =>
      prev.map((user) => {
        if (user.id === id) {
          const newStatus = user.status === "Active" ? "Suspended" : "Active";
          showToast(`User ${user.name} status updated to ${newStatus}.`);
          return { ...user, status: newStatus };
        }
        return user;
      })
    );
  };

  // Filter application
  const filteredUsers = users.filter((user) => {
    if (roleFilter !== "All" && user.role !== roleFilter) return false;
    if (statusFilter !== "All Status" && user.status !== statusFilter) return false;
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
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          User Management
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Manage roles, verify status, and handle administrative actions for all Nirbhor members.
        </p>
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
              {filteredUsers.map((user) => {
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
                          onClick={() => setSelectedUserModal(user)}
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
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination matching Screenshot 1 */}
        <div className="py-3.5 px-6 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-gray-500">
          <div>
            Showing {filteredUsers.length} of 1,240 users
          </div>

          <div className="flex items-center gap-1 font-medium">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-md hover:bg-gray-100 text-gray-600 disabled:opacity-30 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              onClick={() => setCurrentPage(1)}
              className={`w-7 h-7 rounded-md flex items-center justify-center cursor-pointer ${
                currentPage === 1
                  ? "bg-[#146356] text-white font-bold"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
            >
              1
            </button>
            <button
              onClick={() => setCurrentPage(2)}
              className={`w-7 h-7 rounded-md flex items-center justify-center cursor-pointer ${
                currentPage === 2
                  ? "bg-[#146356] text-white font-bold"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
            >
              2
            </button>
            <button
              onClick={() => setCurrentPage(3)}
              className={`w-7 h-7 rounded-md flex items-center justify-center cursor-pointer ${
                currentPage === 3
                  ? "bg-[#146356] text-white font-bold"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
            >
              3
            </button>
            <span className="px-1 text-gray-400">...</span>
            <button
              onClick={() => setCurrentPage(42)}
              className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-gray-100 text-gray-700 cursor-pointer"
            >
              42
            </button>

            <button
              onClick={() => setCurrentPage((p) => Math.min(42, p + 1))}
              disabled={currentPage === 42}
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

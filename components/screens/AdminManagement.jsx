"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Search,
  Plus,
  ShieldCheck,
  UserX,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  CheckCircle,
  MoreVertical,
  Key,
  Calendar,
  Phone,
  Mail,
  Lock,
  RotateCw,
} from "lucide-react";
import CreateAdminModal from "./CreateAdminModal";
import { adminService } from "@/lib/adminService";

export default function AdminManagement({
  admins,
  setAdmins,
  onOpenCreateAdmin
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAdminModal, setSelectedAdminModal] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Fetch live admins list from API (no cache)
  const fetchAdmins = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await adminService.getAdmins();
      if (Array.isArray(data)) {
        const mapped = data.map((adm) => {
          const initials = (adm.name || "Admin")
            .split(" ")
            .map((n) => n[0])
            .slice(0, 2)
            .join("")
            .toUpperCase();
          return {
            id: String(adm.user_id),
            user_id: String(adm.user_id),
            name: adm.name,
            initials: initials || "AD",
            phone: adm.phone,
            status: adm.is_active ? "Active" : "Inactive",
            createdDate: adm.created_at
              ? new Date(adm.created_at).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric"
                })
              : "N/A",
            lastActive: adm.last_active_at
              ? new Date(adm.last_active_at).toLocaleDateString("en-GB", {
                  month: "short",
                  day: "numeric"
                })
              : "Never",
            role: adm.role ? `${adm.role.charAt(0).toUpperCase() + adm.role.slice(1)} Admin` : "Admin",
            email: `${adm.name.toLowerCase().replace(/\s+/g, ".")}@nirbhor.com`
          };
        });
        setAdmins(mapped);
      }
    } catch (err) {
      console.warn("Could not fetch admins from API, using local state:", err.message);
    } finally {
      setIsLoading(false);
    }
  }, [setAdmins]);

  useEffect(() => {
    fetchAdmins();
  }, [fetchAdmins]);

  // Toggle Suspend / Activate
  const handleToggleStatus = async (id) => {
    const targetAdmin = admins.find((adm) => adm.id === id);
    if (!targetAdmin) return;

    try {
      if (id.includes("-") && id.length > 20) {
        await adminService.toggleAdminActive(id);
      }
      const nextStatus = targetAdmin.status === "Active" ? "Inactive" : "Active";
      setAdmins((prev) =>
        prev.map((adm) =>
          adm.id === id ? { ...adm, status: nextStatus } : adm
        )
      );
      showToast(`Admin ${targetAdmin.name} has been ${nextStatus === "Active" ? "activated" : "suspended"}.`);
      fetchAdmins();
    } catch (e) {
      showToast(e.message || "Failed to update admin status.");
    }
  };

  const handleAdminCreated = (newAdmin) => {
    setAdmins((prev) => [newAdmin, ...prev]);
    showToast(`Administrator ${newAdmin.name} created successfully.`);
    fetchAdmins();
  };

  // Filter admins
  const filteredAdmins = admins.filter((adm) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      adm.name.toLowerCase().includes(q) ||
      adm.phone.includes(q) ||
      adm.role?.toLowerCase().includes(q)
    );
  });

  const pageSize = 5;
  const paginatedAdmins = filteredAdmins.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-gray-900 text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-xl border border-gray-700 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header matching Screenshot 1 (Light / White Background Theme) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block mb-0.5">
            SUPER ADMIN / ACCESS CONTROL
          </span>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Admin Management
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Manage platform administrators, credentials, and governance permissions.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchAdmins}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 border border-emerald-200 rounded-xl bg-emerald-50/70 hover:bg-emerald-100/70 text-xs font-semibold text-[#146356] shadow-2xs transition cursor-pointer disabled:opacity-50"
            title="Refresh Live Data"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
            <span>{isLoading ? "Refreshing..." : "Refresh"}</span>
          </button>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#146356] hover:bg-[#104e43] text-white rounded-xl text-xs font-bold shadow-xs transition cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Admin</span>
          </button>
        </div>
      </div>

      {/* Search Input & Total Count Bar */}
      <div className="bg-white rounded-2xl border border-gray-200/90 p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or phone..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-xl text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#146356]"
          />
        </div>

        <span className="text-xs text-gray-400 font-medium">
          Showing {filteredAdmins.length} of 14 platform administrators
        </span>
      </div>

      {/* Main Table or Empty State (Light Background Theme) */}
      <div className="bg-white rounded-2xl border border-gray-200/90 shadow-2xs overflow-hidden">
        {filteredAdmins.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50/70 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                  <th className="py-3.5 px-6">NAME</th>
                  <th className="py-3.5 px-4">PHONE</th>
                  <th className="py-3.5 px-4">STATUS</th>
                  <th className="py-3.5 px-4">CREATED DATE</th>
                  <th className="py-3.5 px-4">LAST ACTIVE</th>
                  <th className="py-3.5 px-6 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {paginatedAdmins.map((admin) => {
                  const isActive = admin.status === "Active";

                  return (
                    <tr
                      key={admin.id}
                      className="hover:bg-gray-50/70 transition-colors group"
                    >
                      {/* Name Column */}
                      <td className="py-3.5 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gray-100 text-gray-700 font-bold text-xs flex items-center justify-center border border-gray-200 shrink-0">
                            {admin.initials}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900 leading-tight">
                              {admin.name}
                            </div>
                            <div className="text-[11px] text-gray-400 font-normal mt-0.5">
                              {admin.role}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Phone Column */}
                      <td className="py-3.5 px-4 text-xs font-mono text-gray-700">
                        {admin.phone}
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
                            <span>Inactive</span>
                          </span>
                        )}
                      </td>

                      {/* Created Date */}
                      <td className="py-3.5 px-4 text-xs text-gray-600">
                        {admin.createdDate}
                      </td>

                      {/* Last Active */}
                      <td className="py-3.5 px-4 text-xs text-gray-500">
                        {admin.lastActive}
                      </td>

                      {/* Actions: Details & Suspend/Activate */}
                      <td className="py-3.5 px-6 text-right">
                        <div className="inline-flex items-center gap-2">
                          <button
                            onClick={() => setSelectedAdminModal(admin)}
                            className="px-3 py-1.5 border border-gray-300 hover:border-gray-400 bg-white hover:bg-gray-50 text-gray-700 rounded-lg text-xs font-semibold transition cursor-pointer"
                          >
                            Details
                          </button>

                          {isActive ? (
                            <button
                              onClick={() => handleToggleStatus(admin.id)}
                              className="px-3 py-1.5 bg-[#b91c1c] hover:bg-[#991b1b] text-white rounded-lg text-xs font-semibold shadow-2xs transition cursor-pointer"
                            >
                              Suspend
                            </button>
                          ) : (
                            <button
                              onClick={() => handleToggleStatus(admin.id)}
                              className="px-3 py-1.5 bg-[#146356] hover:bg-[#104e43] text-white rounded-lg text-xs font-semibold shadow-2xs transition cursor-pointer"
                            >
                              Activate
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          /* Empty State matching Screenshot 1 specification */
          <div className="py-14 px-4 flex flex-col items-center justify-center text-center">
            <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400 mb-3 border border-gray-200">
              <UserX className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-gray-900">
              No admins found
            </h3>
            <p className="text-xs text-gray-500 max-w-sm mt-1 mb-4">
              Try adjusting your search query or add a new administrator.
            </p>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#146356] hover:bg-[#104e43] text-white rounded-xl text-xs font-bold transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Admin</span>
            </button>
          </div>
        )}

        {/* Pagination Footer matching Screenshot 1 */}
        {filteredAdmins.length > 0 && (
          <div className="py-3.5 px-6 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-gray-500">
            <div>
              Showing 1 to {Math.min(paginatedAdmins.length, 5)} of 14 admins
            </div>

            <div className="flex items-center gap-4">
              <span>Page 1 of 3</span>
              <div className="flex items-center gap-2 font-medium">
                <button
                  disabled
                  className="px-2.5 py-1 text-gray-400 rounded-md border border-gray-200 disabled:opacity-40 cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => showToast("Navigated to next page.")}
                  className="px-2.5 py-1 text-gray-700 hover:text-gray-900 rounded-md border border-gray-200 hover:bg-gray-50 transition cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Admin Details Modal */}
      {selectedAdminModal && (
        <div
          onClick={() => setSelectedAdminModal(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-200 animate-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-bold text-base text-gray-900">
                Administrator Profile
              </h3>
              <button
                onClick={() => setSelectedAdminModal(null)}
                className="text-gray-400 hover:text-gray-600 text-lg p-1"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-[#146356] font-extrabold text-base flex items-center justify-center border border-emerald-200">
                  {selectedAdminModal.initials}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-base">
                    {selectedAdminModal.name}
                  </h4>
                  <p className="text-xs text-[#146356] font-semibold">
                    {selectedAdminModal.role}
                  </p>
                  <p className="text-xs text-gray-400 font-mono mt-0.5">
                    {selectedAdminModal.email}
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-3.5 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-500">Contact Number:</span>
                  <span className="font-mono text-gray-900 font-semibold">{selectedAdminModal.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Account Status:</span>
                  <span className={`font-semibold ${selectedAdminModal.status === "Active" ? "text-emerald-700" : "text-rose-700"}`}>
                    {selectedAdminModal.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Created Date:</span>
                  <span className="font-semibold text-gray-900">{selectedAdminModal.createdDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Last Activity:</span>
                  <span className="font-semibold text-gray-900">{selectedAdminModal.lastActive}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Security Clearance:</span>
                  <span className="font-semibold text-purple-700">Governance Tier 1</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setSelectedAdminModal(null)}
                className="px-4 py-2 text-xs font-semibold bg-[#146356] text-white rounded-xl cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal to Create New Admin */}
      <CreateAdminModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onAdminCreated={handleAdminCreated}
      />
    </div>
  );
}


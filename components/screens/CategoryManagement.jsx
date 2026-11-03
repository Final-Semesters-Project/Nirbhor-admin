"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  FolderTree,
  Plus,
  Search,
  RotateCw,
  FolderPlus,
  ArrowRight,
  Layers,
  Wrench,
  CheckCircle2,
  AlertCircle,
  Hash,
  Globe,
  ShieldCheck,
  Info,
} from "lucide-react";
import CreateCategoryModal from "./CreateCategoryModal";
import { adminService } from "@/lib/adminService";

export default function CategoryManagement({ onNavigateToSkills, currentUser, isSuperAdmin }) {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const fetchCategoriesList = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await adminService.getCategories();
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      console.warn("Failed to fetch categories:", err);
      showToast("Failed to load categories. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategoriesList();
  }, [fetchCategoriesList]);

  const filteredCategories = categories.filter((cat) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    const name = String(cat.name || "").toLowerCase();
    const nameEn = String(cat.name_en || "").toLowerCase();
    const nameBn = String(cat.name_bn || "").toLowerCase();
    const id = String(cat.id);
    return name.includes(q) || nameEn.includes(q) || nameBn.includes(q) || id.includes(q);
  });

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-xs font-semibold text-white shadow-2xl border border-slate-700 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Role-Based Notice for Super Admin */}
      {isSuperAdmin && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-purple-50/80 border border-purple-200/80 text-purple-900 text-xs">
          <div className="w-8 h-8 rounded-xl bg-purple-200/80 text-purple-800 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold">Super Admin Oversight:</span>
            <span className="ml-1 text-purple-800">
              Service categories are managed by operational Admins (`POST /api/v1/category/create`). As Super Admin, you have full real-time visibility over categories and their linked skills.
            </span>
          </div>
        </div>
      )}

      {/* Screen Header & Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-[#16654e] flex items-center justify-center">
              <FolderTree className="w-4 h-4" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">
              Category Management
            </h1>
          </div>
          <p className="mt-1 text-xs text-gray-500 font-medium">
            Manage top-level service categories available on the Nirbhor platform.
          </p>
        </div>

        {/* Add Category Button (User request: "category page er under a add category button thakbe") */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={fetchCategoriesList}
            disabled={isLoading}
            className="p-2 text-gray-500 hover:text-[#16654e] hover:bg-emerald-50 rounded-xl transition cursor-pointer disabled:opacity-40"
            title="Refresh Categories"
          >
            <RotateCw className={`w-4 h-4 ${isLoading ? "animate-spin text-[#16654e]" : ""}`} />
          </button>

          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#16654e] text-white text-xs font-bold shadow-md shadow-[#16654e]/20 hover:bg-[#125743] hover:shadow-lg transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Category</span>
          </button>
        </div>
      </div>

      {/* Filter and Stats Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-xl border border-gray-100">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search categories by name or ID..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#16654e] focus:border-transparent"
          />
        </div>

        <div className="text-xs font-semibold text-gray-500 flex items-center gap-2">
          <span>Total Categories:</span>
          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-[#16654e] font-bold">
            {categories.length}
          </span>
        </div>
      </div>

      {/* Category Cards / Table */}
      {isLoading ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-gray-100">
          <div className="w-8 h-8 border-3 border-[#16654e]/30 border-t-[#16654e] rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs font-semibold text-gray-500">Loading categories from server...</p>
        </div>
      ) : filteredCategories.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-gray-100">
          <Layers className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-gray-700">No categories found</h3>
          <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
            {searchQuery
              ? "No categories match your search criteria. Try a different query."
              : "No categories have been created yet. Click 'Add Category' above to create one."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCategories.map((cat) => (
            <div
              key={cat.id}
              className="bg-white p-5 rounded-2xl border border-gray-200/90 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                    <Hash className="w-3 h-3" />
                    <span>ID: {cat.id}</span>
                  </span>

                  <span className="w-2 h-2 rounded-full bg-emerald-500" title="Active" />
                </div>

                <h3 className="text-base font-bold text-gray-900 group-hover:text-[#16654e] transition-colors">
                  {cat.name}
                </h3>
              </div>

              <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between">
                <span className="text-[11px] font-medium text-gray-400 flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-gray-400" />
                  <span>Bilingual Active</span>
                </span>

                <button
                  type="button"
                  onClick={() => onNavigateToSkills && onNavigateToSkills(cat.id)}
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#16654e] hover:text-[#114b39] transition cursor-pointer"
                >
                  <span>View Skills</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Category Modal */}
      <CreateCategoryModal
        isOpen={isCreateModalOpen}
        isSuperAdmin={isSuperAdmin}
        onClose={() => setIsCreateModalOpen(false)}
        onCategoryCreated={(msg) => {
          showToast(msg);
          fetchCategoriesList();
        }}
      />
    </div>
  );
}


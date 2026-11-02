"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Wrench,
  Plus,
  Search,
  RotateCw,
  FolderTree,
  Filter,
  CheckCircle2,
  AlertCircle,
  Hash,
  Globe,
  Layers,
} from "lucide-react";
import CreateSkillModal from "./CreateSkillModal";
import { adminService } from "@/lib/adminService";

export default function SkillManagement({ initialCategoryFilter = "all" }) {
  const [categories, setCategories] = useState([]);
  const [skills, setSkills] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(initialCategoryFilter || "all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Fetch categories and all skills across categories
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      // 1. Fetch categories
      const catList = await adminService.getCategories();
      const validCategories = Array.isArray(catList) ? catList : [];
      setCategories(validCategories);

      // 2. Fetch skills for each category
      const allSkills = [];
      for (const cat of validCategories) {
        try {
          const catSkills = await adminService.getSkillsByCategory(cat.id);
          if (Array.isArray(catSkills)) {
            catSkills.forEach((s) => {
              allSkills.push({
                ...s,
                category_name: cat.name,
              });
            });
          }
        } catch (e) {
          console.warn(`Failed loading skills for category ${cat.id}:`, e);
        }
      }

      setSkills(allSkills);
    } catch (err) {
      console.warn("Failed fetching skills data:", err);
      showToast("Failed to load skills from server.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Filter skills by selected category and search query
  const filteredSkills = skills.filter((skill) => {
    // Category match
    if (selectedCategory !== "all" && String(skill.category_id) !== String(selectedCategory)) {
      return false;
    }

    // Search query match
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;

    const name = String(skill.name || "").toLowerCase();
    const catName = String(skill.category_name || "").toLowerCase();
    const id = String(skill.id);

    return name.includes(q) || catName.includes(q) || id.includes(q);
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

      {/* Screen Header & Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-[#16654e] flex items-center justify-center">
              <Wrench className="w-4 h-4" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">
              Skill Management
            </h1>
          </div>
          <p className="mt-1 text-xs text-gray-500 font-medium">
            View and manage individual skills mapped to service categories.
          </p>
        </div>

        {/* Add Skill Button (User request: "skill page er under a add skill button thakbe") */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={fetchData}
            disabled={isLoading}
            className="p-2 text-gray-500 hover:text-[#16654e] hover:bg-emerald-50 rounded-xl transition cursor-pointer disabled:opacity-40"
            title="Refresh Skills"
          >
            <RotateCw className={`w-4 h-4 ${isLoading ? "animate-spin text-[#16654e]" : ""}`} />
          </button>

          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#16654e] text-white text-xs font-bold shadow-md shadow-[#16654e]/20 hover:bg-[#125743] hover:shadow-lg transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Skill</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-xl border border-gray-100">
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search skill name or ID..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#16654e] focus:border-transparent"
            />
          </div>

          {/* Category Dropdown Filter */}
          <div className="relative w-full sm:w-60">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#16654e] focus:border-transparent font-medium cursor-pointer"
            >
              <option value="all">All Categories ({skills.length})</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="text-xs font-semibold text-gray-500 flex items-center gap-2">
          <span>Total Skills:</span>
          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-[#16654e] font-bold">
            {filteredSkills.length}
          </span>
        </div>
      </div>

      {/* Skills Table */}
      {isLoading ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-gray-100">
          <div className="w-8 h-8 border-3 border-[#16654e]/30 border-t-[#16654e] rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs font-semibold text-gray-500">Loading skills from server...</p>
        </div>
      ) : filteredSkills.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-gray-100">
          <Wrench className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-gray-700">No skills found</h3>
          <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
            {searchQuery || selectedCategory !== "all"
              ? "No skills match the current filter. Try selecting 'All Categories' or clearing search."
              : "No skills have been registered yet. Click 'Add Skill' to create one."}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200/90 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#f8faf9] border-b border-gray-200 text-gray-500 uppercase tracking-wider font-bold text-[10px]">
                  <th className="py-3.5 px-4">Skill ID</th>
                  <th className="py-3.5 px-4">Skill Name</th>
                  <th className="py-3.5 px-4">Assigned Category</th>
                  <th className="py-3.5 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700 font-medium">
                {filteredSkills.map((skill) => (
                  <tr key={skill.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-gray-500">
                      #{skill.id}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md bg-emerald-50 text-[#16654e] flex items-center justify-center font-bold">
                          <Wrench className="w-3 h-3" />
                        </div>
                        <span className="font-bold text-gray-900 text-xs sm:text-sm">
                          {skill.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-[#16654e] border border-emerald-200 font-bold text-[11px]">
                        <FolderTree className="w-3 h-3" />
                        <span>{skill.category_name || `Category #${skill.category_id}`}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span>Active</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Skill Modal */}
      <CreateSkillModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        categories={categories}
        initialCategoryId={selectedCategory !== "all" ? selectedCategory : null}
        onSkillCreated={(msg) => {
          showToast(msg);
          fetchData();
        }}
      />
    </div>
  );
}


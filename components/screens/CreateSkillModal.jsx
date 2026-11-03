"use client";

import React, { useState, useEffect } from "react";
import { X, Wrench, AlertCircle, CheckCircle2, Layers } from "lucide-react";
import { adminService } from "@/lib/adminService";

export default function CreateSkillModal({
  isOpen,
  onClose,
  categories = [],
  initialCategoryId = null,
  onSkillCreated,
  isSuperAdmin,
}) {
  const [categoryId, setCategoryId] = useState(initialCategoryId || "");
  const [nameEn, setNameEn] = useState("");
  const [nameBn, setNameBn] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    if (initialCategoryId) {
      setCategoryId(String(initialCategoryId));
    } else if (categories.length > 0 && !categoryId) {
      setCategoryId(String(categories[0].id));
    }
  }, [initialCategoryId, categories, categoryId]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");

    if (!categoryId) {
      setApiError("Please select a service category.");
      return;
    }
    if (!nameEn.trim()) {
      setApiError("Please enter skill name in English.");
      return;
    }
    if (!nameBn.trim()) {
      setApiError("Please enter skill name in Bangla.");
      return;
    }

    setIsSubmitting(true);
    try {
      // POST /api/v1/skill/create
      const response = await adminService.createSkill({
        name_en: nameEn.trim(),
        name_bn: nameBn.trim(),
        category_id: Number(categoryId),
      });

      setIsSubmitting(false);
      setNameEn("");
      setNameBn("");
      onSkillCreated(response?.message || "Skill created successfully.");
      onClose();
    } catch (err) {
      setIsSubmitting(false);
      let msg = err.message || "Failed to create skill. Please try again.";
      if (
        msg.toLowerCase().includes("admins only") ||
        msg.includes("403") ||
        msg.toLowerCase().includes("forbidden")
      ) {
        msg =
          "Permission Denied: Under backend security policy (skill_router.py), skill creation is reserved for regular 'admin' accounts. Super Admin accounts have oversight access.";
      }
      setApiError(msg);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-[#f8faf9]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-[#16654e] flex items-center justify-center">
              <Wrench className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900 leading-tight">
                Add New Skill
              </h2>
              <p className="text-[11px] text-gray-500 font-medium">
                POST /api/v1/skill/create
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {apiError && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
              <span>{apiError}</span>
            </div>
          )}

          {/* Category Dropdown */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
              Select Category <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#16654e] focus:border-transparent transition cursor-pointer font-medium"
            >
              <option value="" disabled>
                -- Select a Category --
              </option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name || cat.name_en} (ID: {cat.id})
                </option>
              ))}
            </select>
            <p className="text-[11px] text-gray-400 mt-1">
              The category under which this skill will be grouped.
            </p>
          </div>

          {/* Name EN */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
              Skill Name (English) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={nameEn}
              onChange={(e) => setNameEn(e.target.value)}
              placeholder="e.g. Electrician, AC Repair, Plumbing"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-[#16654e] focus:border-transparent transition"
            />
            <p className="text-[11px] text-gray-400 mt-1">
              Name of the skill in English.
            </p>
          </div>

          {/* Name BN */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
              Skill Name (Bangla) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={nameBn}
              onChange={(e) => setNameBn(e.target.value)}
              placeholder="যেমন: ইলেকট্রিশিয়ান, এসি মেরামত, প্লাম্বিং"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-[#16654e] focus:border-transparent transition"
            />
            <p className="text-[11px] text-gray-400 mt-1">
              Name of the skill in Bangla.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-800 rounded-xl hover:bg-gray-100 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 text-xs font-bold text-white bg-[#16654e] hover:bg-[#125743] rounded-xl shadow-sm transition flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Creating Skill...</span>
                </>
              ) : (
                <>
                  <Wrench className="w-4 h-4" />
                  <span>Create Skill</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


"use client";

import React, { useState } from "react";
import { X, FolderPlus, AlertCircle, CheckCircle2, Layers } from "lucide-react";
import { adminService } from "@/lib/adminService";

export default function CreateCategoryModal({ isOpen, onClose, onCategoryCreated, isSuperAdmin }) {
  const [nameEn, setNameEn] = useState("");
  const [nameBn, setNameBn] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");

    if (!nameEn.trim()) {
      setApiError("Please enter category name in English.");
      return;
    }
    if (!nameBn.trim()) {
      setApiError("Please enter category name in Bangla.");
      return;
    }

    setIsSubmitting(true);
    try {
      // POST /api/v1/category/create
      const response = await adminService.createCategory({
        name_en: nameEn.trim(),
        name_bn: nameBn.trim(),
      });

      setIsSubmitting(false);
      setNameEn("");
      setNameBn("");
      onCategoryCreated(response?.message || "Category created successfully.");
      onClose();
    } catch (err) {
      setIsSubmitting(false);
      const msg = err.message || "Failed to create category. Please check details and try again.";
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
              <FolderPlus className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-gray-900 leading-tight">
                  Add New Category
                </h2>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-[#146356] border border-emerald-300">
                  {isSuperAdmin ? "Super Admin" : "Admin"}
                </span>
              </div>
              <p className="text-[11px] text-gray-500 font-medium">
                POST /api/v1/category/create
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

          {/* Name EN */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
              Category Name (English) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={nameEn}
              onChange={(e) => setNameEn(e.target.value)}
              placeholder="e.g. Home Repairs, Electrical Services"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-[#16654e] focus:border-transparent transition"
            />
            <p className="text-[11px] text-gray-400 mt-1">
              Official name displayed in English locale.
            </p>
          </div>

          {/* Name BN */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
              Category Name (Bangla) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={nameBn}
              onChange={(e) => setNameBn(e.target.value)}
              placeholder="যেমন: বাসা মেরামত, ইলেকট্রিক্যাল সার্ভিস"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-[#16654e] focus:border-transparent transition"
            />
            <p className="text-[11px] text-gray-400 mt-1">
              Official name displayed in Bangla locale.
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
                  <span>Creating Category...</span>
                </>
              ) : (
                <>
                  <FolderPlus className="w-4 h-4" />
                  <span>Create Category</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


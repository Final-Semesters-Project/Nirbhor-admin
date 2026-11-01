"use client";

import React, { useState } from "react";
import {
  X,
  UserPlus,
  Eye,
  EyeOff,
  AlertCircle,
  ShieldCheck,
  Check
} from "lucide-react";

export default function CreateAdminModal({ isOpen, onClose, onAdminCreated }) {
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("Verification Admin");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [phoneError, setPhoneError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const validatePhone = (num) => {
    // Check if BD format: 11 digits starting with 01
    const cleaned = num.replace(/[\s-]/g, "");
    if (!cleaned) {
      setPhoneError("");
      return false;
    }
    if (!/^01\d{9}$/.test(cleaned)) {
      setPhoneError("Must be 11-digit number starting with 01");
      return false;
    }
    setPhoneError("");
    return true;
  };

  const handlePhoneChange = (e) => {
    const val = e.target.value;
    setPhoneNumber(val);
    if (val.length > 2) {
      validatePhone(val);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setPasswordError("");

    if (!fullName.trim()) {
      alert("Please enter full name.");
      return;
    }

    if (!validatePhone(phoneNumber)) {
      setPhoneError("Must be 11-digit number starting with 01");
      return;
    }

    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const initials = fullName
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();

      const newAdmin = {
        id: `ADM-0${Math.floor(10 + Math.random() * 90)}`,
        name: fullName,
        initials: initials || "AD",
        phone: `+880 ${phoneNumber.slice(1, 5)}-${phoneNumber.slice(5)}`,
        status: "Active",
        createdDate: new Date().toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric"
        }),
        lastActive: "Just now",
        role: role,
        email: `${fullName.toLowerCase().replace(/\s+/g, ".")}@nirbhor.com`
      };

      onAdminCreated(newAdmin);
      onClose();
    }, 400);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150"
    >
      {/* Light / White Modal Card matching user requirement */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-gray-200/90 relative animate-in zoom-in-95 duration-200"
      >
        {/* Header matching Screenshot 2 */}
        <div className="flex items-start justify-between pb-4 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-bold text-gray-900 tracking-tight">
              Create New Admin Account
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Assign platform governance privileges to a new administrator.
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Form Fields matching Screenshot 2 */}
        <form onSubmit={handleSubmit} className="py-4 space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              Full Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Tanvir Hossain"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#146356]"
            />
          </div>

          {/* Department / Role */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              Governance Role / Department *
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#146356] cursor-pointer"
            >
              <option value="Verification Admin">Verification Admin</option>
              <option value="Safety & Moderation Admin">Safety & Moderation Admin</option>
              <option value="Operations Admin">Operations Admin</option>
              <option value="Support Admin">Support Admin</option>
              <option value="Auditing Officer">Auditing Officer</option>
            </select>
          </div>

          {/* Phone Number with BD 11-digit hint */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-gray-700">
                Phone Number *
              </label>
              <span className="text-[11px] text-gray-400 font-medium">
                11-digit BD number
              </span>
            </div>
            <div className="relative">
              <input
                type="text"
                required
                placeholder="01712345678"
                value={phoneNumber}
                onChange={handlePhoneChange}
                className={`w-full px-3.5 py-2.5 bg-white border rounded-xl text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 transition ${
                  phoneError
                    ? "border-red-300 focus:ring-red-400 bg-red-50/20"
                    : "border-gray-200 focus:ring-[#146356]"
                }`}
              />
              {phoneError && (
                <AlertCircle className="w-4 h-4 text-red-500 absolute right-3 top-1/2 -translate-y-1/2" />
              )}
            </div>
            {phoneError && (
              <p className="text-[11px] font-medium text-red-600 mt-1 flex items-center gap-1">
                <span>⚠</span>
                <span>{phoneError}</span>
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              Password *
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 pr-10 bg-white border border-gray-200 rounded-xl text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#146356]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[11px] text-gray-400 mt-1">
              Minimum 8 characters with letters, numbers & symbols
            </p>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              Confirm Password *
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                required
                placeholder="••••••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 pr-10 bg-white border border-gray-200 rounded-xl text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#146356]"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5 cursor-pointer"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {passwordError && (
              <p className="text-[11px] font-medium text-red-600 mt-1">
                {passwordError}
              </p>
            )}
          </div>

          {/* Action Buttons matching Screenshot 2 */}
          <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-[#146356] hover:bg-[#104e43] text-white text-xs font-bold rounded-xl shadow-xs inline-flex items-center gap-2 transition cursor-pointer disabled:opacity-50"
            >
              <UserPlus className="w-4 h-4" />
              <span>{isSubmitting ? "Creating..." : "Create Admin"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


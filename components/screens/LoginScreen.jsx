"use client";

import React, { useState } from "react";
import NirbhorLogo from "../branding/NirbhorLogo";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { adminService } from "@/lib/adminService";

export default function LoginScreen({ onLoginSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password.trim()) {
      setError("Please fill in both phone/username and password.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await adminService.login(username, password);
      setIsLoading(false);
      onLoginSuccess({
        name: response.user?.name || response.user?.name_en || "Administrator",
        role: response.user?.role?.toUpperCase() || response.role?.toUpperCase() || "ADMIN",
        user_id: response.user_id,
        phone: response.user?.phone || username,
        access_token: response.access_token,
      });
    } catch (err) {
      setIsLoading(false);
      setError(
        err.message || "Login failed. Please verify your credentials."
      );
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#f4f7f5] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative ambient background */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-100/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-teal-100/50 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-[420px] z-10 flex flex-col items-center">
        {/* Top Logo & Headings */}
        <div className="text-center mb-8 flex flex-col items-center">
          <div className="mb-4">
            <NirbhorLogo size="lg" variant="dark" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight mb-1">
            Admin Login
          </h1>
          <p className="text-sm text-gray-500 font-normal">
            Sign in to manage the platform
          </p>
        </div>

        {/* Card */}
        <div className="w-full bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100/80 p-8 sm:p-9 transition-all">
          <form onSubmit={handleSubmit} className="space-y-5" autoComplete="off">
            {error && (
              <div className="bg-red-50 text-red-700 text-xs font-medium px-3.5 py-2.5 rounded-lg border border-red-200 flex items-center gap-2">
                <span>⚠</span>
                <span>{error}</span>
              </div>
            )}

            {/* Phone / Username Field */}
            <div>
              <label
                htmlFor="admin_account"
                className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1.5"
              >
                PHONE NUMBER / USERNAME
              </label>
              <div className="relative">
                <input
                  id="admin_account"
                  name="nirbhor_admin_account_id"
                  type="text"
                  autoComplete="off"
                  autoCapitalize="none"
                  spellCheck="false"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter phone number or username"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-[#16654e] focus:border-transparent transition"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="admin_key"
                  className="text-[11px] font-bold uppercase tracking-wider text-gray-500"
                >
                  PASSWORD
                </label>
                <button
                  type="button"
                  onClick={() => alert("Password reset link has been dispatched to authorized administrators.")}
                  className="text-xs font-semibold text-[#16654e] hover:text-[#0f4434] transition hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <input
                  id="admin_key"
                  name="nirbhor_admin_secret_key"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full px-4 py-2.5 pr-11 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-[#16654e] focus:border-transparent transition"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#165a46] hover:bg-[#114938] text-white font-medium text-sm py-3 px-4 rounded-xl shadow-md shadow-emerald-950/10 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-75 cursor-pointer"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Security badge at bottom */}
        <p className="mt-6 text-xs text-gray-400 text-center">
          © {new Date().getFullYear()} Nirbhor Technologies. All rights reserved.
        </p>
      </div>
    </div>
  );
}


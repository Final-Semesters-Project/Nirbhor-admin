"use client";

import React from "react";
import NirbhorLogo from "../branding/NirbhorLogo";
import {
  LayoutDashboard,
  ShieldCheck,
  AlertTriangle,
  Users,
  BarChart2,
  LogOut,
  ChevronRight,
  ShieldAlert,
  KeyRound,
  FileText,
  UserCog
} from "lucide-react";

export default function AdminSidebar({
  activeTab,
  setActiveTab,
  stats,
  currentUser,
  onLogout,
  isMobileOpen,
  setIsMobileOpen
}) {
  const userRole = (currentUser?.role || "").toLowerCase().replace(/[\s_-]/g, "");
  const isSuperAdmin = userRole === "superadmin";
  const coreModules = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: "verifications",
      label: "Verifications",
      icon: ShieldCheck,
      badge: stats?.pendingVerifications || "12"
    },
    {
      id: "reports",
      label: "Reports & Flags",
      icon: AlertTriangle,
      badge: stats?.flaggedProfiles || "5",
      badgeColor: "bg-red-500/90 text-white"
    },
    {
      id: "users",
      label: "User Management",
      icon: Users,
      badge: null
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: BarChart2,
      badge: null
    }
  ];

  const superAdminModules = [
    {
      id: "admin_management",
      label: "Admin Management",
      icon: KeyRound,
      badge: null
    },
    {
      id: "audit_logs",
      label: "Audit Logs",
      icon: FileText,
      badge: null
    }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-xs transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#146356] text-white flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{
          backgroundColor: "#146356",
          backgroundImage: "linear-gradient(180deg, #16695b 0%, #12574b 100%)"
        }}
      >
        {/* Scrollable Navigation Area */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          {/* Top Brand Header */}
          <div className="p-6 border-b border-white/10">
            <NirbhorLogo
              variant="light"
              size="sm"
              subtitle="Trust & Admin Portal"
              showAdminBadge={false}
            />
          </div>

          {/* 1. Core Modules Section */}
          <div className="p-3">
            <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-emerald-200/60 block mb-1.5">
              CORE MODULES
            </span>
            <nav className="space-y-1">
              {coreModules.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      if (setIsMobileOpen) setIsMobileOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all group cursor-pointer ${
                      isActive
                        ? "bg-white/20 text-white shadow-sm font-semibold backdrop-blur-xs"
                        : "text-emerald-100/80 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`w-4 h-4 transition-transform group-hover:scale-105 ${
                          isActive ? "text-white" : "text-emerald-200/80"
                        }`}
                      />
                      <span>{item.label}</span>
                    </div>

                    {item.badge && (
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold shadow-xs ${
                          item.badgeColor || "bg-emerald-400 text-emerald-950"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* 2. Super Admin / Access Control Section (visible only to Super Admin) */}
          {isSuperAdmin && (
            <div className="p-3 pt-1 border-t border-white/10 mt-1">
              <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-emerald-200/60 block mb-1.5">
                SUPER ADMIN / ACCESS CONTROL
              </span>
              <nav className="space-y-1">
                {superAdminModules.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        if (setIsMobileOpen) setIsMobileOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all group cursor-pointer ${
                        isActive
                          ? "bg-white/20 text-white shadow-sm font-semibold backdrop-blur-xs"
                          : "text-emerald-100/80 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon
                          className={`w-4 h-4 transition-transform group-hover:scale-105 ${
                            isActive ? "text-white" : "text-emerald-200/80"
                          }`}
                        />
                        <span>{item.label}</span>
                      </div>

                      <span className="text-[9px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded bg-white/10 text-emerald-200">
                        SUPER
                      </span>
                    </button>
                  );
                })}
              </nav>
            </div>
          )}
        </div>

        {/* Bottom Super Admin User Profile Card matching Screenshots */}
        <div className="p-4 border-t border-white/10 bg-black/15 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative shrink-0">
                <div className="w-10 h-10 rounded-full bg-emerald-950/80 border-2 border-emerald-400/30 flex items-center justify-center text-white font-bold text-xs shadow-inner">
                  {currentUser?.name
                    ? currentUser.name
                        .split(" ")
                        .filter(Boolean)
                        .map((w) => w[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()
                    : "AD"}
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-[#12574b] rounded-full" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white leading-tight truncate">
                  {currentUser?.name || "Admin"}
                </p>
                <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-emerald-300/90 mt-0.5">
                  {currentUser?.role || (isSuperAdmin ? "SUPER ADMIN" : "ADMIN")}
                </span>
              </div>
            </div>

            <button
              onClick={onLogout}
              title="Sign Out"
              aria-label="Sign Out"
              className="p-2 rounded-lg text-emerald-200/80 hover:text-white hover:bg-white/15 transition cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

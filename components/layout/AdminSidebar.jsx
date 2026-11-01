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
  ShieldAlert
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
  const navItems = [
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
        {/* Top Brand Section */}
        <div>
          <div className="p-6 border-b border-white/10">
            <NirbhorLogo
              variant="light"
              size="sm"
              subtitle="Verified Trust Portal"
              showAdminBadge={false}
            />
          </div>

          {/* Navigation Items */}
          <nav className="p-3 space-y-1 mt-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    if (setIsMobileOpen) setIsMobileOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium transition-all group cursor-pointer ${
                    isActive
                      ? "bg-white/20 text-white shadow-sm font-semibold backdrop-blur-xs"
                      : "text-emerald-100/80 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-5 h-5 transition-transform group-hover:scale-105 ${
                        isActive ? "text-white" : "text-emerald-200/80"
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-bold shadow-xs ${
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

        {/* Bottom Admin User Profile Card */}
        <div className="p-4 border-t border-white/10 bg-black/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative shrink-0">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                  alt="Admin"
                  className="w-10 h-10 rounded-full object-cover border-2 border-emerald-300/40"
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-[#12574b] rounded-full" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white leading-tight truncate">
                  {currentUser?.name || "Admin Name"}
                </p>
                <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-emerald-300/90 mt-0.5">
                  {currentUser?.role || "SUPER USER"}
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


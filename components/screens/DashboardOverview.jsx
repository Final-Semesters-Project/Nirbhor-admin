"use client";

import React, { useState } from "react";
import {
  Clock,
  Flag,
  Wrench,
  Calendar,
  FileText,
  AlertTriangle,
  UserX,
  CreditCard,
  MapPin,
  CheckCircle,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Download,
  Shield,
  Layers
} from "lucide-react";
import { NETWORK_HOTSPOTS } from "@/data/mockData";

export default function DashboardOverview({
  stats,
  verifications,
  reports,
  onReviewWorker,
  onNavigateTab
}) {
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [selectedHotspot, setSelectedHotspot] = useState(null);

  // Verification items to show in the recent list (from screenshot 2)
  const recentVerifications = [
    {
      id: "VER-102",
      initials: "RK",
      name: "Rahim Khan",
      time: "Submitted 2h ago",
      level: "Level 2",
      category: "Electrician"
    },
    {
      id: "VER-107",
      initials: "AB",
      name: "Anwara Begum",
      time: "Submitted 4h ago",
      level: "Level 2",
      category: "Child Care"
    },
    {
      id: "VER-108",
      initials: "SH",
      name: "Sajal Hossain",
      time: "Submitted 5h ago",
      level: "Level 2",
      category: "Appliance Repair"
    },
    {
      id: "VER-105",
      initials: "MA",
      name: "Marium Akter",
      time: "Submitted 1d ago",
      level: "Level 1",
      category: "Cook"
    }
  ];

  // Reports items to show in the recent list (from screenshot 2)
  const recentReports = [
    {
      id: "REP-401",
      type: "warning",
      icon: AlertTriangle,
      color: "text-amber-600 bg-amber-50",
      name: "Karim Ullah",
      issue: "Incomplete work"
    },
    {
      id: "REP-402",
      type: "schedule",
      icon: Clock,
      color: "text-blue-600 bg-blue-50",
      name: "Fatima Tuz Zohra",
      issue: "Late arrival"
    },
    {
      id: "REP-403",
      type: "account_circle",
      icon: UserX,
      color: "text-rose-600 bg-rose-50",
      name: "Nazmul Islam",
      issue: "Fake identity"
    },
    {
      id: "REP-404",
      type: "payments",
      icon: CreditCard,
      color: "text-emerald-600 bg-emerald-50",
      name: "Sumi Akter",
      issue: "Payment dispute"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            System status and pending administrative tasks
          </p>
        </div>

        <button
          onClick={() => setReportModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-xl bg-white hover:bg-gray-50 text-sm font-medium text-gray-700 shadow-xs transition cursor-pointer self-start sm:self-auto"
        >
          <FileText className="w-4 h-4 text-[#16654e]" />
          <span>Generate Report</span>
        </button>
      </div>

      {/* KPI 4-Card Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Pending Verifications */}
        <div
          onClick={() => onNavigateTab("verifications")}
          className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-1.5 text-amber-600">
              <Clock className="w-5 h-5" />
              <span className="text-xs font-semibold uppercase tracking-wider">
                pending_actions
              </span>
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200/60">
              PENDING
            </span>
          </div>
          <div className="text-3xl font-extrabold text-gray-900 mb-1 tracking-tight">
            {stats.pendingVerifications}
          </div>
          <p className="text-xs font-medium text-gray-500">
            Pending Verifications
          </p>
        </div>

        {/* Card 2: Flagged Profiles */}
        <div
          onClick={() => onNavigateTab("reports")}
          className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-1.5 text-rose-600">
              <Flag className="w-5 h-5" />
              <span className="text-xs font-semibold uppercase tracking-wider">
                flag
              </span>
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200/60">
              URGENT
            </span>
          </div>
          <div className="text-3xl font-extrabold text-gray-900 mb-1 tracking-tight">
            {stats.flaggedProfiles}
          </div>
          <p className="text-xs font-medium text-gray-500">
            Flagged Profiles
          </p>
        </div>

        {/* Card 3: Total Providers */}
        <div
          onClick={() => onNavigateTab("users")}
          className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-1.5 text-teal-600">
              <Wrench className="w-5 h-5" />
              <span className="text-xs font-semibold uppercase tracking-wider">
                engineering
              </span>
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200/60">
              GROWTH
            </span>
          </div>
          <div className="text-3xl font-extrabold text-gray-900 mb-1 tracking-tight">
            {stats.totalProviders}
          </div>
          <p className="text-xs font-medium text-gray-500">
            Total Providers
          </p>
        </div>

        {/* Card 4: Total Bookings */}
        <div
          onClick={() => onNavigateTab("analytics")}
          className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-1.5 text-slate-600">
              <Calendar className="w-5 h-5" />
              <span className="text-xs font-semibold uppercase tracking-wider">
                calendar_month
              </span>
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
              ACTIVITY
            </span>
          </div>
          <div className="text-3xl font-extrabold text-gray-900 mb-1 tracking-tight">
            {stats.totalBookings}
          </div>
          <p className="text-xs font-medium text-gray-500">
            Total Bookings
          </p>
        </div>
      </div>

      {/* Middle Row: Recent Verification Requests & Recent Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Recent Verification Requests */}
        <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <h2 className="text-base font-bold text-gray-900">
                Recent Verification Requests
              </h2>
              <button
                onClick={() => onNavigateTab("verifications")}
                className="text-xs font-medium text-gray-500 hover:text-[#16654e] lowercase transition cursor-pointer"
              >
                history
              </button>
            </div>

            <div className="divide-y divide-gray-100 mt-2">
              {recentVerifications.map((item) => (
                <div
                  key={item.id}
                  className="py-3.5 flex items-center justify-between gap-3 hover:bg-gray-50/70 px-2 rounded-xl transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gray-100 text-gray-700 font-bold text-xs flex items-center justify-center border border-gray-200 shrink-0">
                      {item.initials}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 leading-tight">
                        {item.name}
                      </h4>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {item.time}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      // Find matched full worker or fallback
                      const worker = verifications.find((v) => v.id === item.id) || {
                        id: item.id,
                        name: item.name,
                        category: item.category || "Professional Service",
                        phone: "+880 1711-xxxxxx",
                        joinedDate: "Jan 2024",
                        totalSubmissions: 1,
                        selfieImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80"
                      };
                      onReviewWorker(worker);
                    }}
                    className="px-3.5 py-1.5 text-xs font-medium border border-gray-300 rounded-lg hover:border-[#16654e] hover:text-[#16654e] hover:bg-emerald-50/40 text-gray-700 transition cursor-pointer shrink-0"
                  >
                    Review
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-gray-100 text-right">
            <button
              onClick={() => onNavigateTab("verifications")}
              className="text-xs font-semibold text-[#16654e] hover:underline inline-flex items-center gap-1 cursor-pointer"
            >
              <span>View full verification queue</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Column: Recent Reports */}
        <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <h2 className="text-base font-bold text-gray-900">
                Recent Reports
              </h2>
              <button
                onClick={() => onNavigateTab("reports")}
                className="text-xs font-medium text-rose-600 hover:text-rose-700 lowercase transition cursor-pointer"
              >
                report
              </button>
            </div>

            <div className="divide-y divide-gray-100 mt-2">
              {recentReports.map((report) => {
                const Icon = report.icon;
                return (
                  <div
                    key={report.id}
                    className="py-3.5 flex items-center justify-between gap-3 hover:bg-gray-50/70 px-2 rounded-xl transition"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${report.color}`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 leading-tight">
                          {report.name}
                        </h4>
                        <p className="text-xs text-rose-500 mt-0.5 font-medium">
                          {report.issue}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => onNavigateTab("reports")}
                      className="px-3.5 py-1.5 text-xs font-medium border border-gray-300 rounded-lg hover:border-gray-400 hover:bg-gray-100 text-gray-700 transition cursor-pointer shrink-0"
                    >
                      View
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-gray-100 text-right">
            <button
              onClick={() => onNavigateTab("reports")}
              className="text-xs font-semibold text-[#16654e] hover:underline inline-flex items-center gap-1 cursor-pointer"
            >
              <span>Manage safety & reports</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Section: Provider Density Map */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-gray-900">
              Provider Density
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Real-time geographical concentration of verified workforce
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              1,240 Online Active
            </span>
          </div>
        </div>

        {/* Map Visualization Container */}
        <div className="relative w-full h-72 sm:h-80 bg-[#17252a] rounded-xl overflow-hidden border border-gray-800 flex items-center justify-center">
          {/* Simulated Dark Mode City Map Grid & Road Lines */}
          <svg
            className="absolute inset-0 w-full h-full opacity-30"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern
                id="mapGrid"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 40 0 L 0 0 0 40"
                  fill="none"
                  stroke="#3aafa9"
                  strokeWidth="0.5"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#mapGrid)" />
            {/* River curve */}
            <path
              d="M 50 0 C 150 100, 200 180, 260 320"
              stroke="#204051"
              strokeWidth="16"
              fill="none"
              opacity="0.8"
            />
            {/* Main transit arteries */}
            <path
              d="M 0 120 Q 200 130 500 110"
              stroke="#2b7a78"
              strokeWidth="2.5"
              fill="none"
              opacity="0.4"
            />
            <path
              d="M 180 0 L 220 320"
              stroke="#2b7a78"
              strokeWidth="2.5"
              fill="none"
              opacity="0.4"
            />
            <path
              d="M 380 0 L 320 320"
              stroke="#2b7a78"
              strokeWidth="2"
              fill="none"
              opacity="0.4"
            />
          </svg>

          {/* Hotspot pulses across zone */}
          {NETWORK_HOTSPOTS.map((hotspot, idx) => (
            <div
              key={idx}
              style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
              onClick={() => setSelectedHotspot(hotspot)}
              className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
            >
              {/* Pulse rings */}
              <span className="absolute -inset-3 rounded-full bg-emerald-400/20 animate-ping" />
              <span className="absolute -inset-1.5 rounded-full bg-teal-400/40" />
              <span className="relative block w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-emerald-950 shadow-lg shadow-emerald-400/50 group-hover:scale-125 transition-transform" />

              {/* Tooltip on hover */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:flex flex-col items-center pointer-events-none z-20">
                <div className="bg-gray-900/95 text-white text-[11px] font-medium px-2.5 py-1 rounded-md shadow-xl border border-gray-700 whitespace-nowrap">
                  <span className="font-bold text-emerald-400">{hotspot.city}</span>: {hotspot.count} Active Providers
                </div>
                <div className="w-1.5 h-1.5 bg-gray-900/95 rotate-45 -mt-1" />
              </div>
            </div>
          ))}

          {/* Central Live Activity Badge as shown in Screenshot 2 */}
          <div className="relative z-10 px-5 py-2.5 rounded-full bg-white/95 backdrop-blur-md shadow-2xl border border-gray-200/80 flex items-center gap-2 text-gray-800 text-xs font-bold tracking-wide">
            <MapPin className="w-4 h-4 text-[#16654e]" />
            <span>location_on Live Network Activity</span>
          </div>

          {/* Zone Stats Overlay in bottom corner */}
          <div className="absolute bottom-3 left-3 bg-gray-900/80 backdrop-blur-md border border-gray-700/80 rounded-lg px-3 py-1.5 text-[11px] text-gray-300">
            Coverage: <span className="text-emerald-400 font-semibold">98.4% Metropolitan Area</span>
          </div>
        </div>
      </div>

      {/* Generate Report Modal */}
      {reportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#16654e]" />
                <h3 className="font-bold text-base text-gray-900">
                  Generate Administrative Report
                </h3>
              </div>
              <button
                onClick={() => setReportModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-lg p-1"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-3 text-sm text-gray-600">
              <p>
                Select the parameters to compile an audit report for Nirbhor:
              </p>
              <div className="space-y-2">
                <label className="flex items-center gap-2 p-2.5 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
                  <input type="checkbox" defaultChecked className="accent-[#16654e] rounded" />
                  <span>Verification Status & Level 1/2 Approvals</span>
                </label>
                <label className="flex items-center gap-2 p-2.5 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
                  <input type="checkbox" defaultChecked className="accent-[#16654e] rounded" />
                  <span>Flagged Profiles & Trust Safety Moderation</span>
                </label>
                <label className="flex items-center gap-2 p-2.5 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
                  <input type="checkbox" defaultChecked className="accent-[#16654e] rounded" />
                  <span>Geographic Provider Density & Bookings Summary</span>
                </label>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2.5">
              <button
                onClick={() => setReportModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert("Report generated successfully as PDF/CSV for Nirbhor Trust Portal.");
                  setReportModalOpen(false);
                }}
                className="px-4 py-2 text-xs font-semibold bg-[#16654e] hover:bg-[#114f3d] text-white rounded-xl shadow-xs inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Audit Report</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


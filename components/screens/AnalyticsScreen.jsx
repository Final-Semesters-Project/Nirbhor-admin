"use client";

import React, { useState, useEffect } from "react";
import {
  Download,
  Users,
  Calendar,
  Star,
  Wrench,
  MoreVertical,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  CheckCircle,
  FileSpreadsheet,
  RotateCw,
} from "lucide-react";
import { adminService } from "@/lib/adminService";

export default function AnalyticsScreen() {
  const [downloadToast, setDownloadToast] = useState(false);
  const [hoveredDay, setHoveredDay] = useState(null);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAnalytics = async () => {
    setIsLoading(true);
    try {
      const data = await adminService.getAnalytics();
      setAnalyticsData(data);
    } catch (err) {
      console.warn("Could not fetch live analytics:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  // Compute weekly chart bars from bookings_per_week if available
  const defaultWeeklyData = [
    { day: "Mon", bookings: 4600, height: 42 },
    { day: "Tue", bookings: 5400, height: 50 },
    { day: "Wed", bookings: 6800, height: 68 },
    { day: "Thu", bookings: 6100, height: 58 },
    { day: "Fri", bookings: 7900, height: 82 },
    { day: "Sat", bookings: 9200, height: 95 },
    { day: "Sun", bookings: 5800, height: 55 }
  ];

  let weeklyData = defaultWeeklyData;
  if (analyticsData?.bookings_per_week && analyticsData.bookings_per_week.length > 0) {
    const maxCount = Math.max(...analyticsData.bookings_per_week.map((b) => b.count), 1);
    weeklyData = analyticsData.bookings_per_week.slice(-7).map((b) => {
      const date = new Date(b.week_start);
      const dayLabel = date.toLocaleDateString("en-US", { weekday: "short" });
      const heightPercent = Math.min(100, Math.max(15, Math.round((b.count / maxCount) * 100)));
      return {
        day: dayLabel,
        bookings: b.count,
        height: heightPercent
      };
    });
  }

  const totalUsersDisplay = analyticsData?.total_users != null
    ? analyticsData.total_users.toLocaleString()
    : "0";
  const totalBookingsDisplay = analyticsData?.total_bookings != null
    ? analyticsData.total_bookings.toLocaleString()
    : "0";
  const avgRatingDisplay = analyticsData?.average_provider_rating != null
    ? analyticsData.average_provider_rating.toFixed(1)
    : "0.0";
  const activeProvidersDisplay = analyticsData?.active_providers_count != null
    ? analyticsData.active_providers_count.toLocaleString()
    : "0";
  const seekerCount = analyticsData?.seeker_count ?? 0;
  const providerCount = analyticsData?.provider_count ?? 0;
  const ratioDisplay = analyticsData?.seeker_to_provider_ratio != null
    ? `${analyticsData.seeker_to_provider_ratio.toFixed(2)} : 1`
    : "0 : 1";

  const handleDownloadCSV = () => {
    setDownloadToast(true);
    setTimeout(() => setDownloadToast(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {downloadToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-gray-900 text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-xl border border-gray-700 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>Nirbhor_Platform_Analytics_Report.csv downloaded.</span>
        </div>
      )}

      {/* Top Header matching Screenshot 2 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Platform Analytics
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Real-time ecosystem health and platform volume metrics.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchAnalytics}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-3.5 py-2 border border-emerald-200 rounded-xl bg-emerald-50/70 hover:bg-emerald-100/70 text-xs font-semibold text-[#146356] shadow-2xs transition cursor-pointer disabled:opacity-50"
            title="Refresh Live Data"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
            <span>{isLoading ? "Refreshing..." : "Refresh"}</span>
          </button>

          <button
            onClick={handleDownloadCSV}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#146356] hover:bg-[#104e43] text-white rounded-xl text-xs font-semibold shadow-2xs transition cursor-pointer self-start sm:self-auto"
          >
            <Download className="w-4 h-4 text-white" />
            <span>Download CSV Report</span>
          </button>
        </div>
      </div>

      {/* 4 KPI Stat Cards matching Screenshot 2 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: TOTAL USERS */}
        <div className="bg-white rounded-2xl border border-gray-200/90 p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-gray-700">
              <Users className="w-4 h-4 text-gray-600" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                TOTAL USERS
              </span>
            </div>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-200/60">
              Live
            </span>
          </div>
          <div className="text-3xl font-extrabold text-gray-900 tracking-tight">
            {totalUsersDisplay}
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Total Registered Users
          </p>
        </div>

        {/* Card 2: TOTAL BOOKINGS */}
        <div className="bg-white rounded-2xl border border-gray-200/90 p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-gray-700">
              <Calendar className="w-4 h-4 text-teal-600" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                TOTAL BOOKINGS
              </span>
            </div>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200/60">
              Live
            </span>
          </div>
          <div className="text-3xl font-extrabold text-gray-900 tracking-tight">
            {totalBookingsDisplay}
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Total Platform Bookings
          </p>
        </div>

        {/* Card 3: AVG RATING */}
        <div className="bg-white rounded-2xl border border-gray-200/90 p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-amber-500">
              <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                AVG RATING
              </span>
            </div>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 border border-gray-200">
              Verified
            </span>
          </div>
          <div className="text-3xl font-extrabold text-gray-900 tracking-tight">
            {avgRatingDisplay}
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Average Provider Rating
          </p>
        </div>

        {/* Card 4: ACTIVE PROVIDERS */}
        <div className="bg-white rounded-2xl border border-gray-200/90 p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-emerald-600">
              <Wrench className="w-4 h-4 text-[#146356]" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                ACTIVE PROVIDERS
              </span>
            </div>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-[#146356] border border-emerald-200/60">
              Active
            </span>
          </div>
          <div className="text-3xl font-extrabold text-gray-900 tracking-tight">
            {activeProvidersDisplay}
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Active Service Providers
          </p>
        </div>
      </div>

      {/* Middle Row (Weekly Bookings Chart + Seeker vs Provider Ratio) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Bookings per Week Bar Chart */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-gray-200/90 p-6 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-gray-900">
                  Bookings per Week
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Volume over the last 7 days
                </p>
              </div>

              <button
                className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition cursor-pointer"
                title="Options"
              >
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>

            {/* Interactive Bar Chart matching Screenshot 2 */}
            <div className="mt-8 pt-4 pb-2">
              <div className="h-56 flex items-end justify-between gap-3 sm:gap-6 px-2 sm:px-6 border-b border-gray-200 relative">
                {/* Horizontal guide lines */}
                <div className="absolute inset-x-0 top-0 border-b border-gray-100" />
                <div className="absolute inset-x-0 top-1/4 border-b border-gray-100" />
                <div className="absolute inset-x-0 top-2/4 border-b border-gray-100" />
                <div className="absolute inset-x-0 top-3/4 border-b border-gray-100" />

                {weeklyData.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex-1 flex flex-col items-center h-full justify-end relative group cursor-pointer"
                    onMouseEnter={() => setHoveredDay(item)}
                    onMouseLeave={() => setHoveredDay(null)}
                  >
                    {/* Tooltip on hover */}
                    {hoveredDay?.day === item.day && (
                      <div className="absolute -top-10 bg-gray-900 text-white text-[11px] font-semibold py-1 px-2.5 rounded-md shadow-lg pointer-events-none z-10 whitespace-nowrap animate-in fade-in duration-100">
                        {item.bookings.toLocaleString()} bookings
                      </div>
                    )}

                    {/* Bar */}
                    <div
                      className="w-full max-w-[36px] bg-gradient-to-t from-[#146356] to-[#208b7a] rounded-t-lg transition-all duration-300 group-hover:from-[#0e493f] group-hover:to-[#176a5c]"
                      style={{ height: `${item.height}%` }}
                    />
                  </div>
                ))}
              </div>

              {/* Day Labels matching Screenshot 2 */}
              <div className="flex items-center justify-between gap-3 sm:gap-6 px-2 sm:px-6 pt-3 text-xs font-semibold text-gray-500">
                {weeklyData.map((item, idx) => (
                  <div key={idx} className="flex-1 text-center">
                    {item.day}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Seeker vs Provider Ratio matching Screenshot 2 */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-gray-200/90 p-6 shadow-2xs flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-gray-900">
              Seeker vs Provider Ratio
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Demand vs Supply Distribution
            </p>

            {/* Central Graphic Box */}
            <div className="my-8 flex flex-col items-center justify-center relative">
              {/* Outer square frame card */}
              <div className="relative w-40 h-40 rounded-2xl border-4 border-gray-200 flex flex-col items-center justify-center bg-gray-50/50">
                <span className="text-2xl font-extrabold text-gray-900 tracking-tight">
                  {ratioDisplay}
                </span>
                <span className="text-[11px] font-bold text-gray-400 mt-0.5">
                  Market Ratio
                </span>

                {/* Overlapping inverted teal chevron marker matching Screenshot 2 */}
                <svg
                  className="absolute -bottom-6 w-32 h-16 drop-shadow-sm pointer-events-none"
                  viewBox="0 0 120 60"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10 10 L60 50 L110 10"
                    stroke="#146356"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Legend matching Screenshot 2 */}
          <div className="pt-4 border-t border-gray-100 space-y-1.5 text-xs font-semibold">
            <div className="flex items-center justify-between text-gray-700">
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#146356]"></span>
                <span>Seekers ({seekerCount.toLocaleString()})</span>
              </span>
              <span className="font-bold text-gray-900">
                {seekerCount + providerCount > 0
                  ? `${(((seekerCount) / (seekerCount + providerCount)) * 100).toFixed(1)}%`
                  : "65.6%"}
              </span>
            </div>

            <div className="flex items-center justify-between text-gray-500">
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-gray-300"></span>
                <span>Providers ({providerCount.toLocaleString()})</span>
              </span>
              <span className="font-bold text-gray-700">
                {seekerCount + providerCount > 0
                  ? `${(((providerCount) / (seekerCount + providerCount)) * 100).toFixed(1)}%`
                  : "34.4%"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row matching Screenshot 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Market Growth Insight (Dark teal card) */}
        <div className="lg:col-span-5 bg-[#146356] text-white rounded-2xl p-6 shadow-xs flex flex-col justify-between relative overflow-hidden">
          {/* Subtle gradient pattern */}
          <div className="absolute -top-12 -right-12 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />

          <div>
            <span className="inline-block text-xs font-bold uppercase tracking-wider text-emerald-200 mb-3">
              Market Growth Insight
            </span>
            <p className="text-base sm:text-lg font-medium text-white/95 leading-relaxed">
              &quot;Demand for home-cleaning services rose by 40% this quarter in Dhaka North.&quot;
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-white/15">
            <button
              onClick={() => alert("Opening comprehensive Dhaka North Sector Expansion Report...")}
              className="inline-flex items-center gap-2 text-xs font-bold text-emerald-200 hover:text-white transition hover:underline cursor-pointer"
            >
              <span>View Sector Report</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right: Verification Efficiency */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-gray-200/90 p-6 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-4 flex-1">
            <div>
              <h3 className="text-base font-bold text-gray-900">
                Verification Efficiency
              </h3>
              <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                Admin response time for provider verification has improved by 2 days compared to last month.
              </p>
            </div>

            {/* Progress track */}
            <div className="space-y-1.5">
              <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#146356] rounded-full transition-all duration-700"
                  style={{ width: "78%" }}
                />
              </div>
              <p className="text-[11px] font-medium text-gray-400">
                78% faster than national average.
              </p>
            </div>
          </div>

          {/* Futuristic Isometric Laptop / Analytics Graphic as in Screenshot 2 */}
          <div className="w-32 h-28 bg-gradient-to-br from-slate-900 via-[#103b33] to-[#146356] rounded-xl p-3 shrink-0 flex items-center justify-center shadow-md border border-gray-800">
            <svg
              className="w-20 h-20 text-emerald-300 drop-shadow"
              viewBox="0 0 80 80"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Isometric base */}
              <polygon points="40,10 70,25 40,40 10,25" fill="#1b5e50" opacity="0.8" />
              {/* Screen hologram */}
              <polygon points="15,26 40,39 40,65 15,50" fill="#134e42" />
              <polygon points="40,39 65,26 65,50 40,65" fill="#166555" />
              {/* Glowing charts on screen */}
              <line x1="22" y1="42" x2="35" y2="49" stroke="#34d399" strokeWidth="2" />
              <line x1="22" y1="47" x2="32" y2="52" stroke="#6ee7b7" strokeWidth="1.5" />
              <circle cx="40" cy="25" r="4" fill="#10b981" />
              <line x1="40" y1="20" x2="40" y2="12" stroke="#a7f3d0" strokeWidth="2" strokeDasharray="2 2" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

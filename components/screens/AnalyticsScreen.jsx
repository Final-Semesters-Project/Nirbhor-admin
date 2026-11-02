"use client";

import React, { useState, useEffect } from "react";
import {
  Download,
  Users,
  Calendar,
  Star,
  Wrench,
  CheckCircle,
  RotateCw,
  TrendingUp,
} from "lucide-react";
import { adminService } from "@/lib/adminService";

export default function AnalyticsScreen() {
  const [downloadToast, setDownloadToast] = useState(false);
  const [hoveredDay, setHoveredDay] = useState(null);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch live analytics from /api/v1/admin/analytics
  const fetchAnalytics = async () => {
    setIsLoading(true);
    try {
      const data = await adminService.getAnalytics();
      if (data && typeof data === "object") {
        setAnalyticsData(data);
      }
    } catch (err) {
      console.warn("Could not fetch live analytics:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  // Compute metrics from live API data
  const totalUsersDisplay =
    analyticsData?.total_users != null
      ? analyticsData.total_users.toLocaleString()
      : "0";

  const totalBookingsDisplay =
    analyticsData?.total_bookings != null
      ? analyticsData.total_bookings.toLocaleString()
      : "0";

  const avgRatingDisplay =
    analyticsData?.average_provider_rating != null
      ? Number(analyticsData.average_provider_rating).toFixed(1)
      : "0.0";

  const activeProvidersDisplay =
    analyticsData?.active_providers_count != null
      ? analyticsData.active_providers_count.toLocaleString()
      : "0";

  const seekerCount = analyticsData?.seeker_count ?? 0;
  const providerCount = analyticsData?.provider_count ?? 0;
  const totalAudience = seekerCount + providerCount;

  const seekerPercent =
    totalAudience > 0
      ? ((seekerCount / totalAudience) * 100).toFixed(1)
      : "0.0";

  const providerPercent =
    totalAudience > 0
      ? ((providerCount / totalAudience) * 100).toFixed(1)
      : "0.0";

  const ratioDisplay =
    analyticsData?.seeker_to_provider_ratio != null
      ? `${Number(analyticsData.seeker_to_provider_ratio).toFixed(1)} : 1`
      : "0 : 1";

  // Compute weekly bookings bars from bookings_per_week API array
  const rawWeeks = Array.isArray(analyticsData?.bookings_per_week)
    ? analyticsData.bookings_per_week
    : [];

  const maxCount = Math.max(
    ...rawWeeks.map((b) => (typeof b.count === "number" ? b.count : 0)),
    1
  );

  const weeklyData = rawWeeks.map((b, idx) => {
    const date = b.week_start ? new Date(b.week_start) : null;
    const isValidDate = date && !isNaN(date.getTime());
    const dayLabel = isValidDate
      ? date.toLocaleDateString("en-US", { weekday: "short" })
      : `W${idx + 1}`;
    const dateLabel = isValidDate
      ? date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
      : `Week ${idx + 1}`;
    const count = typeof b.count === "number" ? b.count : 0;
    const heightPercent =
      count > 0
        ? Math.min(100, Math.max(15, Math.round((count / maxCount) * 100)))
        : 4;

    return {
      day: dayLabel,
      dateLabel,
      bookings: count,
      height: heightPercent,
    };
  });

  // Export live analytics data as CSV
  const handleDownloadCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [
        "Metric,Value",
        `Total Users,${analyticsData?.total_users ?? 0}`,
        `Total Bookings,${analyticsData?.total_bookings ?? 0}`,
        `Average Provider Rating,${analyticsData?.average_provider_rating ?? 0}`,
        `Active Providers,${analyticsData?.active_providers_count ?? 0}`,
        `Seeker Count,${analyticsData?.seeker_count ?? 0}`,
        `Provider Count,${analyticsData?.provider_count ?? 0}`,
        `Seeker to Provider Ratio,${analyticsData?.seeker_to_provider_ratio ?? 0}:1`,
        "",
        "Week Start,Bookings Count",
        ...(analyticsData?.bookings_per_week || []).map(
          (b) => `"${b.week_start}",${b.count}`
        ),
      ].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `nirbhor_analytics_${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadToast(true);
    setTimeout(() => setDownloadToast(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {downloadToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-gray-900 text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-xl border border-gray-700 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>Analytics CSV export downloaded successfully.</span>
        </div>
      )}

      {/* Top Header */}
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
            className="inline-flex items-center gap-2 px-3.5 py-2 border border-emerald-200 rounded-xl bg-emerald-50/70 hover:bg-emerald-100/70 text-xs font-semibold text-[#16654e] shadow-2xs transition cursor-pointer disabled:opacity-50"
            title="Refresh Live Data"
          >
            <RotateCw
              className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-[#16654e]" : ""}`}
            />
            <span>{isLoading ? "Refreshing..." : "Refresh"}</span>
          </button>

          <button
            onClick={handleDownloadCSV}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#16654e] hover:bg-[#125340] text-white rounded-xl text-xs font-semibold shadow-2xs transition cursor-pointer self-start sm:self-auto"
          >
            <Download className="w-4 h-4 text-white" />
            <span>Download CSV</span>
          </button>
        </div>
      </div>

      {/* 4 KPI Stat Cards */}
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
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60">
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
              <Calendar className="w-4 h-4 text-[#16654e]" />
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
              <Wrench className="w-4 h-4 text-[#16654e]" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                ACTIVE PROVIDERS
              </span>
            </div>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-[#16654e] border border-emerald-200/60">
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
                  Volume trends from live platform activity
                </p>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                <TrendingUp className="w-3.5 h-3.5 text-[#16654e]" />
                <span>Weekly Trends</span>
              </div>
            </div>

            {/* Interactive Bar Chart */}
            <div className="mt-8 pt-4 pb-2">
              {weeklyData.length === 0 ? (
                <div className="h-56 flex flex-col items-center justify-center text-center">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 text-[#16654e] flex items-center justify-center mb-2">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <p className="text-sm font-semibold text-gray-800">
                    No Weekly Bookings Yet
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Live booking volume trends will appear here as bookings are placed.
                  </p>
                </div>
              ) : (
                <>
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
                        {hoveredDay === item && (
                          <div className="absolute -top-10 bg-gray-900 text-white text-[11px] font-semibold py-1 px-2.5 rounded-md shadow-lg pointer-events-none z-10 whitespace-nowrap animate-in fade-in duration-100">
                            {item.bookings.toLocaleString()} bookings (
                            {item.dateLabel})
                          </div>
                        )}

                        {/* Bar */}
                        <div
                          className={`w-full max-w-[42px] rounded-t-lg transition-all duration-300 ${
                            item.bookings > 0
                              ? "bg-gradient-to-t from-[#16654e] to-[#22c55e] group-hover:from-[#125340] group-hover:to-[#16a34a]"
                              : "bg-gray-200/80 group-hover:bg-gray-300"
                          }`}
                          style={{
                            height: item.bookings > 0 ? `${item.height}%` : "6px",
                          }}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Day / Date Labels */}
                  <div className="flex items-center justify-between gap-3 sm:gap-6 px-2 sm:px-6 pt-3 text-xs font-semibold text-gray-500">
                    {weeklyData.map((item, idx) => (
                      <div key={idx} className="flex-1 text-center">
                        <div>{item.day}</div>
                        <div className="text-[10px] text-gray-400 font-normal">
                          {item.dateLabel}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right: Seeker vs Provider Ratio */}
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
              <div className="relative w-40 h-40 rounded-2xl border-4 border-gray-200 flex flex-col items-center justify-center bg-gray-50/50">
                <span className="text-2xl font-extrabold text-gray-900 tracking-tight">
                  {ratioDisplay}
                </span>
                <span className="text-[11px] font-bold text-gray-400 mt-0.5">
                  Market Ratio
                </span>

                {/* Overlapping inverted teal chevron marker */}
                <svg
                  className="absolute -bottom-6 w-32 h-16 drop-shadow-sm pointer-events-none"
                  viewBox="0 0 120 60"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10 10 L60 50 L110 10"
                    stroke="#16654e"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="pt-4 border-t border-gray-100 space-y-1.5 text-xs font-semibold">
            <div className="flex items-center justify-between text-gray-700">
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#16654e]"></span>
                <span>Seekers ({seekerCount.toLocaleString()})</span>
              </span>
              <span className="font-bold text-gray-900">
                {seekerPercent}%
              </span>
            </div>

            <div className="flex items-center justify-between text-gray-500">
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-gray-300"></span>
                <span>Providers ({providerCount.toLocaleString()})</span>
              </span>
              <span className="font-bold text-gray-700">
                {providerPercent}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

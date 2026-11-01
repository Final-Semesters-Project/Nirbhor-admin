"use client";

import React from "react";

/**
 * Nirbhor Brand Logo
 * A refined, modern tech emblem inspired by seamless connection, reliability,
 * and service trust. Clean geometric loops meeting in harmony.
 */
export default function NirbhorLogo({ 
  variant = "dark", // "dark" (emerald icon + dark text), "light" (white/mint icon + white text), "icon-only"
  size = "md", // "sm", "md", "lg", "xl"
  showAdminBadge = false,
  subtitle = null,
  className = "" 
}) {
  const iconSizes = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
    xl: "w-14 h-14"
  };

  const textSizes = {
    sm: "text-lg font-bold",
    md: "text-2xl font-bold tracking-tight",
    lg: "text-3xl font-extrabold tracking-tight",
    xl: "text-4xl font-extrabold tracking-tight"
  };

  const isLight = variant === "light";

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Premium Minimalist Geometric Emblem */}
      <div className={`relative shrink-0 flex items-center justify-center ${iconSizes[size] || iconSizes.md}`}>
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-xs"
        >
          {isLight ? (
            /* Light theme (for Dark Teal Sidebar) */
            <>
              {/* White circular badge */}
              <circle cx="50" cy="50" r="48" fill="#ffffff" />
              {/* Stylized interconnected Nirbhor Trust ribbon (Dark Teal) */}
              <path
                d="M32 72V30C32 28.5 33.2 27.5 34.6 28L42 30.5V70H34C32.9 70 32 69.1 32 68V72Z"
                fill="#146356"
              />
              <path
                d="M68 28V70C68 71.5 66.8 72.5 65.4 72L58 69.5V30H66C67.1 30 68 30.9 68 32V28Z"
                fill="#146356"
              />
              <path
                d="M34 32L65 68C66.5 69.8 69.5 68.7 69.5 66.4V34C69.5 31.8 67.7 30 65.5 30H63L32 66C30.5 64.2 27.5 65.3 27.5 67.6V34C27.5 31.8 29.3 30 31.5 30H34V32Z"
                fill="#146356"
              />
              <circle cx="68" cy="28" r="7" fill="#10b981" />
            </>
          ) : (
            /* Dark theme (for Login Screen & Light Backgrounds) */
            <>
              {/* Primary Emerald Circle */}
              <circle cx="50" cy="50" r="48" fill="#165a46" />
              
              {/* Dynamic curved white ribbon creating modern, fluid 'N' & synergy loop */}
              <path
                d="M31 26C31 23.7909 32.7909 22 35 22H37C39.2091 22 41 23.7909 41 26V53L60.2 26.6C61.8 24.4 64.3 23 67 23H68C70.2091 23 72 24.7909 72 27V74C72 76.2091 70.2091 78 68 78H66C63.7909 78 62 76.2091 62 74V47L42.8 73.4C41.2 75.6 38.7 77 36 77H35C32.7909 77 31 75.2091 31 73V26Z"
                fill="#ffffff"
              />
              {/* Vibrant accent dot representing trusted verification */}
              <circle cx="68" cy="27" r="7" fill="#34d399" />
            </>
          )}
        </svg>
      </div>

      {/* Typography: "Nirbhor" */}
      {variant !== "icon-only" && (
        <div className="flex flex-col leading-tight">
          <div className="flex items-center gap-2">
            <span
              className={`${textSizes[size] || textSizes.md} font-bold ${
                isLight ? "text-white" : "text-[#165a46]"
              }`}
              style={{
                fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                letterSpacing: "-0.035em"
              }}
            >
              Nirbhor
            </span>

            {/* Optional Admin Badge - strictly false on login screen */}
            {showAdminBadge && (
              <span
                className={`text-[9px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded ${
                  isLight
                    ? "bg-white/20 text-emerald-100"
                    : "bg-emerald-100 text-emerald-800"
                }`}
              >
                Admin
              </span>
            )}
          </div>

          {subtitle && (
            <span
              className={`text-[11px] font-medium tracking-wide ${
                isLight ? "text-emerald-100/75" : "text-gray-500"
              }`}
            >
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

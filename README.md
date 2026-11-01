# Nirbhor Admin Portal - Verified Trust & Moderation Platform

A modern, responsive, and secure administrative dashboard built with Next.js, React, and Tailwind CSS for the **Nirbhor** workforce ecosystem.

---

## 🌟 Key Features

1. **Admin Authentication (Screen 1)**
   - High-fidelity login interface with custom Nirbhor Trust Logo.
   - Email/password authentication with toggleable visibility.
   - Pre-filled authorized demo credentials for rapid inspection (`admin@nirbhor.com`).

2. **Dashboard Overview (Screen 2)**
   - **4 KPI Metric Cards**: Pending Verifications (12), Flagged Profiles (5), Total Providers (1,240), Total Bookings (8,450).
   - **Recent Verification Requests**: Quick review trigger for pending applicants.
   - **Recent Reports Feed**: Incident warnings and safety alerts.
   - **Live Network Activity & Provider Density**: Geographic cluster visualization across service zones.
   - **Generate Report**: Modal to compile and export administrative audit reports.

3. **Verification Requests Queue (Screen 3)**
   - Multi-tier filtering: All, Basic (Level 1), and Document Pending (Level 2).
   - Structured table with profile avatars, contact details, registration timestamps, verification levels, and actions.
   - Summary cards displaying "Approved Today" counter and review SLA metrics.

4. **Document Verification Detail View (Screen 4)**
   - Security risk warning banner.
   - Applicant profile summary and biometric live selfie verification.
   - National ID Card Front & Back restricted audit previews with zoom modal.
   - Decision console: Rejection reason justification, auditable Reject and Approve workflows.

5. **Reports & Moderation Console (Screen 5)**
   - Safety feeds categorized by High Risk, Pending, and Resolved statuses.
   - Incident cards with booking context, reporter identities, and violation descriptions.
   - Action triggers: "View Booking Context", "View Chat Log", "View Provider History", "Suspend Account", and "Dismiss".

6. **Full English Localization**
   - 100% clean English text across all screens, badges, filters, and reports with zero bilingual/Bangla clutter.

---

## 📁 Project Structure

```
nirbhor-/
├── app/
│   ├── globals.css                       # Tailwind CSS styling and theme setup
│   ├── layout.js                          # Root HTML shell & metadata
│   └── page.js                            # Main application controller & state router
├── components/
│   ├── branding/
│   │   └── NirbhorLogo.jsx                # Responsive vector SVG trust emblem & wordmark
│   ├── layout/
│   │   └── AdminSidebar.jsx               # Deep teal sidebar with badges & admin profile
│   └── screens/
│       ├── LoginScreen.jsx                # Screen 1: Admin Login
│       ├── DashboardOverview.jsx          # Screen 2: System Status & KPI Overview
│       ├── VerificationRequests.jsx       # Screen 3: Verification Queue & Filters
│       ├── DocumentVerificationDetail.jsx # Screen 4: NID & Live Selfie Review
│       ├── ReportsAndFlags.jsx            # Screen 5: Community Safety & Moderation
│       ├── UserManagement.jsx             # Providers & Seekers Directory
│       └── AnalyticsScreen.jsx            # Growth & Category Distribution Insights
├── data/
│   └── mockData.js                        # Structured English dataset
└── public/                                # Static assets
```

---

## 🚀 Getting Started

To run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

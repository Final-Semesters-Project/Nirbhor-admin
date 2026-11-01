// Mock Data for Nirbhor Admin Portal (100% English)

export const INITIAL_STATS = {
  pendingVerifications: 12,
  flaggedProfiles: 5,
  totalProviders: "1,240",
  totalBookings: "8,450",
  approvedToday: 12,
  avgReviewTimeHours: 4.2,
  pendingDocsCount: 28,
  basicWaitingCount: 14,
};

export const INITIAL_VERIFICATIONS = [
  {
    id: "VER-101",
    name: "Md. Ariful Islam",
    phone: "+880 1711-234567",
    category: "Electrician / AC Repair",
    regDate: "10 Oct 2023",
    joinedDate: "Jan 2024",
    totalSubmissions: 1,
    level: "Level 2 (Document)",
    levelType: "level2",
    status: "PENDING",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    selfieImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
    submittedTime: "2 hours ago",
    nidNumber: "19942691500000843",
    address: "Mirpur-10, Dhaka 1216",
    documents: {
      nidFront: true,
      nidBack: true,
      tradeLicense: true
    }
  },
  {
    id: "VER-102",
    name: "Abdur Rahman",
    phone: "+880 1712-345678",
    category: "AC Technician & HVAC",
    regDate: "12 Oct 2023",
    joinedDate: "Dec 2023",
    totalSubmissions: 1,
    level: "Level 2 (Document)",
    levelType: "level2",
    status: "PENDING",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    selfieImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80",
    submittedTime: "2 hours ago",
    nidNumber: "19882691500004512",
    address: "Dhanmondi 27, Dhaka",
    documents: {
      nidFront: true,
      nidBack: true
    }
  },
  {
    id: "VER-103",
    name: "Sumaiya Akter",
    phone: "+880 1813-987654",
    category: "Housekeeper / Deep Clean",
    regDate: "14 Oct 2023",
    joinedDate: "Nov 2023",
    totalSubmissions: 1,
    level: "Level 1 (Basic)",
    levelType: "level1",
    status: "APPROVED",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
    selfieImage: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80",
    submittedTime: "3 hours ago",
    nidNumber: "19972691500009941",
    address: "Uttara Sector 7, Dhaka",
    documents: {
      nidFront: true,
      nidBack: false
    }
  },
  {
    id: "VER-104",
    name: "Rafiqul Islam",
    phone: "+880 1611-112233",
    category: "Plumbing & Sanitary",
    regDate: "15 Oct 2023",
    joinedDate: "Jan 2024",
    totalSubmissions: 2,
    level: "Level 2 (Document)",
    levelType: "level2",
    status: "PENDING",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80",
    selfieImage: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80",
    submittedTime: "4 hours ago",
    nidNumber: "19852691500007812",
    address: "Mohammadpur, Dhaka",
    documents: {
      nidFront: true,
      nidBack: true
    }
  },
  {
    id: "VER-105",
    name: "Marium Begum",
    phone: "+880 1915-445566",
    category: "Professional Cook & Catering",
    regDate: "16 Oct 2023",
    joinedDate: "Feb 2024",
    totalSubmissions: 1,
    level: "Level 1 (Basic)",
    levelType: "level1",
    status: "APPROVED",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
    selfieImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80",
    submittedTime: "1 day ago",
    nidNumber: "19922691500003319",
    address: "Gulshan-1, Dhaka",
    documents: {
      nidFront: true,
      nidBack: false
    }
  },
  {
    id: "VER-106",
    name: "Kamal Uddin",
    phone: "+880 1514-778899",
    category: "Carpenter & Furniture Assembly",
    regDate: "17 Oct 2023",
    joinedDate: "Feb 2024",
    totalSubmissions: 1,
    level: "Level 2 (Document)",
    levelType: "level2",
    status: "PENDING",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80",
    selfieImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=600&q=80",
    submittedTime: "1 day ago",
    nidNumber: "19782691500008890",
    address: "Badda, Dhaka",
    documents: {
      nidFront: true,
      nidBack: true
    }
  }
];

export const INITIAL_REPORTS = [
  {
    id: "REP-301",
    reportedUser: "Sumona Akter",
    userRole: "PROVIDER",
    timeAgo: "2 hours ago",
    riskLevel: "HIGH RISK",
    riskType: "high",
    reason: "Fraud suspected",
    description:
      "Provider asked for payment outside the app via personal mobile banking after accepting the booking. This is against the platform's security policy.",
    reportedBy: "Rahat K.",
    bookingId: "NB-9921",
    status: "PENDING",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "REP-302",
    reportedUser: "Arif Chowdhury",
    userRole: "SEEKER",
    timeAgo: "5 hours ago",
    riskLevel: "MEDIUM RISK",
    riskType: "medium",
    reason: "Rude behavior",
    description:
      "The user was using abusive language in the chat when I asked about his specific requirements for the home cleaning task.",
    reportedBy: "Mitu Islam",
    bookingId: "NB-8845",
    status: "PENDING",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "REP-303",
    reportedUser: "Kamal Uddin",
    userRole: "PROVIDER",
    timeAgo: "1 day ago",
    riskLevel: "MEDIUM RISK",
    riskType: "medium",
    reason: "No-show",
    description:
      "The provider did not show up at the scheduled time and stopped answering my calls. I waited for 3 hours.",
    reportedBy: "S. Mahmood",
    bookingId: "NB-9012",
    status: "PENDING",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80"
  }
];

// User Management data matching Screenshot 1 (media_1793563528659_1b41b88f.png)
export const INITIAL_USER_MANAGEMENT = [
  {
    id: "NB-2024-001",
    name: "Abdur Rahman",
    phone: "+880 1711-223344",
    role: "Provider",
    joinedDate: "12 Jan 2024",
    status: "Active",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
  },
  {
    id: "NB-2024-045",
    name: "Sumaiya Begum",
    phone: "+880 1812-998877",
    role: "Seeker",
    joinedDate: "20 Jan 2024",
    status: "Suspended",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80"
  },
  {
    id: "NB-2024-112",
    name: "Kamal Hossain",
    phone: "+880 1515-443322",
    role: "Provider",
    joinedDate: "05 Feb 2024",
    status: "Active",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80"
  },
  {
    id: "NB-2024-305",
    name: "Fatema Ahmed",
    phone: "+880 1913-112233",
    role: "Seeker",
    joinedDate: "14 Feb 2024",
    status: "Active",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80"
  },
  {
    id: "NB-2024-318",
    name: "Jasim Iqbal",
    phone: "+880 1618-556677",
    role: "Provider",
    joinedDate: "01 Mar 2024",
    status: "Active",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80"
  },
  {
    id: "NB-2024-521",
    name: "Nazma Sultana",
    phone: "+880 1311-889900",
    role: "Seeker",
    joinedDate: "10 Mar 2024",
    status: "Suspended",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80"
  }
];

export const NETWORK_HOTSPOTS = [
  { city: "Mirpur", count: 320, x: 38, y: 35, level: "high" },
  { city: "Dhanmondi", count: 280, x: 44, y: 55, level: "high" },
  { city: "Gulshan & Banani", count: 410, x: 58, y: 38, level: "very-high" },
  { city: "Uttara", count: 260, x: 52, y: 20, level: "high" },
  { city: "Mohammadpur", count: 190, x: 36, y: 50, level: "medium" },
  { city: "Motijheel / Old Dhaka", count: 220, x: 55, y: 68, level: "medium" },
  { city: "Badda / Rampura", count: 165, x: 62, y: 48, level: "medium" }
];

export const INITIAL_ADMINS = [
  {
    id: "ADM-001",
    name: "Rahim Ahmed",
    initials: "RA",
    phone: "+880 1711-209412",
    status: "Active",
    createdDate: "12 Jan 2024",
    lastActive: "2 hours ago",
    role: "Verification Admin",
    email: "rahim.ahmed@nirbhor.com"
  },
  {
    id: "ADM-002",
    name: "Karim Hossain",
    initials: "KH",
    phone: "+880 1823-456789",
    status: "Active",
    createdDate: "04 Feb 2024",
    lastActive: "15 minutes ago",
    role: "Safety & Moderation Admin",
    email: "karim.hossain@nirbhor.com"
  },
  {
    id: "ADM-003",
    name: "Nusrat Jahan",
    initials: "NA",
    phone: "+880 1914-789012",
    status: "Inactive",
    createdDate: "19 Feb 2024",
    lastActive: "5 days ago",
    role: "Support Admin",
    email: "nusrat.jahan@nirbhor.com"
  },
  {
    id: "ADM-004",
    name: "Tariqul Islam",
    initials: "TB",
    phone: "+880 1675-341988",
    status: "Active",
    createdDate: "28 Feb 2024",
    lastActive: "1 day ago",
    role: "Operations Admin",
    email: "tariqul.islam@nirbhor.com"
  },
  {
    id: "ADM-005",
    name: "Farzana Siddique",
    initials: "FS",
    phone: "+880 1552-984321",
    status: "Inactive",
    createdDate: "10 Mar 2024",
    lastActive: "3 weeks ago",
    role: "Auditing Officer",
    email: "farzana.siddique@nirbhor.com"
  }
];

export const INITIAL_AUDIT_LOGS = [
  {
    id: "LOG-101",
    admin: "Tanvir Mahmud",
    adminRole: "Super Admin",
    actionType: "Approved",
    actionColor: "emerald",
    iconType: "check",
    description: "Approved verification for provider Karim Ahmed",
    target: "Provider Karim Ahmed",
    timestamp: "Oct 18, 2026 at 2:34 PM",
    ip: "103.114.98.24",
    details: "National ID and biometric face match score 99.4%. Assigned Level 2 verification badge."
  },
  {
    id: "LOG-102",
    admin: "Tanvir Mahmud",
    adminRole: "Super Admin",
    actionType: "Suspension",
    actionColor: "rose",
    iconType: "slash",
    description: "Suspended admin account Rahim Hossain",
    target: "Admin Rahim Hossain",
    timestamp: "Oct 18, 2026 at 11:15 AM",
    ip: "103.114.98.24",
    details: "Administrative access revoked following policy review and failed credential verification."
  },
  {
    id: "LOG-103",
    admin: "Karim Hossain",
    adminRole: "Admin",
    actionType: "Created",
    actionColor: "blue",
    iconType: "user_plus",
    description: "Created new admin account for 01711234567",
    target: "Account 01711234567",
    timestamp: "Oct 17, 2026 at 5:48 PM",
    ip: "180.211.213.10",
    details: "Provisioned credentials for junior verification operator with read-only dashboard access."
  },
  {
    id: "LOG-104",
    admin: "Tariqul Islam",
    adminRole: "Admin",
    actionType: "Approved",
    actionColor: "emerald",
    iconType: "check",
    description: "Approved emergency trade license verification for provider Sumon Roy",
    target: "Provider Sumon Roy",
    timestamp: "Oct 16, 2026 at 4:10 PM",
    ip: "203.76.128.4",
    details: "Validated city corporation electrical contractor trade license copy #TR-449102."
  },
  {
    id: "LOG-105",
    admin: "Nusrat Jahan",
    adminRole: "Admin",
    actionType: "Rejected",
    actionColor: "rose",
    iconType: "alert",
    description: "Rejected provider application for Arif Chowdhury due to invalid NID",
    target: "Applicant Arif Chowdhury",
    timestamp: "Oct 15, 2026 at 1:22 PM",
    ip: "118.179.223.90",
    details: "Uploaded NID scan was unreadable/blurred and DOB mismatched with registration records."
  },
  {
    id: "LOG-106",
    admin: "Tanvir Mahmud",
    adminRole: "Super Admin",
    actionType: "Created",
    actionColor: "blue",
    iconType: "user_plus",
    description: "Created new admin account for 01918765432 (Farzana Siddique)",
    target: "Farzana Siddique",
    timestamp: "Oct 14, 2026 at 9:05 AM",
    ip: "103.114.98.24",
    details: "Created supervisory admin account with audit trail and reports moderation permissions."
  }
];

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

export type IconName =
  | "dashboard" | "calendar" | "file" | "settings" | "logout" | "menu" | "close" | "bell"
  | "chevronRight" | "clock" | "check" | "wallet" | "arrowUp" | "arrowDown" | "briefcase"
  | "mail" | "shield" | "plus" | "more" | "help" | "sparkles" | "eye" | "eyeOff";

export type NavItem = { label: string; href: string; icon: IconName };

export const employee = {
  name: "Ahmed Khan", initials: "AK", employeeId: "EMP-1024", role: "Frontend Developer",
  department: "Engineering", location: "Lahore, Pakistan", email: "ahmed.khan@bembexlab.com",
  manager: "Sarah Williams", joined: "March 12, 2023",
} as const;

export const navigationItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: "dashboard" },
  { label: "Attendance", href: "/attendance", icon: "calendar" },
  { label: "Requests", href: "/requests", icon: "file" },
];

export const dashboardAttendanceSummary = {
  absents: 3,
  lateArrivals: 5,
  deductionDays: 2.5,
  period: "August 2026",
} as const;

export const payrollOverview = {
  grossSalary: 150000,
  deductionAmount: 12500,
  totalSalaryToReceive: 137500,
} as const;

export const attendanceHistorySummary = {
  presentDays: 17,
  lateDays: 5,
  absentDays: 3,
  workingDays: 25,
} as const;

export const attendanceHistory = [
  { date: "2026-08-18", day: "Tuesday", status: "Late", checkIn: "09:24 AM", checkOut: "05:58 PM", workingHours: "8h 34m", remarks: "24 minutes late" },
  { date: "2026-08-17", day: "Monday", status: "Present", checkIn: "08:58 AM", checkOut: "06:03 PM", workingHours: "9h 05m", remarks: "On time" },
  { date: "2026-08-14", day: "Friday", status: "Absent", checkIn: "-", checkOut: "-", workingHours: "-", remarks: "No attendance recorded" },
  { date: "2026-08-13", day: "Thursday", status: "Present", checkIn: "08:51 AM", checkOut: "05:55 PM", workingHours: "9h 04m", remarks: "On time" },
  { date: "2026-08-12", day: "Wednesday", status: "Present", checkIn: "08:56 AM", checkOut: "06:02 PM", workingHours: "9h 06m", remarks: "On time" },
  { date: "2026-08-11", day: "Tuesday", status: "Late", checkIn: "09:13 AM", checkOut: "06:00 PM", workingHours: "8h 47m", remarks: "13 minutes late" },
  { date: "2026-08-10", day: "Monday", status: "Present", checkIn: "08:49 AM", checkOut: "05:58 PM", workingHours: "9h 09m", remarks: "On time" },
  { date: "2026-08-07", day: "Friday", status: "Present", checkIn: "08:57 AM", checkOut: "06:05 PM", workingHours: "9h 08m", remarks: "On time" },
  { date: "2026-08-06", day: "Thursday", status: "Absent", checkIn: "-", checkOut: "-", workingHours: "-", remarks: "No attendance recorded" },
  { date: "2026-08-05", day: "Wednesday", status: "Present", checkIn: "08:54 AM", checkOut: "06:01 PM", workingHours: "9h 07m", remarks: "On time" },
  { date: "2026-08-04", day: "Tuesday", status: "Late", checkIn: "09:08 AM", checkOut: "05:59 PM", workingHours: "8h 51m", remarks: "8 minutes late" },
  { date: "2026-08-03", day: "Monday", status: "Present", checkIn: "08:52 AM", checkOut: "06:00 PM", workingHours: "9h 08m", remarks: "On time" },
] as const;

export type RequestStatus = "Pending" | "Approved" | "Rejected";

export type RequestRecord = {
  id: string;
  requestType: string;
  dateRange: string;
  duration: string;
  submittedOn: string;
  status: RequestStatus;
  reason: string;
};

export const requestHistory: RequestRecord[] = [
  { id: "REQ-204", requestType: "Remote Work", dateRange: "Aug 21, 2026", duration: "1 day", submittedOn: "Aug 18, 2026", status: "Pending", reason: "Home internet installation" },
  { id: "REQ-203", requestType: "Annual Leave", dateRange: "Aug 10 - Aug 12, 2026", duration: "3 days", submittedOn: "Aug 02, 2026", status: "Approved", reason: "Family commitment" },
  { id: "REQ-202", requestType: "Sick Leave", dateRange: "Jul 28, 2026", duration: "1 day", submittedOn: "Jul 28, 2026", status: "Approved", reason: "Medical leave" },
  { id: "REQ-201", requestType: "Annual Leave", dateRange: "Jul 15 - Jul 16, 2026", duration: "2 days", submittedOn: "Jul 10, 2026", status: "Rejected", reason: "Personal work" },
  { id: "REQ-200", requestType: "Remote Work", dateRange: "Jun 26, 2026", duration: "1 day", submittedOn: "Jun 23, 2026", status: "Approved", reason: "Planned home maintenance" },
];

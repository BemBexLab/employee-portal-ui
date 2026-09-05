export type IconName =
  | "dashboard" | "calendar" | "file" | "settings" | "logout" | "menu" | "close" | "bell"
  | "chevronRight" | "clock" | "check" | "wallet" | "arrowUp" | "arrowDown" | "briefcase"
  | "mail" | "shield" | "plus" | "more" | "help" | "sparkles" | "eye" | "eyeOff"
  | "sun" | "moon" | "paperclip";

export type NavItem = { label: string; href: string; icon: IconName };

export const navigationItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: "dashboard" },
  { label: "Attendance", href: "/attendance", icon: "calendar" },
  { label: "Requests", href: "/requests", icon: "file" },
];

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

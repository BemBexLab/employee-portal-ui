export type PortalEmployee = {
  id: string;
  employeeCode: string;
  name: string;
  email: string | null;
  isActive: boolean;
  monthlySalary: number;
  joinedAt: string;
  department: string | null;
  organization: string;
  timeZone: string;
  shiftName: string | null;
};

export type PortalAttendance = {
  id: string;
  date: string;
  firstCheckIn: string | null;
  lastCheckOut: string | null;
  workingMinutes: number;
  status: string;
  shiftName: string | null;
  scheduledStart: string | null;
  scheduledEnd: string | null;
  graceDeadline: string | null;
};

export type PortalData = {
  employee: PortalEmployee;
  attendance: PortalAttendance[];
};

export type AttendanceDisplayStatus =
  | "On-Time"
  | "Late"
  | "Absent"
  | "Half day"
  | "Missing checkout";

export type AttendanceRecord = {
  id: string;
  date: string;
  day: string;
  status: AttendanceDisplayStatus;
  checkIn: string;
  checkOut: string;
  workingHours: string;
  remarks: string;
};

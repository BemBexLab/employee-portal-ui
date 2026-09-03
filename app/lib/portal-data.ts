import type {
  AttendanceDisplayStatus,
  AttendanceRecord,
  PortalAttendance,
  PortalData,
} from "@/app/lib/portal-types";

export function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function formatDateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function getPayrollCycleKey(date: string) {
  const [year, month, day] = date.slice(0, 10).split("-").map(Number);
  const cycleEnd = new Date(Date.UTC(year, month - 1 + (day > 25 ? 1 : 0), 1));
  return cycleEnd.toISOString().slice(0, 7);
}

export function getPayrollCycleRange(cycleKey: string) {
  const [year, month] = cycleKey.split("-").map(Number);
  return {
    start: formatDateKey(new Date(Date.UTC(year, month - 2, 25))),
    end: formatDateKey(new Date(Date.UTC(year, month - 1, 25))),
  };
}

export function formatPayrollCycle(cycleKey: string) {
  const { start, end } = getPayrollCycleRange(cycleKey);
  const formatter = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
  return `${formatter.format(new Date(`${start}T12:00:00.000Z`))} – ${formatter.format(new Date(`${end}T12:00:00.000Z`))}`;
}

export function isInPayrollCycle(date: string, cycleKey: string) {
  const { start, end } = getPayrollCycleRange(cycleKey);
  const dateKey = date.slice(0, 10);
  return dateKey >= start && dateKey <= end;
}

export function getPayrollCycleOptions(attendance: PortalAttendance[]) {
  return [...new Set(attendance.map((entry) => getPayrollCycleKey(entry.date)))]
    .sort((a, b) => b.localeCompare(a))
    .map((value) => ({ value, label: formatPayrollCycle(value) }));
}

export function getAttendanceStatus(status: string): AttendanceDisplayStatus {
  switch (status.toUpperCase()) {
    case "LATE":
      return "Late";
    case "ABSENT":
      return "Absent";
    case "HALF_DAY":
      return "Half day";
    case "MISSING_CHECKOUT":
      return "Missing checkout";
    default:
      return "On-Time";
  }
}

function formatTime(value: string | null, timeZone: string) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone,
  }).format(new Date(value));
}

function formatMinutes(minutes: number) {
  if (!minutes) return "—";
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  return `${hours}h ${remainder.toString().padStart(2, "0")}m`;
}

function getRemarks(entry: PortalAttendance, status: AttendanceDisplayStatus) {
  if (status === "Missing checkout") return "Checkout has not been recorded";
  if (status === "Absent") return "No attendance recorded";
  if (status === "Half day") return "Half day recorded";
  if (status === "Late" && entry.firstCheckIn && entry.scheduledStart) {
    const minutesLate = Math.max(
      0,
      Math.round(
        (new Date(entry.firstCheckIn).getTime() -
          new Date(entry.scheduledStart).getTime()) /
          60_000,
      ),
    );
    return `${minutesLate} minutes after scheduled start`;
  }
  return "On-Time";
}

export function toAttendanceRecords(data: PortalData): AttendanceRecord[] {
  return data.attendance.map((entry) => {
    const status = getAttendanceStatus(entry.status);
    return {
      id: entry.id,
      date: entry.date,
      day: new Intl.DateTimeFormat("en-US", {
        weekday: "long",
        timeZone: "UTC",
      }).format(new Date(`${entry.date}T12:00:00.000Z`)),
      status,
      checkIn: formatTime(entry.firstCheckIn, data.employee.timeZone),
      checkOut: formatTime(entry.lastCheckOut, data.employee.timeZone),
      workingHours: formatMinutes(entry.workingMinutes),
      remarks: getRemarks(entry, status),
    };
  });
}

function isWeekend(date: string) {
  const [year, month, day] = date.slice(0, 10).split("-").map(Number);
  const weekday = new Date(Date.UTC(year, month - 1, day)).getUTCDay();
  return weekday === 0 || weekday === 6;
}

export function getAttendanceSummary(records: AttendanceRecord[]) {
  const workdayRecords = records.filter((entry) => !isWeekend(entry.date));
  const onTimeDays = workdayRecords.filter(
    (entry) => entry.status === "On-Time" || entry.status === "Missing checkout",
  ).length;
  const lateDays = workdayRecords.filter((entry) => entry.status === "Late").length;
  const absentDays = workdayRecords.filter((entry) => entry.status === "Absent").length;
  const halfDays = workdayRecords.filter((entry) => entry.status === "Half day").length;

  return {
    onTimeDays,
    lateDays,
    absentDays,
    halfDays,
    workingDays: workdayRecords.length,
    deductionDays: absentDays + (lateDays + halfDays) / 3,
  };
}

export function getPayrollCycleDays(cycleKey: string) {
  const { start, end } = getPayrollCycleRange(cycleKey);
  const [sy, sm, sd] = start.split("-").map(Number);
  const [ey, em, ed] = end.split("-").map(Number);
  const startMs = Date.UTC(sy, sm - 1, sd);
  const endMs = Date.UTC(ey, em - 1, ed);
  return Math.round((endMs - startMs) / (1000 * 60 * 60 * 24)) + 1;
}

export function getPayroll(
  monthlySalary: number,
  deductionDays: number,
  cycleDays: number,
) {
  const grossSalary = Number.isFinite(monthlySalary) ? monthlySalary : 0;
  const safeCycleDays =
    Number.isFinite(cycleDays) && cycleDays > 0 ? cycleDays : 30;
  const deductionAmount = Math.round((grossSalary / safeCycleDays) * deductionDays);
  return {
    grossSalary,
    deductionAmount,
    totalSalaryToReceive: Math.max(0, grossSalary - deductionAmount),
    cycleDays: safeCycleDays,
  };
}

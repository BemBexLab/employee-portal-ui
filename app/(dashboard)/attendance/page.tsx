"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Icon } from "@/app/components/icons";
import { PageContainer } from "@/app/components/page-container";
import { SelectMenu } from "@/app/components/select-menu";
import { StatusBadge, type StatusBadgeValue } from "@/app/components/status-badge";
import { attendanceHistory, attendanceHistorySummary } from "@/app/lib/mock-data";
import { formatDisplayDate } from "@/app/lib/formatters";

type AttendanceStatus = Extract<StatusBadgeValue, "Present" | "Late" | "Absent">;

const summaryCards = [
  { label: "Present Days", value: attendanceHistorySummary.presentDays, helper: "Days recorded", icon: "check" as const, tone: "bg-emerald-50 text-emerald-600", valueTone: "text-emerald-700" },
  { label: "Late Days", value: attendanceHistorySummary.lateDays, helper: "Needs attention", icon: "clock" as const, tone: "bg-amber-50 text-amber-600", valueTone: "text-amber-700" },
  { label: "Absent Days", value: attendanceHistorySummary.absentDays, helper: "No attendance", icon: "arrowDown" as const, tone: "bg-rose-50 text-rose-600", valueTone: "text-rose-700" },
  { label: "Working Days", value: attendanceHistorySummary.workingDays, helper: "Scheduled this month", icon: "calendar" as const, tone: "bg-blue-50 text-blue-600", valueTone: "text-blue-700" },
];

const monthOptions = [
  { value: "August 2026", label: "August 2026" },
  { value: "July 2026", label: "July 2026" },
];

const statusOptions = [
  { value: "All", label: "All statuses" },
  { value: "Present", label: "Present" },
  { value: "Late", label: "Late" },
  { value: "Absent", label: "Absent" },
];

export default function AttendancePage() {
  const [month, setMonth] = useState("August 2026");
  const [statusFilter, setStatusFilter] = useState<"All" | AttendanceStatus>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const filteredAttendance = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return attendanceHistory.filter((entry) => {
      const matchesStatus = statusFilter === "All" || entry.status === statusFilter;
      const matchesSearch = !query || `${entry.date} ${formatDisplayDate(entry.date)} ${entry.day} ${entry.status} ${entry.remarks}`.toLowerCase().includes(query);
      return matchesStatus && matchesSearch;
    });
  }, [searchQuery, statusFilter]);

  return <PageContainer>
    <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-sm font-semibold text-blue-600">{month}</p><h2 className="mt-1.5 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">Attendance</h2><p className="mt-2 text-sm leading-6 text-slate-500">Review your attendance history and daily status.</p></div><Link href="/requests" className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:border-slate-300 hover:bg-slate-50"><Icon name="help" size={16} className="text-slate-400" />Need a correction?</Link></section>
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Attendance summary">{summaryCards.map((card) => <article key={card.label} className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/40"><span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${card.tone}`}><Icon name={card.icon} size={18} /></span><div><p className={`text-2xl font-semibold tracking-tight ${card.valueTone}`}>{card.value}</p><p className="mt-0.5 text-sm font-medium text-slate-700">{card.label}</p><p className="mt-1 text-xs text-slate-400">{card.helper}</p></div></article>)}</section>
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/40 sm:p-6"><div className="mb-5"><p className="text-sm font-semibold text-slate-950">Filter attendance</p><p className="mt-1 text-sm text-slate-500">Narrow down your records by status or date.</p></div><div className="grid gap-4 md:grid-cols-[0.7fr_0.8fr_1.5fr]"><SelectMenu id="attendance-month" label="Month" value={month} options={monthOptions} onChange={setMonth} /><SelectMenu id="attendance-status" label="Attendance status" value={statusFilter} options={statusOptions} onChange={(value) => setStatusFilter(value as "All" | AttendanceStatus)} /><div><label htmlFor="attendance-search" className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">Search dates</label><div className="relative"><Icon name="calendar" size={17} className="pointer-events-none absolute left-3.5 top-3 text-slate-400" /><input id="attendance-search" type="search" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search date, day, or remark" className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3.5 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100" /></div></div></div></section>
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-200/40"><div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-5 sm:p-6"><div><p className="text-base font-semibold text-slate-950">Attendance history</p><p className="mt-1 text-sm text-slate-500">{filteredAttendance.length} of {attendanceHistory.length} records shown</p></div><div className="flex flex-wrap items-center gap-4 text-xs text-slate-500"><span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-500" />Present</span><span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-amber-500" />Late</span><span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-rose-500" />Absent</span></div></div>
      {filteredAttendance.length > 0 ? <><div className="hidden max-h-80 overflow-x-auto overflow-y-auto md:block"><table className="w-full min-w-[900px] text-left"><thead className="sticky top-0 z-10 bg-white"><tr className="border-b border-slate-100 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400"><th className="px-5 py-3.5 sm:px-6">Date</th><th className="px-5 py-3.5">Day</th><th className="px-5 py-3.5">Status</th><th className="px-5 py-3.5">Check in</th><th className="px-5 py-3.5">Check out</th><th className="px-5 py-3.5">Working hours</th><th className="px-5 py-3.5">Remarks</th></tr></thead><tbody className="divide-y divide-slate-100">{filteredAttendance.map((entry) => <tr key={entry.date} className="text-sm transition-colors hover:bg-slate-50"><td className="px-5 py-4 font-medium text-slate-800 sm:px-6">{formatDisplayDate(entry.date)}</td><td className="px-5 py-4 text-slate-500">{entry.day}</td><td className="px-5 py-4"><StatusBadge status={entry.status} showDot /></td><td className="px-5 py-4 text-slate-600">{entry.checkIn}</td><td className="px-5 py-4 text-slate-600">{entry.checkOut}</td><td className="px-5 py-4 font-medium text-slate-700">{entry.workingHours}</td><td className="px-5 py-4 text-slate-500">{entry.remarks}</td></tr>)}</tbody></table></div><div className="max-h-80 divide-y divide-slate-100 overflow-y-auto md:hidden">{filteredAttendance.map((entry) => <article key={entry.date} className="p-5"><div className="flex items-start justify-between gap-3"><div><p className="text-sm font-semibold text-slate-900">{formatDisplayDate(entry.date)}</p><p className="mt-1 text-xs text-slate-500">{entry.day}</p></div><StatusBadge status={entry.status} showDot /></div><dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 rounded-xl bg-slate-50 p-3.5"><div><dt className="text-[11px] font-medium uppercase tracking-wide text-slate-400">Check in</dt><dd className="mt-1 text-sm font-medium text-slate-700">{entry.checkIn}</dd></div><div><dt className="text-[11px] font-medium uppercase tracking-wide text-slate-400">Check out</dt><dd className="mt-1 text-sm font-medium text-slate-700">{entry.checkOut}</dd></div><div><dt className="text-[11px] font-medium uppercase tracking-wide text-slate-400">Working hours</dt><dd className="mt-1 text-sm font-medium text-slate-700">{entry.workingHours}</dd></div><div><dt className="text-[11px] font-medium uppercase tracking-wide text-slate-400">Remarks</dt><dd className="mt-1 text-sm font-medium text-slate-700">{entry.remarks}</dd></div></dl></article>)}</div></> : <div className="flex flex-col items-center justify-center px-6 py-16 text-center"><span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400"><Icon name="calendar" size={21} /></span><p className="mt-4 text-sm font-semibold text-slate-900">No attendance records found</p><p className="mt-1 max-w-sm text-sm text-slate-500">Try another status or search term to see more records.</p></div>}
      <div className="border-t border-slate-100 px-5 py-4 sm:px-6"><p className="text-xs text-slate-500">Attendance is recorded from your scheduled workday check-ins.</p></div>
    </section>
  </PageContainer>;
}

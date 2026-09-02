"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Icon } from "@/app/components/icons";
import { PageContainer } from "@/app/components/page-container";
import { usePortal } from "@/app/components/portal-provider";
import { SelectMenu } from "@/app/components/select-menu";
import { StatusBadge } from "@/app/components/status-badge";
import {
  formatPayrollCycle,
  getAttendanceSummary,
  getPayrollCycleOptions,
  isInPayrollCycle,
  toAttendanceRecords,
} from "@/app/lib/portal-data";
import type { AttendanceDisplayStatus } from "@/app/lib/portal-types";
import { formatDisplayDate } from "@/app/lib/formatters";

const statusOptions = [
  { value: "All", label: "All statuses" },
  { value: "On-Time", label: "On-Time" },
  { value: "Late", label: "Late" },
  { value: "Absent", label: "Absent" },
  { value: "Half day", label: "Half day" },
  { value: "Missing checkout", label: "Missing checkout" },
];

export default function AttendancePage() {
  const data = usePortal();
  const attendanceHistory = useMemo(() => toAttendanceRecords(data), [data]);
  const cycleOptions = useMemo(
    () => getPayrollCycleOptions(data.attendance),
    [data.attendance],
  );
  const [cycle, setCycle] = useState(
    cycleOptions[0]?.value ?? new Date().toISOString().slice(0, 7),
  );
  const [statusFilter, setStatusFilter] = useState<
    "All" | AttendanceDisplayStatus
  >("All");
  const [searchQuery, setSearchQuery] = useState("");
  const cycleAttendance = attendanceHistory.filter((entry) =>
    isInPayrollCycle(entry.date, cycle),
  );
  const summary = getAttendanceSummary(cycleAttendance);
  const filteredAttendance = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return attendanceHistory.filter((entry) => {
      const matchesCycle = isInPayrollCycle(entry.date, cycle);
      const matchesStatus =
        statusFilter === "All" || entry.status === statusFilter;
      const matchesSearch =
        !query ||
        `${entry.date} ${formatDisplayDate(entry.date)} ${entry.day} ${entry.status} ${entry.remarks}`
          .toLowerCase()
          .includes(query);
      return matchesCycle && matchesStatus && matchesSearch;
    });
  }, [attendanceHistory, cycle, searchQuery, statusFilter]);
  const attendancePercentage = (value: number) =>
    summary.workingDays
      ? Math.round((value / summary.workingDays) * 100)
      : 0;
  const cards = [
    {
      label: "On-Time Days",
      value: summary.onTimeDays,
      helper: "Arrived as scheduled",
      icon: "check" as const,
      tone: "bg-emerald-50 text-emerald-600",
      valueTone: "text-emerald-700",
      accent: "bg-emerald-500",
      percentage: attendancePercentage(summary.onTimeDays),
    },
    {
      label: "Late Days",
      value: summary.lateDays,
      helper: "Arrived after schedule",
      icon: "clock" as const,
      tone: "bg-amber-50 text-amber-600",
      valueTone: "text-amber-700",
      accent: "bg-amber-500",
      percentage: attendancePercentage(summary.lateDays),
    },
    {
      label: "Absent Days",
      value: summary.absentDays,
      helper: "No attendance recorded",
      icon: "arrowDown" as const,
      tone: "bg-rose-50 text-rose-600",
      valueTone: "text-rose-700",
      accent: "bg-rose-500",
      percentage: attendancePercentage(summary.absentDays),
    },
    {
      label: "Working Days",
      value: summary.workingDays,
      helper: "Total cycle records",
      icon: "calendar" as const,
      tone: "bg-blue-50 text-blue-600",
      valueTone: "text-blue-700",
      accent: "bg-blue-500",
      percentage: summary.workingDays ? 100 : 0,
    },
  ];

  return (
    <PageContainer>
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold text-blue-600">
            {formatPayrollCycle(cycle)}
          </p>
          <h2 className="mt-1.5 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
            Attendance
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Live attendance records for employee {data.employee.employeeCode}.
          </p>
        </div>
        <Link
          href="/attendance/correction"
          className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
        >
          <Icon name="help" size={16} className="text-slate-400" />
          Need a correction?
        </Link>
      </section>
      <section
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
        aria-label="Attendance summary"
      >
        {cards.map((card) => (
          <article
            key={card.label}
            className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/40 transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md hover:shadow-slate-200/50"
          >
            <span className={`absolute inset-x-0 top-0 h-1 ${card.accent}`} />
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">
                  {card.label}
                </p>
                <p className={`mt-3 text-3xl font-semibold leading-none tracking-tight ${card.valueTone}`}>
                  {card.value.toString().padStart(2, "0")}
                </p>
              </div>
              <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ring-1 ring-inset ring-slate-200 transition-transform duration-200 group-hover:scale-105 ${card.tone}`}>
                <Icon name={card.icon} size={19} strokeWidth={2} />
              </span>
            </div>
            <div className="mt-6 h-1.5 overflow-hidden rounded-full bg-slate-100">
              <span
                className={`block h-full rounded-full transition-[width] duration-500 ${card.accent}`}
                style={{ width: `${card.percentage}%` }}
              />
            </div>
            <div className="mt-3 flex items-center justify-between gap-3">
              <p className="truncate text-xs text-slate-400">{card.helper}</p>
              <span className="shrink-0 rounded-md bg-slate-100 px-2 py-1 text-[10px] font-bold tabular-nums text-slate-600">
                {card.percentage}%
              </span>
            </div>
          </article>
        ))}
      </section>
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/40 sm:p-6">
        <div className="mb-5">
          <p className="text-sm font-semibold text-slate-950">
            Filter attendance
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Narrow down your records by payroll cycle, status, or date.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-[0.9fr_0.8fr_1.5fr]">
          <SelectMenu
            id="attendance-cycle"
            label="Payroll cycle"
            value={cycle}
            options={cycleOptions}
            onChange={setCycle}
          />
          <SelectMenu
            id="attendance-status"
            label="Attendance status"
            value={statusFilter}
            options={statusOptions}
            onChange={(value) =>
              setStatusFilter(value as "All" | AttendanceDisplayStatus)
            }
          />
          <div>
            <label
              htmlFor="attendance-search"
              className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500"
            >
              Search dates
            </label>
            <div className="relative">
              <Icon
                name="calendar"
                size={17}
                className="pointer-events-none absolute left-3.5 top-3 text-slate-400"
              />
              <input
                id="attendance-search"
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search date, day, or remark"
                className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3.5 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </div>
          </div>
        </div>
      </section>
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-200/40">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-5 sm:p-6">
          <div>
            <p className="text-base font-semibold text-slate-950">
              Attendance history
            </p>
            <p className="mt-1 text-sm text-slate-500">
              {filteredAttendance.length} of {cycleAttendance.length} records
              shown
            </p>
          </div>
        </div>
        {filteredAttendance.length > 0 ? (
          <>
            <div className="hidden max-h-96 overflow-x-auto overflow-y-auto md:block">
              <table className="w-full min-w-[900px] text-left">
                <thead className="sticky top-0 z-10 bg-white">
                  <tr className="border-b border-slate-100 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">
                    <th className="px-5 py-3.5 sm:px-6">Date</th>
                    <th className="px-5 py-3.5">Day</th>
                    <th className="px-5 py-3.5">Status</th>
                    <th className="px-5 py-3.5">Check in</th>
                    <th className="px-5 py-3.5">Check out</th>
                    <th className="px-5 py-3.5">Working hours</th>
                    <th className="px-5 py-3.5">Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredAttendance.map((entry) => (
                    <tr key={entry.id} className="text-sm hover:bg-slate-50">
                      <td className="px-5 py-4 font-medium text-slate-800 sm:px-6">
                        {formatDisplayDate(entry.date)}
                      </td>
                      <td className="px-5 py-4 text-slate-500">{entry.day}</td>
                      <td className="px-5 py-4">
                        <StatusBadge status={entry.status} showDot />
                      </td>
                      <td className="px-5 py-4 text-slate-600">
                        {entry.checkIn}
                      </td>
                      <td className="px-5 py-4 text-slate-600">
                        {entry.checkOut}
                      </td>
                      <td className="px-5 py-4 font-medium text-slate-700">
                        {entry.workingHours}
                      </td>
                      <td className="px-5 py-4 text-slate-500">
                        {entry.remarks}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="max-h-96 divide-y divide-slate-100 overflow-y-auto md:hidden">
              {filteredAttendance.map((entry) => (
                <article key={entry.id} className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {formatDisplayDate(entry.date)}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">{entry.day}</p>
                    </div>
                    <StatusBadge status={entry.status} showDot />
                  </div>
                  <dl className="mt-4 grid grid-cols-2 gap-3 rounded-xl bg-slate-50 p-3.5">
                    <div>
                      <dt className="text-[11px] uppercase tracking-wide text-slate-400">
                        Check in
                      </dt>
                      <dd className="mt-1 text-sm font-medium text-slate-700">
                        {entry.checkIn}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[11px] uppercase tracking-wide text-slate-400">
                        Check out
                      </dt>
                      <dd className="mt-1 text-sm font-medium text-slate-700">
                        {entry.checkOut}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[11px] uppercase tracking-wide text-slate-400">
                        Working hours
                      </dt>
                      <dd className="mt-1 text-sm font-medium text-slate-700">
                        {entry.workingHours}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[11px] uppercase tracking-wide text-slate-400">
                        Remarks
                      </dt>
                      <dd className="mt-1 text-sm font-medium text-slate-700">
                        {entry.remarks}
                      </dd>
                    </div>
                  </dl>
                </article>
              ))}
            </div>
          </>
        ) : (
          <div className="px-6 py-16 text-center">
            <p className="text-sm font-semibold text-slate-900">
              No attendance records found
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Try another month, status, or search term.
            </p>
          </div>
        )}
        <div className="border-t border-slate-100 px-5 py-4 sm:px-6">
          <p className="text-xs text-slate-500">
            Synced from the attendance server.
          </p>
        </div>
      </section>
    </PageContainer>
  );
}

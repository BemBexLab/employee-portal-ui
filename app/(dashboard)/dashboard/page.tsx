"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Icon } from "@/app/components/icons";
import { PageContainer } from "@/app/components/page-container";
import { StatusBadge } from "@/app/components/status-badge";
import { usePortal } from "@/app/components/portal-provider";
import {
  formatPayrollCycle,
  getAttendanceSummary,
  getPayrollCycleKey,
  isInPayrollCycle,
  toAttendanceRecords,
} from "@/app/lib/portal-data";
import {
  fetchPayrollDeduction,
  type PayrollDeduction,
} from "@/app/lib/payroll-client";
import { formatDisplayDate, formatPKR } from "@/app/lib/formatters";

export default function DashboardPage() {
  const data = usePortal();
  const attendanceHistory = toAttendanceRecords(data);
  const latestAttendanceCycle = data.attendance[0]
    ? getPayrollCycleKey(data.attendance[0].date)
    : new Date().toISOString().slice(0, 7);
  const [deduction, setDeduction] = useState<PayrollDeduction | null>(null);
  const [deductionLoading, setDeductionLoading] = useState(true);
  const displayedCycle = deduction?.cycle ?? latestAttendanceCycle;
  const period = formatPayrollCycle(displayedCycle);
  const cycleAttendance = attendanceHistory.filter(
    (entry) => isInPayrollCycle(entry.date, displayedCycle),
  );
  const summary = getAttendanceSummary(cycleAttendance);

  useEffect(() => {
    let cancelled = false;
    fetchPayrollDeduction()
      .then((row) => {
        if (!cancelled) setDeduction(row);
      })
      .catch(() => {
        if (!cancelled) setDeduction(null);
      })
      .finally(() => {
        if (!cancelled) setDeductionLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const grossSalary = deduction ? deduction.monthlySalary : 0;
  const dailyRate = deduction ? deduction.dailyRate : 0;
  const deductionAmount = deduction ? deduction.deductionAmount : 0;
  const totalSalaryToReceive = Math.max(0, grossSalary - deductionAmount);
  const deductionPercent = grossSalary
    ? Math.round((deductionAmount / grossSalary) * 100)
    : 0;

  const summaryCards = [
    {
      label: "Total Absents",
      value: deduction ? deduction.absentDays : summary.absentDays,
      icon: "arrowDown" as const,
      iconClass: "bg-rose-50 text-rose-600",
      valueClass: "text-rose-700",
    },
    {
      label: "Late Arrivals",
      value: deduction ? deduction.lateDays + deduction.halfDays : summary.lateDays + summary.halfDays,
      icon: "clock" as const,
      iconClass: "bg-amber-50 text-amber-600",
      valueClass: "text-amber-700",
    },
    {
      label: "Deduction Days",
      value: deduction ? deduction.totalDeductionDays : 0,
      icon: "calendar" as const,
      iconClass: "bg-violet-50 text-violet-600",
      valueClass: "text-violet-700",
    },
  ];

  return (
    <PageContainer>
      <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold text-blue-600">Employee overview</p>
          <h2 className="mt-1.5 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
            Welcome back, {data.employee.name.split(" ")[0]}
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Here&apos;s your live attendance and estimated payroll overview.
          </p>
        </div>
        <span className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm">
          <Icon name="calendar" size={16} className="text-slate-400" />
          {period}
        </span>
      </section>

      <section className="grid gap-4 md:grid-cols-3" aria-label="Attendance summary">
        {summaryCards.map((card) => (
          <article key={card.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/40 sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-slate-500">{card.label}</p>
                <p className={`mt-3 text-3xl font-semibold tracking-tight ${card.valueClass}`}>{card.value}</p>
                <p className="mt-1 text-xs text-slate-400">This payroll cycle</p>
              </div>
              <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${card.iconClass}`}>
                <Icon name={card.icon} size={20} />
              </span>
            </div>
          </article>
        ))}
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-200/40">
        <div className="flex flex-col gap-2 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <p className="text-base font-semibold text-slate-950">Salary Overview</p>
            <p className="mt-1 text-sm text-slate-500">
              {deduction
                ? `Deductions calculated through ${deduction.calculatedThrough ?? "today"} for ${period}.`
                : `Estimated from your monthly salary and recorded attendance for ${period}.`}
            </p>
          </div>
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1.5 text-xs font-semibold text-blue-700">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
            {deduction ? "Server-side calculation" : "Live estimate"}
          </span>
        </div>
        <div className="grid gap-8 p-5 sm:p-6 lg:grid-cols-[1fr_0.9fr] lg:gap-12">
          <div className="space-y-5">
            <SalaryRow label="Gross Salary" value={formatPKR(grossSalary)} badge="100%" />
            <div className="flex items-center gap-4"><span className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-50 text-rose-600"><Icon name="arrowDown" size={15} /></span><div className="h-px flex-1 bg-slate-200" /></div>
            <SalaryRow
              label="Estimated Deduction"
              value={`− ${formatPKR(deductionAmount)}`}
              badge={`${deductionPercent}%`}
              deduction
            />
            <div className="border-t border-dashed border-slate-200 pt-5">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-slate-600">Estimated Salary to Receive</p>
                  <p className="mt-1 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                    {formatPKR(totalSalaryToReceive)}
                  </p>
                  {deduction ? (
                    <p className="mt-2 text-xs text-slate-400">
                      Daily rate {formatPKR(dailyRate)} over {deduction.payrollDays} days · {deduction.totalDeductionDays} deduction days
                    </p>
                  ) : deductionLoading ? (
                    <p className="mt-2 text-xs text-slate-400">Loading server-side calculation…</p>
                  ) : (
                    <p className="mt-2 text-xs text-slate-400">No server-side calculation available for this cycle yet.</p>
                  )}
                </div>
                <Icon name="wallet" size={27} className="mb-1 text-emerald-600" />
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900">Salary breakdown</p>
                <p className="mt-1 text-xs text-slate-500">Estimated payable amount</p>
              </div>
              <span className="text-sm font-bold text-emerald-600">{100 - deductionPercent}% net</span>
            </div>
            <div className="mt-8">
              <div className="flex h-3 overflow-hidden rounded-full bg-rose-100">
                <div className="bg-emerald-500" style={{ width: `${100 - deductionPercent}%` }} />
                <div className="bg-rose-400" style={{ width: `${deductionPercent}%` }} />
              </div>
              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-500">
                <span className="inline-flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  Receive {formatPKR(totalSalaryToReceive)}
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-rose-400" />
                  Deductions {formatPKR(deductionAmount)}
                </span>
              </div>
            </div>
            <p className="mt-8 border-t border-slate-200 pt-4 text-xs leading-5 text-slate-500">
              {deduction
                ? `3 late or half-day marks convert into 1 deduction day (this cycle: ${deduction.lateHalfDayDeductionDays} day${deduction.lateHalfDayDeductionDays === 1 ? "" : "s"} from late/half-day marks, ${deduction.absentDays} from absents).`
                : "This is an attendance-based estimate. Final payroll may include other adjustments."}
            </p>
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-200/40">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-5 sm:p-6">
          <div>
            <p className="text-base font-semibold text-slate-950">Recent Attendance</p>
            <p className="mt-1 text-sm text-slate-500">Your latest records from the attendance server.</p>
          </div>
          <Link href="/attendance" className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-semibold text-blue-600 hover:bg-blue-50">
            View all attendance <Icon name="chevronRight" size={15} />
          </Link>
        </div>
        {attendanceHistory.length ? (
          <>
            <div className="hidden max-h-80 overflow-x-auto overflow-y-auto sm:block">
              <table className="w-full min-w-[680px] text-left">
                <thead className="sticky top-0 z-10 bg-white">
                  <tr className="border-b border-slate-100 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">
                    <th className="px-5 py-3.5 sm:px-6">Date</th>
                    <th className="px-5 py-3.5">Day</th>
                    <th className="px-5 py-3.5">Status</th>
                    <th className="px-5 py-3.5">Check-in</th>
                    <th className="px-5 py-3.5">Note</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {attendanceHistory.slice(0, 8).map((entry) => (
                    <tr key={entry.id} className="text-sm hover:bg-slate-50">
                      <td className="px-5 py-4 font-medium text-slate-800 sm:px-6">{formatDisplayDate(entry.date)}</td>
                      <td className="px-5 py-4 text-slate-500">{entry.day}</td>
                      <td className="px-5 py-4"><StatusBadge status={entry.status} showDot /></td>
                      <td className="px-5 py-4 text-slate-600">{entry.checkIn}</td>
                      <td className="px-5 py-4 text-slate-500">{entry.remarks}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="max-h-96 divide-y divide-slate-100 overflow-y-auto sm:hidden">
              {attendanceHistory.slice(0, 8).map((entry) => (
                <div key={entry.id} className="flex items-center gap-3 p-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold text-slate-800">{formatDisplayDate(entry.date)}</p>
                      <StatusBadge status={entry.status} />
                    </div>
                    <p className="mt-1 text-xs text-slate-500">{entry.day} · Check-in {entry.checkIn}</p>
                    <p className="mt-1 text-xs text-slate-400">{entry.remarks}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : <EmptyAttendance />}
      </section>
    </PageContainer>
  );
}

function SalaryRow({ label, value, badge, deduction = false }: { label: string; value: string; badge: string; deduction?: boolean }) {
  return <div className="flex items-center justify-between gap-4"><div><p className="text-sm font-medium text-slate-500">{label}</p><p className={`mt-1 text-xl font-semibold tracking-tight ${deduction ? "text-rose-700" : "text-slate-950"}`}>{value}</p></div><span className={`rounded-lg px-2.5 py-1 text-xs font-medium ${deduction ? "bg-rose-50 text-rose-600" : "bg-slate-100 text-slate-500"}`}>{badge}</span></div>;
}

function EmptyAttendance() {
  return <div className="px-6 py-12 text-center text-sm text-slate-500">No attendance records are available yet.</div>;
}

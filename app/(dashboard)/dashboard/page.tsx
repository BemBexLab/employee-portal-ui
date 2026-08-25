import Link from "next/link";
import {
  attendanceHistory,
  dashboardAttendanceSummary,
  employee,
  payrollOverview,
} from "@/app/lib/mock-data";
import { Icon } from "@/app/components/icons";
import { PageContainer } from "@/app/components/page-container";
import { StatusBadge } from "@/app/components/status-badge";
import { formatDisplayDate, formatPKR } from "@/app/lib/formatters";

const deductionPercent = Math.round(
  (payrollOverview.deductionAmount / payrollOverview.grossSalary) * 100,
);

const summaryCards = [
  {
    label: "Total Absents",
    value: dashboardAttendanceSummary.absents,
    helper: "This month",
    icon: "arrowDown" as const,
    iconClass: "bg-rose-50 text-rose-600",
    valueClass: "text-rose-700",
  },
  {
    label: "Late Arrivals",
    value: dashboardAttendanceSummary.lateArrivals,
    helper: "This month",
    icon: "clock" as const,
    iconClass: "bg-amber-50 text-amber-600",
    valueClass: "text-amber-700",
  },
  {
    label: "Deduction Days",
    value: dashboardAttendanceSummary.deductionDays,
    helper: "Equivalent days",
    icon: "calendar" as const,
    iconClass: "bg-violet-50 text-violet-600",
    valueClass: "text-violet-700",
  },
];

export default function DashboardPage() {
  return (
    <PageContainer>
      <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold text-blue-600">
            Employee overview
          </p>
          <h2 className="mt-1.5 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
            Welcome back, {employee.name.split(" ")[0]}
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Here&apos;s an overview of your attendance and payroll this month.
          </p>
        </div>
        <button
          type="button"
          className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
        >
          <Icon name="calendar" size={16} className="text-slate-400" />
          {dashboardAttendanceSummary.period}
          <Icon
            name="chevronRight"
            size={15}
            className="ml-1 rotate-90 text-slate-400"
          />
        </button>
      </section>

      <section
        className="grid gap-4 md:grid-cols-3"
        aria-label="Attendance summary"
      >
        {summaryCards.map((card) => (
          <article
            key={card.label}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/40 transition-shadow hover:shadow-md hover:shadow-slate-200/50 sm:p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  {card.label}
                </p>
                <p
                  className={`mt-3 text-3xl font-semibold tracking-tight ${card.valueClass}`}
                >
                  {card.value}
                </p>
                <p className="mt-1 text-xs text-slate-400">{card.helper}</p>
              </div>
              <span
                className={`flex h-11 w-11 items-center justify-center rounded-xl ${card.iconClass}`}
              >
                <Icon name={card.icon} size={20} />
              </span>
            </div>
          </article>
        ))}
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-200/40">
        <div className="flex flex-col gap-2 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <p className="text-base font-semibold text-slate-950">
              Salary Overview
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Your estimated payroll summary for{" "}
              {dashboardAttendanceSummary.period}.
            </p>
          </div>
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1.5 text-xs font-semibold text-emerald-700">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Payroll ready
          </span>
        </div>
        <div className="grid gap-8 p-5 sm:p-6 lg:grid-cols-[1fr_0.9fr] lg:gap-12">
          <div className="space-y-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Gross Salary
                </p>
                <p className="mt-1 text-xl font-semibold tracking-tight text-slate-950">
                  {formatPKR(payrollOverview.grossSalary)}
                </p>
              </div>
              <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500">
                100%
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-50 text-rose-600">
                <Icon name="arrowDown" size={15} />
              </span>
              <div className="h-px flex-1 bg-slate-200" />
            </div>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Deduction Amount
                </p>
                <p className="mt-1 text-xl font-semibold tracking-tight text-rose-700">
                  − {formatPKR(payrollOverview.deductionAmount)}
                </p>
              </div>
              <span className="rounded-lg bg-rose-50 px-2.5 py-1 text-xs font-medium text-rose-600">
                {deductionPercent}%
              </span>
            </div>
            <div className="border-t border-dashed border-slate-200 pt-5">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-slate-600">
                    Total Salary to Receive
                  </p>
                  <p className="mt-1 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                    {formatPKR(payrollOverview.totalSalaryToReceive)}
                  </p>
                </div>
                <Icon
                  name="wallet"
                  size={27}
                  className="mb-1 text-emerald-600"
                />
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  Salary breakdown
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  What makes up your payable amount
                </p>
              </div>
              <span className="text-sm font-bold text-emerald-600">
                {100 - deductionPercent}% net
              </span>
            </div>
            <div className="mt-8">
              <div className="flex h-3 overflow-hidden rounded-full bg-rose-100">
                <div
                  className="bg-emerald-500"
                  style={{ width: `${100 - deductionPercent}%` }}
                />
                <div
                  className="bg-rose-400"
                  style={{ width: `${deductionPercent}%` }}
                />
              </div>
              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-500">
                <span className="inline-flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  You receive {formatPKR(payrollOverview.totalSalaryToReceive)}
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-rose-400" />
                  Deductions {formatPKR(payrollOverview.deductionAmount)}
                </span>
              </div>
            </div>
            <div className="mt-8 border-t border-slate-200 pt-4 text-xs leading-5 text-slate-500">
              <p>
                Final amount reflects the current mock payroll period and may
                change after payroll review.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-200/40">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-5 sm:p-6">
          <div>
            <p className="text-base font-semibold text-slate-950">
              Recent Attendance
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Your latest attendance activity.
            </p>
          </div>
          <Link
            href="/attendance"
            className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-semibold text-blue-600 transition hover:bg-blue-50 hover:text-blue-700"
          >
            View all attendance <Icon name="chevronRight" size={15} />
          </Link>
        </div>
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
              {attendanceHistory.map((entry) => (
                <tr
                  key={entry.date}
                  className="text-sm transition-colors hover:bg-slate-50"
                >
                  <td className="px-5 py-4 font-medium text-slate-800 sm:px-6">
                    {formatDisplayDate(entry.date)}
                  </td>
                  <td className="px-5 py-4 text-slate-500">{entry.day}</td>
                  <td className="px-5 py-4">
                    <StatusBadge status={entry.status} showDot />
                  </td>
                  <td className="px-5 py-4 text-slate-600">{entry.checkIn}</td>
                  <td className="px-5 py-4 text-slate-500">{entry.remarks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="max-h-96 divide-y divide-slate-100 overflow-y-auto sm:hidden">
          {attendanceHistory.map((entry) => (
            <div key={entry.date} className="flex items-center gap-3 p-4">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-semibold text-slate-800">
                    {formatDisplayDate(entry.date)}
                  </p>
                  <StatusBadge status={entry.status} />
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  {entry.day} · Check-in {entry.checkIn}
                </p>
                <p className="mt-1 text-xs text-slate-400">{entry.remarks}</p>
              </div>
              <Icon
                name="chevronRight"
                size={16}
                className="shrink-0 text-slate-300"
              />
            </div>
          ))}
        </div>
      </section>
    </PageContainer>
  );
}

export type StatusBadgeValue =
  | "On-Time"
  | "Late"
  | "Absent"
  | "Half day"
  | "Missing checkout"
  | "Pending"
  | "Approved"
  | "Rejected"
  | "Cancelled"
  | "Working";

const statusStyles: Record<StatusBadgeValue, string> = {
  "On-Time": "bg-emerald-50 text-emerald-700 ring-emerald-600/10",
  Approved: "bg-emerald-50 text-emerald-700 ring-emerald-600/10",
  Late: "bg-amber-50 text-amber-700 ring-amber-600/10",
  Pending: "bg-amber-50 text-amber-700 ring-amber-600/10",
  Absent: "bg-rose-50 text-rose-700 ring-rose-600/10",
  "Half day": "bg-violet-50 text-violet-700 ring-violet-600/10",
  "Missing checkout": "bg-orange-50 text-orange-700 ring-orange-600/10",
  Rejected: "bg-rose-50 text-rose-700 ring-rose-600/10",
  Cancelled: "bg-slate-100 text-slate-600 ring-slate-500/10",
  Working: "bg-blue-50 text-blue-700 ring-blue-600/10",
};

type StatusBadgeProps = { status: StatusBadgeValue; showDot?: boolean };

export function StatusBadge({ status, showDot = false }: StatusBadgeProps) {
  return <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${statusStyles[status]}`}>{showDot ? <span className="h-1.5 w-1.5 rounded-full bg-current" /> : null}{status}</span>;
}

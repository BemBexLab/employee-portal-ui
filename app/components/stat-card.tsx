import type { IconName } from "@/app/lib/mock-data";
import { Icon } from "@/app/components/icons";

type StatCardProps = { label: string; value: string; helper: string; icon: IconName; tone: "blue" | "violet" | "green" | "amber" };
const toneStyles = { blue: "bg-blue-50 text-blue-600", violet: "bg-violet-50 text-violet-600", green: "bg-emerald-50 text-emerald-600", amber: "bg-amber-50 text-amber-600" };

export function StatCard({ label, value, helper, icon, tone }: StatCardProps) {
  return <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/40 transition-shadow hover:shadow-md hover:shadow-slate-200/50"><div className="flex items-start justify-between gap-4"><div><p className="text-sm font-medium text-slate-500">{label}</p><p className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">{value}</p></div><span className={`flex h-10 w-10 items-center justify-center rounded-xl ${toneStyles[tone]}`}><Icon name={icon} size={19} /></span></div><p className="mt-4 text-xs text-slate-500">{helper}</p></article>;
}

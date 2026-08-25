import { employee } from "@/app/lib/mock-data";
import { EmployeeAvatar } from "@/app/components/employee-avatar";
import { Icon } from "@/app/components/icons";

type DashboardHeaderProps = {
  title: string;
  subtitle: string;
  onMenuClick: () => void;
};

export function DashboardHeader({
  title,
  subtitle,
  onMenuClick,
}: DashboardHeaderProps) {
  return (
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <div className="flex h-[76px] items-center justify-between gap-4 px-5 sm:px-8 lg:px-10">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            aria-label="Open navigation"
            className="shrink-0 rounded-xl border border-slate-200 p-2 text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900 lg:hidden"
            onClick={onMenuClick}
          >
            <Icon name="menu" size={20} />
          </button>
          <div className="min-w-0">
            <h1 className="truncate text-lg font-semibold tracking-tight text-slate-950 sm:text-xl">
              {title}
            </h1>
            <p className="mt-0.5 truncate text-xs text-slate-500 sm:text-sm">
              {subtitle}
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-3 sm:gap-5">
          <div className="hidden text-right sm:block">
            <p className="text-xs font-medium text-slate-400">
              Thursday, August 20, 2026
            </p>
            <p className="mt-0.5 text-xs text-slate-500">Karachi, Pakistan</p>
          </div>
          <button
            type="button"
            aria-label="Notifications"
            className="relative rounded-xl border border-slate-200 p-2.5 text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-900"
          >
            <Icon name="bell" size={18} />
            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-blue-600 ring-2 ring-white" />
          </button>
          <EmployeeAvatar initials={employee.initials} size="sm" showStatus />
        </div>
      </div>
    </header>
  );
}

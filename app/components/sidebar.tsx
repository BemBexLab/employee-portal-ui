import Link from "next/link";
import { employee, navigationItems } from "@/app/lib/mock-data";
import { EmployeeAvatar } from "@/app/components/employee-avatar";
import { Icon } from "@/app/components/icons";
import Image from "next/image";

type SidebarProps = { pathname: string; open: boolean; onClose: () => void };

export function Sidebar({ pathname, open, onClose }: SidebarProps) {
  return (
    <>
      <button
        type="button"
        aria-label="Close navigation"
        className={`fixed inset-0 z-40 bg-slate-950/30 transition-opacity duration-200 lg:hidden ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={onClose}
      />
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[270px] flex-col overflow-y-auto border-r border-slate-200 bg-white px-4 py-5 shadow-xl transition-transform duration-200 lg:translate-x-0 lg:shadow-none ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center justify-between px-3">
          <Link
            href="/dashboard"
            className="flex items-center gap-2.5"
            onClick={onClose}
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl text-white shadow-sm">
              <Image src="/Bembex logo ( JPG ) Icon White 1.svg" alt="Bembex Lab logo" width={36} height={36} />
            </span>
            <span>
              <span className="block text-[15px] font-bold tracking-tight text-slate-950">
                Bembex Lab
              </span>
              <span className="block text-[10px] font-medium uppercase tracking-[0.18em] text-slate-400">
                Employee portal
              </span>
            </span>
          </Link>
          <button
            type="button"
            aria-label="Close navigation"
            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 lg:hidden"
            onClick={onClose}
          >
            <Icon name="close" size={18} />
          </button>
        </div>
        <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-3.5">
          <div className="flex items-center gap-3">
            <EmployeeAvatar initials={employee.initials} size="md" showStatus />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-900">
                {employee.name}
              </p>
              <p className="mt-0.5 truncate text-xs text-slate-500">
                {employee.role}
              </p>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-slate-200 pt-3 text-[11px] font-medium text-slate-500">
            <span>{employee.employeeId}</span>
            <span className="rounded-full bg-emerald-50 px-2 py-1 text-emerald-700">
              Active
            </span>
          </div>
        </div>
        <nav aria-label="Main navigation" className="mt-8 flex-1">
          <p className="px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
            Workspace
          </p>
          <div className="mt-3 space-y-1">
            {navigationItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  aria-current={active ? "page" : undefined}
                  className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${active ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"}`}
                >
                  <Icon
                    name={item.icon}
                    size={18}
                    className={
                      active
                        ? "text-blue-600"
                        : "text-slate-400 group-hover:text-slate-600"
                    }
                  />
                  <span>{item.label}</span>
                  {active ? (
                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-blue-600" />
                  ) : null}
                </Link>
              );
            })}
          </div>
        </nav>
        <div className="mt-6 border-t border-slate-200 pt-4">
          <Link
            href="#settings"
            onClick={onClose}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-950"
          >
            <Icon name="settings" size={18} className="text-slate-400" />
            Settings
            <span className="ml-auto rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-400">
              Soon
            </span>
          </Link>
          <Link
            href="/login"
            onClick={onClose}
            className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-red-50 hover:text-red-700"
          >
            <Icon name="logout" size={18} className="text-slate-400" />
            Log out
          </Link>
        </div>
      </aside>
    </>
  );
}

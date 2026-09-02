"use client";

import { useEffect, useRef, useState } from "react";
import { EmployeeAvatar } from "@/app/components/employee-avatar";
import { Icon } from "@/app/components/icons";
import { usePortal } from "@/app/components/portal-provider";
import { getInitials, toAttendanceRecords } from "@/app/lib/portal-data";
import { formatDisplayDate } from "@/app/lib/formatters";

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
  const portal = usePortal();
  const { employee } = portal;
  const notifications = toAttendanceRecords(portal).slice(0, 5).map((entry) => ({
    id: entry.id,
    icon: entry.status === "Late" ? "clock" as const : "calendar" as const,
    title: `${entry.status} attendance`,
    message: `Check-in ${entry.checkIn} · ${entry.workingHours} recorded`,
    time: formatDisplayDate(entry.date),
    tone: entry.status === "Late"
      ? "bg-amber-50 text-amber-600"
      : entry.status === "Absent" || entry.status === "Missing checkout"
        ? "bg-rose-50 text-rose-600"
        : "bg-emerald-50 text-emerald-600",
  }));
  const currentDate = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: employee.timeZone,
  }).format(new Date());
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const notificationsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!notificationsOpen) return;

    function handlePointerDown(event: PointerEvent) {
      if (!notificationsRef.current?.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setNotificationsOpen(false);
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [notificationsOpen]);

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
              {currentDate}
            </p>
            {/* <p className="mt-0.5 text-xs text-slate-500">{employee.organization}</p> */}
            <p className="mt-0.5 text-xs text-slate-500">Bembex Lab Organization</p>
          </div>
          <div ref={notificationsRef} className="relative">
            <button
              type="button"
              aria-label="Notifications"
              aria-expanded={notificationsOpen}
              aria-controls="notification-panel"
              className={`relative rounded-xl border p-2.5 text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-900 ${notificationsOpen ? "border-blue-300 bg-blue-50 text-blue-600" : "border-slate-200"}`}
              onClick={() => setNotificationsOpen((current) => !current)}
            >
              <Icon name="bell" size={18} />
              {notifications.length ? <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-blue-600 ring-2 ring-white" /> : null}
            </button>
            {notificationsOpen ? (
              <div
                id="notification-panel"
                role="dialog"
                aria-label="Notifications"
                className="absolute right-0 top-full z-50 mt-3 w-[min(360px,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-900/10"
              >
                <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3.5">
                  <div>
                    <p className="text-sm font-semibold text-slate-950">
                      Notifications
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      You have {notifications.length} recent updates.
                    </p>
                  </div>
                  <span className="rounded-full bg-blue-50 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-blue-700">
                    Live
                  </span>
                </div>
                <div className="max-h-80 divide-y divide-slate-100 overflow-y-auto">
                  {notifications.length ? notifications.map((notification) => (
                    <div key={notification.id} className="flex gap-3 px-4 py-3.5 transition-colors hover:bg-slate-50">
                      <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${notification.tone}`}>
                        <Icon name={notification.icon} size={16} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-semibold text-slate-800">
                            {notification.title}
                          </p>
                          <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />
                        </div>
                        <p className="mt-1 text-xs leading-5 text-slate-500">
                          {notification.message}
                        </p>
                        <p className="mt-1.5 text-[11px] font-medium text-slate-400">
                          {notification.time}
                        </p>
                      </div>
                    </div>
                  )) : <p className="px-4 py-8 text-center text-sm text-slate-500">No attendance updates yet.</p>}
                </div>
              </div>
            ) : null}
          </div>
          <EmployeeAvatar initials={getInitials(employee.name)} size="sm" showStatus />
        </div>
      </div>
    </header>
  );
}

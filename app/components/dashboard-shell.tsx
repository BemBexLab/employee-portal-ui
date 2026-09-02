"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import { Sidebar } from "@/app/components/sidebar";
import { DashboardHeader } from "@/app/components/dashboard-header";

const pageMeta: Record<string, { title: string; subtitle: string }> = {
  "/dashboard": {
    title: "Dashboard",
    subtitle: "Here's an overview of your attendance and current payroll cycle.",
  },
  "/attendance": {
    title: "Attendance",
    subtitle: "Review your attendance history and daily status.",
  },
  "/attendance/correction": {
    title: "Attendance correction",
    subtitle: "File a complaint about an incorrect attendance record.",
  },
  "/requests": {
    title: "Requests",
    subtitle: "Request leave or remote work and review your previous requests.",
  },
};

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const meta = pageMeta[pathname] ?? pageMeta["/dashboard"];
  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-50 text-slate-950">
      <Sidebar
        pathname={pathname}
        open={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
      />
      <main className="min-h-screen lg:pl-[270px]">
        <DashboardHeader
          title={meta.title}
          subtitle={meta.subtitle}
          onMenuClick={() => setMobileNavOpen(true)}
        />
        <div className="mx-auto w-full max-w-[1440px] px-5 py-7 sm:px-8 lg:px-10 lg:py-9">
          {children}
        </div>
      </main>
    </div>
  );
}

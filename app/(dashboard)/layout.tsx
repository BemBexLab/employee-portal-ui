"use client";

import { DashboardShell } from "@/app/components/dashboard-shell";
import { PortalProvider } from "@/app/components/portal-provider";

export const dynamic = "force-static";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PortalProvider>
      <DashboardShell>{children}</DashboardShell>
    </PortalProvider>
  );
}
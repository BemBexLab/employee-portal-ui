import { DashboardShell } from "@/app/components/dashboard-shell";
import { PortalProvider } from "@/app/components/portal-provider";
import { getEmployeePortal } from "@/app/lib/server-api";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const identity = (await cookies()).get("employee_portal_identity")?.value;
  if (!identity) redirect("/login");

  let data;
  try {
    data = await getEmployeePortal(identity);
  } catch {
    redirect("/login?error=server");
  }
  if (!data || !data.employee.isActive) redirect("/login?error=session");

  return (
    <PortalProvider data={data}>
      <DashboardShell>{children}</DashboardShell>
    </PortalProvider>
  );
}

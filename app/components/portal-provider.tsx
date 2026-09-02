"use client";

import { createContext, useContext } from "react";
import type { PortalData } from "@/app/lib/portal-types";

const PortalContext = createContext<PortalData | null>(null);

export function PortalProvider({
  data,
  children,
}: {
  data: PortalData;
  children: React.ReactNode;
}) {
  return <PortalContext value={data}>{children}</PortalContext>;
}

export function usePortal() {
  const data = useContext(PortalContext);
  if (!data) throw new Error("usePortal must be used within PortalProvider");
  return data;
}

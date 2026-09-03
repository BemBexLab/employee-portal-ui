"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import type { PortalData } from "@/app/lib/portal-types";

type PortalContextValue = {
  data: PortalData | null;
  refresh: () => Promise<void>;
  signOut: () => Promise<void>;
};

const PortalContext = createContext<PortalContextValue | null>(null);

type ProviderProps = {
  initialData?: PortalData;
  children: React.ReactNode;
};

export function PortalProvider({ initialData, children }: ProviderProps) {
  const [data, setData] = useState<PortalData | null>(initialData ?? null);
  const [loading, setLoading] = useState<boolean>(!initialData);
  const router = useRouter();

  const refresh = useCallback(async () => {
    try {
      const response = await fetch("/api/session", { cache: "no-store" });
      if (response.status === 401) {
        if (typeof window !== "undefined" && window.location.pathname !== "/login") {
          router.replace("/login");
        }
        setData(null);
        return;
      }
      if (!response.ok) {
        setData(null);
        return;
      }
      const payload = (await response.json()) as PortalData;
      setData(payload);
    } catch {
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [router]);

  const signOut = useCallback(async () => {
    await fetch("/api/session", { method: "DELETE" });
    setData(null);
    router.replace("/login");
  }, [router]);

  useEffect(() => {
    if (!initialData) {
      void refresh();
    }
  }, [initialData, refresh]);

  const value = useMemo<PortalContextValue>(
    () => ({ data, refresh, signOut }),
    [data, refresh, signOut],
  );

  if (loading || !data) {
    return (
      <PortalContext value={value}>
        <div
          role="status"
          aria-live="polite"
          className="flex min-h-screen items-center justify-center bg-slate-50 text-sm text-slate-500"
        >
          <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-2 shadow-sm">
            <span className="h-2 w-2 animate-pulse rounded-full bg-blue-500" />
            Loading your workspace…
          </div>
        </div>
      </PortalContext>
    );
  }

  return <PortalContext value={value}>{children}</PortalContext>;
}

export function usePortal() {
  const value = useContext(PortalContext);
  if (!value) throw new Error("usePortal must be used within PortalProvider");
  return value.data as PortalData;
}

export function usePortalActions() {
  const value = useContext(PortalContext);
  if (!value) throw new Error("usePortalActions must be used within PortalProvider");
  return { refresh: value.refresh, signOut: value.signOut };
}
"use client";

import { useRouter } from "next/navigation";
import { Icon } from "@/app/components/icons";

export function LogoutButton({ onLogout }: { onLogout: () => void }) {
  const router = useRouter();

  async function logout() {
    await fetch("/api/session", { method: "DELETE" });
    onLogout();
    router.replace("/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={logout}
      className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-red-50 hover:text-red-700"
    >
      <Icon name="logout" size={18} className="text-slate-400" />
      Log out
    </button>
  );
}

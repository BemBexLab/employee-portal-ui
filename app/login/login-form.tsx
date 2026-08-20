"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Icon } from "@/app/components/icons";
import { employee } from "@/app/lib/mock-data";

export function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    router.push("/dashboard");
  }

  return <form onSubmit={handleSubmit} className="mt-8 space-y-5">
    <div>
      <label htmlFor="identity" className="mb-2 block text-sm font-semibold text-slate-700">Email or employee ID</label>
      <input id="identity" name="identity" type="text" autoComplete="username" required defaultValue={employee.email} placeholder="you@company.com or EMP-1024" className="h-12 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100" />
    </div>
    <div>
      <div className="mb-2 flex items-center justify-between"><label htmlFor="password" className="block text-sm font-semibold text-slate-700">Password</label><Link href="#forgot-password" className="text-xs font-semibold text-blue-600 hover:text-blue-700">Forgot password?</Link></div>
      <div className="relative"><input id="password" name="password" type={showPassword ? "text" : "password"} autoComplete="current-password" required placeholder="Enter your password" className="h-12 w-full rounded-xl border border-slate-200 bg-white px-3.5 pr-12 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100" /><button type="button" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword((visible) => !visible)} className="absolute inset-y-0 right-0 flex w-12 items-center justify-center rounded-r-xl text-slate-400 hover:text-slate-700"><Icon name={showPassword ? "eyeOff" : "eye"} size={18} /></button></div>
    </div>
    <div className="flex items-center justify-between gap-4"><label className="flex cursor-pointer items-center gap-2.5 text-sm text-slate-600"><input type="checkbox" name="remember" className="h-4 w-4 rounded border-slate-300 text-blue-600 accent-blue-600 focus:ring-blue-200" />Remember me</label><span className="text-xs text-slate-400">Demo access enabled</span></div>
    <button type="submit" className="flex h-12 w-full items-center justify-center rounded-xl bg-blue-600 text-sm font-semibold text-white shadow-sm shadow-blue-200 transition hover:bg-blue-700 active:translate-y-px">Sign in to your portal <Icon name="chevronRight" size={17} className="ml-2" /></button>
  </form>;
}

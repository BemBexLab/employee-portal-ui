import type { Metadata } from "next";
import { EmployeeAvatar } from "@/app/components/employee-avatar";
import { Icon } from "@/app/components/icons";
import { LoginForm } from "@/app/login/login-form";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your Bembex Lab employee self-service portal.",
};

export default function LoginPage() {
  return (
    <main className="flex min-h-screen bg-white">
      <section className="relative hidden min-h-screen w-[48%] overflow-hidden bg-slate-950 px-10 py-9 text-white lg:flex lg:flex-col xl:px-14 xl:py-11">
        <div className="absolute inset-0 opacity-40" aria-hidden="true">
          <div className="absolute -left-32 top-20 h-[460px] w-[460px] rounded-full border border-blue-400/20" />
          <div className="absolute -left-16 top-36 h-[300px] w-[300px] rounded-full border border-blue-400/20" />
          <div className="absolute -bottom-36 right-[-90px] h-[520px] w-[520px] rounded-full border-[44px] border-slate-800" />
          <div className="absolute right-24 top-24 grid grid-cols-6 gap-3 opacity-50">
            {Array.from({ length: 36 }).map((_, index) => (
              <span key={index} className="h-1 w-1 rounded-full bg-blue-300" />
            ))}
          </div>
        </div>
        <div className="relative z-10 flex items-center">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl">
            <Image className="rounded-md" src="/Bembex logo ( JPG ) Icon White 1.svg" alt="Bembex Lab Logo" width={24} height={24} />
          </span>
          <span className="text-[15px] font-bold tracking-tight">
            Bembex Lab
          </span>
          <span className="ml-1 border-l border-slate-700 pl-3 text-xs text-slate-500">
            Employee portal
          </span>
        </div>
        <div className="relative z-10 my-auto max-w-xl py-20">
          <p className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-blue-300">
            WORKPLACE, SIMPLIFIED
          </p>
          <h1 className="max-w-lg text-4xl font-semibold leading-[1.1] tracking-tight xl:text-5xl">
            Your workplace, simplified.
          </h1>
          <p className="mt-6 max-w-md text-base leading-7 text-slate-400">
            Access attendance, payroll information and employee requests from
            one place.
          </p>
          <div className="mt-12 flex max-w-md items-center gap-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
            <EmployeeAvatar
              initials="BL"
              size="md"
              className="bg-blue-950 text-blue-300 ring-blue-900"
            />
            <div>
              <p className="text-sm font-medium text-slate-200">
                A clearer workday starts here.
              </p>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                Keep your time, benefits, and requests in sync.
              </p>
            </div>
            <Icon
              name="shield"
              size={20}
              className="ml-auto shrink-0 text-blue-400"
            />
          </div>
        </div>
        <div className="relative z-10 flex items-center justify-between text-xs text-slate-600">
          <span>© 2026 Bembex Lab</span>
          <span>Employee Self-Service Portal</span>
        </div>
      </section>
      <section className="flex min-h-screen flex-1 items-center justify-center px-5 py-8 sm:px-8 lg:px-12 xl:px-20">
        <div className="w-full max-w-[430px]">
          <div className="mb-12 flex items-center lg:hidden">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl text-white">
              <Image className="rounded-md" src="/Bembex logo ( JPG ) Icon White 1.svg" alt="Bembex Lab Logo" width={24} height={24} />
            </span>
            {/* <span className="text-[15px] font-bold tracking-tight text-slate-950">
              Bembex Lab
            </span> */}
            <span className="ml-1 border-l border-slate-200 pl-3 text-xs text-slate-400">
              Employee portal
            </span>
          </div>
          <div>
            <p className="text-sm font-semibold text-blue-600">Welcome back</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 sm:text-[34px]">
              Sign in to your workspace
            </h2>
            <p className="mt-3 max-w-sm text-sm leading-6 text-slate-500">
              Use your work email or employee ID to continue.
            </p>
          </div>
          <LoginForm />
          <div className="mt-7 flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50/70 p-4 text-xs leading-5 text-slate-600">
            <Icon
              name="shield"
              size={16}
              className="mt-0.5 shrink-0 text-blue-600"
            />
            <p>
              <span className="font-semibold text-slate-800">Connected access</span> —
              enter an employee ID from the attendance server (for example, 108).
              Password verification is not configured yet.
            </p>
          </div>
          <p className="mt-8 text-center text-xs text-slate-400">
            Need help accessing your account?{" "}
            <a
              href="mailto:people@bembexlab.com"
              className="font-semibold text-slate-600 hover:text-slate-900"
            >
              Contact People team
            </a>
          </p>
        </div>
      </section>
    </main>
  );
}

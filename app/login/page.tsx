import type { Metadata } from "next";
import { Icon } from "@/app/components/icons";
import { LoginForm } from "@/app/login/login-form";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your Bembex Lab employee self-service portal.",
};

export default function LoginPage() {
  return (
    <main className="grid min-h-screen bg-slate-50 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
      <section className="relative hidden overflow-hidden bg-[#0b1220] px-10 py-9 text-white lg:flex lg:flex-col xl:px-14 xl:py-11">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
        >
          <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_0%_0%,rgba(59,130,246,0.18),transparent_55%),radial-gradient(80%_60%_at_100%_100%,rgba(14,165,233,0.16),transparent_55%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:44px_44px] opacity-40" />
          <div className="absolute -left-32 top-16 h-[420px] w-[420px] rounded-full border border-blue-400/15" />
          <div className="absolute -left-10 top-32 h-[280px] w-[280px] rounded-full border border-blue-400/10" />
          <div className="absolute -bottom-40 -right-24 h-[520px] w-[520px] rounded-full border-[40px] border-slate-800/60" />
          <div className="absolute right-24 top-24 grid grid-cols-6 gap-3 opacity-50">
            {Array.from({ length: 36 }).map((_, index) => (
              <span
                key={index}
                className="h-1 w-1 rounded-full bg-blue-300/80"
              />
            ))}
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-inset ring-white/15 backdrop-blur">
            <Image
              className="rounded-2xl"
              src="/Bembex logo ( JPG ) Icon White 1.svg"
              alt="Bembex Lab Logo"
              width={42}
              height={42}
            />
          </span>
          <span className="text-[15px] font-semibold tracking-tight">
            Bembex Lab
          </span>
          <span className="ml-1 border-l border-white/15 pl-3 text-xs font-medium text-slate-800">
            Employee portal
          </span>
        </div>

        <div className="relative z-10 my-auto max-w-xl py-20">
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-blue-200">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-400 shadow-[0_0_0_4px_rgba(59,130,246,0.18)]" />
            Workplace, simplified
          </span>
          <h1 className="mt-5 max-w-lg text-4xl font-semibold leading-[1.05] tracking-tight text-white xl:text-[44px]">
            Run your workday
            <br className="hidden xl:block" /> from one quiet place.
          </h1>
          <p className="mt-5 max-w-md text-[15px] leading-7 text-slate-300/90">
            Attendance, payroll and employee requests — unified, secure, and
            always in sync with your team.
          </p>

          <div className="mt-10 grid max-w-lg gap-3">
            <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-sm">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/15 ring-1 ring-inset ring-blue-400/20">
                <Icon name="clock" size={18} className="text-blue-300" />
              </span>
              <div>
                <p className="text-sm font-semibold text-white">
                  Attendance that updates itself
                </p>
                <p className="mt-0.5 text-xs leading-5 text-slate-400">
                  Pairs with the on-site attendance server in real time.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-sm">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/15 ring-1 ring-inset ring-blue-400/20">
                <Icon name="wallet" size={18} className="text-blue-300" />
              </span>
              <div>
                <p className="text-sm font-semibold text-white">
                  Payroll at a glance
                </p>
                <p className="mt-0.5 text-xs leading-5 text-slate-400">
                  Review payslips, tax info and benefits without the chase.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-sm">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/15 ring-1 ring-inset ring-blue-400/20">
                <Icon name="shield" size={18} className="text-blue-300" />
              </span>
              <div>
                <p className="text-sm font-semibold text-white">
                  Secure by design
                </p>
                <p className="mt-0.5 text-xs leading-5 text-slate-400">
                  Verified employee sessions, encrypted in transit.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-between text-xs text-slate-500">
          <span>© 2026 Bembex Lab</span>
          <span className="inline-flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_0_4px_rgba(52,211,153,0.18)]" />
            All systems operational
          </span>
        </div>
      </section>

      <section className="relative flex min-h-screen items-center justify-center px-5 py-10 sm:px-8 lg:px-12 xl:px-20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(59,130,246,0.08),transparent_60%)]"
        />

        <div className="relative w-full max-w-[440px]">
          <div className="mb-10 flex items-center lg:hidden">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-950 text-white">
              <Image
                className="rounded-md"
                src="/Bembex logo ( JPG ) Icon White 1.svg"
                alt="Bembex Lab Logo"
                width={22}
                height={22}
              />
            </span>
            <span className="ml-1 border-l border-slate-200 pl-3 text-xs font-medium text-slate-500">
              Employee portal
            </span>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-6 shadow-[0_1px_0_0_rgba(15,23,42,0.04),0_24px_60px_-24px_rgba(15,23,42,0.18)] backdrop-blur sm:p-8">
            <div>
              <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-blue-600">
                Welcome back
              </p>
              <h2 className="mt-2 text-[28px] font-semibold tracking-tight text-slate-950 sm:text-[30px]">
                Sign in to your workspace
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Use your work email or employee ID to continue.
              </p>
            </div>

            <LoginForm />

            <div className="relative mt-6 overflow-hidden rounded-2xl border border-white/20 bg-white/10 p-3.5 text-xs leading-5 text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25),0_8px_24px_-12px_rgba(15,23,42,0.4)] backdrop-blur-xl backdrop-saturate-150">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_0%_0%,rgba(255,255,255,0.35),transparent_55%),radial-gradient(80%_60%_at_100%_100%,rgba(59,130,246,0.25),transparent_55%)]"
              />
              <div className="relative flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-white/25 bg-white/15 text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.3)]">
                  <Icon name="help" size={13} />
                </span>
                <p>
                  <span className="font-semibold text-white">
                    Connected access
                  </span>{" "}
                  — enter your employee ID or work email and the password
                  stored on the attendance server.
                </p>
              </div>
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-slate-400">
            Need help accessing your account?{" "}
            <a
              href="mailto:people@bembexlab.com"
              className="font-semibold text-slate-700 transition hover:text-blue-600"
            >
              Contact People team
            </a>
          </p>
        </div>
      </section>
    </main>
  );
}
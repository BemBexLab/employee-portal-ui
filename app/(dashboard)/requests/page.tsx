"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { Icon } from "@/app/components/icons";
import { PageContainer } from "@/app/components/page-container";
import { StatusBadge } from "@/app/components/status-badge";
import { formatDisplayDate } from "@/app/lib/formatters";

type RequestType = "Leave" | "Remote Work";
type LeaveTypeUI = "Annual Leave" | "Sick Leave" | "Casual Leave" | "Unpaid Leave";

const leaveTypes: LeaveTypeUI[] = ["Annual Leave", "Sick Leave", "Casual Leave", "Unpaid Leave"];

type ApiRequest = {
  id: string;
  kind: "LEAVE" | "REMOTE_WORK";
  leaveCategory: "ANNUAL_LEAVE" | "SICK_LEAVE" | "CASUAL_LEAVE" | "UNPAID_LEAVE" | null;
  fromDate: string;
  toDate: string;
  reason: string;
  note: string | null;
  status: "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";
  submittedAt: string;
  decidedAt: string | null;
};

type RequestRecord = {
  id: string;
  requestType: string;
  dateRange: string;
  duration: string;
  submittedOn: string;
  status: "Pending" | "Approved" | "Rejected" | "Cancelled";
  reason: string;
};

const POLL_INTERVAL_MS = 60_000;

const leaveCategoryToApi: Record<LeaveTypeUI, ApiRequest["leaveCategory"]> = {
  "Annual Leave": "ANNUAL_LEAVE",
  "Sick Leave": "SICK_LEAVE",
  "Casual Leave": "CASUAL_LEAVE",
  "Unpaid Leave": "UNPAID_LEAVE",
};

const statusFromApi = (
  status: ApiRequest["status"],
): RequestRecord["status"] => {
  switch (status) {
    case "APPROVED":
      return "Approved";
    case "REJECTED":
      return "Rejected";
    case "CANCELLED":
      return "Cancelled";
    default:
      return "Pending";
  }
};

function toRecord(input: ApiRequest): RequestRecord {
  const sameDay = input.fromDate === input.toDate;
  const dateRange = sameDay
    ? formatDisplayDate(input.fromDate)
    : `${formatDisplayDate(input.fromDate)} - ${formatDisplayDate(input.toDate)}`;
  const requestType =
    input.kind === "LEAVE"
      ? leaveCategoryLabel(input.leaveCategory) ?? "Leave"
      : "Remote Work";
  return {
    id: input.id,
    requestType,
    dateRange,
    duration: sameDay ? "1 day" : "Multiple days",
    submittedOn: formatDisplayDate(input.submittedAt.slice(0, 10)),
    status: statusFromApi(input.status),
    reason: input.reason,
  };
}

function leaveCategoryLabel(
  category: ApiRequest["leaveCategory"],
): string | null {
  switch (category) {
    case "ANNUAL_LEAVE":
      return "Annual Leave";
    case "SICK_LEAVE":
      return "Sick Leave";
    case "CASUAL_LEAVE":
      return "Casual Leave";
    case "UNPAID_LEAVE":
      return "Unpaid Leave";
    default:
      return null;
  }
}

export default function RequestsPage() {
  const [requestType, setRequestType] = useState<RequestType>("Leave");
  const [leaveType, setLeaveType] = useState<LeaveTypeUI>("Annual Leave");
  const today = new Date().toISOString().slice(0, 10);
  const [fromDate, setFromDate] = useState(today);
  const [toDate, setToDate] = useState(today);
  const [reason, setReason] = useState("");
  const [note, setNote] = useState("");
  const [history, setHistory] = useState<RequestRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [notice, setNotice] = useState<{ tone: "success" | "error"; text: string } | null>(null);

  const mountedRef = useRef(true);
  const sequenceRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  async function loadHistory() {
    const seq = ++sequenceRef.current;
    try {
      const response = await fetch("/api/requests", { cache: "no-store" });
      if (!response.ok) throw new Error("Failed to load");
      const data = (await response.json()) as ApiRequest[];
      if (mountedRef.current && seq === sequenceRef.current) {
        setHistory(data.map(toRecord));
      }
    } catch {
      if (mountedRef.current && seq === sequenceRef.current) {
        setNotice({
          tone: "error",
          text: "Unable to load your request history right now.",
        });
      }
    } finally {
      if (mountedRef.current && seq === sequenceRef.current) {
        setLoading(false);
      }
    }
  }

  useEffect(() => {
    mountedRef.current = true;

    const id = setTimeout(() => {
      loadHistory();
    }, 0);

    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        loadHistory();
      }
    };
    const handleFocus = () => {
      loadHistory();
    };

    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("focus", handleFocus);

    intervalRef.current = setInterval(() => {
      if (document.visibilityState === "visible") {
        loadHistory();
      }
    }, POLL_INTERVAL_MS);

    return () => {
      mountedRef.current = false;
      clearTimeout(id);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setNotice(null);

    const payload = {
      kind: requestType === "Leave" ? ("LEAVE" as const) : ("REMOTE_WORK" as const),
      leaveCategory:
        requestType === "Leave" ? leaveCategoryToApi[leaveType] : undefined,
      fromDate,
      toDate,
      reason: reason.trim(),
      note: note.trim() || undefined,
    };

    try {
      const response = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json().catch(() => ({}))) as {
        message?: string;
        id?: string;
      };
      if (!response.ok) {
        setNotice({
          tone: "error",
          text: result.message ?? "Unable to submit your request.",
        });
        return;
      }
      await loadHistory();
      setReason("");
      setNote("");
      setNotice({
        tone: "success",
        text: `Request saved (${result.id?.slice(0, 8) ?? ""}). Your manager has been notified.`,
      });
    } catch {
      setNotice({
        tone: "error",
        text: "Network error — please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(requestId: string) {
    setNotice(null);
    setDeletingId(requestId);
    try {
      const response = await fetch(
        `/api/requests/${encodeURIComponent(requestId)}`,
        { method: "DELETE" },
      );
      if (!response.ok && response.status !== 204) {
        const body = (await response.json().catch(() => ({}))) as {
          message?: string;
        };
        throw new Error(body.message ?? "Unable to delete the request.");
      }
      setHistory((current) => current.filter((entry) => entry.id !== requestId));
      setNotice({ tone: "success", text: "Request cancelled and removed." });
      await loadHistory();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Network error — please try again.";
      setNotice({ tone: "error", text: message });
    } finally {
      setDeletingId(null);
    }
  }

  return <PageContainer>
    <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-sm font-semibold text-blue-600">Self-service</p><h2 className="mt-1.5 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">Requests</h2><p className="mt-2 text-sm leading-6 text-slate-500">Request leave or remote work and review your previous requests.</p></div><button type="button" onClick={() => document.getElementById("new-request-form")?.scrollIntoView({ behavior: "smooth", block: "start" })} className="inline-flex w-fit items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-200 transition hover:bg-blue-700"><Icon name="plus" size={17} />New Request</button></section>

    <div className="grid items-start gap-6 xl:grid-cols-[1.25fr_0.75fr]">
      <section id="new-request-form" className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-200/40"><div className="border-b border-slate-100 p-5 sm:p-6"><div className="flex items-start justify-between gap-4"><div><p className="text-base font-semibold text-slate-950">Create a request</p><p className="mt-1 text-sm text-slate-500">Share the details and your manager will review it.</p></div><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600"><Icon name="file" size={18} /></span></div></div><form onSubmit={handleSubmit} className="space-y-6 p-5 sm:p-6"><fieldset><legend className="mb-3 text-sm font-semibold text-slate-800">Request type</legend><div className="grid grid-cols-2 gap-3"><button type="button" aria-pressed={requestType === "Leave"} onClick={() => setRequestType("Leave")} className={`flex items-center gap-3 rounded-xl border p-3.5 text-left transition ${requestType === "Leave" ? "border-blue-500 bg-blue-50 text-blue-700 ring-4 ring-blue-50" : "border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"}`}><span className={`flex h-8 w-8 items-center justify-center rounded-lg ${requestType === "Leave" ? "bg-white text-blue-600" : "bg-slate-100 text-slate-400"}`}><Icon name="calendar" size={16} /></span><span><span className="block text-sm font-semibold">Leave</span><span className="mt-0.5 block text-xs text-slate-500">Time away from work</span></span></button><button type="button" aria-pressed={requestType === "Remote Work"} onClick={() => setRequestType("Remote Work")} className={`flex items-center gap-3 rounded-xl border p-3.5 text-left transition ${requestType === "Remote Work" ? "border-blue-500 bg-blue-50 text-blue-700 ring-4 ring-blue-50" : "border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"}`}><span className={`flex h-8 w-8 items-center justify-center rounded-lg ${requestType === "Remote Work" ? "bg-white text-blue-600" : "bg-slate-100 text-slate-400"}`}><Icon name="briefcase" size={16} /></span><span><span className="block text-sm font-semibold">Remote Work</span><span className="mt-0.5 block text-xs text-slate-500">Work from another location</span></span></button></div></fieldset>
        {requestType === "Leave" ? <fieldset><legend className="mb-3 text-sm font-semibold text-slate-800">Leave type</legend><div className="grid grid-cols-2 gap-2 sm:grid-cols-4">{leaveTypes.map((type) => <button key={type} type="button" aria-pressed={leaveType === type} onClick={() => setLeaveType(type)} className={`rounded-xl border px-3 py-2.5 text-xs font-semibold transition ${leaveType === type ? "border-blue-500 bg-blue-50 text-blue-700" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}>{type}</button>)}</div></fieldset> : <div className="flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50/70 p-4 text-sm text-slate-600"><Icon name="briefcase" size={17} className="mt-0.5 shrink-0 text-blue-600" /><p>Remote work requests are reviewed against your team&apos;s availability and workplace policy.</p></div>}
        <div className="grid gap-4 sm:grid-cols-2"><div><label htmlFor="from-date" className="mb-2 block text-sm font-semibold text-slate-700">From date</label><input id="from-date" name="fromDate" type="date" required value={fromDate} onChange={(event) => { setFromDate(event.target.value); if (event.target.value > toDate) setToDate(event.target.value); }} className="h-12 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100" /></div><div><label htmlFor="to-date" className="mb-2 block text-sm font-semibold text-slate-700">To date</label><input id="to-date" name="toDate" type="date" required min={fromDate} value={toDate} onChange={(event) => setToDate(event.target.value)} className="h-12 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100" /></div></div>
        <div><label htmlFor="request-reason" className="mb-2 block text-sm font-semibold text-slate-700">Reason</label><textarea id="request-reason" name="reason" required value={reason} onChange={(event) => setReason(event.target.value)} placeholder="Briefly explain the reason for your request..." className="min-h-28 w-full resize-y rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm leading-6 text-slate-700 outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100" /></div>
        <div><label htmlFor="request-note" className="mb-2 block text-sm font-semibold text-slate-700">Optional note <span className="font-normal text-slate-400">(optional)</span></label><textarea id="request-note" name="note" value={note} onChange={(event) => setNote(event.target.value)} placeholder="Add any supporting context..." className="min-h-20 w-full resize-y rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm leading-6 text-slate-700 outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100" /></div>
        <div className="flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between"><p className="text-xs leading-5 text-slate-500">Your manager will be notified for review.</p><button type="submit" disabled={submitting} className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm shadow-blue-200 transition hover:bg-blue-700 disabled:cursor-wait disabled:opacity-70">{submitting ? "Saving…" : <>Submit Request <Icon name="chevronRight" size={17} /></>}</button></div>{notice ? <div role="status" className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-sm ${notice.tone === "success" ? "border-emerald-100 bg-emerald-50 text-emerald-800" : "border-rose-100 bg-rose-50 text-rose-700"}`}><Icon name={notice.tone === "success" ? "check" : "help"} size={17} className={`shrink-0 ${notice.tone === "success" ? "text-emerald-600" : "text-rose-600"}`} />{notice.text}</div> : null}
      </form></section>

      <aside className="rounded-2xl border border-slate-200 bg-slate-950 p-6 text-white shadow-sm shadow-slate-200/40"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600"><Icon name="sparkles" size={18} /></div><h3 className="mt-5 text-xl font-semibold tracking-tight">Make planning easier</h3><p className="mt-2 text-sm leading-6 text-slate-400">Give your team enough context to review requests quickly and keep schedules in sync.</p><div className="mt-7 space-y-4 border-t border-slate-800 pt-5"><div className="flex gap-3"><span className="mt-0.5 text-blue-400">01</span><div><p className="text-sm font-medium text-slate-200">Choose your request type</p><p className="mt-1 text-xs leading-5 text-slate-500">Leave requests include the applicable leave category.</p></div></div><div className="flex gap-3"><span className="mt-0.5 text-blue-400">02</span><div><p className="text-sm font-medium text-slate-200">Add clear dates and context</p><p className="mt-1 text-xs leading-5 text-slate-500">A short reason helps your manager respond faster.</p></div></div><div className="flex gap-3"><span className="mt-0.5 text-blue-400">03</span><div><p className="text-sm font-medium text-slate-200">Track approval here</p><p className="mt-1 text-xs leading-5 text-slate-500">Every submission appears in your request history.</p></div></div></div></aside>
    </div>

    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-200/40"><div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-5 sm:p-6"><div><p className="text-base font-semibold text-slate-950">Request History</p><p className="mt-1 text-sm text-slate-500">Review your recent leave and remote work submissions.</p></div><span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600">{loading ? "Loading…" : `${history.length} requests`}</span></div>{loading ? <div className="p-8 text-center text-sm text-slate-500">Loading your requests…</div> : history.length === 0 ? <div className="p-8 text-center text-sm text-slate-500">No requests yet. Submit one above and it will appear here.</div> : <><div className="hidden max-h-80 overflow-x-auto overflow-y-auto md:block"><table className="w-full min-w-[920px] text-left"><thead className="sticky top-0 z-10 bg-white"><tr className="border-b border-slate-100 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400"><th className="px-5 py-3.5 sm:px-6">Request type</th><th className="px-5 py-3.5">Date range</th><th className="px-5 py-3.5">Duration</th><th className="px-5 py-3.5">Submitted on</th><th className="px-5 py-3.5">Status</th><th className="px-5 py-3.5">Reason</th><th className="px-5 py-3.5 text-right">Action</th></tr></thead><tbody className="divide-y divide-slate-100">{history.map((request) => <tr key={request.id} className="text-sm transition-colors hover:bg-slate-50"><td className="px-5 py-4 font-medium text-slate-800 sm:px-6">{request.requestType}</td><td className="px-5 py-4 text-slate-600">{request.dateRange}</td><td className="px-5 py-4 text-slate-500">{request.duration}</td><td className="px-5 py-4 text-slate-500">{request.submittedOn}</td><td className="px-5 py-4"><StatusBadge status={request.status} showDot /></td><td className="max-w-[240px] truncate px-5 py-4 text-slate-500">{request.reason}</td><td className="px-5 py-4 text-right">{request.status === "Pending" ? <button type="button" disabled={deletingId === request.id} onClick={() => handleDelete(request.id)} className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 px-2.5 py-1.5 text-xs font-semibold text-rose-700 transition hover:border-rose-300 hover:bg-rose-50 dark:border-rose-400/40 dark:text-rose-300 dark:hover:border-white dark:hover:bg-white dark:hover:text-slate-950 dark:hover:[&_svg]:text-slate-950 disabled:cursor-wait disabled:opacity-60"><Icon name="close" size={13} />{deletingId === request.id ? "Cancelling…" : "Cancel"}</button> : <span className="text-xs text-slate-400">—</span>}</td></tr>)}</tbody></table></div><div className="max-h-80 divide-y divide-slate-100 overflow-y-auto md:hidden">{history.map((request) => <article key={request.id} className="p-5"><div className="flex items-start justify-between gap-3"><div><p className="text-sm font-semibold text-slate-900">{request.requestType}</p><p className="mt-1 text-xs text-slate-500">{request.dateRange} · {request.duration}</p></div><StatusBadge status={request.status} /></div><p className="mt-2 text-xs text-slate-400">Submitted {request.submittedOn}</p><p className="mt-2 text-xs leading-5 text-slate-500">{request.reason}</p>{request.status === "Pending" ? <div className="mt-3 flex justify-end"><button type="button" disabled={deletingId === request.id} onClick={() => handleDelete(request.id)} className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 px-2.5 py-1.5 text-xs font-semibold text-rose-700 transition hover:border-rose-300 hover:bg-rose-50 dark:border-rose-400/40 dark:text-rose-300 dark:hover:border-white dark:hover:bg-white dark:hover:text-slate-950 dark:hover:[&_svg]:text-slate-950 disabled:cursor-wait disabled:opacity-60"><Icon name="close" size={13} />{deletingId === request.id ? "Cancelling…" : "Cancel"}</button></div> : null}</article>)}</div></>}</section>
  </PageContainer>;
}
"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { Icon } from "@/app/components/icons";
import { PageContainer } from "@/app/components/page-container";
import { usePortal } from "@/app/components/portal-provider";
import { SelectMenu } from "@/app/components/select-menu";
import { StatusBadge } from "@/app/components/status-badge";
import { toAttendanceRecords } from "@/app/lib/portal-data";
import { formatDisplayDate } from "@/app/lib/formatters";

type CorrectionRecord = {
  id: string;
  attendanceId: string;
  attendanceDate: string;
  complaintType: string;
  description: string;
  expectedCheckIn: string;
  expectedCheckOut: string;
  submittedOn: string;
};

const complaintTypes = [
  { value: "Incorrect check-in", label: "Incorrect check-in" },
  { value: "Incorrect check-out", label: "Incorrect check-out" },
  { value: "Incorrect status", label: "Incorrect attendance status" },
  { value: "Missing attendance", label: "Missing attendance record" },
  { value: "Other", label: "Other issue" },
];

export default function AttendanceCorrectionPage() {
  const portal = usePortal();
  const attendance = useMemo(() => toAttendanceRecords(portal), [portal]);
  const attendanceOptions = attendance.map((entry) => ({
    value: entry.id,
    label: `${formatDisplayDate(entry.date)} · ${entry.status}`,
  }));
  const [attendanceId, setAttendanceId] = useState(
    attendanceOptions[0]?.value ?? "general",
  );
  const [complaintType, setComplaintType] = useState(complaintTypes[0].value);
  const [expectedCheckIn, setExpectedCheckIn] = useState("");
  const [expectedCheckOut, setExpectedCheckOut] = useState("");
  const [description, setDescription] = useState("");
  const [corrections, setCorrections] = useState<CorrectionRecord[]>([]);
  const [filedId, setFiledId] = useState("");
  const selectedAttendance = attendance.find((entry) => entry.id === attendanceId);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const complaintId = `COR-${portal.employee.employeeCode}-${String(corrections.length + 1).padStart(3, "0")}`;
    const correction: CorrectionRecord = {
      id: complaintId,
      attendanceId,
      attendanceDate: selectedAttendance?.date ?? "Not recorded",
      complaintType,
      description,
      expectedCheckIn,
      expectedCheckOut,
      submittedOn: new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        timeZone: portal.employee.timeZone,
      }).format(new Date()),
    };
    setCorrections((current) => [correction, ...current]);
    setFiledId(complaintId);
    setDescription("");
    setExpectedCheckIn("");
    setExpectedCheckOut("");
  }

  return (
    <PageContainer>
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold text-blue-600">Employee self-service</p>
          <h2 className="mt-1.5 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">File an attendance correction</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">Select the attendance record, explain what is incorrect, and provide the details needed to review your complaint.</p>
        </div>
        <Link href="/attendance" className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50">
          <Icon name="chevronRight" size={16} className="rotate-180 text-slate-400" />
          Back to attendance
        </Link>
      </section>

      {filedId ? (
        <div role="status" className="flex items-start gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-sm text-emerald-800">
          <Icon name="check" size={19} className="mt-0.5 shrink-0 text-emerald-600" />
          <div><p className="font-semibold">Correction complaint filed</p><p className="mt-1 text-emerald-700">Reference {filedId} has been added to your filing history below.</p></div>
        </div>
      ) : null}

      <div className="grid items-start gap-6 xl:grid-cols-[1fr_0.42fr]">
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-200/40">
          <div className="flex items-start justify-between gap-4 border-b border-slate-100 p-5 sm:p-6">
            <div><p className="text-base font-semibold text-slate-950">Complaint details</p><p className="mt-1 text-sm text-slate-500">Fields marked as required must be completed.</p></div>
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600"><Icon name="file" size={18} /></span>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6 p-5 sm:p-6">
            {attendanceOptions.length ? (
              <SelectMenu id="attendance-record" label="Attendance record" value={attendanceId} options={attendanceOptions} onChange={setAttendanceId} />
            ) : (
              <div className="rounded-xl border border-amber-100 bg-amber-50 p-4 text-sm text-amber-700">No attendance records are currently available. Please contact the People team directly.</div>
            )}

            {selectedAttendance ? (
              <div className="grid gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:grid-cols-4">
                <RecordDetail label="Date" value={formatDisplayDate(selectedAttendance.date)} />
                <RecordDetail label="Current status" value={selectedAttendance.status} />
                <RecordDetail label="Check-in" value={selectedAttendance.checkIn} />
                <RecordDetail label="Check-out" value={selectedAttendance.checkOut} />
              </div>
            ) : null}

            <SelectMenu id="complaint-type" label="What needs correction?" value={complaintType} options={complaintTypes} onChange={setComplaintType} />

            <div className="grid gap-4 sm:grid-cols-2">
              <div><label htmlFor="expected-check-in" className="mb-2 block text-sm font-semibold text-slate-700">Correct check-in <span className="font-normal text-slate-400">(optional)</span></label><input id="expected-check-in" type="time" value={expectedCheckIn} onChange={(event) => setExpectedCheckIn(event.target.value)} className="h-12 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100" /></div>
              <div><label htmlFor="expected-check-out" className="mb-2 block text-sm font-semibold text-slate-700">Correct check-out <span className="font-normal text-slate-400">(optional)</span></label><input id="expected-check-out" type="time" value={expectedCheckOut} onChange={(event) => setExpectedCheckOut(event.target.value)} className="h-12 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100" /></div>
            </div>

            <div>
              <label htmlFor="correction-description" className="mb-2 block text-sm font-semibold text-slate-700">Complaint <span className="text-rose-600">*</span></label>
              <textarea id="correction-description" required minLength={10} value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Describe what happened and what the attendance record should show..." className="min-h-32 w-full resize-y rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm leading-6 text-slate-700 outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100" />
              <p className="mt-2 text-xs text-slate-400">Include enough context for the reviewer to verify the correction.</p>
            </div>

            <div className="flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs leading-5 text-slate-500">Your complaint will be marked pending review.</p>
              <button type="submit" disabled={!attendanceOptions.length} className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm shadow-blue-200 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50">File complaint <Icon name="chevronRight" size={17} /></button>
            </div>
          </form>
        </section>

        <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/40 sm:p-6">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600"><Icon name="help" size={18} /></span>
          <h3 className="mt-4 text-base font-semibold text-slate-950">Before filing</h3>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-500">
            <li className="flex gap-2.5"><span className="font-semibold text-blue-600">01</span><span>Choose the exact attendance date affected.</span></li>
            <li className="flex gap-2.5"><span className="font-semibold text-blue-600">02</span><span>Provide the correct times when you know them.</span></li>
            <li className="flex gap-2.5"><span className="font-semibold text-blue-600">03</span><span>Explain the issue clearly for faster review.</span></li>
          </ul>
        </aside>
      </div>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-200/40">
        <div className="flex items-center justify-between border-b border-slate-100 p-5 sm:p-6"><div><p className="text-base font-semibold text-slate-950">Filing history</p><p className="mt-1 text-sm text-slate-500">Complaints filed during this session.</p></div><span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600">{corrections.length}</span></div>
        {corrections.length ? <div className="divide-y divide-slate-100">{corrections.map((correction) => <article key={correction.id} className="grid gap-4 p-5 sm:grid-cols-[1fr_auto] sm:p-6"><div><div className="flex flex-wrap items-center gap-2"><p className="font-semibold text-slate-900">{correction.complaintType}</p><StatusBadge status="Pending" showDot /></div><p className="mt-2 text-sm leading-6 text-slate-600">{correction.description}</p>{correction.expectedCheckIn || correction.expectedCheckOut ? <p className="mt-2 text-xs font-medium text-slate-500">Requested times: check-in {correction.expectedCheckIn || "unchanged"} · check-out {correction.expectedCheckOut || "unchanged"}</p> : null}<p className="mt-2 text-xs text-slate-400">{correction.attendanceDate === "Not recorded" ? correction.attendanceDate : formatDisplayDate(correction.attendanceDate)} · Filed {correction.submittedOn}</p></div><p className="text-xs font-semibold text-slate-500">{correction.id}</p></article>)}</div> : <div className="px-6 py-12 text-center"><span className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-400"><Icon name="file" size={19} /></span><p className="mt-3 text-sm font-semibold text-slate-900">No complaints filed</p><p className="mt-1 text-sm text-slate-500">Your submitted corrections will appear here.</p></div>}
      </section>
    </PageContainer>
  );
}

function RecordDetail({ label, value }: { label: string; value: string }) {
  return <div><p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">{label}</p><p className="mt-1.5 text-sm font-medium text-slate-700">{value}</p></div>;
}

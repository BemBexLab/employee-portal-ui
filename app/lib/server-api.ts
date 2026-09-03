import "server-only";
import type { PortalData } from "@/app/lib/portal-types";

export const serverUrl = process.env.SERVER_URL ?? "http://localhost:4000";

export class PortalApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
  }
}

export async function getEmployeePortal(identity: string) {
  let response: Response;

  try {
    response = await fetch(
      `${serverUrl}/portal/employees/${encodeURIComponent(identity)}`,
      { cache: "no-store" },
    );
  } catch {
    throw new PortalApiError("The employee server is unavailable.", 503);
  }

  if (!response.ok) {
    throw new PortalApiError(
      "The employee server rejected the request.",
      response.status,
    );
  }

  const data = (await response.json()) as PortalData | null;
  return data;
}

export async function authenticateEmployee(identity: string, password: string) {
  let response: Response;

  try {
    response = await fetch(`${serverUrl}/portal/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identity, password }),
      cache: "no-store",
    });
  } catch {
    throw new PortalApiError("The employee server is unavailable.", 503);
  }

  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as {
      message?: string;
    };
    throw new PortalApiError(
      body.message ?? "Unable to sign in.",
      response.status,
    );
  }

  return (await response.json()) as {
    employee: {
      id: string;
      employeeCode: string;
      name: string;
      email: string | null;
    };
  };
}

export type EmployeeRequest = {
  id: string;
  kind: "LEAVE" | "REMOTE_WORK";
  leaveCategory: string | null;
  fromDate: string;
  toDate: string;
  reason: string;
  note: string | null;
  status: "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";
  submittedAt: string;
  decidedAt: string | null;
};

export type CreateEmployeeRequestPayload = {
  kind: "LEAVE" | "REMOTE_WORK";
  leaveCategory?:
    | "ANNUAL_LEAVE"
    | "SICK_LEAVE"
    | "CASUAL_LEAVE"
    | "UNPAID_LEAVE";
  fromDate: string;
  toDate: string;
  reason: string;
  note?: string | null;
};

async function postSigned<T>(path: string, init: RequestInit = {}) {
  let response: Response;

  try {
    response = await fetch(`${serverUrl}${path}`, {
      ...init,
      cache: "no-store",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(init.headers ?? {}),
      },
    });
  } catch {
    throw new PortalApiError("The employee server is unavailable.", 503);
  }

  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as {
      message?: string;
    };
    throw new PortalApiError(
      body.message ?? "Request failed.",
      response.status,
    );
  }

  return (await response.json()) as T;
}

export function listEmployeeRequests() {
  return postSigned<EmployeeRequest[]>("/portal/requests", { method: "GET" });
}

export function createEmployeeRequest(payload: CreateEmployeeRequestPayload) {
  return postSigned<{ id: string; submittedAt: string }>(
    "/portal/requests",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  );
}

export type ComplaintTypeApi =
  | "INCORRECT_CHECK_IN"
  | "INCORRECT_CHECK_OUT"
  | "INCORRECT_STATUS"
  | "MISSING_ATTENDANCE"
  | "OTHER";

export type CorrectionStatusApi =
  | "PENDING"
  | "APPROVED"
  | "REJECTED";

export type AttendanceCorrection = {
  id: string;
  dailyAttendanceId: string | null;
  complaintType: ComplaintTypeApi;
  expectedCheckIn: string | null;
  expectedCheckOut: string | null;
  description: string;
  status: CorrectionStatusApi;
  submittedAt: string;
  decidedAt: string | null;
  attendanceDate: string | null;
};

export type CreateAttendanceCorrectionPayload = {
  dailyAttendanceId?: string | null;
  complaintType: ComplaintTypeApi;
  expectedCheckIn?: string | null;
  expectedCheckOut?: string | null;
  description: string;
};

export function listAttendanceCorrections() {
  return postSigned<AttendanceCorrection[]>("/portal/corrections", {
    method: "GET",
  });
}

export function createAttendanceCorrection(
  payload: CreateAttendanceCorrectionPayload,
) {
  return postSigned<{ id: string; submittedAt: string }>(
    "/portal/corrections",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  );
}

export async function deleteAttendanceCorrection(correctionId: string) {
  let response: Response;

  try {
    response = await fetch(
      `${serverUrl}/portal/corrections/${encodeURIComponent(correctionId)}`,
      {
        method: "DELETE",
        cache: "no-store",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  } catch {
    throw new PortalApiError("The employee server is unavailable.", 503);
  }

  if (!response.ok && response.status !== 204) {
    const body = (await response.json().catch(() => ({}))) as {
      message?: string;
    };
    throw new PortalApiError(
      body.message ?? "Request failed.",
      response.status,
    );
  }
}

export type PayrollDeduction = {
  cycle: string;
  lateDays: number;
  halfDays: number;
  absentDays: number;
  lateHalfDayDeductionDays: number;
  totalDeductionDays: number;
  monthlySalary: number;
  payrollDays: number;
  dailyRate: number;
  deductionAmount: number;
  calculatedThrough: string | null;
};

export async function fetchPayrollDeductionServer(
  cycle?: string,
): Promise<PayrollDeduction | null> {
  let response: Response;
  const cycleQuery = cycle
    ? `?cycle=${encodeURIComponent(cycle)}`
    : "";

  try {
    response = await fetch(
      `${serverUrl}/portal/deductions${cycleQuery}`,
      { cache: "no-store" },
    );
  } catch {
    throw new PortalApiError("The employee server is unavailable.", 503);
  }

  if (response.status === 404) return null;
  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as {
      message?: string;
    };
    throw new PortalApiError(
      body.message ?? "Request failed.",
      response.status,
    );
  }

  return (await response.json()) as PayrollDeduction;
}

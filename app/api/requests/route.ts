import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type {
  CreateEmployeeRequestPayload,
  EmployeeRequest,
} from "@/app/lib/server-api";
import { PortalApiError } from "@/app/lib/server-api";

export const dynamic = "force-dynamic";

const sessionCookie = "employee_portal_identity";
const bffSharedSecret = process.env.BFF_SHARED_SECRET ?? "";
const nestServerUrl = process.env.SERVER_URL ?? "";

type ErrorBody = { message: string };

function errorResponse(status: number, message: string) {
  return NextResponse.json<ErrorBody>({ message }, { status });
}

function buildAuthHeaders(employeeCode: string): HeadersInit {
  const headers: Record<string, string> = {};
  if (bffSharedSecret) {
    headers["x-bff-token"] = bffSharedSecret;
    headers["x-employee-code"] = employeeCode;
  }
  return headers;
}

function requireEnv(): NextResponse | null {
  if (!nestServerUrl) {
    return errorResponse(
      500,
      "SERVER_URL is not configured on the client deployment.",
    );
  }
  if (!bffSharedSecret) {
    return errorResponse(
      500,
      "BFF_SHARED_SECRET is not configured on the client deployment.",
    );
  }
  return null;
}

export async function GET() {
  const identity = (await cookies()).get(sessionCookie)?.value;
  if (!identity) return errorResponse(401, "Not signed in.");
  const envError = requireEnv();
  if (envError) return envError;

  try {
    const response = await fetch(`${nestServerUrl}/portal/requests`, {
      method: "GET",
      cache: "no-store",
      headers: buildAuthHeaders(identity),
    });
    if (!response.ok) {
      const body = (await response.json().catch(() => ({}))) as {
        message?: string;
      };
      throw new PortalApiError(
        body.message ?? "Request failed.",
        response.status,
      );
    }
    const data = (await response.json()) as EmployeeRequest[];
    return NextResponse.json<EmployeeRequest[]>(data);
  } catch (error) {
    const status = error instanceof PortalApiError ? error.status : 500;
    const message =
      error instanceof PortalApiError ? error.message : "Request failed.";
    return errorResponse(status >= 500 ? 503 : status, message);
  }
}

export async function POST(request: Request) {
  const identity = (await cookies()).get(sessionCookie)?.value;
  if (!identity) return errorResponse(401, "Not signed in.");
  const envError = requireEnv();
  if (envError) return envError;

  let raw: Record<string, unknown>;
  try {
    raw = (await request.json()) as Record<string, unknown>;
  } catch {
    return errorResponse(400, "Invalid request body.");
  }

  const body = normalizeRequest(raw);
  if (!body) return errorResponse(400, "Invalid request body.");

  try {
    const response = await fetch(`${nestServerUrl}/portal/requests`, {
      method: "POST",
      cache: "no-store",
      headers: {
        ...buildAuthHeaders(identity),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      const body = (await response.json().catch(() => ({}))) as {
        message?: string;
      };
      throw new PortalApiError(
        body.message ?? "Request failed.",
        response.status,
      );
    }
    const result = (await response.json()) as { id: string; submittedAt: string };
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    const status = error instanceof PortalApiError ? error.status : 500;
    const message =
      error instanceof PortalApiError ? error.message : "Request failed.";
    return errorResponse(status >= 500 ? 503 : status, message);
  }
}

function normalizeRequest(
  raw: Record<string, unknown>,
): CreateEmployeeRequestPayload | null {
  const kind =
    raw.kind === "LEAVE" || raw.kind === "REMOTE_WORK" ? raw.kind : null;
  const fromDate = typeof raw.fromDate === "string" ? raw.fromDate : "";
  const toDate = typeof raw.toDate === "string" ? raw.toDate : "";
  const reason = typeof raw.reason === "string" ? raw.reason.trim() : "";
  const note = typeof raw.note === "string" ? raw.note : undefined;
  const leaveCategoryRaw = raw.leaveCategory;
  const validCategories = [
    "ANNUAL_LEAVE",
    "SICK_LEAVE",
    "CASUAL_LEAVE",
    "UNPAID_LEAVE",
  ] as const;

  if (!kind || !fromDate || !toDate || !reason) return null;
  if (fromDate > toDate) return null;

  const leaveCategory =
    kind === "LEAVE" &&
    typeof leaveCategoryRaw === "string" &&
    (validCategories as readonly string[]).includes(leaveCategoryRaw)
      ? (leaveCategoryRaw as (typeof validCategories)[number])
      : undefined;

  return {
    kind,
    leaveCategory,
    fromDate,
    toDate,
    reason,
    note,
  };
}
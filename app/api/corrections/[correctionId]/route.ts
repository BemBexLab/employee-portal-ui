import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { serverUrl } from "@/app/lib/server-api";
import type {
  AttendanceCorrection,
  CreateAttendanceCorrectionPayload,
  ComplaintTypeApi,
} from "@/app/lib/server-api";
import { PortalApiError } from "@/app/lib/server-api";

export const dynamic = "force-dynamic";

const sessionCookie = "employee_portal_identity";
const bffSharedSecret = process.env.BFF_SHARED_SECRET ?? "";

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

export async function GET() {
  const identity = (await cookies()).get(sessionCookie)?.value;
  if (!identity) return errorResponse(401, "Not signed in.");
  if (!bffSharedSecret) {
    return errorResponse(
      500,
      "BFF shared secret is not configured on the client.",
    );
  }

  try {
    const response = await fetch(`${serverUrl}/portal/corrections`, {
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
    const data = (await response.json()) as AttendanceCorrection[];
    return NextResponse.json<AttendanceCorrection[]>(data);
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
  if (!bffSharedSecret) {
    return errorResponse(
      500,
      "BFF shared secret is not configured on the client.",
    );
  }

  let raw: Record<string, unknown>;
  try {
    raw = (await request.json()) as Record<string, unknown>;
  } catch {
    return errorResponse(400, "Invalid request body.");
  }

  const body = normalizeRequest(raw);
  if (!body) return errorResponse(400, "Invalid request body.");

  try {
    const response = await fetch(`${serverUrl}/portal/corrections`, {
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
    const result = (await response.json()) as {
      id: string;
      submittedAt: string;
    };
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    const status = error instanceof PortalApiError ? error.status : 500;
    const message =
      error instanceof PortalApiError ? error.message : "Request failed.";
    return errorResponse(status >= 500 ? 503 : status, message);
  }
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ correctionId: string }> },
) {
  const identity = (await cookies()).get(sessionCookie)?.value;
  if (!identity) return errorResponse(401, "Not signed in.");
  if (!bffSharedSecret) {
    return errorResponse(
      500,
      "BFF shared secret is not configured on the client.",
    );
  }

  const { correctionId } = await context.params;
  if (!correctionId) return errorResponse(400, "Missing correction id.");

  try {
    const response = await fetch(
      `${serverUrl}/portal/corrections/${encodeURIComponent(correctionId)}`,
      {
        method: "DELETE",
        cache: "no-store",
        headers: buildAuthHeaders(identity),
      },
    );
    if (!response.ok && response.status !== 204) {
      const body = (await response.json().catch(() => ({}))) as {
        message?: string;
      };
      throw new PortalApiError(
        body.message ?? "Request failed.",
        response.status,
      );
    }
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    const status = error instanceof PortalApiError ? error.status : 500;
    const message =
      error instanceof PortalApiError ? error.message : "Request failed.";
    return errorResponse(status >= 500 ? 503 : status, message);
  }
}

function normalizeRequest(
  raw: Record<string, unknown>,
): CreateAttendanceCorrectionPayload | null {
  const complaintTypes: readonly ComplaintTypeApi[] = [
    "INCORRECT_CHECK_IN",
    "INCORRECT_CHECK_OUT",
    "INCORRECT_STATUS",
    "MISSING_ATTENDANCE",
    "OTHER",
  ];

  const complaintType =
    typeof raw.complaintType === "string" &&
    (complaintTypes as readonly string[]).includes(raw.complaintType)
      ? (raw.complaintType as ComplaintTypeApi)
      : null;

  const description =
    typeof raw.description === "string" ? raw.description.trim() : "";

  if (!complaintType || !description) return null;

  return {
    dailyAttendanceId:
      typeof raw.dailyAttendanceId === "string"
        ? raw.dailyAttendanceId
        : null,
    complaintType,
    expectedCheckIn:
      typeof raw.expectedCheckIn === "string"
        ? raw.expectedCheckIn
        : null,
    expectedCheckOut:
      typeof raw.expectedCheckOut === "string"
        ? raw.expectedCheckOut
        : null,
    description,
  };
}
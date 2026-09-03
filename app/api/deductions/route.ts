import { cookies } from "next/headers";
import { NextResponse } from "next/server";
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

export async function GET(request: Request) {
  const identity = (await cookies()).get(sessionCookie)?.value;
  if (!identity) return errorResponse(401, "Not signed in.");
  const envError = requireEnv();
  if (envError) return envError;

  const { searchParams } = new URL(request.url);
  const cycle = (searchParams.get("cycle") ?? "").trim();
  const cycleQuery = cycle
    ? `?cycle=${encodeURIComponent(cycle)}`
    : "";

  try {
    const response = await fetch(
      `${nestServerUrl}/portal/deductions${cycleQuery}`,
      {
        method: "GET",
        cache: "no-store",
        headers: buildAuthHeaders(identity),
      },
    );

    if (response.status === 404) {
      return NextResponse.json(null, { status: 200 });
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

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    const status = error instanceof PortalApiError ? error.status : 500;
    const message =
      error instanceof PortalApiError ? error.message : "Request failed.";
    return errorResponse(status >= 500 ? 503 : status, message);
  }
}

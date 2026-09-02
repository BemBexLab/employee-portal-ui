import "server-only";
import type { PortalData } from "@/app/lib/portal-types";

const serverUrl = process.env.SERVER_URL ?? "http://localhost:4000";

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
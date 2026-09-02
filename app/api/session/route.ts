import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  authenticateEmployee,
  getEmployeePortal,
  PortalApiError,
} from "@/app/lib/server-api";

const sessionCookie = "employee_portal_identity";

export async function POST(request: Request) {
  let identity = "";
  let password = "";

  try {
    const body = (await request.json()) as {
      identity?: unknown;
      password?: unknown;
    };
    identity = typeof body.identity === "string" ? body.identity.trim() : "";
    password = typeof body.password === "string" ? body.password : "";
  } catch {
    return NextResponse.json({ message: "Invalid request." }, { status: 400 });
  }

  if (!identity) {
    return NextResponse.json(
      { message: "Enter your employee ID or linked work email." },
      { status: 400 },
    );
  }

  if (!password) {
    return NextResponse.json(
      { message: "Enter your password to continue." },
      { status: 400 },
    );
  }

  try {
    await authenticateEmployee(identity, password);

    const data = await getEmployeePortal(identity);
    if (!data) {
      return NextResponse.json(
        { message: "No employee matches those details." },
        { status: 401 },
      );
    }

    if (!data.employee.isActive) {
      return NextResponse.json(
        { message: "This employee account is inactive." },
        { status: 403 },
      );
    }

    const cookieStore = await cookies();
    cookieStore.set(sessionCookie, data.employee.employeeCode, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 12,
    });
    return NextResponse.json({ employee: data.employee });
  } catch (error) {
    const status = error instanceof PortalApiError ? error.status : 500;
    const message =
      error instanceof PortalApiError ? error.message : undefined;
    if (status === 404 || status === 401) {
      return NextResponse.json(
        { message: message ?? "No employee matches those details." },
        { status: 401 },
      );
    }
    if (status === 403) {
      return NextResponse.json(
        { message: message ?? "This employee account is inactive." },
        { status: 403 },
      );
    }
    return NextResponse.json(
      { message: message ?? "Unable to reach the employee server. Please try again." },
      { status: status >= 500 ? 503 : status },
    );
  }
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete(sessionCookie);
  return new NextResponse(null, { status: 204 });
}
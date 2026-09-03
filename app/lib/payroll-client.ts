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

export async function fetchPayrollDeduction(
  cycle?: string,
): Promise<PayrollDeduction | null> {
  let response: Response;
  const cycleQuery = cycle
    ? `?cycle=${encodeURIComponent(cycle)}`
    : "";

  try {
    response = await fetch(
      `/api/deductions${cycleQuery}`,
      { cache: "no-store" },
    );
  } catch {
    throw new Error("Unable to reach the portal.");
  }

  if (response.status === 404) return null;
  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as {
      message?: string;
    };
    throw new Error(body.message ?? "Request failed.");
  }

  return (await response.json()) as PayrollDeduction;
}

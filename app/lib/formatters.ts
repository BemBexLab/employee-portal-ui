export function formatDisplayDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(year, month - 1, day));
}

export function formatPKR(value: number) {
  return `PKR ${value.toLocaleString("en-PK")}`;
}

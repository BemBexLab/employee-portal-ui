type EmployeeAvatarProps = { initials: string; size?: "sm" | "md" | "lg"; className?: string; showStatus?: boolean };
const sizes = { sm: "h-8 w-8 text-[11px]", md: "h-10 w-10 text-xs", lg: "h-16 w-16 text-lg" };

export function EmployeeAvatar({ initials, size = "md", className = "", showStatus = false }: EmployeeAvatarProps) {
  return <span className={`relative inline-flex shrink-0 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-700 ring-1 ring-inset ring-blue-200 ${sizes[size]} ${className}`}>{initials}{showStatus ? <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500" /> : null}</span>;
}

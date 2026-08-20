export function PageContainer({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`space-y-6 ${className}`}>{children}</div>;
}

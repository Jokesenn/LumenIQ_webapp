import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  subtext: string;
  icon: LucideIcon;
  positive?: boolean;
}

export function StatCard({
  label,
  value,
  subtext,
  icon: Icon,
  positive,
}: StatCardProps) {
  return (
    <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border)] p-5">
      <div className="flex justify-between items-start mb-3">
        <span className="text-[13px] text-[var(--text-muted)]">{label}</span>
        <Icon size={20} className="text-[var(--text-muted)]" />
      </div>
      <p
        className={`text-[28px] font-bold mb-1 ${
          positive ? "text-[var(--success)]" : ""
        }`}
      >
        {value}
      </p>
      <p className="text-xs text-[var(--text-muted)]">{subtext}</p>
    </div>
  );
}

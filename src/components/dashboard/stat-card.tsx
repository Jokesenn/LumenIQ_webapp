import { LucideIcon, ArrowUpRight, ArrowDownRight } from "lucide-react";

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
    <div className="bg-zinc-900/50 rounded-xl border border-white/[0.08] p-5 transition-colors hover:border-white/[0.12]">
      <div className="flex justify-between items-start mb-3">
        <span className="text-sm text-zinc-400">{label}</span>
        <div className="p-2.5 bg-indigo-500/10 rounded-xl">
          <Icon size={18} className="text-indigo-400" />
        </div>
      </div>
      <p className="text-2xl font-bold text-white mb-1">
        {value}
      </p>
      <div className="flex items-center gap-1.5">
        {positive !== undefined && (
          positive ? (
            <ArrowUpRight size={14} className="text-emerald-500" />
          ) : (
            <ArrowDownRight size={14} className="text-red-500" />
          )
        )}
        <p className={`text-xs ${
          positive === true ? "text-emerald-500" : positive === false ? "text-red-500" : "text-zinc-500"
        }`}>
          {subtext}
        </p>
      </div>
    </div>
  );
}

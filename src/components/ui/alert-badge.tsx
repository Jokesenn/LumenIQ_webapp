import { cva, type VariantProps } from "class-variance-authority"
import {
  AlertTriangle,
  AlertCircle,
  TrendingDown,
  Sparkles,
  RefreshCw,
  Zap,
  type LucideIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"

const alertBadgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        destructive: "bg-red-500/20 text-red-400 border border-red-500/30",
        warning: "bg-orange-500/20 text-orange-400 border border-orange-500/30",
        info: "bg-blue-500/20 text-blue-400 border border-blue-500/30",
        purple: "bg-purple-500/20 text-purple-400 border border-purple-500/30",
        success: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
      },
      size: {
        sm: "text-[10px] px-1.5 py-0.5",
        default: "text-xs px-2 py-0.5",
      },
    },
    defaultVariants: {
      variant: "info",
      size: "default",
    },
  }
)

export type AlertType = "attention" | "watch" | "drift" | "new" | "model-changed" | "gated"

interface BadgeConfig {
  label: string
  icon: LucideIcon
  variant: "destructive" | "warning" | "info" | "purple" | "success"
  priority: number
}

const BADGE_CONFIG: Record<AlertType, BadgeConfig> = {
  attention: {
    label: "Attention",
    icon: AlertTriangle,
    variant: "destructive",
    priority: 1,
  },
  watch: {
    label: "À surveiller",
    icon: AlertCircle,
    variant: "warning",
    priority: 2,
  },
  drift: {
    label: "Comportement inhabituel",
    icon: TrendingDown,
    variant: "warning",
    priority: 3,
  },
  "model-changed": {
    label: "Méthode mise à jour",
    icon: RefreshCw,
    variant: "purple",
    priority: 4,
  },
  new: {
    label: "Nouveau produit",
    icon: Sparkles,
    variant: "info",
    priority: 5,
  },
  gated: {
    label: "Automatisée",
    icon: Zap,
    variant: "success",
    priority: 6,
  },
}

interface AlertBadgeProps extends VariantProps<typeof alertBadgeVariants> {
  type: AlertType
  showIcon?: boolean
  className?: string
}

export function AlertBadge({ type, size, showIcon = true, className }: AlertBadgeProps) {
  const config = BADGE_CONFIG[type]
  const Icon = config.icon

  return (
    <span className={cn(alertBadgeVariants({ variant: config.variant, size }), className)}>
      {showIcon && <Icon className={cn("h-3 w-3", size === "sm" && "h-2.5 w-2.5")} />}
      {config.label}
    </span>
  )
}

export { BADGE_CONFIG }

import { Badge } from "@/components/ui/badge";
import { STATUS_VARIANTS } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = STATUS_VARIANTS[status] || { variant: "outline" as const };
  
  return (
    <Badge
      variant={config.variant}
      className={cn(
        "text-xs font-semibold uppercase tracking-wide",
        config.className,
        className
      )}
      data-testid={`badge-status-${status}`}
    >
      {status.replace(/_/g, ' ')}
    </Badge>
  );
}

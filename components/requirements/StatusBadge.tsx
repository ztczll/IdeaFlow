import { Badge } from "@/components/ui/badge";
import { RequirementStatus, STATUS_COLORS } from "@/types";

interface StatusBadgeProps {
  status: RequirementStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const color = STATUS_COLORS[status];

  return (
    <Badge
      className="status-badge text-xs font-semibold px-2 py-0.5"
      style={{
        backgroundColor: `${color}20`,
        color: color,
        borderColor: color,
      }}
    >
      {status}
    </Badge>
  );
}


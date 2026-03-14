import { Badge } from '@/components/ui/badge';
import { cn, STATUS_COLORS, PLATFORM_COLORS } from '@/lib/utils';

/**
 * StatusBadge — renders a coloured pill Badge for order/transaction statuses.
 * Replaces the local getStatusColor() / getTypeBadgeColor() / getStatusBadge()
 * functions that were duplicated across admin/Orders, admin/Transactions,
 * customer/Transactions, and admin/Dashboard.
 *
 * Usage:
 *   <StatusBadge status="SUCCESS" />
 *   <StatusBadge status="IN_PROGRESS" />
 *   <StatusBadge status="Amazon" variant="platform" />  ← uses PLATFORM_COLORS
 */
interface StatusBadgeProps {
    status: string;
    variant?: 'status' | 'platform';
    className?: string;
}

export function StatusBadge({ status, variant = 'status', className }: StatusBadgeProps) {
    const colorMap = variant === 'platform' ? PLATFORM_COLORS : STATUS_COLORS;
    const colorClass = colorMap[status] ?? 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';

    return (
        <Badge
            className={cn(
                'font-medium border-0 text-xs px-2 py-0.5',
                colorClass,
                className,
            )}
        >
            {status.replace(/_/g, ' ')}
        </Badge>
    );
}

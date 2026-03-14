import type { LucideIcon } from 'lucide-react';
import { PackageOpen } from 'lucide-react';

/**
 * EmptyState — shown when a list/table has no data to display.
 * Previously every page had its own inline "no data" block with inconsistent styling.
 *
 * Usage:
 *   <EmptyState message="No orders found" />
 *   <EmptyState icon={Users} message="No users match your search" />
 */
interface EmptyStateProps {
    message?: string;
    description?: string;
    icon?: LucideIcon;
}

export function EmptyState({
    message = 'No data found',
    description,
    icon: Icon = PackageOpen,
}: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
            <Icon className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-4" strokeWidth={1.5} />
            <p className="text-base font-medium text-gray-500 dark:text-gray-400">{message}</p>
            {description && (
                <p className="mt-1 text-sm text-gray-400 dark:text-gray-500">{description}</p>
            )}
        </div>
    );
}

import type { ReactNode } from 'react';

/**
 * PageHeader — the title + subtitle + optional action button row
 * that appears at the top of every data page (Orders, Bills, Users, etc.).
 *
 * The pattern was duplicated across all 9 admin/customer pages:
 *   <div className="flex items-center justify-between">
 *     <div><h1>Title</h1><p>Subtitle</p></div>
 *     <Button>Add X</Button>
 *   </div>
 *
 * Usage:
 *   <PageHeader
 *     title="Orders"
 *     subtitle="Manage all customer orders"
 *     action={<Button onClick={openModal}>+ New Order</Button>}
 *   />
 */
interface PageHeaderProps {
    title: string;
    subtitle?: string;
    action?: ReactNode;
}

export function PageHeader({ title, subtitle, action }: PageHeaderProps) {
    return (
        <div className="flex items-center justify-between mb-6">
            <div>
                <h1 className="text-3xl font-bold font-display text-primary">{title}</h1>
                {subtitle && (
                    <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm">{subtitle}</p>
                )}
            </div>
            {action && <div>{action}</div>}
        </div>
    );
}

import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { EmptyState } from '@/components/shared/EmptyState';

/**
 * DataTable — a generic, typed table built on top of shadcn's Table primitives.
 *
 * Uses the column-definition pattern so callers never write <table> markup.
 * Includes built-in loading and empty states.
 *
 * Usage:
 *   const columns: Column<Order>[] = [
 *     { header: 'Order ID', accessor: (row) => row.orderId },
 *     { header: 'Status',   accessor: (row) => <StatusBadge status={row.status} /> },
 *   ];
 *   <DataTable columns={columns} data={orders} isLoading={isLoading} rowKey="id" />
 */
export interface Column<T> {
    header: string;
    accessor: keyof T | ((row: T) => ReactNode);
    className?: string;
}

interface DataTableProps<T> {
    columns: Column<T>[];
    data: T[];
    isLoading?: boolean;
    rowKey?: keyof T;
    emptyMessage?: string;
    emptyIcon?: LucideIcon;
    className?: string;
}

export function DataTable<T>({
    columns,
    data,
    isLoading = false,
    rowKey,
    emptyMessage = 'No data found',
    emptyIcon,
    className = '',
}: DataTableProps<T>) {
    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (!data.length) {
        return <EmptyState message={emptyMessage} icon={emptyIcon} />;
    }

    return (
        <div className={`rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden ${className}`}>
            <Table>
                <TableHeader className="bg-gray-50 dark:bg-dark-bg-tertiary">
                    <TableRow className="hover:bg-transparent border-b border-gray-200 dark:border-gray-700">
                        {columns.map((col, i) => (
                            <TableHead
                                key={i}
                                className={`text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-4 py-3 ${col.className ?? ''}`}
                            >
                                {col.header}
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((row, rowIdx) => (
                        <TableRow
                            key={rowKey ? String(row[rowKey]) : rowIdx}
                            className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-dark-bg-tertiary transition-colors"
                        >
                            {columns.map((col, colIdx) => (
                                <TableCell
                                    key={colIdx}
                                    className={`text-sm text-gray-700 dark:text-gray-300 px-4 py-3 ${col.className ?? ''}`}
                                >
                                    {typeof col.accessor === 'function'
                                        ? col.accessor(row)
                                        : (row[col.accessor] as ReactNode)}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}

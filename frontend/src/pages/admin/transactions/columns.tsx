import { ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import type { Column } from '@/components/shared/DataTable';
import type { Transaction } from '@/types';

export const transactionColumns: Column<Transaction>[] = [
    {
        header: 'Transaction ID',
        accessor: (t) => (
            <code className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                {t.transactionId}
            </code>
        ),
    },
    { header: 'User ID', accessor: 'userId' },
    {
        header: 'Type',
        accessor: (t) => (
            <StatusBadge
                status={t.type}
                className="flex items-center gap-1"
            />
        ),
    },
    {
        header: 'Amount',
        accessor: (t) => (
            <span className={t.type === 'CREDIT' ? 'text-green-600 font-medium' : 'text-blue-600 font-medium'}>
                {t.type === 'CREDIT'
                    ? <ArrowDownCircle className="inline w-3 h-3 mr-1" />
                    : <ArrowUpCircle className="inline w-3 h-3 mr-1" />}
                {formatCurrency(t.amount)}
            </span>
        ),
    },
    { header: 'Status', accessor: (t) => <StatusBadge status={t.status} /> },
    { header: 'Method', accessor: (t) => t.paymentMethod?.replace('_', ' ') ?? '-' },
    {
        header: 'Description',
        accessor: (t) => (
            <span className="max-w-[180px] truncate block text-gray-600" title={t.description ?? ''}>
                {t.description || '-'}
            </span>
        ),
    },
    { header: 'Date', accessor: (t) => formatDateTime(t.createdAt) },
];

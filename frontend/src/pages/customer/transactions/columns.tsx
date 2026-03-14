import { StatusBadge } from '@/components/shared/StatusBadge';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import type { Column } from '@/components/shared/DataTable';
import type { Transaction } from '@/types';

export const customerTransactionColumns: Column<Transaction>[] = [
    { header: 'Transaction ID', accessor: (t) => <span className="font-mono text-xs">{t.transactionId}</span> },
    { header: 'Date', accessor: (t) => formatDateTime(t.createdAt) },
    {
        header: 'Type',
        accessor: (t) => (
            <span
                className={`px-2 py-1 rounded-full text-xs font-semibold ${t.type === 'CREDIT'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                    }`}
            >
                {t.type}
            </span>
        )
    },
    {
        header: 'Amount',
        accessor: (t) => (
            <span className={`font-semibold ${t.type === 'CREDIT' ? 'text-green-600' : 'text-red-600'}`}>
                {t.type === 'CREDIT' ? '+' : '-'}{formatCurrency(t.amount)}
            </span>
        )
    },
    { header: 'Method', accessor: 'paymentMethod' },
    { header: 'Status', accessor: (t) => <StatusBadge status={t.status} /> },
    { header: 'Description', accessor: (t) => t.description || '-' },
];

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Search, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { DataTable } from '@/components/shared/DataTable';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import type { Column } from '@/components/shared/DataTable';
import type { Transaction } from '@/types';
import { useTransactions, type TypeFilter, type StatusFilter } from './useTransactions';

export default function TransactionsPage() {
    const {
        searchTerm, setSearchTerm,
        filterType, setFilterType,
        filterStatus, setFilterStatus,
        filteredTransactions, isLoading
    } = useTransactions();

    const columns: Column<Transaction>[] = [
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

    return (
        <div className="space-y-6">
            <PageHeader title="Transactions" subtitle="View and manage all customer transactions" />

            <Card>
                <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="relative md:col-span-2">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input
                                placeholder="Search by transaction ID or user ID..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Select value={filterType} onValueChange={(v) => setFilterType(v as TypeFilter)}>
                            <SelectTrigger><SelectValue placeholder="All Types" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">All Types</SelectItem>
                                <SelectItem value="CREDIT">Credit Only</SelectItem>
                                <SelectItem value="DEBIT">Debit Only</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v as StatusFilter)}>
                            <SelectTrigger><SelectValue placeholder="All Status" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">All Status</SelectItem>
                                <SelectItem value="SUCCESS">Success</SelectItem>
                                <SelectItem value="PENDING">Pending</SelectItem>
                                <SelectItem value="FAILED">Failed</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>All Transactions ({filteredTransactions.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    <DataTable
                        columns={columns}
                        data={filteredTransactions}
                        isLoading={isLoading}
                        rowKey="id"
                        emptyMessage="No transactions found"
                    />
                </CardContent>
            </Card>
        </div>
    );
}

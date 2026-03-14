import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, Receipt } from 'lucide-react';
import { DataTable } from '@/components/shared/DataTable';
import { PageHeader } from '@/components/shared/PageHeader';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';
import { useTransactions } from './useTransactions';
import { customerTransactionColumns } from './columns';

export default function TransactionsPage() {
    const { searchTerm, setSearchTerm, filteredTransactions, isLoading } = useTransactions();

    return (
        <ErrorBoundary>
            <div className="space-y-6">
                <PageHeader
                    title="Transactions"
                    subtitle="View your transaction history"
                />

                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                        placeholder="Search by transaction ID or description..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-white dark:bg-dark-bg-secondary"
                    />
                </div>

                <Card className="border-0 shadow overflow-hidden">
                    <CardContent className="p-0">
                        <DataTable
                            columns={customerTransactionColumns}
                            data={filteredTransactions}
                            isLoading={isLoading}
                            rowKey="id"
                            emptyMessage={searchTerm ? 'No transactions match your search' : 'No transactions found'}
                            emptyIcon={Receipt}
                        />
                    </CardContent>
                </Card>
            </div>
        </ErrorBoundary>
    );
}

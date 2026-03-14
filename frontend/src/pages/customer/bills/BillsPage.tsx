import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, FileText } from 'lucide-react';
import { DataTable } from '@/components/shared/DataTable';
import { PageHeader } from '@/components/shared/PageHeader';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';
import { useBills } from './useBills';
import { getCustomerBillColumns } from './columns';

export default function BillsPage() {
    const { searchTerm, setSearchTerm, filteredBills, isLoading, handleDownloadInvoice } = useBills();

    const columns = getCustomerBillColumns({
        onDownload: handleDownloadInvoice,
    });

    return (
        <ErrorBoundary>
            <div className="space-y-6">
                <PageHeader
                    title="My Bills"
                    subtitle="View and download your invoices"
                />

                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                        placeholder="Search by Invoice No, Transaction ID, Product..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-white dark:bg-dark-bg-secondary"
                    />
                </div>

                <Card className="border-0 shadow overflow-hidden">
                    <CardContent className="p-0">
                        <DataTable
                            columns={columns}
                            data={filteredBills}
                            isLoading={isLoading}
                            rowKey="id"
                            emptyMessage={searchTerm ? 'No bills match your search' : 'No bills found'}
                            emptyIcon={FileText}
                        />
                    </CardContent>
                </Card>
            </div>
        </ErrorBoundary>
    );
}

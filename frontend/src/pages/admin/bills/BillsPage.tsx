import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Download, FileText, Calendar } from 'lucide-react';
import BillModal from '@/components/BillModal';
import { DataTable } from '@/components/shared/DataTable';
import { PageHeader } from '@/components/shared/PageHeader';
import { formatAmount, formatDate } from '@/lib/utils';
import type { Column } from '@/components/shared/DataTable';
import type { Bill } from '@/types';
import { useBills } from './useBills';

export default function BillsPage() {
    const {
        searchTerm, setSearchTerm,
        isModalOpen, setIsModalOpen,
        selectedBill, setSelectedBill,
        bills, filteredBills, isLoading,
        todayBillsCount, monthBillsCount,
        handleDownloadInvoice, handleModalClose
    } = useBills();

    const columns: Column<Bill>[] = [
        { header: 'Invoice No', accessor: (b) => <span className="font-semibold text-primary text-sm">{b.invoiceNumber || '-'}</span> },
        { header: 'Transaction ID', accessor: (b) => <code className="text-xs bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">{b.transactionId}</code> },
        {
            header: 'Company',
            accessor: (b) => (
                <div>
                    <p className="font-medium text-gray-900">{b.company}</p>
                    <p className="text-gray-500 text-xs">{b.email}</p>
                </div>
            ),
        },
        {
            header: 'Product',
            accessor: (b) => (
                <div>
                    <p className="text-gray-900">{b.productName}</p>
                    <p className="text-gray-500 text-xs">SKU: {b.skuId}</p>
                </div>
            ),
        },
        {
            header: 'Amount',
            accessor: (b) => (
                <div className="flex items-center gap-2">
                    <span className="font-semibold">{formatAmount(b.payableAmount, b.currency)}</span>
                    <Badge variant="outline" className="text-xs">{b.currency}</Badge>
                </div>
            ),
        },
        { header: 'Date', accessor: (b) => formatDate(b.transactionDate) },
        {
            header: 'Invoice',
            accessor: (b) => b.invoiceUrl
                ? <Badge className="bg-green-100 text-green-800">Generated</Badge>
                : <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>,
        },
        {
            header: 'Actions',
            className: 'text-right',
            accessor: (b) => (
                <div className="flex justify-end">
                    {b.invoiceUrl && (
                        <Button variant="ghost" size="sm" onClick={() => handleDownloadInvoice(b)}
                            className="text-green-600 hover:text-green-700 hover:bg-green-50">
                            <Download className="w-4 h-4" />
                        </Button>
                    )}
                </div>
            ),
        },
    ];

    return (
        <div className="space-y-6">
            <PageHeader
                title="Bills & Invoices"
                subtitle="Generate and manage invoices"
                action={
                    <Button onClick={() => { setSelectedBill(null); setIsModalOpen(true); }}
                        className="gap-2 bg-primary hover:bg-primary/90 text-white">
                        <Plus className="w-4 h-4" /> Create Bill
                    </Button>
                }
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Bills</CardTitle>
                        <FileText className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{bills.length}</div>
                        <p className="text-xs text-gray-600 mt-1">All time invoices</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Today</CardTitle>
                        <Calendar className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{todayBillsCount}</div>
                        <p className="text-xs text-gray-600 mt-1">Bills today</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">This Month</CardTitle>
                        <Calendar className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{monthBillsCount}</div>
                        <p className="text-xs text-gray-600 mt-1">Bills this month</p>
                    </CardContent>
                </Card>
            </div>

            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                    placeholder="Search by transaction ID, company, or product..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white dark:bg-dark-bg-tertiary"
                />
            </div>

            <Card>
                <CardHeader><CardTitle>All Bills ({filteredBills.length})</CardTitle></CardHeader>
                <CardContent>
                    <DataTable
                        columns={columns}
                        data={filteredBills}
                        isLoading={isLoading}
                        rowKey="id"
                        emptyMessage={searchTerm ? 'No bills match your search' : 'No bills yet'}
                        emptyIcon={FileText}
                    />
                </CardContent>
            </Card>

            <BillModal isOpen={isModalOpen} onClose={handleModalClose} bill={selectedBill} />
        </div>
    );
}

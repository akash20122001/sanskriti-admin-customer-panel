import { useEffect, useState } from 'react';
import { billService } from '@/services/bill.service';
import { toast } from 'sonner';
import type { Bill } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Download, Trash2, FileText, Calendar } from 'lucide-react';
import BillModal from '@/components/BillModal';

export default function BillsPage() {
    const [bills, setBills] = useState<Bill[]>([]);
    const [filteredBills, setFilteredBills] = useState<Bill[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
    const [deletingBillId, setDeletingBillId] = useState<string | null>(null);
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

    // Fetch bills
    const fetchBills = async () => {
        try {
            setLoading(true);
            const data = await billService.getAllBills();
            setBills(data);
            setFilteredBills(data);
        } catch (error) {
            toast.error('Failed to fetch bills', {
                description: (error as Error).message,
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBills();
    }, []);

    // Search filter
    useEffect(() => {
        const filtered = bills.filter(
            (bill) =>
                bill.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                bill.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                bill.productName.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredBills(filtered);
    }, [searchTerm, bills]);

    // Handlers
    const handleAddBill = () => {
        setSelectedBill(null);
        setIsModalOpen(true);
    };



    const handleDownloadInvoice = async (bill: Bill) => {
        try {
            const invoiceUrl = await billService.downloadInvoice(bill.id);
            window.open(invoiceUrl, '_blank');
        } catch (error) {
            toast.error('Failed to download invoice', {
                description: (error as Error).message,
            });
        }
    };

    const handleModalClose = (refreshData?: boolean) => {
        setIsModalOpen(false);
        setSelectedBill(null);
        if (refreshData) {
            fetchBills();
        }
    };

    const handleDeleteBill = async (id: string) => {
        if (confirmDeleteId !== id) {
            setConfirmDeleteId(id);
            return;
        }
        try {
            setDeletingBillId(id);
            await billService.deleteBill(id);
            toast.success('Bill deleted successfully');
            setBills((prev) => prev.filter((b) => b.id !== id));
            setConfirmDeleteId(null);
        } catch (error) {
            toast.error('Failed to delete bill', {
                description: (error as Error).message,
            });
        } finally {
            setDeletingBillId(null);
        }
    };

    // Currency symbol
    const getCurrencySymbol = (currency: string) => {
        return currency === 'USD' ? '$' : '₹';
    };

    // Calculate stats
    const todayBills = bills.filter((b) => {
        const today = new Date();
        const billDate = new Date(b.transactionDate);
        return billDate.toDateString() === today.toDateString();
    }).length;

    const thisMonthBills = bills.filter((b) => {
        const today = new Date();
        const billDate = new Date(b.transactionDate);
        return billDate.getMonth() === today.getMonth() &&
            billDate.getFullYear() === today.getFullYear();
    }).length;

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold font-display text-primary">Bills & Invoices</h1>
                    <p className="text-gray-600 mt-1">Generate and manage invoices</p>
                </div>
                <Button onClick={handleAddBill} className="gap-2 bg-primary hover:bg-primary/90 text-white">
                    <Plus className="w-4 h-4" />
                    Create Bill
                </Button>
            </div>

            {/* Stats Cards */}
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
                        <CardTitle className="text-sm font-medium">Recent Bills</CardTitle>
                        <Calendar className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{todayBills}</div>
                        <p className="text-xs text-gray-600 mt-1">Bills today</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">This Month</CardTitle>
                        <Calendar className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{thisMonthBills}</div>
                        <p className="text-xs text-gray-600 mt-1">Bills this month</p>
                    </CardContent>
                </Card>
            </div>

            {/* Search Bar */}
            <Card>
                <CardHeader>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                            placeholder="Search by transaction ID, company, or product..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 bg-white dark:bg-dark-bg-tertiary"
                        />
                    </div>
                </CardHeader>
            </Card>

            {/* Bills Table */}
            <Card>
                <CardHeader>
                    <CardTitle>All Bills</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="text-center py-8">
                            <p className="text-gray-600">Loading bills...</p>
                        </div>
                    ) : filteredBills.length === 0 ? (
                        <div className="text-center py-12">
                            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600 font-medium">No bills yet</p>
                            <p className="text-gray-500 text-sm mt-1">
                                {searchTerm
                                    ? 'No bills match your search criteria'
                                    : 'Create your first bill to get started'}
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                                            Invoice No
                                        </th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                                            Transaction ID
                                        </th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                                            Company
                                        </th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                                            Product
                                        </th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                                            Amount
                                        </th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                                            Date
                                        </th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                                            Invoice
                                        </th>
                                        <th className="text-right py-3 px-4 text-sm font-medium text-gray-700">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredBills.map((bill) => (
                                        <tr
                                            key={bill.id}
                                            className="border-b border-gray-100 hover:bg-gray-50"
                                        >
                                            <td className="py-3 px-4">
                                                <span className="font-semibold text-primary text-sm">
                                                    {bill.invoiceNumber || '-'}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className="font-medium text-gray-900 font-mono text-sm">
                                                    {bill.transactionId}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div>
                                                    <p className="text-gray-900 font-medium">{bill.company}</p>
                                                    <p className="text-gray-500 text-sm">{bill.email}</p>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div>
                                                    <p className="text-gray-900">{bill.productName}</p>
                                                    <p className="text-gray-500 text-sm">SKU: {bill.skuId}</p>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-semibold text-gray-900">
                                                        {getCurrencySymbol(bill.currency)}
                                                        {bill.payableAmount.toFixed(2)}
                                                    </span>
                                                    <Badge variant="outline" className="text-xs">
                                                        {bill.currency}
                                                    </Badge>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className="text-sm text-gray-600">
                                                    {new Date(bill.transactionDate).toLocaleDateString()}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4">
                                                {bill.invoiceUrl ? (
                                                    <Badge className="bg-green-100 text-green-800">
                                                        Generated
                                                    </Badge>
                                                ) : (
                                                    <Badge className="bg-yellow-100 text-yellow-800">
                                                        Pending
                                                    </Badge>
                                                )}
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="flex items-center justify-end gap-2">

                                                    {bill.invoiceUrl && (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleDownloadInvoice(bill)}
                                                            className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                                        >
                                                            <Download className="w-4 h-4" />
                                                        </Button>
                                                    )}
                                                    {confirmDeleteId === bill.id ? (
                                                        <>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => handleDeleteBill(bill.id)}
                                                                disabled={deletingBillId === bill.id}
                                                                className="text-red-600 hover:text-red-700 hover:bg-red-50 text-xs px-2"
                                                            >
                                                                {deletingBillId === bill.id ? 'Deleting...' : 'Confirm'}
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => setConfirmDeleteId(null)}
                                                                className="text-gray-500 hover:text-gray-700 text-xs px-2"
                                                            >
                                                                Cancel
                                                            </Button>
                                                        </>
                                                    ) : (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleDeleteBill(bill.id)}
                                                            className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Bill Modal */}
            <BillModal isOpen={isModalOpen} onClose={handleModalClose} bill={selectedBill} />
        </div>
    );
}

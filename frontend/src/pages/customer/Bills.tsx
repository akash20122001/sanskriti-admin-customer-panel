import { useEffect, useState } from 'react';
import { FileText, Search, Download } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { billService } from '@/services/bill.service';

interface Bill {
    id: string;
    transactionId: string;
    invoiceNumber?: string;
    company: string;
    email: string;
    productName: string;
    skuId: string;
    quantity: number;
    price: number;
    currency: string;
    payableAmount: number;
    invoiceUrl: string | null;
    transactionDate: string;
}

export default function CustomerBills() {
    const [bills, setBills] = useState<Bill[]>([]);
    const [filteredBills, setFilteredBills] = useState<Bill[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchBills();
    }, []);

    useEffect(() => {
        filterBills();
    }, [searchTerm, bills]);

    const fetchBills = async () => {
        try {
            setLoading(true);
            const response = await billService.getCustomerBills();
            setBills(response.bills || []);
        } catch (error) {
            console.error('Failed to fetch bills:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterBills = () => {
        if (!searchTerm) {
            setFilteredBills(bills);
            return;
        }

        const filtered = bills.filter(
            (bill) =>
                bill.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (bill.invoiceNumber && bill.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
                bill.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                bill.skuId.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredBills(filtered);
    };

    const handleDownloadInvoice = (bill: Bill) => {
        if (bill.invoiceUrl) {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const baseUrl = apiUrl.replace('/api', '');
            window.open(`${baseUrl}${bill.invoiceUrl}`, '_blank');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">Loading bills...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Bills</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">View and download your invoices</p>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                    type="text"
                    placeholder="Search by Invoice No, Transaction ID, Product..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white dark:bg-dark-bg-secondary"
                />
            </div>

            {/* Bills Table */}
            <div className="bg-white dark:bg-dark-bg-secondary rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-dark-bg-tertiary">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Invoice No
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Transaction ID
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Date
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Product
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Quantity
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Amount
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Invoice
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-dark-bg-secondary divide-y divide-gray-200 dark:divide-gray-700">
                            {filteredBills.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                                        <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                        <p>No bills found</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredBills.map((bill) => (
                                    <tr
                                        key={bill.id}
                                        className="hover:bg-gray-50 dark:hover:bg-dark-bg-tertiary transition-colors"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-sm font-semibold text-primary">
                                                {bill.invoiceNumber || '-'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-sm font-mono text-gray-900 dark:text-white">
                                                {bill.transactionId}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                                            {new Date(bill.transactionDate).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                    {bill.productName}
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    SKU: {bill.skuId}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                                            {bill.quantity}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                                {bill.currency === 'INR' ? '₹' : '$'}
                                                {bill.payableAmount.toFixed(2)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {bill.invoiceUrl ? (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleDownloadInvoice(bill)}
                                                    className="flex items-center gap-2"
                                                >
                                                    <Download className="w-4 h-4" />
                                                    Download
                                                </Button>
                                            ) : (
                                                <span className="text-xs text-gray-400">N/A</span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

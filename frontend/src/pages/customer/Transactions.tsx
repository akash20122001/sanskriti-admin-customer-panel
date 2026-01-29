import { useEffect, useState } from 'react';
import { Receipt, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { transactionService } from '@/services/transaction.service';

interface Transaction {
    id: string;
    transactionId: string;
    amount: number;
    type: 'CREDIT' | 'DEBIT';
    status: 'PENDING' | 'SUCCESS' | 'FAILED';
    paymentMethod: string;
    description: string | null;
    createdAt: string;
}

export default function Transactions() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchTransactions();
    }, []);

    useEffect(() => {
        filterTransactions();
    }, [searchTerm, transactions]);

    const fetchTransactions = async () => {
        try {
            setLoading(true);
            const response = await transactionService.getTransactions();
            setTransactions(response.transactions || []);
        } catch (error) {
            console.error('Failed to fetch transactions:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterTransactions = () => {
        if (!searchTerm) {
            setFilteredTransactions(transactions);
            return;
        }

        const filtered = transactions.filter(
            (txn) =>
                txn.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                txn.description?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredTransactions(filtered);
    };

    const getStatusBadge = (status: string) => {
        const styles = {
            SUCCESS: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
            FAILED: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
            PENDING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
        };
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${styles[status as keyof typeof styles]}`}>
                {status}
            </span>
        );
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">Loading transactions...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Transactions</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">View your transaction history</p>
            </div>

            {/* Search */}
            <div className="flex items-center gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                        type="text"
                        placeholder="Search by transaction ID or description..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-white dark:bg-dark-bg-secondary"
                    />
                </div>
            </div>

            {/* Transactions Table */}
            <div className="bg-white dark:bg-dark-bg-secondary rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-dark-bg-tertiary">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Transaction ID
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Date
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Type
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Amount
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Method
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Description
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-dark-bg-secondary divide-y divide-gray-200 dark:divide-gray-700">
                            {filteredTransactions.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                                        <Receipt className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                        <p>No transactions found</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredTransactions.map((txn) => (
                                    <tr
                                        key={txn.id}
                                        className="hover:bg-gray-50 dark:hover:bg-dark-bg-tertiary transition-colors"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-sm font-mono text-gray-900 dark:text-white">
                                                {txn.transactionId}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                                            {new Date(txn.createdAt).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs font-semibold ${txn.type === 'CREDIT'
                                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                                                    : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                                                    }`}
                                            >
                                                {txn.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span
                                                className={`text-sm font-semibold ${txn.type === 'CREDIT' ? 'text-green-600' : 'text-red-600'
                                                    }`}
                                            >
                                                {txn.type === 'CREDIT' ? '+' : '-'}₹{txn.amount.toFixed(2)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                                            {txn.paymentMethod}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(txn.status)}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                                            {txn.description || '-'}
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

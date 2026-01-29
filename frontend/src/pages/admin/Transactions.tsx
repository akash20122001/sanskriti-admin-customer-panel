import { useState, useEffect } from 'react';
import { transactionService } from '@/services/transaction.service';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';

interface Transaction {
    id: string;
    transactionId: string;
    userId: string;
    amount: number;
    type: 'CREDIT' | 'DEBIT';
    status: 'PENDING' | 'SUCCESS' | 'FAILED';
    paymentMethod: string;
    description: string | null;
    createdAt: string;
    user: {
        userId: string;
        name: string;
        role: string;
    };
}

export default function AdminTransactions() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState<'ALL' | 'CREDIT' | 'DEBIT'>('ALL');
    const [filterStatus, setFilterStatus] = useState<'ALL' | 'PENDING' | 'SUCCESS' | 'FAILED'>('ALL');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTransactions();
    }, []);

    useEffect(() => {
        filterTransactionsList();
    }, [transactions, searchTerm, filterType, filterStatus]);

    const fetchTransactions = async () => {
        try {
            setLoading(true);
            const response = await transactionService.getAllTransactions();
            setTransactions(response.transactions || []);
        } catch (error) {
            toast.error('Failed to fetch transactions');
            console.error('Error fetching transactions:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterTransactionsList = () => {
        let filtered = transactions;

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(
                (t) =>
                    t.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    t.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    t.user.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filter by type
        if (filterType !== 'ALL') {
            filtered = filtered.filter((t) => t.type === filterType);
        }

        // Filter by status
        if (filterStatus !== 'ALL') {
            filtered = filtered.filter((t) => t.status === filterStatus);
        }

        setFilteredTransactions(filtered);
    };

    const getStatusBadgeVariant = (status: string) => {
        switch (status) {
            case 'SUCCESS':
                return 'default';
            case 'PENDING':
                return 'secondary';
            case 'FAILED':
                return 'destructive';
            default:
                return 'outline';
        }
    };

    const getTypeBadgeColor = (type: string) => {
        return type === 'CREDIT'
            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    };

    const formatCurrency = (amount: number) => {
        return `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
                <p className="text-muted-foreground">View and manage all customer transactions</p>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* Search */}
                        <div className="relative md:col-span-2">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input
                                placeholder="Search by transaction ID, user ID, or name..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>

                        {/* Type Filter */}
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value as any)}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                            <option value="ALL">All Types</option>
                            <option value="CREDIT">Credit Only</option>
                            <option value="DEBIT">Debit Only</option>
                        </select>

                        {/* Status Filter */}
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value as any)}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                            <option value="ALL">All Status</option>
                            <option value="SUCCESS">Success</option>
                            <option value="PENDING">Pending</option>
                            <option value="FAILED">Failed</option>
                        </select>
                    </div>
                </CardContent>
            </Card>

            {/* Transactions Table */}
            <Card>
                <CardHeader>
                    <CardTitle>All Transactions ({filteredTransactions.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="text-center py-8 text-gray-500">Loading transactions...</div>
                    ) : filteredTransactions.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">No transactions found</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="border-b">
                                    <tr className="text-left text-sm text-gray-500">
                                        <th className="pb-3 font-medium">Transaction ID</th>
                                        <th className="pb-3 font-medium">User</th>
                                        <th className="pb-3 font-medium">Type</th>
                                        <th className="pb-3 font-medium">Amount</th>
                                        <th className="pb-3 font-medium">Status</th>
                                        <th className="pb-3 font-medium">Method</th>
                                        <th className="pb-3 font-medium">Description</th>
                                        <th className="pb-3 font-medium">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {filteredTransactions.map((transaction) => (
                                        <tr key={transaction.id} className="text-sm">
                                            <td className="py-4">
                                                <code className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                                                    {transaction.transactionId}
                                                </code>
                                            </td>
                                            <td className="py-4">
                                                <div>
                                                    <div className="font-medium">{transaction.user.name}</div>
                                                    <div className="text-xs text-gray-500">{transaction.userId}</div>
                                                </div>
                                            </td>
                                            <td className="py-4">
                                                <Badge className={getTypeBadgeColor(transaction.type)}>
                                                    {transaction.type === 'CREDIT' ? (
                                                        <ArrowDownCircle className="h-3 w-3 mr-1" />
                                                    ) : (
                                                        <ArrowUpCircle className="h-3 w-3 mr-1" />
                                                    )}
                                                    {transaction.type}
                                                </Badge>
                                            </td>
                                            <td className="py-4">
                                                <span className={transaction.type === 'CREDIT' ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                                                    {transaction.type === 'CREDIT' ? '+' : '-'}
                                                    {formatCurrency(transaction.amount)}
                                                </span>
                                            </td>
                                            <td className="py-4">
                                                <Badge variant={getStatusBadgeVariant(transaction.status)}>
                                                    {transaction.status}
                                                </Badge>
                                            </td>
                                            <td className="py-4 text-gray-600">
                                                {transaction.paymentMethod.replace('_', ' ')}
                                            </td>
                                            <td className="py-4 max-w-xs truncate text-gray-600">
                                                {transaction.description || '-'}
                                            </td>
                                            <td className="py-4 text-gray-600">
                                                {new Date(transaction.createdAt).toLocaleString('en-IN', {
                                                    day: '2-digit',
                                                    month: 'short',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

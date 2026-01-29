import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet, TrendingUp, ShoppingBag, FileText, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { userService } from '@/services/user.service';
import { transactionService } from '@/services/transaction.service';
import { orderService } from '@/services/order.service';

interface DashboardStats {
    walletBalance: number;
    totalTransactions: number;
    totalOrders: number;
    totalBills: number;
}

export default function CustomerDashboard() {
    const navigate = useNavigate();
    const [stats, setStats] = useState<DashboardStats>({
        walletBalance: 0,
        totalTransactions: 0,
        totalOrders: 0,
        totalBills: 0,
    });
    const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
    const [recentOrders, setRecentOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);

            // Fetch user profile for wallet balance
            const userId = localStorage.getItem('userId') || '';
            const userResponse = await userService.getUserById(userId);

            // Fetch transactions
            const transactionsResponse = await transactionService.getTransactions();

            // Fetch orders
            const ordersResponse = await orderService.getCustomerOrders();

            setStats({
                walletBalance: userResponse.user?.walletBalance || 0,
                totalTransactions: transactionsResponse.transactions?.length || 0,
                totalOrders: ordersResponse.orders?.length || 0,
                totalBills: 0, // We'll update this when bills API is ready
            });

            setRecentTransactions(transactionsResponse.transactions?.slice(0, 5) || []);
            setRecentOrders(ordersResponse.orders?.slice(0, 5) || []);
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const statCards = [
        {
            title: 'Wallet Balance',
            value: `₹${stats.walletBalance.toFixed(2)}`,
            icon: Wallet,
            color: 'bg-green-500',
            action: () => navigate('/customer/add-balance'),
        },
        {
            title: 'Total Transactions',
            value: stats.totalTransactions,
            icon: TrendingUp,
            color: 'bg-blue-500',
            action: () => navigate('/customer/transactions'),
        },
        {
            title: 'Total Orders',
            value: stats.totalOrders,
            icon: ShoppingBag,
            color: 'bg-purple-500',
            action: () => navigate('/customer/orders'),
        },
        {
            title: 'Total Bills',
            value: stats.totalBills,
            icon: FileText,
            color: 'bg-orange-500',
            action: () => navigate('/customer/bills'),
        },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">Welcome back! Here's your overview.</p>
                </div>
                <Button onClick={() => navigate('/customer/add-balance')} className="flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    Add Balance
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((card, index) => {
                    const Icon = card.icon;
                    return (
                        <div
                            key={index}
                            onClick={card.action}
                            className="bg-white dark:bg-dark-bg-secondary rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition-shadow"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{card.title}</p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                                        {card.value}
                                    </p>
                                </div>
                                <div className={`${card.color} p-3 rounded-lg`}>
                                    <Icon className="w-6 h-6 text-white" />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Transactions */}
                <div className="bg-white dark:bg-dark-bg-secondary rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                        Recent Transactions
                    </h2>
                    {recentTransactions.length === 0 ? (
                        <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                            No transactions yet
                        </p>
                    ) : (
                        <div className="space-y-3">
                            {recentTransactions.map((txn) => (
                                <div
                                    key={txn.id}
                                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-dark-bg-tertiary rounded-lg"
                                >
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-white">
                                            {txn.description || 'Transaction'}
                                        </p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {new Date(txn.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <span
                                        className={`font-semibold ${txn.type === 'CREDIT' ? 'text-green-600' : 'text-red-600'
                                            }`}
                                    >
                                        {txn.type === 'CREDIT' ? '+' : '-'}₹{txn.amount.toFixed(2)}
                                    </span>
                                </div>
                            ))}
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => navigate('/customer/transactions')}
                            >
                                View All Transactions
                            </Button>
                        </div>
                    )}
                </div>

                {/* Recent Orders */}
                <div className="bg-white dark:bg-dark-bg-secondary rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Recent Orders</h2>
                    {recentOrders.length === 0 ? (
                        <p className="text-gray-500 dark:text-gray-400 text-center py-8">No orders yet</p>
                    ) : (
                        <div className="space-y-3">
                            {recentOrders.map((order) => (
                                <div
                                    key={order.id}
                                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-dark-bg-tertiary rounded-lg"
                                >
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-white">
                                            {order.orderId}
                                        </p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{order.platform}</p>
                                    </div>
                                    <span className="font-semibold text-gray-900 dark:text-white">
                                        {order.currency === 'INR' ? '₹' : '$'}
                                        {order.price.toFixed(2)}
                                    </span>
                                </div>
                            ))}
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => navigate('/customer/orders')}
                            >
                                View All Orders
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

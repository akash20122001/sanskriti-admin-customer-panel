import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet, TrendingUp, ShoppingBag, FileText, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import { transactionService } from '@/services/transaction.service';
import { orderService } from '@/services/order.service';
import { authService } from '@/services/auth.service';
import { billService } from '@/services/bill.service';

interface DashboardStats {
    walletBalance: number;
    totalTransactions: number;
    totalOrders: number;
    totalBills: number;
}

export default function CustomerDashboard() {
    const navigate = useNavigate();
    // const { user } = useAuthStore();
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
        setLoading(true);
        try {
            // Fetch everything in parallel with error handling for each
            const [userResult, transactionsResult, ordersResult, billsResult] = await Promise.allSettled([
                authService.getCurrentUser(),
                transactionService.getTransactions(),
                orderService.getCustomerOrders(),
                billService.getCustomerBills()
            ]);

            const newStats: DashboardStats = {
                walletBalance: 0,
                totalTransactions: 0,
                totalOrders: 0,
                totalBills: 0,
            };

            // Process User Data
            if (userResult.status === 'fulfilled' && userResult.value) {
                newStats.walletBalance = userResult.value.walletBalance || 0;
            } else {
                console.error('Failed to fetch user data', userResult.status === 'rejected' ? userResult.reason : '');
            }

            // Process Transactions
            if (transactionsResult.status === 'fulfilled' && transactionsResult.value) {
                newStats.totalTransactions = transactionsResult.value.transactions?.length || 0;
                setRecentTransactions(transactionsResult.value.transactions?.slice(0, 5) || []);
            } else {
                console.error('Failed to fetch transactions', transactionsResult.status === 'rejected' ? transactionsResult.reason : '');
            }

            // Process Orders
            if (ordersResult.status === 'fulfilled' && ordersResult.value) {
                newStats.totalOrders = ordersResult.value.orders?.length || 0;
                setRecentOrders(ordersResult.value.orders?.slice(0, 5) || []);
            } else {
                console.error('Failed to fetch orders', ordersResult.status === 'rejected' ? ordersResult.reason : '');
            }

            // Process Bills
            if (billsResult.status === 'fulfilled' && billsResult.value) {
                newStats.totalBills = billsResult.value.bills?.length || 0;
            } else {
                console.error('Failed to fetch bills', billsResult.status === 'rejected' ? billsResult.reason : '');
            }

            setStats(newStats);
        } catch (error) {
            console.error('Unexpected error in dashboard fetch:', error);
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
        },
        {
            title: 'Total Transactions',
            value: stats.totalTransactions,
            icon: TrendingUp,
            color: 'bg-blue-500',
        },
        {
            title: 'Total Orders',
            value: stats.totalOrders,
            icon: ShoppingBag,
            color: 'bg-purple-500',
        },
        {
            title: 'Total Bills',
            value: stats.totalBills,
            icon: FileText,
            color: 'bg-orange-500',
        },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold font-display text-primary">Dashboard</h1>
                    <p className="text-gray-600 mt-1">Welcome back! Here's your overview.</p>
                </div>
                <Button onClick={() => navigate('/customer/add-balance')} className="flex items-center gap-2 text-white">
                    <Plus className="w-5 h-5" />
                    Add Balance
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((card) => {
                    const Icon = card.icon;
                    return (
                        <Card key={card.title} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-gray-600">
                                    {card.title}
                                </CardTitle>
                                <div className={`${card.color} p-2 rounded-lg`}>
                                    <Icon className="w-4 h-4 text-white" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold font-display text-primary">{card.value}</div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Transactions */}
                <Card className="border-0 shadow-lg">
                    <CardHeader>
                        <CardTitle className="font-display">Recent Transactions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {recentTransactions.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                <TrendingUp className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                                <p>No transactions yet</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {recentTransactions.map((txn) => (
                                    <div
                                        key={txn.id}
                                        className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
                                    >
                                        <div>
                                            <p className="font-medium text-primary">
                                                {txn.description || 'Transaction'}
                                            </p>
                                            <p className="text-sm text-gray-500">
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
                    </CardContent>
                </Card>

                {/* Recent Orders */}
                <Card className="border-0 shadow-lg">
                    <CardHeader>
                        <CardTitle className="font-display">Recent Orders</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {recentOrders.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                <ShoppingBag className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                                <p>No orders yet</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {recentOrders.map((order) => (
                                    <div
                                        key={order.id}
                                        className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
                                    >
                                        <div>
                                            <p className="font-medium text-primary">{order.orderId}</p>
                                            <p className="text-sm text-gray-500">{order.platform}</p>
                                        </div>
                                        <span className="font-semibold text-primary">
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
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

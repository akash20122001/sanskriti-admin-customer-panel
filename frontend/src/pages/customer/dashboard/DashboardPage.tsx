import { useNavigate } from 'react-router-dom';
import { Wallet, TrendingUp, ShoppingBag, FileText, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/shared/PageHeader';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { useDashboard } from './useDashboard';
import { formatCurrency } from '@/lib/utils';

export default function DashboardPage() {
    const navigate = useNavigate();
    const { stats, recentTransactions, recentOrders, isLoading } = useDashboard();

    if (isLoading) {
        return <LoadingSpinner message="Loading dashboard..." fullHeight />;
    }

    const statCards = [
        { title: 'Wallet Balance', value: formatCurrency(stats.walletBalance), icon: Wallet, color: 'bg-green-500' },
        { title: 'Total Transactions', value: stats.totalTransactions, icon: TrendingUp, color: 'bg-blue-500' },
        { title: 'Total Orders', value: stats.totalOrders, icon: ShoppingBag, color: 'bg-purple-500' },
        { title: 'Total Bills', value: stats.totalBills, icon: FileText, color: 'bg-orange-500' },
    ];

    return (
        <ErrorBoundary>
            <div className="space-y-6">
                <PageHeader
                    title="Dashboard"
                    subtitle="Welcome back! Here's your overview."
                    action={
                        <Button onClick={() => navigate('/customer/add-balance')} className="gap-2 text-white">
                            <Plus className="w-4 h-4" /> Add Balance
                        </Button>
                    }
                />

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
                                        <div key={txn.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                                            <div>
                                                <p className="font-medium text-primary">
                                                    {txn.description || 'Transaction'}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {new Date(txn.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <span className={`font-semibold ${txn.type === 'CREDIT' ? 'text-green-600' : 'text-red-600'}`}>
                                                {txn.type === 'CREDIT' ? '+' : '-'}₹{txn.amount.toFixed(2)}
                                            </span>
                                        </div>
                                    ))}
                                    <Button variant="outline" className="w-full mt-4" onClick={() => navigate('/customer/transactions')}>
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
                                        <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
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
                                    <Button variant="outline" className="w-full mt-4" onClick={() => navigate('/customer/orders')}>
                                        View All Orders
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </ErrorBoundary>
    );
}

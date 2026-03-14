import { Users, CreditCard, Activity, TrendingUp, Plus, FileText, ShoppingBag } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import UserModal from '@/components/UserModal';
import OrderModal from '@/components/OrderModal';
import BillModal from '@/components/BillModal';
import { PageHeader } from '@/components/shared/PageHeader';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { useDashboard } from './useDashboard';

export default function DashboardPage() {
    const {
        stats, isLoading,
        isUserModalOpen, setIsUserModalOpen,
        isOrderModalOpen, setIsOrderModalOpen,
        isBillModalOpen, setIsBillModalOpen,
        refreshDashboard
    } = useDashboard();

    if (isLoading) {
        return <LoadingSpinner message="Loading dashboard..." fullHeight />;
    }

    const statCards = [
        {
            title: 'Total Users',
            value: stats?.stats.totalUsers.toString() || '0',
            icon: Users,
            trend: '+0%',
            color: 'bg-blue-500',
        },
        {
            title: 'Total Transactions',
            value: stats?.stats.totalTransactions.toString() || '0',
            icon: CreditCard,
            trend: '+0%',
            color: 'bg-green-500',
        },
        {
            title: 'Active Users',
            value: stats?.stats.activeUsers.toString() || '0',
            icon: Activity,
            trend: '+0%',
            color: 'bg-purple-500',
        },
        {
            title: 'Total Revenue',
            value: `₹${stats?.stats.totalRevenue.toFixed(2) || '0.00'}`,
            icon: TrendingUp,
            trend: '+0%',
            color: 'bg-orange-500',
        },
    ];

    return (
        <div className="space-y-6">
            <PageHeader
                title="Dashboard"
                subtitle="Welcome back! Here's your system overview."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={stat.title} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-gray-600">
                                    {stat.title}
                                </CardTitle>
                                <div className={`${stat.color} p-2 rounded-lg`}>
                                    <Icon className="w-4 h-4 text-white" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold font-display text-primary">{stat.value}</div>
                                <p className="text-xs text-gray-500 mt-1">
                                    <span className="text-green-600 font-medium">{stat.trend}</span> from last month
                                </p>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Quick Actions */}
                <Card className="border-0 shadow-lg">
                    <CardHeader>
                        <CardTitle className="font-display">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <button onClick={() => setIsUserModalOpen(true)} className="w-full flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors text-left">
                            <div className="bg-primary p-2 rounded-lg"><Plus className="w-5 h-5 text-white" /></div>
                            <div>
                                <p className="font-semibold text-primary">Add User</p>
                                <p className="text-xs text-gray-500">Create a new customer account</p>
                            </div>
                        </button>
                        <button onClick={() => setIsOrderModalOpen(true)} className="w-full flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors text-left">
                            <div className="bg-accent-blue p-2 rounded-lg"><ShoppingBag className="w-5 h-5 text-white" /></div>
                            <div>
                                <p className="font-semibold text-primary">Add Order</p>
                                <p className="text-xs text-gray-500">Create a new order manually</p>
                            </div>
                        </button>
                        <button onClick={() => setIsBillModalOpen(true)} className="w-full flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors text-left">
                            <div className="bg-green-500 p-2 rounded-lg"><FileText className="w-5 h-5 text-white" /></div>
                            <div>
                                <p className="font-semibold text-primary">Add Bill</p>
                                <p className="text-xs text-gray-500">Generate a new bill/invoice</p>
                            </div>
                        </button>
                    </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card className="border-0 shadow-lg">
                    <CardHeader>
                        <CardTitle className="font-display">Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {stats?.recentActivity && stats.recentActivity.length > 0 ? (
                            <div className="space-y-4">
                                {stats.recentActivity.map((activity) => (
                                    <div key={activity.id} className="flex items-center justify-between border-b last:border-0 pb-2 last:pb-0">
                                        <div>
                                            <p className="text-sm font-medium text-gray-800">{activity.message}</p>
                                            <p className="text-xs text-gray-500">{new Date(activity.date).toLocaleDateString()}</p>
                                        </div>
                                        <div className={`px-2 py-1 text-xs rounded-full ${activity.status === 'SUCCESS' ? 'bg-green-100 text-green-800' :
                                                activity.status === 'FAILED' ? 'bg-red-100 text-red-800' :
                                                    'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {activity.status}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                <Activity className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                                <p>No recent activity</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            <UserModal isOpen={isUserModalOpen} onClose={(r) => { setIsUserModalOpen(false); if (r) refreshDashboard(); }} user={null} />
            <OrderModal isOpen={isOrderModalOpen} onClose={(r) => { setIsOrderModalOpen(false); if (r) refreshDashboard(); }} order={null} />
            <BillModal isOpen={isBillModalOpen} onClose={(r) => { setIsBillModalOpen(false); if (r) refreshDashboard(); }} bill={null} />
        </div>
    );
}

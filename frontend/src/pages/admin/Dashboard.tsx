import { Users, CreditCard, Activity, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminDashboard() {
    const stats = [
        {
            title: 'Total Users',
            value: '2',
            icon: Users,
            trend: '+0%',
            color: 'bg-blue-500',
        },
        {
            title: 'Total Transactions',
            value: '0',
            icon: CreditCard,
            trend: '+0%',
            color: 'bg-green-500',
        },
        {
            title: 'Active Users',
            value: '2',
            icon: Activity,
            trend: '+0%',
            color: 'bg-purple-500',
        },
        {
            title: 'Total Revenue',
            value: '₹0.00',
            icon: TrendingUp,
            trend: '+0%',
            color: 'bg-orange-500',
        },
    ];

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold font-display text-primary">Dashboard</h1>
                <p className="text-gray-600 mt-1">Welcome back! Here's your system overview.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => {
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

            {/* Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-0 shadow-lg">
                    <CardHeader>
                        <CardTitle className="font-display">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <button className="w-full flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors text-left">
                            <div className="bg-primary p-2 rounded-lg">
                                <Users className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <p className="font-semibold text-primary">Manage Users</p>
                                <p className="text-xs text-gray-500">View and edit user accounts</p>
                            </div>
                        </button>
                        <button className="w-full flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors text-left">
                            <div className="bg-accent-blue p-2 rounded-lg">
                                <CreditCard className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <p className="font-semibold text-primary">View Transactions</p>
                                <p className="text-xs text-gray-500">Monitor all transactions</p>
                            </div>
                        </button>
                    </CardContent>
                </Card>

                <Card className="border-0 shadow-lg">
                    <CardHeader>
                        <CardTitle className="font-display">Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center py-8 text-gray-500">
                            <Activity className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                            <p>No recent activity</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

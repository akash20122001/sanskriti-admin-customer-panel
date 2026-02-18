import { useEffect, useState } from 'react';
import { orderService } from '@/services/order.service';
import { toast } from 'sonner';
import type { Order } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Pencil, ShoppingCart, Package } from 'lucide-react';
import OrderModal from '@/components/OrderModal';

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    // Fetch orders
    const fetchOrders = async () => {
        try {
            setLoading(true);
            const data = await orderService.getAllOrders();
            setOrders(data);
            setFilteredOrders(data);
        } catch (error) {
            toast.error('Failed to fetch orders', {
                description: (error as Error).message,
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    // Search filter
    useEffect(() => {
        const filtered = orders.filter(
            (order) =>
                order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.skuId.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredOrders(filtered);
    }, [searchTerm, orders]);

    // Handlers
    const handleAddOrder = () => {
        setSelectedOrder(null);
        setIsModalOpen(true);
    };

    const handleEditOrder = (order: Order) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
    };



    const handleModalClose = (refreshData?: boolean) => {
        setIsModalOpen(false);
        setSelectedOrder(null);
        if (refreshData) {
            fetchOrders();
        }
    };

    // Platform badge color mapping
    const getPlatformColor = (platform: string) => {
        const colors = {
            Amazon: 'bg-orange-100 text-orange-800',
            Flipkart: 'bg-blue-100 text-blue-800',
            Meesho: 'bg-purple-100 text-purple-800',
            Etsy: 'bg-green-100 text-green-800',
        };
        return colors[platform as keyof typeof colors] || 'bg-gray-100 text-gray-800';
    };

    // Status badge color mapping
    const getStatusColor = (status: string) => {
        const colors = {
            IN_PROGRESS: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
            SHIPPED: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
            RTO: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
        };
        return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
    };

    // Status display text
    const getStatusText = (status: string) => {
        const texts = {
            IN_PROGRESS: 'In Progress',
            SHIPPED: 'Shipped',
            RTO: 'RTO',
        };
        return texts[status as keyof typeof texts] || status;
    };

    // Currency symbol
    const getCurrencySymbol = (currency: string) => {
        return currency === 'USD' ? '$' : '₹';
    };

    // Calculate stats
    const todayOrders = orders.filter((o) => {
        const today = new Date();
        const orderDate = new Date(o.createdAt);
        return orderDate.toDateString() === today.toDateString();
    }).length;

    const topPlatform = orders.length > 0
        ? Object.entries(
            orders.reduce((acc, order) => {
                acc[order.platform] = (acc[order.platform] || 0) + 1;
                return acc;
            }, {} as Record<string, number>)
        ).sort(([, a], [, b]) => b - a)[0]?.[0] || 'N/A'
        : 'N/A';

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold font-display text-primary">Orders Management</h1>
                    <p className="text-gray-600 mt-1">Manage all orders across platforms</p>
                </div>
                <Button onClick={handleAddOrder} className="gap-2 bg-primary hover:bg-primary/90 text-white">
                    <Plus className="w-4 h-4" />
                    Add Order
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                        <ShoppingCart className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{orders.length}</div>
                        <p className="text-xs text-gray-600 mt-1">All time orders</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Recent Orders</CardTitle>
                        <Package className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{todayOrders}</div>
                        <p className="text-xs text-gray-600 mt-1">Orders today</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Top Platform</CardTitle>
                        <Package className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{topPlatform}</div>
                        <p className="text-xs text-gray-600 mt-1">Most orders</p>
                    </CardContent>
                </Card>
            </div>

            {/* Search Bar */}
            <Card>
                <CardHeader>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                            placeholder="Search by order ID, user ID, or SKU ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 bg-white dark:bg-dark-bg-tertiary"
                        />
                    </div>
                </CardHeader>
            </Card>

            {/* Orders Table */}
            <Card>
                <CardHeader>
                    <CardTitle>All Orders</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="text-center py-8">
                            <p className="text-gray-600">Loading orders...</p>
                        </div>
                    ) : filteredOrders.length === 0 ? (
                        <div className="text-center py-12">
                            <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600 font-medium">No orders yet</p>
                            <p className="text-gray-500 text-sm mt-1">
                                {searchTerm
                                    ? 'No orders match your search criteria'
                                    : 'Add your first order to get started'}
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                                            Order ID
                                        </th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                                            User ID
                                        </th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                                            SKU ID
                                        </th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                                            Price
                                        </th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                                            Platform
                                        </th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                                            Status
                                        </th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                                            Delivery Partner
                                        </th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                                            Tracking ID
                                        </th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                                            Order Date
                                        </th>
                                        <th className="text-right py-3 px-4 text-sm font-medium text-gray-700">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredOrders.map((order) => (
                                        <tr
                                            key={order.id}
                                            className="border-b border-gray-100 hover:bg-gray-50"
                                        >
                                            <td className="py-3 px-4">
                                                <span className="font-medium text-gray-900">
                                                    {order.orderId}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className="text-gray-700">{order.userId}</span>
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className="text-gray-700">{order.skuId}</span>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium text-gray-900">
                                                        {getCurrencySymbol(order.currency)}
                                                        {order.price.toFixed(2)}
                                                    </span>
                                                    <Badge variant="outline" className="text-xs">
                                                        {order.currency}
                                                    </Badge>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <Badge className={getPlatformColor(order.platform)}>
                                                    {order.platform}
                                                </Badge>
                                            </td>
                                            <td className="py-3 px-4">
                                                <Badge className={getStatusColor(order.status)}>
                                                    {getStatusText(order.status)}
                                                </Badge>
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className="text-sm text-gray-700">
                                                    {order.deliveryPartner || '-'}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className="text-sm text-gray-600 font-mono">
                                                    {order.trackingId || '-'}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className="text-sm text-gray-600">
                                                    {order.orderDate
                                                        ? new Date(order.orderDate).toLocaleDateString()
                                                        : new Date(order.createdAt).toLocaleDateString()}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleEditOrder(order)}
                                                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                                    >
                                                        <Pencil className="w-4 h-4" />
                                                    </Button>

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

            {/* Order Modal */}
            <OrderModal isOpen={isModalOpen} onClose={handleModalClose} order={selectedOrder} />
        </div>
    );
}

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Pencil, ShoppingCart, Package } from 'lucide-react';
import OrderModal from '@/components/OrderModal';
import { DataTable } from '@/components/shared/DataTable';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { formatAmount, formatDate } from '@/lib/utils';
import type { Column } from '@/components/shared/DataTable';
import type { Order } from '@/types';
import { useOrders } from './useOrders';

export default function OrdersPage() {
    const {
        searchTerm, setSearchTerm,
        isModalOpen, setIsModalOpen,
        selectedOrder, setSelectedOrder,
        orders, filteredOrders, isLoading,
        todayOrdersCount, topPlatform,
        handleModalClose
    } = useOrders();

    const columns: Column<Order>[] = [
        { header: 'Order ID', accessor: (o) => <span className="font-medium text-gray-900">{o.orderId}</span> },
        { header: 'User ID', accessor: 'userId' },
        { header: 'SKU ID', accessor: 'skuId' },
        {
            header: 'Price',
            accessor: (o) => (
                <div className="flex items-center gap-2">
                    <span className="font-medium">{formatAmount(o.price, o.currency)}</span>
                    <Badge variant="outline" className="text-xs">{o.currency}</Badge>
                </div>
            ),
        },
        { header: 'Platform', accessor: (o) => <StatusBadge status={o.platform} variant="platform" /> },
        { header: 'Status', accessor: (o) => <StatusBadge status={o.status} /> },
        { header: 'Partner', accessor: (o) => o.deliveryPartner || '-' },
        { header: 'Tracking', accessor: (o) => <span className="font-mono text-xs">{o.trackingId || '-'}</span> },
        { header: 'Date', accessor: (o) => formatDate(o.orderDate ?? o.createdAt) },
        {
            header: 'Actions',
            className: 'text-right',
            accessor: (o) => (
                <div className="flex justify-end">
                    <Button variant="ghost" size="sm"
                        onClick={() => { setSelectedOrder(o); setIsModalOpen(true); }}
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                        <Pencil className="w-4 h-4" />
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <div className="space-y-6">
            <PageHeader
                title="Orders Management"
                subtitle="Manage all orders across platforms"
                action={
                    <Button onClick={() => { setSelectedOrder(null); setIsModalOpen(true); }}
                        className="gap-2 bg-primary hover:bg-primary/90 text-white">
                        <Plus className="w-4 h-4" /> Add Order
                    </Button>
                }
            />

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
                        <CardTitle className="text-sm font-medium">Today's Orders</CardTitle>
                        <Package className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{todayOrdersCount}</div>
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

            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                    placeholder="Search by order ID, user ID, or SKU ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white dark:bg-dark-bg-tertiary"
                />
            </div>

            <Card>
                <CardHeader><CardTitle>All Orders ({filteredOrders.length})</CardTitle></CardHeader>
                <CardContent>
                    <DataTable
                        columns={columns}
                        data={filteredOrders}
                        isLoading={isLoading}
                        rowKey="id"
                        emptyMessage={searchTerm ? 'No orders match your search' : 'No orders yet'}
                        emptyIcon={ShoppingCart}
                    />
                </CardContent>
            </Card>

            <OrderModal isOpen={isModalOpen} onClose={handleModalClose} order={selectedOrder} />
        </div>
    );
}

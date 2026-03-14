import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, ShoppingBag } from 'lucide-react';
import { DataTable } from '@/components/shared/DataTable';
import { PageHeader } from '@/components/shared/PageHeader';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';
import { useOrders } from './useOrders';
import { customerOrderColumns } from './columns';

export default function OrdersPage() {
    const { searchTerm, setSearchTerm, filteredOrders, isLoading } = useOrders();

    return (
        <ErrorBoundary>
            <div className="space-y-6">
                <PageHeader
                    title="My Orders"
                    subtitle="View your order history"
                />

                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                        placeholder="Search by Order ID, SKU, or Platform..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-white dark:bg-dark-bg-secondary"
                    />
                </div>

                <Card className="border-0 shadow overflow-hidden">
                    <CardContent className="p-0">
                        <DataTable
                            columns={customerOrderColumns}
                            data={filteredOrders}
                            isLoading={isLoading}
                            rowKey="id"
                            emptyMessage={searchTerm ? 'No orders match your search' : 'No orders found'}
                            emptyIcon={ShoppingBag}
                        />
                    </CardContent>
                </Card>
            </div>
        </ErrorBoundary>
    );
}

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pencil } from 'lucide-react';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { formatAmount, formatDate } from '@/lib/utils';
import type { Column } from '@/components/shared/DataTable';
import type { Order } from '@/types';

interface OrderColumnActions {
    onEdit: (order: Order) => void;
}

export const getOrderColumns = (actions: OrderColumnActions): Column<Order>[] => [
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
                    onClick={() => actions.onEdit(o)}
                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                    <Pencil className="w-4 h-4" />
                </Button>
            </div>
        ),
    },
];

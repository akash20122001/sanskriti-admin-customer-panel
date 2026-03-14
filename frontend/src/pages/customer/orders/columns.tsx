import { StatusBadge } from '@/components/shared/StatusBadge';
import { formatAmount, formatDate } from '@/lib/utils';
import type { Column } from '@/components/shared/DataTable';
import type { Order } from '@/types';

export const customerOrderColumns: Column<Order>[] = [
    { header: 'Order ID', accessor: (o) => <span className="font-mono text-gray-900">{o.orderId}</span> },
    { header: 'SKU ID', accessor: 'skuId' },
    { header: 'Platform', accessor: (o) => <StatusBadge status={o.platform} variant="platform" /> },
    { header: 'Partner', accessor: (o) => o.deliveryPartner || '-' },
    { header: 'Tracking', accessor: (o) => <span className="font-mono text-xs">{o.trackingId || '-'}</span> },
    {
        header: 'Price',
        accessor: (o) => (
            <span className="font-semibold text-gray-900">
                {formatAmount(o.price, o.currency)}
            </span>
        ),
    },
    { header: 'Date', accessor: (o) => formatDate(o.createdAt) },
    { header: 'Order Date', accessor: (o) => o.orderDate ? formatDate(o.orderDate) : '-' },
];

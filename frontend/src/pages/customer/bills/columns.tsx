import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { formatAmount, formatDate } from '@/lib/utils';
import type { Column } from '@/components/shared/DataTable';
import type { Bill } from '@/types';

interface BillColumnActions {
    onDownload: (bill: Bill) => void;
}

export const getCustomerBillColumns = (actions: BillColumnActions): Column<Bill>[] => [
    { header: 'Invoice No', accessor: (b) => <span className="font-semibold text-primary">{b.invoiceNumber || '-'}</span> },
    { header: 'Transaction ID', accessor: (b) => <span className="font-mono text-xs">{b.transactionId}</span> },
    { header: 'Date', accessor: (b) => formatDate(b.transactionDate) },
    {
        header: 'Product',
        accessor: (b) => (
            <div>
                <p className="font-medium text-gray-900">{b.productName}</p>
                <p className="text-xs text-gray-500">SKU: {b.skuId}</p>
            </div>
        )
    },
    { header: 'Quantity', accessor: 'quantity' },
    {
        header: 'Amount',
        accessor: (b) => (
            <span className="font-semibold text-gray-900">
                {formatAmount(b.payableAmount, b.currency)}
            </span>
        )
    },
    {
        header: 'Invoice',
        accessor: (b) => b.invoiceUrl ? (
            <Button size="sm" variant="outline" onClick={() => actions.onDownload(b)} className="gap-2">
                <Download className="h-4 w-4" /> Download
            </Button>
        ) : (
            <span className="text-xs text-gray-400">N/A</span>
        )
    },
];

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download } from 'lucide-react';
import { formatAmount, formatDate } from '@/lib/utils';
import type { Column } from '@/components/shared/DataTable';
import type { Bill } from '@/types';

interface BillColumnActions {
    onDownload: (bill: Bill) => void;
}

export const getBillColumns = (actions: BillColumnActions): Column<Bill>[] => [
    { header: 'Invoice No', accessor: (b) => <span className="font-semibold text-primary text-sm">{b.invoiceNumber || '-'}</span> },
    { header: 'Transaction ID', accessor: (b) => <code className="text-xs bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">{b.transactionId}</code> },
    {
        header: 'Company',
        accessor: (b) => (
            <div>
                <p className="font-medium text-gray-900">{b.company}</p>
                <p className="text-gray-500 text-xs">{b.email}</p>
            </div>
        ),
    },
    {
        header: 'Product',
        accessor: (b) => (
            <div>
                <p className="text-gray-900">{b.productName}</p>
                <p className="text-gray-500 text-xs">SKU: {b.skuId}</p>
            </div>
        ),
    },
    {
        header: 'Amount',
        accessor: (b) => (
            <div className="flex items-center gap-2">
                <span className="font-semibold">{formatAmount(b.payableAmount, b.currency)}</span>
                <Badge variant="outline" className="text-xs">{b.currency}</Badge>
            </div>
        ),
    },
    { header: 'Date', accessor: (b) => formatDate(b.transactionDate) },
    {
        header: 'Invoice',
        accessor: (b) => b.invoiceUrl
            ? <Badge className="bg-green-100 text-green-800">Generated</Badge>
            : <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>,
    },
    {
        header: 'Actions',
        className: 'text-right',
        accessor: (b) => (
            <div className="flex justify-end">
                {b.invoiceUrl && (
                    <Button variant="ghost" size="sm" onClick={() => actions.onDownload(b)}
                        className="text-green-600 hover:text-green-700 hover:bg-green-50">
                        <Download className="w-4 h-4" />
                    </Button>
                )}
            </div>
        ),
    },
];

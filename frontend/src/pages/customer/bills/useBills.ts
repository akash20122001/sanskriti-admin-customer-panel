import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { billService } from '@/services/bill.service';
import type { Bill } from '@/types';

export function useBills() {
    const [searchTerm, setSearchTerm] = useState('');

    const { data: bills = [], isLoading, error } = useQuery({
        queryKey: ['customer-bills'],
        queryFn: () => billService.getCustomerBills().then(res => res || []),
        throwOnError: true,
    });

    const filteredBills = useMemo(() => {
        const term = searchTerm.toLowerCase();
        if (!term) return bills;
        return (bills as Bill[]).filter(
            (b) =>
                b.transactionId.toLowerCase().includes(term) ||
                (b.invoiceNumber && b.invoiceNumber.toLowerCase().includes(term)) ||
                b.productName.toLowerCase().includes(term) ||
                b.skuId.toLowerCase().includes(term)
        );
    }, [searchTerm, bills]);

    const handleDownloadInvoice = (bill: Bill) => {
        if (bill.invoiceUrl) {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const baseUrl = apiUrl.replace('/api', '');
            window.open(`${baseUrl}${bill.invoiceUrl}`, '_blank');
        }
    };

    return {
        searchTerm, setSearchTerm,
        bills, filteredBills,
        isLoading, error,
        handleDownloadInvoice
    };
}

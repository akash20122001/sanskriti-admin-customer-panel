import { useMemo, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { billService } from '@/services/bill.service';
import { toast } from 'sonner';
import type { Bill } from '@/types';

export function useBills() {
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedBill, setSelectedBill] = useState<Bill | null>(null);

    const { data: bills = [], isLoading, error } = useQuery({
        queryKey: ['bills'],
        queryFn: billService.getAllBills,
        throwOnError: true,
    });

    const filteredBills = useMemo(() => {
        const term = searchTerm.toLowerCase();
        if (!term) return bills;
        return bills.filter(
            (b) =>
                b.transactionId.toLowerCase().includes(term) ||
                b.company.toLowerCase().includes(term) ||
                b.productName.toLowerCase().includes(term),
        );
    }, [searchTerm, bills]);

    const handleDownloadInvoice = async (bill: Bill) => {
        try {
            const url = await billService.downloadInvoice(bill.id);
            window.open(url, '_blank');
        } catch (error) {
            toast.error('Failed to download invoice', { description: (error as Error).message });
        }
    };

    const handleModalClose = (refreshData?: boolean) => {
        setIsModalOpen(false);
        setSelectedBill(null);
        if (refreshData) queryClient.invalidateQueries({ queryKey: ['bills'] });
    };

    const today = new Date();
    const todayBillsCount = useMemo(() =>
        bills.filter((b) => new Date(b.transactionDate).toDateString() === today.toDateString()).length,
        [bills]
    );

    const monthBillsCount = useMemo(() =>
        bills.filter((b) => {
            const d = new Date(b.transactionDate);
            return d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
        }).length,
        [bills]
    );

    return {
        // State
        searchTerm, setSearchTerm,
        isModalOpen, setIsModalOpen,
        selectedBill, setSelectedBill,

        // Data & Loading
        bills, filteredBills, isLoading, error,
        todayBillsCount, monthBillsCount,

        // Actions
        handleDownloadInvoice,
        handleModalClose,
    };
}

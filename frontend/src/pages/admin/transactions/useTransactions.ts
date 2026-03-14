import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { transactionService } from '@/services/transaction.service';
import type { Transaction } from '@/types';

export type TypeFilter = 'ALL' | 'CREDIT' | 'DEBIT';
export type StatusFilter = 'ALL' | 'PENDING' | 'SUCCESS' | 'FAILED';

export function useTransactions() {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState<TypeFilter>('ALL');
    const [filterStatus, setFilterStatus] = useState<StatusFilter>('ALL');

    const { data: transactions = [], isLoading, error } = useQuery({
        queryKey: ['transactions-admin'],
        queryFn: transactionService.getAllTransactions,
        throwOnError: true,
    });

    const filteredTransactions = useMemo(() => {
        const term = searchTerm.toLowerCase();
        return transactions.filter((t: Transaction) => {
            const matchSearch = !term
                || t.transactionId.toLowerCase().includes(term)
                || t.userId.toLowerCase().includes(term);
            const matchType = filterType === 'ALL' || t.type === filterType;
            const matchStatus = filterStatus === 'ALL' || t.status === filterStatus;
            return matchSearch && matchType && matchStatus;
        });
    }, [transactions, searchTerm, filterType, filterStatus]);

    return {
        // State
        searchTerm, setSearchTerm,
        filterType, setFilterType,
        filterStatus, setFilterStatus,

        // Data & Loading
        transactions,
        filteredTransactions,
        isLoading,
        error,
    };
}

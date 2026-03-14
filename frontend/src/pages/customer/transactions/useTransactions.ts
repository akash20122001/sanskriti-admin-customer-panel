import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { transactionService } from '@/services/transaction.service';
import type { Transaction } from '@/types';

export function useTransactions() {
    const [searchTerm, setSearchTerm] = useState('');

    const { data: transactions = [], isLoading, error } = useQuery({
        queryKey: ['customer-transactions'],
        queryFn: () => transactionService.getTransactions().then(res => res || []),
        throwOnError: true,
    });

    const filteredTransactions = useMemo(() => {
        const term = searchTerm.toLowerCase();
        if (!term) return transactions;
        return (transactions as Transaction[]).filter(
            (txn) =>
                txn.transactionId.toLowerCase().includes(term) ||
                txn.description?.toLowerCase().includes(term)
        );
    }, [searchTerm, transactions]);

    return {
        searchTerm, setSearchTerm,
        transactions, filteredTransactions,
        isLoading, error,
    };
}

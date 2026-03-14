import { useMemo, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { userService } from '@/services/user.service';
import { toast } from 'sonner';
import type { User } from '@/types';

export function useUsers() {
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const { data: allUsers = [], isLoading } = useQuery({
        queryKey: ['users'],
        queryFn: userService.getAllUsers,
    });

    const activeUsersCount = useMemo(() => allUsers.filter((u) => u.isActive && u.role !== 'ADMIN').length, [allUsers]);
    const inactiveUsersCount = useMemo(() => allUsers.filter((u) => !u.isActive && u.role !== 'ADMIN').length, [allUsers]);

    const users = useMemo(() => allUsers.filter((u) => u.role !== 'ADMIN'), [allUsers]);

    const filteredUsers = useMemo(() => {
        const term = searchTerm.toLowerCase();
        if (!term) return users;
        return users.filter(
            (u) =>
                u.name.toLowerCase().includes(term) ||
                u.userId.toLowerCase().includes(term),
        );
    }, [searchTerm, users]);

    const handleDeleteConfirm = async () => {
        if (!deleteTarget) return;
        setIsDeleting(true);
        try {
            await userService.deleteUser(deleteTarget.id);
            toast.success('User deleted successfully');
            queryClient.invalidateQueries({ queryKey: ['users'] });
        } catch (error) {
            toast.error('Failed to delete user', { description: (error as Error).message });
        } finally {
            setIsDeleting(false);
            setDeleteTarget(null);
        }
    };

    const handleModalClose = (refreshData?: boolean) => {
        setIsModalOpen(false);
        setSelectedUser(null);
        if (refreshData) queryClient.invalidateQueries({ queryKey: ['users'] });
    };

    return {
        // State
        searchTerm, setSearchTerm,
        isModalOpen, setIsModalOpen,
        selectedUser, setSelectedUser,
        deleteTarget, setDeleteTarget,
        isDeleting,

        // Data & Loading
        users, filteredUsers, isLoading,
        activeUsersCount, inactiveUsersCount,

        // Actions
        handleDeleteConfirm,
        handleModalClose,
    };
}

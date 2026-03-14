import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Pencil, Trash2, UserCircle } from 'lucide-react';
import UserModal from '@/components/UserModal';
import { DataTable } from '@/components/shared/DataTable';
import { PageHeader } from '@/components/shared/PageHeader';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import type { Column } from '@/components/shared/DataTable';
import type { User } from '@/types';
import { useUsers } from './useUsers';

export default function UsersPage() {
    const {
        searchTerm, setSearchTerm,
        isModalOpen, setIsModalOpen,
        selectedUser, setSelectedUser,
        deleteTarget, setDeleteTarget,
        isDeleting,
        users, filteredUsers, isLoading,
        activeUsersCount, inactiveUsersCount,
        handleDeleteConfirm, handleModalClose
    } = useUsers();

    const columns: Column<User>[] = [
        {
            header: 'User',
            accessor: (u) => (
                <div>
                    <p className="font-medium text-primary">{u.name}</p>
                    <p className="text-xs text-gray-500">{u.userId}</p>
                </div>
            ),
        },
        {
            header: 'Company',
            accessor: (u) => (
                <div>
                    <p className="font-medium text-gray-900">{u.company || '-'}</p>
                    {u.gst && <p className="text-xs text-gray-500">GST: {u.gst}</p>}
                </div>
            ),
        },
        {
            header: 'Contact',
            accessor: (u) => (
                <div>
                    {u.email && <p className="text-sm text-gray-900">{u.email}</p>}
                    {u.phone && <p className="text-xs text-gray-500">{u.phone}</p>}
                    {!u.email && !u.phone && <span className="text-gray-400">-</span>}
                </div>
            ),
        },
        {
            header: 'Location',
            accessor: (u) => (
                <div>
                    {u.state && <p className="text-sm">{u.state}</p>}
                    {u.pin && <p className="text-xs text-gray-500">{u.pin}</p>}
                    {!u.state && !u.pin && <span className="text-gray-400">-</span>}
                </div>
            ),
        },
        {
            header: 'Role',
            accessor: (u) => (
                <Badge className={u.role === 'ADMIN'
                    ? 'bg-purple-100 text-purple-700'
                    : 'bg-blue-100 text-blue-700'}>
                    {u.role}
                </Badge>
            ),
        },
        {
            header: 'Wallet',
            accessor: (u) => <span className="font-medium">₹{u.walletBalance.toFixed(2)}</span>,
        },
        {
            header: 'Status',
            accessor: (u) => (
                <Badge className={u.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}>
                    {u.isActive ? 'Active' : 'Inactive'}
                </Badge>
            ),
        },
        {
            header: 'Actions',
            className: 'text-right',
            accessor: (u) => (
                <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="sm"
                        onClick={() => { setSelectedUser(u); setIsModalOpen(true); }}
                        className="hover:bg-blue-50 hover:text-blue-600">
                        <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm"
                        onClick={() => setDeleteTarget(u)}
                        className="hover:bg-red-50 hover:text-red-600">
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <div className="space-y-6">
            <PageHeader
                title="User Management"
                subtitle="Manage all customer accounts"
                action={
                    <Button onClick={() => { setSelectedUser(null); setIsModalOpen(true); }}
                        className="gap-2 bg-primary hover:bg-primary/90 text-white">
                        <Plus className="w-4 h-4" /> Add User
                    </Button>
                }
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                    { label: 'Total Users', value: users.length, icon: UserCircle, color: 'bg-blue-100 text-blue-600' },
                    { label: 'Active Users', value: activeUsersCount, icon: UserCircle, color: 'bg-green-100 text-green-600' },
                    { label: 'Inactive', value: inactiveUsersCount, icon: UserCircle, color: 'bg-gray-100 text-gray-600' },
                ].map(({ label, value, icon: Icon, color }) => (
                    <Card key={label} className="border-0 shadow">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">{label}</p>
                                    <p className="text-2xl font-bold font-display text-primary">{value}</p>
                                </div>
                                <div className={`p-3 rounded-xl ${color}`}>
                                    <Icon className="w-6 h-6" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                    placeholder="Search by name or user ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                />
            </div>

            <Card className="border-0 shadow-lg">
                <CardHeader>
                    <CardTitle className="text-xl font-display">All Users ({filteredUsers.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    <DataTable
                        columns={columns}
                        data={filteredUsers}
                        isLoading={isLoading}
                        rowKey="id"
                        emptyMessage={searchTerm ? 'No users match your search' : 'No users yet'}
                    />
                </CardContent>
            </Card>

            <ConfirmDialog
                open={!!deleteTarget}
                title="Delete User"
                description={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
                confirmLabel="Delete User"
                onConfirm={handleDeleteConfirm}
                onCancel={() => setDeleteTarget(null)}
                isConfirming={isDeleting}
            />

            <UserModal isOpen={isModalOpen} onClose={handleModalClose} user={selectedUser} />
        </div>
    );
}

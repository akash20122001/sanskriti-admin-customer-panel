import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Plus, Search, UserCircle } from 'lucide-react';
import UserModal from '@/components/UserModal';
import { DataTable } from '@/components/shared/DataTable';
import { PageHeader } from '@/components/shared/PageHeader';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';
import { useUsers } from './useUsers';
import { getUserColumns } from './columns';

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

    const columns = getUserColumns({
        onEdit: (user) => {
            setSelectedUser(user);
            setIsModalOpen(true);
        },
        onDelete: (user) => {
            setDeleteTarget(user);
        }
    });

    return (
        <ErrorBoundary>
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
        </ErrorBoundary>
    );
}

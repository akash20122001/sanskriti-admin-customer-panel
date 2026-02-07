import { useEffect, useState } from 'react';
import { userService } from '@/services/user.service';
import { toast } from 'sonner';
import type { User } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Pencil, Trash2, UserCircle } from 'lucide-react';
import UserModal from '@/components/UserModal';

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    // Fetch users (exclude ADMIN users)
    const fetchUsers = async () => {
        try {
            setLoading(true);
            const data = await userService.getAllUsers();
            // Filter out ADMIN users - only show CUSTOMER users
            const customerUsers = data.filter(user => user.role !== 'ADMIN');
            setUsers(customerUsers);
            setFilteredUsers(customerUsers);
        } catch (error) {
            toast.error('Failed to fetch users', {
                description: (error as Error).message,
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Search filter (already filtered to exclude ADMIN)
    useEffect(() => {
        const filtered = users.filter(
            (user) =>
                user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.userId.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredUsers(filtered);
    }, [searchTerm, users]);

    // Handlers
    const handleAddUser = () => {
        setSelectedUser(null);
        setIsModalOpen(true);
    };

    const handleEditUser = (user: User) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const handleDeleteUser = async (user: User) => {
        if (!confirm(`Are you sure you want to delete user "${user.name}"?`)) {
            return;
        }

        try {
            await userService.deleteUser(user.id);
            toast.success('User deleted successfully');
            fetchUsers();
        } catch (error) {
            toast.error('Failed to delete user', {
                description: (error as Error).message,
            });
        }
    };

    const handleModalClose = (refreshData?: boolean) => {
        setIsModalOpen(false);
        setSelectedUser(null);
        if (refreshData) {
            fetchUsers();
        }
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold font-display text-primary">User Management</h1>
                    <p className="text-gray-600 mt-1">Manage all users and their permissions</p>
                </div>
                <Button onClick={handleAddUser} className="gap-2 bg-primary hover:bg-primary/90 text-white">
                    <Plus className="w-4 h-4" />
                    Add User
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="border-0 shadow">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Users</p>
                                <p className="text-2xl font-bold font-display text-primary">{users.length}</p>
                            </div>
                            <div className="bg-blue-100 p-3 rounded-xl">
                                <UserCircle className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-0 shadow">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Active Users</p>
                                <p className="text-2xl font-bold font-display text-primary">
                                    {users.filter((u) => u.isActive).length}
                                </p>
                            </div>
                            <div className="bg-green-100 p-3 rounded-xl">
                                <UserCircle className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-0 shadow">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Admins</p>
                                <p className="text-2xl font-bold font-display text-primary">
                                    {users.filter((u) => u.role === 'ADMIN').length}
                                </p>
                            </div>
                            <div className="bg-purple-100 p-3 rounded-xl">
                                <UserCircle className="w-6 h-6 text-purple-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Users Table Card */}
            <Card className="border-0 shadow-lg">
                <CardHeader>
                    <CardTitle className="text-xl font-display">All Users</CardTitle>
                </CardHeader>
                <CardContent>
                    {/* Search */}
                    <div className="mb-6">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <Input
                                type="text"
                                placeholder="Search by name or user ID..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>

                    {/* Table */}
                    {loading ? (
                        <div className="text-center py-12 text-gray-500">Loading users...</div>
                    ) : filteredUsers.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            {searchTerm ? 'No users found matching your search' : 'No users yet'}
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            User
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Role
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Wallet Balance
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {filteredUsers.map((user) => (
                                        <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-4 py-4">
                                                <div>
                                                    <p className="font-medium text-primary">{user.name}</p>
                                                    <p className="text-sm text-gray-500">{user.userId}</p>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4">
                                                <Badge
                                                    variant={user.role === 'ADMIN' ? 'default' : 'secondary'}
                                                    className={
                                                        user.role === 'ADMIN'
                                                            ? 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                                                            : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                                                    }
                                                >
                                                    {user.role}
                                                </Badge>
                                            </td>
                                            <td className="px-4 py-4">
                                                <span className="font-medium text-gray-900">
                                                    ₹{user.walletBalance.toFixed(2)}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4">
                                                <Badge
                                                    variant={user.isActive ? 'default' : 'secondary'}
                                                    className={
                                                        user.isActive
                                                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                    }
                                                >
                                                    {user.isActive ? 'Active' : 'Inactive'}
                                                </Badge>
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleEditUser(user)}
                                                        className="hover:bg-blue-50 hover:text-blue-600"
                                                    >
                                                        <Pencil className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleDeleteUser(user)}
                                                        className="hover:bg-red-50 hover:text-red-600"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* User Modal */}
            <UserModal
                isOpen={isModalOpen}
                onClose={handleModalClose}
                user={selectedUser}
            />
        </div>
    );
}

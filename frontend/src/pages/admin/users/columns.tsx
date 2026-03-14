import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2 } from 'lucide-react';
import type { Column } from '@/components/shared/DataTable';
import type { User } from '@/types';

interface UserColumnActions {
    onEdit: (user: User) => void;
    onDelete: (user: User) => void;
}

export const getUserColumns = (actions: UserColumnActions): Column<User>[] => [
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
                    onClick={() => actions.onEdit(u)}
                    className="hover:bg-blue-50 hover:text-blue-600">
                    <Pencil className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm"
                    onClick={() => actions.onDelete(u)}
                    className="hover:bg-red-50 hover:text-red-600">
                    <Trash2 className="w-4 h-4" />
                </Button>
            </div>
        ),
    },
];

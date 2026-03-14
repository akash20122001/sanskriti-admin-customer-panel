import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import LoginPage from '@/pages/Login';
import ProtectedRoute from '@/components/ProtectedRoute';
import AppLayout from '@/layouts/AppLayout';
import Unauthorized from '@/pages/Unauthorized';
import RootRedirect from '@/components/RootRedirect';

// Public Pages
import TermsPrivacy from '@/pages/TermsPrivacy';

// Admin Pages
import DashboardPage from '@/pages/admin/dashboard/DashboardPage';
import UsersPage from '@/pages/admin/users/UsersPage';
import OrdersPage from '@/pages/admin/orders/OrdersPage';
import BillsPage from '@/pages/admin/bills/BillsPage';
import TransactionsPage from '@/pages/admin/transactions/TransactionsPage';
import AdminSettings from '@/pages/admin/Settings';

// Customer Pages
import CustomerDashboard from '@/pages/customer/Dashboard';
import AddBalance from '@/pages/customer/AddBalance';
import Transactions from '@/pages/customer/Transactions';
import CustomerOrders from '@/pages/customer/Orders';
import CustomerBills from '@/pages/customer/Bills';
import Profile from '@/pages/customer/Profile';

const router = createBrowserRouter([
    { path: '/', element: <RootRedirect /> },
    { path: '/login', element: <LoginPage /> },
    { path: '/unauthorized', element: <Unauthorized /> },
    { path: '/terms-privacy', element: <TermsPrivacy /> },

    // Admin Routes
    {
        path: '/admin',
        element: <ProtectedRoute allowedRoles={['ADMIN']} />,
        children: [
            {
                element: <AppLayout role="admin" />,
                children: [
                    { index: true, element: <DashboardPage /> },
                    { path: 'dashboard', element: <DashboardPage /> },
                    { path: 'users', element: <UsersPage /> },
                    { path: 'orders', element: <OrdersPage /> },
                    { path: 'bills', element: <BillsPage /> },
                    { path: 'transactions', element: <TransactionsPage /> },
                    { path: 'settings', element: <AdminSettings /> },
                ],
            },
        ],
    },

    // Customer Routes
    {
        path: '/customer',
        element: <ProtectedRoute allowedRoles={['CUSTOMER']} />,
        children: [
            {
                element: <AppLayout role="customer" />,
                children: [
                    { index: true, element: <Navigate to="/customer/dashboard" replace /> },
                    { path: 'dashboard', element: <CustomerDashboard /> },
                    { path: 'add-balance', element: <AddBalance /> },
                    { path: 'transactions', element: <Transactions /> },
                    { path: 'orders', element: <CustomerOrders /> },
                    { path: 'bills', element: <CustomerBills /> },
                    { path: 'profile', element: <Profile /> },
                ],
            },
        ],
    },
]);

export default function AppRouter() {
    return <RouterProvider router={router} />;
}

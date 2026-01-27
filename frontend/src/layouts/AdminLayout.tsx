import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

export default function AdminLayout() {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <div className="lg:ml-64 flex flex-col min-h-screen">
                {/* Header */}
                <Header />

                {/* Page Content */}
                <main className="flex-1 p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

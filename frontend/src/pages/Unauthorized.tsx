import { useNavigate } from 'react-router-dom';
import { ShieldOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/authStore';

/**
 * Unauthorized (403) page.
 * Previously an anonymous inline component inside router/index.tsx with no branding or actions.
 */
export default function Unauthorized() {
    const navigate = useNavigate();
    const { user } = useAuthStore();

    const handleGoHome = () => {
        if (user?.role === 'ADMIN') navigate('/admin');
        else if (user?.role === 'CUSTOMER') navigate('/customer/dashboard');
        else navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="text-center max-w-md">
                <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                        <ShieldOff className="w-10 h-10 text-red-500" />
                    </div>
                </div>
                <h1 className="text-6xl font-bold text-primary mb-2">403</h1>
                <h2 className="text-2xl font-semibold text-gray-800 mb-3">Access Denied</h2>
                <p className="text-gray-500 mb-8">
                    You don't have permission to view this page. Please contact your administrator if you believe this is an error.
                </p>
                <Button onClick={handleGoHome} className="bg-primary hover:bg-primary/90 text-white">
                    Go to Home
                </Button>
            </div>
        </div>
    );
}

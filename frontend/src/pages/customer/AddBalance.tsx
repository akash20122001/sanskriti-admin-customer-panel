import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Wallet, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { authService } from '@/services/auth.service';
import AddBalanceModal from '@/components/AddBalanceModal';

export default function AddBalance() {
    const navigate = useNavigate();
    const [currentBalance, setCurrentBalance] = useState<number>(0);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            setLoading(true);
            const user = await authService.getCurrentUser();
            setCurrentBalance(user?.walletBalance || 0);
        } catch (error) {
            console.error('Failed to fetch user data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSuccess = () => {
        // Refresh user data after successful payment
        fetchUserData();
        // Optionally navigate back to dashboard
        // navigate('/customer/dashboard');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/customer/dashboard')}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-6 h-6 text-gray-600" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold font-display text-primary">Add Balance</h1>
                        <p className="text-gray-600 mt-1">Top up your wallet securely</p>
                    </div>
                </div>
            </div>

            {/* Current Balance Card */}
            <Card className="border-0 shadow-lg">
                <CardHeader>
                    <CardTitle className="font-display flex items-center gap-2">
                        <Wallet className="w-5 h-5 text-green-600" />
                        Current Wallet Balance
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-4xl font-bold text-green-600">
                        ₹{currentBalance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                </CardContent>
            </Card>

            {/* Add Balance Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* How to Add Balance */}
                <Card className="border-0 shadow-lg">
                    <CardHeader>
                        <CardTitle className="font-display flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-blue-600" />
                            How to Add Balance
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex gap-3">
                                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
                                    1
                                </div>
                                <div>
                                    <p className="font-medium text-primary">Click "Add Balance"</p>
                                    <p className="text-sm text-gray-600">Start the payment process</p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
                                    2
                                </div>
                                <div>
                                    <p className="font-medium text-primary">Enter Amount</p>
                                    <p className="text-sm text-gray-600">Choose amount between ₹1,000 - ₹50,000</p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
                                    3
                                </div>
                                <div>
                                    <p className="font-medium text-primary">Complete Payment</p>
                                    <p className="text-sm text-gray-600">Pay securely via Razorpay</p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-semibold">
                                    ✓
                                </div>
                                <div>
                                    <p className="font-medium text-primary">Balance Credited</p>
                                    <p className="text-sm text-gray-600">Amount added instantly to your wallet</p>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => setShowModal(true)}
                            className="w-full mt-6 bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
                        >
                            Add Balance Now
                        </button>
                    </CardContent>
                </Card>

                {/* Important Information */}
                <Card className="border-0 shadow-lg">
                    <CardHeader>
                        <CardTitle className="font-display flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-orange-600" />
                            Important Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                <div className="flex gap-2">
                                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-medium text-green-900">Instant Credit</p>
                                        <p className="text-sm text-green-700 mt-1">
                                            Your wallet balance is updated immediately after successful payment
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <div className="flex gap-2">
                                    <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-medium text-blue-900">Secure Payment</p>
                                        <p className="text-sm text-blue-700 mt-1">
                                            All payments are processed securely through Razorpay with bank-grade encryption
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                                <div className="flex gap-2">
                                    <CheckCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-medium text-purple-900">Payment Methods</p>
                                        <p className="text-sm text-purple-700 mt-1">
                                            UPI, Cards, Net Banking, and Wallets accepted
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                                <div className="flex gap-2">
                                    <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-medium text-orange-900">Limits</p>
                                        <p className="text-sm text-orange-700 mt-1">
                                            Minimum: ₹1,000 | Maximum: ₹50,000 per transaction
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Modal */}
            {showModal && (
                <AddBalanceModal
                    onClose={() => setShowModal(false)}
                    onSuccess={handleSuccess}
                />
            )}
        </div>
    );
}

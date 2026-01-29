import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet, Info, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { transactionService } from '@/services/transaction.service';

export default function AddBalance() {
    const navigate = useNavigate();
    const [amount, setAmount] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [testPaymentData, setTestPaymentData] = useState<{
        transactionId: string;
        amount: number;
    } | null>(null);

    const handleCreateOrder = async () => {
        const amountNum = parseFloat(amount);

        // Validation
        if (!amount || isNaN(amountNum)) {
            toast.error('Please enter a valid amount');
            return;
        }

        if (amountNum < 100) {
            toast.error('Minimum amount is ₹100');
            return;
        }

        if (amountNum > 50000) {
            toast.error('Maximum amount is ₹50,000');
            return;
        }

        try {
            setLoading(true);
            const response = await transactionService.createTestOrder(amountNum);

            setTestPaymentData({
                transactionId: response.transactionId,
                amount: response.amount,
            });

            toast.success('Test payment order created! Use the buttons below to simulate payment.');
        } catch (error: any) {
            toast.error(error.response?.data?.error || 'Failed to create order');
        } finally {
            setLoading(false);
        }
    };

    const handleTestPayment = async (success: boolean) => {
        if (!testPaymentData) {
            toast.error('No active payment order');
            return;
        }

        try {
            setLoading(true);
            const response = await transactionService.verifyTestPayment(
                testPaymentData.transactionId,
                success
            );

            if (success) {
                toast.success(
                    `Transaction successful! ₹${testPaymentData.amount.toFixed(2)} added to your wallet.`,
                    { duration: 5000 }
                );
                setTimeout(() => {
                    navigate('/customer/dashboard');
                }, 1500);
            } else {
                toast.error('Payment failed. Please try again.');
                setTestPaymentData(null);
                setAmount('');
            }
        } catch (error: any) {
            toast.error(error.response?.data?.error || 'Failed to process payment');
        } finally {
            setLoading(false);
        }
    };

    const quickAmounts = [100, 500, 1000, 2000, 5000, 10000];

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Add Balance</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Add money to your wallet using test payment
                </p>
            </div>

            {/* Info Alert */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex gap-3">
                    <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                    <div>
                        <h3 className="font-semibold text-blue-900 dark:text-blue-100">Test Payment Mode</h3>
                        <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                            Razorpay integration is coming soon! For now, use test buttons to simulate payments.
                            Minimum: ₹100 | Maximum: ₹50,000
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Card */}
            <div className="bg-white dark:bg-dark-bg-secondary rounded-lg shadow-lg p-6 space-y-6">
                {/* Amount Input */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Enter Amount (₹)
                    </label>
                    <div className="relative">
                        <Wallet className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <Input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="Enter amount"
                            className="pl-10 text-lg bg-white dark:bg-dark-bg-tertiary"
                            disabled={testPaymentData !== null}
                        />
                    </div>
                </div>

                {/* Quick Amount Buttons */}
                <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Quick Select:</p>
                    <div className="grid grid-cols-3 gap-2">
                        {quickAmounts.map((quickAmount) => (
                            <Button
                                key={quickAmount}
                                variant="outline"
                                onClick={() => setAmount(quickAmount.toString())}
                                disabled={testPaymentData !== null}
                                className="bg-white dark:bg-dark-bg-tertiary"
                            >
                                ₹{quickAmount}
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Proceed Button */}
                {!testPaymentData && (
                    <Button
                        onClick={handleCreateOrder}
                        disabled={loading || !amount}
                        className="w-full bg-primary hover:bg-primary/90 text-white"
                    >
                        {loading ? 'Processing...' : 'Proceed to Payment'}
                    </Button>
                )}

                {/* Test Payment Buttons */}
                {testPaymentData && (
                    <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="bg-gray-50 dark:bg-dark-bg-tertiary rounded-lg p-4">
                            <p className="text-sm text-gray-600 dark:text-gray-400">Transaction ID:</p>
                            <p className="font-mono text-sm font-semibold text-gray-900 dark:text-white">
                                {testPaymentData.transactionId}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Amount:</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                ₹{testPaymentData.amount.toFixed(2)}
                            </p>
                        </div>

                        <p className="text-center text-gray-600 dark:text-gray-400 font-medium">
                            Simulate Payment Outcome:
                        </p>

                        <div className="grid grid-cols-2 gap-4">
                            <Button
                                onClick={() => handleTestPayment(true)}
                                disabled={loading}
                                className="bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-2"
                            >
                                <CheckCircle className="w-5 h-5" />
                                Success
                            </Button>
                            <Button
                                onClick={() => handleTestPayment(false)}
                                disabled={loading}
                                variant="destructive"
                                className="flex items-center justify-center gap-2"
                            >
                                <XCircle className="w-5 h-5" />
                                Failure
                            </Button>
                        </div>

                        <Button
                            variant="outline"
                            onClick={() => {
                                setTestPaymentData(null);
                                setAmount('');
                            }}
                            disabled={loading}
                            className="w-full"
                        >
                            Cancel
                        </Button>
                    </div>
                )}
            </div>

            {/* Help Text */}
            <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                <p>Your wallet balance will be updated immediately after successful payment</p>
            </div>
        </div>
    );
}

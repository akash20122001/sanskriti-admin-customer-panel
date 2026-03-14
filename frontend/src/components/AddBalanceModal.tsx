import { useState } from 'react';
import { Wallet, AlertCircle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { CommonModal } from './ui/commonModal';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { createPaymentOrder, verifyPayment, openRazorpayCheckout } from '../services/payment.service';

interface AddBalanceModalProps {
    onClose: () => void;
    onSuccess: () => void;
}

const MIN_AMOUNT = 1;
const MAX_AMOUNT = 50000;

export default function AddBalanceModal({ onClose, onSuccess }: AddBalanceModalProps) {
    const [amount, setAmount] = useState<string>('2000');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>('');

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value === '' || /^\d+$/.test(value)) {
            setAmount(value);
            setError('');
        }
    };

    const validateAmount = (): boolean => {
        const numAmount = parseInt(amount);
        if (!amount || numAmount <= 0) {
            setError('Please enter a valid amount');
            return false;
        }
        if (numAmount < MIN_AMOUNT) {
            setError(`Minimum amount is ₹${MIN_AMOUNT}`);
            return false;
        }
        if (numAmount > MAX_AMOUNT) {
            setError(`Maximum amount is ₹${MAX_AMOUNT.toLocaleString('en-IN')}`);
            return false;
        }
        return true;
    };

    const handlePayment = async () => {
        if (!validateAmount()) return;
        setLoading(true);
        setError('');

        try {
            const numAmount = parseInt(amount);
            const orderData = await createPaymentOrder(numAmount);

            openRazorpayCheckout(
                orderData,
                async (response) => {
                    try {
                        const verifyData = {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            transactionId: response.transactionId,
                        };

                        const result = await verifyPayment(verifyData);
                        toast.success('Payment Successful', {
                            description: `${result.message}. New Balance: ₹${result.newBalance.toLocaleString('en-IN')}`,
                        });
                        setLoading(false);
                        onSuccess();
                        onClose();
                    } catch (verifyError: any) {
                        setLoading(false);
                        setError(verifyError.response?.data?.error || verifyError.message || 'Payment verification failed');
                    }
                },
                (err) => {
                    setLoading(false);
                    setError(err.error || 'Payment failed. Please try again.');
                }
            );
        } catch (err: any) {
            setLoading(false);
            setError(err.response?.data?.error || err.message || 'Failed to create payment order');
        }
    };

    const quickAmounts = [1000, 2000, 5000, 10000];

    return (
        <CommonModal
            isOpen={true}
            onClose={onClose}
            title="Add Balance"
            maxWidth="md"
            footer={
                <div className="flex justify-end gap-3 w-full">
                    <Button variant="outline" onClick={onClose} disabled={loading}>
                        Cancel
                    </Button>
                    <Button onClick={handlePayment} disabled={loading || !amount} className="text-white">
                        {loading ? 'Processing...' : `Pay ₹${amount ? parseInt(amount).toLocaleString('en-IN') : '0'}`}
                    </Button>
                </div>
            }
        >
            <div className="space-y-6">
                <div className="space-y-2">
                    <Label>Amount (₹)</Label>
                    <Input
                        type="text"
                        placeholder={`Min: ₹${MIN_AMOUNT}, Max: ₹${MAX_AMOUNT.toLocaleString('en-IN')}`}
                        value={amount}
                        onChange={handleAmountChange}
                        disabled={loading}
                        autoFocus
                    />
                </div>

                <div className="space-y-2">
                    <Label className="text-gray-500">Quick amounts:</Label>
                    <div className="grid grid-cols-4 gap-2">
                        {quickAmounts.map((q) => (
                            <Button
                                key={q}
                                type="button"
                                variant={amount === q.toString() ? 'default' : 'outline'}
                                className={amount === q.toString() ? 'text-white' : ''}
                                onClick={() => {
                                    setAmount(q.toString());
                                    setError('');
                                }}
                                disabled={loading}
                            >
                                ₹{q.toLocaleString('en-IN')}
                            </Button>
                        ))}
                    </div>
                </div>

                {error && (
                    <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 rounded-lg">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <p>{error}</p>
                    </div>
                )}

                <div className="flex items-start gap-2 p-3 text-sm text-blue-700 bg-blue-50 rounded-lg">
                    <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <p>Secure payment powered by Razorpay. Amount will be instantly credited to your wallet.</p>
                </div>
            </div>
        </CommonModal>
    );
}

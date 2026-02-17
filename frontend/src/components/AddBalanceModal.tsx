import { useState } from 'react';
import { X, Wallet, AlertCircle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { createPaymentOrder, verifyPayment, openRazorpayCheckout } from '../services/payment.service';
import '../styles/Modal.css';

interface AddBalanceModalProps {
    onClose: () => void;
    onSuccess: () => void;
}

const MIN_AMOUNT = 1000;
const MAX_AMOUNT = 50000;

const AddBalanceModal = ({ onClose, onSuccess }: AddBalanceModalProps) => {
    const [amount, setAmount] = useState<string>('2000');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>('');

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // Only allow numbers
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

            // Step 1: Create order on backend
            const orderData = await createPaymentOrder(numAmount);

            // Step 2: Open Razorpay checkout
            openRazorpayCheckout(
                orderData,
                // Success handler
                async (response) => {
                    try {
                        // Step 3: Verify payment on backend
                        const verifyData = {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            transactionId: response.transactionId,
                        };

                        const result = await verifyPayment(verifyData);

                        // Show success message
                        toast.success('Payment Successful', {
                            description: `${result.message}. New Balance: ₹${result.newBalance.toLocaleString('en-IN')}`,
                        });

                        setLoading(false);
                        onSuccess(); // Refresh parent component
                        onClose();
                    } catch (verifyError: any) {
                        setLoading(false);
                        setError(verifyError.response?.data?.error || 'Payment verification failed');
                    }
                },
                // Failure handler
                (error) => {
                    setLoading(false);
                    setError(error.error || 'Payment failed. Please try again.');
                }
            );
        } catch (err: any) {
            setLoading(false);
            setError(err.response?.data?.error || 'Failed to create payment order');
        }
    };

    const quickAmounts = [1000, 2000, 5000, 10000];

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <div className="modal-title-container">
                        <Wallet className="modal-icon" />
                        <h2>Add Balance</h2>
                    </div>
                    <button className="modal-close-btn" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <div className="modal-body">
                    {/* Amount Input */}
                    <div className="form-group">
                        <label>Amount (₹)</label>
                        <input
                            type="text"
                            placeholder={`Enter amount (Min: ${MIN_AMOUNT}, Max: ${MAX_AMOUNT.toLocaleString('en-IN')})`}
                            value={amount}
                            onChange={handleAmountChange}
                            disabled={loading}
                            className="form-input"
                            autoFocus
                        />
                    </div>

                    {/* Quick Amount Buttons */}
                    <div className="quick-amounts">
                        <p className="quick-amounts-label">Quick amounts:</p>
                        <div className="quick-amounts-grid">
                            {quickAmounts.map((quickAmount) => (
                                <button
                                    key={quickAmount}
                                    type="button"
                                    className={`quick-amount-btn ${amount === quickAmount.toString() ? 'active' : ''}`}
                                    onClick={() => {
                                        setAmount(quickAmount.toString());
                                        setError('');
                                    }}
                                    disabled={loading}
                                >
                                    ₹{quickAmount.toLocaleString('en-IN')}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="alert alert-error">
                            <AlertCircle size={18} />
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Info Box */}
                    <div className="alert alert-info">
                        <CheckCircle size={18} />
                        <span>
                            Secure payment powered by Razorpay. Amount will be instantly credited to your wallet.
                        </span>
                    </div>
                </div>

                <div className="modal-footer">
                    <button className="btn btn-secondary" onClick={onClose} disabled={loading}>
                        Cancel
                    </button>
                    <button
                        className="btn btn-primary"
                        onClick={handlePayment}
                        disabled={loading || !amount}
                    >
                        {loading ? 'Processing...' : `Pay ₹${amount ? parseInt(amount).toLocaleString('en-IN') : '0'}`}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddBalanceModal;

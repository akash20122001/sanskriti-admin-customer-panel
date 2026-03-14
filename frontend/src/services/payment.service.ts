import apiClient from '@/lib/axios';

export interface CreateOrderResponse {
    orderId: string;
    amount: number;
    currency: string;
    transactionId: string;
    keyId: string;
}

export interface VerifyPaymentRequest {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
    transactionId: string;
}

export interface VerifyPaymentResponse {
    success: boolean;
    transaction: {
        transactionId: string;
        amount: number;
        status: string;
    };
    newBalance: number;
    message: string;
}

/**
 * Create Razorpay order for wallet top-up
 */
export const createPaymentOrder = async (amount: number): Promise<CreateOrderResponse> => {
    const { data } = await apiClient.post('/payment/create-order', { amount });
    return data.data;
};

/**
 * Verify payment after user completes payment
 */
export const verifyPayment = async (paymentData: VerifyPaymentRequest): Promise<VerifyPaymentResponse> => {
    const { data } = await apiClient.post('/payment/verify', paymentData);
    return data.data;
};

/**
 * Open Razorpay checkout
 */
export const openRazorpayCheckout = (
    orderData: CreateOrderResponse,
    onSuccess: (response: any) => void,
    onFailure: (error: any) => void
): void => {
    const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Sanskriti',
        description: 'Wallet Top-up',
        order_id: orderData.orderId,
        handler: function (response: any) {
            onSuccess({
                ...response,
                transactionId: orderData.transactionId,
            });
        },
        prefill: {
            name: localStorage.getItem('userName') || '',
        },
        theme: {
            color: '#3399cc',
        },
        modal: {
            ondismiss: function () {
                onFailure({ error: 'Payment cancelled by user' });
            },
        },
    };

    // @ts-ignore - Razorpay is loaded via script tag
    const razorpay = new window.Razorpay(options);
    razorpay.open();
};

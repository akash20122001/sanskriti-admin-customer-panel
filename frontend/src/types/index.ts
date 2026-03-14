// User Types
export type UserRole = 'ADMIN' | 'CUSTOMER';

export interface User {
    id: string;
    userId: string;
    name: string;
    role: UserRole;
    walletBalance: number;
    isActive: boolean;
    // Company Details (optional)
    company?: string;
    email?: string;
    phone?: string;
    companyAddress?: string;
    state?: string;
    pin?: string;
    gst?: string;
    createdAt: string;
    updatedAt: string;
}

// Auth Types
export interface LoginCredentials {
    userId: string;
    password: string;
}

export interface AuthResponse {
    user: User;
    accessToken: string;
    refreshToken: string;
}

// Order Types
export type Currency = 'USD' | 'INR';
export type Platform = string; // Dynamic platforms from settings
export type OrderStatus = 'IN_PROGRESS' | 'SHIPPED' | 'RTO';

export interface Order {
    id: string;
    orderId: string;
    userId: string;
    skuId: string;
    price: number;
    currency: Currency;
    platform: string;
    status: OrderStatus;
    deliveryPartner?: string;
    trackingId?: string;
    orderDate: string;
    createdAt: string;
    updatedAt: string;
}

// Transaction Types
export type TransactionType = 'CREDIT' | 'DEBIT';
export type TransactionStatus = 'PENDING' | 'SUCCESS' | 'FAILED';

export interface Transaction {
    id: string;
    transactionId: string;
    userId: string;
    type: TransactionType;
    amount: number;
    status: TransactionStatus;         // was missing — used in admin & customer Transactions page
    paymentMethod: string;             // was missing — used in admin Transactions page
    balanceAfter: number;
    description: string | null;        // nullable — backend can return null
    orderId?: string;
    createdAt: string;
    // Populated only in admin view (joined from user table)
    user?: {
        userId: string;
        name: string;
        role: string;
    };
}

// Bill/Invoice Types
export interface Bill {
    id: string;
    userId: string;
    transactionId: string;
    invoiceNumber?: string;
    transactionDate: string;

    // Company Details
    company: string;
    email: string;
    phone: string;
    companyAddress: string;
    state: string;
    pin: string;
    gst: string;

    // Payment
    paymentMode: string;

    // Product Details
    productName: string;
    skuId: string;
    quantity: number;
    price: number;
    currency: Currency;
    shippingCharge: number;
    packagingCharge: number;
    taxPercent: number;

    // Calculated
    payableAmount: number;

    // Invoice
    invoiceUrl: string | null;

    // Timestamps
    createdAt: string;
    updatedAt: string;
}

// Dashboard Types
export interface AdminDashboardStats {
    stats: {
        totalUsers: number;
        activeUsers: number;
        totalTransactions: number;
        totalRevenue: number;
    };
    recentActivity: {
        id: string;
        type: string;
        message: string;
        date: string;
        status: string;
    }[];
}

// Renamed from DashboardStats to be specific — kept for backward compat
export interface DashboardStats {
    totalUsers: number;
    totalOrders: number;
    totalWalletBalance: number;
    totalRevenue: number;
}

// NEW: Customer-specific dashboard summary
export interface CustomerDashboardStats {
    walletBalance: number;
    totalTransactions: number;
    totalOrders: number;
    totalBills: number;
}

// API Response Types
export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

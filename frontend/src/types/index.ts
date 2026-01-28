// User Types
export type UserRole = 'ADMIN' | 'CUSTOMER';

export interface User {
    id: string;
    userId: string;
    name: string;
    role: UserRole;
    walletBalance: number;
    isActive: boolean;
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
export type Platform = 'Amazon' | 'Flipkart' | 'Meesho' | 'Etsy';

export interface Order {
    id: string;
    orderId: string;
    userId: string;
    skuId: string;
    price: number;
    currency: Currency;
    platform: Platform;
    createdAt: string;
    updatedAt: string;
}

// Transaction Types
export type TransactionType = 'CREDIT' | 'DEBIT';

export interface Transaction {
    id: string;
    transactionId: string;
    userId: string;
    userName?: string;
    type: TransactionType;
    amount: number;
    balanceAfter: number;
    description: string;
    orderId?: string;
    createdAt: string;
}

// Bill Types
export type BillStatus = 'PENDING' | 'PAID' | 'OVERDUE';

export interface Bill {
    id: string;
    billNumber: string;
    userId: string;
    userName?: string;
    orderId: string;
    amount: number;
    status: BillStatus;
    dueDate: string;
    createdAt: string;
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

// Dashboard Stats
export interface DashboardStats {
    totalUsers: number;
    totalOrders: number;
    totalWalletBalance: number;
    totalRevenue: number;
}

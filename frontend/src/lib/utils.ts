import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind CSS classes with proper precedence
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Format currency in INR
 */
export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 2,
    }).format(amount);
}

/**
 * Format date to readable string
 */
export function formatDate(date: string | Date): string {
    return new Intl.DateTimeFormat('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    }).format(new Date(date));
}

/**
 * Format date with time
 */
export function formatDateTime(date: string | Date): string {
    return new Intl.DateTimeFormat('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(new Date(date));
}

/**
 * Capitalize first letter of string
 */
export function capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Get the currency symbol for a given currency code.
 * Centralises the `order.currency === 'INR' ? '₹' : '$'` pattern
 * that was copy-pasted across 5 page files.
 */
export function getCurrencySymbol(currency: string): string {
    return currency === 'USD' ? '$' : '₹';
}

/**
 * Format an amount with its currency symbol.
 * Replaces the manual `₹${amount.toFixed(2)}` pattern across all pages.
 */
export function formatAmount(amount: number, currency = 'INR'): string {
    return `${getCurrencySymbol(currency)}${amount.toFixed(2)}`;
}

/**
 * Tailwind class maps for status/type badge colours.
 * Previously these were inline ternaries or local getStatusColor() functions
 * duplicated across admin/Orders, admin/Transactions, customer/Transactions,
 * admin/Dashboard — now all pages import from here.
 */
export const STATUS_COLORS: Record<string, string> = {
    // Order statuses
    IN_PROGRESS: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    SHIPPED: 'bg-green-100  text-green-800  dark:bg-green-900/30  dark:text-green-400',
    RTO: 'bg-red-100    text-red-800    dark:bg-red-900/30    dark:text-red-400',
    // Transaction statuses
    SUCCESS: 'bg-green-100  text-green-800  dark:bg-green-900/30  dark:text-green-400',
    FAILED: 'bg-red-100    text-red-800    dark:bg-red-900/30    dark:text-red-400',
    PENDING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    // Transaction types
    CREDIT: 'bg-green-100  text-green-800  dark:bg-green-900/30  dark:text-green-400',
    DEBIT: 'bg-blue-100   text-blue-800   dark:bg-blue-900/30   dark:text-blue-400',
};

/**
 * Tailwind class map for platform badge colours.
 * Previously a local getPlatformColor() function in admin/Orders.tsx.
 */
export const PLATFORM_COLORS: Record<string, string> = {
    Amazon: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
    Flipkart: 'bg-blue-100   text-blue-800   dark:bg-blue-900/30   dark:text-blue-400',
    Meesho: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
    Etsy: 'bg-pink-100   text-pink-800   dark:bg-pink-900/30   dark:text-pink-400',
};

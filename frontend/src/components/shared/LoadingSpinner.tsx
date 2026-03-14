/**
 * LoadingSpinner — replaces the identical "animate-spin" block copy-pasted
 * in Dashboard (admin + customer), Orders, Bills, Transactions, AddBalance, Profile.
 *
 * Usage:
 *   <LoadingSpinner />                    — full-height centred spinner
 *   <LoadingSpinner message="Loading..." />  — with custom label
 *   <LoadingSpinner size="sm" />          — small inline spinner
 */
interface LoadingSpinnerProps {
    message?: string;
    size?: 'sm' | 'md' | 'lg';
    /** Fill the parent's full height (default: true) */
    fullHeight?: boolean;
}

const sizeMap = {
    sm: 'h-6 w-6 border-2',
    md: 'h-10 w-10 border-2',
    lg: 'h-14 w-14 border-4',
};

export function LoadingSpinner({
    message = 'Loading...',
    size = 'lg',
    fullHeight = true,
}: LoadingSpinnerProps) {
    return (
        <div
            className={`flex items-center justify-center ${fullHeight ? 'h-full min-h-[200px]' : ''}`}
        >
            <div className="text-center">
                <div
                    className={`animate-spin rounded-full border-b-2 border-primary mx-auto ${sizeMap[size]}`}
                />
                {message && (
                    <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">{message}</p>
                )}
            </div>
        </div>
    );
}

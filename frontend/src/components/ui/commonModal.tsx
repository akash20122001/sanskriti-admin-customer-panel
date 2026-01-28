import { type ReactNode } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

interface CommonModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    description?: string;
    children: ReactNode;
    footer?: ReactNode;
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

const maxWidthClasses = {
    sm: 'sm:max-w-[500px]',
    md: 'sm:max-w-[600px]',
    lg: 'sm:max-w-[700px]',
    xl: 'sm:max-w-[800px]',
    '2xl': 'sm:max-w-[900px]',
};

export function CommonModal({
    isOpen,
    onClose,
    title,
    description,
    children,
    footer,
    maxWidth = 'lg',
}: CommonModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent
                className={`${maxWidthClasses[maxWidth]} max-h-[90vh] overflow-hidden bg-white dark:bg-dark-bg-secondary flex flex-col p-0`}
            >
                {/* Sticky Header */}
                <div className="sticky top-0 bg-white dark:bg-dark-bg-secondary border-b border-gray-200 dark:border-gray-700 px-6 py-4 z-10">
                    <DialogHeader>
                        <DialogTitle className="text-gray-900 dark:text-gray-100">
                            {title}
                        </DialogTitle>
                        {description && (
                            <DialogDescription className="text-gray-600 dark:text-gray-400">
                                {description}
                            </DialogDescription>
                        )}
                    </DialogHeader>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto px-6 py-4">
                    {children}
                </div>

                {/* Sticky Footer */}
                {footer && (
                    <div className="sticky bottom-0 bg-white dark:bg-dark-bg-secondary border-t border-gray-200 dark:border-gray-700 px-6 py-4 z-10">
                        {footer}
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}

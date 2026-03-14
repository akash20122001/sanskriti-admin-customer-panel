import type { ReactNode } from 'react';

/**
 * FormSection — a labelled group divider used inside multi-section forms.
 *
 * BillModal had this exact <h3> + border-b pattern repeated 3 times
 * for "Customer Information", "Product Details", and "Charges".
 *
 * Usage:
 *   <FormSection title="Customer Information">
 *     <FormField ... />
 *     <FormField ... />
 *   </FormSection>
 */
interface FormSectionProps {
    title: string;
    children: ReactNode;
}

export function FormSection({ title, children }: FormSectionProps) {
    return (
        <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-600 pb-2">
                {title}
            </h3>
            {children}
        </div>
    );
}

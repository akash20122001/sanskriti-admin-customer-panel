import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';

/**
 * ModalFooter — the Cancel + Submit button row used at the bottom of every
 * form modal. Previously this exact JSX block was copy-pasted verbatim
 * into UserModal, OrderModal, and BillModal.
 *
 * It also centralises the "Creating... / Updating..." loading label logic
 * that was duplicated inside each modal's submit button.
 *
 * Usage:
 *   <ModalFooter
 *     formId="user-form"
 *     isEditMode={!!selectedUser}
 *     isSubmitting={form.formState.isSubmitting}
 *     onCancel={handleClose}
 *     createLabel="Create User"
 *     updateLabel="Update User"
 *   />
 */
interface ModalFooterProps {
    formId: string;
    isEditMode: boolean;
    isSubmitting: boolean;
    onCancel: () => void;
    createLabel?: string;
    updateLabel?: string;
}

export function ModalFooter({
    formId,
    isEditMode,
    isSubmitting,
    onCancel,
    createLabel = 'Create',
    updateLabel = 'Update',
}: ModalFooterProps) {
    return (
        <DialogFooter>
            <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isSubmitting}
                className="bg-white dark:bg-dark-bg-tertiary text-gray-700 dark:text-gray-300"
            >
                Cancel
            </Button>
            <Button
                type="submit"
                form={formId}
                disabled={isSubmitting}
                className="bg-primary hover:bg-primary/90 text-white"
            >
                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                {isSubmitting
                    ? (isEditMode ? 'Updating...' : 'Creating...')
                    : (isEditMode ? updateLabel : createLabel)}
            </Button>
        </DialogFooter>
    );
}

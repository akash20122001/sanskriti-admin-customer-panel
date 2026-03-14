import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

/**
 * ConfirmDialog — a proper modal confirmation that replaces window.confirm().
 *
 * window.confirm() blocks the JS thread, can't be styled, and looks terrible
 * on mobile. This uses your existing shadcn Dialog component instead.
 *
 * Currently needed in: admin/Users.tsx (delete user confirmation)
 *
 * Usage:
 *   const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
 *
 *   <ConfirmDialog
 *     open={!!deleteTarget}
 *     title="Delete User"
 *     description={`Delete "${deleteTarget?.name}"? This cannot be undone.`}
 *     onConfirm={() => { deleteUser(deleteTarget!.id); setDeleteTarget(null); }}
 *     onCancel={() => setDeleteTarget(null)}
 *   />
 */
interface ConfirmDialogProps {
    open: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
    onCancel: () => void;
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: 'destructive' | 'default';
    isConfirming?: boolean;
}

export function ConfirmDialog({
    open,
    title,
    description,
    onConfirm,
    onCancel,
    confirmLabel = 'Delete',
    cancelLabel = 'Cancel',
    variant = 'destructive',
    isConfirming = false,
}: ConfirmDialogProps) {
    return (
        <Dialog open={open} onOpenChange={(v) => !v && onCancel()}>
            <DialogContent className="sm:max-w-[400px]">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={onCancel} disabled={isConfirming}>
                        {cancelLabel}
                    </Button>
                    <Button variant={variant} onClick={onConfirm} disabled={isConfirming}>
                        {confirmLabel}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

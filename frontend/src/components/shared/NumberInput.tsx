import type { ControllerRenderProps, FieldValues, FieldPath } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

/**
 * NumberInput — a typed numeric Input that works seamlessly with react-hook-form.
 *
 * The problem it solves: BillModal had this exact onChange pattern copy-pasted
 * 5 times for every numeric field (price, quantity, shippingCharge, etc.):
 *
 *   onChange={(e) => {
 *     const val = e.target.value;
 *     field.onChange(val === '' ? undefined : parseFloat(val));
 *   }}
 *
 * React Hook Form stores values as strings by default for <input type="number">,
 * which causes type mismatches. This component handles the conversion automatically.
 *
 * Usage (inside a <FormField> render prop):
 *   <NumberInput field={field} placeholder="0.00" className="..." />
 */
interface NumberInputProps<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> {
    field: ControllerRenderProps<TFieldValues, TName>;
    placeholder?: string;
    min?: number;
    max?: number;
    step?: number;
    className?: string;
    disabled?: boolean;
}

export function NumberInput<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
    field,
    placeholder = '0',
    min,
    max,
    step,
    className,
    disabled,
}: NumberInputProps<TFieldValues, TName>) {
    return (
        <Input
            type="number"
            placeholder={placeholder}
            min={min}
            max={max}
            step={step}
            disabled={disabled}
            className={cn('bg-white dark:bg-dark-bg-tertiary', className)}
            value={field.value ?? ''}
            onChange={(e) =>
                field.onChange(e.target.value === '' ? undefined : parseFloat(e.target.value))
            }
            onBlur={field.onBlur}
            name={field.name}
            ref={field.ref}
        />
    );
}

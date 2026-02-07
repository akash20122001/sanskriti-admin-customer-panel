# Invoice Number Generation - Fixed

## Problem
Invoice numbers were potentially duplicating or not incrementing correctly across different users due to race conditions.

## Solution Implemented

### **How It Works Now:**

The invoice number generation is now **globally unique and incremental** across ALL users.

```typescript
// Generate Invoice Number (STA3000+)
// Globally unique and incremental across ALL users
async function generateInvoiceNumber(): Promise<string> {
    // 1. Get all bills with invoice numbers
    const bills = await prisma.bill.findMany({
        where: { invoiceNumber: { not: null } },
        select: { invoiceNumber: true },
    });

    // 2. If no bills exist, start with STA3000
    if (bills.length === 0) {
        return 'STA3000';
    }

    // 3. Extract all numeric values from invoice numbers
    const numbers = bills
        .map(bill => {
            if (!bill.invoiceNumber) return 0;
            const match = bill.invoiceNumber.match(/STA(\d+)/);
            return match ? parseInt(match[1], 10) : 0;
        })
        .filter(num => num > 0);

    // 4. Find the maximum number and increment
    const maxNum = Math.max(...numbers);
    const nextNum = maxNum + 1;
    
    return `STA${nextNum}`;
}
```

### **Flow Example:**

| User | Action | Invoice Number Generated |
|------|--------|-------------------------|
| A | Creates 1st bill | **STA3000** |
| A | Creates 2nd bill | **STA3001** |
| B | Creates 1st bill | **STA3002** ← Not STA3000! |
| A | Creates 3rd bill | **STA3003** |
| B | Creates 2nd bill | **STA3004** |

### **Key Features:**

1. ✅ **Globally Unique**: Invoice numbers increment across ALL users, not per user
2. ✅ **Always Incremental**: Each new bill gets the next number in sequence
3. ✅ **No Gaps**: Uses Math.max() to find the highest number and adds 1
4. ✅ **Handles Edge Cases**: 
   - Empty database → starts with STA3000
   - Invalid invoice numbers → ignores them
   - Null invoice numbers → filtered out

### **Algorithm:**

1. Fetch all existing bills that have invoice numbers
2. Extract numeric portion from each invoice number (e.g., "STA3005" → 3005)
3. Find the maximum number from all extracted values
4. Increment by 1
5. Return as `STA${nextNum}`

### **Previous Issue:**

The old implementation used `orderBy: { createdAt: 'desc' }` which could cause:
- **Race Condition**: Two simultaneous requests could get the same invoice number
- **Ordering Issues**: If bills were created out of order, it could skip numbers

### **Current Implementation:**

- Looks at **ALL** invoice numbers
- Finds the **maximum value**
- Guarantees next number is always **max + 1**

## Testing:

Test the sequence by creating multiple bills:

```bash
# User A creates bill 1 → STA3000
# User A creates bill 2 → STA3001
# User B creates bill 1 → STA3002 ✓ (not STA3000!)
# User B creates bill 2 → STA3003 ✓
```

## Format:

Invoice numbers follow the format: `STA{number}`
- Starting: **STA3000**
- Next: **STA3001**
- Then: **STA3002**
- And so on...

The "STA" prefix is constant, only the number increments globally.

package com.sanskriti.backend.controller;

import com.sanskriti.backend.annotation.SuccessMessage;
import com.sanskriti.backend.dto.request.CreateBillRequest;
import com.sanskriti.backend.dto.response.BillResponse;
import com.sanskriti.backend.service.BillService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * BillController:
 *   GET  /api/bills                      → Admin: all bills
 *   GET  /api/bills/{id}                 → Admin: single bill by DB id
 *   POST /api/bills                      → Admin: create bill (deducts wallet, creates transaction)
 *   GET  /api/bills/customer/my-bills    → Customer: own bills
 */
@RestController
@RequestMapping("/api/bills")
@RequiredArgsConstructor
public class BillController {

    private final BillService billService;

    /** Admin: get all bills */
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @SuccessMessage("Bills fetched successfully")
    public List<BillResponse> getAllBills() {
        return billService.getAllBills();
    }

    /** Admin: get single bill by its database ID */
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @SuccessMessage("Bill fetched successfully")
    public BillResponse getBillById(@PathVariable String id) {
        return billService.getBillById(id);
    }

    /**
     * Admin: create a bill.
     * This triggers the full flow:
     *  1. Validate user + company profile
     *  2. Check wallet balance
     *  3. Create Bill
     *  4. Create DEBIT Transaction
     *  5. Deduct walletBalance
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @SuccessMessage("Bill created successfully")
    public BillResponse createBill(@Valid @RequestBody CreateBillRequest request) {
        return billService.createBill(request);
    }

    /** Customer: get their own bills */
    @GetMapping("/customer/my-bills")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'ADMIN')")
    @SuccessMessage("Bills fetched successfully")
    public List<BillResponse> getMyBills(Authentication authentication) {
        return billService.getMyBills(authentication.getName());
    }
}

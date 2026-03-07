package com.sanskriti.backend.service;

import com.sanskriti.backend.dto.request.CreateBillRequest;
import com.sanskriti.backend.dto.response.BillResponse;

import java.util.List;

public interface BillService {

    // Admin: get all bills
    List<BillResponse> getAllBills();

    // Admin: get single bill by its DB id
    BillResponse getBillById(String id);

    // Admin: create bill → auto-creates transaction + deducts user wallet
    BillResponse createBill(CreateBillRequest request);

    // Customer: own bills
    List<BillResponse> getMyBills(String userId);
}

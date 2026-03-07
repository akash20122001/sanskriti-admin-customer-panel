package com.sanskriti.backend.repository;

import com.sanskriti.backend.entity.Bill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BillRepository extends JpaRepository<Bill, String> {

    List<Bill> findAllByOrderByCreatedAtDesc();

    List<Bill> findByUserIdOrderByCreatedAtDesc(String userId);

    Optional<Bill> findByTransactionId(String transactionId);

    Optional<Bill> findTopByInvoiceNumberIsNotNullOrderByInvoiceNumberDesc();
}

package com.sanskriti.backend.repository;

import com.sanskriti.backend.entity.Transaction;
import com.sanskriti.backend.enums.TransactionStatus;
import com.sanskriti.backend.enums.TransactionType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, String> {

    List<Transaction> findAllByOrderByCreatedAtDesc();

    List<Transaction> findByUserIdOrderByCreatedAtDesc(String userId);

    Optional<Transaction> findByTransactionId(String transactionId);

    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t WHERE t.type = :type AND t.status = :status")
    Double sumAmountByTypeAndStatus(TransactionType type, TransactionStatus status);
}

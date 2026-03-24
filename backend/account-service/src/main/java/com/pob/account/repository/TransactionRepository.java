package com.pob.account.repository;

import com.pob.account.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    // This finds all history for one specific account
    List<Transaction> findByAccountIdOrderByTimestampDesc(Long accountId);
}
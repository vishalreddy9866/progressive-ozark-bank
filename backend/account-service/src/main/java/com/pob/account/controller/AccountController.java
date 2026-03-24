package com.pob.account.controller;

import com.pob.account.model.Account;
import com.pob.account.service.AccountService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.pob.account.model.Transaction;
import com.pob.account.repository.TransactionRepository;

@RestController
@RequestMapping("/api/accounts")
public class AccountController {

    private final AccountService accountService;
    private final TransactionRepository transactionRepository; // Inject this

    public AccountController(AccountService accountService, TransactionRepository transactionRepository) {
        this.accountService = accountService;
        this.transactionRepository = transactionRepository;
    }

    // API to create an account (Onboarding)
    @PostMapping
    public ResponseEntity<Account> createAccount(@RequestBody Account account) {
    // Basic validation: Ensure account number isn't null
        if (account.getAccountNumber() == null) {
            return ResponseEntity.badRequest().build();
        }
        Account savedAccount = accountService.createAccount(account);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedAccount);
    }

   
    @GetMapping
    // By adding 'Pageable pageable', Java will now "listen" to the &sort=id,desc from React
    public Page<Account> getAllAccounts(Pageable pageable) {
        return accountService.getAllAccounts(pageable);
    }

    // API to fetch a specific account by number
    @GetMapping("/{accountNumber}")
    public ResponseEntity<Account> getAccount(@PathVariable String accountNumber) {
        return accountService.getAccountByNumber(accountNumber)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAccount(@PathVariable Long id) {
        accountService.deleteAccount(id);
        return ResponseEntity.noContent().build(); 
    }


    // UPDATE: The "Pencil" logic
@PutMapping("/{id}")
public ResponseEntity<Account> updateAccount(@PathVariable Long id, @RequestBody Account details) {
    return ResponseEntity.ok(accountService.updateAccount(id, details));
}

@GetMapping("/{id}/transactions")
    public ResponseEntity<List<Transaction>> getTransactions(@PathVariable Long id) {
        // REAL DATA: Fetching from MariaDB/MySQL instead of hardcoding
        List<Transaction> history = transactionRepository.findByAccountIdOrderByTimestampDesc(id);
        return ResponseEntity.ok(history);
    }
}

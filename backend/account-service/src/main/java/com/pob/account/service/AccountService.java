package com.pob.account.service;

import com.pob.account.model.Account;
import com.pob.account.repository.AccountRepository;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import java.util.Optional;
import org.springframework.data.domain.Pageable;


@Service
public class AccountService {

    private final AccountRepository accountRepository;

    public AccountService(AccountRepository accountRepository) {
        this.accountRepository = accountRepository;
    }

    // Creating a new account (Onboarding workflow)
    public Account createAccount(Account account) {
        return accountRepository.save(account);
    }

    // Fetching account with Pagination (To handle 1M+ records efficiently)
    public Page<Account> getAllAccounts(Pageable pageable) {
        return accountRepository.findAll(pageable);
    }

    public Optional<Account> getAccountByNumber(String accountNumber) {
        return accountRepository.findByAccountNumber(accountNumber);
    }
}
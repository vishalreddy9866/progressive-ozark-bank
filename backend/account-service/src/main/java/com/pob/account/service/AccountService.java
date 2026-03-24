package com.pob.account.service;

import com.pob.account.model.Transaction;
import com.pob.account.model.Account;
import com.pob.account.repository.AccountRepository;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import java.util.Optional;
import org.springframework.data.domain.Pageable;
import com.pob.account.repository.TransactionRepository;
import org.springframework.transaction.annotation.Transactional;


@Service
public class AccountService {

    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;

    // Updated Constructor to include the Transaction Repository
    public AccountService(AccountRepository accountRepository, TransactionRepository transactionRepository) {
        this.accountRepository = accountRepository;
        this.transactionRepository = transactionRepository;
    }

    @Transactional // This ensures if the transaction fails, the account isn't created (All or Nothing)
    public Account createAccount(Account account) {
        // 1. Save the account first to generate an ID
        Account savedAccount = accountRepository.save(account);
        
        // 2. Create the "Welcome" transaction record
        Transaction welcome = new Transaction();
        welcome.setAccountId(savedAccount.getId());
        welcome.setDescription("Initial Deposit - Welcome Bonus");
        welcome.setAmount(savedAccount.getBalance());
        welcome.setType("CREDIT");
        
        // 3. Save the transaction to the database
        transactionRepository.save(welcome);

        return savedAccount;
    }


    @Transactional
public void transferMoney(Long fromAccountId, Long toAccountId, Double amount) {
    // 1. Fetch both accounts
    Account fromAccount = accountRepository.findById(fromAccountId)
            .orElseThrow(() -> new RuntimeException("Source account not found"));
    Account toAccount = accountRepository.findById(toAccountId)
            .orElseThrow(() -> new RuntimeException("Destination account not found"));

    // 2. Validation: Check if candidate has enough money!
    if (fromAccount.getBalance() < amount) {
        throw new RuntimeException("Insufficient funds for transfer");
    }

    // 3. Perform the Math
    fromAccount.setBalance(fromAccount.getBalance() - amount);
    toAccount.setBalance(toAccount.getBalance() + amount);

    // 4. Save updated balances
    accountRepository.save(fromAccount);
    accountRepository.save(toAccount);

    // 5. Create Audit Trail (Transaction Records)
    Transaction debit = new Transaction();
    debit.setAccountId(fromAccountId);
    debit.setDescription("Transfer to " + toAccount.getAccountHolderName());
    debit.setAmount(amount);
    debit.setType("DEBIT");
    transactionRepository.save(debit);

    Transaction credit = new Transaction();
    credit.setAccountId(toAccountId);
    credit.setDescription("Transfer from " + fromAccount.getAccountHolderName());
    credit.setAmount(amount);
    credit.setType("CREDIT");
    transactionRepository.save(credit);
}

    // Fetching account with Pagination (To handle 1M+ records efficiently)
    public Page<Account> getAllAccounts(Pageable pageable) {
        return accountRepository.findAll(pageable);
    }

    public Optional<Account> getAccountByNumber(String accountNumber) {
        return accountRepository.findByAccountNumber(accountNumber);
    }

    public void deleteAccount(Long id) {
        accountRepository.deleteById(id);
    }


    public Account updateAccount(Long id, Account details) {
        Account acc = accountRepository.findById(id).orElseThrow();
        acc.setAccountHolderName(details.getAccountHolderName());
        return accountRepository.save(acc);
    }
}
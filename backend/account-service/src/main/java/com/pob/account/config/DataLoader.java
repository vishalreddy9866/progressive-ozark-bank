package com.pob.account.config;

import com.pob.account.model.Account;
import com.pob.account.repository.AccountRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import java.util.UUID;

@Configuration
public class DataLoader {

    @Bean
    CommandLineRunner initDatabase(AccountRepository repository) {
        return args -> {
            // Generating 50 random records for initial testing
            for (int i = 0; i < 50; i++) {
                Account acc = new Account();
                acc.setAccountNumber("POB-" + UUID.randomUUID().toString().substring(0, 8));
                acc.setAccountType(i % 2 == 0 ? "SAVINGS" : "CHECKING");
                acc.setBalance(Math.random() * 10000);
                acc.setStatus("ACTIVE");
                repository.save(acc);
            }
            System.out.println("Sample Banking Data Initialized!");
        };
    }
}
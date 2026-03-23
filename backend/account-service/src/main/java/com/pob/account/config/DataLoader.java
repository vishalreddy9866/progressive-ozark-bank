package com.pob.account.config;

import com.pob.account.model.Account;
import com.pob.account.repository.AccountRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import java.util.UUID;
import java.util.Random;

@Configuration
public class DataLoader {

    @Bean
    CommandLineRunner initDatabase(AccountRepository repository) {
        return args -> {
            String[] names = {"James Smith", "Maria Garcia", "Robert Johnson", "Maria Rodriguez", "David Martinez", "Mary Hernandez", "Chris Brown", "Linda Lopez"};
            Random random = new Random();

            // Generating 200 random records for High-Performance testing
            for (int i = 1; i <= 200; i++) {
                Account acc = new Account();
                acc.setAccountNumber("POB-" + UUID.randomUUID().toString().substring(0, 8));
                
                // NEW: This now maps to your updated Account.java model
                String randomName = names[random.nextInt(names.length)] + " " + i;
                acc.setAccountHolderName(randomName);
                
                acc.setAccountType(i % 2 == 0 ? "SAVINGS" : "CHECKING");
                acc.setBalance(1000.0 + (random.nextDouble() * 50000.0));
                acc.setStatus("ACTIVE");
                
                repository.save(acc);
            }
            System.out.println(">>> 200 Sample Banking Records Initialized Successfully!");
        };
    }
}
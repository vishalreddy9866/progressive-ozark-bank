package com.pob.account.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "accounts")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Account {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String accountNumber;

    // ADD THIS LINE HERE:
    private String accountHolderName; 

    private String accountType; // SAVINGS, CHECKING
    private Double balance;
    private String status; // ACTIVE, PENDING
}
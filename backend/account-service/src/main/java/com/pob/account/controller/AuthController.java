package com.pob.account.controller;

import com.pob.account.dto.JwtResponse;
import com.pob.account.dto.LoginRequest;
import com.pob.account.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins ={ "http://localhost:5173","http://localhost:5174"})
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    JwtUtils jwtUtils;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
      
        System.out.println(">>> [CONNECTION SUCCESS] React just called the Login API! <<<");
        // In a real app, you'd verify the password against the DB here.
        // For now, we'll generate a token if the user is "admin"
        if ("admin".equals(loginRequest.getUsername()) && "password".equals(loginRequest.getPassword())) {
            String jwt = jwtUtils.generateTokenFromUsername(loginRequest.getUsername());
            return ResponseEntity.ok(new JwtResponse(jwt, "Bearer", loginRequest.getUsername()));
        }
        return ResponseEntity.status(401).body("Error: Invalid username or password");
    }
}
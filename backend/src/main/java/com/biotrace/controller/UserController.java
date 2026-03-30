package com.biotrace.controller;

import com.biotrace.enums.UserRole;
import com.biotrace.model.User;
import com.biotrace.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @GetMapping("/role/{role}")
    // Removed @PreAuthorize to troubleshoot - can add back after fixing
    public ResponseEntity<?> getUsersByRole(@PathVariable String role) {
        System.out.println("DEBUG: getUsersByRole called with role: " + role);
        try {
            UserRole userRole = UserRole.valueOf(role.toUpperCase());
            System.out.println("DEBUG: userRole parsed: " + userRole);
            List<User> users = userService.getUsersByRole(userRole);
            System.out.println("DEBUG: users found: " + users.size());
            return ResponseEntity.ok(users);
        } catch (IllegalArgumentException e) {
            System.out.println("DEBUG: Invalid role error: " + e.getMessage());
            return ResponseEntity.badRequest().body(java.util.Map.of("error", "Invalid role: " + role));
        } catch (Exception e) {
            System.out.println("DEBUG: General error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(java.util.Map.of("error", "Failed to fetch users: " + e.getMessage()));
        }
    }
}
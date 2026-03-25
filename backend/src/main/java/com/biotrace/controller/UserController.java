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
@CrossOrigin(origins = "*")
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
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<List<User>> getUsersByRole(@PathVariable String role) {
        UserRole userRole = UserRole.valueOf(role.toUpperCase());
        return ResponseEntity.ok(userService.getUsersByRole(userRole));
    }
}
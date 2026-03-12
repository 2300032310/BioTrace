package com.biotrace.service;

import com.biotrace.enums.UserRole;
import com.biotrace.exception.ResourceNotFoundException;
import com.biotrace.model.User;
import com.biotrace.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    public List<User> getUsersByRole(UserRole role) {
        return userRepository.findByRole(role);
    }

    public List<User> getUsersByHospitalId(Long hospitalId) {
        return userRepository.findByHospitalId(hospitalId);
    }
}
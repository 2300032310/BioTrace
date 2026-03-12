package com.biotrace.repository;

import com.biotrace.model.User;
import com.biotrace.enums.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    List<User> findByRole(UserRole role);

    List<User> findByHospitalId(Long hospitalId);

    boolean existsByEmail(String email);
}

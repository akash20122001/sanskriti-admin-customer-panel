package com.sanskriti.backend.repository;

import com.sanskriti.backend.entity.User;
import com.sanskriti.backend.enums.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {

    Optional<User> findByUserId(String userId);

    List<User> findByRoleOrderByCreatedAtDesc(Role role);

    boolean existsByUserId(String userId);

    long countByRole(Role role);

    long countByRoleAndIsActive(Role role, Boolean isActive);
}

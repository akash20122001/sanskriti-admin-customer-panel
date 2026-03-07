package com.sanskriti.backend.service.impl;

import com.sanskriti.backend.dto.request.CreateUserRequest;
import com.sanskriti.backend.dto.request.UpdateUserRequest;
import com.sanskriti.backend.dto.response.UserResponse;
import com.sanskriti.backend.entity.User;

import com.sanskriti.backend.exception.ApiException;
import com.sanskriti.backend.repository.UserRepository;
import com.sanskriti.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * UserServiceImpl — the actual implementation of UserService.
 *
 * 🎓 Key Concepts in this file:
 *
 * @Service
 *   Marks this as a Spring-managed bean (like a singleton).
 *   Spring will automatically create an instance and inject it wherever UserService is needed.
 *
 * @Transactional — when do we actually need it?
 *
 *   Rule of thumb: Use it only when a method performs MULTIPLE DB operations
 *   that must succeed or fail together (like prisma.$transaction).
 *
 *   Reads (getAllUsers, getUserById):
 *   → Single DB query each — NOT annotated. No transaction needed.
 *   → readOnly=true gives a tiny Hibernate optimization (skips dirty-checking)
 *     but for simple lookups like these, the gain is negligible.
 *
 *   Writes (createUser, updateUser, deleteUser):
 *   → createUser:  existsByUserId check + save = 2 ops → @Transactional
 *   → updateUser:  findById + save = 2 ops          → @Transactional
 *   → deleteUser:  existsById + deleteById = 2 ops  → @Transactional
 *   → If the second operation throws, the first one rolls back automatically.
 *
 *   The really important case comes in BillService later:
 *     billRepository.save(...)         // Step 1
 *     transactionRepository.save(...)  // Step 2
 *     userRepository.save(wallet)      // Step 3 — if this fails, 1 & 2 roll back
 *   That's the real prisma.$transaction() equivalent.
 *
 * @RequiredArgsConstructor (Lombok)
 *   Auto-generates a constructor for all 'final' fields.
 *   This is how Spring injects dependencies (Constructor Injection — best practice).
 *   Replaces: const prisma = new PrismaClient() at the top of each controller.
 *
 * @Slf4j (Lombok)
 *   Auto-generates a 'log' field (SLF4J Logger).
 *   Replaces: console.log() and console.error()
 *   Usage: log.info("..."), log.error("...", exception)
 *
 * PasswordEncoder
 *   This is BCryptPasswordEncoder injected from SecurityConfig.
 *   Replaces: bcrypt.hash(password, 10) and bcrypt.compare(password, hash)
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // ─── READ OPERATIONS ───────────────────────────────────────────────────────

    /**
     * GET ALL USERS
     *
     * Node.js equivalent:
     *   const users = await prisma.user.findMany({
     *       select: { id: true, userId: true, ... password excluded ... },
     *       orderBy: { createdAt: 'desc' }
     *   });
     *   res.json({ users });
     *
     * 🎓 userRepository.findAll() comes from JpaRepository — auto-generated.
     *    .stream().map(...).toList() converts List<User> → List<UserResponse>
     *    (removes the password field by only including DTO fields).
     */
    @Override
    public List<UserResponse> getAllUsers() {
        log.info("Fetching all users");

        return userRepository.findAll()
                .stream()
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt())) // order by createdAt DESC
                .map(UserResponse::fromEntity)
                .toList();
    }

    /**
     * GET SINGLE USER BY UUID id
     *
     * Node.js equivalent:
     *   const user = await prisma.user.findUnique({ where: { id } });
     *   if (!user) return res.status(404).json({ error: 'User not found' });
     *   res.json({ user });
     *
     * 🎓 .orElseThrow(() -> new ApiException(...))
     *    If findById() returns empty Optional, throw 404 exception.
     *    GlobalExceptionHandler catches this and returns proper JSON error.
     *    No need for manual if/else + res.status(404).json(...) anymore!
     */
    @Override
    public UserResponse getUserById(String id) {
        log.info("Fetching user by id: {}", id);

        User user = userRepository.findById(id)
                .orElseThrow(() -> new ApiException("User not found", HttpStatus.NOT_FOUND));

        return UserResponse.fromEntity(user);
    }

    // ─── WRITE OPERATIONS ──────────────────────────────────────────────────────

    /**
     * CREATE NEW USER
     *
     * Node.js equivalent (from user.controller.ts createUser):
     *   const existingUser = await prisma.user.findUnique({ where: { userId } });
     *   if (existingUser) return res.status(400).json({ error: 'User ID already exists' });
     *   const hashedPassword = await bcrypt.hash(password, 10);
     *   const user = await prisma.user.create({ data: { ... } });
     *   res.status(201).json({ user });
     *
     * 🎓 userRepository.existsByUserId() is a method we defined in UserRepository.
     *    Spring Data JPA auto-implements it by parsing the method name.
     *
     * 🎓 passwordEncoder.encode(password) = bcrypt.hash(password, 10)
     *    BCryptPasswordEncoder is configured in SecurityConfig with strength 10.
     *
     * 🎓 User.builder()...build() is the Lombok Builder pattern.
     *    Cleaner than: const user = { userId: req.body.userId, name: req.body.name, ... }
     */
    @Override
    @Transactional
    public UserResponse createUser(CreateUserRequest request) {
        log.info("Creating new user with userId: {}", request.getUserId());

        // Duplicate check — replaces: if (existingUser) return res.status(400).json(...)
        if (userRepository.existsByUserId(request.getUserId())) {
            throw new ApiException("User ID already exists", HttpStatus.CONFLICT);
        }

        // Build the User entity — no null checks needed, defaults are in the DTO
        User user = User.builder()
                .userId(request.getUserId())
                .name(request.getName())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())             // default: CUSTOMER (set in DTO)
                .walletBalance(request.getWalletBalance()) // default: 0.0 (set in DTO)
                .isActive(request.getIsActive())     // default: true (set in DTO)
                .company(request.getCompany())
                .email(request.getEmail())
                .phone(request.getPhone())
                .companyAddress(request.getCompanyAddress())
                .state(request.getState())
                .pin(request.getPin())
                .gst(request.getGst())
                .build();

        // Save to DB — replaces: prisma.user.create({ data: { ... } })
        User savedUser = userRepository.save(user);

        log.info("Created user: {}", savedUser.getUserId());
        return UserResponse.fromEntity(savedUser);
    }

    /**
     * UPDATE EXISTING USER
     *
     * Node.js equivalent (from user.controller.ts updateUser):
     *   const existingUser = await prisma.user.findUnique({ where: { id } });
     *   if (!existingUser) return res.status(404).json({ error: 'User not found' });
     *   const updateData: any = {};
     *   if (userId) updateData.userId = userId;
     *   if (name) updateData.name = name;
     *   if (password) updateData.password = await bcrypt.hash(password, 10);
     *   ...
     *   const user = await prisma.user.update({ where: { id }, data: updateData });
     *
     * 🎓 We fetch the existing user first, then selectively update only
     *    the fields that are NOT null in the request (same "updateData" pattern).
     *
     * 🎓 userRepository.save(existingUser) on an existing entity = UPDATE SQL.
     *    JPA detects the entity already has an id, so it generates UPDATE not INSERT.
     */
    @Override
    @Transactional
    public UserResponse updateUser(String id, UpdateUserRequest request) {
        log.info("Updating user with id: {}", id);

        // Find existing user or throw 404
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new ApiException("User not found", HttpStatus.NOT_FOUND));

        // If userId is being changed, ensure the new userId is not taken
        if (request.getUserId() != null && !request.getUserId().equals(existingUser.getUserId())) {
            if (userRepository.existsByUserId(request.getUserId())) {
                throw new ApiException("User ID already exists", HttpStatus.CONFLICT);
            }
            existingUser.setUserId(request.getUserId());
        }

        // Selectively update only non-null fields — mirrors Node.js updateData pattern
        if (request.getName() != null)            existingUser.setName(request.getName());
        if (request.getPassword() != null)        existingUser.setPassword(passwordEncoder.encode(request.getPassword()));
        if (request.getRole() != null)            existingUser.setRole(request.getRole());
        if (request.getWalletBalance() != null)   existingUser.setWalletBalance(request.getWalletBalance());
        if (request.getIsActive() != null)        existingUser.setIsActive(request.getIsActive());

        // Optional company fields
        if (request.getCompany() != null)         existingUser.setCompany(request.getCompany());
        if (request.getEmail() != null)           existingUser.setEmail(request.getEmail());
        if (request.getPhone() != null)           existingUser.setPhone(request.getPhone());
        if (request.getCompanyAddress() != null)  existingUser.setCompanyAddress(request.getCompanyAddress());
        if (request.getState() != null)           existingUser.setState(request.getState());
        if (request.getPin() != null)             existingUser.setPin(request.getPin());
        if (request.getGst() != null)             existingUser.setGst(request.getGst());

        // Save — JPA detects existing id → runs UPDATE SQL
        User updatedUser = userRepository.save(existingUser);

        log.info("Updated user: {}", updatedUser.getUserId());
        return UserResponse.fromEntity(updatedUser);
    }

    /**
     * DELETE USER
     *
     * Node.js equivalent:
     *   const existingUser = await prisma.user.findUnique({ where: { id } });
     *   if (!existingUser) return res.status(404).json({ error: 'User not found' });
     *   await prisma.user.delete({ where: { id } });
     *   res.json({ message: 'User deleted successfully' });
     *
     * 🎓 We return void here — the controller returns 204 No Content.
     *    The delete message in the response is handled at the controller level.
     */
    @Override
    @Transactional
    public void deleteUser(String id) {
        log.info("Deleting user with id: {}", id);

        // Check existence first or throw 404
        if (!userRepository.existsById(id)) {
            throw new ApiException("User not found", HttpStatus.NOT_FOUND);
        }

        userRepository.deleteById(id);
        log.info("Deleted user with id: {}", id);
    }
}

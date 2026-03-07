package com.sanskriti.backend.service.impl;

import com.sanskriti.backend.dto.request.LoginRequest;
import com.sanskriti.backend.dto.request.RegisterRequest;
import com.sanskriti.backend.dto.response.AuthResponse;
import com.sanskriti.backend.dto.response.UserResponse;
import com.sanskriti.backend.entity.User;
import com.sanskriti.backend.enums.Role;
import com.sanskriti.backend.exception.ApiException;
import com.sanskriti.backend.mapper.UserMapper;
import com.sanskriti.backend.repository.UserRepository;
import com.sanskriti.backend.service.AuthService;
import com.sanskriti.backend.service.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

/**
 * AuthServiceImpl — the actual authentication logic.
 *
 * 🎓 Key Concepts:
 *
 * @Service: Marks this as a Spring-managed service bean.
 *
 * @RequiredArgsConstructor (Lombok): Auto-generates a constructor that takes all
 * 'final' fields as parameters. Spring then auto-injects them (constructor injection).
 * This is equivalent to:
 *   constructor(userRepository, jwtService, passwordEncoder) {
 *     this.userRepository = userRepository;
 *     ...
 *   }
 *
 * PasswordEncoder: Spring Security's BCryptPasswordEncoder.
 * - encode(password) → equivalent of Node.js bcrypt.hash(password, 10)
 * - matches(raw, hashed) → equivalent of Node.js bcrypt.compare(password, user.password)
 *
 * The BCrypt hashes are COMPATIBLE between Node.js (bcryptjs) and Java
 * (BCryptPasswordEncoder) — they both use the standard $2a$ format.
 * So existing passwords in your DB will work!
 */
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;

    /**
     * Login — maps to your Node.js login() function.
     *
     * Node.js flow:
     *   1. const user = await prisma.user.findUnique({ where: { userId } })
     *   2. if (!user) → 401
     *   3. if (!user.isActive) → 403
     *   4. const isPasswordValid = await bcrypt.compare(password, user.password)
     *   5. if (!isPasswordValid) → 401
     *   6. generateTokens(user.userId, user.id, user.role)
     *   7. Return { user (without password), accessToken, refreshToken }
     */
    @Override
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByUserId(request.getUserId().trim())
                .orElseThrow(() -> new ApiException("Invalid credentials", HttpStatus.UNAUTHORIZED));

        if (!user.getIsActive()) {
            throw new ApiException("Account is inactive", HttpStatus.FORBIDDEN);
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new ApiException("Invalid credentials", HttpStatus.UNAUTHORIZED);
        }

        String accessToken = jwtService.generateAccessToken(
                user.getId(), user.getUserId(), user.getRole().name());
        String refreshToken = jwtService.generateRefreshToken(
                user.getId(), user.getUserId(), user.getRole().name());

        return AuthResponse.builder()
                .user(userMapper.toResponse(user))
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .build();
    }

    /**
     * Register — maps to your Node.js register() function.
     *
     * Node.js flow:
     *   1. Check if user exists → 409
     *   2. const hashedPassword = await bcrypt.hash(password, 10)
     *   3. const newUser = await prisma.user.create({ data: { ... } })
     *   4. generateTokens(newUser.userId, newUser.id, newUser.role)
     *   5. Return { user (without password), accessToken, refreshToken }
     */
    @Override
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByUserId(request.getUserId().trim())) {
            throw new ApiException("User ID already exists", HttpStatus.CONFLICT);
        }

        Role role = Role.CUSTOMER;
        if (request.getRole() != null) {
            try {
                role = Role.valueOf(request.getRole().toUpperCase());
            } catch (IllegalArgumentException e) {
                throw new ApiException("Invalid role. Must be ADMIN or CUSTOMER", HttpStatus.BAD_REQUEST);
            }
        }

        User newUser = User.builder()
                .userId(request.getUserId().trim())
                .name(request.getName())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(role)
                .walletBalance(0.0)
                .isActive(true)
                .build();

        newUser = userRepository.save(newUser);

        String accessToken = jwtService.generateAccessToken(
                newUser.getId(), newUser.getUserId(), newUser.getRole().name());
        String refreshToken = jwtService.generateRefreshToken(
                newUser.getId(), newUser.getUserId(), newUser.getRole().name());

        return AuthResponse.builder()
                .user(userMapper.toResponse(newUser))
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .build();
    }

    /**
     * Me — maps to your Node.js me() function.
     *
     * Node.js flow:
     *   1. const userId = req.userId (set by auth middleware — this is the UUID 'id')
     *   2. const user = await prisma.user.findUnique({ where: { id: userId } })
     *   3. Return { user (without password) }
     */
    @Override
    public UserResponse me(String userId) {
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new ApiException("User not found", HttpStatus.NOT_FOUND));
        return userMapper.toResponse(user);
    }
}

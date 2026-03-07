package com.sanskriti.backend.controller;

import com.sanskriti.backend.annotation.SuccessMessage;
import com.sanskriti.backend.dto.request.LoginRequest;
import com.sanskriti.backend.dto.request.RegisterRequest;
import com.sanskriti.backend.dto.response.AuthResponse;
import com.sanskriti.backend.dto.response.UserResponse;
import com.sanskriti.backend.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

/**
 * AuthController — replaces your Node.js auth.routes.ts + auth.controller.ts.
 *
 * Node.js routes:
 *   router.post('/login', login);                          → POST /api/auth/login
 *   router.post('/register', register);                    → POST /api/auth/register
 *   router.get('/me', authenticateToken, me);               → GET  /api/auth/me
 *
 * 🎓 Key Concepts:
 *
 * @RestController = @Controller + @ResponseBody
 *   Tells Spring: "This class handles HTTP requests and returns JSON directly."
 *   Equivalent of: Express router + res.json()
 *
 * @RequestMapping("/api/auth")
 *   Sets the base path. Equivalent of: app.use('/api/auth', authRoutes)
 *
 * @Valid
 *   Triggers validation on the request body (checks @NotBlank, etc.).
 *   If validation fails, GlobalExceptionHandler returns a 400 error.
 *
 * Authentication parameter (in /me endpoint)
 *   Spring Security automatically injects the current user's authentication.
 *   authentication.getName() returns the user's UUID id (we set it as the principal
 *   in JwtAuthenticationFilter).
 *   Equivalent of: req.userId (set by auth.middleware.ts)
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    @SuccessMessage("Login successful")
    public AuthResponse login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    @SuccessMessage("User registered successfully")
    public AuthResponse register(@Valid @RequestBody RegisterRequest request) {
        return authService.register(request);
    }

    @GetMapping("/me")
    @SuccessMessage("User fetched successfully")
    public UserResponse me(Authentication authentication) {
        return authService.me(authentication.getName());
    }
}

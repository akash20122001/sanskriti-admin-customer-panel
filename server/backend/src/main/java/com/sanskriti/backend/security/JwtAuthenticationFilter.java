package com.sanskriti.backend.security;

import com.sanskriti.backend.service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

/**
 * JwtAuthenticationFilter — replaces your Node.js authenticateToken middleware.
 *
 * 🎓 How it works:
 *
 * In Node.js (auth.middleware.ts):
 *   1. const token = req.headers['authorization']?.split(' ')[1];
 *   2. const decoded = jwt.verify(token, JWT_SECRET);
 *   3. req.userId = decoded.id;
 *   4. req.userRole = decoded.role;
 *   5. next();
 *
 * In Spring Boot (this filter):
 *   1. Extract Bearer token from Authorization header
 *   2. Validate token using JwtService
 *   3. Extract user id and role from token
 *   4. Create an Authentication object and set it in SecurityContext
 *   5. Continue filter chain (equivalent of next())
 *
 * OncePerRequestFilter ensures this runs exactly once per request.
 *
 * 🎓 What is SecurityContext?
 * Think of it as a thread-local variable (like req.userId in Express).
 * After this filter sets the authentication, any code can access it via:
 *   SecurityContextHolder.getContext().getAuthentication()
 *
 * 🎓 What is "ROLE_" prefix?
 * Spring Security's hasRole("ADMIN") internally checks for "ROLE_ADMIN".
 * So we prefix the role from the JWT with "ROLE_" when creating authorities.
 */
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        final String token = authHeader.substring(7);

        if (jwtService.isTokenValid(token)) {
            String userId = jwtService.extractUserId(token);
            String role = jwtService.extractRole(token);

            // Principal is userId (business key like "akash101") — accessible via authentication.getName().
            // We no longer use the UUID id here; me() and other endpoints query by userId.
            UsernamePasswordAuthenticationToken authToken =
                    new UsernamePasswordAuthenticationToken(
                            userId,
                            null,
                            List.of(new SimpleGrantedAuthority("ROLE_" + role))
                    );

            SecurityContextHolder.getContext().setAuthentication(authToken);
        }

        filterChain.doFilter(request, response);
    }
}

package com.sanskriti.backend.config;

import com.sanskriti.backend.security.JwtAuthenticationEntryPoint;
import com.sanskriti.backend.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

/**
 * SecurityConfig — the HEART of Spring Security. Replaces ALL your Express middleware.
 *
 * 🎓 What changed from Phase 1:
 *
 * Phase 1: .authorizeHttpRequests(auth -> auth.anyRequest().permitAll())
 * Phase 3: JWT filter + endpoint protection + role-based access
 *
 * This config now:
 * 1. Adds JwtAuthenticationFilter BEFORE Spring's default auth filter
 * 2. Defines which endpoints are public vs protected
 * 3. Returns 401 JSON (not HTML) via JwtAuthenticationEntryPoint
 * 4. Provides BCryptPasswordEncoder bean for password hashing
 *
 * 🎓 @EnableMethodSecurity:
 * Allows us to use @PreAuthorize("hasRole('ADMIN')") on individual controller
 * methods in later phases. This gives fine-grained role control per endpoint.
 *
 * Node.js equivalent mapping:
 *   app.use(cors(...))                    → corsConfigurationSource()
 *   authenticateToken middleware           → JwtAuthenticationFilter
 *   requireAdmin / requireCustomer         → .hasRole() rules + @PreAuthorize
 *   bcrypt.hash / bcrypt.compare           → passwordEncoder() bean
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    @Value("${app.cors.allowed-origins}")
    private String allowedOrigins;

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())

            .cors(cors -> cors.configurationSource(corsConfigurationSource()))

            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )

            .exceptionHandling(exceptions ->
                exceptions.authenticationEntryPoint(jwtAuthenticationEntryPoint)
            )

            .authorizeHttpRequests(auth -> auth
                // Public endpoints (no token needed)
                .requestMatchers(
                    "/api/auth/login",
                    "/api/auth/register",
                    "/health",
                    "/",
                    "/api/health"
                ).permitAll()

                // Everything else requires authentication
                .anyRequest().authenticated()
            )

            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    /**
     * BCryptPasswordEncoder — replaces bcryptjs in Node.js.
     *
     * Default strength is 10 (same as your Node.js: bcrypt.hash(password, 10)).
     * The $2a$ hash format is standard and compatible between Node.js and Java.
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of(allowedOrigins.split(",")));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}

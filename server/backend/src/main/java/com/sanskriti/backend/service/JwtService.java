package com.sanskriti.backend.service;

/**
 * JwtService Interface — defines the contract for JWT token operations.
 *
 * 🎓 Why Interface + Implementation?
 * This is a core enterprise Java pattern called "programming to an interface":
 *
 * 1. TESTABILITY: In tests, you can create a MockJwtService that always returns
 *    a fixed token, without needing a real secret key.
 *
 * 2. SWAPPABILITY: If you later want to switch from JJWT to another JWT library
 *    (or use asymmetric keys), you only change the implementation — not the
 *    controllers/services that depend on this interface.
 *
 * 3. DEPENDENCY INJECTION: Spring injects the implementation automatically.
 *    Any class that needs JwtService just declares:
 *      private final JwtService jwtService;
 *    Spring finds JwtServiceImpl (annotated with @Service) and injects it.
 *
 * Maps to the Node.js generateTokens() function + jwt.verify() in auth middleware.
 */
public interface JwtService {

    String generateAccessToken(String id, String userId, String role);

    String generateRefreshToken(String id, String userId, String role);

    boolean isTokenValid(String token);

    String extractId(String token);

    String extractUserId(String token);

    String extractRole(String token);
}

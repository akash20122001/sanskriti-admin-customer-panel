package com.sanskriti.backend.service.impl;

import com.sanskriti.backend.service.JwtService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

/**
 * JwtServiceImpl — the actual JWT logic using the JJWT library.
 *
 * Maps to your Node.js code:
 *   const accessToken = jwt.sign({ userId, id, role }, JWT_SECRET, { expiresIn: '7d' });
 *   const decoded = jwt.verify(token, JWT_SECRET);
 *
 * 🎓 Key Concepts:
 * - @Service: Tells Spring "this is a bean, manage its lifecycle and inject it where needed"
 * - @Value: Injects values from application.properties (like process.env.JWT_SECRET)
 * - @PostConstruct: Runs once after the bean is created (converts string secrets to SecretKey objects)
 * - SecretKey: JJWT requires a proper cryptographic key, not just a raw string
 *
 * The token structure matches your Node.js tokens:
 *   { sub: id, userId: "admin1", role: "ADMIN", iat: ..., exp: ... }
 */
@Service
public class JwtServiceImpl implements JwtService {

    @Value("${app.jwt.secret}")
    private String accessSecret;

    @Value("${app.jwt.expiration}")
    private long accessExpiration;

    @Value("${app.jwt.refresh-secret}")
    private String refreshSecret;

    @Value("${app.jwt.refresh-expiration}")
    private long refreshExpiration;

    private SecretKey accessKey;
    private SecretKey refreshKey;

    @PostConstruct
    public void init() {
        this.accessKey = Keys.hmacShaKeyFor(accessSecret.getBytes(StandardCharsets.UTF_8));
        this.refreshKey = Keys.hmacShaKeyFor(refreshSecret.getBytes(StandardCharsets.UTF_8));
    }

    /**
     * Generate an access token.
     *
     * Node.js equivalent:
     *   jwt.sign({ userId, id, role }, JWT_SECRET, { expiresIn: '7d' })
     */
    @Override
    public String generateAccessToken(String id, String userId, String role) {
        return buildToken(id, userId, role, accessExpiration, accessKey);
    }

    /**
     * Generate a refresh token (longer-lived).
     *
     * Node.js equivalent:
     *   jwt.sign({ userId, id, role }, REFRESH_TOKEN_SECRET, { expiresIn: '30d' })
     */
    @Override
    public String generateRefreshToken(String id, String userId, String role) {
        return buildToken(id, userId, role, refreshExpiration, refreshKey);
    }

    /**
     * Validate an access token — checks signature AND expiration.
     *
     * Node.js equivalent:
     *   try { jwt.verify(token, JWT_SECRET); return true; } catch { return false; }
     */
    @Override
    public boolean isTokenValid(String token) {
        try {
            parseAccessToken(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    /**
     * Extract the user's UUID (primary key) from the token.
     * Stored in the "sub" (subject) claim.
     *
     * Node.js equivalent: decoded.id
     */
    @Override
    public String extractId(String token) {
        return parseAccessToken(token).getSubject();
    }

    /**
     * Extract the user's login ID from the token.
     *
     * Node.js equivalent: decoded.userId
     */
    @Override
    public String extractUserId(String token) {
        return parseAccessToken(token).get("userId", String.class);
    }

    /**
     * Extract the user's role from the token.
     *
     * Node.js equivalent: decoded.role
     */
    @Override
    public String extractRole(String token) {
        return parseAccessToken(token).get("role", String.class);
    }

    private String buildToken(String id, String userId, String role, long expiration, SecretKey key) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expiration);

        return Jwts.builder()
                .subject(id)
                .claim("userId", userId)
                .claim("role", role)
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(key)
                .compact();
    }

    private Claims parseAccessToken(String token) {
        return Jwts.parser()
                .verifyWith(accessKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}

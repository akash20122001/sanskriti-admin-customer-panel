package com.sanskriti.backend.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

/**
 * Custom exception that carries an HTTP status code.
 *
 * In Node.js you wrote:
 *   res.status(401).json({ error: 'Invalid credentials' });
 *
 * In Spring Boot, you throw this exception and the GlobalExceptionHandler
 * catches it and returns the proper HTTP response automatically.
 *
 * Usage:
 *   throw new ApiException("Invalid credentials", HttpStatus.UNAUTHORIZED);
 */
@Getter
public class ApiException extends RuntimeException {

    private final HttpStatus status;

    public ApiException(String message, HttpStatus status) {
        super(message);
        this.status = status;
    }
}

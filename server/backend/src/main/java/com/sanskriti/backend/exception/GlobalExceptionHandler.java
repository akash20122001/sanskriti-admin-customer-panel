package com.sanskriti.backend.exception;

import com.sanskriti.backend.dto.response.BaseResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * Replaces your Express error handling middleware:
 *
 *   app.use((err, req, res, next) => {
 *       res.status(500).json({ error: 'Something went wrong!' });
 *   });
 *
 * @RestControllerAdvice catches exceptions thrown from ANY controller
 * and converts them to proper JSON error responses.
 */
@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * Handles our custom ApiException.
     * Maps to: res.status(xxx).json({ error: 'message' })
     */
    @ExceptionHandler(ApiException.class)
    public ResponseEntity<BaseResponse<Void>> handleApiException(ApiException ex) {
        return ResponseEntity
                .status(ex.getStatus())
                .body(BaseResponse.error(ex.getMessage()));
    }

    /**
     * 🎓 Why this handler is critical:
     * Without it, Spring Security's AccessDeniedException (thrown when a user
     * lacks the required role) bubbles up to the generic Exception handler
     * and returns 500. We explicitly catch it here to return a proper 403.
     */
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<BaseResponse<Void>> handleAccessDeniedException(AccessDeniedException ex) {
        return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(BaseResponse.error("Access denied: you don't have permission to perform this action"));
    }

    /**
     * Catches invalid/expired JWT tokens that slip past the filter.
     */
    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<BaseResponse<Void>> handleAuthenticationException(AuthenticationException ex) {
        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(BaseResponse.error("Authentication required"));
    }

    /**
     * Handles validation errors from @Valid / @NotBlank annotations.
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<BaseResponse<Void>> handleValidationException(MethodArgumentNotValidException ex) {
        String message = ex.getBindingResult().getFieldErrors().stream()
                .findFirst()
                .map(error -> error.getDefaultMessage())
                .orElse("Validation failed");

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(BaseResponse.error(message));
    }

    /**
     * Catch-all for unexpected errors.
     * Maps to: res.status(500).json({ error: 'Something went wrong!' })
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<BaseResponse<Void>> handleGenericException(Exception ex) {
        log.error("Unexpected error", ex);
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(BaseResponse.error("Internal server error"));
    }
}

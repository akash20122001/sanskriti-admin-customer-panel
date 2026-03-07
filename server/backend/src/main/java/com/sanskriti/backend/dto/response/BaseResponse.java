package com.sanskriti.backend.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

/**
 * Production-grade standardized API response wrapper.
 *
 * Every endpoint returns this format:
 *
 * Success:
 *   { "success": true, "message": "Login successful", "data": { ... }, "timestamp": "..." }
 *
 * Error:
 *   { "success": false, "message": "Invalid credentials", "data": null, "timestamp": "..." }
 *
 * @param <T> the type of data payload
 */
@Getter
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class BaseResponse<T> {

    private final boolean success;
    private final String message;
    private final T data;
    @Builder.Default
    private final LocalDateTime timestamp = LocalDateTime.now();

    public static <T> BaseResponse<T> success(T data, String message) {
        return BaseResponse.<T>builder()
                .success(true)
                .message(message)
                .data(data)
                .build();
    }

    public static <T> BaseResponse<T> success(T data) {
        return BaseResponse.<T>builder()
                .success(true)
                .message("Success")
                .data(data)
                .build();
    }

    public static BaseResponse<Void> success(String message) {
        return BaseResponse.<Void>builder()
                .success(true)
                .message(message)
                .build();
    }

    public static BaseResponse<Void> error(String message) {
        return BaseResponse.<Void>builder()
                .success(false)
                .message(message)
                .build();
    }
}

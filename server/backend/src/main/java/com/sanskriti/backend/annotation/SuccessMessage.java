package com.sanskriti.backend.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Specifies a custom success message for controller endpoints.
 *
 * Used by ResponseWrapperAdvice to set the "message" field in BaseResponse.
 * If not present, defaults to "Success".
 *
 * Usage:
 *   @SuccessMessage("Login successful")
 *   public AuthResponse login(...) { ... }
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface SuccessMessage {
    String value() default "Success";
}

package com.sanskriti.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

/**
 * Maps to the Node.js LoginRequest interface:
 *   interface LoginRequest { userId: string; password: string; }
 *
 * @NotBlank ensures the field is not null, not empty, and not just whitespace.
 * Spring validates this automatically when you use @Valid in the controller.
 */
@Getter
@Setter
public class LoginRequest {

    @NotBlank(message = "User ID is required")
    private String userId;

    @NotBlank(message = "Password is required")
    private String password;
}

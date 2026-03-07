package com.sanskriti.backend.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import org.springframework.context.annotation.Configuration;

/**
 * OpenAPI (Swagger) Configuration.
 * This class tells Swagger to require a Bearer token globally.
 */
@Configuration
@OpenAPIDefinition(
        info = @Info(
                title = "Sanskriti Backend API",
                version = "1.0",
                description = "Spring Boot REST API for Sanskriti Admin & Customer Panel",
                contact = @Contact(name = "Akash", email = "test@example.com")
        ),
        // This applies the security requirement defined below to ALL endpoints
        security = @SecurityRequirement(name = "Bearer Authentication")
)
@SecurityScheme(
        name = "Bearer Authentication",
        type = SecuritySchemeType.HTTP,
        bearerFormat = "JWT",
        scheme = "bearer"
)
public class OpenApiConfig {
}

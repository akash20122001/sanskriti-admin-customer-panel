package com.sanskriti.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Expose the local "invoices" directory exactly like Node.js express.static
        Path invoicesPath = Paths.get("invoices").toAbsolutePath().normalize();
        
        registry.addResourceHandler("/invoices/**")
                .addResourceLocations("file:" + invoicesPath.toString() + "/");
    }
}

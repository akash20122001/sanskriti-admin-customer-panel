package com.sanskriti.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HealthController {

    @GetMapping("/health")
    public String healthCheck() {
        return "Sanskriti Spring Boot API is running";
    }

    @GetMapping("/")
    public String root() {
        return "Sanskriti Backend API";
    }
}

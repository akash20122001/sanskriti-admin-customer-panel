package com.sanskriti.backend.controller;

import com.sanskriti.backend.annotation.SuccessMessage;
import com.sanskriti.backend.dto.request.CreateUserRequest;
import com.sanskriti.backend.dto.request.UpdateUserRequest;
import com.sanskriti.backend.dto.response.UserResponse;
import com.sanskriti.backend.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * UserController — replaces your Node.js user.routes.ts + user.controller.ts.
 *
 * Node.js routes (user.routes.ts):
 *   router.use(authenticateToken);       ← handled by SecurityConfig (all routes authenticated)
 *   router.use(requireAdmin);            ← @PreAuthorize("hasRole('ADMIN')") below
 *
 *   GET    /api/users        → getAllUsers()
 *   GET    /api/users/:id    → getUserById()
 *   POST   /api/users        → createUser()
 *   PUT    /api/users/:id    → updateUser()
 *   DELETE /api/users/:id    → deleteUser()
 *
 * 🎓 Key Concepts:
 *
 * @RestController
 *   = @Controller + @ResponseBody
 *   Every method returns JSON automatically (no res.json() needed).
 *
 * @RequestMapping("/api/users")
 *   Sets the base URL prefix for ALL methods in this class.
 *   Equivalent of: app.use('/api/users', userRoutes)
 *
 * @PreAuthorize("hasRole('ADMIN')")
 *   Applied at class level → ALL endpoints in this controller require ADMIN role.
 *   Replaces: router.use(authenticateToken); router.use(requireAdmin);
 *   If a non-admin calls these endpoints, Spring returns 403 automatically.
 *
 * @PathVariable
 *   Extracts :id from the URL path.
 *   Replaces: req.params.id
 *
 * @RequestBody
 *   Parses the JSON request body into the DTO.
 *   Replaces: req.body
 *
 * @Valid
 *   Triggers bean validation on the request body.
 *   If @NotBlank fails, GlobalExceptionHandler returns 400 automatically.
 *   Replaces: if (!userId || !name || !password) return res.status(400).json(...)
 *
 * @ResponseStatus(HttpStatus.CREATED)
 *   Returns HTTP 201 instead of 200 for the create endpoint.
 *   Replaces: res.status(201).json(...)
 *
 * @ResponseStatus(HttpStatus.NO_CONTENT)
 *   Returns HTTP 204 (no body) for the delete endpoint.
 *   Replaces: res.json({ message: 'User deleted successfully' })
 *   Note: 204 is more RESTful for DELETE — no body needed.
 *
 * Notice how THIN the controller is — no business logic here!
 * All logic lives in UserServiceImpl. This is the Spring Boot way.
 */
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')") // All endpoints in this controller require ADMIN role
public class UserController {

    private final UserService userService;

    /**
     * GET /api/users
     * Returns all users (without passwords).
     * Replaces: async getAllUsers(_req, res) → res.json({ users })
     */
    @GetMapping
    @SuccessMessage("Users fetched successfully")
    public List<UserResponse> getAllUsers() {
        return userService.getAllUsers();
    }

    /**
     * GET /api/users/:id
     * Returns a single user by their UUID id.
     * Replaces: async getUserById(req, res) → res.json({ user })
     *
     * @PathVariable String id — extracts the {id} from the URL
     */
    @GetMapping("/{id}")
    @SuccessMessage("User fetched successfully")
    public UserResponse getUserById(@PathVariable String id) {
        return userService.getUserById(id);
    }

    /**
     * POST /api/users
     * Creates a new user (admin only).
     * Replaces: async createUser(req, res) → res.status(201).json({ user })
     */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @SuccessMessage("User created successfully")
    public UserResponse createUser(@Valid @RequestBody CreateUserRequest request) {
        return userService.createUser(request);
    }

    /**
     * PUT /api/users/:id
     * Updates an existing user (admin only).
     * Replaces: async updateUser(req, res) → res.json({ user })
     *
     * Note: We don't use @Valid here because all UpdateUserRequest fields are optional.
     * Only @Size on password needs checking — Spring validates it if password is provided.
     */
    @PutMapping("/{id}")
    @SuccessMessage("User updated successfully")
    public UserResponse updateUser(
            @PathVariable String id,
            @Valid @RequestBody UpdateUserRequest request
    ) {
        return userService.updateUser(id, request);
    }

    /**
     * DELETE /api/users/:id
     * Deletes a user (admin only).
     * Replaces: async deleteUser(req, res) → res.json({ message: 'User deleted' })
     *
     * Returns 204 No Content — RESTful standard for successful DELETE.
     */
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteUser(@PathVariable String id) {
        userService.deleteUser(id);
    }
}

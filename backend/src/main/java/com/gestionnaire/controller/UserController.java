package com.gestionnaire.controller;

import com.gestionnaire.entity.User;
import com.gestionnaire.enums.Role;
import com.gestionnaire.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin(origins = { "http://localhost:4200", "http://localhost:54117" })
public class UserController {

    private final UserService userService;

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<User> createUser(@RequestBody Map<String, Object> request) {
        String name = (String) request.get("name");
        String email = (String) request.get("email");
        String password = (String) request.get("password");
        Role role = request.containsKey("role") ? Role.valueOf((String) request.get("role")) : Role.USER;

        User user = userService.createUser(name, email, password, role);
        return ResponseEntity.ok(user);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody Map<String, Object> request) {
        String name = (String) request.get("name");
        String email = (String) request.get("email");
        Role role = request.containsKey("role") ? Role.valueOf((String) request.get("role")) : null;

        User user = userService.updateUser(id, name, email, role);
        return ResponseEntity.ok(user);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}

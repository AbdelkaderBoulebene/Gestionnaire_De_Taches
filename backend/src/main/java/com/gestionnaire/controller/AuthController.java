package com.gestionnaire.controller;

import com.gestionnaire.dto.AuthResponse;
import com.gestionnaire.dto.LoginRequest;
import com.gestionnaire.dto.RegisterRequest;
import com.gestionnaire.entity.User;
import com.gestionnaire.security.JwtTokenProvider;
import com.gestionnaire.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = { "http://localhost:4200", "http://localhost:54117" })
public class AuthController {

        private final AuthenticationManager authenticationManager;
        private final UserService userService;
        private final JwtTokenProvider tokenProvider;

        @PostMapping("/login")
        public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest loginRequest) {
                Authentication authentication = authenticationManager.authenticate(
                                new UsernamePasswordAuthenticationToken(
                                                loginRequest.getEmail(),
                                                loginRequest.getPassword()));

                SecurityContextHolder.getContext().setAuthentication(authentication);
                String jwt = tokenProvider.generateToken(authentication);

                User user = (User) authentication.getPrincipal();

                return ResponseEntity.ok(new AuthResponse(
                                jwt,
                                user.getId(),
                                user.getName(),
                                user.getEmail(),
                                user.getRole()));
        }

        @PostMapping("/register")
        public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest registerRequest) {
                User user = userService.createUser(
                                registerRequest.getName(),
                                registerRequest.getEmail(),
                                registerRequest.getPassword(),
                                registerRequest.getRole());

                String jwt = tokenProvider.generateTokenFromUser(user);

                return ResponseEntity.ok(new AuthResponse(
                                jwt,
                                user.getId(),
                                user.getName(),
                                user.getEmail(),
                                user.getRole()));
        }
}

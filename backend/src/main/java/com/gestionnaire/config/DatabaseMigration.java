package com.gestionnaire.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class DatabaseMigration implements CommandLineRunner {

    private final JdbcTemplate jdbcTemplate;

    public DatabaseMigration(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public void run(String... args) throws Exception {
        try {
            System.out.println("Running Database Migration: Updating users_role_check constraint...");
            // Drop the old constraint
            jdbcTemplate.execute("ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check");
            // Add the new constraint including MANAGER
            jdbcTemplate.execute(
                    "ALTER TABLE users ADD CONSTRAINT users_role_check CHECK (role IN ('USER', 'ADMIN', 'MANAGER'))");
            System.out.println("Database Migration Completed Successfully.");
        } catch (Exception e) {
            System.err.println("Database Migration Failed: " + e.getMessage());
            // Don't block startup, maybe it failed because constraint doesn't exist etc.
        }
    }
}

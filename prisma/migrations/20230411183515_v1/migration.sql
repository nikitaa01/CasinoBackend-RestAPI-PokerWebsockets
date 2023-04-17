-- CreateTable
CREATE TABLE `users` (
    `id` CHAR(36) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `coin_balance` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    `first_name` VARCHAR(255) NOT NULL,
    `last_name` VARCHAR(255) NOT NULL,
    `avatar_url` VARCHAR(255) NOT NULL,
    `oauth_provider` VARCHAR(255) NULL,
    `oauth_provider_id` VARCHAR(255) NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `users_id_key`(`id`),
    UNIQUE INDEX `users_email_key`(`email`),
    UNIQUE INDEX `users_oauth_provider_id_key`(`oauth_provider_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

INSERT INTO users (id, email, password, coin_balance, first_name, last_name, avatar_url)
VALUES
  ("9c2a8d8b-0e80-4e1e-aa20-72cc54cdaecf", "user1@example.com", "$2a$10$RvoNrBQ/5qVbbGfob1bEQ.BykMwknJB80nhv9q.roYLRNmClgybLu", 100.00, "John", "Doe", "/api/avatar/9c2a8d8b-0e80-4e1e-aa20-72cc54cdaecf"),
  ("e6a92f11-0b3a-432d-8d47-654d0a752c5f", "user2@example.com", "$2a$10$8UTkpT.0XZfeW1mEeBTVnusjC7EKryJE87K28HM5BvsEUtoBzp1zK", 50.00, "Jane", "Smith", "/api/avatar/e6a92f11-0b3a-432d-8d47-654d0a752c5f"),
  ("c46a8a18-778c-4e05-b936-fa9b8d9647a1", "user3@example.com", "$2a$10$z0vzBUrjD7/642rfKBhBnOqFBm2z5RNMXQ8E6aSGq1RtFSgGJsFiG", 0.00, "Bob", "Johnson", "/api/avatar/c46a8a18-778c-4e05-b936-fa9b8d9647a1"),
  ("f74b6f17-e1e3-43d8-8bbd-ef9ba2c9f294", "user4@example.com", "$2a$10$hdshaLX18nvLSl6lACDzeuShCvRJxTpcOAngaFUsD8gpo9HnhzNjW", 75.00, "Sarah", "Lee", "/api/avatar/f74b6f17-e1e3-43d8-8bbd-ef9ba2c9f294"),
  ("827b2c06-3a8b-40d3-aa3c-5c5b5a3077e3", "user5@example.com", "$2a$10$68FBE9r1F4eLtdHK9mr9wufsxupC6KuwhTkkak1LM9wNEgwJhPxJm", 200.00, "David", "Nguyen", "/api/avatar/827b2c06-3a8b-40d3-aa3c-5c5b5a3077e3"),
  ("a313e701-c0ef-4df2-849d-47e66b997cfe", "user6@example.com", "$2a$10$9pUnMHq6ZBntIAGXP4ovtOZn8dKaRjXcz3A.i7dCDiPL5Nk9sUv1q", 0.00, "Luis", "Ramirez", "/api/avatar/a313e701-c0ef-4df2-849d-47e66b997cfe");

-- ===========================
-- Users
-- ===========================
CREATE TABLE `users` (
  `user_id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `phone` VARCHAR(20) DEFAULT NULL,
  `mobile_number` VARCHAR(20) DEFAULT NULL,
  `role` ENUM('admin','tenant','landlord') DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `password` VARCHAR(255) NOT NULL,
  `reset_token` VARCHAR(255) DEFAULT NULL,
  `reset_token_expiry` DATETIME DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=46 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ===========================
-- User Reminders
-- ===========================
CREATE TABLE `userreminders` (
  `reminder_id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT DEFAULT NULL,
  `type` ENUM('lease','payment','late_fee') DEFAULT NULL,
  `message` TEXT,
  `remind_at` DATETIME DEFAULT NULL,
  `is_sent` TINYINT(1) DEFAULT 0,
  PRIMARY KEY (`reminder_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `userreminders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ===========================
-- User IDs
-- ===========================
CREATE TABLE `userids` (
  `id_id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT DEFAULT NULL,
  `id_type` VARCHAR(50) DEFAULT NULL,
  `id_number` VARCHAR(100) DEFAULT NULL,
  `id_photo_url` TEXT,
  `uploaded_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `userids_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ===========================
-- Tenant History
-- ===========================
CREATE TABLE `tenanthistory` (
  `history_id` INT NOT NULL AUTO_INCREMENT,
  `lease_id` INT DEFAULT NULL,
  `user_id` INT DEFAULT NULL,
  `activity_type` ENUM('payment','maintenance','lease_change') DEFAULT NULL,
  PRIMARY KEY (`history_id`),
  KEY `lease_id` (`lease_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `tenanthistory_ibfk_1` FOREIGN KEY (`lease_id`) REFERENCES `leases` (`lease_id`),
  CONSTRAINT `tenanthistory_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ===========================
-- Smart Passcodes
-- ===========================
CREATE TABLE `smartpasscodes` (
  `passcode_id` INT NOT NULL AUTO_INCREMENT,
  `lease_id` INT DEFAULT NULL,
  `user_id` INT DEFAULT NULL,
  `passcode` CHAR(4) DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT NULL,
  `expires_at` DATETIME DEFAULT NULL,
  `is_active` TINYINT(1) DEFAULT 1,
  PRIMARY KEY (`passcode_id`),
  KEY `lease_id` (`lease_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `smartpasscodes_ibfk_1` FOREIGN KEY (`lease_id`) REFERENCES `leases` (`lease_id`),
  CONSTRAINT `smartpasscodes_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ===========================
-- Properties
-- ===========================
CREATE TABLE `properties` (
  `property_id` INT NOT NULL AUTO_INCREMENT,
  `address` VARCHAR(255) NOT NULL,
  `city` VARCHAR(100) DEFAULT NULL,
  `state` VARCHAR(50) DEFAULT NULL,
  `zip` VARCHAR(10) DEFAULT NULL,
  `rent_amount` DECIMAL(10,2) DEFAULT NULL,
  `status` ENUM('available','occupied') DEFAULT NULL,
  `user_id` INT DEFAULT NULL,
  PRIMARY KEY (`property_id`),
  KEY `fk_user` (`user_id`),
  CONSTRAINT `fk_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=103 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ===========================
-- Photos
-- ===========================
CREATE TABLE `photos` (
  `photo_id` INT NOT NULL AUTO_INCREMENT,
  `property_id` INT DEFAULT NULL,
  `image_url` TEXT,
  `caption` TEXT,
  `uploaded_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`photo_id`),
  KEY `property_id` (`property_id`),
  CONSTRAINT `photos_ibfk_1` FOREIGN KEY (`property_id`) REFERENCES `properties` (`property_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ===========================
-- Payments
-- ===========================
CREATE TABLE `payments` (
  `payment_id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT DEFAULT NULL,
  `lease_id` INT DEFAULT NULL,
  `amount` DECIMAL(10,2) DEFAULT NULL,
  `paid_date` DATE DEFAULT NULL,
  `status` ENUM('pending','completed') DEFAULT NULL,
  `payment_type` ENUM('regular','advance') DEFAULT NULL,
  `payment_for_month` DATE DEFAULT NULL,
  PRIMARY KEY (`payment_id`),
  KEY `user_id` (`user_id`),
  KEY `lease_id` (`lease_id`),
  CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `payments_ibfk_2` FOREIGN KEY (`lease_id`) REFERENCES `leases` (`lease_id`)
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ===========================
-- Payment History
-- ===========================
CREATE TABLE `paymenthistory` (
  `history_id` INT NOT NULL AUTO_INCREMENT,
  `payment_id` INT DEFAULT NULL,
  `status` ENUM('completed','late','failed') DEFAULT NULL,
  `late_fee_applied` TINYINT(1) DEFAULT 0,
  `note` TEXT,
  `updated_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`history_id`),
  KEY `payment_id` (`payment_id`),
  CONSTRAINT `paymenthistory_ibfk_1` FOREIGN KEY (`payment_id`) REFERENCES `payments` (`payment_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ===========================
-- Maintenance Requests
-- ===========================
CREATE TABLE `maintenancerequests` (
  `request_id` INT NOT NULL AUTO_INCREMENT,
  `property_id` INT DEFAULT NULL,
  `user_id` INT DEFAULT NULL,
  `description` TEXT,
  `status` ENUM('open','in_progress','closed') DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`request_id`),
  KEY `property_id` (`property_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `maintenancerequests_ibfk_1` FOREIGN KEY (`property_id`) REFERENCES `properties` (`property_id`),
  CONSTRAINT `maintenancerequests_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ===========================
-- Lease Tenants
-- ===========================
CREATE TABLE `leasetenants` (
  `lease_id` INT NOT NULL,
  `user_id` INT NOT NULL,
  PRIMARY KEY (`lease_id`,`user_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `leasetenants_ibfk_1` FOREIGN KEY (`lease_id`) REFERENCES `leases` (`lease_id`),
  CONSTRAINT `leasetenants_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ===========================
-- Leases
-- ===========================
CREATE TABLE `leases` (
  `lease_id` INT NOT NULL AUTO_INCREMENT,
  `property_id` INT DEFAULT NULL,
  `user_id` INT DEFAULT NULL,
  `start_date` DATE DEFAULT NULL,
  `end_date` DATE DEFAULT NULL,
  `lease_file_url` TEXT,
  `renewal_requested` TINYINT(1) DEFAULT 0,
  `renewal_date` DATE DEFAULT NULL,
  `rent_amount` DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (`lease_id`),
  KEY `property_id` (`property_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `leases_ibfk_1` FOREIGN KEY (`property_id`) REFERENCES `properties` (`property_id`),
  CONSTRAINT `leases_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ===========================
-- Lease Photos
-- ===========================
CREATE TABLE `leasephotos` (
  `photo_id` INT NOT NULL AUTO_INCREMENT,
  `lease_id` INT DEFAULT NULL,
  `photo_url` TEXT,
  `uploaded_by` INT DEFAULT NULL,
  `is_visible_to_tenant` TINYINT(1) DEFAULT 0,
  `uploaded_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`photo_id`),
  KEY `lease_id` (`lease_id`),
  KEY `uploaded_by` (`uploaded_by`),
  CONSTRAINT `leasephotos_ibfk_1` FOREIGN KEY (`lease_id`) REFERENCES `leases` (`lease_id`),
  CONSTRAINT `leasephotos_ibfk_2` FOREIGN KEY (`uploaded_by`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ===========================
-- Lease Archive
-- ===========================
CREATE TABLE `leasearchive` (
  `archive_id` INT NOT NULL AUTO_INCREMENT,
  `lease_id` INT DEFAULT NULL,
  `user_id` INT DEFAULT NULL,
  `lease_pdf_url` TEXT,
  `archived_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`archive_id`),
  KEY `lease_id` (`lease_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `leasearchive_ibfk_1` FOREIGN KEY (`lease_id`) REFERENCES `leases` (`lease_id`),
  CONSTRAINT `leasearchive_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ===========================
-- Documents
-- ===========================
CREATE TABLE `documents` (
  `document_id` INT NOT NULL AUTO_INCREMENT,
  `lease_id` INT NOT NULL,
  `uploaded_by` INT DEFAULT NULL,
  `file_url` TEXT,
  `uploaded_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `is_visible_to_tenant` TINYINT(1) DEFAULT 1,
  PRIMARY KEY (`document_id`),
  UNIQUE KEY `lease_id_unique` (`lease_id`),
  KEY `uploaded_by` (`uploaded_by`)
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

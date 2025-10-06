## Part 2: Database Design
Team Members
- Vishal Nalinbhai Patel
- Het BhavinKumar Patel
- Harsh Manishkumar Rana


## Feature Mapping Table

| **Feature**                | **Required Data**                         | **Entities Involved**                          |
|----------------------------|-------------------------------------------|------------------------------------------------|
| Tenant Portal              | Rent payments, lease info                 | Users, Tenants, Payments, Properties           |
| Landlord Dashboard         | Property listings, applications, income  | Users, Properties, Tenants                     |
| Maintenance Requests       | Complaint details, status, contractor info| Tenants, MaintenanceRequests, Properties       |
| Automated Bills            | Monthly rent, late fees, reminders        | Payments, Tenants                              |
| History Logs               | Payment history, lease changes            | Tenants, Payments, Properties                  |
| Smart Lock Access          | Access control, unit ID                   | Properties, Users                              |
| Lease Document Storage     | Lease files, visibility settings          | Tenants, Properties, Users                     |
| Photo Listings             | Unit images, descriptions                 | Properties                                     |

## Entities & Attributes
# Users
- user_id – INT, PK, AUTO_INCREMENT
- name – VARCHAR(100), NOT NULL
- email – VARCHAR(100), UNIQUE, NOT NULL
- phone – VARCHAR(20)
- role – ENUM('admin', 'tenant', 'manager')
- created_at – TIMESTAMP DEFAULT CURRENT_TIMESTAMP

# Properties

- property_id – INT, PK, AUTO_INCREMENT
- address – VARCHAR(255), NOT NULL
- city – VARCHAR(100)
- state – VARCHAR(50)
- zip – VARCHAR(10)
- rent_amount – DECIMAL(10,2)
- status – ENUM('available', 'occupied')

# Leases
- lease_id – INT, PK, AUTO_INCREMENT
- property_id – INT, FK → Properties(property_id)
- user_id – INT, FK → Users(user_id)
- start_date – DATE
- end_date – DATE
- lease_file_url – TEXT
  
# Payments
- payment_id – INT, PK, AUTO_INCREMENT
- user_id – INT, FK → Users(user_id)
- lease_id – INT, FK → Leases(lease_id)
- amount – DECIMAL(10,2)
- paid_date – DATE
- status – ENUM('pending', 'completed')

# MaintenanceRequests
- request_id – INT, PK, AUTO_INCREMENT
- property_id – INT, FK → Properties(property_id)
- user_id – INT, FK → Users(user_id)
- description – TEXT
- status – ENUM('open', 'in_progress', 'closed')
- created_at – TIMESTAMP
  
# Documents
- document_id – INT, PK, AUTO_INCREMENT
- lease_id – INT, FK → Leases(lease_id)
- uploaded_by – INT, FK → Users(user_id)
- file_url – TEXT
  
# TenantHistory
- history_id – INT, PK, AUTO_INCREMENT
- lease_id – INT, FK → Leases(lease_id)
- user_id – INT, FK → Users(user_id)
- activity_type – ENUM('payment', 'maintenance', 'lease_change')
  
# SmartLocks
- lock_id – INT, PK, AUTO_INCREMENT
- access_code – VARCHAR(50)
- property_id – INT, FK → Properties(property_id)
- status – ENUM('active', 'inactive')
  
# Photos
- photo_id – INT, PK, AUTO_INCREMENT
- property_id – INT, FK → Properties(property_id)
- image_url – TEXT
- caption – TEXT
- uploaded_at – TIMESTAMP

## ER Diagram
<img width="560" height="828" alt="ER" src="https://github.com/user-attachments/assets/295782a0-5d4a-4788-b5bd-f6017c7f5a17" />

## Database Schema(DDL)
 CREATE TABLE Users (
 - user_id INT PRIMARY KEY AUTO_INCREMENT,
 - name VARCHAR(100) NOT NULL,
 - email VARCHAR(100) UNIQUE NOT NULL,
 - phone VARCHAR(20),
 - role ENUM('admin', 'tenant', 'manager'),
 - created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
 
 );

 CREATE TABLE Properties (
 - property_id INT PRIMARY KEY AUTO_INCREMENT,
 - address VARCHAR(255) NOT NULL,
 - city VARCHAR(100),
 - state VARCHAR(50),
 - zip VARCHAR(10),
 - rent_amount DECIMAL(10,2),
 - status ENUM('available', 'occupied')
   
 );

 CREATE TABLE Leases (
 - lease_id INT PRIMARY KEY AUTO_INCREMENT,
 - property_id INT NOT NULL,
 - user_id INT NOT NULL,
 - start_date DATE,
 - end_date DATE,
 - lease_file_url TEXT,
 - FOREIGN KEY (property_id) REFERENCES Properties(property_id),
 - FOREIGN KEY (user_id) REFERENCES Users(user_id)

 );

 CREATE TABLE Payments (
 - payment_id INT PRIMARY KEY AUTO_INCREMENT,
 - user_id INT NOT NULL,
 - lease_id INT NOT NULL,
 - amount DECIMAL(10,2),
 - paid_date DATE,
 - status ENUM('pending', 'completed'),
 - FOREIGN KEY (user_id) REFERENCES Users(user_id),
 - FOREIGN KEY (lease_id) REFERENCES Leases(lease_id)

 );

CREATE TABLE MaintenanceRequests (
 - request_id INT PRIMARY KEY AUTO_INCREMENT,
 - property_id INT NOT NULL,
 - user_id INT NOT NULL,
 - description TEXT,
 - status ENUM('open', 'in_progress', 'closed'),
 - created_at TIMESTAMP,
 - FOREIGN KEY (property_id) REFERENCES Properties(property_id),
 - FOREIGN KEY (user_id) REFERENCES Users(user_id)

 );

CREATE TABLE Documents (
 - document_id INT PRIMARY KEY AUTO_INCREMENT,
 - lease_id INT NOT NULL,
 - uploaded_by INT NOT NULL,
 - file_url TEXT,
 - FOREIGN KEY (lease_id) REFERENCES Leases(lease_id),
 - FOREIGN KEY (uploaded_by) REFERENCES Users(user_id)

 );

CREATE TABLE TenantHistory (
 - history_id INT PRIMARY KEY AUTO_INCREMENT,
 - lease_id INT NOT NULL,
 - user_id INT NOT NULL,
 - activity_type ENUM('payment', 'maintenance', 'lease_change'),
 - FOREIGN KEY (lease_id) REFERENCES Leases(lease_id),
 - FOREIGN KEY (user_id) REFERENCES Users(user_id)

 );

CREATE TABLE SmartLocks (
 - lock_id INT PRIMARY KEY AUTO_INCREMENT,
 - access_code VARCHAR(50),
 - property_id INT NOT NULL,
 - status ENUM('active', 'inactive'),
 - FOREIGN KEY (property_id) REFERENCES Properties(property_id)

 );

 CREATE TABLE Photos (
 - photo_id INT PRIMARY KEY AUTO_INCREMENT,
 - property_id INT NOT NULL,
 - image_url TEXT,
 - caption TEXT,
 - uploaded_at TIMESTAMP,
 - FOREIGN KEY (property_id) REFERENCES Properties(property_id)

 );



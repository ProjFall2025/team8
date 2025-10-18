## Part 2: Database Design
Team Members
- Vishal Nalinbhai Patel
- Het BhavinKumar Patel
- Harsh Manishkumar Rana


## Feature Mapping Table

| Feature                     | Required Data                                           | Entities Involved                                               |
|----------------------------|---------------------------------------------------------|------------------------------------------------------------------|
| Tenant Portal              | Lease details, rent payments, reminders, smart lock access | Users, LeaseTenants, Leases, Payments, SmartPasscodes, UserReminders |
| Landlord Dashboard         | Property listings, lease photos, income summary, tenant info | Users, Properties, Leases, Payments, LeasePhotos, IncomeView     |
| Maintenance Requests       | Complaint details, status, timestamps, resolution history | Users, MaintenanceRequests, Properties, TenantHistory            |
| Automated Billing System   | Monthly rent, late fees, payment reminders               | Payments, UserReminders, PaymentHistory                          |
| History Logs & Audit Trail | Payment history, lease changes, passcode resets, maintenance | TenantHistory, PaymentHistory, LeaseArchive, SmartPasscodes      |
| Smart Lock Access          | 4-digit passcode, reset history, lease linkage           | SmartPasscodes, Leases, Users                                    |
| Lease Document Storage     | Lease files, archive access, visibility settings         | Documents, LeaseArchive, Users                                   |
| Photo Listings             | Unit images, captions, visibility to tenants             | Photos, LeasePhotos, Properties                                  |
| Valid ID Verification      | ID type, number, photo, upload timestamp                 | UserIDs, Users                                                   |
| Multi-Tenant Lease Support | Shared lease access, payment split, roommate management  | LeaseTenants, Leases, Users                                      |
| Advance & Renewal Payments | Future rent payments, renewal requests, lease extension  | Payments, Leases                                                 |
| Landlord Income View       | Total earnings per unit/lease, monthly/yearly breakdown  | Payments, Leases, Properties (via IncomeView SQL View)           |
| Forgot Password Support    | Email, mobile number, ID verification                    | Users, UserIDs                                                   |

## Entities & Attributes
### 1. Users
- user_id – INT, PK, AUTO_INCREMENT  
- name – VARCHAR(100), NOT NULL  
- email – VARCHAR(100), UNIQUE, NOT NULL  
- phone – VARCHAR(20)  
- mobile_number – VARCHAR(20)  
- role – ENUM(admin, tenant, landlord)  
- created_at – TIMESTAMP DEFAULT CURRENT_TIMESTAMP  

---

### 2. Properties
- property_id – INT, PK, AUTO_INCREMENT  
- address – VARCHAR(255), NOT NULL  
- city – VARCHAR(100)  
- state – VARCHAR(50)  
- zip – VARCHAR(10)  
- rent_amount – DECIMAL(10,2)  
- status – ENUM(available, occupied)  

---

### 3. Leases
- lease_id – INT, PK, AUTO_INCREMENT  
- property_id – INT, FK → Properties(property_id)  
- user_id – INT, FK → Users(user_id)  
- start_date – DATE  
- end_date – DATE  
- lease_file_url – TEXT  
- renewal_requested – BOOLEAN DEFAULT FALSE  
- renewal_date – DATE  

---

### 4. LeaseTenants
- lease_id – INT, FK → Leases(lease_id)  
- user_id – INT, FK → Users(user_id)  

---

### 5. Payments
- payment_id – INT, PK, AUTO_INCREMENT  
- user_id – INT, FK → Users(user_id)  
- lease_id – INT, FK → Leases(lease_id)  
- amount – DECIMAL(10,2)  
- paid_date – DATE  
- status – ENUM(pending, completed)  
- payment_type – ENUM(regular, advance)  
- payment_for_month – DATE  

---

### 6. PaymentHistory
- history_id – INT, PK, AUTO_INCREMENT  
- payment_id – INT, FK → Payments(payment_id)  
- status – ENUM(completed, late, failed)  
- late_fee_applied – BOOLEAN DEFAULT FALSE  
- note – TEXT  
- updated_at – TIMESTAMP  

---

### 7. MaintenanceRequests
- request_id – INT, PK, AUTO_INCREMENT  
- property_id – INT, FK → Properties(property_id)  
- user_id – INT, FK → Users(user_id)  
- description – TEXT  
- status – ENUM(open, in_progress, closed)  
- created_at – TIMESTAMP  

---

### 8. Documents
- document_id – INT, PK, AUTO_INCREMENT  
- lease_id – INT, FK → Leases(lease_id)  
- uploaded_by – INT, FK → Users(user_id)  
- file_url – TEXT  

---

### 9. LeaseArchive
- archive_id – INT, PK, AUTO_INCREMENT  
- lease_id – INT, FK → Leases(lease_id)  
- user_id – INT, FK → Users(user_id)  
- lease_pdf_url – TEXT  
- archived_at – TIMESTAMP  

---

### 10. Photos
- photo_id – INT, PK, AUTO_INCREMENT  
- property_id – INT, FK → Properties(property_id)  
- image_url – TEXT  
- caption – TEXT  
- uploaded_at – TIMESTAMP  

---

### 11. LeasePhotos
- photo_id – INT, PK, AUTO_INCREMENT  
- lease_id – INT, FK → Leases(lease_id)  
- photo_url – TEXT  
- uploaded_by – INT, FK → Users(user_id)  
- is_visible_to_tenant – BOOLEAN DEFAULT FALSE  
- uploaded_at – TIMESTAMP  

---

### 12. SmartPasscodes
- passcode_id – INT, PK, AUTO_INCREMENT  
- lease_id – INT, FK → Leases(lease_id)  
- user_id – INT, FK → Users(user_id)  
- passcode – CHAR(4)  
- created_at – TIMESTAMP  
- expires_at – DATETIME  
- is_active – BOOLEAN DEFAULT TRUE  

---

### 13. UserReminders
- reminder_id – INT, PK, AUTO_INCREMENT  
- user_id – INT, FK → Users(user_id)  
- type – ENUM(lease, payment, late_fee)  
- message – TEXT  
- remind_at – DATETIME  
- is_sent – BOOLEAN DEFAULT FALSE  

---

### 14. UserIDs
- id_id – INT, PK, AUTO_INCREMENT  
- user_id – INT, FK → Users(user_id)  
- id_type – VARCHAR(50)  
- id_number – VARCHAR(100)  
- id_photo_url – TEXT  
- uploaded_at – TIMESTAMP  

---

### 15. TenantHistory
- history_id – INT, PK, AUTO_INCREMENT  
- lease_id – INT, FK → Leases(lease_id)  
- user_id – INT, FK → Users(user_id)  
- activity_type – ENUM(payment, maintenance, lease_change)  

## ER Diagram
<img width="899" height="1164" alt="image" src="https://github.com/user-attachments/assets/cc7bb554-4310-42df-8d90-826f54ee39e1" />


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


## UML Diagram
<img width="560" height="828" alt="ER" src="https://github.com/user-attachments/assets/b81654e8-b889-43dd-ac60-32a262b08d73" />


## Brief Explanation of How Schema Supports Site Functionalities

All common features of the Smart Property & Tenant Management System are backed by the database schema.For example, it supports secure user registration and access based on roles, recording leases and payments, storing documents and photographs, and processing maintenance requests and invoices. Entities interact with one another so as to ensure data integrity with improved query processes concerning dashboards, reminders, and auditlogs. The schema is evolutionary, with ablity to enhanced facility support like smart-lock integration, automated billing, etc.

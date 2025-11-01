Project Name:- Smart Property & Tenant Management System 
 ---
Team Members  
i)	Vishal Nalinbhai Patel   
ii)	Het BhavinKumar Patel   
iii)	Harsh Manishkumar Rana 
  ---

## 🚀 Project Overview (Part 4: Implementation & Prototype)

- This is a full-stack web application built with React, Node.js, and MySQL. It supports role-based access for tenants, landlords, and admins, and includes features like property management, maintenance requests, lease tracking, and rent payments. A third-party API ,Stripe is integrated to enhance functionality.

### 📁 Repository Structure
- /frontend   → React app
- /backend    → Node.js API
- /database   → SQL scripts (schema + seed data)


### 🔐 Authentication & Roles
- JWT-based login and registration  
- Roles: Admin, Registered User, Guest  
- Role-based access enforced on protected routes  

### 🌐 API Endpoints (Back-End Implemented)


| Method | Endpoint                | Description                        |
|--------|-------------------------|------------------------------------|
| POST   | /api/auth/login         | Login user                         |
| POST   | /api/auth/register      | Register new user                  |
| GET    | /api/properties         | Get all properties (auth required) |
| GET    | /api/properties/:id     | Get property by ID                 |
| POST   | /api/properties         | Create property (Admin only)       |
| PUT    | /api/properties/:id     | Update property (Admin only)       |
| DELETE | /api/properties/:id     | Delete property (Admin only)       |

### 💳 Third-Party API Integration
- Stripe API integrated for secure online rent payments  
- Tenants can pay rent via Stripe checkout  
- Payment status and transaction history stored in backend  

### 🖼️ Screenshots (check screenshots folder)
- Login and registration flow  
- Role-based dashboard views  
- Property list fetched from backend  
- Stripe payment integration  
- Admin-only actions (create/update/delete)  

### 🧾 Setup Instructions
#### Backend
- cd backend
- npm install
- cp .env.example .env
- npm run dev

#### Frontend
- cd frontend
- npm install
- npm start

#### Database
- mysql -u root -p < database/schema.sql
- mysql -u root -p < database/seed_data.sql


  
### 1)	Conceptualization of Website 
### Mission Statement: 
This site was created to enable tenants and landlords of real estate to easily manage the tenancy and handling of real estate to the managers.
It also includes; communication, maintenance requests, lease tracking and collecting rent on a single platform. The objective is to make the processes more transparent, less manual, faster and add more credibility to the rental processes.

---

## 2)	Target Users 
 
### Landlords & Property Managers 
- **Demographics and Interests**: The interests and demographics of this group are 30 to 60 old renters, who occupy and keep the rental property in good condition, with references to the rental income, selection of tenants, and the maintenance of the rented property. 
- **Needs**: It requires rentals, payment and upkeep functions. 
- **Support**: Rental/payment functions Maintenance are required.

### Tenants  
- **Demographics and Interests**: 20 45 Yrs old with families, jobs and students; appreciates communication and convenience. 
- **Needs**: convenience in paying the rent, following up on the problems and viewing lease document. 
- **Support**: Reminder system and the help desk, tenants paying.

### Rental Agencies & Startups 
- **Demographics and Interests**: Multi-properties companies; Multi- Properties companies are interested in knowledge and systemic growth.
- **Needs**: The properties, financial, and occupancy data must be backed up. 
- **Support**: Administration, fact-live and intelligent insights.

---

## 3)	Functionalities 

### All features are divided into an EPIC 
- **Tenant Portal**: Tenants use the portal to pay rent and other fees as well as access lease information. 
- **Landlord Dashboard**: The landlords upkeep, generate income and accept applications.
- **Maintenance Requests**: Complaints are made by tenants, contractors are employed and work monitored by landlords. 
- **Automated Bills**: Late fees and reminders, monthly bills. 
- **History**: Tenant payments and History of tenant property changes Logs of tenant history. 
- **Smart Lock**: Integration Digital simulation of physical access control. 
- **Storage of leasing documents**: Visibility to both the tenant and landlord on document entries. 

---

### Feature Alignment 
- The functions are aligned with the mission to reduce manual work, open and efficient communication . 
- An online tenant gateway will allow tenant to pay rent and access lease. 
- Leases and property/income can be managed using a consolidated dashboard. 
- Online billed amount will be billed after every month regardless of whether the tenant paid or not. 
- Secure the privacy of tenants All tenant records are kept offsite and are available. 
- Each unit is presented in photographs that make units and listings more visible. 
- Both upload and download lease and lease related documents.  


---


## 4) Preliminary Development Plan 
 
### Phase 1: Research and Analysis  
- In the article read about such platforms as Buildium and TenantCloud. 
- Get to know more about common rental problems via Internet search.
- Complete functions depending on the practical requirement and tasks. 
 
### Phase 2: Design
- Layout tenant and landlord pages.
- Keep the design simple, easy to navigate, and available on all devices. 
 
### Phase 3: Development  
- Frontend - React.js   
- Backend - Node.js with Express   
- Database - MySQL   
- Authentication - JWT or OAuth   
- Payment - Stripe or PayPal 
 
### Phase 4: Testing  
- Check if the site is user-friendly.  
- Ensure it loads quickly and runs smoothly.  
- Look for any security issues before launch. 
 
### Phase 5: Launch & Maintenance 
- Deploy to GitHub Pages or Netlify   
- Monitor feedback   
- Apply updates to features on a continuing basis 

---

## References 
### Buildium – Property Management Software
- **Intended to analyze such attributes as rent monitoring, lease processing and maintenance procedures.** 
### TenantCloud – Rental Management Platform
- **Researched and presented its tenant portal, landlord dashboard and billing system.**  
### Stripe API Documentation
- **Applied to the comprehension of the integration of online rent payment and invoice generation.**  
### Accessibility Guidelines 
- **Adhered to so that the site can be accessible to all users including the disabled.** 
### MDN Web Docs – HTML, CSS, and JavaScript
- **Frontend development best practice and responsive design.**  
 








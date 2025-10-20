# Part 3: System Architecture & API Design

## Team Members
- Vishal Nalinbhai Patel  
- Het BhavinKumar Patel  
- Harsh Manishkumar Rana  

---

## 1. System Architecture Overview

**Architecture Style:** 3-Tier Architecture  

**System Architecture Diagram:**  

<img width="482" height="423" alt="image" src="https://github.com/user-attachments/assets/5e839104-4c5f-45f4-9148-0285be62fc22" />

**Components:**

- **Front-end (React App):**  
  Handles user interaction, forms, and API requests using Axios.

- **Back-end (Node.js API):**  
  Processes business logic, authentication, and role-based access control.

- **Database (MySQL/Postgres):**  
  Stores user, property, lease, and payment data.

- **Third-Party APIs:**  
  Used for online rent payments (Stripe), media storage (AWS S3), and alerts (Twilio).

---

## 2. Technology Stack

**Front-end:**  
- React.js  
- Redux (state management)  
- Axios (API calls)  

**Back-end:**  
- Node.js with Express.js  
- JWT for authentication  

**Database:**  
- MySQL  

**Other:**  
- Deployment: AWS  
- Containerization: Docker

  ---

## 3. Authentication & Role-Based Access Control (RBAC):


**Roles:** 
- Admin – Full system control.
- Landlord – Manages properties and responds to tenant requests.
- Tenant – Views properties, submits maintenance requests, makes rent payments.


**Role Permissions for Key Actions:** 
| Action                        | Admin| Landload | Tenant |
|-------------------------------|------|---------|---------|
| Create/Update/Delete Users    |  ✅ |    ❌   |   ❌   |
| Add/Update/Delete Properties  |  ✅ |    ✅   |   ❌   |
| View Properties               |  ✅ |    ✅   |   ✅   |
| Submit Maintenance Requests   |  ✅ |    ✅   |   ✅   |
| Make Rent Payments            |  ✅ |    ✅   |   ✅   

  ---
  
## 4. UML Use Case Diagram: 

<img width="494" height="583" alt="Screenshot 2025-10-20 135807" src="https://github.com/user-attachments/assets/06604916-af94-4050-a792-73305a8de751" />


**Authentication Handling:**

- Registration & Login Flow
  Users register with email, password, and role.
  Passwords are securely hashed before storing.
  Users log in with email/password; system verifies credentials.

- Session Management
  Sessions are managed using JWT tokens or secure cookies.
  Tokens have an expiration time; refresh tokens can extend sessions.

- Role-Based Access Enforcement
  Each user’s role is checked before performing actions.
  Only authorized roles can access specific features (e.g., only Admin can manage users).

- UML & Architecture Diagrams (Required)
  Your documentation must include:
- Use Case Diagram →
  
  <img width="494" height="583" alt="Screenshot 2025-10-20 135807" src="https://github.com/user-attachments/assets/06604916-af94-4050-a792-73305a8de751" />

- Sequence Diagram → at least one showing step-by-step flow (e.g., “User logs in,” “Admin manages content”).

  <img width="771" height="593" alt="Screenshot 2025-10-20 140519" src="https://github.com/user-attachments/assets/a1e9c17d-7e51-4a37-9cba-6bc36731a564" />

- System Architecture Diagram → React ↔ Node.js API ↔ Database ↔ Third-Party APIs.

  <img width="647" height="701" alt="Screenshot 2025-10-20 140614" src="https://github.com/user-attachments/assets/42572184-d2e9-4961-8043-6e72f19f9a04" />

  


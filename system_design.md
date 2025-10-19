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

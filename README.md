# Hospital Management System

A fully functional, enterprise-grade Hospital Management System built entirely from scratch using **Node.js, Vanilla HTML, CSS, and JavaScript**. 

This project was built to demonstrate that a secure, scalable, and modern web application can be created without relying on heavy external frameworks like React, Angular, Express, or ORMs.

## Overview

The system manages the complete lifecycle of hospital operations: from patient registration and doctor encounters to real-time inventory deduction, bed management, and equipment maintenance. It features a strict Role-Based Access Control (RBAC) system to ensure data privacy, alongside a comprehensive audit log for tracking sensitive actions.

## Key Features

### Clinical & Patient Care
*   **Patient Management:** Full CRUD (Create, Read, Update, "Delete"/Discharge) for patient records, including medical alerts for allergies.
*   **Smart Search & Filter:** Search patients by name or Medical Record Number (MRN), and filter by Active or Discharged status.
*   **CSV Export:** Download the entire patient directory as a CSV file for external reporting or data analysis.
*   **Medical Encounters:** Doctors can record visits, including chief complaints, diagnoses, clinical notes, and Vitals (Temp, BP, Pulse, SpO2).
*   **Pharmacy Integration:** When a doctor writes a prescription from the inventory dropdown, the system automatically deducts the medication from the hospital's stock.

### Operations & Infrastructure
*   **Bed Management:** Visual grid of hospital beds. Beds can be assigned to specific patients and are automatically freed up upon discharge.
*   **Asset Tracking:** Track individual pieces of equipment using unique Serial Numbers/Asset Tags (e.g., Wheelchair SN: WC-001).
*   **Inventory Control:** Track consumable medical supplies and medications with automatic low-stock alerts.
*   **Maintenance Ticketing:** Staff can report broken equipment. The system automatically sets the equipment status to "Maintenance" and locks resolved tickets so they cannot be reopened.

### Security & Administration
*   **Authentication:** Secure login using `scrypt` password hashing and database-backed session cookies.
*   **Role-Based Access Control (RBAC):** Strict permission checks for Admins, Doctors, Nurses, Receptionists, and Maintenance staff. UI elements and API routes are blocked based on role.
*   **Staff Management:** Admins can create new user accounts for hospital employees.
*   **Audit Logs:** Every sensitive action (viewing a patient, creating an encounter, discharging a patient) is logged with the user, timestamp, and IP address.
*   **Security Protections:** Custom HTML escaping prevents XSS (Cross-Site Scripting), and parameterized SQL queries prevent SQL Injection.

## Technical Architecture

This project operates on a "Zero Dependency" philosophy:
*   **Backend:** Node.js (v24+). Utilizes the built-in `node:http` for the server, `node:crypto` for security, and `node:sqlite` for the database. No Express, no `better-sqlite3`.
*   **Frontend:** Server-Side Rendering (SSR) using custom JavaScript template literals. No React, no Vue, no Tailwind. 
*   **Database:** Relational SQLite database stored locally. Enables WAL (Write-Ahead Logging) mode for concurrent reads/writes.
*   **Styling:** A custom "Clinical Minimalism" design system built entirely with standard CSS Variables, Flexbox, and Grid.

## Getting Started

### Prerequisites
*   Node.js (v24.0.0 or higher is required for the built-in `node:sqlite` module).

### Installation & Run Commands

Follow these exact commands to run the project locally:

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/hospital-system.git
   cd hospital-system
   npm install
   cp .env.example .env
   npm run seed
   npm run dev
   ```

2. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

## Default Login Credentials & Access Control (RBAC)

To test the security system and verify role restrictions, log in with any of the seeded default accounts. The navigation bar, action buttons, and accessible pages adapt dynamically based on the permissions of each role.

### 🔑 Default Credentials

| Role | Username | Password | Full Name | Primary Responsibilities |
| :--- | :--- | :--- | :--- | :--- |
| **Admin** | `admin` | `admin123` | System Administrator | Full system administration, staff user accounts, and security audit logs |
| **Doctor** | `dr_smith` | `doctor123` | Dr. John Smith | Patient clinical evaluations, medical encounters, and prescription management |
| **Nurse** | `nurse_joy` | `nurse123` | Joy Williams | Patient vital signs, encounter reviews, and inventory stock adjustments |
| **Receptionist** | `reception1` | `recep123` | Sarah Connor | Patient onboarding, directory searches, and bed assignment checks |
| **Maintenance** | *(Create via Admin)* | *(Set by Admin)* | Maintenance Staff | Equipment repairs, status updates, and maintenance ticketing workflow |

---

### 🛡️ Role Access Matrix

| Feature / Module | Route(s) | Admin | Doctor | Nurse | Receptionist | Maintenance |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: |
| **Dashboard** | `/dashboard` | ✅ Full | ✅ Full | ✅ Full | ✅ Full | ✅ Full |
| **Patient Directory & CSV Export** | `/patients`, `/patients/export` | ✅ Allowed | ✅ Allowed | ✅ Allowed | ✅ Allowed | ❌ Blocked |
| **Register New Patient** | `/patients/new` | ✅ Allowed | ✅ Allowed | ❌ Blocked | ✅ Allowed | ❌ Blocked |
| **Edit Patient & Bed Assignment** | `/patients/:id/edit`, `/assign-bed` | ✅ Allowed | ✅ Allowed | ✅ Allowed | ✅ Allowed | ❌ Blocked |
| **Create Medical Encounter & Rx** | `/patients/:id/encounters/new` | ✅ Allowed | ✅ Allowed | ❌ Blocked | ❌ Blocked | ❌ Blocked |
| **View Medical Encounters & Vitals** | `/patients/:id` | ✅ Allowed | ✅ Allowed | ✅ Allowed | ❌ Blocked | ❌ Blocked |
| **Infrastructure (Beds & Equipment)** | `/infrastructure` | ✅ Manage | 👁️ View Only | 👁️ View Only | 👁️ View Only | ✅ Manage |
| **Add New Beds & Equipment** | `/infrastructure/beds/new`, `.../equipment/new` | ✅ Allowed | ❌ Blocked | ❌ Blocked | ❌ Blocked | ✅ Allowed |
| **Inventory Supplies & Stocks** | `/inventory`, `/inventory/new`, `.../update` | ✅ Full CRUD | 👁️ View Only | ✅ Update Stock | ❌ Blocked | ✅ Update Stock |
| **Maintenance Ticketing** | `/maintenance`, `/maintenance/new`, `.../status` | ✅ Full CRUD | ➕ Report Issue | ➕ Report Issue | ❌ Blocked | ✅ Resolve Tickets |
| **Audit Log Viewer** | `/audit` | ✅ Full Access | 👁️ View Only | ❌ Blocked | ❌ Blocked | ❌ Blocked |
| **Staff & User Management** | `/users`, `/users/new` | ✅ Full Access | ❌ Blocked | ❌ Blocked | ❌ Blocked | ❌ Blocked |

> [!NOTE]
> Attempting to manually navigate to an unauthorized URL (e.g. logging in as `reception1` and navigating to `/audit` or `/users`) will be immediately intercepted by the RBAC middleware and blocked with an **HTTP 403 Forbidden** status.




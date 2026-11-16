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
*   **Database:** Relational SQLite database stored locally. 
*   **Styling:** A custom "Clinical Minimalism" design system built entirely with standard CSS Variables, Flexbox, and Grid.

## Getting Started

### Prerequisites
*   Node.js (v24.0.0 or higher is required for the built-in `node:sqlite` module).

### Installation

npm install
cp .env.example .env
npm run seed
npm run dev
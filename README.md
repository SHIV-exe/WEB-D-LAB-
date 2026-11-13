# Hospital Management System

A web-based hospital management system built strictly with Node.js, HTML, CSS, and Vanilla JavaScript.

## 🛠️ Tech Stack & Rules
- **Backend:** Node.js (v24+) using built-in `node:http` and `node:sqlite`.
- **Frontend:** Server-rendered HTML (using custom template literals) + Vanilla CSS/JS.
- **Database:** SQLite (file located at `./data/hospital.db`).
- **Constraints:** NO React, NO Vue, NO external frameworks, NO ORMs. Parameterized SQL only.
- **Security:** `scrypt` for password hashing, `crypto.timingSafeEqual` for verification, custom HTML escaping to prevent XSS, RBAC permissions.

## 📂 Project Structure
- `src/` - Application code (routes, db, views, auth, lib)
- `public/` - Static files (CSS, JS, images)
- `data/` - SQLite database files (gitignored)

## ✅ Progress Checklist
- [x] 1-15. Setup, DB, Auth, Router, Layout
- [x] 16-21. Dashboard & CSS
- [x] 22-27. Patient Directory, Registration, Profiles & Encounters
- [x] 28-33. Infrastructure, Inventory, Maintenance & RBAC
- [x] 34-36. Audit Logs & Staff Management
- [x] 37. Patient Search
- [x] 38. Database Backups
- [x] 39. Patient CRUD (Edit Profile & Discharge)
- [ ] 40. **Next up...**

## 📝 Notes for AI Assistant
If you are an AI reading this in a new chat:
1. Review the "Tech Stack & Rules". **Do not suggest external packages**.
2. Check the "Progress Checklist" to see what is next.
3. We are building one file at a time. Provide full code, then line-by-line explanation.
4. **Current Context:** Full Patient CRUD is complete. We used `ALTER TABLE` to add `is_active` to patients.
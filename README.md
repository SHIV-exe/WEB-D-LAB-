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
- [x] 16-17. Dashboard UI & CSS
- [x] 18-21. Auth Routes, Login UI & Flow
- [x] 22-25. Patient Directory, Registration & Profiles
- [x] 26-27. Medical Encounters (Doctor Visits)
- [x] 28-30. Infrastructure (Beds & Equipment)
- [x] 31-33. Inventory & Role-Based Access Control (RBAC)
- [ ] 34. `src/routes/dashboard.routes.js` (Fetch live alerts) **<-- WE ARE HERE**
- [ ] 35. `src/views/dashboard/index.js` (Display recent visits & alerts)
- [ ] 36. `server.js` (Complete update)

## 📝 Notes for AI Assistant
If you are an AI reading this in a new chat:
1. Review the "Tech Stack & Rules". **Do not suggest external packages**.
2. Check the "Progress Checklist" to see what is next.
3. We are building one file at a time. Provide full code, then line-by-line explanation.
4. **Current Context:** All core features (Patients, Encounters, Infrastructure, Inventory, RBAC) are complete. We are upgrading the Dashboard to show live alerts and recent activity.
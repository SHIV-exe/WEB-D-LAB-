-- src/db/schema.sql

-- Enforce foreign key constraints (SQLite turns this off by default!)
PRAGMA foreign_keys = ON;

-- 1. USERS & AUTHENTICATION
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    password_salt TEXT NOT NULL,
    role TEXT NOT NULL CHECK(role IN ('admin', 'doctor', 'nurse', 'reception', 'maintenance')),
    full_name TEXT NOT NULL,
    is_active INTEGER DEFAULT 1, -- 1 = true, 0 = false
    created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY, -- A random UUID string
    user_id INTEGER NOT NULL,
    csrf_token TEXT NOT NULL,
    expires_at TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 2. PATIENTS & MEDICAL RECORDS
CREATE TABLE IF NOT EXISTS patients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    mrn TEXT UNIQUE NOT NULL, -- Medical Record Number
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    dob TEXT,
    sex TEXT,
    phone TEXT,
    address TEXT,
    emergency_contact TEXT,
    allergies TEXT,
    is_active INTEGER DEFAULT 1, -- 1 = active, 0 = discharged
    created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS encounters (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    patient_id INTEGER NOT NULL,
    doctor_id INTEGER NOT NULL,
    started_at TEXT DEFAULT (datetime('now')),
    status TEXT DEFAULT 'open' CHECK(status IN ('open', 'closed')),
    chief_complaint TEXT,
    diagnosis TEXT,
    notes TEXT,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE RESTRICT,
    FOREIGN KEY (doctor_id) REFERENCES users(id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS vitals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    encounter_id INTEGER NOT NULL,
    recorded_by INTEGER NOT NULL,
    recorded_at TEXT DEFAULT (datetime('now')),
    temperature REAL,
    bp_systolic INTEGER,
    bp_diastolic INTEGER,
    pulse INTEGER,
    resp_rate INTEGER,
    spo2 INTEGER,
    FOREIGN KEY (encounter_id) REFERENCES encounters(id) ON DELETE CASCADE,
    FOREIGN KEY (recorded_by) REFERENCES users(id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS prescriptions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    encounter_id INTEGER NOT NULL,
    drug_name TEXT NOT NULL,
    dose TEXT NOT NULL,
    route TEXT,
    frequency TEXT,
    start_date TEXT,
    end_date TEXT,
    prescribed_by INTEGER NOT NULL,
    FOREIGN KEY (encounter_id) REFERENCES encounters(id) ON DELETE CASCADE,
    FOREIGN KEY (prescribed_by) REFERENCES users(id) ON DELETE RESTRICT
);

-- 3. INFRASTRUCTURE & HOSPITAL OPERATIONS
CREATE TABLE IF NOT EXISTS beds (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ward TEXT NOT NULL,
    room TEXT NOT NULL,
    bed_number TEXT NOT NULL,
    status TEXT DEFAULT 'available' CHECK(status IN ('available', 'occupied', 'maintenance')),
    patient_id INTEGER,
    updated_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE SET NULL,
    UNIQUE(ward, room, bed_number)
);

CREATE TABLE IF NOT EXISTS equipment (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    serial_number TEXT,
    category TEXT,
    location TEXT,
    status TEXT DEFAULT 'working' CHECK(status IN ('working', 'broken', 'maintenance')),
    last_service TEXT,
    next_service TEXT,
    notes TEXT
);

CREATE TABLE IF NOT EXISTS maintenance_tickets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    equipment_id INTEGER NOT NULL,
    reported_by INTEGER NOT NULL,
    issue TEXT NOT NULL,
    priority TEXT DEFAULT 'normal' CHECK(priority IN ('low', 'normal', 'high', 'urgent')),
    status TEXT DEFAULT 'open' CHECK(status IN ('open', 'in_progress', 'resolved')),
    created_at TEXT DEFAULT (datetime('now')),
    resolved_at TEXT,
    FOREIGN KEY (equipment_id) REFERENCES equipment(id) ON DELETE CASCADE,
    FOREIGN KEY (reported_by) REFERENCES users(id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS inventory (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    item_name TEXT NOT NULL,
    category TEXT,
    quantity INTEGER DEFAULT 0,
    unit TEXT,
    reorder_level INTEGER DEFAULT 10,
    location TEXT,
    expiry_date TEXT
);

-- 4. SECURITY AUDIT LOG
CREATE TABLE IF NOT EXISTS audit_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    action TEXT NOT NULL,
    entity TEXT NOT NULL,
    entity_id INTEGER,
    timestamp TEXT DEFAULT (datetime('now')),
    ip_address TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT
);